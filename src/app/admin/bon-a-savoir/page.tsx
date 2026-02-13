"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Lightbulb,
  Info,
  AlertTriangle,
  MoreHorizontal,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createBrowserClient } from "@/lib/supabase";
import { BonASavoirItem } from "@/lib/types";

const TYPE_OPTIONS = [
  {
    value: "astuce",
    label: "Astuce",
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "information",
    label: "Information",
    icon: Info,
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "important",
    label: "Important",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-800",
  },
];

const ICONE_OPTIONS = [
  "info",
  "alert-triangle",
  "lightbulb",
  "file-text",
  "clock",
  "smartphone",
  "percent",
  "file-check",
  "message-square",
  "tag",
  "shield",
  "check-circle",
];

export default function BonASavoirAdminPage() {
  const [items, setItems] = useState<BonASavoirItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BonASavoirItem | null>(null);
  const [formData, setFormData] = useState({
    titre: "",
    contenu: "",
    type: "information" as "astuce" | "information" | "important",
    icone: "info",
    ordre: 0,
    publie: true,
  });
  const [saving, setSaving] = useState(false);

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bon_a_savoir")
      .select("*")
      .order("ordre", { ascending: true });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setFormData({
      titre: "",
      contenu: "",
      type: "information",
      icone: "info",
      ordre: items.length + 1,
      publie: true,
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: BonASavoirItem) => {
    setSelectedItem(item);
    setFormData({
      titre: item.titre,
      contenu: item.contenu,
      type: item.type,
      icone: item.icone,
      ordre: item.ordre,
      publie: item.publie,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: BonASavoirItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    const { error } = await supabase
      .from("bon_a_savoir")
      .delete()
      .eq("id", selectedItem.id);

    if (!error) {
      fetchItems();
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSave = async () => {
    setSaving(true);

    if (selectedItem) {
      // Update
      const { error } = await supabase
        .from("bon_a_savoir")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedItem.id);

      if (!error) {
        fetchItems();
        setDialogOpen(false);
      }
    } else {
      // Create
      const { error } = await supabase.from("bon_a_savoir").insert([formData]);

      if (!error) {
        fetchItems();
        setDialogOpen(false);
      }
    }

    setSaving(false);
  };

  const togglePublish = async (item: BonASavoirItem) => {
    const { error } = await supabase
      .from("bon_a_savoir")
      .update({ publie: !item.publie })
      .eq("id", item.id);

    if (!error) {
      fetchItems();
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.titre
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeInfo = (type: string) => {
    return TYPE_OPTIONS.find((t) => t.value === type) || TYPE_OPTIONS[1];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Bon à Savoir</h2>
          <p className="text-gray-500">
            Gérez les informations utiles pour les visiteurs
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TYPE_OPTIONS.map((type) => {
          const count = items.filter((i) => i.type === type.value).length;
          const TypeIcon = type.icon;
          return (
            <Card key={type.value}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${type.color}`}>
                  <TypeIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-gray-500">{type.label}s</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {TYPE_OPTIONS.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Ordre</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[100px]">Statut</TableHead>
                  <TableHead className="w-[100px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      Aucun élément trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => {
                    const typeInfo = getTypeInfo(item.type);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.ordre}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.titre}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {item.contenu.substring(0, 80)}...
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.publie ? "default" : "secondary"}
                          >
                            {item.publie ? "Publié" : "Brouillon"}
                          </Badge>
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
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => togglePublish(item)}
                              >
                                {item.publie ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Dépublier
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Publier
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(item)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Modifier" : "Ajouter"} un élément
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="titre">Titre</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) =>
                  setFormData({ ...formData, titre: e.target.value })
                }
                placeholder="Titre de l'information"
              />
            </div>

            <div>
              <Label htmlFor="contenu">Contenu</Label>
              <Textarea
                id="contenu"
                value={formData.contenu}
                onChange={(e) =>
                  setFormData({ ...formData, contenu: e.target.value })
                }
                placeholder="Contenu détaillé..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(
                    value: "astuce" | "information" | "important",
                  ) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ordre">Ordre</Label>
                <Input
                  id="ordre"
                  type="number"
                  value={formData.ordre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ordre: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="icone">Icône</Label>
              <Select
                value={formData.icone}
                onValueChange={(value) =>
                  setFormData({ ...formData, icone: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICONE_OPTIONS.map((icone) => (
                    <SelectItem key={icone} value={icone}>
                      {icone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formData.titre || !formData.contenu}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedItem?.titre}" ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
