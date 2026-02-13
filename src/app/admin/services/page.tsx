"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Trash2,
  GripVertical,
  Edit,
  Briefcase,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { createBrowserClient } from "@/lib/supabase";
import { Service } from "@/lib/types";

// Icônes disponibles pour les services
const availableIcons = [
  "building",
  "coins",
  "scale",
  "file-text",
  "users",
  "truck",
  "shield",
  "briefcase",
  "calculator",
  "landmark",
  "receipt",
  "hand-coins",
  "pickaxe",
  "factory",
  "wheat",
  "fish",
  "tree",
  "store",
  "car",
  "plane",
  "ship",
  "hard-hat",
  "wrench",
];

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    icone: "briefcase",
    slug: "",
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("ordre", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (nom: string) => {
    return nom
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const openEditDialog = (service?: Service) => {
    if (service) {
      setSelectedService(service);
      setFormData({
        nom: service.nom,
        description: service.description,
        icone: service.icone,
        slug: service.slug,
      });
    } else {
      setSelectedService(null);
      setFormData({
        nom: "",
        description: "",
        icone: "briefcase",
        slug: "",
      });
    }
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug = formData.slug || generateSlug(formData.nom);

      if (selectedService) {
        // Update existing
        const { error } = await supabase
          .from("services")
          .update({
            nom: formData.nom,
            description: formData.description,
            icone: formData.icone,
            slug,
          })
          .eq("id", selectedService.id);

        if (error) throw error;
      } else {
        // Create new
        const maxOrdre = Math.max(...services.map((s) => s.ordre), 0);
        const { error } = await supabase.from("services").insert({
          nom: formData.nom,
          description: formData.description,
          icone: formData.icone,
          slug,
          ordre: maxOrdre + 1,
        });

        if (error) throw error;
      }

      await fetchServices();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", selectedService.id);

      if (error) throw error;

      setServices(services.filter((s) => s.id !== selectedService.id));
      setDeleteDialogOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const moveService = async (service: Service, direction: "up" | "down") => {
    const currentIndex = services.findIndex((s) => s.id === service.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= services.length) return;

    const otherService = services[newIndex];

    try {
      // Swap orders
      await supabase
        .from("services")
        .update({ ordre: otherService.ordre })
        .eq("id", service.id);

      await supabase
        .from("services")
        .update({ ordre: service.ordre })
        .eq("id", otherService.id);

      await fetchServices();
    } catch (error) {
      console.error("Error reordering services:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-gray-500">
            Gérez les types de services et recettes affichés sur le site
          </p>
        </div>
        <Button onClick={() => openEditDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Service
        </Button>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Liste des Services ({services.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun service configuré
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Ordre</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icône</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1"
                          onClick={() => moveService(service, "up")}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1"
                          onClick={() => moveService(service, "down")}
                          disabled={index === services.length - 1}
                        >
                          ↓
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{service.nom}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {service.description}
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {service.icone}
                      </code>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm text-gray-500">
                        {service.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedService(service);
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
              {selectedService ? "Modifier le Service" : "Nouveau Service"}
            </DialogTitle>
            <DialogDescription>
              {selectedService
                ? "Modifiez les informations du service"
                : "Ajoutez un nouveau type de service/recette"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du service *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                placeholder="Ex: Taxes Minières"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description du service..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icone">Icône</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
                {availableIcons.map((icon) => (
                  <Button
                    key={icon}
                    type="button"
                    variant={formData.icone === icon ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setFormData({ ...formData, icone: icon })}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="Auto-généré si vide"
              />
              <p className="text-xs text-gray-500">
                Laissez vide pour générer automatiquement
              </p>
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
              disabled={saving || !formData.nom || !formData.description}
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
            <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le service "{selectedService?.nom}"
              sera définitivement supprimé.
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
