import type { Locale } from "@/constants/locales";

export type ApplyLabels = {
  formTitle: string;
  formDescription: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  sectorLabel: string;
  sectorPlaceholder: string;
  countryLabel: string;
  countryPlaceholder: string;
  pitchLabel: string;
  pitchPlaceholder: string;
  consentLabel: string;
  submitLabel: string;
  submittingLabel: string;
  successToast: string;
  turnstileHint: string;
};

const EN: ApplyLabels = {
  formTitle: "Register your interest",
  formDescription:
    "Share a short profile of your venture. The ASIP team will review submissions for each programme cycle.",
  nameLabel: "Full name",
  namePlaceholder: "Your full name",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  phoneLabel: "Phone",
  phonePlaceholder: "+233 20 000 0000",
  companyLabel: "Company / startup name",
  companyPlaceholder: "Your venture name",
  sectorLabel: "Sector",
  sectorPlaceholder: "e.g. Fintech, Healthtech, Telecom",
  countryLabel: "Country",
  countryPlaceholder: "Country of operation",
  pitchLabel: "Short pitch",
  pitchPlaceholder:
    "Describe the problem, your solution, and where you are today (20–1000 characters).",
  consentLabel:
    "I agree that ASIP may store and use this information to review my interest in the programme.",
  submitLabel: "Submit interest",
  submittingLabel: "Submitting…",
  successToast: "Thank you — your interest has been registered.",
  turnstileHint: "Complete the security check before submitting.",
};

const FR: ApplyLabels = {
  formTitle: "Manifester votre intérêt",
  formDescription:
    "Présentez brièvement votre entreprise. L’équipe ASIP examinera les candidatures pour chaque cycle.",
  nameLabel: "Nom complet",
  namePlaceholder: "Votre nom complet",
  emailLabel: "E-mail",
  emailPlaceholder: "vous@exemple.com",
  phoneLabel: "Téléphone",
  phonePlaceholder: "+233 20 000 0000",
  companyLabel: "Nom de l’entreprise / startup",
  companyPlaceholder: "Nom de votre entreprise",
  sectorLabel: "Secteur",
  sectorPlaceholder: "ex. Fintech, Healthtech, Télécom",
  countryLabel: "Pays",
  countryPlaceholder: "Pays d’activité",
  pitchLabel: "Court message",
  pitchPlaceholder:
    "Décrivez le problème, votre solution et votre stade actuel (20–1000 caractères).",
  consentLabel:
    "J’accepte qu’ASIP conserve et utilise ces informations pour examiner mon intérêt pour le programme.",
  submitLabel: "Envoyer",
  submittingLabel: "Envoi…",
  successToast: "Merci — votre intérêt a bien été enregistré.",
  turnstileHint: "Complétez la vérification de sécurité avant d’envoyer.",
};

export function applyLabelsFor(locale: Locale): ApplyLabels {
  return locale === "fr" ? FR : EN;
}
