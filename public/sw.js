/* eslint-disable */
/**
 * Finance AI — Service Worker
 * ---------------------------------------------------------------------------
 * Escrito à mão, sem biblioteca, por decisão explícita: em um app financeiro a
 * política de cache precisa ser legível e auditável linha a linha.
 * Ver docs/pwa/offline-strategy.md.
 *
 * Princípio central: NENHUM dado financeiro é gravado em cache.
 * Só entram no cache recursos estáticos e públicos (shell, ícones, assets).
 */

const VERSION = "v1";
const SHELL_CACHE = `finance-ai-shell-${VERSION}`;
const ASSET_CACHE = `finance-ai-assets-${VERSION}`;
const OFFLINE_URL = "/offline";

/** Rotas e prefixos que JAMAIS podem ser cacheados. */
const NEVER_CACHE = [
  "/api/",
  "/auth/",
  "/assistente",
  "/rest/v1/",
  "/auth/v1/",
  "/functions/v1/",
];

const SHELL_ASSETS = [OFFLINE_URL, "/manifest.webmanifest", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== ASSET_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/**
 * Limpa todo o cache. Disparado no logout pelo cliente, para que nada do
 * usuário anterior sobreviva no dispositivo.
 */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "PURGE_CACHES") {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))));
  }
});

function isNeverCached(url) {
  return NEVER_CACHE.some((prefix) => url.pathname.startsWith(prefix));
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:css|js|woff2?|png|svg|webp|ico)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Só GET entra em qualquer estratégia de cache.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Requisições cross-origin (inclusive Supabase) passam direto pela rede.
  if (url.origin !== self.location.origin) return;

  if (isNeverCached(url)) return;

  // Estáticos versionados: cache-first, são imutáveis.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      }),
    );
    return;
  }

  // Navegação: network-only com fallback para a página offline.
  // A resposta NÃO é cacheada — páginas do app podem conter dados do usuário.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((cached) => cached ?? Response.error()),
      ),
    );
  }
});
