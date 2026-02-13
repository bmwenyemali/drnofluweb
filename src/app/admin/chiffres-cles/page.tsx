"use client";

import { useState, useEffect } from "react";
import { Plus, Save, Trash2, Edit, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { createBrowserClient } from "@/lib/supabase";
import { ChiffreCle } from "@/lib/types";

export default function ChiffresClesAdminPage() {
  const [chiffres, setChiffres] = useState<ChiffreCle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChiffre, setSelectedChiffre] = useState<ChiffreCle | null>(
    null,
  );
  const [formData, setFormData] = useState({
    cle: "",
    label: "",
    valeur: 0,
    suffixe: "",
    prefixe: "",
    description: "",
    actif: true,
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchChiffres();
  }, []);

  const fetchChiffres = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("chiffres_cles")
        .select("*")
        .order("ordre", { ascending: true });

      if (error) throw error;
      setChiffres(data || []);
    } catch (error) {
      console.error("Error fetching chiffres:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (chiffre?: ChiffreCle) => {
    if (chiffre) {
      setSelectedChiffre(chiffre);
      setFormData({
        cle: chiffre.cle || "",
        label: chiffre.label,
        valeur: chiffre.valeur,
        suffixe: chiffre.suffixe || "",
        prefixe: chiffre.prefixe || "",
        description: chiffre.description || "",
        actif: chiffre.actif ?? true,
      });
    } else {
      setSelectedChiffre(null);
      setFormData({
        cle: "",
        label: "",
        valeur: 0,
        suffixe: "",
        prefixe: "",
        description: "",
        actif: true,
      });
    }
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (selectedChiffre) {
        // Update existing
        const { error } = await supabase
          .from("chiffres_cles")
          .update({
            cle: formData.cle,
            label: formData.label,
            valeur: formData.valeur,
            suffixe: formData.suffixe || null,
            prefixe: formData.prefixe || null,
            description: formData.description || null,
            actif: formData.actif,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedChiffre.id);

        if (error) throw error;
      } else {
        // Create new
        const maxOrdre = Math.max(...chiffres.map((c) => c.ordre || 0), 0);
        const { error } = await supabase.from("chiffres_cles").insert({
          cle: formData.cle,
          label: formData.label,
          valeur: formData.valeur,
          suffixe: formData.suffixe || null,
          prefixe: formData.prefixe || null,
          description: formData.description || null,
          actif: formData.actif,
          ordre: maxOrdre + 1,
        });

        if (error) throw error;
      }

      await fetchChiffres();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error saving chiffre:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedChiffre) return;

    try {
      const { error } = await supabase
        .from("chiffres_cles")
        .delete()
        .eq("id", selectedChiffre.id);

      if (error) throw error;

      setChiffres(chiffres.filter((c) => c.id !== selectedChiffre.id));
      setDeleteDialogOpen(false);
      setSelectedChiffre(null);
    } catch (error) {
      console.error("Error deleting chiffre:", error);
    }
  };

  const toggleActif = async (chiffre: ChiffreCle) => {
    try {
      const { error } = await supabase
        .from("chiffres_cles")
        .update({ actif: !chiffre.actif })
        .eq("id", chiffre.id);

      if (error) throw error;

      setChiffres(
        chiffres.map((c) =>
          c.id === chiffre.id ? { ...c, actif: !c.actif } : c,
        ),
      );
    } catch (error) {
      console.error("Error toggling actif:", error);
    }
  };

  const moveChiffre = async (chiffre: ChiffreCle, direction: "up" | "down") => {
    const currentIndex = chiffres.findIndex((c) => c.id === chiffre.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= chiffres.length) return;

    const otherChiffre = chiffres[newIndex];

    try {
      await supabase
        .from("chiffres_cles")
        .update({ ordre: otherChiffre.ordre })
        .eq("id", chiffre.id);

      await supabase
        .from("chiffres_cles")
        .update({ ordre: chiffre.ordre })
        .eq("id", otherChiffre.id);

      await fetchChiffres();
    } catch (error) {
      console.error("Error reordering chiffres:", error);
    }
  };

  const formatValue = (chiffre: ChiffreCle) => {
    const valeur = chiffre.valeur.toLocaleString("fr-FR");
    return `${chiffre.prefixe || ""}${valeur}${chiffre.suffixe || ""}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chiffres Clés</h1>
          <p className="text-gray-500">
            Gérez les statistiques affichées sur la page d'accueil
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchChiffres}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button onClick={() => openEditDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Chiffre
          </Button>
        </div>
      </div>

      {/* Preview Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aperçu (Page d'accueil)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {chiffres
              .filter((c) => c.actif)
              .map((chiffre) => (
                <div
                  key={chiffre.id}
                  className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg"
                >
                  <p className="text-2xl font-bold text-primary-900">
                    {formatValue(chiffre)}
                  </p>
                  <p className="text-sm text-gray-600">{chiffre.label}</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Chiffres Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Liste des Chiffres ({chiffres.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : chiffres.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun chiffre clé configuré
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Ordre</TableHead>
                  <TableHead>Clé</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Valeur affichée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chiffres.map((chiffre, index) => (
                  <TableRow
                    key={chiffre.id}
                    className={!chiffre.actif ? "opacity-50" : ""}
                  >
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1"
                          onClick={() => moveChiffre(chiffre, "up")}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1"
                          onClick={() => moveChiffre(chiffre, "down")}
                          disabled={index === chiffres.length - 1}
                        >
                          ↓
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {chiffre.cle}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium">
                      {chiffre.label}
                    </TableCell>
                    <TableCell>
                      <span className="text-lg font-bold text-primary-700">
                        {formatValue(chiffre)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={chiffre.actif ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleActif(chiffre)}
                      >
                        {chiffre.actif ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(chiffre)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedChiffre(chiffre);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedChiffre ? "Modifier le Chiffre" : "Nouveau Chiffre Clé"}
            </DialogTitle>
            <DialogDescription>
              {selectedChiffre
                ? "Modifiez les informations du chiffre clé"
                : "Ajoutez une nouvelle statistique à afficher"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cle">Clé (identifiant)</Label>
                <Input
                  id="cle"
                  value={formData.cle}
                  onChange={(e) =>
                    setFormData({ ...formData, cle: e.target.value })
                  }
                  placeholder="Ex: recettes_annuelles"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label affiché *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="Ex: Recettes Annuelles"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prefixe">Préfixe</Label>
                <Input
                  id="prefixe"
                  value={formData.prefixe}
                  onChange={(e) =>
                    setFormData({ ...formData, prefixe: e.target.value })
                  }
                  placeholder="Ex: $"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valeur">Valeur *</Label>
                <Input
                  id="valeur"
                  type="number"
                  value={formData.valeur}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valeur: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suffixe">Suffixe</Label>
                <Input
                  id="suffixe"
                  value={formData.suffixe}
                  onChange={(e) =>
                    setFormData({ ...formData, suffixe: e.target.value })
                  }
                  placeholder="Ex: M USD"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Aperçu:</p>
              <p className="text-2xl font-bold text-primary-700">
                {formData.prefixe}
                {formData.valeur.toLocaleString("fr-FR")}
                {formData.suffixe}
              </p>
              <p className="text-sm text-gray-600">
                {formData.label || "Label"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description ou contexte..."
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="actif"
                checked={formData.actif}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, actif: checked as boolean })
                }
              />
              <Label htmlFor="actif">Actif (visible sur le site)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formData.label || formData.valeur === 0}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce chiffre clé ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le chiffre "
              {selectedChiffre?.label}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
