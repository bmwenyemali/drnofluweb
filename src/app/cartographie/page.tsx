"use client";

import { useState } from "react";
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
  X,
  Users,
  TrendingUp,
  MapPinned,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MAPBOX_CONFIG, MAP_POINTS, TERRITORY_DATA } from "@/lib/config";

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

// Types pour les territoires
interface TerritoryInfo {
  id: string;
  nom: string;
  type: string;
  population: string;
  superficie: string;
  coordinates: [number, number];
  recettes2024: number;
  recettes2025: number;
  pointsRecettes: number;
  projetsEnCours: number;
  projetsTermines: number;
  zonesMinieres: number;
  principauxMinerais: string[];
  description: string;
}

/**
 * Page Cartographie - Visualisation des points d'intérêt du Lualaba
 */
export default function CartographiePage() {
  const [showRecettes, setShowRecettes] = useState(true);
  const [showProjets, setShowProjets] = useState(true);
  const [showMines, setShowMines] = useState(true);
  const [showTerritories, setShowTerritories] = useState(true);
  const [selectedTerritory, setSelectedTerritory] =
    useState<TerritoryInfo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tableExpanded, setTableExpanded] = useState(true);

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
      count: MAP_POINTS.pointsRecettes.length,
    },
    {
      type: "projet",
      label: "Projets",
      color: "#f59e0b",
      icon: HardHat,
      description: "Infrastructures financées",
      count: MAP_POINTS.projets.length,
    },
    {
      type: "mine",
      label: "Zones Minières",
      color: "#dc2626",
      icon: Pickaxe,
      description: "Sites de prélèvement",
      count: MAP_POINTS.mines.length,
    },
  ];

  const territoryTypes = [
    { type: "ville", label: "Villes", color: "#1e3a8a" },
    { type: "territoire", label: "Territoires", color: "#16a34a" },
    { type: "chefferie", label: "Chefferies", color: "#f59e0b" },
    { type: "secteur", label: "Secteurs", color: "#dc2626" },
  ];

  // Formater le montant en USD
  const formatUSD = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  // Calculer le total des recettes
  const totalRecettes2025 = TERRITORY_DATA.reduce(
    (sum, t) => sum + t.recettes2025,
    0,
  );

  // Ouvrir le dialog avec les détails du territoire
  const handleTerritoryClick = (territory: TerritoryInfo) => {
    setSelectedTerritory(territory);
    setDialogOpen(true);
  };

  // Obtenir les projets pour un territoire
  const getProjectsForTerritory = (territoryName: string) => {
    return MAP_POINTS.projets.filter(
      (p) => "territoire" in p && p.territoire === territoryName,
    );
  };

  // Obtenir les mines pour un territoire
  const getMinesForTerritory = (territoryName: string) => {
    return MAP_POINTS.mines.filter(
      (m) => "territoire" in m && m.territoire === territoryName,
    );
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-linear-to-br from-primary-900 to-primary-800 text-white py-16">
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
                        Points de Recettes
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
                        Projets
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
                        Zones Minières
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
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {item.label}
                            </span>
                            {item.count && (
                              <Badge variant="secondary" className="text-xs">
                                {item.count}
                              </Badge>
                            )}
                          </div>
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
                        glisser pour vous déplacer. Cliquez sur un marqueur pour
                        plus d&apos;informations.
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TERRITORY_DATA.map((territory) => (
                        <TableRow
                          key={territory.id}
                          className="cursor-pointer hover:bg-primary-50 transition-colors"
                          onClick={() =>
                            handleTerritoryClick(territory as TerritoryInfo)
                          }
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
                              {territory.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {territory.population}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-700">
                            ${formatUSD(territory.recettes2025)}
                          </TableCell>
                          <TableCell className="text-center">
                            {territory.pointsRecettes > 0 ? (
                              <Badge variant="secondary">
                                {territory.pointsRecettes}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              {territory.projetsEnCours > 0 && (
                                <Badge className="bg-orange-100 text-orange-700 text-xs">
                                  {territory.projetsEnCours} en cours
                                </Badge>
                              )}
                              {territory.projetsTermines > 0 && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  {territory.projetsTermines} terminé
                                </Badge>
                              )}
                              {territory.projetsEnCours === 0 &&
                                territory.projetsTermines === 0 && (
                                  <span className="text-gray-400">-</span>
                                )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {territory.zonesMinieres > 0 ? (
                              <Badge variant="destructive" className="text-xs">
                                {territory.zonesMinieres}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {territory.principauxMinerais.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {territory.principauxMinerais.map((m) => (
                                  <Badge
                                    key={m}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {m}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-4 bg-gray-50 border-t text-sm text-gray-600">
                  <Info className="h-4 w-4 inline mr-2" />
                  Cliquez sur une ligne pour voir plus de détails sur le
                  territoire.
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </section>

      {/* Dialog détails territoire */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    territoryTypes.find(
                      (t) => t.type === selectedTerritory?.type,
                    )?.color || "#6b7280",
                }}
              />
              {selectedTerritory?.nom}
              <Badge variant="outline" className="ml-2 capitalize">
                {selectedTerritory?.type}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedTerritory && (
            <div className="space-y-6">
              {/* Description */}
              <p className="text-gray-600">{selectedTerritory.description}</p>

              {/* Stats principales */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-lg font-bold">
                    {selectedTerritory.population}
                  </p>
                  <p className="text-xs text-gray-500">Population</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <MapPinned className="h-6 w-6 mx-auto text-green-600 mb-2" />
                  <p className="text-lg font-bold">
                    {selectedTerritory.superficie}
                  </p>
                  <p className="text-xs text-gray-500">Superficie</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                  <p className="text-lg font-bold text-green-700">
                    ${formatUSD(selectedTerritory.recettes2025)}
                  </p>
                  <p className="text-xs text-gray-500">Recettes 2025</p>
                </div>
              </div>

              {/* Évolution recettes */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Évolution des Recettes
                </h4>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      2024: ${formatUSD(selectedTerritory.recettes2024)} USD
                    </p>
                    <p className="text-sm font-medium text-green-700">
                      2025: ${formatUSD(selectedTerritory.recettes2025)} USD
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    +
                    {(
                      ((selectedTerritory.recettes2025 -
                        selectedTerritory.recettes2024) /
                        selectedTerritory.recettes2024) *
                      100
                    ).toFixed(0)}
                    %
                  </Badge>
                </div>
              </div>

              {/* Projets */}
              {(selectedTerritory.projetsEnCours > 0 ||
                selectedTerritory.projetsTermines > 0) && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <HardHat className="h-4 w-4 text-orange-600" />
                    Projets (
                    {selectedTerritory.projetsEnCours +
                      selectedTerritory.projetsTermines}
                    )
                  </h4>
                  <div className="space-y-2">
                    {getProjectsForTerritory(selectedTerritory.nom).map(
                      (projet) => (
                        <div
                          key={projet.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{projet.name}</p>
                            <p className="text-xs text-gray-500">
                              {projet.description}
                            </p>
                          </div>
                          <div className="text-right">
                            {"budget" in projet && (
                              <p className="text-sm font-medium">
                                {projet.budget as string}
                              </p>
                            )}
                            {"statut" in projet && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${projet.statut === "Terminé" ? "bg-green-50 text-green-700" : projet.statut === "En cours" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-700"}`}
                              >
                                {projet.statut as string}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Zones minières */}
              {selectedTerritory.zonesMinieres > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Pickaxe className="h-4 w-4 text-red-600" />
                    Zones Minières ({selectedTerritory.zonesMinieres})
                  </h4>
                  <div className="space-y-2">
                    {getMinesForTerritory(selectedTerritory.nom).map((mine) => (
                      <div
                        key={mine.id}
                        className="flex items-center justify-between bg-red-50 p-3 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{mine.name}</p>
                          <p className="text-xs text-gray-500">
                            {mine.description}
                          </p>
                        </div>
                        <div className="text-right">
                          {"minerais" in mine && (
                            <div className="flex flex-wrap gap-1 justify-end">
                              {(mine.minerais as string[]).map((m) => (
                                <Badge
                                  key={m}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {m}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {"operateur" in mine && (
                            <p className="text-xs text-gray-500 mt-1">
                              {mine.operateur as string}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Statistiques */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Présence dans le Lualaba
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Building2 className="h-10 w-10 text-primary-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-primary-900">1</p>
                <p className="text-gray-600">Direction Principale</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Coins className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-green-700">
                  {MAP_POINTS.pointsRecettes.length}
                </p>
                <p className="text-gray-600">Points de Recettes</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <HardHat className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-orange-700">
                  {MAP_POINTS.projets.length}
                </p>
                <p className="text-gray-600">Projets en Cours</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Pickaxe className="h-10 w-10 text-red-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-red-700">
                  {MAP_POINTS.mines.length}
                </p>
                <p className="text-gray-600">Zones Minières</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Propositions de cartographies */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Applications Cartographiques Proposées
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coins className="h-5 w-5 text-green-600" />
                  Carte des Recettes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Visualisation en temps réel des recettes collectées par zone
                  géographique avec indicateurs de performance.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Recettes par territoire</li>
                  <li>• Évolution mensuelle</li>
                  <li>• Comparaison année précédente</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardHat className="h-5 w-5 text-orange-600" />
                  Carte des Projets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Suivi des projets d&apos;infrastructure financés par les
                  recettes non fiscales avec état d&apos;avancement.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Routes et ponts</li>
                  <li>• Écoles et hôpitaux</li>
                  <li>• Infrastructures communautaires</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pickaxe className="h-5 w-5 text-red-600" />
                  Carte Minière
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cartographie des zones minières avec informations sur les
                  permis et les redevances collectées.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Permis d&apos;exploitation</li>
                  <li>• Zones de recherche</li>
                  <li>• Redevances dues/payées</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
