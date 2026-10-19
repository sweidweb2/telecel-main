import type { Locale } from "@/constants/locales";
import type { PublicPageSlug } from "@/constants/public-pages";
import { authPath, publicPath } from "@/constants/routes";

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterSocialLink = {
  href: string;
  label: string;
};

export type SiteFooterLabels = {
  brand: string;
  tagline: string;
  exploreHeading: string;
  programmeHeading: string;
  connectHeading: string;
  explore: FooterLink[];
  programme: FooterLink[];
  connect: FooterLink[];
  socialHeading: string;
  social: FooterSocialLink[];
  copyright: string;
  legal: FooterLink[];
};

function links(
  locale: Locale,
  entries: { slug: PublicPageSlug; label: string }[]
): FooterLink[] {
  return entries.map(({ slug, label }) => ({
    href: publicPath(locale, slug),
    label,
  }));
}

export function enFooterLabels(): SiteFooterLabels {
  return {
    brand: "ASIP",
    tagline:
      "Africa Startup Initiative Program — Telecel Group’s platform for African technology ventures.",
    exploreHeading: "Explore",
    programmeHeading: "Programme",
    connectHeading: "Connect",
    explore: links("en", [
      { slug: "", label: "Home" },
      { slug: "about", label: "About" },
      { slug: "portfolio", label: "Portfolio" },
      { slug: "insights", label: "Insights" },
    ]),
    programme: [
      { href: publicPath("en", "programme"), label: "The programme" },
      { href: `${publicPath("en", "programme")}#impact`, label: "Impact" },
      { href: publicPath("en", "apply"), label: "Register interest" },
      { href: publicPath("en", "faq"), label: "FAQ" },
    ],
    connect: [
      { href: publicPath("en", "contact"), label: "Contact" },
      { href: `${publicPath("en", "about")}#partners`, label: "Partner with us" },
      { href: authPath("en", "login"), label: "Login" },
      { href: authPath("en", "signup"), label: "Register" },
    ],
    socialHeading: "Follow",
    social: [
      { href: "https://www.linkedin.com", label: "LinkedIn" },
      { href: "https://x.com", label: "X" },
      { href: "https://www.youtube.com", label: "YouTube" },
    ],
    copyright: `© ${new Date().getFullYear()} Telecel Group. All rights reserved.`,
    legal: links("en", [
      { slug: "terms", label: "Terms of Service" },
      { slug: "privacy", label: "Privacy Policy" },
    ]),
  };
}

export function frFooterLabels(): SiteFooterLabels {
  return {
    brand: "ASIP",
    tagline:
      "Programme africain d’initiative pour les startups — la plateforme du Groupe Telecel pour les entreprises technologiques africaines.",
    exploreHeading: "Explorer",
    programmeHeading: "Programme",
    connectHeading: "Contact",
    explore: links("fr", [
      { slug: "", label: "Accueil" },
      { slug: "about", label: "À propos" },
      { slug: "portfolio", label: "Portefeuille" },
      { slug: "insights", label: "Perspectives" },
    ]),
    programme: [
      { href: publicPath("fr", "programme"), label: "Le programme" },
      { href: `${publicPath("fr", "programme")}#impact`, label: "Impact" },
      { href: publicPath("fr", "apply"), label: "Manifestez votre intérêt" },
      { href: publicPath("fr", "faq"), label: "FAQ" },
    ],
    connect: [
      { href: publicPath("fr", "contact"), label: "Nous contacter" },
      {
        href: `${publicPath("fr", "about")}#partners`,
        label: "Devenir partenaire",
      },
      { href: authPath("fr", "login"), label: "Connexion" },
      { href: authPath("fr", "signup"), label: "Inscription" },
    ],
    socialHeading: "Suivre",
    social: [
      { href: "https://www.linkedin.com", label: "LinkedIn" },
      { href: "https://x.com", label: "X" },
      { href: "https://www.youtube.com", label: "YouTube" },
    ],
    copyright: `© ${new Date().getFullYear()} Groupe Telecel. Tous droits réservés.`,
    legal: links("fr", [
      { slug: "terms", label: "Conditions d’utilisation" },
      { slug: "privacy", label: "Politique de confidentialité" },
    ]),
  };
}
