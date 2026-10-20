/**
 * Public sitemap from the Telecel Global RFQ §3 (mandatory architecture).
 * Navbar, footer and sitemap.xml read from here. Page routes are built in the
 * "Public Pages Front-end" task; until a route exists, keep `live: false` so it
 * is left out of sitemap.xml.
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
    children: [
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
    children: [
      { label: "Cloud & Data Centre Services", href: "/services/cloud-data-centre" },
      { label: "Cybersecurity", href: "/services/cybersecurity" },
      { label: "IoT & Digital Services", href: "/services/iot-digital-services" },
      { label: "Network & Enterprise Connectivity", href: "/services/network-enterprise-connectivity" },
      { label: "Interactions, Voice & Messaging", href: "/services/interactions-voice-messaging" },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Mobile Operators", href: "/solutions/mobile-operators" },
      { label: "Enterprises", href: "/solutions/enterprises" },
      { label: "Governments & Institutions", href: "/solutions/governments-institutions" },
      { label: "Wholesale & Aggregators", href: "/solutions/wholesale-aggregators" },
    ],
  },
  {
    label: "Use Cases",
    href: "/use-cases",
    children: [
      { label: "Grow International Revenue", href: "/use-cases/grow-international-revenue" },
      { label: "Modernize Customer Engagement", href: "/use-cases/modernize-customer-engagement" },
      { label: "Secure Messaging Traffic", href: "/use-cases/secure-messaging-traffic" },
      { label: "Scale Across Markets", href: "/use-cases/scale-across-markets" },
      { label: "Build Resilient Infrastructure", href: "/use-cases/build-resilient-infrastructure" },
      { label: "Launch New Digital Services", href: "/use-cases/launch-new-digital-services" },
    ],
  },
  {
    label: "Why Telecel Global",
    href: "/why-telecel-global",
    children: [
      { label: "Our Approach", href: "/why-telecel-global#approach" },
      { label: "Leadership", href: "/why-telecel-global/leadership" },
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
      { label: "Case Studies", href: "/insights/case-studies" },
    ],
  },
] as const;

/** Primary conversion CTAs (RFQ §4.4) — shown in the header and footer. */
export const SITE_CTAS = {
  talkToSales: { label: "Talk to Sales", href: "/contact?intent=sales" },
  requestDemo: { label: "Request a Demo", href: "/contact?intent=demo" },
} as const;

export const SITE_LEGAL_LINKS: readonly SiteNavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms of Use", href: "/terms" },
];
