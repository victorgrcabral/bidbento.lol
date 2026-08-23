import { Language } from "@/lib/i18n";

type CategoryDefinition = {
  key: string;
  labels: Record<Language, string>;
};

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { key: "Developer Tools", labels: { en: "Developer Tools", es: "Herramientas Dev", pt: "Developer Tools" } },
  { key: "SaaS", labels: { en: "SaaS", es: "SaaS", pt: "SaaS" } },
  { key: "IA / Machine Learning", labels: { en: "AI and Machine Learning", es: "IA y Machine Learning", pt: "IA e Machine Learning" } },
  { key: "Design & UI", labels: { en: "Design and UI", es: "Diseño y UI", pt: "Design e UI" } },
  { key: "Fintech", labels: { en: "Fintech", es: "Fintech", pt: "Fintech" } },
  { key: "Crypto / Web3", labels: { en: "Crypto and Web3", es: "Cripto y Web3", pt: "Crypto e Web3" } },
  { key: "Produtividade", labels: { en: "Productivity", es: "Productividad", pt: "Produtividade" } },
  { key: "E-commerce", labels: { en: "Ecommerce", es: "Comercio electrónico", pt: "Ecommerce" } },
  { key: "Indústria", labels: { en: "Industry", es: "Industria", pt: "Indústria" } },
  { key: "Mineração", labels: { en: "Mining", es: "Minería", pt: "Mineração" } },
  { key: "Energia", labels: { en: "Energy", es: "Energía", pt: "Energia" } },
  { key: "Saúde", labels: { en: "Healthcare", es: "Salud", pt: "Saúde" } },
  { key: "Educação", labels: { en: "Education", es: "Educación", pt: "Educação" } },
  { key: "Marketing", labels: { en: "Marketing", es: "Marketing", pt: "Marketing" } },
  { key: "Serviços", labels: { en: "Services", es: "Servicios", pt: "Serviços" } },
  { key: "Varejo", labels: { en: "Retail", es: "Comercio minorista", pt: "Varejo" } },
  { key: "Imobiliário", labels: { en: "Real Estate", es: "Inmobiliario", pt: "Imobiliário" } },
  { key: "Turismo", labels: { en: "Travel", es: "Turismo", pt: "Turismo" } },
  { key: "Outros", labels: { en: "Other", es: "Otros", pt: "Outros" } },
];

export function getCategoryOptions(language: Language, includeAll = false) {
  const categories = CATEGORY_DEFINITIONS.map(({ key, labels }) => ({
    key,
    label: labels[language],
  }));

  return includeAll
    ? [{ key: "all", label: language === "es" ? "Todos" : language === "pt" ? "Todos" : "All" }, ...categories]
    : categories;
}
