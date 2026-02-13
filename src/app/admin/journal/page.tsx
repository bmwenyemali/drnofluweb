"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Activity,
  LogIn,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  User,
  Calendar,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createBrowserClient } from "@/lib/supabase";
import { JournalActivite, StatistiqueVisiteur } from "@/lib/types";

const ACTION_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  LOGIN: LogIn,
  LOGOUT: LogOut,
  CREATE: Plus,
  UPDATE: Edit,
  DELETE: Trash2,
  VIEW: Eye,
};

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-green-100 text-green-800",
  LOGOUT: "bg-gray-100 text-gray-800",
  CREATE: "bg-blue-100 text-blue-800",
  UPDATE: "bg-yellow-100 text-yellow-800",
  DELETE: "bg-red-100 text-red-800",
  VIEW: "bg-purple-100 text-purple-800",
};

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Connexion",
  LOGOUT: "Déconnexion",
  CREATE: "Création",
  UPDATE: "Modification",
  DELETE: "Suppression",
  VIEW: "Consultation",
};

export default function JournalAdminPage() {
  const [activities, setActivities] = useState<JournalActivite[]>([]);
  const [visitors, setVisitors] = useState<StatistiqueVisiteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntite, setFilterEntite] = useState("all");

  const supabase = createBrowserClient();

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch activities
    const { data: activitiesData } = await supabase
      .from("journal_activites")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (activitiesData) {
      setActivities(activitiesData);
    }

    // Fetch visitor stats
    const { data: visitorsData } = await supabase
      .from("statistiques_visiteurs")
      .select("*")
      .order("date", { ascending: false })
      .limit(30);

    if (visitorsData) {
      setVisitors(visitorsData);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      (activity.user_email?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) ||
      (activity.user_nom?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) ||
      (activity.entite?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      );
    const matchesAction =
      filterAction === "all" || activity.action === filterAction;
    const matchesEntite =
      filterEntite === "all" || activity.entite === filterEntite;
    return matchesSearch && matchesAction && matchesEntite;
  });

  const uniqueEntites = [
    ...new Set(activities.map((a) => a.entite).filter(Boolean)),
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Stats
  const todayActivities = activities.filter(
    (a) => new Date(a.created_at).toDateString() === new Date().toDateString(),
  ).length;
  const uniqueUsers = new Set(activities.map((a) => a.user_id).filter(Boolean))
    .size;
  const totalVisits = visitors.reduce((sum, v) => sum + v.visites, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Journal d&apos;activités</h2>
          <p className="text-gray-500">
            Suivez les connexions et actions des utilisateurs
          </p>
        </div>
        <Button onClick={fetchData} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2dfold font-bold">{activities.length}</p>
              <p className="text-sm text-gray-500">Activités totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayActivities}</p>
              <p className="text-sm text-gray-500">Aujourd&apos;hui</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{uniqueUsers}</p>
              <p className="text-sm text-gray-500">Utilisateurs actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <Globe className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalVisits}</p>
              <p className="text-sm text-gray-500">Visites (30j)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Note about Analytics */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            📊 Suivi des visiteurs
          </h3>
          <p className="text-sm text-blue-800">
            Pour un suivi complet des visiteurs par pays et province, nous
            recommandons d&apos;utiliser :
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
            <li>
              <strong>Vercel Analytics</strong> (gratuit) - Intégré
              automatiquement sur Vercel
            </li>
            <li>
              <strong>Google Analytics 4</strong> (gratuit) - Analyse détaillée
              par pays/région
            </li>
            <li>
              <strong>Plausible Analytics</strong> (simple, respecte la vie
              privée)
            </li>
            <li>
              <strong>Umami</strong> (open source, self-hosted possible)
            </li>
          </ul>
        </CardContent>
      </Card>

      <Tabs defaultValue="activities" className="w-full">
        <TabsList>
          <TabsTrigger value="activities">Activités utilisateurs</TabsTrigger>
          <TabsTrigger value="visitors">Statistiques visiteurs</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par utilisateur ou entité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les actions</SelectItem>
                {Object.keys(ACTION_LABELS).map((action) => (
                  <SelectItem key={action} value={action}>
                    {ACTION_LABELS[action]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterEntite} onValueChange={setFilterEntite}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Entité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les entités</SelectItem>
                {uniqueEntites.map((entite) => (
                  <SelectItem key={entite} value={entite!}>
                    {entite}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Activities Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Date</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead className="w-[120px]">Action</TableHead>
                      <TableHead>Entité</TableHead>
                      <TableHead>Détails</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-gray-500"
                        >
                          Aucune activité trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredActivities.map((activity) => {
                        const ActionIcon =
                          ACTION_ICONS[activity.action] || Activity;
                        return (
                          <TableRow key={activity.id}>
                            <TableCell className="text-sm text-gray-500">
                              {formatDate(activity.created_at)}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {activity.user_nom || "Anonyme"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {activity.user_email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={ACTION_COLORS[activity.action]}>
                                <ActionIcon className="mr-1 h-3 w-3" />
                                {ACTION_LABELS[activity.action]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {activity.entite && (
                                <Badge variant="outline">
                                  {activity.entite}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-gray-500 max-w-[200px] truncate">
                              {activity.details &&
                              Object.keys(activity.details).length > 0
                                ? JSON.stringify(activity.details).substring(
                                    0,
                                    50,
                                  )
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques par pays et province</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : visitors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune donnée de visiteurs disponible</p>
                  <p className="text-sm mt-2">
                    Configurez un outil d&apos;analytics pour commencer à
                    collecter les données
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Pays</TableHead>
                      <TableHead>Province RDC</TableHead>
                      <TableHead className="text-right">Visites</TableHead>
                      <TableHead className="text-right">
                        Visiteurs uniques
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitors.map((visitor) => (
                      <TableRow key={visitor.id}>
                        <TableCell>
                          {new Date(visitor.date).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>{visitor.page || "/"}</TableCell>
                        <TableCell>{visitor.pays || "-"}</TableCell>
                        <TableCell>{visitor.province_rdc || "-"}</TableCell>
                        <TableCell className="text-right font-medium">
                          {visitor.visites}
                        </TableCell>
                        <TableCell className="text-right">
                          {visitor.visiteurs_uniques}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
