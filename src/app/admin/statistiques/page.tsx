"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  DollarSign,
  FileText,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createBrowserClient } from "@/lib/supabase";

interface StatRecette {
  id: string;
  annee: number;
  mois: number | null;
  type_recette: string;
  montant: number;
  devise: string;
}

interface ChiffreCle {
  id: string;
  cle: string;
  valeur: number;
  label: string;
  prefixe: string;
  suffixe: string;
  description: string;
  ordre: number;
  actif: boolean;
}

const TYPES_RECETTES = [
  "Mines et Carrières",
  "Taxes Environnementales",
  "Redevances Forestières",
  "Taxes Commerciales",
  "Licences et Permis",
  "Autres Recettes",
];

const MOIS = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
];

export default function StatistiquesPage() {
  const [recettes, setRecettes] = useState<StatRecette[]>([]);
  const [chiffres, setChiffres] = useState<ChiffreCle[]>([]);
  const [totalRecettes, setTotalRecettes] = useState(0);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [actualitesCount, setActualitesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [annee, setAnnee] = useState(new Date().getFullYear().toString());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chiffreDialogOpen, setChiffreDialogOpen] = useState(false);
  const [editingRecette, setEditingRecette] = useState<StatRecette | null>(
    null,
  );
  const [editingChiffre, setEditingChiffre] = useState<ChiffreCle | null>(null);

  // Form states
  const [formAnnee, setFormAnnee] = useState(new Date().getFullYear());
  const [formMois, setFormMois] = useState<string>("");
  const [formType, setFormType] = useState("");
  const [formMontant, setFormMontant] = useState("");
  const [formDevise, setFormDevise] = useState("USD");

  // Chiffre form
  const [formCle, setFormCle] = useState("");
  const [formValeur, setFormValeur] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formPrefixe, setFormPrefixe] = useState("");
  const [formSuffixe, setFormSuffixe] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchData();
  }, [annee]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsResult, actusResult, recettesResult, chiffresResult] =
        await Promise.all([
          supabase
            .from("documents")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("actualites")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("statistiques_recettes")
            .select("*")
            .eq("annee", parseInt(annee))
            .order("mois", { ascending: true }),
          supabase
            .from("chiffres_cles")
            .select("*")
            .order("ordre", { ascending: true }),
        ]);

      setDocumentsCount(docsResult.count || 0);
      setActualitesCount(actusResult.count || 0);
      setRecettes(recettesResult.data || []);
      setChiffres(chiffresResult.data || []);

      const total = (recettesResult.data || []).reduce(
        (sum, r) => sum + Number(r.montant || 0),
        0,
      );
      setTotalRecettes(total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecette = async () => {
    if (!formType || !formMontant) return;

    try {
      const data = {
        annee: formAnnee,
        mois: formMois ? parseInt(formMois) : null,
        type_recette: formType,
        montant: parseFloat(formMontant),
        devise: formDevise,
      };

      if (editingRecette) {
        await supabase
          .from("statistiques_recettes")
          .update(data)
          .eq("id", editingRecette.id);
      } else {
        await supabase.from("statistiques_recettes").insert(data);
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving recette:", error);
    }
  };

  const handleDeleteRecette = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette entrée?")) return;
    await supabase.from("statistiques_recettes").delete().eq("id", id);
    fetchData();
  };

  const handleSaveChiffre = async () => {
    if (!formCle || !formValeur || !formLabel) return;

    try {
      const data = {
        cle: formCle,
        valeur: parseFloat(formValeur),
        label: formLabel,
        prefixe: formPrefixe,
        suffixe: formSuffixe,
        description: formDescription,
        updated_at: new Date().toISOString(),
      };

      if (editingChiffre) {
        await supabase
          .from("chiffres_cles")
          .update(data)
          .eq("id", editingChiffre.id);
      } else {
        await supabase
          .from("chiffres_cles")
          .insert({ ...data, ordre: chiffres.length });
      }

      setChiffreDialogOpen(false);
      resetChiffreForm();
      fetchData();
    } catch (error) {
      console.error("Error saving chiffre:", error);
    }
  };

  const handleDeleteChiffre = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce chiffre?")) return;
    await supabase.from("chiffres_cles").delete().eq("id", id);
    fetchData();
  };

  const resetForm = () => {
    setEditingRecette(null);
    setFormAnnee(new Date().getFullYear());
    setFormMois("");
    setFormType("");
    setFormMontant("");
    setFormDevise("USD");
  };

  const resetChiffreForm = () => {
    setEditingChiffre(null);
    setFormCle("");
    setFormValeur("");
    setFormLabel("");
    setFormPrefixe("");
    setFormSuffixe("");
    setFormDescription("");
  };

  const openEditRecette = (recette: StatRecette) => {
    setEditingRecette(recette);
    setFormAnnee(recette.annee);
    setFormMois(recette.mois?.toString() || "");
    setFormType(recette.type_recette);
    setFormMontant(recette.montant.toString());
    setFormDevise(recette.devise);
    setDialogOpen(true);
  };

  const openEditChiffre = (chiffre: ChiffreCle) => {
    setEditingChiffre(chiffre);
    setFormCle(chiffre.cle);
    setFormValeur(chiffre.valeur.toString());
    setFormLabel(chiffre.label);
    setFormPrefixe(chiffre.prefixe || "");
    setFormSuffixe(chiffre.suffixe || "");
    setFormDescription(chiffre.description || "");
    setChiffreDialogOpen(true);
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
      value: formatMontant(totalRecettes),
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Documents",
      value: documentsCount,
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      title: "Actualités",
      value: actualitesCount,
      icon: BarChart3,
      color: "bg-orange-500",
    },
  ];

  const recettesParMois = recettes
    .filter((r) => r.mois)
    .reduce((acc: { mois: string; montant: number }[], r) => {
      const moisLabel =
        MOIS.find((m) => m.value === r.mois)?.label.slice(0, 3) || "";
      const existing = acc.find((a) => a.mois === moisLabel);
      if (existing) {
        existing.montant += Number(r.montant);
      } else {
        acc.push({ mois: moisLabel, montant: Number(r.montant) });
      }
      return acc;
    }, [])
    .sort((a, b) => {
      const ordre = MOIS.map((m) => m.label.slice(0, 3));
      return ordre.indexOf(a.mois) - ordre.indexOf(b.mois);
    });

  const maxRecette = Math.max(...recettesParMois.map((r) => r.montant), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-500">
            Gérez les statistiques et chiffres clés du site
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
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="recettes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recettes">Recettes par mois</TabsTrigger>
          <TabsTrigger value="chiffres">Chiffres clés (Homepage)</TabsTrigger>
        </TabsList>

        {/* Recettes Tab */}
        <TabsContent value="recettes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Statistiques des Recettes ({annee})
            </h2>
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRecette ? "Modifier" : "Ajouter"} une entrée
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Année</Label>
                      <Input
                        type="number"
                        value={formAnnee}
                        onChange={(e) => setFormAnnee(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mois</Label>
                      <Select value={formMois} onValueChange={setFormMois}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Annuel</SelectItem>
                          {MOIS.map((m) => (
                            <SelectItem
                              key={m.value}
                              value={m.value.toString()}
                            >
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Type de recette</Label>
                    <Select value={formType} onValueChange={setFormType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPES_RECETTES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Montant</Label>
                      <Input
                        type="number"
                        value={formMontant}
                        onChange={(e) => setFormMontant(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Devise</Label>
                      <Select value={formDevise} onValueChange={setFormDevise}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="CDF">CDF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveRecette}
                    className="w-full"
                    disabled={!formType || !formMontant}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Devise</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recettes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        Aucune donnée. Cliquez sur &quot;Ajouter&quot; pour
                        commencer.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recettes.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          {r.mois
                            ? MOIS.find((m) => m.value === r.mois)?.label
                            : "Annuel"}
                        </TableCell>
                        <TableCell>{r.type_recette}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatMontant(r.montant)}
                        </TableCell>
                        <TableCell>{r.devise}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditRecette(r)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRecette(r.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Chart */}
          {recettesParMois.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Visualisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recettesParMois.map((item) => (
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
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Chiffres Clés Tab */}
        <TabsContent value="chiffres" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Chiffres Clés</h2>
              <p className="text-sm text-gray-500">
                Ces chiffres s&apos;affichent sur la page d&apos;accueil
              </p>
            </div>
            <Dialog
              open={chiffreDialogOpen}
              onOpenChange={(open) => {
                setChiffreDialogOpen(open);
                if (!open) resetChiffreForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingChiffre ? "Modifier" : "Ajouter"} un chiffre clé
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Clé unique (ex: recettes_2026)</Label>
                    <Input
                      value={formCle}
                      onChange={(e) => setFormCle(e.target.value)}
                      placeholder="recettes_annuelles"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Label affiché</Label>
                    <Input
                      value={formLabel}
                      onChange={(e) => setFormLabel(e.target.value)}
                      placeholder="Recettes Collectées"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Préfixe</Label>
                      <Input
                        value={formPrefixe}
                        onChange={(e) => setFormPrefixe(e.target.value)}
                        placeholder="+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valeur</Label>
                      <Input
                        type="number"
                        value={formValeur}
                        onChange={(e) => setFormValeur(e.target.value)}
                        placeholder="150"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Suffixe</Label>
                      <Input
                        value={formSuffixe}
                        onChange={(e) => setFormSuffixe(e.target.value)}
                        placeholder="M USD"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Mobilisation annuelle"
                    />
                  </div>
                  <Button
                    onClick={handleSaveChiffre}
                    className="w-full"
                    disabled={!formCle || !formValeur || !formLabel}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {chiffres.map((chiffre) => (
              <Card key={chiffre.id} className="relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditChiffre(chiffre)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteChiffre(chiffre.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-primary-700">
                    {chiffre.prefixe}
                    {chiffre.valeur.toLocaleString()}
                    {chiffre.suffixe}
                  </p>
                  <p className="font-medium mt-1">{chiffre.label}</p>
                  {chiffre.description && (
                    <p className="text-sm text-gray-500">
                      {chiffre.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {chiffres.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun chiffre clé configuré.</p>
                <p className="text-sm">
                  Ajoutez des chiffres pour les afficher sur la page
                  d&apos;accueil.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
