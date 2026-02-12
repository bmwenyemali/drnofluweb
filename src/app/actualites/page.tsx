import { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, Search, Filter, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES_ACTUALITES } from "@/lib/config";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Suivez les dernières actualités, communiqués et annonces de la DRNOFLU.",
};

// Données statiques des actualités (à remplacer par Supabase)
const actualites = [
  {
    id: 1,
    titre: "Campagne de sensibilisation sur les recettes non fiscales 2026",
    slug: "campagne-sensibilisation-2026",
    extrait:
      "La DRNOFLU lance une vaste campagne de sensibilisation à travers toute la province pour informer les contribuables sur leurs obligations et les avantages de la contribution citoyenne.",
    contenu: "",
    categorie: "communique",
    date: "2026-02-10",
    image_url: "/images/actualites/campagne.jpg",
    auteur: "DRNOFLU",
  },
  {
    id: 2,
    titre: "Publication du rapport annuel 2025",
    slug: "rapport-annuel-2025",
    extrait:
      "Le rapport annuel de la DRNOFLU pour l'exercice 2025 est maintenant disponible. Ce document présente les réalisations, les défis et les perspectives de notre institution.",
    contenu: "",
    categorie: "rapport",
    date: "2026-02-05",
    image_url: "/images/actualites/rapport.jpg",
    auteur: "DRNOFLU",
  },
  {
    id: 3,
    titre: "Nouvelle procédure de déclaration simplifiée",
    slug: "procedure-declaration-simplifiee",
    extrait:
      "Pour faciliter les démarches des contribuables, la DRNOFLU introduit une nouvelle procédure simplifiée de déclaration. Cette initiative vise à réduire les délais et améliorer l'expérience utilisateur.",
    contenu: "",
    categorie: "annonce",
    date: "2026-01-28",
    image_url: "/images/actualites/procedure.jpg",
    auteur: "DRNOFLU",
  },
  {
    id: 4,
    titre: "Rencontre avec les opérateurs miniers",
    slug: "rencontre-operateurs-miniers",
    extrait:
      "La Direction a organisé une rencontre avec les principaux opérateurs miniers de la province pour discuter des modalités de contribution et des projets de développement.",
    contenu: "",
    categorie: "evenement",
    date: "2026-01-20",
    image_url: "/images/actualites/rencontre.jpg",
    auteur: "DRNOFLU",
  },
  {
    id: 5,
    titre: "Bilan du premier trimestre 2026",
    slug: "bilan-premier-trimestre-2026",
    extrait:
      "La DRNOFLU présente le bilan provisoire du premier trimestre avec des résultats encourageants dans la mobilisation des recettes provinciales.",
    contenu: "",
    categorie: "rapport",
    date: "2026-01-15",
    image_url: "/images/actualites/bilan.jpg",
    auteur: "DRNOFLU",
  },
  {
    id: 6,
    titre: "Modernisation des services numériques",
    slug: "modernisation-services-numeriques",
    extrait:
      "Dans le cadre de la transformation digitale, la DRNOFLU annonce le lancement prochain de nouveaux services en ligne pour faciliter les démarches des contribuables.",
    contenu: "",
    categorie: "annonce",
    date: "2026-01-10",
    image_url: "/images/actualites/digital.jpg",
    auteur: "DRNOFLU",
  },
];

/**
 * Page Actualités - Liste des articles
 */
export default function ActualitesPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Actualités</h1>
            <p className="text-xl text-primary-100">
              Suivez les dernières nouvelles et communiqués de la DRNOFLU
            </p>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-6 bg-white border-b sticky top-[73px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une actualité..."
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {CATEGORIES_ACTUALITES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {CATEGORIES_ACTUALITES.map((cat) => (
                <Badge
                  key={cat.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary-50"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Liste des actualités */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Articles principaux */}
            <div className="lg:col-span-2 space-y-6">
              {actualites.map((actu) => {
                const categorie = CATEGORIES_ACTUALITES.find(
                  (c) => c.id === actu.categorie,
                );
                return (
                  <Card
                    key={actu.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-primary-100 to-primary-50 flex-shrink-0 flex items-center justify-center">
                          <span className="text-primary-400 text-sm">
                            Image
                          </span>
                        </div>

                        {/* Contenu */}
                        <div className="p-6 flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge
                              variant="secondary"
                              className="bg-primary-100 text-primary-700"
                            >
                              {categorie?.label || "Actualité"}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(actu.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <Link href={`/actualites/${actu.slug}`}>
                            <h2 className="text-xl font-bold text-gray-900 hover:text-primary-700 transition-colors mb-2">
                              {actu.titre}
                            </h2>
                          </Link>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {actu.extrait}
                          </p>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/actualites/${actu.slug}`}>
                              Lire la suite
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Pagination */}
              <div className="flex justify-center gap-2 pt-6">
                <Button variant="outline" disabled>
                  Précédent
                </Button>
                <Button variant="outline" className="bg-primary-50">
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Suivant</Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Catégories */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-4">Catégories</h3>
                  <ul className="space-y-2">
                    {CATEGORIES_ACTUALITES.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/actualites?categorie=${cat.id}`}
                          className="flex items-center justify-between text-sm text-gray-600 hover:text-primary-700 py-1"
                        >
                          <span>{cat.label}</span>
                          <Badge variant="secondary" className="text-xs">
                            {
                              actualites.filter((a) => a.categorie === cat.id)
                                .length
                            }
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Articles récents */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-4">Articles Récents</h3>
                  <ul className="space-y-4">
                    {actualites.slice(0, 4).map((actu) => (
                      <li key={actu.id}>
                        <Link
                          href={`/actualites/${actu.slug}`}
                          className="group"
                        >
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">
                            {actu.titre}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(actu.date).toLocaleDateString("fr-FR")}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="bg-primary-50 border-primary-200">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">Newsletter</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Recevez nos actualités par email
                  </p>
                  <div className="space-y-2">
                    <Input placeholder="Votre email" type="email" />
                    <Button className="w-full">S&apos;abonner</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
