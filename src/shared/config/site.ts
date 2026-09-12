export const siteConfig = {
  name: "Finance AI",
  shortName: "Finance AI",
  description:
    "Controle financeiro pessoal: saldos, despesas, metas e planejamento — com assistente de IA.",
  locale: "pt-BR",
  currency: "BRL",
  timeZone: "America/Fortaleza",
  themeColor: {
    light: "#ffffff",
    dark: "#0b0f14",
  },
} as const;

export type SiteConfig = typeof siteConfig;
