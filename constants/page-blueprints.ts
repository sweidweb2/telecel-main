import type { BlueprintSectionConfig } from "@/components/marketing/page-blueprint";

export type PageBlueprintConfig = {
  path: string;
  eyebrow?: string;
  title: string;
  description?: string;
  metaTitle: string;
  metaDescription: string;
  sections: readonly BlueprintSectionConfig[];
};

/** Homepage modules from the approved TGS text pack (order locked). */
export const HOME_BLUEPRINT: PageBlueprintConfig = {
  path: "/",
  eyebrow: "Telecel Global",
  title:
    "One managed platform for international connectivity and digital services",
  description:
    "Blueprint homepage — section shells only. Approved copy and hero film land in later passes.",
  metaTitle: "Telecel Global | International Connectivity & Digital Services",
  metaDescription:
    "One managed platform for cloud, data centres, cybersecurity, IoT, enterprise connectivity, voice and messaging. Built for operators and enterprises.",
  sections: [
    {
      id: "hero",
      title: "Hero",
      note: "Silent loopable film + headline, subline, service line, Explore Services + Talk to Sales.",
    },
    {
      id: "customer-challenge",
      title: "Customer challenge",
      note: "High-contrast value statement and one managed relationship graphic.",
    },
    {
      id: "service-pillars",
      title: "Five service pillars",
      note: "Interactive cards in approved order linking to each pillar landing page.",
    },
    {
      id: "outcomes",
      title: "Business outcomes",
      note: "Grow revenue, scale markets, protect operations, launch faster, create customer value.",
    },
    {
      id: "solutions-by-customer",
      title: "Solutions by customer",
      note: "Mobile Operators, Enterprises, Governments & Institutions, Wholesale & Aggregators.",
    },
    {
      id: "delivery-model",
      title: "Delivery model",
      note: "Connect → Orchestrate → Deliver → Monitor → Optimize.",
    },
    {
      id: "proof",
      title: "Proof and differentiation",
      note: "Non-numeric approved proof labels only — no invented metrics or logos.",
    },
    {
      id: "why-telecel-global",
      title: "Why Telecel Global",
      note: "Operator-led understanding, one relationship, reach, agility, proximity.",
    },
    {
      id: "lead-capture",
      title: "Talk to Sales / Request a Demo",
      note: "Closing CTA band and routed inquiry entry points.",
    },
  ],
};

export const PLATFORM_BLUEPRINT: PageBlueprintConfig = {
  path: "/platform",
  eyebrow: "Platform",
  title: "One Global B2B Platform",
  description: "One managed platform. More ways to grow.",
  metaTitle: "One Global B2B Platform | Telecel Global",
  metaDescription:
    "Bring international connectivity, digital infrastructure, customer engagement and value-added services together through one managed relationship.",
  sections: [
    {
      id: "overview",
      title: "Platform overview",
      note: "Integrated service model across the five layers.",
    },
    {
      id: "layers",
      title: "Five platform layers",
      note: "Cloud & Data Centre, Cybersecurity, IoT & Digital, Network & Connectivity, Interactions.",
    },
    {
      id: "connect",
      title: "How we work — Connect",
      note: "Bring the right networks, platforms and service components together.",
    },
    {
      id: "orchestrate",
      title: "How we work — Orchestrate",
      note: "Align technical and commercial requirements through one managed relationship.",
    },
    {
      id: "deliver",
      title: "How we work — Deliver",
      note: "Launch the agreed solution with clear ownership and implementation control.",
    },
    {
      id: "monitor",
      title: "How we work — Monitor",
      note: "Maintain operational visibility and service continuity.",
    },
    {
      id: "optimize",
      title: "How we work — Optimize",
      note: "Improve performance, efficiency and commercial value over time.",
    },
  ],
};

export const SERVICES_HUB_BLUEPRINT: PageBlueprintConfig = {
  path: "/services",
  eyebrow: "Services",
  title: "Five service pillars",
  description: "International capability. One managed experience.",
  metaTitle: "Services | Telecel Global",
  metaDescription:
    "Cloud and data centre, cybersecurity, IoT and digital services, network and enterprise connectivity, interactions, voice and messaging.",
  sections: [
    {
      id: "pillars",
      title: "Service pillar index",
      note: "Entry points to the five approved pillar landing pages.",
    },
    {
      id: "cta",
      title: "Talk to Sales",
      note: "Route serious buyers into the inquiry flow.",
    },
  ],
};

const SERVICE_PILLAR_SECTIONS: readonly BlueprintSectionConfig[] = [
  {
    id: "hero",
    title: "Hero",
    note: "Approved pillar headline and positioning.",
  },
  { id: "intro", title: "Introduction", note: "Page-level service narrative." },
  {
    id: "sub-services",
    title: "Sub-services",
    note: "Cards, accordions or anchored modules — wording locked from the text pack.",
  },
  { id: "cta", title: "Page CTA", note: "Talk to Sales / specialist routing." },
];

export const SERVICE_PILLAR_BLUEPRINTS: readonly PageBlueprintConfig[] = [
  {
    path: "/services/cloud-data-centre",
    eyebrow: "Services",
    title: "Cloud & Data Centre Services",
    description: "Modernize infrastructure without adding complexity.",
    metaTitle: "Cloud & Data Centre Services | Telecel Global",
    metaDescription:
      "Managed cloud, professional services, public and private cloud, colocation and data centre services for operators and enterprises.",
    sections: SERVICE_PILLAR_SECTIONS,
  },
  {
    path: "/services/cybersecurity",
    eyebrow: "Services",
    title: "Cybersecurity",
    description:
      "Protect connected operations with practical, layered security.",
    metaTitle: "Cybersecurity Services | Telecel Global",
    metaDescription:
      "Cybersecurity services for connected operations, including prevention, threat monitoring, penetration testing and secure connectivity.",
    sections: SERVICE_PILLAR_SECTIONS,
  },
  {
    path: "/services/iot-digital-services",
    eyebrow: "Services",
    title: "IoT & Digital Services",
    description: "Turn connectivity into new digital value.",
    metaTitle: "IoT & Digital Services | Telecel Global",
    metaDescription:
      "IoT, telecom VAS, fintech, digital content and travel eSIM solutions designed to improve operations and create new customer value.",
    sections: SERVICE_PILLAR_SECTIONS,
  },
  {
    path: "/services/network-enterprise-connectivity",
    eyebrow: "Services",
    title: "Network & Enterprise Connectivity",
    description: "Connect markets, operations and opportunities.",
    metaTitle: "Network & Enterprise Connectivity | Telecel Global",
    metaDescription:
      "International data connectivity, IP transit, SD-WAN, satellite, IP-VPN, roaming and enterprise networking services.",
    sections: SERVICE_PILLAR_SECTIONS,
  },
  {
    path: "/services/interactions-voice-messaging",
    eyebrow: "Services",
    title: "Interactions, Voice & Messaging",
    description:
      "Turn every interaction into stronger customer and commercial value.",
    metaTitle: "Interactions, Voice & Messaging | Telecel Global",
    metaDescription:
      "CPaaS, omnichannel engagement, enterprise messaging, A2P, P2P, P2A, SMS Firewall, managed services and international voice.",
    sections: SERVICE_PILLAR_SECTIONS,
  },
];

export const SOLUTIONS_HUB_BLUEPRINT: PageBlueprintConfig = {
  path: "/solutions",
  eyebrow: "Solutions",
  title: "Designed for the decisions you need to make",
  description: "Outcome-led journeys by customer type.",
  metaTitle: "Solutions | Telecel Global",
  metaDescription:
    "Solutions for mobile operators, enterprises, governments and institutions, and wholesale aggregators.",
  sections: [
    {
      id: "audiences",
      title: "Audience index",
      note: "Four buyer pathways into dedicated solution pages.",
    },
    {
      id: "cta",
      title: "Talk to Sales",
      note: "Connect the outcome to the right team.",
    },
  ],
};

const SOLUTION_SECTIONS: readonly BlueprintSectionConfig[] = [
  { id: "hero", title: "Hero", note: "Audience-specific headline." },
  { id: "intro", title: "Introduction", note: "Approved journey narrative." },
  {
    id: "priority-routes",
    title: "Priority service routes",
    note: "Links into the relevant service pillars and products.",
  },
  { id: "cta", title: "Page CTA", note: "Tell us the outcome you need." },
];

export const SOLUTION_BLUEPRINTS: readonly PageBlueprintConfig[] = [
  {
    path: "/solutions/mobile-operators",
    eyebrow: "Solutions",
    title: "Mobile Operators",
    description: "Grow international revenue. Create more subscriber value.",
    metaTitle: "Solutions for Mobile Operators | Telecel Global",
    metaDescription:
      "Connect international traffic, protect messaging ecosystems and launch digital services shaped around operator economics.",
    sections: SOLUTION_SECTIONS,
  },
  {
    path: "/solutions/enterprises",
    eyebrow: "Solutions",
    title: "Enterprises",
    description:
      "Connect operations. Modernize infrastructure. Engage customers.",
    metaTitle: "Solutions for Enterprises | Telecel Global",
    metaDescription:
      "Cloud, data centres, security, enterprise connectivity and customer engagement in one managed relationship.",
    sections: SOLUTION_SECTIONS,
  },
  {
    path: "/solutions/governments-institutions",
    eyebrow: "Solutions",
    title: "Governments & Institutions",
    description: "Build secure digital services that can scale.",
    metaTitle: "Solutions for Governments & Institutions | Telecel Global",
    metaDescription:
      "Secure infrastructure, international connectivity and digital platforms for public and institutional operations.",
    sections: SOLUTION_SECTIONS,
  },
  {
    path: "/solutions/wholesale-aggregators",
    eyebrow: "Solutions",
    title: "Wholesale & Aggregators",
    description:
      "Access international capability through one accountable relationship.",
    metaTitle: "Wholesale & Aggregator Solutions | Telecel Global",
    metaDescription:
      "Connectivity, messaging, voice and managed support for wholesale and aggregator partners.",
    sections: SOLUTION_SECTIONS,
  },
];

export const USE_CASES_HUB_BLUEPRINT: PageBlueprintConfig = {
  path: "/use-cases",
  eyebrow: "Use Cases",
  title: "Start from the outcome you need",
  description: "Six buyer outcomes mapped to the service portfolio.",
  metaTitle: "Use Cases | Telecel Global",
  metaDescription:
    "Grow international revenue, modernize engagement, secure messaging, scale across markets, build resilient infrastructure and launch digital services.",
  sections: [
    {
      id: "index",
      title: "Use case index",
      note: "Six outcome destinations from the approved sitemap.",
    },
    {
      id: "cta",
      title: "Talk to Sales",
      note: "Route from outcome to specialist.",
    },
  ],
};

const USE_CASE_SECTIONS: readonly BlueprintSectionConfig[] = [
  { id: "hero", title: "Hero", note: "Outcome headline from the text pack." },
  { id: "summary", title: "Summary", note: "Approved use-case narrative." },
  {
    id: "relevant-services",
    title: "Relevant services",
    note: "Named service links — no catalogue dump.",
  },
  {
    id: "cta",
    title: "Page CTA",
    note: "Continue to Talk to Sales or Request a Demo.",
  },
];

export const USE_CASE_BLUEPRINTS: readonly PageBlueprintConfig[] = [
  {
    path: "/use-cases/grow-international-revenue",
    eyebrow: "Use Cases",
    title: "Grow International Revenue",
    description:
      "Turn connectivity and digital services into new commercial opportunity.",
    metaTitle: "Grow International Revenue | Telecel Global",
    metaDescription:
      "Support operator growth through international traffic, subscriber services, enterprise engagement and digital monetization.",
    sections: USE_CASE_SECTIONS,
  },
  {
    path: "/use-cases/modernize-customer-engagement",
    eyebrow: "Use Cases",
    title: "Modernize Customer Engagement",
    description: "Create more relevant interactions across every channel.",
    metaTitle: "Modernize Customer Engagement | Telecel Global",
    metaDescription:
      "Use APIs, omnichannel platforms, analytics and customer-value tools to improve communication and engagement.",
    sections: USE_CASE_SECTIONS,
  },
  {
    path: "/use-cases/secure-messaging-traffic",
    eyebrow: "Use Cases",
    title: "Secure Messaging Traffic",
    description: "Protect traffic. Recover value. Improve control.",
    metaTitle: "Secure Messaging Traffic | Telecel Global",
    metaDescription:
      "Strengthen messaging ecosystems through firewall technology, managed operations and traffic insight.",
    sections: USE_CASE_SECTIONS,
  },
  {
    path: "/use-cases/scale-across-markets",
    eyebrow: "Use Cases",
    title: "Scale Across Markets",
    description: "Connect new locations without multiplying complexity.",
    metaTitle: "Scale Across Markets | Telecel Global",
    metaDescription:
      "Bring international data, IP, cloud and managed networking requirements into one coordinated engagement.",
    sections: USE_CASE_SECTIONS,
  },
  {
    path: "/use-cases/build-resilient-infrastructure",
    eyebrow: "Use Cases",
    title: "Build Resilient Infrastructure",
    description: "Make infrastructure ready for growth and disruption.",
    metaTitle: "Build Resilient Infrastructure | Telecel Global",
    metaDescription:
      "Combine cloud, data centres, secure connectivity and cybersecurity to strengthen operational continuity.",
    sections: USE_CASE_SECTIONS,
  },
  {
    path: "/use-cases/launch-new-digital-services",
    eyebrow: "Use Cases",
    title: "Launch New Digital Services",
    description:
      "Move from idea to market with the right platform and operating support.",
    metaTitle: "Launch New Digital Services | Telecel Global",
    metaDescription:
      "Build and launch connected, customer-facing services across IoT, VAS, fintech, content and eSIM.",
    sections: USE_CASE_SECTIONS,
  },
];

export const WHY_TELECEL_BLUEPRINT: PageBlueprintConfig = {
  path: "/why-telecel-global",
  eyebrow: "Why Telecel Global",
  title: "International capability, delivered with operator understanding",
  description:
    "Telecel Global is the international B2B arm of Telecel — blueprint sections only for now.",
  metaTitle: "Why Telecel Global | Telecel Global",
  metaDescription:
    "Operator-led understanding, one accountable relationship, international reach and solution-led agility.",
  sections: [
    {
      id: "approach",
      title: "Our Approach",
      note: "Differentiation narrative from the text pack.",
    },
    {
      id: "global-reach",
      title: "Global Reach",
      note: "International scope without unsupported scale claims.",
    },
    {
      id: "partners",
      title: "Partners & Ecosystem",
      note: "Clearance-gated — no logos or partner marks until approved.",
    },
    { id: "cta", title: "Talk to Sales", note: "Confidence → conversion." },
  ],
};

export const LEADERSHIP_BLUEPRINT: PageBlueprintConfig = {
  path: "/why-telecel-global/leadership",
  eyebrow: "Why Telecel Global",
  title: "Leadership",
  description: "Leadership connected to customers, markets and delivery.",
  metaTitle: "Leadership | Telecel Global",
  metaDescription:
    "Meet the leaders shaping Telecel Global's international growth, product direction and customer delivery.",
  sections: [
    {
      id: "leaders",
      title: "Leadership profiles",
      note: "Bios and representation supplied through the leadership workstream.",
    },
  ],
};

export const INSIGHTS_BLUEPRINT: PageBlueprintConfig = {
  path: "/insights",
  eyebrow: "Insights",
  title: "News",
  description: "News, announcements and perspectives from Telecel Global.",
  metaTitle: "Insights | Telecel Global",
  metaDescription: "News, announcements and perspectives from Telecel Global.",
  sections: [
    {
      id: "featured",
      title: "Featured",
      note: "Optional featured story slot.",
    },
    {
      id: "news",
      title: "News list",
      note: "Published articles from the CMS.",
    },
    {
      id: "case-studies",
      title: "Case Studies",
      note: "Hidden or empty until a case study is approved.",
    },
  ],
};

export const CASE_STUDIES_BLUEPRINT: PageBlueprintConfig = {
  path: "/insights/case-studies",
  eyebrow: "Insights",
  title: "Case Studies",
  description: "Template and listing slot — unpublished until cleared.",
  metaTitle: "Case Studies | Telecel Global",
  metaDescription:
    "Customer outcomes and delivery stories from Telecel Global.",
  sections: [
    {
      id: "list",
      title: "Case study list",
      note: "Do not invent cases. Keep empty until approved content exists.",
    },
  ],
};

export const CONTACT_BLUEPRINT: PageBlueprintConfig = {
  path: "/contact",
  eyebrow: "Contact",
  title: "Start with the outcome you need",
  description:
    "Tell us where you need to connect, grow, modernize or launch. We will route your request to the right Telecel Global team.",
  metaTitle: "Contact | Telecel Global",
  metaDescription:
    "Talk to Telecel Global about sales or request a demo. We route every inquiry to the right specialist team.",
  sections: [
    {
      id: "hero",
      title: "Hero",
      note: "Talk to Sales and Request a Demo CTAs.",
    },
    {
      id: "form",
      title: "Inquiry form",
      note: "Name, company, role, email, country, area of interest, business need, contact method.",
    },
    {
      id: "confirmation",
      title: "Success state",
      note: "Confirmation copy after secure, spam-protected submission.",
    },
  ],
};

export const LEGAL_BLUEPRINTS: readonly PageBlueprintConfig[] = [
  {
    path: "/privacy",
    eyebrow: "Legal",
    title: "Privacy Policy",
    metaTitle: "Privacy Policy | Telecel Global",
    metaDescription: "Privacy Policy for Telecel Global.",
    sections: [
      { id: "content", title: "Policy content", note: "Legal copy pending." },
    ],
  },
  {
    path: "/cookies",
    eyebrow: "Legal",
    title: "Cookie Policy",
    metaTitle: "Cookie Policy | Telecel Global",
    metaDescription: "Cookie Policy for Telecel Global.",
    sections: [
      { id: "content", title: "Policy content", note: "Legal copy pending." },
    ],
  },
  {
    path: "/terms",
    eyebrow: "Legal",
    title: "Terms of Use",
    metaTitle: "Terms of Use | Telecel Global",
    metaDescription: "Terms of Use for Telecel Global.",
    sections: [
      { id: "content", title: "Policy content", note: "Legal copy pending." },
    ],
  },
];
