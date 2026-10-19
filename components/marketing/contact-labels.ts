import type { Locale } from "@/constants/locales";

export type ContactLabels = {
  infoTitle: string;
  infoDescription: string;
  addressLabel: string;
  emailLabel: string;
  phoneLabel: string;
  formTitle: string;
  formDescription: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneFieldLabel: string;
  phonePlaceholder: string;
  emailFieldLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successToast: string;
  turnstileHint: string;
};

const EN: ContactLabels = {
  infoTitle: "Contact details",
  infoDescription: "Reach the ASIP team by post, email or phone.",
  addressLabel: "Address",
  emailLabel: "Email",
  phoneLabel: "Phone number",
  formTitle: "Send a message",
  formDescription: "Tell us how we can help. We will get back to you shortly.",
  nameLabel: "Name",
  namePlaceholder: "Your name",
  phoneFieldLabel: "Phone",
  phonePlaceholder: "Your phone number",
  emailFieldLabel: "Email",
  emailPlaceholder: "you@example.com",
  subjectLabel: "Subject",
  subjectPlaceholder: "How can we help?",
  messageLabel: "Message",
  messagePlaceholder: "Write your message (at least 20 characters)",
  submitLabel: "Send message",
  submittingLabel: "Sending…",
  successToast: "Thank you — your message has been sent.",
  turnstileHint: "Complete the security check before sending.",
};

const FR: ContactLabels = {
  infoTitle: "Coordonnées",
  infoDescription:
    "Contactez l’équipe ASIP par courrier, e-mail ou téléphone.",
  addressLabel: "Adresse",
  emailLabel: "E-mail",
  phoneLabel: "Numéro de téléphone",
  formTitle: "Envoyer un message",
  formDescription:
    "Dites-nous comment nous pouvons vous aider. Nous vous répondrons rapidement.",
  nameLabel: "Nom",
  namePlaceholder: "Votre nom",
  phoneFieldLabel: "Téléphone",
  phonePlaceholder: "Votre numéro de téléphone",
  emailFieldLabel: "E-mail",
  emailPlaceholder: "vous@exemple.com",
  subjectLabel: "Objet",
  subjectPlaceholder: "Comment pouvons-nous vous aider ?",
  messageLabel: "Message",
  messagePlaceholder: "Écrivez votre message (au moins 20 caractères)",
  submitLabel: "Envoyer le message",
  submittingLabel: "Envoi…",
  successToast: "Merci — votre message a bien été envoyé.",
  turnstileHint: "Complétez la vérification de sécurité avant d’envoyer.",
};

export function contactLabelsFor(locale: Locale): ContactLabels {
  return locale === "fr" ? FR : EN;
}
