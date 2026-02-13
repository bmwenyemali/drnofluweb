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
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MAPBOX_CONFIG, MAP_POINTS } from "@/lib/config";

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

/**
 * Page Cartographie - Visualisation des points d'intérêt du Lualaba
 */
export default function CartographiePage() {
  const [showRecettes, setShowRecettes] = useState(true);
  const [showProjets, setShowProjets] = useState(true);
  const [showMines, setShowMines] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showTerritories, setShowTerritories] = useState(true);

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
                        id="boundaries"
                        checked={showBoundaries}
                        onCheckedChange={(checked) =>
                          setShowBoundaries(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="boundaries"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Globe className="h-4 w-4 text-primary-600" />
                        Limites du Lualaba
                      </Label>
                    </div>
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
                    showBoundaries={showBoundaries}
                    showTerritories={showTerritories}
                    height="600px"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

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
