"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createBrowserClient } from "@/lib/supabase";
import { Actualite, CategorieActualite } from "@/lib/types";
import { CATEGORIES_ACTUALITES } from "@/lib/config";

export default function ActualitesPage() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedActualite, setSelectedActualite] = useState<Actualite | null>(
    null,
  );
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("actualites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setActualites(data || []);
    } catch (error) {
      console.error("Error fetching actualites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedActualite) return;

    try {
      const { error } = await supabase
        .from("actualites")
        .delete()
        .eq("id", selectedActualite.id);

      if (error) throw error;

      setActualites(actualites.filter((a) => a.id !== selectedActualite.id));
      setDeleteDialogOpen(false);
      setSelectedActualite(null);
    } catch (error) {
      console.error("Error deleting actualite:", error);
    }
  };

  const togglePublish = async (actualite: Actualite) => {
    try {
      const { error } = await supabase
        .from("actualites")
        .update({ publie: !actualite.publie })
        .eq("id", actualite.id);

      if (error) throw error;

      setActualites(
        actualites.map((a) =>
          a.id === actualite.id ? { ...a, publie: !a.publie } : a,
        ),
      );
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const filteredActualites = actualites.filter((actualite) => {
    const matchesSearch =
      actualite.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actualite.extrait.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || actualite.categorie === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "publie" && actualite.publie) ||
      (statusFilter === "brouillon" && !actualite.publie);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: CategorieActualite) => {
    const cat = CATEGORIES_ACTUALITES.find((c) => c.id === category);
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      purple: "bg-purple-100 text-purple-700",
      orange: "bg-orange-100 text-orange-700",
      gray: "bg-gray-100 text-gray-700",
    };
    return colors[cat?.color || "gray"];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Actualités</h1>
          <p className="text-gray-500">
            Gérez les actualités et communiqués de la DRNOFLU
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/actualites/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Actualité
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une actualité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {CATEGORIES_ACTUALITES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="publie">Publiés</SelectItem>
                <SelectItem value="brouillon">Brouillons</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Chargement...</p>
            </div>
          ) : filteredActualites.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Aucune actualité trouvée</p>
              <Button asChild className="mt-4">
                <Link href="/admin/actualites/nouveau">
                  Créer une actualité
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActualites.map((actualite) => (
                  <TableRow key={actualite.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{actualite.titre}</p>
                        <p className="text-sm text-gray-500 truncate max-w-[350px]">
                          {actualite.extrait}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getCategoryColor(actualite.categorie)}
                      >
                        {CATEGORIES_ACTUALITES.find(
                          (c) => c.id === actualite.categorie,
                        )?.label || actualite.categorie}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {actualite.publie ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Publié
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          Brouillon
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(actualite.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/actualites/${actualite.slug}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/actualites/${actualite.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => togglePublish(actualite)}
                          >
                            {actualite.publie ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Dépublier
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Publier
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedActualite(actualite);
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'actualité</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedActualite?.titre}" ?
              Cette action est irréversible.
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
    </div>
  );
}
