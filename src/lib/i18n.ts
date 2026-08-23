export type Language = "en" | "es" | "pt";

export interface TranslationDict {
  // Navigation & General
  loading: string;
  claimSpace: string;
  boost: string;
  ranking: string;
  rules: string;
  stats: string;
  liveOnline: (count: number) => string;
  visitorsSinceLaunch: (count: string) => string;
  seeStats: string;
  secureCheckout: string;
  backToHome: string;
  emptyTitle: string;
  emptyDesc: string;
  claimNow: string;
  leaderBadge: string;
  rankBadge: string;

  // Categories
  categories: {
    all: string;
    devTools: string;
    saas: string;
    ai: string;
    design: string;
    fintech: string;
    crypto: string;
    productivity: string;
    ecommerce: string;
    other: string;
  };

  // Hover Card
  screenShare: string;
  pageShare: string;
  realClicks: string;
  totalInvested: string;
  lastBoost: string;
  visitWebsite: string;
  boostBrand: string;

  // Bottom Bar Copies
  copyLeader: (name: string, percentage: number) => string;
  copyClicks: (count: string) => string;
  copyLastBid: (name: string, amount: string, time: string) => string;
  copyStartingFrom: string;
  copyAntiDilution: string;
  copyFairness: string;
  totalBids: string;

  // Purchase Modal & Checkout
  modalTitle: string;
  modalDesc: string;
  projectionTitle: string;
  projectedRank: (rank: number) => string;
  ofTheScreen: string;
  domainExistsNote: (name: string, current: string) => string;
  investmentAmount: string;
  orCustomAmount: string;
  brandName: string;
  brandNamePlaceholder: string;
  websiteUrl: string;
  websiteUrlPlaceholder: string;
  categoryLabel: string;
  taglineLabel: string;
  taglinePlaceholder: string;
  logoLabel: string;
  chooseFile: string;
  orLogoUrl: string;
  brandColorLabel: string;
  customColorToggle: string;
  paletteToggle: string;
  payAndClaim: (amount: string) => string;
  processing: string;
  uploadingImage: string;
  cardPreviewTitle: string;
  projectedShare: string;
  instantActivation: string;
  instantActivationDesc: string;
  requiredFieldsError: string;
  minAmountError: string;

  // Boost Modal
  boostTitle: (name: string) => string;
  newDominance: string;
  currentShare: (pct: number) => string;
  newTotalAccumulated: (val: string) => string;
  chooseBoostAmount: string;
  applyBoostBtn: (amount: string) => string;

  // Leaderboard
  leaderboardTitle: string;
  leaderboardDesc: (count: number) => string;
  ofThePage: string;

  // Stats Page
  statsTitle: string;
  statsHeroSubtitle: string;
  liveVisitorsNow: string;
  totalPageViews: string;
  avgTimeOnPage: string;
  conversionRateLabel: string;
  trafficChannels: string;
  topPages: string;
  trafficGrowth: string;
  directTraffic: string;
  organicSearch: string;
  socialTraffic: string;
  referralTraffic: string;

  // Toast
  spacePurchasedToast: (domain: string) => string;
  boostAppliedToast: string;

  // Rules Page
  rulesTitle: string;
  rulesSubtitle: string;
  rulesHeroTitle: string;
  rulesHeroDesc: string;
  rule1Title: string;
  rule1Desc: string;
  rule1Formula: string;
  rule2Title: string;
  rule2Min: string;
  rule2Grouping: string;
  rule2Dilution: string;
  rule3Title: string;
  rule3Intro: string;
  rule3Item1: string;
  rule3Item2: string;
  rule3Item3: string;
  rule3Item4: string;
  rule3Warning: string;
  rule4Title: string;
  rule4Desc: string;
  faqTitle: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;
  rulesCta: string;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    loading: "LOADING BIDBENTO.LOL...",
    claimSpace: "Claim your Bento",
    boost: "Boost",
    ranking: "Ranking",
    rules: "Rules",
    stats: "Analytics",
    liveOnline: (count) => `${count} online`,
    visitorsSinceLaunch: (count) => `${count} visitors since launch`,
    seeStats: "see stats →",
    secureCheckout: "Secure Checkout",
    backToHome: "Back to bidbento.lol",
    emptyTitle: "The screen is empty",
    emptyDesc: "Be the first brand to conquer 100% of the screen on bidbento.lol for just $1.00!",
    claimNow: "Claim your Bento for $1.00",
    leaderBadge: "Leader",
    rankBadge: "Rank",

    categories: {
      all: "All",
      devTools: "Developer Tools",
      saas: "SaaS",
      ai: "AI / Machine Learning",
      design: "Design & UI",
      fintech: "Fintech",
      crypto: "Crypto / Web3",
      productivity: "Productivity",
      ecommerce: "E-commerce",
      other: "Other",
    },

    screenShare: "Screen Share",
    pageShare: "Page Share",
    realClicks: "Real Clicks",
    totalInvested: "Total Invested",
    lastBoost: "Last Boost",
    visitWebsite: "Visit Website",
    boostBrand: "Boost",

    copyLeader: (name, percentage) => `⚡ ${name} dominates ${percentage}% of the screen. Claim your bento now!`,
    copyClicks: (count) => `👀 Over ${count} verified clicks generated for brands on screen.`,
    copyLastBid: (name, amount, time) => `🔥 Latest bid: ${name} added +${amount} (${time}).`,
    copyStartingFrom: "💡 From $1.00 your brand gets instant worldwide visibility on bidbento.lol.",
    copyAntiDilution: "🛡️ Don't get diluted! Secure your visual territory on bidbento.lol.",
    copyFairness: "💎 A fairer canvas: smaller budgets can conquer pages 2 & 3 with high visibility and full control over their ROI.",
    totalBids: "Total Pool",

    modalTitle: "Claim your Bento",
    modalDesc: "Compete for visual dominance and drive direct traffic to your project.",
    projectionTitle: "Real-Time Dominance Projection",
    projectedRank: (rank) => `Rank #${rank}`,
    ofTheScreen: "of total screen real estate on bidbento.lol!",
    domainExistsNote: (name, current) => `Existing domain (${name}). This bid will be added to your current ${current}!`,
    investmentAmount: "Investment Amount",
    orCustomAmount: "Or enter another amount...",
    brandName: "Brand / SaaS Name *",
    brandNamePlaceholder: "e.g. Supabase, Linear...",
    websiteUrl: "Website / Target URL *",
    websiteUrlPlaceholder: "https://yourbrand.com",
    categoryLabel: "Category / Sector *",
    taglineLabel: "Short Tagline / Slogan",
    taglinePlaceholder: "e.g. The modern database for Next.js",
    logoLabel: "Logo (File Upload or URL)",
    chooseFile: "Choose image (PNG, JPEG, SVG...)",
    orLogoUrl: "Or paste direct image URL...",
    brandColorLabel: "Brand Highlight Color",
    customColorToggle: "Custom Color (HEX/RGB/CMYK)",
    paletteToggle: "Use Preset Palette",
    payAndClaim: (amount) => `Claim your Bento for ${amount}`,
    processing: "Processing...",
    uploadingImage: "Uploading image...",
    cardPreviewTitle: "Live Card Preview",
    projectedShare: "Projected Dominance:",
    instantActivation: "Instant Activation:",
    instantActivationDesc: "Activation after Stripe confirms the payment",
    requiredFieldsError: "Brand name and website URL are required.",
    minAmountError: "The minimum amount is $1.00 USD.",

    boostTitle: (name) => `Boost ${name}`,
    newDominance: "New Dominance",
    currentShare: (pct) => `Current: ${pct}%`,
    newTotalAccumulated: (val) => `New cumulative total: ${val}`,
    chooseBoostAmount: "Select Boost Amount",
    applyBoostBtn: (amount) => `Apply Boost of ${amount}`,

    leaderboardTitle: "Dominance Leaderboard",
    leaderboardDesc: (count) => `All ${count} brands competing on bidbento.lol`,
    ofThePage: "of screen",

    statsTitle: "Live Analytics & Transparency",
    statsHeroSubtitle: "Real-time traffic metrics, visitor activity, and click distribution across bidbento.lol.",
    liveVisitorsNow: "Active Online Now",
    totalPageViews: "Total Page Views",
    avgTimeOnPage: "Avg. Session Duration",
    conversionRateLabel: "Click-Through Rate",
    trafficChannels: "Traffic Channels",
    topPages: "Top Viewed Categories & Pages",
    trafficGrowth: "Traffic Activity",
    directTraffic: "Direct",
    organicSearch: "Organic Search",
    socialTraffic: "Social (X, LinkedIn)",
    referralTraffic: "Referral",

    spacePurchasedToast: (domain) => `🎉 Bento secured successfully for ${domain}!`,
    boostAppliedToast: "⚡ Boost applied successfully!",

    rulesTitle: "Rules & Guidelines",
    rulesSubtitle: "Official Rules",
    rulesHeroTitle: "How bidbento.lol Works",
    rulesHeroDesc: "bidbento.lol is a visual screen real-estate experiment. Below are the official rules, dilution mechanics, and content guidelines.",
    rule1Title: "1. Screen Real Estate & Treemap Dynamics",
    rule1Desc: "Screen area is mathematically partitioned using the Squarified Treemap algorithm. Each brand occupies a rectangular slice exactly proportional to its total investment compared to the active page pool.",
    rule1Formula: "Screen Share (%) = (Brand Total Investment / Total Page Pool) × 100",
    rule2Title: "2. Bidding, Boost & Continuous Dilution",
    rule2Min: "Minimum Bid: The minimum investment or boost is $1.00 USD.",
    rule2Grouping: "Automatic Domain Grouping: Multiple purchases for the same domain URL are combined automatically, expanding your screen share instantly.",
    rule2Dilution: "Natural Dilution: As new advertisers join, existing spots are smoothly resized in real-time. Use the Boost button at any time to regain territory.",
    rule3Title: "3. Content Guidelines & Moderation",
    rule3Intro: "To maintain a premium, safe environment, the following are strictly prohibited:",
    rule3Item1: "Adult / NSFW / Explicit Content",
    rule3Item2: "Malware, Phishing or Exploits",
    rule3Item3: "Financial Scams, Ponzi or Deceptive Schemes",
    rule3Item4: "Hate Speech or Illegal Activities",
    rule3Warning: "* Ads violating these terms will be removed immediately by moderation without refund.",
    rule4Title: "4. Click Tracking & Public Transparency",
    rule4Desc: "Every click is verified and recorded in the database. Metrics are public to provide clear traffic attribution for every brand.",
    faqTitle: "Frequently Asked Questions (FAQ)",
    faq1Q: "How long does my space last?",
    faq1A: "Your spot is continuous and permanent. As new brands join, your percentage is gently diluted, but you remain displayed on the corresponding rank page and can boost at any time.",
    faq2Q: "How does pagination work?",
    faq2A: "The canvas is divided into pages of 12 brands. Page 1 always showcases the Top 12 largest brands. Visitors can browse pages or filter by category.",
    faq3Q: "Can I update my logo, color or tagline later?",
    faq3A: "Yes! Whenever you place a new bid for the same domain, you can update your slogan, image, and brand color.",
    rulesCta: "Back and Claim your Bento",
  },

  es: {
    loading: "CARGANDO BIDBENTO.LOL...",
    claimSpace: "Reclamar tu Bento",
    boost: "Impulsar",
    ranking: "Ranking",
    rules: "Reglas",
    stats: "Estadísticas",
    liveOnline: (count) => `${count} online`,
    visitorsSinceLaunch: (count) => `${count} visitantes desde el lanzamiento`,
    seeStats: "ver stats →",
    secureCheckout: "Pago Seguro",
    backToHome: "Volver a bidbento.lol",
    emptyTitle: "La pantalla está vacía",
    emptyDesc: "¡Sé la primera marca en conquistar el 100% de la pantalla en bidbento.lol por solo $1.00!",
    claimNow: "Reclamar tu Bento por $1.00",
    leaderBadge: "Líder",
    rankBadge: "Puesto",

    categories: {
      all: "Todos",
      devTools: "Herramientas Dev",
      saas: "SaaS",
      ai: "IA / Machine Learning",
      design: "Diseño & UI",
      fintech: "Fintech",
      crypto: "Cripto / Web3",
      productivity: "Productividad",
      ecommerce: "Comercio Electrónico",
      other: "Otros",
    },

    screenShare: "Espacio en Pantalla",
    pageShare: "Espacio en Página",
    realClicks: "Clics Reales",
    totalInvested: "Total Invertido",
    lastBoost: "Último Aporte",
    visitWebsite: "Visitar Sitio Web",
    boostBrand: "Boost",

    copyLeader: (name, percentage) => `⚡ ${name} domina el ${percentage}% de la pantalla. ¡Reclama tu bento ahora!`,
    copyClicks: (count) => `👀 Más de ${count} clics generados para las marcas en pantalla.`,
    copyLastBid: (name, amount, time) => `🔥 Último lance: ${name} sumó +${amount} (${time}).`,
    copyStartingFrom: "💡 Desde $1.00 tu marca obtiene visibilidad global instantánea en bidbento.lol.",
    copyAntiDilution: "🛡️ ¡No te dejes diluir! Asegura tu territorio en bidbento.lol.",
    copyFairness: "💎 Un ranking más justo: presupuestos accesibles dominan las páginas 2 y 3 con visibilidad real y control total.",
    totalBids: "Fondo Total",

    modalTitle: "Reclamar tu Bento",
    modalDesc: "Compite por la dominancia visual y recibe tráfico directo para tu proyecto.",
    projectionTitle: "Proyección de Dominancia en Tiempo Real",
    projectedRank: (rank) => `Puesto #${rank}`,
    ofTheScreen: "de toda el área de pantalla en bidbento.lol!",
    domainExistsNote: (name, current) => `Dominio existente (${name}). ¡Este valor se sumará a tus ${current}!`,
    investmentAmount: "Monto de Inversión",
    orCustomAmount: "O escribe otro monto...",
    brandName: "Nombre de la Marca / SaaS *",
    brandNamePlaceholder: "Ej: Supabase, Linear...",
    websiteUrl: "URL del Sitio Web / Destino *",
    websiteUrlPlaceholder: "https://tumarca.com",
    categoryLabel: "Sector / Categoría *",
    taglineLabel: "Eslogan Corto / Descripción",
    taglinePlaceholder: "Ej: La mejor base de datos para Next.js",
    logoLabel: "Logotipo (Subir archivo o URL)",
    chooseFile: "Elegir archivo (PNG, JPEG, SVG...)",
    orLogoUrl: "O pega la URL directa...",
    brandColorLabel: "Color de Destaque de la Marca",
    customColorToggle: "Color Personalizado (HEX/RGB/CMYK)",
    paletteToggle: "Usar Paleta Predeterminada",
    payAndClaim: (amount) => `Reclamar tu Bento por ${amount}`,
    processing: "Procesando...",
    uploadingImage: "Subiendo imagen...",
    cardPreviewTitle: "Vista Previa de tu Tarjeta",
    projectedShare: "Dominancia Proyectada:",
    instantActivation: "Activación Instantánea:",
    instantActivationDesc: "Activación después de la confirmación de Stripe",
    requiredFieldsError: "El nombre y la URL del sitio son obligatorios.",
    minAmountError: "El monto mínimo es de $1.00 USD.",

    boostTitle: (name) => `Impulsar ${name}`,
    newDominance: "Nueva Dominancia",
    currentShare: (pct) => `Actual: ${pct}%`,
    newTotalAccumulated: (val) => `Nuevo total acumulado: ${val}`,
    chooseBoostAmount: "Selecciona el Monto del Boost",
    applyBoostBtn: (amount) => `Aplicar Boost de ${amount}`,

    leaderboardTitle: "Ranking de Dominancia",
    leaderboardDesc: (count) => `Todas las ${count} marcas disputando en bidbento.lol`,
    ofThePage: "de pantalla",

    statsTitle: "Estadísticas en Vivo & Transparencia",
    statsHeroSubtitle: "Métricas de tráfico en tiempo real, visitantes activos y distribución de clics en bidbento.lol.",
    liveVisitorsNow: "Activos Online Ahora",
    totalPageViews: "Visualizaciones Totales",
    avgTimeOnPage: "Tiempo Promedio de Sesión",
    conversionRateLabel: "Tasa de Clics (CTR)",
    trafficChannels: "Canales de Tráfico",
    topPages: "Páginas y Categorías Más Vistas",
    trafficGrowth: "Actividad de Tráfico",
    directTraffic: "Directo",
    organicSearch: "Búsqueda Orgánica",
    socialTraffic: "Redes Sociales (X, LinkedIn)",
    referralTraffic: "Referidos",

    spacePurchasedToast: (domain) => `🎉 ¡Bento asegurado con éxito para ${domain}!`,
    boostAppliedToast: "⚡ ¡Boost aplicado con éxito!",

    rulesTitle: "Reglas & Directrices",
    rulesSubtitle: "Reglas Oficiales",
    rulesHeroTitle: "Cómo Funciona bidbento.lol",
    rulesHeroDesc: "bidbento.lol es un experimento visual de espacio en pantalla. A continuación se presentan las reglas oficiales, dilución y directrices.",
    rule1Title: "1. Dinámica de Espacio & Algoritmo Treemap",
    rule1Desc: "El área de pantalla se calcula matemáticamente mediante el algoritmo Squarified Treemap. Cada marca ocupa una porción exactamente proporcional a su inversión total.",
    rule1Formula: "Firma en Pantalla (%) = (Inversión Total de la Marca / Total de la Página) × 100",
    rule2Title: "2. Lances, Boost y Dilución Continua",
    rule2Min: "Monto Mínimo: El valor mínimo de entrada o boost es de $1.00 USD.",
    rule2Grouping: "Agrupación Automática por Dominio: Las compras con la misma URL se suman automáticamente.",
    rule2Dilution: "Dilución Natural: Conforme entran nuevos anunciantes, el espacio se recalcula en tiempo real.",
    rule3Title: "3. Contenido Prohibido & Moderación",
    rule3Intro: "Para mantener un entorno seguro, está estrictamente prohibido:",
    rule3Item1: "Contenido Adulto / NSFW / Explícito",
    rule3Item2: "Malware, Phishing o Virus",
    rule3Item3: "Estafas Financieras o Esquemas Ponzi",
    rule3Item4: "Discurso de Odio o Actividades Ilícitas",
    rule3Warning: "* Los anuncios infractores serán eliminados de inmediato sin derecho a reembolso.",
    rule4Title: "4. Registro de Clics y Transparencia",
    rule4Desc: "Cada clic es auditado y computado en tiempo real de forma transparente.",
    faqTitle: "Preguntas Frecuentes (FAQ)",
    faq1Q: "¿Cuánto tiempo dura mi espacio?",
    faq1A: "Tu espacio es continuo y permanente. Conforme entran nuevas marcas se diluye suavemente, pero sigues presente y puedes aplicar Boost en cualquier momento.",
    faq2Q: "¿Cómo funciona la división en páginas?",
    faq2A: "La pantalla se divide en páginas de 12 marcas. La Página 1 reúne el Top 12 con mayor inversión.",
    faq3Q: "¿Puedo actualizar el logo o eslogan más adelante?",
    faq3A: "¡Sí! Al realizar un nuevo lance para el mismo dominio puedes actualizar tu imagen, eslogan y color.",
    rulesCta: "Volver y Reclamar tu Bento",
  },

  pt: {
    loading: "CARREGANDO O BIDBENTO.LOL...",
    claimSpace: "Reivindicar seu Bento",
    boost: "Boost",
    ranking: "Ranking",
    rules: "Regras",
    stats: "Estatísticas",
    liveOnline: (count) => `${count} online`,
    visitorsSinceLaunch: (count) => `${count} visitantes desde o lançamento`,
    seeStats: "ver stats →",
    secureCheckout: "Checkout Seguro",
    backToHome: "Voltar ao bidbento.lol",
    emptyTitle: "A tela está vazia",
    emptyDesc: "Seja a primeira marca a conquistar 100% de dominância no bidbento.lol por apenas $1.00!",
    claimNow: "Reivindicar seu Bento por $1.00",
    leaderBadge: "Líder",
    rankBadge: "Posição",

    categories: {
      all: "Todos",
      devTools: "Developer Tools",
      saas: "SaaS",
      ai: "IA / Machine Learning",
      design: "Design & UI",
      fintech: "Fintech",
      crypto: "Crypto / Web3",
      productivity: "Produtividade",
      ecommerce: "E-commerce",
      other: "Outros",
    },

    screenShare: "Fatia da Tela",
    pageShare: "Fatia na Página",
    realClicks: "Cliques Reais",
    totalInvested: "Total Investido",
    lastBoost: "Último Aporte",
    visitWebsite: "Visitar Website",
    boostBrand: "Boost",

    copyLeader: (name, percentage) => `⚡ ${name} lidera com ${percentage}% da tela. Conquiste seu bento agora!`,
    copyClicks: (count) => `👀 Mais de ${count} cliques gerados para as marcas na tela.`,
    copyLastBid: (name, amount, time) => `🔥 Último lance: ${name} investiu +${amount} (${time}).`,
    copyStartingFrom: "💡 A partir de $1.00 sua marca já ganha visibilidade instantânea no bidbento.lol.",
    copyAntiDilution: "🛡️ Não seja diluído! Garanta sua dominância visual no bidbento.lol.",
    copyFairness: "💎 Um ranking mais justo: orçamentos menores conquistam as páginas 2 e 3 com visibilidade real e controle total.",
    totalBids: "Pote Total",

    modalTitle: "Reivindicar seu Bento",
    modalDesc: "Dispute a dominância visual e receba tráfego direto para o seu projeto.",
    projectionTitle: "Projeção de Dominância em Tempo Real",
    projectedRank: (rank) => `Posição #${rank}`,
    ofTheScreen: "de toda a área útil na tela do bidbento.lol!",
    domainExistsNote: (name, current) => `Domínio já existente (${name}). O valor será somado aos seus ${current}!`,
    investmentAmount: "Valor do Investimento",
    orCustomAmount: "Ou digite outro valor...",
    brandName: "Nome da Marca / SaaS *",
    brandNamePlaceholder: "Ex: Supabase, Linear...",
    websiteUrl: "URL do Website / Destino *",
    websiteUrlPlaceholder: "https://meusaas.com",
    categoryLabel: "Setor / Categoria *",
    taglineLabel: "Slogan / Descrição Curta",
    taglinePlaceholder: "Ex: O melhor banco de dados para Next.js",
    logoLabel: "Logotipo da Marca (Upload ou URL)",
    chooseFile: "Escolher arquivo (PNG, JPEG, SVG...)",
    orLogoUrl: "Ou cole a URL direta...",
    brandColorLabel: "Cor de Destaque da Marca",
    customColorToggle: "Cor Personalizada (HEX/RGB/CMYK)",
    paletteToggle: "Usar Paleta Padrão",
    payAndClaim: (amount) => `Reivindicar seu Bento por ${amount}`,
    processing: "Processando...",
    uploadingImage: "Enviando imagem...",
    cardPreviewTitle: "Pré-Visualização do seu Card",
    projectedShare: "Dominância Projetada:",
    instantActivation: "Ativação Instantânea:",
    instantActivationDesc: "Ativação após a confirmação da Stripe",
    requiredFieldsError: "Nome e URL do website são obrigatórios.",
    minAmountError: "O valor mínimo é de $1.00 USD.",

    boostTitle: (name) => `Impulsionar ${name}`,
    newDominance: "Nova Dominância",
    currentShare: (pct) => `Atual: ${pct}%`,
    newTotalAccumulated: (val) => `Novo total acumulado: ${val}`,
    chooseBoostAmount: "Escolha o valor do Boost",
    applyBoostBtn: (amount) => `Aplicar Boost de ${amount}`,

    leaderboardTitle: "Ranking de Dominância",
    leaderboardDesc: (count) => `Todas as ${count} marcas disputando no bidbento.lol`,
    ofThePage: "da tela",

    statsTitle: "Estatísticas em Tempo Real & Transparência",
    statsHeroSubtitle: "Métricas de tráfego ao vivo, visitantes ativos e distribuição de cliques no bidbento.lol.",
    liveVisitorsNow: "Ativos Online Agora",
    totalPageViews: "Visualizações de Página",
    avgTimeOnPage: "Duração Média da Sessão",
    conversionRateLabel: "Taxa de Cliques (CTR)",
    trafficChannels: "Canais de Tráfego",
    topPages: "Categorias e Páginas Mais Acessadas",
    trafficGrowth: "Atividade de Tráfego",
    directTraffic: "Direto",
    organicSearch: "Busca Orgânica",
    socialTraffic: "Redes Sociais (X, LinkedIn)",
    referralTraffic: "Referência",

    spacePurchasedToast: (domain) => `🎉 Bento garantido com sucesso para ${domain}!`,
    boostAppliedToast: "⚡ Boost aplicado com sucesso!",

    rulesTitle: "Regras & Diretrizes",
    rulesSubtitle: "Regras Oficiais",
    rulesHeroTitle: "Regras de Funcionamento do bidbento.lol",
    rulesHeroDesc: "O bidbento.lol é um experimento público de visualização e monetização de espaço de tela. Abaixo estão as regras oficiais e diretrizes.",
    rule1Title: "1. Dinâmica de Espaço & Algoritmo Treemap",
    rule1Desc: "A área da tela é calculada matematicamente através do algoritmo Squarified Treemap. Cada marca ocupa um retângulo cuja área percentual é proporcional ao valor investido.",
    rule1Formula: "Fatia da Tela (%) = (Valor Total Investido pela Marca / Valor Total da Página) × 100",
    rule2Title: "2. Lances, Boost e Diluição Contínua",
    rule2Min: "Valor Mínimo: O valor mínimo para adquirir espaço ou dar boost é de $1.00 USD.",
    rule2Grouping: "Agrupamento Automático por Domínio: Múltiplos aportes para a mesma URL somam o valor total.",
    rule2Dilution: "Diluição Natural: Conforme novos anunciantes entram, o espaço de todas as marcas é recalculado.",
    rule3Title: "3. Conteúdo Proibido & Moderação",
    rule3Intro: "Para manter um ecossistema seguro e de alto valor, são estritamente proibidos:",
    rule3Item1: "Conteúdo adulto / NSFW / Explícito",
    rule3Item2: "Malware, phishing ou vírus",
    rule3Item3: "Golpes financeiros, pirâmides e scams",
    rule3Item4: "Discurso de ódio ou atividades ilegais",
    rule3Warning: "* Anúncios que violem estas diretrizes serão removidos instantaneamente sem reembolso.",
    rule4Title: "4. Rastreamento de Cliques & Estatísticas",
    rule4Desc: "Cada clique realizado nos blocos é auditado e computado em tempo real de forma transparente.",
    faqTitle: "Perguntas Frequentes (FAQ)",
    faq1Q: "Quanto tempo dura o meu espaço na tela?",
    faq1A: "O espaço é vitalício e contínuo. Conforme novas marcas entram seu percentual é suavemente diluído, mas você permanece visível e pode dar boost a qualquer momento.",
    faq2Q: "Como funciona a divisão em páginas?",
    faq2A: "A tela é dividida em páginas de 12 marcas. A Página 1 reúne as 12 maiores marcas em valor investido.",
    faq3Q: "Posso trocar o logo ou slogan depois de pagar?",
    faq3A: "Sim! Ao realizar um novo lance para o mesmo domínio, você pode atualizar o slogan, logo e cor.",
    rulesCta: "Voltar e Reivindicar seu Bento",
  },
};

export function getTranslation(lang: Language = "en"): TranslationDict {
  return translations[lang] || translations.en;
}
