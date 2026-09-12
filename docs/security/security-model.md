# Modelo de segurança

## Premissa

O frontend não é uma camada de autorização. Ele pode ser lido, modificado e
reexecutado por quem quiser. Toda decisão sobre _quem pode ver ou alterar o quê_
acontece no Postgres, via Row Level Security.

Tudo que o cliente faz — esconder botão, redirecionar rota, desabilitar campo —
é experiência de uso. Se essas proteções falharem por completo, o banco ainda
precisa recusar.

## Autorização: RLS

Regras aplicadas desde a primeira migration:

- toda tabela de dado de usuário tem `user_id uuid references auth.users(id) on
delete cascade`;
- `alter table ... enable row level security` está na **mesma migration** que cria
  a tabela;
- policies usam `(select auth.uid()) = user_id` — a subquery faz o Postgres
  avaliar uma vez por consulta em vez de uma vez por linha;
- policies são separadas por operação (`select`, `insert`, `update`, `delete`),
  nunca uma policy `for all` genérica;
- `revoke all ... from anon` é explícito: a role anônima não alcança dado de
  usuário;
- `audit_logs` não tem policy de escrita — só o servidor grava.

Chaves estrangeiras não bastam: um usuário poderia apontar um lançamento para a
conta de outro. Por isso `transactions` tem um trigger que confirma que a conta e
a categoria referenciadas pertencem ao mesmo dono.

## Autenticação

Supabase Auth, com sessão em cookie.

- **Sempre `getUser()`**, nunca `getSession()`, para qualquer decisão. `getSession()`
  apenas lê o cookie, que o cliente controla; `getUser()` valida o token no
  servidor de auth.
- A renovação de sessão acontece em `proxy.ts` a cada requisição.
- `lib/auth/guards.ts#requireUser` redireciona quem não tem sessão — é UX, e o
  comentário no arquivo diz isso explicitamente.
- Mensagens de erro nunca revelam se um e-mail existe na base
  (`lib/auth/errors.ts`). Enumeração de usuário é vazamento.
- Senha mínima de 12 caracteres em `schemas/auth.ts`.
- MFA e OAuth entram depois, pela configuração do Supabase — a arquitetura não
  precisa mudar.

## Segredos

| Variável                        | Onde vive                | Exposta ao browser      |
| ------------------------------- | ------------------------ | ----------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `.env.local`             | sim (por design)        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local`             | sim (protegida por RLS) |
| `SUPABASE_SERVICE_ROLE_KEY`     | `.env.local`, servidor   | **nunca**               |
| `AI_API_KEY`                    | servidor / Edge Function | **nunca**               |

Defesas em camadas:

1. `config/env.ts` separa `publicEnv` de `serverEnv()`; a segunda lança erro se
   for lida no browser.
2. `lib/supabase/admin.ts` e `lib/ai/registry.ts` importam `server-only` — o build
   quebra se um Client Component os alcançar.
3. O ESLint bloqueia `@/lib/supabase/admin` e o símbolo `serverEnv` em
   `components/**` e `hooks/**`.
4. `.gitignore` cobre `.env*` exceto `.env.example`, que não contém valores.

A service role key ignora RLS. Só existe para rotina administrativa de servidor,
e toda operação feita com ela deve gerar registro em `audit_logs`.

## Validação de entrada

Os schemas em `schemas/` são a fronteira de confiança e rodam **nas duas pontas**.
O mesmo objeto Zod valida o formulário e o payload no servidor; validação no
cliente é conveniência, a do servidor é a que conta.

- valores monetários: inteiro, positivo, com teto (`lib/validation/primitives.ts`);
- datas: `YYYY-MM-DD` verificado por regex e por `Date.parse`;
- texto: `trim` e limite de tamanho antes de chegar ao banco;
- conversão de moeda digitada pelo usuário: `parseCurrencyToCents`, que rejeita
  em vez de adivinhar.

## Cabeçalhos e CSP

`next.config.ts` aplica em todas as respostas:

`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
`Permissions-Policy` (câmera, microfone e geolocalização desligados),
`Strict-Transport-Security`, `Cross-Origin-Opener-Policy`.

A CSP é gerada por requisição em `proxy.ts`, com nonce e `strict-dynamic`. Em
desenvolvimento ela libera `unsafe-eval`, necessário para o hot reload; em
produção, não. `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` e
`form-action 'self'` fecham as vias clássicas de injeção e clickjacking.

`style-src` mantém `'unsafe-inline'`: o Tailwind injeta estilo em runtime e não há
como assinar esses `<style>` com nonce hoje. É a única concessão, e vale para
estilo, não para script.

## XSS

- `react/no-danger` está como **erro** no ESLint: nada de `dangerouslySetInnerHTML`.
- Resposta do modelo de IA é renderizada como texto puro
  (`components/assistant/assistant-message.tsx`). Conteúdo gerado por LLM é
  entrada não confiável como qualquer outra.
- Nenhum HTML de terceiro é interpolado em página.

## Erros

- O usuário vê mensagem genérica e acionável (`components/ui/error-state.tsx`).
- `app/error.tsx` registra apenas o `digest` do erro; stack trace fica no
  servidor.
- Erro de autenticação é traduzido por `lib/auth/errors.ts`, sem revelar detalhe
  interno.

## Auditoria

`audit_logs` é append-only: o usuário lê a própria trilha, ninguém altera ou
apaga pela API. Vão para lá as operações sensíveis — mudança de dado financeiro
por rotina administrativa, ações confirmadas a partir de recomendação da IA,
alterações de segurança da conta.

## O que ainda falta

Itens reconhecidos e pendentes de etapas futuras, listados aqui para não se
perderem:

- **Rate limiting** nas rotas de autenticação e no endpoint do assistente.
  O Supabase Auth já limita envio de e-mail; a camada da aplicação ainda não.
- **Testes automatizados de RLS** (`tests/integration/`), obrigatórios antes de
  qualquer usuário externo.
- **CSRF**: hoje não há Server Action mutável. Quando houver, revisar a proteção
  nativa do Next e os cookies `SameSite`.
- **MFA**, quando houver mais de um usuário.
- **Revisão de CSP** para remover `'unsafe-inline'` de `style-src`, se o Tailwind
  passar a permitir.
