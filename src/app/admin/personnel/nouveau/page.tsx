"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBrowserClient } from "@/lib/supabase";
import { EquipeType } from "@/lib/types";
import { ImageUpload } from "@/components/admin/ImageUpload";

const EQUIPES: { id: EquipeType; label: string }[] = [
  { id: "direction", label: "Direction" },
  { id: "cadres", label: "Cadres" },
  { id: "technique", label: "Technique" },
  { id: "administratif", label: "Administratif" },
  { id: "autre", label: "Autre" },
];

const DEPARTEMENTS = [
  "Direction Générale",
  "Administration et Finances",
  "Recouvrement",
  "Contrôle et Audit",
  "Informatique",
  "Ressources Humaines",
  "Communication",
  "Juridique",
  "Autre",
];

export default function NouveauPersonnelPage() {
  const [nomComplet, setNomComplet] = useState("");
  const [titre, setTitre] = useState("");
  const [fonction, setFonction] = useState("");
  const [departement, setDepartement] = useState("");
  const [equipe, setEquipe] = useState<EquipeType>("autre");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [ordre, setOrdre] = useState("0");
  const [actif, setActif] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("personnel")
        .insert({
          nom_complet: nomComplet,
          titre,
          fonction,
          departement,
          equipe,
          bio: bio || null,
          photo_url: photoUrl || null,
          email: email || null,
          telephone: telephone || null,
          linkedin: linkedin || null,
          ordre: parseInt(ordre) || 0,
          actif,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push("/admin/personnel");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/personnel">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nouveau Membre</h1>
            <p className="text-gray-500">
              Ajoutez un nouveau membre à l&apos;équipe
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading || !nomComplet || !fonction}
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomComplet">Nom complet *</Label>
                  <Input
                    id="nomComplet"
                    value={nomComplet}
                    onChange={(e) => setNomComplet(e.target.value)}
                    placeholder="Ex: Jean-Pierre Mukendi"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titre">Titre</Label>
                    <Input
                      id="titre"
                      value={titre}
                      onChange={(e) => setTitre(e.target.value)}
                      placeholder="Ex: Dr., Ir., Prof."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fonction">Fonction *</Label>
                    <Input
                      id="fonction"
                      value={fonction}
                      onChange={(e) => setFonction(e.target.value)}
                      placeholder="Ex: Directeur Général"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Parcours professionnel, compétences..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email professionnel</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@drnoflu.gouv.cd"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+243 ..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn (optionnel)</Label>
                  <Input
                    id="linkedin"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo */}
            <Card>
              <CardHeader>
                <CardTitle>Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={photoUrl}
                  onChange={setPhotoUrl}
                  folder="website/personnel"
                  aspectRatio="square"
                  placeholder="Photo du membre"
                />
              </CardContent>
            </Card>

            {/* Classification */}
            <Card>
              <CardHeader>
                <CardTitle>Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Équipe *</Label>
                  <Select
                    value={equipe}
                    onValueChange={(value) => setEquipe(value as EquipeType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPES.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Département</Label>
                  <Select value={departement} onValueChange={setDepartement}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTEMENTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ordre">Ordre d&apos;affichage</Label>
                  <Input
                    id="ordre"
                    type="number"
                    value={ordre}
                    onChange={(e) => setOrdre(e.target.value)}
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    Plus le nombre est petit, plus haut dans la liste
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Statut */}
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="actif"
                    checked={actif}
                    onCheckedChange={(checked) => setActif(checked as boolean)}
                  />
                  <Label htmlFor="actif" className="cursor-pointer">
                    Membre actif
                  </Label>
                </div>
                <div className="pt-2">
                  <Badge variant={actif ? "default" : "secondary"}>
                    {actif ? "Visible sur le site" : "Non visible"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
