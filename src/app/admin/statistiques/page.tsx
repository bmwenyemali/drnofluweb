"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Calendar,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBrowserClient } from "@/lib/supabase";

interface Stats {
  totalRecettes: number;
  totalContribuables: number;
  totalDocuments: number;
  totalActualites: number;
  recettesParMois: { mois: string; montant: number }[];
  recettesParType: { type: string; montant: number }[];
}

export default function StatistiquesPage() {
  const [stats, setStats] = useState<Stats>({
    totalRecettes: 0,
    totalContribuables: 0,
    totalDocuments: 0,
    totalActualites: 0,
    recettesParMois: [],
    recettesParType: [],
  });
  const [loading, setLoading] = useState(true);
  const [annee, setAnnee] = useState(new Date().getFullYear().toString());
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchStats();
  }, [annee]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch counts
      const [
        { count: documentsCount },
        { count: actualitesCount },
        { data: statsRecettes },
      ] = await Promise.all([
        supabase.from("documents").select("*", { count: "exact", head: true }),
        supabase.from("actualites").select("*", { count: "exact", head: true }),
        supabase
          .from("statistiques_recettes")
          .select("*")
          .eq("annee", parseInt(annee)),
      ]);

      // Process stats
      let totalRecettes = 0;
      const recettesParMois: { mois: string; montant: number }[] = [];
      const recettesParTypeMap: { [key: string]: number } = {};

      if (statsRecettes) {
        statsRecettes.forEach((stat) => {
          totalRecettes += stat.montant;

          // Par mois
          if (stat.mois) {
            const moisNoms = [
              "Jan",
              "Fév",
              "Mar",
              "Avr",
              "Mai",
              "Juin",
              "Juil",
              "Août",
              "Sep",
              "Oct",
              "Nov",
              "Déc",
            ];
            const existingMois = recettesParMois.find(
              (m) => m.mois === moisNoms[stat.mois - 1],
            );
            if (existingMois) {
              existingMois.montant += stat.montant;
            } else {
              recettesParMois.push({
                mois: moisNoms[stat.mois - 1],
                montant: stat.montant,
              });
            }
          }

          // Par type
          if (stat.type_recette) {
            recettesParTypeMap[stat.type_recette] =
              (recettesParTypeMap[stat.type_recette] || 0) + stat.montant;
          }
        });
      }

      const recettesParType = Object.entries(recettesParTypeMap).map(
        ([type, montant]) => ({
          type,
          montant,
        }),
      );

      setStats({
        totalRecettes,
        totalContribuables: 5000, // Placeholder
        totalDocuments: documentsCount || 0,
        totalActualites: actualitesCount || 0,
        recettesParMois: recettesParMois.sort((a, b) => {
          const moisOrdre = [
            "Jan",
            "Fév",
            "Mar",
            "Avr",
            "Mai",
            "Juin",
            "Juil",
            "Août",
            "Sep",
            "Oct",
            "Nov",
            "Déc",
          ];
          return moisOrdre.indexOf(a.mois) - moisOrdre.indexOf(b.mois);
        }),
        recettesParType,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMontant = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statCards = [
    {
      title: "Recettes Totales",
      value: formatMontant(stats.totalRecettes),
      icon: DollarSign,
      color: "bg-green-500",
      change: "+12.5%",
    },
    {
      title: "Contribuables",
      value: stats.totalContribuables.toLocaleString("fr-FR"),
      icon: Users,
      color: "bg-blue-500",
      change: "+8.2%",
    },
    {
      title: "Documents",
      value: stats.totalDocuments,
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      title: "Actualités",
      value: stats.totalActualites,
      icon: BarChart3,
      color: "bg-orange-500",
    },
  ];

  const maxRecette = Math.max(
    ...stats.recettesParMois.map((r) => r.montant),
    1,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-500">
            Aperçu des performances et indicateurs clés
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={annee} onValueChange={setAnnee}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2026, 2025, 2024, 2023].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  {stat.change && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      {stat.change} vs année précédente
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recettes par mois */}
        <Card>
          <CardHeader>
            <CardTitle>Recettes par Mois ({annee})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : stats.recettesParMois.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recettesParMois.map((item) => (
                  <div key={item.mois} className="flex items-center gap-4">
                    <span className="w-12 text-sm text-gray-500">
                      {item.mois}
                    </span>
                    <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{
                          width: `${(item.montant / maxRecette) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-24 text-right text-sm font-medium">
                      {formatMontant(item.montant)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recettes par type */}
        <Card>
          <CardHeader>
            <CardTitle>Recettes par Type</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : stats.recettesParType.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recettesParType.map((item, index) => {
                  const colors = [
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-purple-500",
                    "bg-orange-500",
                    "bg-red-500",
                    "bg-yellow-500",
                  ];
                  const total = stats.recettesParType.reduce(
                    (sum, r) => sum + r.montant,
                    0,
                  );
                  const percentage = ((item.montant / total) * 100).toFixed(1);

                  return (
                    <div key={item.type} className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          colors[index % colors.length]
                        }`}
                      />
                      <span className="flex-1 text-sm">{item.type}</span>
                      <span className="text-sm text-gray-500">
                        {percentage}%
                      </span>
                      <span className="w-24 text-right text-sm font-medium">
                        {formatMontant(item.montant)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
