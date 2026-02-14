/**
 * Types TypeScript pour la base de données Supabase
 * et les données du site DRNOFLU
 */

// Types pour les profils utilisateurs
export interface Profile {
  id: string;
  email: string;
  nom_complet: string;
  role: "admin" | "editeur" | "lecteur";
  avatar_url?: string;
  bio?: string;
  telephone?: string;
  created_at: string;
  updated_at: string;
}

// Types pour les actualités
export interface Actualite {
  id: string;
  titre: string;
  slug: string;
  contenu: string;
  extrait: string;
  image_url?: string;
  galerie_images: string[];
  videos_youtube: string[];
  categorie: CategorieActualite;
  auteur_id?: string;
  auteur?: Profile;
  publie: boolean;
  a_la_une: boolean;
  date_publication?: string;
  created_at: string;
  updated_at: string;
}

export type CategorieActualite =
  | "communique"
  | "rapport"
  | "evenement"
  | "annonce"
  | "general";

// Types pour les documents juridiques (Bibliothèque)
export interface Document {
  id: string;
  titre: string;
  description?: string;
  resume?: string;
  auteur?: string;
  nombre_pages?: number;
  type: TypeDocument;
  categorie: CategorieDocument;
  fichier_url: string;
  image_couverture_url?: string;
  taille_fichier?: number;
  date_publication: string;
  annee: number;
  publie: boolean;
  telechargements: number;
  created_at: string;
  updated_at: string;
}

export type TypeDocument = "pdf" | "doc" | "docx" | "xls" | "xlsx";

export type CategorieDocument =
  | "ordonnance"
  | "arrete"
  | "decret"
  | "loi"
  | "circulaire"
  | "note"
  | "formulaire"
  | "rapport"
  | "livre"
  | "guide";

// Types pour les messages de contact
export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  lu: boolean;
  traite: boolean;
  created_at: string;
}

// Types pour les statistiques
export interface StatistiqueRecette {
  id: string;
  annee: number;
  mois?: number;
  type_recette: string;
  montant: number;
  devise: "CDF" | "USD";
  created_at: string;
}

// Types pour la structure organisationnelle
export interface Personnel {
  id: string;
  nom_complet: string;
  titre: string;
  fonction: string;
  departement: string;
  equipe: EquipeType;
  bio?: string;
  photo_url?: string;
  email?: string;
  telephone?: string;
  linkedin?: string;
  ordre: number;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export type EquipeType =
  | "direction"
  | "cadres"
  | "technique"
  | "administratif"
  | "autre";

// Types pour les services
export interface Service {
  id: string;
  nom: string;
  description: string;
  icone: string;
  slug: string;
  ordre: number;
}

// Types pour "Bon à Savoir"
export interface BonASavoir {
  id: string;
  titre: string;
  contenu: string;
  type: "info" | "astuce" | "alerte" | "question";
  actif: boolean;
  date_debut?: string;
  date_fin?: string;
  created_at: string;
}

// Types pour la navigation
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Types pour les langues supportées
export type Locale = "fr" | "en" | "sw" | "ln";

// Types pour les chiffres clés (config fallback + database)
export interface ChiffreCle {
  id?: string;
  cle?: string;
  label: string;
  valeur: number;
  suffixe?: string;
  prefixe?: string;
  description?: string;
  ordre?: number;
  actif?: boolean;
  updated_at?: string;
}

// Types pour les paramètres du site
export interface SiteSetting {
  id: string;
  cle: string;
  valeur: string;
  description?: string;
  type: "text" | "image" | "json" | "html" | "number";
  created_at: string;
  updated_at: string;
}

// Types pour le contenu des pages
export interface PageContent {
  id: string;
  page: string;
  section: string;
  titre?: string;
  contenu?: string;
  image_url?: string;
  ordre: number;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

// Types utilitaires pour les formulaires
export interface ActualiteFormData {
  titre: string;
  contenu: string;
  extrait: string;
  image_url?: string;
  galerie_images: string[];
  videos_youtube: string[];
  categorie: CategorieActualite;
  publie: boolean;
  a_la_une: boolean;
}

export interface DocumentFormData {
  titre: string;
  description?: string;
  resume?: string;
  auteur?: string;
  nombre_pages?: number;
  type: TypeDocument;
  categorie: CategorieDocument;
  fichier_url: string;
  image_couverture_url?: string;
  annee: number;
  publie: boolean;
}

export interface PersonnelFormData {
  nom_complet: string;
  titre: string;
  fonction: string;
  departement: string;
  equipe: EquipeType;
  bio?: string;
  photo_url?: string;
  email?: string;
  telephone?: string;
  linkedin?: string;
  ordre: number;
  actif: boolean;
}

// Types pour les statistiques de recettes
export interface StatistiqueRecette {
  id: string;
  annee: number;
  mois?: number;
  type_recette: string;
  montant: number;
  devise: "CDF" | "USD";
  created_at: string;
}

// Types pour le journal d'activités
export interface JournalActivite {
  id: string;
  user_id?: string;
  user_email?: string;
  user_nom?: string;
  action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE" | "VIEW";
  entite?: string;
  entite_id?: string;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Types pour les paramètres système
export interface Parametre {
  id: string;
  cle: string;
  valeur: string;
  description?: string;
  type: "string" | "number" | "boolean" | "json";
  categorie: string;
  modifiable: boolean;
  updated_at: string;
  updated_by?: string;
}

// Types pour Bon à Savoir (mise à jour)
export interface BonASavoirItem {
  id: string;
  titre: string;
  contenu: string;
  type: "astuce" | "information" | "important";
  icone: string;
  ordre: number;
  publie: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Types pour les simulations
export interface Simulation {
  id: string;
  type_taxe: string;
  donnees_formulaire: Record<string, unknown>;
  resultat_usd: number;
  resultat_fc: number;
  taux_change: number;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Types pour les barèmes de simulation
export interface BaremeSimulation {
  id: string;
  categorie: string;
  description: string;
  taux_pourcentage?: number;
  montant_fixe?: number;
  formule?: string;
  unite?: string;
  ordre: number;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

// Types pour les statistiques visiteurs
export interface StatistiqueVisiteur {
  id: string;
  date: string;
  page?: string;
  pays?: string;
  province_rdc?: string;
  ville?: string;
  visites: number;
  visiteurs_uniques: number;
  duree_moyenne_secondes: number;
  created_at: string;
}

// Form data types
export interface BonASavoirFormData {
  titre: string;
  contenu: string;
  type: "astuce" | "information" | "important";
  icone: string;
  ordre: number;
  publie: boolean;
}

// ============================================================================
// CARTOGRAPHY TYPES
// ============================================================================

// Cartography Icon
export interface CartographieIcone {
  id: string;
  nom: string;
  label: string;
  categorie:
    | "territoire"
    | "projet"
    | "mine"
    | "recette"
    | "infrastructure"
    | "autre";
  couleur: string;
  svg_path?: string;
  lucide_icon?: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

// Territory types
export type TypeTerritoire =
  | "province"
  | "ville"
  | "territoire"
  | "chefferie"
  | "secteur"
  | "groupement"
  | "localite";

// Territory
export interface CartographieTerritoire {
  id: string;
  nom: string;
  type: TypeTerritoire;
  code?: string;
  parent_id?: string;
  parent?: CartographieTerritoire;

  // Geographic data
  latitude?: number;
  longitude?: number;
  altitude?: number;
  precision_gps?: number;
  polygone_geojson?: Record<string, unknown>;
  superficie_km2?: number;

  // Demographics
  population?: number;
  annee_population?: number;
  densite_population?: number;

  // Administrative
  chef_lieu?: string;
  administrateur?: string;
  contact_telephone?: string;
  contact_email?: string;

  // Display
  icone_id?: string;
  icone?: CartographieIcone;
  couleur: string;

  // Description
  description?: string;
  particularites?: string;
  ressources_principales?: string[];

  // Status
  actif: boolean;
  ordre: number;

  created_at: string;
  updated_at: string;
}

// Project types
export type TypeProjet =
  | "infrastructure"
  | "education"
  | "sante"
  | "eau"
  | "electricite"
  | "route"
  | "pont"
  | "marche"
  | "agriculture"
  | "environnement"
  | "social"
  | "autre";
export type StatutProjet =
  | "propose"
  | "planifie"
  | "en_cours"
  | "suspendu"
  | "termine"
  | "annule";

// Project
export interface CartographieProjet {
  id: string;
  nom: string;
  description?: string;

  // Location
  territoire_id?: string;
  territoire?: CartographieTerritoire;
  latitude: number;
  longitude: number;
  altitude?: number;
  precision_gps?: number;
  adresse?: string;

  // Project details
  type_projet: TypeProjet;
  secteur?: string;

  // Dates
  date_debut?: string;
  date_fin_prevue?: string;
  date_fin_reelle?: string;
  annee: number;

  // Status
  statut: StatutProjet;
  pourcentage_avancement: number;

  // Financials
  cout_estime_usd?: number;
  cout_reel_usd?: number;
  source_financement?: string;

  // Beneficiaries
  beneficiaires_prevus?: number;
  beneficiaires_reels?: number;

  // Contractor
  maitre_ouvrage?: string;
  entrepreneur?: string;

  // Display
  icone_id?: string;
  icone?: CartographieIcone;
  couleur: string;
  images?: string[];

  // Additional details
  details?: Record<string, unknown>;

  // Status
  publie: boolean;
  propose_par?: string;
  valide_par?: string;
  date_validation?: string;

  created_at: string;
  updated_at: string;
}

// Mining zone types
export type TypeExploitation =
  | "industrielle"
  | "artisanale"
  | "semi_industrielle"
  | "carriere";

// Mining Zone
export interface CartographieZoneMiniere {
  id: string;
  nom: string;
  description?: string;

  // Location
  territoire_id?: string;
  territoire?: CartographieTerritoire;
  latitude: number;
  longitude: number;
  altitude?: number;
  precision_gps?: number;
  polygone_geojson?: Record<string, unknown>;
  superficie_km2?: number;

  // Mine details
  type_exploitation: TypeExploitation;
  minerais: string[];
  operateur?: string;
  permis_numero?: string;
  permis_date_debut?: string;
  permis_date_fin?: string;

  // Production
  production_annuelle_tonnes?: number;
  annee_production?: number;

  // Employment
  employes_directs?: number;
  employes_indirects?: number;

  // Revenue
  redevances_annuelles_usd?: number;
  annee_redevances?: number;

  // Display
  icone_id?: string;
  icone?: CartographieIcone;
  couleur: string;
  images?: string[];

  // Additional details
  details?: Record<string, unknown>;

  // Status
  actif: boolean;
  publie: boolean;

  created_at: string;
  updated_at: string;
}

// Revenue point types
export type TypeBureau =
  | "siege"
  | "perception"
  | "antenne"
  | "guichet"
  | "mobile";

// Revenue Point
export interface CartographiePointRecette {
  id: string;
  nom: string;
  description?: string;

  // Location
  territoire_id?: string;
  territoire?: CartographieTerritoire;
  latitude: number;
  longitude: number;
  altitude?: number;
  precision_gps?: number;
  adresse?: string;

  // Office details
  type_bureau: TypeBureau;
  responsable?: string;
  telephone?: string;
  email?: string;
  horaires?: string;

  // Services
  services_offerts?: string[];

  // Revenue data
  recettes_2024_usd?: number;
  recettes_2025_usd?: number;
  objectif_annuel_usd?: number;

  // Display
  icone_id?: string;
  icone?: CartographieIcone;
  couleur: string;
  images?: string[];

  // Additional details
  details?: Record<string, unknown>;

  // Status
  actif: boolean;
  publie: boolean;

  created_at: string;
  updated_at: string;
}

// Infrastructure types
export type TypeInfrastructure =
  | "ecole"
  | "hopital"
  | "centre_sante"
  | "marche"
  | "eau"
  | "electricite"
  | "route"
  | "pont"
  | "batiment_public"
  | "autre";

// Infrastructure
export interface CartographieInfrastructure {
  id: string;
  nom: string;
  description?: string;

  // Location
  territoire_id?: string;
  territoire?: CartographieTerritoire;
  latitude: number;
  longitude: number;
  altitude?: number;
  precision_gps?: number;
  adresse?: string;

  // Details
  type_infrastructure: TypeInfrastructure;
  gestionnaire?: string;
  capacite?: string;
  annee_construction?: number;

  // Link to project
  projet_id?: string;
  projet?: CartographieProjet;

  // Display
  icone_id?: string;
  icone?: CartographieIcone;
  couleur: string;
  images?: string[];

  // Additional details
  details?: Record<string, unknown>;

  // Status
  actif: boolean;
  publie: boolean;

  created_at: string;
  updated_at: string;
}
