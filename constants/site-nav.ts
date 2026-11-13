/**
 * Public sitemap from the approved TGS text pack & developer brief.
 * Navbar, footer and sitemap.xml read from here. `live: true` includes the
 * URL in sitemap.xml (anchors are never listed).
 */
export type SiteNavLink = {
  label: string;
  href: string;
  live?: boolean;
};

export type SiteNavSection = SiteNavLink & {
  children?: readonly SiteNavLink[];
};

export const SITE_NAV: readonly SiteNavSection[] = [
  {
    label: "Platform",
    href: "/platform",
    live: true,
    children: [
      { label: "One Global B2B Platform", href: "/platform", live: true },
      { label: "Connect", href: "/platform#connect" },
      { label: "Orchestrate", href: "/platform#orchestrate" },
      { label: "Deliver", href: "/platform#deliver" },
      { label: "Monitor", href: "/platform#monitor" },
      { label: "Optimize", href: "/platform#optimize" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    live: true,
    children: [
      {
        label: "Cloud & Data Centre Services",
        href: "/services/cloud-data-centre",
        live: true,
      },
      { label: "Cybersecurity", href: "/services/cybersecurity", live: true },
      {
        label: "IoT & Digital Services",
        href: "/services/iot-digital-services",
        live: true,
      },
      {
        label: "Network & Enterprise Connectivity",
        href: "/services/network-enterprise-connectivity",
        live: true,
      },
      {
        label: "Interactions, Voice & Messaging",
        href: "/services/interactions-voice-messaging",
        live: true,
      },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    live: true,
    children: [
      {
        label: "Mobile Operators",
        href: "/solutions/mobile-operators",
        live: true,
      },
      { label: "Enterprises", href: "/solutions/enterprises", live: true },
      {
        label: "Governments & Institutions",
        href: "/solutions/governments-institutions",
        live: true,
      },
      {
        label: "Wholesale & Aggregators",
        href: "/solutions/wholesale-aggregators",
        live: true,
      },
    ],
  },
  {
    label: "Use Cases",
    href: "/use-cases",
    live: true,
    children: [
      {
        label: "Grow International Revenue",
        href: "/use-cases/grow-international-revenue",
        live: true,
      },
      {
        label: "Modernize Customer Engagement",
        href: "/use-cases/modernize-customer-engagement",
        live: true,
      },
      {
        label: "Secure Messaging Traffic",
        href: "/use-cases/secure-messaging-traffic",
        live: true,
      },
      {
        label: "Scale Across Markets",
        href: "/use-cases/scale-across-markets",
        live: true,
      },
      {
        label: "Build Resilient Infrastructure",
        href: "/use-cases/build-resilient-infrastructure",
        live: true,
      },
      {
        label: "Launch New Digital Services",
        href: "/use-cases/launch-new-digital-services",
        live: true,
      },
    ],
  },
  {
    label: "Why Telecel Global",
    href: "/why-telecel-global",
    live: true,
    children: [
      { label: "Our Approach", href: "/why-telecel-global#approach" },
      {
        label: "Leadership",
        href: "/why-telecel-global/leadership",
        live: true,
      },
      { label: "Global Reach", href: "/why-telecel-global#global-reach" },
      { label: "Partners & Ecosystem", href: "/why-telecel-global#partners" },
    ],
  },
  {
    label: "Insights",
    href: "/insights",
    live: true,
    children: [
      { label: "News", href: "/insights", live: true },
      { label: "Case Studies", href: "/insights/case-studies", live: true },
    ],
  },
] as const;

/** Primary conversion CTAs — shown in the header and footer. */
export const SITE_CTAS = {
  talkToSales: { label: "Talk to Sales", href: "/contact?intent=sales" },
  requestDemo: { label: "Request a Demo", href: "/contact?intent=demo" },
} as const;

export const SITE_LEGAL_LINKS: readonly SiteNavLink[] = [
  { label: "Privacy Policy", href: "/privacy", live: true },
  { label: "Cookie Policy", href: "/cookies", live: true },
  { label: "Terms of Use", href: "/terms", live: true },
];
