import type { Locale } from "@/constants/locales";
import type {
  MarketingContentSlug,
  MarketingPageCopy,
} from "@/types/marketing-page";

type MarketingCopy = Record<MarketingContentSlug, MarketingPageCopy>;

const en: MarketingCopy = {
  "": {
    eyebrow: "Africa Startup Initiative Program",
    title: "Helping African technology ventures grow with confidence",
    description: "A Telecel Group initiative connecting founders with structured acceleration, ecosystem access, and market visibility.",
    notice: "Programme information is being prepared for final Telecel approval.",
    sectionTitle: "Built around the founder journey",
    sectionDescription: "Explore the programme, discover participating ventures, and follow the stories shaping Africa’s technology ecosystem.",
    cards: [
      { title: "Structured acceleration", description: "Practical support designed around the needs and maturity of each venture." },
      { title: "Ecosystem access", description: "Connections to mentors, partners, peers, and relevant markets." },
      { title: "Credible visibility", description: "A platform for sharing verified progress, lessons, and founder stories." },
    ],
    cta: { slug: "programme", label: "Explore the programme" },
  },
  about: {
    eyebrow: "About ASIP",
    title: "A platform for African technology ventures",
    description:
      "ASIP is a Telecel Group initiative created to support founders through acceleration, ecosystem access, and market visibility.",
    notice: "Final history, imagery, names, and milestones require Telecel approval.",
    sectionTitle: "Purpose and direction",
    sectionDescription:
      "The programme is designed to help promising ventures strengthen their foundations, reach useful networks, and communicate their progress responsibly.",
    cards: [],
    cta: { slug: "contact", label: "Become a partner" },
    partnersSection: {
      eyebrow: "Ecosystem",
      title: "Partners",
      description:
        "Leading organizations across the ecosystem support ASIP founders.",
    },
    aboutNarrative: {
      story: {
        title: "Our story",
        eyebrow: "Telecel Group CSR",
        paragraphs: [
          "ASIP is a program launched by Telecel Group as part of its CSR activities. ASIP contributes in a meaningful way to the African continent by supporting young startups whose innovative ideas are creating a difference in their communities, exposing them to international organizations, and bridging knowledge and expertise so they can attract partners that add value to their startups.",
        ],
        features: [
          {
            icon: "rocket",
            title: "Accelerator",
            description:
              "Coaching, mentoring, workshops, market access, and education for early-stage founders.",
            slug: "programme",
            linkLabel: "Learn more",
          },
          {
            icon: "trending-up",
            title: "Investment",
            description:
              "Access to investors, grants, angel capital, and venture funding pathways.",
            slug: "programme",
            linkLabel: "Learn more",
          },
          {
            icon: "globe",
            title: "Ecosystem",
            description:
              "Exposure to international organizations and partners who add strategic value.",
            slug: "about",
            linkLabel: "Learn more",
          },
          {
            icon: "heart",
            title: "Community impact",
            description:
              "Supporting startups whose ideas create measurable difference in African communities.",
            slug: "programme",
            hash: "impact",
            linkLabel: "Learn more",
          },
        ],
        stats: [
          { icon: "rocket", value: 50, suffix: "+", label: "Startups supported" },
          { icon: "map-pin", value: 12, suffix: "+", label: "Markets reached" },
          { icon: "users", value: 5, suffix: "+", label: "Programme cycles" },
          { icon: "star", value: 95, suffix: "%", label: "Founder satisfaction" },
        ],
        imageCta: { slug: "programme", label: "Explore the programme" },
        statsNotice: "Draft figures — final numbers require Telecel approval.",
        bottomCta: {
          title: "Ready to grow with ASIP?",
          slug: "apply",
          label: "Register your interest",
        },
      },
      vision: {
        title: "Vision",
        imageLabel: "Vision imagery — pending Telecel approval",
        paragraphs: [
          "ASIP will be recognized as a leading Startup Initiative Program that provides startups with a level of support that surpasses their highest expectations.",
          "Our ability to leverage relationships on behalf of our program participants to provide them with boundless access to investors and markets will be unmatched.",
          "The startups will be transformed into well-established firms that introduce the most innovative solutions in Africa and become drivers of economic growth in the community.",
        ],
      },
      mission: {
        title: "Mission",
        imageLabel: "Mission imagery — pending Telecel approval",
        paragraphs: [
          "Africa Startup Initiative Program aims to contribute in a meaningful way to the African community by supporting young startups in Africa whose innovative ideas are creating a difference in their communities.",
          "Our goal is to discover Africa’s most talented entrepreneurs operating in the fields of telecom and technology, and help them create successful companies at scale. We support startups via our Accelerator and Investment Programs. The Accelerator program provides coaching and mentoring, workshops, access to markets, and education. The Investment Program emphasizes access to investors, funding, grants, angel investments, and venture capital.",
          "We want to expose pre-seed companies to international organizations and bridge knowledge and expertise to attract partners that can add value and transform entrepreneurial concepts into sustainable businesses that serve the community and society at large.",
        ],
      },
    },
  },
  programme: {
    eyebrow: "Programme",
    title: "A founder journey designed for growth",
    description:
      "A clear overview of who the programme is for, how participation works, and what founders can expect.",
    notice:
      "Eligibility, dates, and delivery details will be published once approved.",
    sectionTitle: "A simple programme pathway",
    sectionDescription:
      "The experience moves from initial interest and selection to focused acceleration and ecosystem access.",
    cards: [
      {
        title: "01 · Register interest",
        description:
          "Share a concise profile of the founding team, venture, market, and current progress.",
      },
      {
        title: "02 · Review and selection",
        description:
          "Applications are assessed against the published criteria for the relevant cycle.",
      },
      {
        title: "03 · Programme journey",
        description:
          "Selected founders take part in structured sessions, mentoring, and peer exchange.",
      },
      {
        title: "04 · Market access",
        description:
          "Relevant introductions and visibility help ventures prepare for their next stage.",
      },
    ],
    cta: { slug: "apply", label: "Register your interest" },
    impactSection: {
      eyebrow: "Impact",
      title: "Making progress visible and credible",
      description:
        "Impact reporting combines measurable outcomes with the founder and programme stories that explain them. Figures remain unpublished until reviewed and approved.",
      notice:
        "Figures will remain unpublished until they have been reviewed and approved.",
      cards: [
        {
          title: "Ventures supported",
          description:
            "Participation and cohort figures will be reported from verified programme records.",
        },
        {
          title: "Markets reached",
          description:
            "Portfolio expansion will be presented with clear definitions and reporting periods.",
        },
        {
          title: "Founder outcomes",
          description:
            "Stories will connect business progress with lessons from each founder journey.",
        },
      ],
    },
  },
  portfolio: {
    eyebrow: "Portfolio",
    title: "Ventures across the ASIP ecosystem",
    description:
      "Discover the companies supported by ASIP across cohorts, countries, and technology sectors.",
    notice:
      "Profiles and performance information are published only after verification.",
    sectionTitle: "A growing venture archive",
    sectionDescription:
      "The portfolio will make it easier to discover founders, understand their solutions, and follow their progress.",
    cards: [
      {
        title: "Across cohorts",
        description:
          "Explore ventures from each programme cycle as profiles are approved.",
      },
      {
        title: "Across markets",
        description:
          "See the countries and communities where portfolio companies are building.",
      },
      {
        title: "Across sectors",
        description:
          "Discover solutions in financial services, health, climate, commerce, and more.",
      },
    ],
    cta: { slug: "programme", label: "Explore our impact", hash: "impact" },
    ctaSection: {
      title: "Explore our impact",
      description:
        "See how ASIP ventures contribute to communities across Africa — with verified reach, founder outcomes, and programme stories.",
      slug: "programme",
      hash: "impact",
      label: "Explore our impact",
    },
  },
  apply: {
    eyebrow: "For founders", title: "Register your interest", description: "Tell ASIP about your team, technology venture, market, and current stage.", notice: "Your submission is stored securely and reviewed by the ASIP team for each programme cycle.", sectionTitle: "Prepare your venture profile", sectionDescription: "Before applying, gather a concise description of the problem, your solution, evidence of progress, and the support you need next.", cards: [
      { title: "Team", description: "Introduce the founders and the experience that prepares you to solve this problem." },
      { title: "Solution", description: "Explain the customer problem, your product, and what makes your approach relevant." },
      { title: "Progress", description: "Summarize traction, learning, current stage, and the next milestones you are pursuing." },
    ], cta: { slug: "contact", label: "Ask a question" },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    description:
      "Practical information about the programme, applications, portfolio, and partnerships.",
    notice: "Programme-specific dates and criteria will be updated after approval.",
    sectionTitle: "What founders and partners ask",
    sectionDescription:
      "These answers describe the current programme structure and will evolve with each published cycle.",
    cards: [
      { title: "What is ASIP?", description: "A Telecel Group initiative supporting African technology ventures through acceleration, ecosystem access, and visibility." },
      { title: "Who can register interest?", description: "Technology founders can share their interest; final eligibility is published for each programme cycle." },
      { title: "What support is provided?", description: "The programme combines structured guidance, relevant connections, peer learning, and market visibility." },
      { title: "How can organizations partner?", description: "Prospective partners can contact ASIP to discuss expertise, access, content, and ecosystem collaboration." },
      { title: "How do applications work?", description: "Register interest, get reviewed against cycle criteria, and join the programme if selected." },
      { title: "Is there a cost to participate?", description: "Programme fee details, if any, are published with each cycle. ASIP aims to keep participation accessible for qualifying ventures." },
    ],
    tabsSectionTitle: "Browse by topic",
    tabsSectionDescription:
      "Explore answers grouped by programme, founders, and partners.",
    tabs: [
      {
        id: "programme",
        label: "Programme",
        items: [
          { title: "What is ASIP?", description: "A Telecel Group initiative supporting African technology ventures through acceleration, ecosystem access, and visibility." },
          { title: "What support is provided?", description: "The programme combines structured guidance, relevant connections, peer learning, and market visibility." },
          { title: "Is there a cost to participate?", description: "Programme fee details, if any, are published with each cycle. ASIP aims to keep participation accessible for qualifying ventures." },
        ],
      },
      {
        id: "founders",
        label: "Founders",
        items: [
          { title: "Who can register interest?", description: "Technology founders can share their interest; final eligibility is published for each programme cycle." },
          { title: "How do applications work?", description: "Register interest, get reviewed against cycle criteria, and join the programme if selected." },
        ],
      },
      {
        id: "partners",
        label: "Partners",
        items: [
          { title: "How can organizations partner?", description: "Prospective partners can contact ASIP to discuss expertise, access, content, and ecosystem collaboration." },
        ],
      },
    ],
    ctaSection: {
      title: "Still have questions?",
      description:
        "If you cannot find what you need, contact the ASIP team and we will follow up.",
      slug: "contact",
      label: "Ask another question",
    },
  },
};

const fr: MarketingCopy = {
  "": { eyebrow: "Programme africain d’initiative pour les startups", title: "Aider les entreprises technologiques africaines à grandir avec confiance", description: "Une initiative du Groupe Telecel qui relie les fondateurs à une accélération structurée, à l’écosystème et à une visibilité marché.", notice: "Les informations du programme sont en cours de validation finale par Telecel.", sectionTitle: "Conçu autour du parcours des fondateurs", sectionDescription: "Découvrez le programme, les entreprises participantes et les histoires qui façonnent l’écosystème technologique africain.", cards: [{ title: "Accélération structurée", description: "Un accompagnement pratique adapté aux besoins et à la maturité de chaque entreprise." }, { title: "Accès à l’écosystème", description: "Des liens avec des mentors, partenaires, pairs et marchés pertinents." }, { title: "Visibilité crédible", description: "Une plateforme pour partager des progrès, enseignements et parcours vérifiés." }], cta: { slug: "programme", label: "Découvrir le programme" } },
  about: {
    eyebrow: "À propos d’ASIP",
    title: "Une plateforme pour les entreprises technologiques africaines",
    description:
      "ASIP est une initiative du Groupe Telecel qui accompagne les fondateurs par l’accélération, l’accès à l’écosystème et la visibilité marché.",
    notice: "L’histoire, les images, les noms et les étapes clés nécessitent l’approbation de Telecel.",
    sectionTitle: "Mission et orientation",
    sectionDescription:
      "Le programme aide les entreprises prometteuses à renforcer leurs bases, atteindre des réseaux utiles et communiquer leurs progrès de manière responsable.",
    cards: [],
    cta: { slug: "contact", label: "Devenir partenaire" },
    partnersSection: {
      eyebrow: "Écosystème",
      title: "Partenaires",
      description:
        "Des organisations de premier plan soutiennent les fondateurs ASIP.",
    },
    aboutNarrative: {
      story: {
        title: "Notre histoire",
        eyebrow: "RSE du Groupe Telecel",
        paragraphs: [
          "ASIP est un programme lancé par le Groupe Telecel dans le cadre de ses activités RSE. ASIP contribue de manière significative au continent africain en soutenant les jeunes startups dont les idées innovantes transforment leurs communautés, en les exposant aux organisations internationales et en créant des ponts de connaissances et d’expertise pour qu’elles puissent attirer des partenaires capables d’apporter une réelle valeur à leurs entreprises.",
        ],
        features: [
          {
            icon: "rocket",
            title: "Accélérateur",
            description:
              "Coaching, mentorat, ateliers, accès aux marchés et formation pour les fondateurs en phase initiale.",
            slug: "programme",
            linkLabel: "En savoir plus",
          },
          {
            icon: "trending-up",
            title: "Investissement",
            description:
              "Accès aux investisseurs, subventions, capital providentiel et voies de financement en capital-risque.",
            slug: "programme",
            linkLabel: "En savoir plus",
          },
          {
            icon: "globe",
            title: "Écosystème",
            description:
              "Exposition aux organisations internationales et partenaires qui apportent une valeur stratégique.",
            slug: "about",
            linkLabel: "En savoir plus",
          },
          {
            icon: "heart",
            title: "Impact communautaire",
            description:
              "Soutien aux startups dont les idées créent une différence mesurable dans les communautés africaines.",
            slug: "programme",
            hash: "impact",
            linkLabel: "En savoir plus",
          },
        ],
        stats: [
          { icon: "rocket", value: 50, suffix: "+", label: "Startups accompagnées" },
          { icon: "map-pin", value: 12, suffix: "+", label: "Marchés atteints" },
          { icon: "users", value: 5, suffix: "+", label: "Cycles du programme" },
          { icon: "star", value: 95, suffix: "%", label: "Satisfaction des fondateurs" },
        ],
        imageCta: { slug: "programme", label: "Découvrir le programme" },
        statsNotice:
          "Chiffres provisoires — les données finales nécessitent l’approbation de Telecel.",
        bottomCta: {
          title: "Prêt à grandir avec ASIP ?",
          slug: "apply",
          label: "Manifester votre intérêt",
        },
      },
      vision: {
        title: "Vision",
        imageLabel: "Visuel Vision — en attente d’approbation Telecel",
        paragraphs: [
          "ASIP sera reconnu comme un programme d’initiative pour les startups de référence, offrant un niveau de soutien qui dépasse les attentes les plus élevées des participants.",
          "Notre capacité à mobiliser des relations au profit des participants, pour leur garantir un accès sans limites aux investisseurs et aux marchés, sera inégalée.",
          "Les startups deviendront des entreprises solidement établies, porteuses des solutions les plus innovantes en Afrique et moteurs de la croissance économique dans leurs communautés.",
        ],
      },
      mission: {
        title: "Mission",
        imageLabel: "Visuel Mission — en attente d’approbation Telecel",
        paragraphs: [
          "Le Programme africain d’initiative pour les startups vise à contribuer de manière significative à la communauté africaine en soutenant les jeunes startups dont les idées innovantes transforment leurs communautés.",
          "Notre objectif est de découvrir les entrepreneurs les plus talentueux d’Afrique dans les domaines des télécommunications et de la technologie, et de les aider à bâtir des entreprises prospères à grande échelle. Nous accompagnons les startups via nos programmes d’accélération et d’investissement. Le programme d’accélération offre coaching, mentorat, ateliers, accès aux marchés et formation. Le programme d’investissement met l’accent sur l’accès aux investisseurs, au financement, aux subventions, aux investissements providentiels et au capital-risque.",
          "Nous souhaitons exposer les entreprises en phase pré-amorçage aux organisations internationales et créer des ponts de connaissances et d’expertise pour attirer des partenaires capables de transformer des concepts entrepreneuriaux en entreprises durables au service de la communauté et de la société.",
        ],
      },
    },
  },
  programme: {
    eyebrow: "Programme",
    title: "Un parcours de croissance conçu pour les fondateurs",
    description:
      "Une présentation claire du public concerné, du fonctionnement de la participation et de ce que les fondateurs peuvent attendre.",
    notice:
      "Les critères, dates et modalités seront publiés après validation.",
    sectionTitle: "Un parcours simple",
    sectionDescription:
      "L’expérience va de la manifestation d’intérêt et de la sélection à l’accélération ciblée et à l’accès à l’écosystème.",
    cards: [
      {
        title: "01 · Manifester son intérêt",
        description:
          "Présentez brièvement l’équipe, l’entreprise, le marché et les progrès actuels.",
      },
      {
        title: "02 · Évaluation et sélection",
        description:
          "Les candidatures sont évaluées selon les critères publiés pour le cycle concerné.",
      },
      {
        title: "03 · Parcours du programme",
        description:
          "Les fondateurs sélectionnés participent à des sessions structurées, au mentorat et aux échanges entre pairs.",
      },
      {
        title: "04 · Accès au marché",
        description:
          "Des introductions et une visibilité pertinentes préparent l’entreprise à sa prochaine étape.",
      },
    ],
    cta: { slug: "apply", label: "Manifester votre intérêt" },
    impactSection: {
      eyebrow: "Impact",
      title: "Rendre les progrès visibles et crédibles",
      description:
        "Le suivi d’impact associe les résultats mesurables aux histoires qui les expliquent. Les chiffres restent non publiés jusqu’à examen et approbation.",
      notice:
        "Les chiffres ne seront publiés qu’après examen et approbation.",
      cards: [
        {
          title: "Entreprises accompagnées",
          description:
            "Les chiffres de participation proviendront des dossiers vérifiés du programme.",
        },
        {
          title: "Marchés atteints",
          description:
            "L’expansion sera présentée avec des définitions et périodes de référence claires.",
        },
        {
          title: "Résultats des fondateurs",
          description:
            "Les récits relieront les progrès aux enseignements de chaque parcours.",
        },
      ],
    },
  },
  portfolio: {
    eyebrow: "Portefeuille",
    title: "Les entreprises de l’écosystème ASIP",
    description:
      "Découvrez les entreprises accompagnées par ASIP selon les cohortes, pays et secteurs technologiques.",
    notice:
      "Les profils et résultats ne sont publiés qu’après vérification.",
    sectionTitle: "Une archive d’entreprises en croissance",
    sectionDescription:
      "Le portefeuille facilite la découverte des fondateurs, de leurs solutions et de leurs progrès.",
    cards: [
      {
        title: "Par cohorte",
        description:
          "Explorez les entreprises de chaque cycle à mesure que les profils sont approuvés.",
      },
      {
        title: "Par marché",
        description:
          "Découvrez les pays et communautés où les entreprises construisent leurs solutions.",
      },
      {
        title: "Par secteur",
        description:
          "Explorez la finance, la santé, le climat, le commerce et d’autres domaines.",
      },
    ],
    cta: { slug: "programme", label: "Découvrir notre impact", hash: "impact" },
    ctaSection: {
      title: "Découvrir notre impact",
      description:
        "Découvrez comment les entreprises ASIP contribuent aux communautés en Afrique — portée vérifiée, résultats des fondateurs et histoires du programme.",
      slug: "programme",
      hash: "impact",
      label: "Découvrir notre impact",
    },
  },
  apply: { eyebrow: "Pour les fondateurs", title: "Manifester votre intérêt", description: "Présentez à ASIP votre équipe, votre entreprise technologique, votre marché et votre stade actuel.", notice: "Votre candidature est stockée de façon sécurisée et examinée par l’équipe ASIP pour chaque cycle du programme.", sectionTitle: "Préparez le profil de votre entreprise", sectionDescription: "Rassemblez une description concise du problème, de la solution, des progrès et du soutien recherché.", cards: [{ title: "Équipe", description: "Présentez les fondateurs et l’expérience qui vous prépare à résoudre ce problème." }, { title: "Solution", description: "Expliquez le problème client, votre produit et la pertinence de votre approche." }, { title: "Progrès", description: "Résumez la traction, les apprentissages, le stade actuel et les prochaines étapes." }], cta: { slug: "contact", label: "Poser une question" } },
  faq: {
    eyebrow: "FAQ",
    title: "Questions fréquentes",
    description:
      "Informations pratiques sur le programme, les candidatures, le portefeuille et les partenariats.",
    notice: "Les dates et critères propres au programme seront actualisés après validation.",
    sectionTitle: "Les questions des fondateurs et partenaires",
    sectionDescription:
      "Ces réponses décrivent la structure actuelle et évolueront avec chaque cycle publié.",
    cards: [
      { title: "Qu’est-ce qu’ASIP ?", description: "Une initiative du Groupe Telecel qui soutient les entreprises technologiques africaines par l’accélération, l’accès à l’écosystème et la visibilité." },
      { title: "Qui peut manifester son intérêt ?", description: "Les fondateurs technologiques peuvent se présenter ; les critères définitifs sont publiés pour chaque cycle." },
      { title: "Quel soutien est proposé ?", description: "Le programme associe accompagnement structuré, connexions pertinentes, apprentissage entre pairs et visibilité." },
      { title: "Comment devenir partenaire ?", description: "Les organisations peuvent contacter ASIP pour discuter expertise, accès, contenu et collaboration." },
      { title: "Comment candidater ?", description: "Manifestez votre intérêt, passez l’évaluation du cycle et rejoignez le programme si retenu." },
      { title: "La participation est-elle payante ?", description: "Les modalités de frais, le cas échéant, sont publiées avec chaque cycle. ASIP vise à rendre la participation accessible aux entreprises éligibles." },
    ],
    tabsSectionTitle: "Parcourir par thème",
    tabsSectionDescription:
      "Explorez les réponses regroupées par programme, fondateurs et partenaires.",
    tabs: [
      {
        id: "programme",
        label: "Programme",
        items: [
          { title: "Qu’est-ce qu’ASIP ?", description: "Une initiative du Groupe Telecel qui soutient les entreprises technologiques africaines par l’accélération, l’accès à l’écosystème et la visibilité." },
          { title: "Quel soutien est proposé ?", description: "Le programme associe accompagnement structuré, connexions pertinentes, apprentissage entre pairs et visibilité." },
          { title: "La participation est-elle payante ?", description: "Les modalités de frais, le cas échéant, sont publiées avec chaque cycle. ASIP vise à rendre la participation accessible aux entreprises éligibles." },
        ],
      },
      {
        id: "founders",
        label: "Fondateurs",
        items: [
          { title: "Qui peut manifester son intérêt ?", description: "Les fondateurs technologiques peuvent se présenter ; les critères définitifs sont publiés pour chaque cycle." },
          { title: "Comment candidater ?", description: "Manifestez votre intérêt, passez l’évaluation du cycle et rejoignez le programme si retenu." },
        ],
      },
      {
        id: "partners",
        label: "Partenaires",
        items: [
          { title: "Comment devenir partenaire ?", description: "Les organisations peuvent contacter ASIP pour discuter expertise, accès, contenu et collaboration." },
        ],
      },
    ],
    ctaSection: {
      title: "Vous avez encore des questions ?",
      description:
        "Si vous ne trouvez pas ce qu’il vous faut, contactez l’équipe ASIP et nous vous répondrons.",
      slug: "contact",
      label: "Poser une autre question",
    },
  },
};

export function marketingCopyFor(locale: Locale, slug: MarketingContentSlug) {
  return (locale === "fr" ? fr : en)[slug];
}
