import { SERVICE_PILLARS } from "@/constants/home-content";
import type { ContactMethod, InquiryIntent, InquiryStatus } from "@/types/inquiry";

/** Consent copy version stored with each submission (bump when wording changes). */
export const CONTACT_CONSENT_VERSION = "contact-v1";

export const INQUIRY_INTENTS: readonly {
  value: InquiryIntent;
  label: string;
}[] = [
  { value: "sales", label: "Talk to Sales" },
  { value: "demo", label: "Request a Demo" },
  { value: "general", label: "General / account help" },
] as const;

export const CONTACT_METHODS: readonly {
  value: ContactMethod;
  label: string;
}[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "video_call", label: "Video call" },
] as const;

export const INQUIRY_STATUSES: readonly {
  value: InquiryStatus;
  label: string;
}[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
] as const;

export const AREA_OF_INTEREST_OPTIONS: readonly {
  value: string;
  label: string;
}[] = [
  ...SERVICE_PILLARS.map((pillar) => ({
    value: pillar.slug,
    label: pillar.title,
  })),
  { value: "other", label: "Other" },
] as const;

/** Common ISO 3166-1 alpha-2 options for the public form. */
export const COUNTRY_OPTIONS: readonly {
  value: string;
  label: string;
}[] = [
  { value: "AE", label: "United Arab Emirates" },
  { value: "AO", label: "Angola" },
  { value: "BE", label: "Belgium" },
  { value: "BR", label: "Brazil" },
  { value: "CD", label: "DR Congo" },
  { value: "CI", label: "Côte d'Ivoire" },
  { value: "CM", label: "Cameroon" },
  { value: "DE", label: "Germany" },
  { value: "EG", label: "Egypt" },
  { value: "ES", label: "Spain" },
  { value: "FR", label: "France" },
  { value: "GB", label: "United Kingdom" },
  { value: "GH", label: "Ghana" },
  { value: "IN", label: "India" },
  { value: "KE", label: "Kenya" },
  { value: "MA", label: "Morocco" },
  { value: "NG", label: "Nigeria" },
  { value: "NL", label: "Netherlands" },
  { value: "PT", label: "Portugal" },
  { value: "SN", label: "Senegal" },
  { value: "TZ", label: "Tanzania" },
  { value: "UG", label: "Uganda" },
  { value: "US", label: "United States" },
  { value: "ZA", label: "South Africa" },
  { value: "ZW", label: "Zimbabwe" },
] as const;

export const CONTACT_CONSENT_LABEL =
  "I agree that Telecel Global may use my details to respond to this inquiry.";
