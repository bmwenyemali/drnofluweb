"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MapPin,
  Map,
  Users,
  Building2,
  Pickaxe,
  Coins,
  HardHat,
  ArrowLeft,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createBrowserClient } from "@/lib/supabase";
import {
  CartographieTerritoire,
  CartographieProjet,
  CartographieZoneMiniere,
  CartographiePointRecette,
  TypeTerritoire,
  TypeProjet,
  StatutProjet,
} from "@/lib/types";

// Import dynamique pour éviter les erreurs SSR avec Mapbox
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

// Type labels
const TYPE_TERRITOIRE_LABELS: Record<TypeTerritoire, string> = {
  province: "Province",
  ville: "Ville",
  territoire: "Territoire",
  chefferie: "Chefferie",
  secteur: "Secteur",
  groupement: "Groupement",
  localite: "Localité",
};

const TYPE_PROJET_LABELS: Record<TypeProjet, string> = {
  infrastructure: "Infrastructure",
  education: "Éducation",
  sante: "Santé",
  eau: "Eau",
  electricite: "Électricité",
  route: "Route",
  pont: "Pont",
  marche: "Marché",
  agriculture: "Agriculture",
  environnement: "Environnement",
  social: "Social",
  autre: "Autre",
};

const STATUT_PROJET_LABELS: Record<StatutProjet, string> = {
  propose: "Proposé",
  planifie: "Planifié",
  en_cours: "En cours",
  suspendu: "Suspendu",
  termine: "Terminé",
  annule: "Annulé",
};

const STATUT_COLORS: Record<StatutProjet, string> = {
  propose: "bg-gray-100 text-gray-800",
  planifie: "bg-blue-100 text-blue-800",
  en_cours: "bg-yellow-100 text-yellow-800",
  suspendu: "bg-orange-100 text-orange-800",
  termine: "bg-green-100 text-green-800",
  annule: "bg-red-100 text-red-800",
};

const TYPE_EXPLOITATION_LABELS: Record<string, string> = {
  industrielle: "Industrielle",
  artisanale: "Artisanale",
  semi_industrielle: "Semi-industrielle",
  carriere: "Carrière",
};

const TYPE_BUREAU_LABELS: Record<string, string> = {
  siege: "Siège",
  perception: "Perception",
  antenne: "Antenne",
  guichet: "Guichet",
  mobile: "Mobile",
};

export default function TerritoireDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [territoire, setTerritoire] = useState<CartographieTerritoire | null>(
    null,
  );
  const [projets, setProjets] = useState<CartographieProjet[]>([]);
  const [mines, setMines] = useState<CartographieZoneMiniere[]>([]);
  const [pointsRecettes, setPointsRecettes] = useState<
    CartographiePointRecette[]
  >([]);
  const [childTerritoires, setChildTerritoires] = useState<
    CartographieTerritoire[]
  >([]);

  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch territoire
        const { data: territoireData, error } = await supabase
          .from("cartographie_territoires")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !territoireData) {
          console.error("Error fetching territoire:", error);
          setLoading(false);
          return;
        }

        setTerritoire(territoireData);

        // Fetch child territories
        const { data: childData } = await supabase
          .from("cartographie_territoires")
          .select("*")
          .eq("parent_id", id)
          .eq("actif", true)
          .order("type")
          .order("nom");
        if (childData) setChildTerritoires(childData);

        // Fetch projects
        const { data: projetsData } = await supabase
          .from("cartographie_projets")
          .select("*")
          .eq("territoire_id", id)
          .eq("publie", true)
          .order("statut");
        if (projetsData) setProjets(projetsData);

        // Fetch mining zones
        const { data: minesData } = await supabase
          .from("cartographie_zones_minieres")
          .select("*")
          .eq("territoire_id", id)
          .eq("publie", true);
        if (minesData) setMines(minesData);

        // Fetch revenue points
        const { data: recettesData } = await supabase
          .from("cartographie_points_recettes")
          .select("*")
          .eq("territoire_id", id)
          .eq("publie", true);
        if (recettesData) setPointsRecettes(recettesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, supabase]);

  // Format currency
  const formatUSD = (amount: number | null | undefined) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate stats
  const totalRecettes = pointsRecettes.reduce(
    (sum, r) => sum + (r.recettes_2025_usd || 0),
    0,
  );
  const projetsEnCours = projets.filter((p) => p.statut === "en_cours").length;
  const projetsTermines = projets.filter((p) => p.statut === "termine").length;
  const totalInvestissement = projets.reduce(
    (sum, p) => sum + (p.cout_estime_usd || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 bg-white/20 mb-4" />
            <Skeleton className="h-12 w-96 bg-white/20" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!territoire) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Territoire non trouvé</h2>
            <p className="text-gray-600 mb-6">
              Le territoire demandé n&apos;existe pas ou a été supprimé.
            </p>
            <Link href="/cartographie">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la cartographie
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/cartographie"
            className="inline-flex items-center text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la cartographie
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Badge className="bg-white/20 text-white border-white/30 text-sm">
              {TYPE_TERRITOIRE_LABELS[territoire.type] || territoire.type}
            </Badge>
            {territoire.code && (
              <Badge variant="outline" className="border-white/30 text-white">
                Code: {territoire.code}
              </Badge>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {territoire.nom}
          </h1>
          {territoire.description && (
            <p className="text-xl text-primary-100 max-w-3xl">
              {territoire.description}
            </p>
          )}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-200">
            <div className="py-6 px-4 text-center">
              <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold">
                {territoire.population?.toLocaleString() || "-"}
              </p>
              <p className="text-sm text-gray-500">Population</p>
            </div>
            <div className="py-6 px-4 text-center">
              <Map className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold">
                {territoire.superficie_km2?.toLocaleString() || "-"} km²
              </p>
              <p className="text-sm text-gray-500">Superficie</p>
            </div>
            <div className="py-6 px-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto text-emerald-600 mb-2" />
              <p className="text-2xl font-bold text-emerald-600">
                {formatUSD(totalRecettes)}
              </p>
              <p className="text-sm text-gray-500">Recettes 2025</p>
            </div>
            <div className="py-6 px-4 text-center">
              <HardHat className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
              <p className="text-2xl font-bold">{projets.length}</p>
              <p className="text-sm text-gray-500">Projets</p>
            </div>
            <div className="py-6 px-4 text-center">
              <Pickaxe className="h-6 w-6 mx-auto text-red-600 mb-2" />
              <p className="text-2xl font-bold">{mines.length}</p>
              <p className="text-sm text-gray-500">Zones Minières</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Map */}
              {territoire.latitude && territoire.longitude && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Localisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <MapView
                      center={{
                        lng: territoire.longitude,
                        lat: territoire.latitude,
                      }}
                      zoom={11}
                      showSiege={false}
                      showRecettes={true}
                      showProjets={true}
                      showMines={true}
                      height="400px"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Tabs for different content */}
              <Tabs defaultValue="projets" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger
                    value="projets"
                    className="flex items-center gap-2"
                  >
                    <HardHat className="h-4 w-4" />
                    <span className="hidden sm:inline">Projets</span>
                    <Badge variant="secondary" className="ml-1">
                      {projets.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="mines"
                    className="flex items-center gap-2"
                  >
                    <Pickaxe className="h-4 w-4" />
                    <span className="hidden sm:inline">Mines</span>
                    <Badge variant="secondary" className="ml-1">
                      {mines.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="recettes"
                    className="flex items-center gap-2"
                  >
                    <Coins className="h-4 w-4" />
                    <span className="hidden sm:inline">Recettes</span>
                    <Badge variant="secondary" className="ml-1">
                      {pointsRecettes.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="sub" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Sous-entités</span>
                    <Badge variant="secondary" className="ml-1">
                      {childTerritoires.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                {/* Projets Tab */}
                <TabsContent value="projets" className="mt-6">
                  {projets.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-gray-500">
                        <HardHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucun projet enregistré pour ce territoire</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {projets.map((projet) => (
                        <Card
                          key={projet.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">
                                    {TYPE_PROJET_LABELS[projet.type_projet] ||
                                      projet.type_projet}
                                  </Badge>
                                  <Badge
                                    className={STATUT_COLORS[projet.statut]}
                                  >
                                    {STATUT_PROJET_LABELS[projet.statut] ||
                                      projet.statut}
                                  </Badge>
                                </div>
                                <h3 className="text-lg font-semibold">
                                  {projet.nom}
                                </h3>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-primary-700">
                                  {formatUSD(projet.cout_estime_usd)}
                                </p>
                                <p className="text-sm text-gray-500">Budget</p>
                              </div>
                            </div>

                            {projet.description && (
                              <p className="text-gray-600 mb-4">
                                {projet.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              {projet.date_debut && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Début:{" "}
                                  {new Date(
                                    projet.date_debut,
                                  ).toLocaleDateString("fr-FR")}
                                </div>
                              )}
                              {projet.date_fin_prevue && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Fin prévue:{" "}
                                  {new Date(
                                    projet.date_fin_prevue,
                                  ).toLocaleDateString("fr-FR")}
                                </div>
                              )}
                              {projet.beneficiaires_prevus && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {projet.beneficiaires_prevus.toLocaleString()}{" "}
                                  bénéficiaires
                                </div>
                              )}
                            </div>

                            {projet.pourcentage_avancement > 0 && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-500">
                                    Avancement
                                  </span>
                                  <span className="text-sm font-medium">
                                    {projet.pourcentage_avancement}%
                                  </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary-600 rounded-full transition-all"
                                    style={{
                                      width: `${projet.pourcentage_avancement}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Mines Tab */}
                <TabsContent value="mines" className="mt-6">
                  {mines.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-gray-500">
                        <Pickaxe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>
                          Aucune zone minière enregistrée pour ce territoire
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {mines.map((mine) => (
                        <Card
                          key={mine.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {TYPE_EXPLOITATION_LABELS[
                                      mine.type_exploitation
                                    ] || mine.type_exploitation}
                                  </Badge>
                                </div>
                                <h3 className="text-lg font-semibold">
                                  {mine.nom}
                                </h3>
                                {mine.operateur && (
                                  <p className="text-sm text-gray-500">
                                    Opérateur: {mine.operateur}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-green-700">
                                  {formatUSD(mine.redevances_annuelles_usd)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Redevances/an
                                </p>
                              </div>
                            </div>

                            {mine.description && (
                              <p className="text-gray-600 mb-4">
                                {mine.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4">
                              {(mine.minerais || []).map((m) => (
                                <Badge
                                  key={m}
                                  className="bg-red-100 text-red-800"
                                >
                                  {m}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              {mine.employes_directs && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {mine.employes_directs.toLocaleString()}{" "}
                                  employés directs
                                </div>
                              )}
                              {mine.production_annuelle_tonnes && (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  {mine.production_annuelle_tonnes.toLocaleString()}{" "}
                                  tonnes/an
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Recettes Tab */}
                <TabsContent value="recettes" className="mt-6">
                  {pointsRecettes.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-gray-500">
                        <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>
                          Aucun point de recette enregistré pour ce territoire
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {pointsRecettes.map((point) => (
                        <Card
                          key={point.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {TYPE_BUREAU_LABELS[point.type_bureau] ||
                                      point.type_bureau}
                                  </Badge>
                                  {point.actif && (
                                    <Badge className="bg-green-100 text-green-800">
                                      Actif
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="text-lg font-semibold">
                                  {point.nom}
                                </h3>
                                {point.responsable && (
                                  <p className="text-sm text-gray-500">
                                    Responsable: {point.responsable}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-green-700">
                                  {formatUSD(point.recettes_2025_usd)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Recettes 2025
                                </p>
                              </div>
                            </div>

                            {point.description && (
                              <p className="text-gray-600 mb-4">
                                {point.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              {point.telephone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {point.telephone}
                                </div>
                              )}
                              {point.horaires && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {point.horaires}
                                </div>
                              )}
                            </div>

                            {point.services_offerts &&
                              point.services_offerts.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {point.services_offerts.map((service) => (
                                    <Badge
                                      key={service}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Sub-territories Tab */}
                <TabsContent value="sub" className="mt-6">
                  {childTerritoires.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-gray-500">
                        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune sous-entité enregistrée pour ce territoire</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {childTerritoires.map((child) => (
                        <Link key={child.id} href={`/cartographie/${child.id}`}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">
                                  {TYPE_TERRITOIRE_LABELS[child.type] ||
                                    child.type}
                                </Badge>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-semibold mb-2">
                                {child.nom}
                              </h3>
                              <div className="flex gap-4 text-sm text-gray-600">
                                {child.population && (
                                  <span>
                                    {child.population.toLocaleString()} hab.
                                  </span>
                                )}
                                {child.superficie_km2 && (
                                  <span>
                                    {child.superficie_km2.toLocaleString()} km²
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Projets en cours</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {projetsEnCours}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Projets terminés</span>
                    <Badge className="bg-green-100 text-green-800">
                      {projetsTermines}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total investissement</span>
                    <span className="font-bold text-primary-700">
                      {formatUSD(totalInvestissement)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Recettes 2025</span>
                    <span className="font-bold text-green-700">
                      {formatUSD(totalRecettes)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              {(territoire.contact_telephone ||
                territoire.contact_email ||
                territoire.administrateur) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {territoire.administrateur && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{territoire.administrateur}</span>
                      </div>
                    )}
                    {territoire.contact_telephone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a
                          href={`tel:${territoire.contact_telephone}`}
                          className="text-primary-600 hover:underline"
                        >
                          {territoire.contact_telephone}
                        </a>
                      </div>
                    )}
                    {territoire.contact_email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a
                          href={`mailto:${territoire.contact_email}`}
                          className="text-primary-600 hover:underline"
                        >
                          {territoire.contact_email}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Resources */}
              {territoire.ressources_principales &&
                territoire.ressources_principales.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Ressources principales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {territoire.ressources_principales.map((ressource) => (
                          <Badge key={ressource} variant="secondary">
                            {ressource}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Particularities */}
              {territoire.particularites && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Particularités</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      {territoire.particularites}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Coordinates */}
              {territoire.latitude && territoire.longitude && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Coordonnées GPS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latitude</span>
                      <span className="font-mono">
                        {territoire.latitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Longitude</span>
                      <span className="font-mono">
                        {territoire.longitude.toFixed(6)}
                      </span>
                    </div>
                    {territoire.altitude && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Altitude</span>
                        <span>{territoire.altitude} m</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
