import type { Locale } from "@/constants/locales";
import type { LegalPageCopy, LegalPageSlug } from "@/types/marketing-page";

type LegalCopy = Record<LegalPageSlug, LegalPageCopy>;

const en: LegalCopy = {
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    description:
      "These placeholder terms describe how visitors may use the Africa Startup Initiative Program (ASIP) website and related services.",
    lastUpdated: "Last updated: 26 August 2026 (draft)",
    notice:
      "Draft content only — replace with Telecel-approved Terms of Service before launch.",
    sections: [
      {
        title: "1. Acceptance of terms",
        paragraphs: [
          "By accessing or using this website, you agree to these Terms of Service and to any additional guidelines we publish on the site. If you do not agree, please do not use the site.",
          "We may update these terms from time to time. Continued use after changes are posted means you accept the revised terms.",
        ],
      },
      {
        title: "2. About ASIP",
        paragraphs: [
          "ASIP is a Telecel Group initiative that supports African technology ventures through acceleration, ecosystem access, and visibility. Information on this site is provided for general programme communication and does not create a binding offer unless we expressly say so in writing.",
        ],
      },
      {
        title: "3. Accounts and applications",
        paragraphs: [
          "If you create an account or submit a registration of interest, you must provide accurate information and keep your credentials secure. You are responsible for activity under your account.",
          "We may refuse, suspend, or remove access where we reasonably believe these terms have been breached or where programme capacity or eligibility rules require it.",
        ],
      },
      {
        title: "4. Acceptable use",
        paragraphs: [
          "You agree not to misuse the site — including attempting unauthorised access, disrupting services, scraping content at scale without permission, or submitting unlawful, harmful, or misleading material.",
          "Programme materials, branding, and site content remain the property of Telecel Group or its licensors and may not be reused commercially without prior written consent.",
        ],
      },
      {
        title: "5. Disclaimers and limitation of liability",
        paragraphs: [
          "The site and programme information are provided on an “as is” basis. We do not guarantee uninterrupted availability, error-free content, or any particular programme outcome for applicants or partners.",
          "To the fullest extent permitted by law, Telecel Group and its affiliates are not liable for indirect, incidental, or consequential losses arising from use of the site. Nothing in these terms excludes liability that cannot be limited under applicable law.",
        ],
      },
      {
        title: "6. Contact",
        paragraphs: [
          "Questions about these terms can be sent through the Contact page on this website. Formal legal notices should be directed to the address Telecel Group designates for that purpose.",
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    description:
      "This placeholder policy explains how ASIP may collect, use, and protect personal information when you use the website or related programme services.",
    lastUpdated: "Last updated: 26 August 2026 (draft)",
    notice:
      "Draft content only — replace with Telecel-approved Privacy Policy before launch.",
    sections: [
      {
        title: "1. Who we are",
        paragraphs: [
          "ASIP is operated as part of Telecel Group’s programmes. This draft policy describes privacy practices for the public website, interest registrations, and related contact forms.",
        ],
      },
      {
        title: "2. Information we may collect",
        paragraphs: [
          "We may collect information you provide directly — such as name, email, organisation, country, and message content when you contact us or register interest.",
          "We may also collect technical data such as device type, browser, approximate location, and pages visited, including via cookies or similar technologies where consent is required.",
        ],
      },
      {
        title: "3. How we use information",
        paragraphs: [
          "We use personal data to operate the site, respond to enquiries, administer programme applications, improve the experience, and meet legal or security obligations.",
          "Marketing or analytics tools that are not strictly necessary will only run after you provide the required consent through our cookie preference controls.",
        ],
      },
      {
        title: "4. Sharing and retention",
        paragraphs: [
          "We may share data with trusted service providers who help us host, analyse, or communicate (for example email or cloud infrastructure), under appropriate agreements.",
          "We retain personal data only as long as needed for the purposes above, or as required by law, then delete or anonymise it where practicable.",
        ],
      },
      {
        title: "5. Your choices and rights",
        paragraphs: [
          "Depending on applicable law, you may have rights to access, correct, delete, or restrict processing of your personal data, or to object to certain uses.",
          "You can manage non-essential cookies through the site’s cookie preferences. To exercise privacy rights, contact us via the Contact page.",
        ],
      },
      {
        title: "6. Changes to this policy",
        paragraphs: [
          "We may update this Privacy Policy periodically. The “last updated” date above will change when a new version is published. Material changes may also be highlighted on the site.",
        ],
      },
    ],
  },
};

const fr: LegalCopy = {
  terms: {
    eyebrow: "Mentions légales",
    title: "Conditions d’utilisation",
    description:
      "Ces conditions provisoires décrivent comment les visiteurs peuvent utiliser le site du Programme africain d’initiative pour les startups (ASIP) et les services associés.",
    lastUpdated: "Dernière mise à jour : 26 août 2026 (brouillon)",
    notice:
      "Contenu provisoire — à remplacer par les Conditions d’utilisation approuvées par Telecel avant le lancement.",
    sections: [
      {
        title: "1. Acceptation des conditions",
        paragraphs: [
          "En accédant à ce site ou en l’utilisant, vous acceptez les présentes Conditions d’utilisation ainsi que toute consigne supplémentaire publiée sur le site. Si vous n’êtes pas d’accord, veuillez ne pas utiliser le site.",
          "Nous pouvons mettre à jour ces conditions de temps à autre. La poursuite de l’utilisation après publication des modifications vaut acceptation des conditions révisées.",
        ],
      },
      {
        title: "2. À propos d’ASIP",
        paragraphs: [
          "ASIP est une initiative du Groupe Telecel qui soutient les entreprises technologiques africaines par l’accélération, l’accès à l’écosystème et la visibilité. Les informations du site servent à la communication du programme et ne constituent pas une offre engageante sauf mention écrite contraire.",
        ],
      },
      {
        title: "3. Comptes et candidatures",
        paragraphs: [
          "Si vous créez un compte ou soumettez une manifestation d’intérêt, vous devez fournir des informations exactes et protéger vos identifiants. Vous êtes responsable de l’activité réalisée sous votre compte.",
          "Nous pouvons refuser, suspendre ou retirer l’accès lorsque nous estimons raisonnablement que ces conditions ont été enfreintes, ou lorsque la capacité ou les règles d’éligibilité du programme l’exigent.",
        ],
      },
      {
        title: "4. Utilisation acceptable",
        paragraphs: [
          "Vous vous engagez à ne pas faire un usage abusif du site — notamment tentatives d’accès non autorisé, perturbation des services, extraction massive de contenus sans permission, ou envoi de contenus illicites, nuisibles ou trompeurs.",
          "Les supports du programme, la marque et le contenu du site restent la propriété du Groupe Telecel ou de ses concédants et ne peuvent être réutilisés à des fins commerciales sans accord écrit préalable.",
        ],
      },
      {
        title: "5. Avertissements et limitation de responsabilité",
        paragraphs: [
          "Le site et les informations du programme sont fournis « en l’état ». Nous ne garantissons ni une disponibilité ininterrompue, ni l’absence d’erreurs, ni un résultat particulier pour les candidats ou partenaires.",
          "Dans toute la mesure permise par la loi, le Groupe Telecel et ses affiliés ne sont pas responsables des pertes indirectes, accessoires ou consécutives liées à l’utilisation du site. Rien dans ces conditions n’exclut une responsabilité qui ne peut être limitée au regard du droit applicable.",
        ],
      },
      {
        title: "6. Contact",
        paragraphs: [
          "Les questions relatives à ces conditions peuvent être envoyées via la page Contact de ce site. Les notifications juridiques formelles doivent être adressées à l’adresse désignée par le Groupe Telecel à cet effet.",
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Mentions légales",
    title: "Politique de confidentialité",
    description:
      "Cette politique provisoire explique comment ASIP peut collecter, utiliser et protéger les données personnelles lorsque vous utilisez le site ou les services du programme.",
    lastUpdated: "Dernière mise à jour : 26 août 2026 (brouillon)",
    notice:
      "Contenu provisoire — à remplacer par la Politique de confidentialité approuvée par Telecel avant le lancement.",
    sections: [
      {
        title: "1. Qui nous sommes",
        paragraphs: [
          "ASIP est opéré dans le cadre des programmes du Groupe Telecel. Cette politique provisoire décrit les pratiques de confidentialité du site public, des manifestations d’intérêt et des formulaires de contact associés.",
        ],
      },
      {
        title: "2. Informations susceptibles d’être collectées",
        paragraphs: [
          "Nous pouvons collecter les informations que vous fournissez directement — nom, e-mail, organisation, pays et contenu des messages lorsque vous nous contactez ou manifestez votre intérêt.",
          "Nous pouvons également collecter des données techniques telles que le type d’appareil, le navigateur, une localisation approximative et les pages consultées, y compris via des cookies ou technologies similaires lorsque le consentement est requis.",
        ],
      },
      {
        title: "3. Comment nous utilisons les informations",
        paragraphs: [
          "Nous utilisons les données personnelles pour faire fonctionner le site, répondre aux demandes, administrer les candidatures, améliorer l’expérience et respecter nos obligations légales ou de sécurité.",
          "Les outils marketing ou d’analyse non strictement nécessaires ne s’exécutent qu’après le consentement requis via les préférences de cookies du site.",
        ],
      },
      {
        title: "4. Partage et conservation",
        paragraphs: [
          "Nous pouvons partager des données avec des prestataires de confiance qui nous aident à héberger, analyser ou communiquer (par exemple e-mail ou infrastructure cloud), dans le cadre d’accords appropriés.",
          "Nous conservons les données personnelles uniquement aussi longtemps que nécessaire aux finalités ci-dessus, ou selon la loi, puis les supprimons ou les anonymisons lorsque c’est possible.",
        ],
      },
      {
        title: "5. Vos choix et droits",
        paragraphs: [
          "Selon le droit applicable, vous pouvez disposer de droits d’accès, de rectification, de suppression ou de limitation du traitement de vos données, ou d’opposition à certains usages.",
          "Vous pouvez gérer les cookies non essentiels via les préférences de cookies du site. Pour exercer vos droits, contactez-nous via la page Contact.",
        ],
      },
      {
        title: "6. Modifications de cette politique",
        paragraphs: [
          "Nous pouvons mettre à jour cette Politique de confidentialité périodiquement. La date de « dernière mise à jour » ci-dessus changera lors de la publication d’une nouvelle version. Les changements importants pourront aussi être signalés sur le site.",
        ],
      },
    ],
  },
};

export function legalCopyFor(locale: Locale, slug: LegalPageSlug): LegalPageCopy {
  return (locale === "fr" ? fr : en)[slug];
}
