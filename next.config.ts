import type { NextConfig } from "next";

/**
 * Cabeçalhos de segurança aplicados a todas as respostas.
 *
 * A Content-Security-Policy NÃO está aqui: ela é gerada por requisição no
 * middleware, com nonce. Ver middleware.ts e docs/security/security-model.md.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Não anunciar o framework nem a versão.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // O service worker não pode ser cacheado, senão a política de cache
        // antiga sobrevive a um deploy.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
