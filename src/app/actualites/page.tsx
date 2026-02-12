import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  ArrowRight,
  Search,
  Filter,
  Tag,
  Newspaper,
} from "lucide-react";
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
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Suivez les dernières actualités, communiqués et annonces de la DRNOFLU.",
};

async function getActualites() {
  const supabase = await createClient();
  const { data: actualites, error } = await supabase
    .from("actualites")
    .select(
      `
      *,
      auteur:profiles(nom_complet, avatar_url)
    `,
    )
    .eq("publie", true)
    .order("date_publication", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching actualites:", error);
    return [];
  }

  return actualites || [];
}

/**
 * Page Actualités - Liste des articles
 */
export default async function ActualitesPage() {
  const actualites = await getActualites();

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
          {actualites.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600">
                Aucune actualité pour le moment
              </h3>
              <p className="text-gray-500 mt-2">
                Revenez bientôt pour les dernières nouvelles
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Articles principaux */}
              <div className="lg:col-span-2 space-y-6">
                {actualites.map((actu: any) => {
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
                          <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-primary-100 to-primary-50 flex-shrink-0 relative">
                            {actu.image_url ? (
                              <Image
                                src={actu.image_url}
                                alt={actu.titre}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Newspaper className="h-12 w-12 text-primary-300" />
                              </div>
                            )}
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
                                {new Date(
                                  actu.date_publication,
                                ).toLocaleDateString("fr-FR", {
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
                              {actualites.filter((a: any) => a.categorie === cat.id).length}
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
                      {actualites.slice(0, 4).map((actu: any) => (
                        <li key={actu.id}>
                          <Link
                            href={`/actualites/${actu.slug}`}
                            className="group"
                          >
                            <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">
                              {actu.titre}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(actu.date_publication).toLocaleDateString("fr-FR")}
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
          )}
        </div>
      </section>
    </>
  );
}
