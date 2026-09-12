/**
 * Tradução de erros de autenticação para mensagens seguras.
 *
 * Regras (docs/security/security-model.md):
 * - nunca devolver stack trace ao cliente;
 * - nunca revelar se um e-mail existe na base (enumeração de usuários);
 * - mensagens genéricas e acionáveis.
 */

export type AuthFailure =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "rate_limited"
  | "weak_password"
  | "not_configured"
  | "unknown";

const MESSAGES: Record<AuthFailure, string> = {
  invalid_credentials: "E-mail ou senha incorretos.",
  email_not_confirmed: "Confirme seu e-mail para continuar.",
  rate_limited: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  weak_password: "Escolha uma senha mais forte.",
  not_configured: "Serviço indisponível no momento.",
  unknown: "Não foi possível concluir a operação. Tente novamente.",
};

export function authFailureMessage(failure: AuthFailure): string {
  return MESSAGES[failure];
}

/** Mapeia o código do Supabase Auth para uma falha conhecida. */
export function toAuthFailure(code: string | undefined): AuthFailure {
  switch (code) {
    case "invalid_credentials":
    case "invalid_grant":
      return "invalid_credentials";
    case "email_not_confirmed":
      return "email_not_confirmed";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "rate_limited";
    case "weak_password":
      return "weak_password";
    default:
      return "unknown";
  }
}
