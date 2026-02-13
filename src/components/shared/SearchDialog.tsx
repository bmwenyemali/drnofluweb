"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  FileText,
  Newspaper,
  Lightbulb,
  Briefcase,
  MapPin,
  Info,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "actualite" | "document" | "service" | "bon-a-savoir" | "page";
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Pages statiques à inclure dans la recherche
const STATIC_PAGES: SearchResult[] = [
  {
    id: "page-accueil",
    title: "Accueil",
    description: "Page d'accueil du site DRNOFLU",
    type: "page",
    url: "/",
    icon: Info,
  },
  {
    id: "page-apropos",
    title: "À Propos",
    description:
      "L'Institution DRNOFLU - Direction des Recettes Non Fiscales du Lualaba",
    type: "page",
    url: "/a-propos",
    icon: Info,
  },
  {
    id: "page-services",
    title: "Nos Services",
    description: "Découvrez les services offerts par la DRNOFLU",
    type: "page",
    url: "/services",
    icon: Briefcase,
  },
  {
    id: "page-actualites",
    title: "Actualités",
    description: "Toutes les actualités et communiqués de la DRNOFLU",
    type: "page",
    url: "/actualites",
    icon: Newspaper,
  },
  {
    id: "page-contact",
    title: "Contact",
    description: "Contactez-nous - Formulaire et coordonnées",
    type: "page",
    url: "/contact",
    icon: MapPin,
  },
  {
    id: "page-juridique",
    title: "Juridique",
    description: "Textes de lois et documents juridiques",
    type: "page",
    url: "/juridique",
    icon: FileText,
  },
  {
    id: "page-structure",
    title: "Structure",
    description: "Organigramme et structure de la DRNOFLU",
    type: "page",
    url: "/structure",
    icon: Info,
  },
  {
    id: "page-direction",
    title: "Direction",
    description: "L'équipe de direction de la DRNOFLU",
    type: "page",
    url: "/direction",
    icon: Info,
  },
  {
    id: "page-bonasavoir",
    title: "Bon à Savoir",
    description: "Informations pratiques, FAQ et simulateur de taxes",
    type: "page",
    url: "/bon-a-savoir",
    icon: Lightbulb,
  },
  {
    id: "page-cartographie",
    title: "Cartographie",
    description: "Carte interactive du Lualaba",
    type: "page",
    url: "/cartographie",
    icon: MapPin,
  },
];

const TYPE_CONFIG = {
  actualite: {
    label: "Actualité",
    color: "bg-blue-100 text-blue-700",
    icon: Newspaper,
  },
  document: {
    label: "Document",
    color: "bg-green-100 text-green-700",
    icon: FileText,
  },
  service: {
    label: "Service",
    color: "bg-purple-100 text-purple-700",
    icon: Briefcase,
  },
  "bon-a-savoir": {
    label: "Bon à savoir",
    color: "bg-yellow-100 text-yellow-700",
    icon: Lightbulb,
  },
  page: { label: "Page", color: "bg-gray-100 text-gray-700", icon: Info },
};

/**
 * Normalise une chaîne pour la recherche:
 * - Supprime les accents
 * - Met en minuscules
 * - Supprime les caractères spéciaux
 */
function normalizeForSearch(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .trim();
}

/**
 * Vérifie si le texte contient la requête (recherche fuzzy)
 */
function matchesSearch(text: string, query: string): boolean {
  const normalizedText = normalizeForSearch(text);
  const normalizedQuery = normalizeForSearch(query);

  // Split query into words for multi-word search
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  // All words must be found in the text
  return queryWords.every((word) => normalizedText.includes(word));
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbData, setDbData] = useState<{
    actualites: any[];
    documents: any[];
    services: any[];
    bonASavoir: any[];
  }>({ actualites: [], documents: [], services: [], bonASavoir: [] });

  const router = useRouter();
  const supabase = createBrowserClient();

  // Load data from database
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);

    const [actualitesRes, documentsRes, servicesRes, bonASavoirRes] =
      await Promise.all([
        supabase
          .from("actualites")
          .select("id, titre, extrait, slug")
          .eq("publie", true)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("documents")
          .select("id, titre, description, slug, categorie")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("services")
          .select("id, nom, description")
          .eq("actif", true)
          .order("ordre", { ascending: true }),
        supabase
          .from("bon_a_savoir")
          .select("id, titre, contenu, type")
          .eq("publie", true)
          .order("ordre", { ascending: true }),
      ]);

    setDbData({
      actualites: actualitesRes.data || [],
      documents: documentsRes.data || [],
      services: servicesRes.data || [],
      bonASavoir: bonASavoirRes.data || [],
    });

    setLoading(false);
  };

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const allResults: SearchResult[] = [];

    // Search in static pages
    STATIC_PAGES.forEach((page) => {
      if (
        matchesSearch(page.title, query) ||
        matchesSearch(page.description, query)
      ) {
        allResults.push(page);
      }
    });

    // Search in actualites
    dbData.actualites.forEach((item) => {
      if (
        matchesSearch(item.titre, query) ||
        matchesSearch(item.extrait || "", query)
      ) {
        allResults.push({
          id: `actualite-${item.id}`,
          title: item.titre,
          description: item.extrait || "",
          type: "actualite",
          url: `/actualites/${item.slug}`,
          icon: Newspaper,
        });
      }
    });

    // Search in documents
    dbData.documents.forEach((item) => {
      if (
        matchesSearch(item.titre, query) ||
        matchesSearch(item.description || "", query) ||
        matchesSearch(item.categorie || "", query)
      ) {
        allResults.push({
          id: `document-${item.id}`,
          title: item.titre,
          description: item.description || item.categorie || "",
          type: "document",
          url: `/juridique#${item.slug}`,
          icon: FileText,
        });
      }
    });

    // Search in services
    dbData.services.forEach((item) => {
      if (
        matchesSearch(item.nom, query) ||
        matchesSearch(item.description || "", query)
      ) {
        allResults.push({
          id: `service-${item.id}`,
          title: item.nom,
          description: item.description || "",
          type: "service",
          url: `/services/${item.id}`,
          icon: Briefcase,
        });
      }
    });

    // Search in bon à savoir
    dbData.bonASavoir.forEach((item) => {
      if (
        matchesSearch(item.titre, query) ||
        matchesSearch(item.contenu || "", query)
      ) {
        allResults.push({
          id: `bonasavoir-${item.id}`,
          title: item.titre,
          description:
            item.contenu?.substring(0, 100) +
            (item.contenu?.length > 100 ? "..." : ""),
          type: "bon-a-savoir",
          url: "/bon-a-savoir",
          icon: Lightbulb,
        });
      }
    });

    return allResults.slice(0, 20); // Limit to 20 results
  }, [query, dbData]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.url);
    onOpenChange(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredResults.length > 0) {
      handleSelect(filteredResults[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher sur le site..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 focus-visible:ring-0 text-lg placeholder:text-gray-400"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-500">Chargement...</span>
            </div>
          ) : query.trim() === "" ? (
            <div className="py-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Tapez pour rechercher</p>
              <p className="text-sm mt-1">
                Actualités, documents, services, pages...
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Info className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun résultat pour &quot;{query}&quot;</p>
              <p className="text-sm mt-1">
                Essayez avec d&apos;autres mots clés
              </p>
            </div>
          ) : (
            <div className="py-2">
              {filteredResults.map((result) => {
                const config = TYPE_CONFIG[result.type];
                const Icon = result.icon;

                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        config.color.split(" ")[0],
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">
                          {result.title}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn("text-xs shrink-0", config.color)}
                        >
                          {config.label}
                        </Badge>
                      </div>
                      {result.description && (
                        <p className="text-sm text-gray-500 truncate mt-0.5">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-500 flex items-center gap-4">
          <span>
            <kbd className="px-1.5 py-0.5 bg-white border rounded">↵</kbd>{" "}
            Sélectionner
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-white border rounded">Esc</kbd>{" "}
            Fermer
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
