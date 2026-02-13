"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Download,
  Search,
  Filter,
  Book,
  Scale,
  Gavel,
  ScrollText,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBrowserClient } from "@/lib/supabase";
import { Document } from "@/lib/types";

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  ordonnance: Scale,
  arrete: Gavel,
  decret: Book,
  circulaire: ScrollText,
  note: FileText,
  loi: Scale,
  formulaire: FileText,
  rapport: Book,
  livre: Book,
  guide: FileText,
};

const typeLabels: Record<string, string> = {
  ordonnance: "Ordonnance",
  arrete: "Arrêté",
  decret: "Décret",
  circulaire: "Circulaire",
  note: "Note",
  loi: "Loi",
  formulaire: "Formulaire",
  rapport: "Rapport",
  livre: "Livre",
  guide: "Guide",
};

const typeColors: Record<string, string> = {
  ordonnance: "bg-red-100 text-red-700 border-red-200",
  arrete: "bg-blue-100 text-blue-700 border-blue-200",
  decret: "bg-purple-100 text-purple-700 border-purple-200",
  circulaire: "bg-orange-100 text-orange-700 border-orange-200",
  note: "bg-gray-100 text-gray-700 border-gray-200",
  loi: "bg-red-100 text-red-700 border-red-200",
  formulaire: "bg-green-100 text-green-700 border-green-200",
  rapport: "bg-indigo-100 text-indigo-700 border-indigo-200",
  livre: "bg-amber-100 text-amber-700 border-amber-200",
  guide: "bg-teal-100 text-teal-700 border-teal-200",
};

/**
 * Page Cadre Juridique - Bibliothèque de documents
 */
export default function JuridiquePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("publie", true)
      .order("date_publication", { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
    setLoading(false);
  };

  // Filtrer les documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || doc.categorie === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cadre Juridique
            </h1>
            <p className="text-xl text-primary-100">
              Textes légaux et réglementaires régissant les recettes non
              fiscales
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600">
              Consultez et téléchargez les textes légaux, ordonnances, arrêtés
              et circulaires régissant la collecte et la gestion des recettes
              non fiscales dans la province du Lualaba.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres et recherche */}
      <section className="py-8 bg-gray-50 sticky top-[73px] z-30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un document..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="ordonnance">Ordonnances</SelectItem>
                  <SelectItem value="arrete">Arrêtés</SelectItem>
                  <SelectItem value="decret">Décrets</SelectItem>
                  <SelectItem value="loi">Lois</SelectItem>
                  <SelectItem value="circulaire">Circulaires</SelectItem>
                  <SelectItem value="note">Notes</SelectItem>
                  <SelectItem value="formulaire">Formulaires</SelectItem>
                  <SelectItem value="rapport">Rapports</SelectItem>
                  <SelectItem value="livre">Livres</SelectItem>
                  <SelectItem value="guide">Guides</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{filteredDocuments.length} documents disponibles</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grille de documents - Style A4 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[210/297] rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun document disponible</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery || typeFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Les documents seront ajoutés prochainement"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredDocuments.map((doc) => {
                const Icon = typeIcons[doc.categorie] || FileText;
                return (
                  <div key={doc.id} className="group">
                    {/* Document Card - A4 format */}
                    <div className="relative aspect-[210/297] bg-white border-2 border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary-300 group-hover:scale-[1.02]">
                      {/* Couverture ou placeholder */}
                      {doc.image_couverture_url ? (
                        <Image
                          src={doc.image_couverture_url}
                          alt={doc.titre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
                          <Icon className="h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-xs text-gray-500 text-center line-clamp-3 font-medium">
                            {doc.titre}
                          </p>
                        </div>
                      )}

                      {/* Badge type */}
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${typeColors[doc.categorie] || "bg-gray-100 text-gray-700"}`}
                        >
                          {typeLabels[doc.categorie]}
                        </Badge>
                      </div>

                      {/* Badge année */}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {doc.annee}
                        </Badge>
                      </div>

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs"
                          asChild
                        >
                          <a
                            href={doc.fichier_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </a>
                        </Button>
                        <Button size="sm" className="text-xs" asChild>
                          <a href={doc.fichier_url} download>
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </a>
                        </Button>
                      </div>

                      {/* Pages indicator */}
                      {doc.nombre_pages && (
                        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] text-gray-600">
                          {doc.nombre_pages} pages
                        </div>
                      )}
                    </div>

                    {/* Titre sous la carte */}
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-primary-700 transition-colors">
                        {doc.titre}
                      </h3>
                      {doc.auteur && (
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.auteur}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {new Date(doc.date_publication).toLocaleDateString(
                            "fr-FR",
                            { month: "short", year: "numeric" },
                          )}
                        </span>
                        {doc.telechargements > 0 && (
                          <span className="text-xs text-gray-400">
                            • {doc.telechargements} téléchargements
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Section Barèmes */}
      <section id="baremes" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Barèmes et Tarifs Officiels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Les barèmes des recettes non fiscales sont fixés par arrêté
                provincial et sont régulièrement mis à jour. Assurez-vous de
                consulter la version la plus récente.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <Link href="/contact">Demander clarification</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
