"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Calculator,
  RefreshCw,
  Eye,
  Settings,
  Download,
  DollarSign,
  FileText,
  Calendar,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from "@/lib/supabase";
import { Simulation, BaremeSimulation } from "@/lib/types";

export default function SimulationsAdminPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [baremes, setBaremes] = useState<BaremeSimulation[]>([]);
  const [tauxChange, setTauxChange] = useState<number>(2850);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSimulation, setSelectedSimulation] =
    useState<Simulation | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [newTauxChange, setNewTauxChange] = useState<string>("2850");

  const supabase = createBrowserClient();

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch simulations
    const { data: simulationsData } = await supabase
      .from("simulations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (simulationsData) {
      setSimulations(simulationsData);
    }

    // Fetch baremes
    const { data: baremesData } = await supabase
      .from("baremes_simulation")
      .select("*")
      .order("categorie", { ascending: true })
      .order("ordre", { ascending: true });

    if (baremesData) {
      setBaremes(baremesData);
    }

    // Fetch exchange rate
    const { data: tauxData } = await supabase
      .from("parametres")
      .select("*")
      .eq("cle", "taux_change_usd_fc")
      .single();

    if (tauxData) {
      setTauxChange(parseFloat(tauxData.valeur));
      setNewTauxChange(tauxData.valeur);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateTauxChange = async () => {
    setSaving(true);

    const { error } = await supabase.from("parametres").upsert(
      {
        cle: "taux_change_usd_fc",
        valeur: newTauxChange,
        description: "Taux de change USD vers FC pour les simulations",
      },
      { onConflict: "cle" },
    );

    if (!error) {
      setTauxChange(parseFloat(newTauxChange));
      alert("Taux de change mis à jour !");
    } else {
      alert("Erreur lors de la mise à jour");
    }

    setSaving(false);
  };

  const filteredSimulations = simulations.filter((sim) => {
    const matchesSearch =
      (sim.type_taxe?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) || (sim.ip_address || "").includes(searchQuery);
    return matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency === "FC" ? "CDF" : currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Stats
  const todaySimulations = simulations.filter(
    (s) => new Date(s.created_at).toDateString() === new Date().toDateString(),
  ).length;
  const totalMontantUSD = simulations.reduce(
    (sum, s) => sum + (s.resultat_usd || 0),
    0,
  );
  const uniqueTypes = [...new Set(simulations.map((s) => s.type_taxe))].length;

  // Group baremes by category
  const baremesGrouped = baremes.reduce(
    (acc, bareme) => {
      const cat = bareme.categorie;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(bareme);
      return acc;
    },
    {} as Record<string, BaremeSimulation[]>,
  );

  const exportCSV = () => {
    const headers = [
      "Date",
      "Type de taxe",
      "Résultat USD",
      "Résultat FC",
      "IP",
    ];
    const rows = simulations.map((s) => [
      formatDate(s.created_at),
      s.type_taxe,
      s.resultat_usd?.toFixed(2) || "0",
      s.resultat_fc?.toFixed(2) || "0",
      s.ip_address || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simulations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Simulations fiscales</h2>
          <p className="text-gray-500">
            Gérez le simulateur et consultez l&apos;historique
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{simulations.length}</p>
              <p className="text-sm text-gray-500">Simulations totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todaySimulations}</p>
              <p className="text-sm text-gray-500">Aujourd&apos;hui</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{uniqueTypes}</p>
              <p className="text-sm text-gray-500">Types de taxes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatMoney(totalMontantUSD)}
              </p>
              <p className="text-sm text-gray-500">Total calculé</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Rate Setting */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres du simulateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="tauxChange">Taux de change USD → FC</Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">1 USD =</span>
                <Input
                  id="tauxChange"
                  type="number"
                  value={newTauxChange}
                  onChange={(e) => setNewTauxChange(e.target.value)}
                  className="w-32"
                  min="0"
                  step="0.01"
                />
                <span className="text-gray-500">FC</span>
              </div>
              <p className="text-xs text-gray-500">
                Taux actuel : 1 USD = {tauxChange.toLocaleString()} FC
              </p>
            </div>
            <Button onClick={updateTauxChange} disabled={saving}>
              {saving ? "Enregistrement..." : "Mettre à jour"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history">Historique des simulations</TabsTrigger>
          <TabsTrigger value="baremes">Barèmes et taux</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par type de taxe ou IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Simulations Table */}
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
                      <TableHead>Type de taxe</TableHead>
                      <TableHead className="text-right">Résultat USD</TableHead>
                      <TableHead className="text-right">Résultat FC</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSimulations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-gray-500"
                        >
                          Aucune simulation trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSimulations.map((simulation) => (
                        <TableRow key={simulation.id}>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(simulation.created_at)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {simulation.type_taxe}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatMoney(simulation.resultat_usd || 0)}
                          </TableCell>
                          <TableCell className="text-right">
                            {simulation.resultat_fc?.toLocaleString()} FC
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {simulation.ip_address || "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSimulation(simulation);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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

        <TabsContent value="baremes" className="space-y-4">
          {Object.entries(baremesGrouped).map(([categorie, items]) => (
            <Card key={categorie}>
              <CardHeader>
                <CardTitle className="text-lg">{categorie}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Taux/Montant</TableHead>
                      <TableHead>Formule</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((bareme) => (
                      <TableRow key={bareme.id}>
                        <TableCell className="font-medium">
                          {bareme.description}
                        </TableCell>
                        <TableCell>
                          {bareme.taux_pourcentage
                            ? `${bareme.taux_pourcentage}%`
                            : bareme.montant_fixe
                              ? formatMoney(bareme.montant_fixe)
                              : "-"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 font-mono">
                          {bareme.formule || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={bareme.actif ? "default" : "secondary"}
                          >
                            {bareme.actif ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}

          {baremes.length === 0 && !loading && (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun barème configuré</p>
                <p className="text-sm mt-2">
                  Exécutez la migration SQL pour ajouter les barèmes par défaut
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* View Simulation Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la simulation</DialogTitle>
            <DialogDescription>
              Informations complètes sur cette simulation
            </DialogDescription>
          </DialogHeader>
          {selectedSimulation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Date</Label>
                  <p className="font-medium">
                    {formatDate(selectedSimulation.created_at)}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Type de taxe</Label>
                  <p className="font-medium">{selectedSimulation.type_taxe}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Résultat USD</Label>
                  <p className="font-medium text-lg">
                    {formatMoney(selectedSimulation.resultat_usd || 0)}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Résultat FC</Label>
                  <p className="font-medium text-lg">
                    {selectedSimulation.resultat_fc?.toLocaleString()} FC
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Taux appliqué</Label>
                  <p className="font-medium">
                    1 USD = {selectedSimulation.taux_change?.toLocaleString()}{" "}
                    FC
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Adresse IP</Label>
                  <p className="font-medium">
                    {selectedSimulation.ip_address || "Non enregistrée"}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-gray-500">Données du formulaire</Label>
                <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-sm overflow-auto max-h-60">
                  {JSON.stringify(
                    selectedSimulation.donnees_formulaire,
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
