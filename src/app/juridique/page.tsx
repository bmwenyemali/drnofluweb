import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Download,
  Search,
  Filter,
  Book,
  Scale,
  Gavel,
  ScrollText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Cadre Juridique",
  description:
    "Consultez les textes légaux, ordonnances et arrêtés régissant les recettes non fiscales au Lualaba.",
};

// Données statiques des documents (à remplacer par Supabase)
const documents = [
  {
    id: 1,
    titre:
      "Ordonnance-Loi n°XXX portant nomenclature des recettes non fiscales",
    type: "ordonnance",
    annee: 2020,
    description:
      "Texte de base définissant les types de recettes non fiscales applicables en RDC.",
    fichier_url: "#",
  },
  {
    id: 2,
    titre: "Arrêté Provincial fixant les taux des recettes non fiscales",
    type: "arrete",
    annee: 2024,
    description:
      "Arrêté définissant les barèmes et taux applicables dans la province du Lualaba.",
    fichier_url: "#",
  },
  {
    id: 3,
    titre: "Décret portant création de la DRNOFLU",
    type: "decret",
    annee: 2019,
    description:
      "Texte fondateur de la Direction des Recettes Non Fiscales du Lualaba.",
    fichier_url: "#",
  },
  {
    id: 4,
    titre: "Circulaire sur les procédures de recouvrement",
    type: "circulaire",
    annee: 2023,
    description:
      "Instructions relatives aux procédures de recouvrement des recettes.",
    fichier_url: "#",
  },
  {
    id: 5,
    titre: "Note de service - Délais de paiement",
    type: "note",
    annee: 2025,
    description: "Note précisant les délais et modalités de paiement.",
    fichier_url: "#",
  },
];

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  ordonnance: Scale,
  arrete: Gavel,
  decret: Book,
  circulaire: ScrollText,
  note: FileText,
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
};

/**
 * Page Cadre Juridique - Bibliothèque de documents
 */
export default function JuridiquePage() {
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
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="ordonnance">Ordonnances</SelectItem>
                  <SelectItem value="arrete">Arrêtés</SelectItem>
                  <SelectItem value="decret">Décrets</SelectItem>
                  <SelectItem value="circulaire">Circulaires</SelectItem>
                  <SelectItem value="note">Notes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{documents.length} documents disponibles</span>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des documents */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="tous" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="tous">Tous</TabsTrigger>
              <TabsTrigger value="ordonnances">Ordonnances & Lois</TabsTrigger>
              <TabsTrigger value="arretes">Arrêtés & Décrets</TabsTrigger>
              <TabsTrigger value="circulaires">Circulaires & Notes</TabsTrigger>
              <TabsTrigger value="formulaires" id="formulaires">
                Formulaires
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tous" className="space-y-4">
              {documents.map((doc) => {
                const Icon = typeIcons[doc.type] || FileText;
                return (
                  <Card
                    key={doc.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary-100 rounded-xl flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">
                                {typeLabels[doc.type]}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {doc.annee}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {doc.titre}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {doc.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          className="flex-shrink-0"
                        >
                          <a
                            href={doc.fichier_url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="ordonnances" className="space-y-4">
              {documents
                .filter((d) => ["ordonnance", "loi"].includes(d.type))
                .map((doc) => {
                  const Icon = typeIcons[doc.type] || FileText;
                  return (
                    <Card
                      key={doc.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary-100 rounded-xl">
                            <Icon className="h-6 w-6 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2">
                              {typeLabels[doc.type]}
                            </Badge>
                            <h3 className="font-semibold">{doc.titre}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {doc.description}
                            </p>
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <a href={doc.fichier_url} download>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </TabsContent>

            <TabsContent value="arretes" className="space-y-4">
              <p className="text-gray-600 text-center py-8">
                Filtrage par arrêtés et décrets
              </p>
            </TabsContent>

            <TabsContent value="circulaires" className="space-y-4">
              <p className="text-gray-600 text-center py-8">
                Filtrage par circulaires et notes
              </p>
            </TabsContent>

            <TabsContent value="formulaires" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Formulaires Administratifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Les formulaires nécessaires pour vos démarches seront
                    disponibles ici en téléchargement.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/contact">
                      Demander un formulaire spécifique
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le barème 2026
                </Button>
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
