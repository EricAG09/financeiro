# Testes de integração

Vazio até a Etapa 2. Estes testes só fazem sentido com um banco real —
preferencialmente um Supabase local (`npx supabase start`), nunca o de produção.

## Testes de RLS (obrigatórios)

São a verificação mais importante do projeto e **bloqueiam** a liberação para
qualquer usuário externo. Para cada tabela com `user_id`, com dois usuários de
teste distintos:

| Cenário                                          | Resultado esperado         |
| ------------------------------------------------ | -------------------------- |
| Usuário A lê as próprias linhas                  | Retorna                    |
| Usuário A lê linhas do usuário B                 | Zero linhas — **não** erro |
| Usuário A insere linha com `user_id` do B        | Recusado                   |
| Usuário A atualiza linha do B                    | Zero linhas afetadas       |
| Usuário A apaga linha do B                       | Zero linhas afetadas       |
| Role `anon` acessa qualquer tabela               | Recusado                   |
| Lançamento apontando para conta de outro usuário | Recusado pelo trigger      |
| `audit_logs`: usuário tenta inserir              | Recusado                   |

Um `select` que devolve zero linhas em vez de erro é o comportamento correto de
RLS — o teste precisa afirmar exatamente isso, não apenas "não deu erro".

## Testes de autenticação

- sessão expirada é renovada pelo `proxy.ts`;
- rota protegida sem sessão redireciona para `/entrar`;
- `getUser()` recusa cookie adulterado;
- mensagem de erro não revela se o e-mail existe na base.

## Testes do agente de IA

- nenhuma ferramenta com `mutates: true` (já coberto em
  `tests/unit/ai-tools.test.ts`);
- entrada inválida é rejeitada antes de tocar o banco;
- o contexto enviado ao modelo não contém identificadores nem dado bruto.

## Como rodar (quando existirem)

```bash
npx supabase start
npx supabase db push
npm run test
```
