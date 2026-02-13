"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  ArrowRight,
  Search,
  Filter,
  Tag,
  Newspaper,
  ChevronLeft,
  ChevronRight,
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
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORIES_ACTUALITES } from "@/lib/config";
import { createBrowserClient } from "@/lib/supabase";
import { Actualite } from "@/lib/types";

const ITEMS_PER_PAGE = 6;

/**
 * Page Actualités - Liste des articles avec pagination fonctionnelle
 */
export default function ActualitesPage() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("actualites")
      .select("*")
      .eq("publie", true)
      .order("date_publication", { ascending: false });

    if (!error && data) {
      setActualites(data);
    }
    setLoading(false);
  };

  // Filtrer les actualités
  const filteredActualites = actualites.filter((actu) => {
    const matchesSearch =
      actu.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actu.extrait?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || actu.categorie === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActualites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedActualites = filteredActualites.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une actualité..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
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
            <div className="flex flex-wrap gap-2">
              {CATEGORIES_ACTUALITES.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={categoryFilter === cat.id ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary-50"
                  onClick={() =>
                    setCategoryFilter(
                      categoryFilter === cat.id ? "all" : cat.id,
                    )
                  }
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
          {loading ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <Skeleton className="md:w-64 h-48" />
                        <div className="p-6 flex-1 space-y-4">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-64" />
              </div>
            </div>
          ) : filteredActualites.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600">
                {searchQuery || categoryFilter !== "all"
                  ? "Aucune actualité ne correspond à vos critères"
                  : "Aucune actualité pour le moment"}
              </h3>
              <p className="text-gray-500 mt-2">
                {searchQuery || categoryFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Revenez bientôt pour les dernières nouvelles"}
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Articles principaux */}
              <div className="lg:col-span-2 space-y-6">
                {paginatedActualites.map((actu) => {
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
                                  actu.date_publication || actu.created_at,
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
                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center gap-2 pt-6">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Précédent</span>
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      ),
                    )}
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="flex items-center gap-1"
                    >
                      <span className="hidden sm:inline">Suivant</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {/* Info pagination */}
                <p className="text-center text-sm text-gray-500 mt-4">
                  Affichage de {startIndex + 1}-
                  {Math.min(
                    startIndex + ITEMS_PER_PAGE,
                    filteredActualites.length,
                  )}{" "}
                  sur {filteredActualites.length} actualités
                </p>
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
                          <button
                            onClick={() =>
                              setCategoryFilter(
                                categoryFilter === cat.id ? "all" : cat.id,
                              )
                            }
                            className={`flex items-center justify-between w-full text-sm py-1 transition-colors ${
                              categoryFilter === cat.id
                                ? "text-primary-700 font-medium"
                                : "text-gray-600 hover:text-primary-700"
                            }`}
                          >
                            <span>{cat.label}</span>
                            <Badge variant="secondary" className="text-xs">
                              {
                                actualites.filter((a) => a.categorie === cat.id)
                                  .length
                              }
                            </Badge>
                          </button>
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
                              {new Date(
                                actu.date_publication || actu.created_at,
                              ).toLocaleDateString("fr-FR")}
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
