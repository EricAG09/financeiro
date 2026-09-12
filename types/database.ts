/**
 * Tipos do banco Supabase.
 *
 * ⚠️ PLACEHOLDER — as credenciais do Supabase ainda não foram fornecidas e
 * nenhuma migration foi aplicada. Este arquivo será SUBSTITUÍDO integralmente
 * pela geração automática assim que o projeto Supabase existir:
 *
 *   npx supabase gen types typescript --project-id <id> > types/database.ts
 *
 * Até então ele existe apenas para que `SupabaseClient<Database>` seja tipado e
 * o restante do código compile sem `any`. Não adicione tabelas aqui à mão:
 * a modelagem de referência vive em docs/database/schema.md.
 */

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
