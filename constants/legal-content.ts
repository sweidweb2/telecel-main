import { ROUTES } from "@/constants/routes";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type LegalDocument = {
  path: string;
  title: string;
  summary: string;
  /** ISO date (YYYY-MM-DD) shown as "Last updated". */
  updated: string;
  sections: readonly LegalSection[];
};

const UPDATED = "2026-11-19";

export const PRIVACY_POLICY: LegalDocument = {
  path: ROUTES.privacy,
  title: "Privacy Policy",
  summary:
    "How Telecel Global collects, uses and protects the information you share with us through this website.",
  updated: UPDATED,
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      paragraphs: [
        "This website is operated by Telecel Global Services (“Telecel Global”, “we”, “us”). We are responsible for the personal information collected through it.",
      ],
    },
    {
      id: "what-we-collect",
      title: "Information we collect",
      paragraphs: [
        "You can browse this website without telling us who you are. We only collect personal information when you choose to contact us. Through the contact form we collect:",
      ],
      bullets: [
        "Your name, company, role and business email address.",
        "Your country, area of interest, preferred contact method and the details of your request.",
        "Technical information needed to protect the form from abuse, such as your IP address and a spam-protection check result.",
      ],
    },
    {
      id: "how-we-use",
      title: "How we use your information",
      paragraphs: ["We use the information you provide only to:"],
      bullets: [
        "Respond to your inquiry and route it to the right team.",
        "Follow up about the services or demo you asked about.",
        "Keep the website secure and prevent spam and misuse.",
        "Meet our legal and regulatory obligations.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and tracking",
      paragraphs: [
        "We do not use advertising, analytics or tracking cookies on this website, and we do not build visitor profiles.",
        "Only strictly necessary cookies are set when authorised staff sign in to the administration portal, to keep their session secure. When you submit the contact form, Cloudflare Turnstile runs a spam check that may process technical data about your browser. If you choose a light or dark theme, that preference is stored only in your own browser.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing your information",
      paragraphs: [
        "We do not sell or rent your personal information. We share it only with service providers that host and secure this website and its database, under contracts that require them to protect it, or when the law requires us to.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      paragraphs: [
        "We keep inquiry details for as long as needed to handle your request and any resulting business relationship, and then delete or anonymise them unless we must keep them longer by law.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We protect your information with encryption in transit, restricted staff access and rate limiting. No method of transmission or storage is completely secure, but we work to keep your data safe.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      paragraphs: [
        "Depending on where you live, you may have the right to access, correct or delete your personal information, or to object to how we use it. To make a request, contact us using the details below.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: [
        "We may update this policy from time to time. The date at the top of this page shows when it was last changed.",
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      paragraphs: [
        "For any privacy question or request, reach us through the contact page and choose the option that best fits your request.",
      ],
    },
  ],
};

export const TERMS_OF_USE: LegalDocument = {
  path: ROUTES.terms,
  title: "Terms of Use",
  summary:
    "The terms that apply when you visit and use the Telecel Global website.",
  updated: UPDATED,
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of these terms",
      paragraphs: [
        "By using this website you agree to these Terms of Use. If you do not agree, please do not use the website.",
      ],
    },
    {
      id: "use",
      title: "Using the website",
      paragraphs: ["You agree not to:"],
      bullets: [
        "Use the website in a way that breaks any law or regulation.",
        "Try to gain unauthorised access to the website, its servers or the administration portal.",
        "Send spam, malicious code or automated requests that disrupt the website.",
        "Submit false or misleading information through the contact form.",
      ],
    },
    {
      id: "information",
      title: "Information on this website",
      paragraphs: [
        "The content on this website is provided for general information about Telecel Global and its services. It does not form an offer or a contract. Specific services are governed by separate written agreements.",
        "We work to keep the content accurate and current, but we do not guarantee that it is complete or free of errors.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      paragraphs: [
        "The Telecel name, logos, text, graphics and other content on this website belong to Telecel Global or its licensors. You may view and share pages for personal or internal business use, but you may not copy, modify or reuse them commercially without our written permission.",
      ],
    },
    {
      id: "links",
      title: "Links to other websites",
      paragraphs: [
        "This website may link to websites run by others. We are not responsible for their content or privacy practices.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      paragraphs: [
        "To the extent permitted by law, Telecel Global is not liable for any loss arising from your use of, or inability to use, this website or its content.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      paragraphs: [
        "Our Privacy Policy explains how we handle personal information you share through this website.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      paragraphs: [
        "We may update these terms at any time. The date at the top of this page shows when they were last changed. Continuing to use the website means you accept the updated terms.",
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      paragraphs: [
        "If you have questions about these terms, reach us through the contact page.",
      ],
    },
  ],
};
