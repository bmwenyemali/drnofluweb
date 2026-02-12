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
  categorie: CategorieActualite;
  auteur_id: string;
  publie: boolean;
  date_publication: string;
  created_at: string;
  updated_at: string;
}

export type CategorieActualite =
  | "communique"
  | "rapport"
  | "evenement"
  | "annonce"
  | "general";

// Types pour les documents juridiques
export interface Document {
  id: string;
  titre: string;
  description?: string;
  type: TypeDocument;
  categorie: CategorieDocument;
  fichier_url: string;
  taille_fichier?: number;
  date_publication: string;
  annee: number;
  publie: boolean;
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
  | "rapport";

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
  photo_url?: string;
  email?: string;
  telephone?: string;
  ordre: number;
  actif: boolean;
}

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

// Types pour les chiffres clés
export interface ChiffreCle {
  label: string;
  valeur: number;
  suffixe?: string;
  prefixe?: string;
  description?: string;
}
