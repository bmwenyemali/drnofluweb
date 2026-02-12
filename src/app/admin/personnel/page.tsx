"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Users, MoreVertical } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBrowserClient } from "@/lib/supabase";
import { Personnel, EquipeType } from "@/lib/types";

const EQUIPES: { id: EquipeType; label: string; color: string }[] = [
  { id: "direction", label: "Direction", color: "bg-blue-100 text-blue-800" },
  { id: "cadres", label: "Cadres", color: "bg-purple-100 text-purple-800" },
  { id: "technique", label: "Technique", color: "bg-green-100 text-green-800" },
  {
    id: "administratif",
    label: "Administratif",
    color: "bg-orange-100 text-orange-800",
  },
  { id: "autre", label: "Autre", color: "bg-gray-100 text-gray-800" },
];

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEquipe, setFilterEquipe] = useState<string>("all");
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("personnel")
      .select("*")
      .order("equipe", { ascending: true })
      .order("ordre", { ascending: true });

    if (!error && data) {
      setPersonnel(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) return;

    const { error } = await supabase.from("personnel").delete().eq("id", id);

    if (!error) {
      setPersonnel(personnel.filter((p) => p.id !== id));
    }
  };

  const toggleActif = async (id: string, actif: boolean) => {
    const { error } = await supabase
      .from("personnel")
      .update({ actif: !actif })
      .eq("id", id);

    if (!error) {
      setPersonnel(
        personnel.map((p) => (p.id === id ? { ...p, actif: !actif } : p)),
      );
    }
  };

  const filteredPersonnel = personnel.filter((p) => {
    const matchesSearch =
      p.nom_complet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fonction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEquipe = filterEquipe === "all" || p.equipe === filterEquipe;
    return matchesSearch && matchesEquipe;
  });

  const getEquipeInfo = (equipe: EquipeType) => {
    return EQUIPES.find((e) => e.id === equipe) || EQUIPES[4];
  };

  // Group by equipe for stats
  const stats = EQUIPES.map((e) => ({
    ...e,
    count: personnel.filter((p) => p.equipe === e.id && p.actif).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personnel</h1>
          <p className="text-gray-500">
            Gérez les membres de l&apos;équipe DRNOFLU
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/personnel/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un membre
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
                <Users className="h-8 w-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou fonction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterEquipe} onValueChange={setFilterEquipe}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrer par équipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les équipes</SelectItem>
                {EQUIPES.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste du personnel ({filteredPersonnel.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : filteredPersonnel.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun membre trouvé
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membre</TableHead>
                  <TableHead>Fonction</TableHead>
                  <TableHead>Équipe</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonnel.map((membre) => (
                  <TableRow key={membre.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          {membre.photo_url ? (
                            <Image
                              src={membre.photo_url}
                              alt={membre.nom_complet}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm font-medium">
                              {membre.nom_complet
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{membre.nom_complet}</p>
                          <p className="text-sm text-gray-500">
                            {membre.titre}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{membre.fonction}</TableCell>
                    <TableCell>
                      <Badge className={getEquipeInfo(membre.equipe).color}>
                        {getEquipeInfo(membre.equipe).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {membre.email && <p>{membre.email}</p>}
                        {membre.telephone && (
                          <p className="text-gray-500">{membre.telephone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={membre.actif ? "default" : "secondary"}>
                        {membre.actif ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/personnel/${membre.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleActif(membre.id, membre.actif)}
                          >
                            {membre.actif ? "Désactiver" : "Activer"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(membre.id)}
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
    </div>
  );
}
