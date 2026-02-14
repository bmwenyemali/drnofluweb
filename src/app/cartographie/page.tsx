"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MapPin,
  Building2,
  Coins,
  HardHat,
  Pickaxe,
  Layers,
  Filter,
  Info,
  Map,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MapPinned,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MAPBOX_CONFIG } from "@/lib/config";
import { createBrowserClient } from "@/lib/supabase";
import {
  CartographieTerritoire,
  CartographieProjet,
  CartographieZoneMiniere,
  CartographiePointRecette,
  TypeTerritoire,
} from "@/lib/types";

// Import dynamique pour éviter les erreurs SSR avec Mapbox
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-200 flex items-center justify-center">
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

const territoryTypes = [
  { type: "ville", label: "Villes", color: "#1e3a8a" },
  { type: "territoire", label: "Territoires", color: "#16a34a" },
  { type: "chefferie", label: "Chefferies", color: "#f59e0b" },
  { type: "secteur", label: "Secteurs", color: "#dc2626" },
];

const legendItems = [
  {
    type: "direction",
    label: "Siège DRNOFLU",
    color: "#1e3a8a",
    icon: Building2,
    description: "Direction principale",
  },
  {
    type: "recette",
    label: "Points de Recettes",
    color: "#16a34a",
    icon: Coins,
    description: "Bureaux de perception",
  },
  {
    type: "projet",
    label: "Projets",
    color: "#f59e0b",
    icon: HardHat,
    description: "Infrastructures financées",
  },
  {
    type: "mine",
    label: "Zones Minières",
    color: "#dc2626",
    icon: Pickaxe,
    description: "Sites de prélèvement",
  },
];

// Territory data with computed stats
interface TerritoryWithStats extends CartographieTerritoire {
  recettes_total?: number;
  projets_en_cours?: number;
  projets_termines?: number;
  zones_minieres?: number;
  points_recettes?: number;
  minerais?: string[];
}

/**
 * Page Cartographie - Visualisation des points d'intérêt du Lualaba
 */
export default function CartographiePage() {
  const [showRecettes, setShowRecettes] = useState(true);
  const [showProjets, setShowProjets] = useState(true);
  const [showMines, setShowMines] = useState(true);
  const [showTerritories, setShowTerritories] = useState(true);
  const [tableExpanded, setTableExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  // Data from database
  const [territoires, setTerritoires] = useState<TerritoryWithStats[]>([]);
  const [projets, setProjets] = useState<CartographieProjet[]>([]);
  const [mines, setMines] = useState<CartographieZoneMiniere[]>([]);
  const [pointsRecettes, setPointsRecettes] = useState<
    CartographiePointRecette[]
  >([]);

  const supabase = createBrowserClient();

  // Fetch data from database
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch territories (only villes and territories, not province)
      const { data: territoiresData } = await supabase
        .from("cartographie_territoires")
        .select("*")
        .in("type", ["ville", "territoire", "chefferie", "secteur"])
        .eq("actif", true)
        .order("type")
        .order("nom");

      // Fetch projects
      const { data: projetsData } = await supabase
        .from("cartographie_projets")
        .select("*")
        .eq("publie", true);

      // Fetch mining zones
      const { data: minesData } = await supabase
        .from("cartographie_zones_minieres")
        .select("*")
        .eq("publie", true);

      // Fetch revenue points
      const { data: recettesData } = await supabase
        .from("cartographie_points_recettes")
        .select("*")
        .eq("publie", true);

      if (projetsData) setProjets(projetsData);
      if (minesData) setMines(minesData);
      if (recettesData) setPointsRecettes(recettesData);

      // Compute stats for each territory
      if (territoiresData) {
        const territoriesWithStats: TerritoryWithStats[] = territoiresData.map(
          (t) => {
            const territoryProjets = (projetsData || []).filter(
              (p) => p.territoire_id === t.id,
            );
            const territoryMines = (minesData || []).filter(
              (m) => m.territoire_id === t.id,
            );
            const territoryRecettes = (recettesData || []).filter(
              (r) => r.territoire_id === t.id,
            );

            // Get all minerals from mines in this territory
            const allMinerais = territoryMines.flatMap((m) => m.minerais || []);
            const uniqueMinerais = [...new Set(allMinerais)];

            return {
              ...t,
              recettes_total: territoryRecettes.reduce(
                (sum, r) => sum + (r.recettes_2025_usd || 0),
                0,
              ),
              projets_en_cours: territoryProjets.filter(
                (p) => p.statut === "en_cours",
              ).length,
              projets_termines: territoryProjets.filter(
                (p) => p.statut === "termine",
              ).length,
              zones_minieres: territoryMines.length,
              points_recettes: territoryRecettes.length,
              minerais: uniqueMinerais,
            };
          },
        );

        setTerritoires(territoriesWithStats);
      }
    } catch (error) {
      console.error("Error fetching cartography data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format currency
  const formatUSD = (amount: number | null | undefined) => {
    if (!amount) return "-";
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  // Calculate total revenues
  const totalRecettes2025 = pointsRecettes.reduce(
    (sum, r) => sum + (r.recettes_2025_usd || 0),
    0,
  );

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cartographie du Lualaba
            </h1>
            <p className="text-xl text-primary-100">
              Visualisez les points de recettes, projets et zones
              d&apos;intervention de la DRNOFLU dans la province
            </p>
          </div>
        </div>
      </section>

      {/* Carte et Légende */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Panneau de contrôle */}
            <div className="lg:col-span-1 space-y-6">
              {/* Filtres */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="h-5 w-5" />
                    Filtres
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Couches de base */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Couches de base
                    </p>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="territories"
                        checked={showTerritories}
                        onCheckedChange={(checked) =>
                          setShowTerritories(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="territories"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Map className="h-4 w-4 text-gray-600" />
                        Territoires
                      </Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Points d'intérêt */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Points d'intérêt
                    </p>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="recettes"
                        checked={showRecettes}
                        onCheckedChange={(checked) =>
                          setShowRecettes(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="recettes"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: "#16a34a" }}
                        />
                        Points de Recettes ({pointsRecettes.length})
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="projets"
                        checked={showProjets}
                        onCheckedChange={(checked) =>
                          setShowProjets(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="projets"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: "#f59e0b" }}
                        />
                        Projets ({projets.length})
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="mines"
                        checked={showMines}
                        onCheckedChange={(checked) =>
                          setShowMines(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="mines"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: "#dc2626" }}
                        />
                        Zones Minières ({mines.length})
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Légende */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Layers className="h-5 w-5" />
                    Légende
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Légende Territoires */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Territoires
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {territoryTypes.map((t) => (
                        <div key={t.type} className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: t.color }}
                          />
                          <span className="text-xs text-gray-600">
                            {t.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Légende Points */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Points d'intérêt
                    </p>
                    {legendItems.map((item) => (
                      <div
                        key={item.type}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: item.color }}
                        >
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm">
                            {item.label}
                          </span>
                          <p className="text-xs text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">
                        Navigation
                      </h4>
                      <p className="text-sm text-blue-700">
                        Utilisez la molette pour zoomer, cliquez et faites
                        glisser pour vous déplacer. Cliquez sur un territoire
                        dans le tableau pour plus de détails.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Carte */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <MapView
                    center={MAPBOX_CONFIG.lualabaCenter}
                    zoom={MAPBOX_CONFIG.lualabaZoom}
                    showSiege={true}
                    showRecettes={showRecettes}
                    showProjets={showProjets}
                    showMines={showMines}
                    showBoundaries={false}
                    showTerritories={showTerritories}
                    height="600px"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau des données par territoire */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setTableExpanded(!tableExpanded)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5" />
                  Données par Territoire
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-sm">
                    Total Recettes 2025: ${formatUSD(totalRecettes2025)} USD
                  </Badge>
                  {tableExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            {tableExpanded && (
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">
                          Territoire
                        </TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold text-right">
                          Population
                        </TableHead>
                        <TableHead className="font-semibold text-right">
                          Recettes 2025
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                          Points Recettes
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                          Projets
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                          Zones Minières
                        </TableHead>
                        <TableHead className="font-semibold">
                          Minerais
                        </TableHead>
                        <TableHead className="font-semibold text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell colSpan={9}>
                              <Skeleton className="h-10 w-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : territoires.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center text-gray-500 py-12"
                          >
                            Aucun territoire trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        territoires.map((territory) => (
                          <TableRow
                            key={territory.id}
                            className="hover:bg-primary-50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor:
                                      territoryTypes.find(
                                        (t) => t.type === territory.type,
                                      )?.color || "#6b7280",
                                  }}
                                />
                                {territory.nom}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {TYPE_TERRITOIRE_LABELS[territory.type] ||
                                  territory.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {territory.population?.toLocaleString() || "-"}
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-700">
                              ${formatUSD(territory.recettes_total)}
                            </TableCell>
                            <TableCell className="text-center">
                              {(territory.points_recettes || 0) > 0 ? (
                                <Badge variant="secondary">
                                  {territory.points_recettes}
                                </Badge>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {(territory.projets_en_cours || 0) > 0 && (
                                  <Badge className="bg-orange-100 text-orange-700 text-xs">
                                    {territory.projets_en_cours} en cours
                                  </Badge>
                                )}
                                {(territory.projets_termines || 0) > 0 && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    {territory.projets_termines} terminé
                                  </Badge>
                                )}
                                {(territory.projets_en_cours || 0) === 0 &&
                                  (territory.projets_termines || 0) === 0 && (
                                    <span className="text-gray-400">-</span>
                                  )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {(territory.zones_minieres || 0) > 0 ? (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {territory.zones_minieres}
                                </Badge>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {(territory.minerais || []).length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {territory.minerais!.slice(0, 2).map((m) => (
                                    <Badge
                                      key={m}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {m}
                                    </Badge>
                                  ))}
                                  {(territory.minerais || []).length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{territory.minerais!.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/cartographie/${territory.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary-600 hover:text-primary-800"
                                >
                                  Détails
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-4 bg-gray-50 border-t text-sm text-gray-600">
                  <Info className="h-4 w-4 inline mr-2" />
                  Cliquez sur &quot;Détails&quot; pour voir toutes les
                  informations du territoire.
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <Map className="h-8 w-8 mb-4 opacity-80" />
                <p className="text-3xl font-bold">{territoires.length}</p>
                <p className="text-blue-100">Territoires</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <Coins className="h-8 w-8 mb-4 opacity-80" />
                <p className="text-3xl font-bold">{pointsRecettes.length}</p>
                <p className="text-green-100">Points de Recettes</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardContent className="p-6">
                <HardHat className="h-8 w-8 mb-4 opacity-80" />
                <p className="text-3xl font-bold">{projets.length}</p>
                <p className="text-yellow-100">Projets</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <Pickaxe className="h-8 w-8 mb-4 opacity-80" />
                <p className="text-3xl font-bold">{mines.length}</p>
                <p className="text-red-100">Zones Minières</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
