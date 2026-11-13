import { marketingChildPath } from "@/constants/marketing-pages";
import { ROUTES } from "@/constants/routes";
import { SITE_CTAS } from "@/constants/site-nav";

/** Services hub hero copy — site chrome stays in `SiteNavbar`. */
export const SERVICES_HERO = {
  headline: "Connecting Operators,\nEnterprises & Nations",
  subtext:
    "Wholesale voice & data, enterprise messaging, cloud, IoT and cybersecurity, delivered over one trusted global network.",
  primaryCta: {
    label: "Become a Partner",
    href: SITE_CTAS.talkToSales.href,
  },
  secondaryCta: {
    label: "Explore Network",
    href: marketingChildPath(
      ROUTES.services,
      "network-enterprise-connectivity",
    ),
  },
} as const;
