"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Map,
  Building2,
  Pickaxe,
  Coins,
  HardHat,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { createBrowserClient } from "@/lib/supabase";
import { createActivityLogger } from "@/lib/activity-logger";
import {
  CartographieTerritoire,
  CartographieProjet,
  CartographieZoneMiniere,
  CartographiePointRecette,
  TypeTerritoire,
  TypeProjet,
  StatutProjet,
  TypeExploitation,
  TypeBureau,
} from "@/lib/types";

// Tab definitions
const TABS = [
  { value: "territoires", label: "Territoires", icon: Map },
  { value: "projets", label: "Projets", icon: HardHat },
  { value: "mines", label: "Zones Minières", icon: Pickaxe },
  { value: "recettes", label: "Points de Recettes", icon: Coins },
];

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

const TYPE_EXPLOITATION_LABELS: Record<TypeExploitation, string> = {
  industrielle: "Industrielle",
  artisanale: "Artisanale",
  semi_industrielle: "Semi-industrielle",
  carriere: "Carrière",
};

const TYPE_BUREAU_LABELS: Record<TypeBureau, string> = {
  siege: "Siège",
  perception: "Perception",
  antenne: "Antenne",
  guichet: "Guichet",
  mobile: "Mobile",
};

export default function CartographieAdminPage() {
  const [activeTab, setActiveTab] = useState("territoires");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [filterTerritoireType, setFilterTerritoireType] =
    useState<string>("all");
  const [filterProjetTerritoire, setFilterProjetTerritoire] =
    useState<string>("all");
  const [filterProjetType, setFilterProjetType] = useState<string>("all");
  const [filterProjetStatut, setFilterProjetStatut] = useState<string>("all");
  const [filterMineTerritoire, setFilterMineTerritoire] =
    useState<string>("all");
  const [filterMineType, setFilterMineType] = useState<string>("all");
  const [filterRecetteTerritoire, setFilterRecetteTerritoire] =
    useState<string>("all");
  const [filterRecetteType, setFilterRecetteType] = useState<string>("all");

  // Data states
  const [territoires, setTerritoires] = useState<CartographieTerritoire[]>([]);
  const [projets, setProjets] = useState<CartographieProjet[]>([]);
  const [mines, setMines] = useState<CartographieZoneMiniere[]>([]);
  const [pointsRecettes, setPointsRecettes] = useState<
    CartographiePointRecette[]
  >([]);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemType, setItemType] = useState<string>("");

  const supabase = createBrowserClient();
  const activityLogger = createActivityLogger(supabase);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch territories
      const { data: territoiresData } = await supabase
        .from("cartographie_territoires")
        .select("*")
        .order("type", { ascending: true })
        .order("nom", { ascending: true });
      if (territoiresData) setTerritoires(territoiresData);

      // Fetch projects
      const { data: projetsData } = await supabase
        .from("cartographie_projets")
        .select("*, territoire:cartographie_territoires(nom)")
        .order("created_at", { ascending: false });
      if (projetsData) setProjets(projetsData);

      // Fetch mining zones
      const { data: minesData } = await supabase
        .from("cartographie_zones_minieres")
        .select("*, territoire:cartographie_territoires(nom)")
        .order("created_at", { ascending: false });
      if (minesData) setMines(minesData);

      // Fetch revenue points
      const { data: recettesData } = await supabase
        .from("cartographie_points_recettes")
        .select("*, territoire:cartographie_territoires(nom)")
        .order("created_at", { ascending: false });
      if (recettesData) setPointsRecettes(recettesData);
    } catch (error) {
      console.error("Error fetching cartography data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Delete handler
  const handleDelete = async () => {
    if (!selectedItem || !itemType) return;

    const tableMap: Record<string, string> = {
      territoires: "cartographie_territoires",
      projets: "cartographie_projets",
      mines: "cartographie_zones_minieres",
      recettes: "cartographie_points_recettes",
    };

    try {
      const { error } = await supabase
        .from(tableMap[itemType])
        .delete()
        .eq("id", selectedItem.id);

      if (error) throw error;

      await activityLogger.logDelete(
        `cartographie_${itemType}`,
        selectedItem.id,
        { nom: selectedItem.nom },
      );

      fetchData();
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Toggle publish status
  const togglePublish = async (item: any, type: string) => {
    const tableMap: Record<string, string> = {
      projets: "cartographie_projets",
      mines: "cartographie_zones_minieres",
      recettes: "cartographie_points_recettes",
    };

    try {
      const { error } = await supabase
        .from(tableMap[type])
        .update({ publie: !item.publie })
        .eq("id", item.id);

      if (error) throw error;

      await activityLogger.logUpdate(`cartographie_${type}`, item.id, {
        nom: item.nom,
        publie: !item.publie,
      });

      fetchData();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  // Format currency
  const formatUSD = (amount: number | null | undefined) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter data based on search and dropdown filters
  const filteredTerritoires = territoires.filter((t) => {
    const matchesSearch = t.nom
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      filterTerritoireType === "all" || t.type === filterTerritoireType;
    return matchesSearch && matchesType;
  });

  const filteredProjets = projets.filter((p: any) => {
    const matchesSearch = p.nom
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTerritoire =
      filterProjetTerritoire === "all" ||
      p.territoire_id === filterProjetTerritoire;
    const matchesType =
      filterProjetType === "all" || p.type_projet === filterProjetType;
    const matchesStatut =
      filterProjetStatut === "all" || p.statut === filterProjetStatut;
    return matchesSearch && matchesTerritoire && matchesType && matchesStatut;
  });

  const filteredMines = mines.filter((m: any) => {
    const matchesSearch = m.nom
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTerritoire =
      filterMineTerritoire === "all" ||
      m.territoire_id === filterMineTerritoire;
    const matchesType =
      filterMineType === "all" || m.type_exploitation === filterMineType;
    return matchesSearch && matchesTerritoire && matchesType;
  });

  const filteredRecettes = pointsRecettes.filter((r: any) => {
    const matchesSearch = r.nom
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTerritoire =
      filterRecetteTerritoire === "all" ||
      r.territoire_id === filterRecetteTerritoire;
    const matchesType =
      filterRecetteType === "all" || r.type_bureau === filterRecetteType;
    return matchesSearch && matchesTerritoire && matchesType;
  });

  // Stats
  const stats = {
    territoires: territoires.length,
    projets: projets.length,
    projetsEnCours: projets.filter((p) => p.statut === "en_cours").length,
    mines: mines.length,
    recettes: pointsRecettes.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion de la Cartographie</h2>
          <p className="text-gray-500">
            Gérez les territoires, projets, zones minières et points de recettes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button
            onClick={() => {
              setSelectedItem(null);
              setItemType(activeTab);
              setEditDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Map className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.territoires}</p>
              <p className="text-xs text-gray-500">Territoires</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <HardHat className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.projets}</p>
              <p className="text-xs text-gray-500">Projets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <HardHat className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.projetsEnCours}</p>
              <p className="text-xs text-gray-500">En cours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <Pickaxe className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.mines}</p>
              <p className="text-xs text-gray-500">Zones Minières</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <Coins className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.recettes}</p>
              <p className="text-xs text-gray-500">Points Recettes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Territoires Tab */}
        <TabsContent value="territoires" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Territoires</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filterTerritoireType}
                    onValueChange={setFilterTerritoireType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {Object.entries(TYPE_TERRITOIRE_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(null);
                      setItemType("territoires");
                      setEditDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Population</TableHead>
                      <TableHead>Coordonnées</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTerritoires.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500 py-8"
                        >
                          Aucun territoire trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTerritoires.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.nom}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {TYPE_TERRITOIRE_LABELS[item.type] || item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.code || "-"}</TableCell>
                          <TableCell>
                            {item.population
                              ? item.population.toLocaleString()
                              : "-"}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {item.latitude && item.longitude
                              ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setItemType("territoires");
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setItemType("territoires");
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projets Tab */}
        <TabsContent value="projets" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Projets</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filterProjetTerritoire}
                    onValueChange={setFilterProjetTerritoire}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Territoire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les territoires</SelectItem>
                      {territoires.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterProjetType}
                    onValueChange={setFilterProjetType}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      {Object.entries(TYPE_PROJET_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterProjetStatut}
                    onValueChange={setFilterProjetStatut}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      {Object.entries(STATUT_PROJET_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(null);
                      setItemType("projets");
                      setEditDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Territoire</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Coût</TableHead>
                      <TableHead>Publié</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjets.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-gray-500 py-8"
                        >
                          Aucun projet trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProjets.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.nom}
                          </TableCell>
                          <TableCell>{item.territoire?.nom || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {TYPE_PROJET_LABELS[
                                item.type_projet as TypeProjet
                              ] || item.type_projet}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                STATUT_COLORS[item.statut as StatutProjet]
                              }
                            >
                              {STATUT_PROJET_LABELS[
                                item.statut as StatutProjet
                              ] || item.statut}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatUSD(item.cout_estime_usd)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePublish(item, "projets")}
                            >
                              {item.publie ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setItemType("projets");
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setItemType("projets");
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mines Tab */}
        <TabsContent value="mines" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Zones Minières</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filterMineTerritoire}
                    onValueChange={setFilterMineTerritoire}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Territoire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les territoires</SelectItem>
                      {territoires.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterMineType}
                    onValueChange={setFilterMineType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Type exploitation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      {Object.entries(TYPE_EXPLOITATION_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(null);
                      setItemType("mines");
                      setEditDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Territoire</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Minerais</TableHead>
                      <TableHead>Opérateur</TableHead>
                      <TableHead>Publié</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMines.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-gray-500 py-8"
                        >
                          Aucune zone minière trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMines.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.nom}
                          </TableCell>
                          <TableCell>{item.territoire?.nom || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {TYPE_EXPLOITATION_LABELS[
                                item.type_exploitation as TypeExploitation
                              ] || item.type_exploitation}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(item.minerais || [])
                                .slice(0, 2)
                                .map((m: string) => (
                                  <Badge
                                    key={m}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {m}
                                  </Badge>
                                ))}
                              {(item.minerais || []).length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{item.minerais.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{item.operateur || "-"}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePublish(item, "mines")}
                            >
                              {item.publie ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setItemType("mines");
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setItemType("mines");
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Points de Recettes Tab */}
        <TabsContent value="recettes" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Points de Recettes</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filterRecetteTerritoire}
                    onValueChange={setFilterRecetteTerritoire}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Territoire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les territoires</SelectItem>
                      {territoires.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterRecetteType}
                    onValueChange={setFilterRecetteType}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type bureau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      {Object.entries(TYPE_BUREAU_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(null);
                      setItemType("recettes");
                      setEditDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Territoire</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recettes 2025</TableHead>
                      <TableHead>Publié</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecettes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500 py-8"
                        >
                          Aucun point de recette trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecettes.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.nom}
                          </TableCell>
                          <TableCell>{item.territoire?.nom || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {TYPE_BUREAU_LABELS[
                                item.type_bureau as TypeBureau
                              ] || item.type_bureau}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatUSD(item.recettes_2025_usd)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePublish(item, "recettes")}
                            >
                              {item.publie ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setItemType("recettes");
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setItemType("recettes");
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer &quot;{selectedItem?.nom}&quot;
              ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Create Dialog */}
      <EditCartographieDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        item={selectedItem}
        itemType={itemType}
        territoires={territoires}
        onSuccess={() => {
          fetchData();
          setEditDialogOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

// Edit/Create Dialog Component
interface EditCartographieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  itemType: string;
  territoires: CartographieTerritoire[];
  onSuccess: () => void;
}

function EditCartographieDialog({
  open,
  onOpenChange,
  item,
  itemType,
  territoires,
  onSuccess,
}: EditCartographieDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const supabase = createBrowserClient();
  const activityLogger = createActivityLogger(supabase);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      // Default values for new items
      const defaults: Record<string, any> = {
        territoires: {
          nom: "",
          type: "territoire",
          latitude: -10.7167,
          longitude: 25.4667,
          actif: true,
        },
        projets: {
          nom: "",
          type_projet: "infrastructure",
          statut: "planifie",
          annee: new Date().getFullYear(),
          latitude: -10.7167,
          longitude: 25.4667,
          pourcentage_avancement: 0,
          publie: false,
        },
        mines: {
          nom: "",
          type_exploitation: "industrielle",
          minerais: [],
          latitude: -10.7167,
          longitude: 25.4667,
          actif: true,
          publie: false,
        },
        recettes: {
          nom: "",
          type_bureau: "perception",
          latitude: -10.7167,
          longitude: 25.4667,
          actif: true,
          publie: false,
        },
      };
      setFormData(defaults[itemType] || {});
    }
  }, [item, itemType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tableMap: Record<string, string> = {
      territoires: "cartographie_territoires",
      projets: "cartographie_projets",
      mines: "cartographie_zones_minieres",
      recettes: "cartographie_points_recettes",
    };

    try {
      // Remove relation objects before submitting
      const dataToSubmit = { ...formData };
      delete dataToSubmit.territoire;
      delete dataToSubmit.icone;
      delete dataToSubmit.projet;

      if (item?.id) {
        // Update
        const { error } = await supabase
          .from(tableMap[itemType])
          .update(dataToSubmit)
          .eq("id", item.id);

        if (error) throw error;

        await activityLogger.logUpdate(`cartographie_${itemType}`, item.id, {
          nom: formData.nom,
        });
      } else {
        // Create
        const { data, error } = await supabase
          .from(tableMap[itemType])
          .insert(dataToSubmit)
          .select()
          .single();

        if (error) throw error;

        await activityLogger.logCreate(`cartographie_${itemType}`, data.id, {
          nom: formData.nom,
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDialogTitle = () => {
    const titles: Record<string, string> = {
      territoires: "Territoire",
      projets: "Projet",
      mines: "Zone Minière",
      recettes: "Point de Recette",
    };
    return (
      (item?.id ? "Modifier le " : "Nouveau ") + (titles[itemType] || "élément")
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Nom *</Label>
              <Input
                value={formData.nom || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required
              />
            </div>

            {itemType !== "territoires" && (
              <div className="col-span-2">
                <Label>Territoire</Label>
                <Select
                  value={formData.territoire_id || ""}
                  onValueChange={(val) =>
                    setFormData({ ...formData, territoire_id: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un territoire" />
                  </SelectTrigger>
                  <SelectContent>
                    {territoires.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.nom} ({TYPE_TERRITOIRE_LABELS[t.type]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Type specific fields */}
          {itemType === "territoires" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type *</Label>
                  <Select
                    value={formData.type || "territoire"}
                    onValueChange={(val) =>
                      setFormData({ ...formData, type: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_TERRITOIRE_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Code</Label>
                  <Input
                    value={formData.code || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="ex: KOL"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Population</Label>
                  <Input
                    type="number"
                    value={formData.population || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        population: parseInt(e.target.value) || null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Superficie (km²)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.superficie_km2 || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        superficie_km2: parseFloat(e.target.value) || null,
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {itemType === "projets" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de projet *</Label>
                  <Select
                    value={formData.type_projet || "infrastructure"}
                    onValueChange={(val) =>
                      setFormData({ ...formData, type_projet: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_PROJET_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Statut *</Label>
                  <Select
                    value={formData.statut || "planifie"}
                    onValueChange={(val) =>
                      setFormData({ ...formData, statut: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUT_PROJET_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Année *</Label>
                  <Input
                    type="number"
                    value={formData.annee || new Date().getFullYear()}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        annee: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Date début</Label>
                  <Input
                    type="date"
                    value={formData.date_debut || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, date_debut: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Date fin prévue</Label>
                  <Input
                    type="date"
                    value={formData.date_fin_prevue || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_fin_prevue: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Coût estimé (USD)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cout_estime_usd || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cout_estime_usd: parseFloat(e.target.value) || null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Avancement (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.pourcentage_avancement || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pourcentage_avancement: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Maître d&apos;ouvrage</Label>
                  <Input
                    value={formData.maitre_ouvrage || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maitre_ouvrage: e.target.value,
                      })
                    }
                    placeholder="DRNOFLU / Province"
                  />
                </div>
                <div>
                  <Label>Entrepreneur</Label>
                  <Input
                    value={formData.entrepreneur || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, entrepreneur: e.target.value })
                    }
                    placeholder="Nom de l'entrepreneur"
                  />
                </div>
              </div>
              <div>
                <Label>Adresse / Localisation</Label>
                <Input
                  value={formData.adresse || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, adresse: e.target.value })
                  }
                  placeholder="Avenue, Quartier, Ville"
                />
              </div>
            </>
          )}

          {itemType === "mines" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type d&apos;exploitation *</Label>
                  <Select
                    value={formData.type_exploitation || "industrielle"}
                    onValueChange={(val) =>
                      setFormData({ ...formData, type_exploitation: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_EXPLOITATION_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Opérateur</Label>
                  <Input
                    value={formData.operateur || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, operateur: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Minerais (séparés par des virgules)</Label>
                <Input
                  value={(formData.minerais || []).join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minerais: e.target.value
                        .split(",")
                        .map((m: string) => m.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Cuivre, Cobalt, Or"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Redevances annuelles (USD)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.redevances_annuelles_usd || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        redevances_annuelles_usd:
                          parseFloat(e.target.value) || null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Employés directs</Label>
                  <Input
                    type="number"
                    value={formData.employes_directs || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employes_directs: parseInt(e.target.value) || null,
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {itemType === "recettes" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de bureau *</Label>
                  <Select
                    value={formData.type_bureau || "perception"}
                    onValueChange={(val) =>
                      setFormData({ ...formData, type_bureau: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_BUREAU_LABELS).map(
                        ([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Responsable</Label>
                  <Input
                    value={formData.responsable || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, responsable: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={formData.telephone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, telephone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@drnoflu.cd"
                  />
                </div>
              </div>
              <div>
                <Label>Adresse</Label>
                <Input
                  value={formData.adresse || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, adresse: e.target.value })
                  }
                  placeholder="123 Avenue, Ville"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Horaires</Label>
                  <Input
                    value={formData.horaires || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, horaires: e.target.value })
                    }
                    placeholder="Lun-Ven: 8h-16h"
                  />
                </div>
                <div>
                  <Label>Services offerts (séparés par des virgules)</Label>
                  <Input
                    value={(formData.services_offerts || []).join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        services_offerts: e.target.value
                          .split(",")
                          .map((s: string) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Perception, Déclaration, Conseil"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Recettes 2024 (USD)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.recettes_2024_usd || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recettes_2024_usd: parseFloat(e.target.value) || null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Recettes 2025 (USD)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.recettes_2025_usd || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recettes_2025_usd: parseFloat(e.target.value) || null,
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* Coordinates - common for all */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Latitude *</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.latitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Longitude *</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.longitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Enregistrement..."
                : item?.id
                  ? "Mettre à jour"
                  : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
