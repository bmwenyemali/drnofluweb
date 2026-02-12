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
  lualabaCenter: { lng: 25.5, lat: -10.5 }, // Centre Lualaba
  lualabaZoom: 8,
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
    },
    {
      id: "pr-manika",
      name: "Point de Recette Manika",
      description: "Bureau de perception Manika",
      coordinates: [25.45, -10.71] as [number, number],
      type: "recette" as const,
    },
    {
      id: "pr-dilala",
      name: "Point de Recette Dilala",
      description: "Bureau de perception Dilala",
      coordinates: [25.48, -10.73] as [number, number],
      type: "recette" as const,
    },
  ],
  projets: [
    {
      id: "proj-route",
      name: "Projet Route Kolwezi-Likasi",
      description: "Infrastructure routière financée par les recettes",
      coordinates: [25.55, -10.6] as [number, number],
      type: "projet" as const,
    },
    {
      id: "proj-ecole",
      name: "Construction École Primaire",
      description: "Projet éducatif communautaire",
      coordinates: [25.42, -10.74] as [number, number],
      type: "projet" as const,
    },
  ],
  mines: [
    {
      id: "mine-tenke",
      name: "Zone Minière Tenke-Fungurume",
      description: "Zone de prélèvement des redevances minières",
      coordinates: [26.1333, -10.6167] as [number, number],
      type: "mine" as const,
    },
    {
      id: "mine-kamoto",
      name: "Zone Minière Kamoto",
      description: "Zone de prélèvement des redevances minières",
      coordinates: [25.4, -10.7] as [number, number],
      type: "mine" as const,
    },
  ],
};

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
  { label: "Accueil", href: "/" },
  {
    label: "À Propos",
    href: "/a-propos",
    children: [
      { label: "Mission & Vision", href: "/a-propos#mission" },
      { label: "Historique", href: "/a-propos#historique" },
      { label: "Valeurs", href: "/a-propos#valeurs" },
    ],
  },
  { label: "Direction", href: "/direction" },
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
  { label: "Structure", href: "/structure" },
  { label: "Cartographie", href: "/cartographie" },
  { label: "Actualités", href: "/actualites" },
  { label: "Bon à Savoir", href: "/bon-a-savoir" },
  { label: "Contact", href: "/contact" },
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
  },
  {
    id: "environnement",
    nom: "Environnement",
    description:
      "Taxes environnementales et redevances pour la protection de l'écosystème",
    icone: "Leaf",
  },
  {
    id: "transport",
    nom: "Transport",
    description: "Redevances liées au transport routier, ferroviaire et aérien",
    icone: "Truck",
  },
  {
    id: "commerce",
    nom: "Commerce",
    description: "Taxes sur les activités commerciales et les marchés",
    icone: "Store",
  },
  {
    id: "foncier",
    nom: "Foncier",
    description: "Redevances foncières et droits de superficie",
    icone: "Building",
  },
  {
    id: "administratif",
    nom: "Services Administratifs",
    description: "Frais administratifs et droits de chancellerie",
    icone: "FileText",
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
