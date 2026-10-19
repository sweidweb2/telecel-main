import type { PortfolioStartupRecord } from "@/types/portfolio-startup";

const img = (name: string) =>
  `https://www.untitledui.com/react/marketing/${name}`;

/** Draft portfolio entries — names and figures require Telecel verification. */
export const PORTFOLIO_STARTUPS: PortfolioStartupRecord[] = [
  {
    id: "startup-001",
    slug: "payflow-africa",
    imageUrl: img("spirals.webp"),
    en: {
      name: "PayFlow Africa",
      description:
        "Digital payments infrastructure helping merchants and SMEs accept mobile money and cards across West Africa.",
    },
    fr: {
      name: "PayFlow Africa",
      description:
        "Infrastructure de paiement numérique aidant commerçants et PME à accepter mobile money et cartes en Afrique de l’Ouest.",
    },
  },
  {
    id: "startup-002",
    slug: "agriverse",
    imageUrl: img("conversation.webp"),
    en: {
      name: "AgriVerse",
      description:
        "Connecting smallholder farmers to buyers, inputs, and climate-smart advisory through a mobile-first marketplace.",
    },
    fr: {
      name: "AgriVerse",
      description:
        "Relie petits exploitants, acheteurs et intrants via une place de marché mobile et des conseils climatiques.",
    },
  },
  {
    id: "startup-003",
    slug: "healthbridge",
    imageUrl: img("smiling-girl-2.webp"),
    en: {
      name: "HealthBridge",
      description:
        "Telehealth platform linking community clinics with specialists to improve access in underserved regions.",
    },
    fr: {
      name: "HealthBridge",
      description:
        "Plateforme de télésanté reliant cliniques communautaires et spécialistes dans les zones mal desservies.",
    },
  },
  {
    id: "startup-004",
    slug: "solgrid",
    imageUrl: img("workspace-5.webp"),
    en: {
      name: "SolGrid",
      description:
        "Solar mini-grid software for pay-as-you-go energy distribution in rural and peri-urban communities.",
    },
    fr: {
      name: "SolGrid",
      description:
        "Logiciel de mini-réseaux solaires pour l’énergie pay-as-you-go en milieu rural et périurbain.",
    },
  },
  {
    id: "startup-005",
    slug: "edulift",
    imageUrl: img("wireframing-layout.webp"),
    en: {
      name: "EduLift",
      description:
        "Skills platform delivering telecom and technology training to youth preparing for startup and operator roles.",
    },
    fr: {
      name: "EduLift",
      description:
        "Plateforme de compétences en télécoms et tech pour les jeunes visant startups et opérateurs.",
    },
  },
  {
    id: "startup-006",
    slug: "logisync",
    imageUrl: img("two-people.webp"),
    en: {
      name: "LogiSync",
      description:
        "Last-mile logistics coordination for e-commerce and informal retail networks in major African cities.",
    },
    fr: {
      name: "LogiSync",
      description:
        "Coordination logistique du dernier kilomètre pour e-commerce et commerce informel dans les grandes villes.",
    },
  },
  {
    id: "startup-007",
    slug: "credstack",
    imageUrl: img("sythesize.webp"),
    en: {
      name: "CredStack",
      description:
        "Alternative credit scoring using telco and transaction signals to expand lending for micro-businesses.",
    },
    fr: {
      name: "CredStack",
      description:
        "Scoring de crédit alternatif via signaux télécoms et transactions pour financer les micro-entreprises.",
    },
  },
  {
    id: "startup-008",
    slug: "wasteloop",
    imageUrl: img("podcast-girl.webp"),
    en: {
      name: "WasteLoop",
      description:
        "Circular economy platform tracking collection routes and rewarding households for recyclable waste.",
    },
    fr: {
      name: "WasteLoop",
      description:
        "Plateforme d’économie circulaire pour collecte et récompenses des ménages triant leurs déchets.",
    },
  },
  {
    id: "startup-009",
    slug: "mobidata",
    imageUrl: img("ai-woman-01.webp"),
    en: {
      name: "MobiData",
      description:
        "Analytics tools helping operators and startups understand network usage patterns and product adoption.",
    },
    fr: {
      name: "MobiData",
      description:
        "Outils d’analyse de l’usage réseau et d’adoption produit pour opérateurs et startups.",
    },
  },
  {
    id: "startup-010",
    slug: "farmcredit",
    imageUrl: img("smiling-girl-6.webp"),
    en: {
      name: "FarmCredit",
      description:
        "Embedded finance for agricultural cooperatives, enabling input financing tied to harvest cycles.",
    },
    fr: {
      name: "FarmCredit",
      description:
        "Finance intégrée pour coopératives agricoles, avec financement d’intrants lié aux récoltes.",
    },
  },
  {
    id: "startup-011",
    slug: "citymesh",
    imageUrl: img("workspace-4.webp"),
    en: {
      name: "CityMesh",
      description:
        "IoT connectivity layer for smart city pilots covering air quality, traffic, and public safety sensors.",
    },
    fr: {
      name: "CityMesh",
      description:
        "Couche IoT pour villes intelligentes : qualité de l’air, trafic et capteurs de sécurité publique.",
    },
  },
  {
    id: "startup-012",
    slug: "talentpulse",
    imageUrl: img("workspace-3.webp"),
    en: {
      name: "TalentPulse",
      description:
        "Recruitment marketplace focused on technical roles across Africa’s growing telecom and SaaS sectors.",
    },
    fr: {
      name: "TalentPulse",
      description:
        "Place de marché recrutement pour profils techniques dans les secteurs télécoms et SaaS en Afrique.",
    },
  },
  {
    id: "startup-013",
    slug: "insurelink",
    imageUrl: img("blog-featured-post-01.webp"),
    en: {
      name: "InsureLink",
      description:
        "Micro-insurance distribution through mobile agents and USSD for health and device protection products.",
    },
    fr: {
      name: "InsureLink",
      description:
        "Distribution de micro-assurance via agents mobiles et USSD pour santé et protection d’appareils.",
    },
  },
  {
    id: "startup-014",
    slug: "retailos",
    imageUrl: img("spirals.webp"),
    en: {
      name: "RetailOS",
      description:
        "Inventory and point-of-sale suite built for informal retailers upgrading to digital bookkeeping.",
    },
    fr: {
      name: "RetailOS",
      description:
        "Suite inventaire et point de vente pour commerçants informels passant à la comptabilité numérique.",
    },
  },
  {
    id: "startup-015",
    slug: "cloudharbor",
    imageUrl: img("conversation.webp"),
    en: {
      name: "CloudHarbor",
      description:
        "Regional cloud hosting and developer tools optimized for latency-sensitive African applications.",
    },
    fr: {
      name: "CloudHarbor",
      description:
        "Hébergement cloud régional et outils développeurs optimisés pour applications sensibles à la latence.",
    },
  },
  {
    id: "startup-016",
    slug: "greenroute",
    imageUrl: img("two-people.webp"),
    en: {
      name: "GreenRoute",
      description:
        "Electric mobility routing and charging access for delivery fleets transitioning off fossil fuels.",
    },
    fr: {
      name: "GreenRoute",
      description:
        "Itinéraires mobilité électrique et accès recharge pour flottes de livraison en transition énergétique.",
    },
  },
  {
    id: "startup-017",
    slug: "docvault",
    imageUrl: img("wireframing-layout.webp"),
    en: {
      name: "DocVault",
      description:
        "Secure digital identity and document wallet for cross-border trade and compliance workflows.",
    },
    fr: {
      name: "DocVault",
      description:
        "Portefeuille d’identité et documents sécurisés pour commerce transfrontalier et conformité.",
    },
  },
  {
    id: "startup-018",
    slug: "learnhub",
    imageUrl: img("workspace-5.webp"),
    en: {
      name: "LearnHub",
      description:
        "Localized STEM content delivery over low-bandwidth connections for secondary schools and bootcamps.",
    },
    fr: {
      name: "LearnHub",
      description:
        "Contenus STEM localisés sur connexions à faible bande passante pour lycées et bootcamps.",
    },
  },
];
