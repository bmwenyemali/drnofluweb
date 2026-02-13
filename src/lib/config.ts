/**
 * Configuration et constantes du site DRNOFLU
 */

import { NavItem, ChiffreCle, Locale } from "@/lib/types";

// Informations de base du site
export const SITE_CONFIG = {
  name: "DRNOFLU",
  fullName: "Direction des Recettes Non Fiscales du Lualaba",
  description:
    "Site officiel de la Direction des Recettes Non Fiscales du Lualaba - République Démocratique du Congo",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://drnoflu.gouv.cd",
  email: "cellcom@drnoflu.cd",
  telephone: "+243 976 868 417",
  adresse: {
    rue: "Immeuble DRNOFLU, Avenue du 30 juin",
    commune: "Commune de Manika",
    ville: "Kolwezi",
    province: "Lualaba",
    pays: "République Démocratique du Congo",
  },
  coordonnees: {
    latitude: -10.7167,
    longitude: 25.4667,
  },
  reseauxSociaux: {
    facebook: "https://www.facebook.com/profile.php?id=61575034017962",
  },
};

// Configuration Mapbox
export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
  style: "mapbox://styles/mapbox/streets-v12",
  defaultCenter: { lng: 25.4667, lat: -10.7167 }, // Kolwezi
  defaultZoom: 12,
  lualabaCenter: { lng: 25.4667, lat: -10.7167 }, // Centré sur Kolwezi
  lualabaZoom: 10, // Zoom plus proche sur Kolwezi
};

// Points d'intérêt sur la carte
export const MAP_POINTS = {
  siege: {
    id: "siege",
    name: "Siège DRNOFLU",
    description: "Direction des Recettes Non Fiscales du Lualaba",
    coordinates: [25.4667, -10.7167] as [number, number],
    type: "direction" as const,
  },
  pointsRecettes: [
    {
      id: "pr-kolwezi",
      name: "Point de Recette Kolwezi Centre",
      description: "Bureau de perception principal",
      coordinates: [25.47, -10.72] as [number, number],
      type: "recette" as const,
      territoire: "Kolwezi",
    },
    {
      id: "pr-manika",
      name: "Point de Recette Manika",
      description: "Bureau de perception Manika",
      coordinates: [25.45, -10.71] as [number, number],
      type: "recette" as const,
      territoire: "Kolwezi",
    },
    {
      id: "pr-dilala",
      name: "Point de Recette Dilala",
      description: "Bureau de perception Dilala",
      coordinates: [25.48, -10.73] as [number, number],
      type: "recette" as const,
      territoire: "Kolwezi",
    },
    {
      id: "pr-dilolo",
      name: "Point de Recette Dilolo",
      description: "Bureau de perception Dilolo",
      coordinates: [22.35, -10.68] as [number, number],
      type: "recette" as const,
      territoire: "Dilolo",
    },
    {
      id: "pr-kapanga",
      name: "Point de Recette Kapanga",
      description: "Bureau de perception Kapanga",
      coordinates: [22.6, -8.35] as [number, number],
      type: "recette" as const,
      territoire: "Kapanga",
    },
    {
      id: "pr-sandoa",
      name: "Point de Recette Sandoa",
      description: "Bureau de perception Sandoa",
      coordinates: [22.95, -9.7] as [number, number],
      type: "recette" as const,
      territoire: "Sandoa",
    },
    {
      id: "pr-lubudi",
      name: "Point de Recette Lubudi",
      description: "Bureau de perception Lubudi",
      coordinates: [25.85, -9.88] as [number, number],
      type: "recette" as const,
      territoire: "Lubudi",
    },
    {
      id: "pr-mutshatsha",
      name: "Point de Recette Mutshatsha",
      description: "Bureau de perception Mutshatsha",
      coordinates: [25.47, -10.35] as [number, number],
      type: "recette" as const,
      territoire: "Mutshatsha",
    },
    {
      id: "pr-fungurume",
      name: "Point de Recette Fungurume",
      description: "Bureau de perception Fungurume",
      coordinates: [26.31, -10.57] as [number, number],
      type: "recette" as const,
      territoire: "Fungurume",
    },
  ],
  projets: [
    {
      id: "proj-route-kolwezi",
      name: "Route Kolwezi-Likasi",
      description: "Infrastructure routière financée par les recettes - 45 km",
      coordinates: [25.55, -10.6] as [number, number],
      type: "projet" as const,
      territoire: "Kolwezi",
      budget: "2.5M USD",
      statut: "En cours",
    },
    {
      id: "proj-ecole-kolwezi",
      name: "École Primaire de Manika",
      description: "Construction de 12 salles de classe",
      coordinates: [25.42, -10.74] as [number, number],
      type: "projet" as const,
      territoire: "Kolwezi",
      budget: "350K USD",
      statut: "Terminé",
    },
    {
      id: "proj-hopital-dilolo",
      name: "Centre de Santé Dilolo",
      description: "Réhabilitation du centre de santé principal",
      coordinates: [22.33, -10.7] as [number, number],
      type: "projet" as const,
      territoire: "Dilolo",
      budget: "180K USD",
      statut: "Terminé",
    },
    {
      id: "proj-pont-sandoa",
      name: "Pont sur la rivière Lulua",
      description: "Construction d'un pont de 80m",
      coordinates: [22.9, -9.65] as [number, number],
      type: "projet" as const,
      territoire: "Sandoa",
      budget: "1.2M USD",
      statut: "En cours",
    },
    {
      id: "proj-marche-lubudi",
      name: "Marché Central Lubudi",
      description: "Construction du marché couvert",
      coordinates: [25.8, -9.9] as [number, number],
      type: "projet" as const,
      territoire: "Lubudi",
      budget: "420K USD",
      statut: "En cours",
    },
    {
      id: "proj-adduction-fungurume",
      name: "Adduction d'eau Fungurume",
      description: "Réseau d'eau potable pour 15 000 habitants",
      coordinates: [26.28, -10.52] as [number, number],
      type: "projet" as const,
      territoire: "Fungurume",
      budget: "890K USD",
      statut: "Terminé",
    },
    {
      id: "proj-ecole-kapanga",
      name: "Lycée Technique Kapanga",
      description: "Construction d'un lycée technique agricole",
      coordinates: [22.55, -8.38] as [number, number],
      type: "projet" as const,
      territoire: "Kapanga",
      budget: "650K USD",
      statut: "Planifié",
    },
    {
      id: "proj-route-mutshatsha",
      name: "Route Mutshatsha-Kolwezi",
      description: "Réhabilitation de 35 km de route",
      coordinates: [25.5, -10.4] as [number, number],
      type: "projet" as const,
      territoire: "Mutshatsha",
      budget: "1.8M USD",
      statut: "En cours",
    },
  ],
  mines: [
    {
      id: "mine-tenke",
      name: "Zone Minière Tenke-Fungurume",
      description: "Cuivre et Cobalt - Production majeure",
      coordinates: [26.1333, -10.6167] as [number, number],
      type: "mine" as const,
      territoire: "Fungurume",
      minerais: ["Cuivre", "Cobalt"],
      operateur: "CMOC",
    },
    {
      id: "mine-kamoto",
      name: "Zone Minière Kamoto",
      description: "Exploitation cuivre-cobalt Glencore",
      coordinates: [25.4, -10.7] as [number, number],
      type: "mine" as const,
      territoire: "Kolwezi",
      minerais: ["Cuivre", "Cobalt"],
      operateur: "Glencore",
    },
    {
      id: "mine-mutoshi",
      name: "Zone Minière Mutoshi",
      description: "Exploitation artisanale et industrielle",
      coordinates: [25.35, -10.68] as [number, number],
      type: "mine" as const,
      territoire: "Kolwezi",
      minerais: ["Cuivre", "Cobalt"],
      operateur: "Chemaf",
    },
    {
      id: "mine-lubudi",
      name: "Carrières Lubudi",
      description: "Extraction de matériaux de construction",
      coordinates: [25.9, -9.82] as [number, number],
      type: "mine" as const,
      territoire: "Lubudi",
      minerais: ["Pierre", "Sable"],
      operateur: "Divers",
    },
    {
      id: "mine-dilolo-or",
      name: "Zone Aurifère Dilolo",
      description: "Exploitation artisanale d'or alluvionnaire",
      coordinates: [22.4, -10.65] as [number, number],
      type: "mine" as const,
      territoire: "Dilolo",
      minerais: ["Or"],
      operateur: "Artisanal",
    },
    {
      id: "mine-kapanga-diamant",
      name: "Zone Diamantifère Kapanga",
      description: "Exploitation artisanale de diamants",
      coordinates: [22.5, -8.4] as [number, number],
      type: "mine" as const,
      territoire: "Kapanga",
      minerais: ["Diamant"],
      operateur: "Artisanal",
    },
  ],
};

// Données consolidées par territoire
export const TERRITORY_DATA = [
  {
    id: "kolwezi",
    nom: "Kolwezi",
    type: "ville",
    population: "850 000",
    superficie: "213 km²",
    coordinates: [25.4667, -10.7167] as [number, number],
    recettes2024: 28500000,
    recettes2025: 32100000,
    pointsRecettes: 3,
    projetsEnCours: 2,
    projetsTermines: 1,
    zonesMinieres: 2,
    principauxMinerais: ["Cuivre", "Cobalt"],
    description:
      "Chef-lieu de la province du Lualaba, principal centre minier.",
  },
  {
    id: "dilolo",
    nom: "Dilolo",
    type: "territoire",
    population: "320 000",
    superficie: "16 700 km²",
    coordinates: [22.35, -10.68] as [number, number],
    recettes2024: 1200000,
    recettes2025: 1450000,
    pointsRecettes: 1,
    projetsEnCours: 0,
    projetsTermines: 1,
    zonesMinieres: 1,
    principauxMinerais: ["Or"],
    description:
      "Territoire frontalier avec l'Angola, agriculture et or alluvionnaire.",
  },
  {
    id: "kapanga",
    nom: "Kapanga",
    type: "territoire",
    population: "280 000",
    superficie: "27 390 km²",
    coordinates: [22.58, -8.35] as [number, number],
    recettes2024: 980000,
    recettes2025: 1150000,
    pointsRecettes: 1,
    projetsEnCours: 0,
    projetsTermines: 0,
    zonesMinieres: 1,
    principauxMinerais: ["Diamant"],
    description: "Grand territoire au nord, diamants et agriculture.",
  },
  {
    id: "sandoa",
    nom: "Sandoa",
    type: "territoire",
    population: "420 000",
    superficie: "31 270 km²",
    coordinates: [22.95, -9.68] as [number, number],
    recettes2024: 1450000,
    recettes2025: 1680000,
    pointsRecettes: 1,
    projetsEnCours: 1,
    projetsTermines: 0,
    zonesMinieres: 0,
    principauxMinerais: [],
    description:
      "Plus grand territoire de la province, principalement agricole.",
  },
  {
    id: "lubudi",
    nom: "Lubudi",
    type: "territoire",
    population: "380 000",
    superficie: "19 740 km²",
    coordinates: [25.85, -9.85] as [number, number],
    recettes2024: 2100000,
    recettes2025: 2380000,
    pointsRecettes: 1,
    projetsEnCours: 1,
    projetsTermines: 0,
    zonesMinieres: 1,
    principauxMinerais: ["Pierre", "Sable"],
    description: "Territoire central, matériaux de construction et transit.",
  },
  {
    id: "mutshatsha",
    nom: "Mutshatsha",
    type: "territoire",
    population: "290 000",
    superficie: "12 840 km²",
    coordinates: [25.45, -10.35] as [number, number],
    recettes2024: 1850000,
    recettes2025: 2120000,
    pointsRecettes: 1,
    projetsEnCours: 1,
    projetsTermines: 0,
    zonesMinieres: 0,
    principauxMinerais: [],
    description: "Territoire proche de Kolwezi, agriculture et services.",
  },
  {
    id: "fungurume",
    nom: "Fungurume",
    type: "secteur",
    population: "150 000",
    superficie: "3 200 km²",
    coordinates: [26.31, -10.55] as [number, number],
    recettes2024: 8500000,
    recettes2025: 9800000,
    pointsRecettes: 1,
    projetsEnCours: 0,
    projetsTermines: 1,
    zonesMinieres: 1,
    principauxMinerais: ["Cuivre", "Cobalt"],
    description: "Zone minière majeure, Tenke-Fungurume Mining.",
  },
  {
    id: "bunkeya",
    nom: "Bunkeya",
    type: "chefferie",
    population: "85 000",
    superficie: "4 500 km²",
    coordinates: [26.97, -10.38] as [number, number],
    recettes2024: 420000,
    recettes2025: 510000,
    pointsRecettes: 0,
    projetsEnCours: 0,
    projetsTermines: 0,
    zonesMinieres: 0,
    principauxMinerais: [],
    description: "Chefferie historique du royaume Yeke, patrimoine culturel.",
  },
];

// Informations sur la direction
export const DIRECTION_INFO = {
  directeur: {
    nom: "Georges Tshata Mbov",
    titre: "Directeur Provincial",
    photo: "/images/direction/georges.png",
    slogan:
      "Ensemble, construisons une fiscalité non fiscale transparente et équitable pour le développement économique du Lualaba.",
  },
  gouverneure: {
    nom: "Fifi Masuka Saini",
    titre: "Gouverneure de la Province du Lualaba",
    photo: "/images/direction/fifi.jpg",
    slogan:
      "Chaque contribution citoyenne est un pas vers un Lualaba prospère et uni.",
  },
};

// Navigation principale
export const MAIN_NAV: NavItem[] = [
  {
    label: "L'Institution",
    href: "/a-propos",
    children: [
      { label: "À Propos", href: "/a-propos" },
      { label: "Direction", href: "/direction" },
      { label: "Structure", href: "/structure" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Types de Recettes", href: "/services#recettes" },
      { label: "Procédures", href: "/services#procedures" },
      { label: "Tarification", href: "/services#tarification" },
    ],
  },
  { label: "Cadre Juridique", href: "/juridique" },
  { label: "Cartographie", href: "/cartographie" },
  { label: "Actualités", href: "/actualites" },
  { label: "Bon à Savoir", href: "/bon-a-savoir" },
];

// Chiffres clés (valeurs fictives à mettre à jour)
export const CHIFFRES_CLES: ChiffreCle[] = [
  {
    label: "Recettes Collectées",
    valeur: 150,
    suffixe: "M USD",
    description: "Total des recettes non fiscales collectées en 2025",
  },
  {
    label: "Contribuables Enregistrés",
    valeur: 5000,
    suffixe: "+",
    description: "Nombre de contribuables actifs",
  },
  {
    label: "Projets Financés",
    valeur: 120,
    suffixe: "",
    description: "Projets de développement financés",
  },
  {
    label: "Années d'Expérience",
    valeur: 15,
    suffixe: "+",
    description: "Années de service au Lualaba",
  },
];

// Langues supportées
export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "sw", label: "Swahili", flag: "🇹🇿" },
  { code: "ln", label: "Lingala", flag: "🇨🇩" },
];

// Couleurs institutionnelles (basées sur le logo)
export const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
  secondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  accent: {
    gold: "#D4AF37",
    copper: "#B87333",
  },
};

// Types de recettes non fiscales
export const TYPES_RECETTES = [
  {
    id: "minier",
    nom: "Secteur Minier",
    description:
      "Redevances et taxes liées à l'exploitation minière industrielle et artisanale",
    icone: "Pickaxe",
    image: "/images/services/mine.webp",
    details: {
      intro:
        "Le secteur minier représente la principale source de recettes non fiscales de la province du Lualaba, riche en cuivre et cobalt.",
      obligations: [
        "Redevance minière annuelle",
        "Taxe sur le transport de minerais",
        "Droit de passage aux barrières minières",
        "Taxe sur les engins miniers",
        "Contribution au développement communautaire",
      ],
      procedures: [
        "Déclaration trimestrielle de production",
        "Paiement au guichet DRNOFLU ou par virement bancaire",
        "Obtention du reçu de paiement",
        "Conservation des justificatifs pour contrôle",
      ],
      documents: [
        "Permis d'exploitation minière valide",
        "Registre de production",
        "Relevé de transport des minerais",
        "Attestation d'enregistrement fiscal",
      ],
    },
  },
  {
    id: "environnement",
    nom: "Environnement",
    description:
      "Taxes environnementales et redevances pour la protection de l'écosystème",
    icone: "Leaf",
    image: "/images/services/environment.jpeg",
    details: {
      intro:
        "Les taxes environnementales contribuent à la protection et à la restauration de l'écosystème provincial, particulièrement impacté par les activités minières.",
      obligations: [
        "Taxe de pollution",
        "Redevance de gestion des déchets",
        "Taxe forestière",
        "Contribution pour la réhabilitation des sites",
        "Permis environnemental",
      ],
      procedures: [
        "Étude d'impact environnemental",
        "Déclaration des émissions et rejets",
        "Paiement trimestriel des taxes",
        "Rapport annuel environnemental",
      ],
      documents: [
        "Certificat environnemental",
        "Plan de gestion environnementale",
        "Rapport d'audit environnemental",
        "Registre des déchets produits",
      ],
    },
  },
  {
    id: "transport",
    nom: "Transport",
    description: "Redevances liées au transport routier, ferroviaire et aérien",
    icone: "Truck",
    image: "/images/services/transport.jpg",
    details: {
      intro:
        "Le secteur des transports contribue significativement aux recettes provinciales à travers diverses taxes sur les véhicules et le transport de marchandises.",
      obligations: [
        "Taxe de circulation",
        "Vignette provinciale",
        "Taxe de stationnement",
        "Redevance de transport public",
        "Taxe sur le transport de marchandises",
      ],
      procedures: [
        "Immatriculation du véhicule",
        "Paiement annuel de la vignette",
        "Déclaration pour le transport commercial",
        "Renouvellement des autorisations",
      ],
      documents: [
        "Carte grise du véhicule",
        "Permis de conduire valide",
        "Assurance véhicule",
        "Autorisation de transport commercial",
      ],
    },
  },
  {
    id: "commerce",
    nom: "Commerce",
    description: "Taxes sur les activités commerciales et les marchés",
    icone: "Store",
    image: "/images/services/commerce.jpg",
    details: {
      intro:
        "Les activités commerciales dans la province du Lualaba sont soumises à diverses taxes qui contribuent au développement économique local.",
      obligations: [
        "Patente commerciale",
        "Taxe de marché",
        "Droit d'étalage",
        "Taxe sur la publicité",
        "Licence d'exploitation commerciale",
      ],
      procedures: [
        "Enregistrement de l'activité commerciale",
        "Paiement de la patente annuelle",
        "Déclaration mensuelle pour les marchés",
        "Renouvellement des licences",
      ],
      documents: [
        "Registre de commerce (RCCM)",
        "Numéro d'identification fiscale",
        "Attestation de localisation",
        "Contrat de bail commercial",
      ],
    },
  },
  {
    id: "foncier",
    nom: "Foncier",
    description: "Redevances foncières et droits de superficie",
    icone: "Building",
    image: "/images/services/taxefonc.jpg",
    details: {
      intro:
        "Les taxes foncières s'appliquent à la propriété et à l'occupation des terrains dans la province du Lualaba.",
      obligations: [
        "Impôt foncier",
        "Taxe sur la superficie",
        "Droit de mutation foncière",
        "Redevance d'occupation",
        "Taxe d'urbanisme",
      ],
      procedures: [
        "Déclaration de propriété",
        "Évaluation de la valeur foncière",
        "Paiement annuel de l'impôt",
        "Enregistrement des mutations",
      ],
      documents: [
        "Titre foncier ou certificat d'enregistrement",
        "Plan cadastral",
        "Attestation de propriété",
        "Permis de construire (si applicable)",
      ],
    },
  },
  {
    id: "administratif",
    nom: "Services Administratifs",
    description: "Frais administratifs et droits de chancellerie",
    icone: "FileText",
    image: "/images/services/adminstration.jpeg",
    details: {
      intro:
        "Les frais administratifs couvrent les services rendus par l'administration provinciale pour la délivrance de documents officiels.",
      obligations: [
        "Frais de légalisation",
        "Droits de chancellerie",
        "Frais de délivrance d'attestations",
        "Taxes sur les actes administratifs",
        "Frais de certification",
      ],
      procedures: [
        "Dépôt de la demande",
        "Paiement des frais requis",
        "Traitement du dossier",
        "Retrait du document",
      ],
      documents: [
        "Pièce d'identité valide",
        "Formulaire de demande complété",
        "Documents justificatifs requis",
        "Reçu de paiement",
      ],
    },
  },
  {
    id: "agricole",
    nom: "Secteur Agricole",
    description: "Taxes sur les activités agricoles et l'élevage",
    icone: "Wheat",
    image: "/images/services/agriculture.webp",
    details: {
      intro:
        "Le secteur agricole bénéficie d'un régime fiscal adapté pour encourager la production alimentaire tout en contribuant aux recettes provinciales.",
      obligations: [
        "Taxe sur le bétail",
        "Redevance sur les produits agricoles",
        "Taxe de marché agricole",
        "Permis de pêche et chasse",
        "Taxe sur les exploitations agricoles",
      ],
      procedures: [
        "Déclaration de l'activité agricole",
        "Paiement des taxes de marché",
        "Obtention des permis requis",
        "Déclaration annuelle des revenus agricoles",
      ],
      documents: [
        "Attestation d'exploitant agricole",
        "Titre foncier ou bail agricole",
        "Registre du bétail",
        "Permis de commercialisation",
      ],
    },
  },
  {
    id: "sante",
    nom: "Santé Publique",
    description:
      "Contributions liées aux établissements de santé et à l'hygiène",
    icone: "Heart",
    image: "/images/services/sante.avif",
    details: {
      intro:
        "Les taxes de santé publique contribuent au financement des infrastructures sanitaires et au contrôle de l'hygiène publique.",
      obligations: [
        "Taxe d'agrément sanitaire",
        "Redevance d'hygiène",
        "Taxe sur les établissements de santé privés",
        "Contribution au fonds de santé",
        "Permis d'exploitation sanitaire",
      ],
      procedures: [
        "Demande d'agrément sanitaire",
        "Inspection des locaux",
        "Paiement des redevances",
        "Renouvellement annuel des permis",
      ],
      documents: [
        "Diplômes du personnel médical",
        "Plan des locaux",
        "Attestation d'hygiène",
        "Registre des activités médicales",
      ],
    },
  },
];

// Catégories d'actualités
export const CATEGORIES_ACTUALITES = [
  { id: "communique", label: "Communiqués", color: "blue" },
  { id: "rapport", label: "Rapports", color: "green" },
  { id: "evenement", label: "Événements", color: "purple" },
  { id: "annonce", label: "Annonces", color: "orange" },
  { id: "general", label: "Général", color: "gray" },
];
