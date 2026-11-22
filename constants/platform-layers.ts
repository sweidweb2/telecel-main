import {
  SERVICE_OFFERS,
  type ServiceOfferIcon,
} from "@/constants/service-offers";

/**
 * Five platform service layers — interactive stack on `/platform`.
 * Sourced from the shared `SERVICE_OFFERS` catalog.
 */
export const PLATFORM_LAYERS = SERVICE_OFFERS.map((offer) => ({
  key: offer.key,
  title: offer.title,
  tag: offer.tag,
  description: offer.description,
  icon: offer.icon,
}));

export type PlatformLayer = (typeof PLATFORM_LAYERS)[number];
export type PlatformLayerIcon = ServiceOfferIcon;
