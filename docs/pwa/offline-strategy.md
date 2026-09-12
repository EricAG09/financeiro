# PWA e estratégia offline

## Decisão: service worker escrito à mão

Sem `next-pwa`, sem `serwist`. Em um app financeiro a política de cache precisa
ser lida linha a linha e auditada por qualquer pessoa que revise o repositório.
Biblioteca genérica de cache otimiza para "funcionar offline", que não é o
objetivo aqui — o objetivo é **não guardar dado financeiro no dispositivo**.

O arquivo é [`public/sw.js`](../../public/sw.js), com menos de 130 linhas.

## O que entra em cache

| Recurso                                     | Estratégia                                     | Motivo                                  |
| ------------------------------------------- | ---------------------------------------------- | --------------------------------------- |
| `/_next/static/*`, `/icons/*`, fontes       | Cache-first                                    | Versionados e imutáveis                 |
| `/offline`, `/manifest.webmanifest`         | Precache na instalação                         | Shell mínimo                            |
| Navegação (páginas do app)                  | **Network-only**, com fallback para `/offline` | A página pode conter valores do usuário |
| `/api/*`, `/auth/*`, `/assistente`          | **Nunca**                                      | Dado sensível                           |
| Qualquer origem externa, inclusive Supabase | **Nunca**                                      | Passa direto pela rede                  |
| Qualquer requisição que não seja `GET`      | **Nunca**                                      | —                                       |

A resposta de navegação não é armazenada. Ficar offline significa ver a página
`/offline`, que é estática e não contém nada do usuário — não uma versão antiga
do seu saldo.

## Por que não cachear os dados

Saldo em cache é saldo errado. O usuário abre o app no metrô, vê R$ 4.200 de
ontem, decide gastar, e o valor real era outro. O custo de errar aqui é maior que
a conveniência de mostrar algo.

Quando a conexão cai, `OfflineBanner` avisa explicitamente que os valores em tela
podem estar desatualizados.

## Limpeza no logout

`purgeServiceWorkerCaches()` (em
[`service-worker-registrar.tsx`](../../components/pwa/service-worker-registrar.tsx))
manda `PURGE_CACHES` ao service worker, que apaga todos os caches. Deve ser
chamado no logout, quando ele existir — nada do usuário anterior sobrevive no
aparelho.

`/sw.js` é servido com `no-store` (`next.config.ts`), para que uma política de
cache antiga não sobreviva a um deploy.

## Fila local para rascunhos (futuro, não implementado)

Uma fila offline é aceitável **apenas** para operações não sensíveis: o rascunho
de um lançamento que o usuário digitou sem conexão. Condições para implementar:

- guardar apenas o que o usuário acabou de digitar, nunca o que veio do servidor;
- deixar claro na UI que é rascunho, não lançamento confirmado;
- sincronizar com validação completa no servidor;
- limpar no logout, junto com os caches.

Sincronizar saldo, extrato ou qualquer leitura continua fora de cogitação.

## Instalação

- **Manifest**: [`app/manifest.ts`](../../app/manifest.ts), servido em
  `/manifest.webmanifest` — `display: standalone`, `orientation: portrait`,
  `lang: pt-BR`, `theme_color` e `background_color` no azul escuro da marca.
- **Ícones**: gerados por `npm run generate:icons`
  ([`scripts/generate-icons.mjs`](../../scripts/generate-icons.mjs), sem
  dependências) — 192, 512, maskable 512 e apple-touch 180.
- **Android / Chromium**: `useInstallPrompt()` captura `beforeinstallprompt` e
  expõe `promptInstall()`.
- **iOS**: não existe `beforeinstallprompt`. A instalação é manual, por
  _Compartilhar → Adicionar à Tela de Início_. O hook separa `canInstall` de
  `isStandalone` justamente para a UI **instruir** no iOS em vez de prometer um
  botão que não existe. `apple-mobile-web-app-*` e o ícone de 180px já estão
  configurados.
- **Viewport**: `viewport-fit: cover` com `safe-top` / `safe-bottom`; zoom
  liberado até 5x.

## Registro

O service worker só é registrado em produção
([`ServiceWorkerRegistrar`](../../components/pwa/service-worker-registrar.tsx)).
Em desenvolvimento, um SW ativo mascara alteração de código e atrapalha o
diagnóstico.

## Como verificar

```bash
npm run build && npm run start
```

No Chrome DevTools → Application: _Manifest_ sem erro, _Service Workers_ ativo,
_Cache Storage_ contendo apenas shell e estáticos. Em _Lighthouse_, a auditoria
de PWA deve passar. Pelo iPhone, instalar pela folha de compartilhamento e
confirmar que abre em tela cheia.
