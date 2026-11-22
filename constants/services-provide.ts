import {
  pillarPath,
  SERVICE_OFFERS,
  SERVICES_PROVIDE_EXTRA,
  type ServiceOfferIllustration,
} from "@/constants/service-offers";

/**
 * “What We Provide” cards on the services hub — six abstract product scenes.
 * Five cards share `SERVICE_OFFERS`; the sixth is provide-only.
 */

export type ServicesProvideIllustration = ServiceOfferIllustration;

export type ServicesProvideCard = {
  key: ServicesProvideIllustration;
  title: string;
  description: string;
  href: string;
};

export const SERVICES_PROVIDE = {
  eyebrow: "What We Provide",
  title: "One Network. Every Connection.",
  description:
    "Connectivity, messaging, cloud, IoT, security and voice — one managed platform for every market you serve.",
} as const;

export const SERVICES_PROVIDE_CARDS = [
  ...SERVICE_OFFERS.map((offer) => ({
    key: offer.illustration,
    title: offer.title,
    description: offer.description,
    href: pillarPath(offer.pillarSlug),
  })),
  {
    key: SERVICES_PROVIDE_EXTRA.illustration,
    title: SERVICES_PROVIDE_EXTRA.title,
    description: SERVICES_PROVIDE_EXTRA.description,
    href: pillarPath(SERVICES_PROVIDE_EXTRA.pillarSlug),
  },
] as const satisfies readonly ServicesProvideCard[];
