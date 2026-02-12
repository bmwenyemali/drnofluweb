"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createBrowserClient } from "@/lib/supabase";
import { CATEGORIES_ACTUALITES } from "@/lib/config";
import { CategorieActualite } from "@/lib/types";

export default function NouvelleActualitePage() {
  const [titre, setTitre] = useState("");
  const [slug, setSlug] = useState("");
  const [extrait, setExtrait] = useState("");
  const [contenu, setContenu] = useState("");
  const [categorie, setCategorie] = useState<CategorieActualite>("general");
  const [imageUrl, setImageUrl] = useState("");
  const [publie, setPublie] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createBrowserClient();

  // Générer le slug automatiquement
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-") // Replace multiple - with single -
      .trim();
  };

  const handleTitreChange = (value: string) => {
    setTitre(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Vous devez être connecté pour créer une actualité");
        setLoading(false);
        return;
      }

      const { data, error: insertError } = await supabase
        .from("actualites")
        .insert({
          titre,
          slug,
          extrait,
          contenu,
          categorie,
          image_url: imageUrl || null,
          publie,
          auteur_id: user.id,
          date_publication: publie ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push("/admin/actualites");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/actualites">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nouvelle Actualité
            </h1>
            <p className="text-gray-500">
              Créez une nouvelle actualité ou communiqué
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={loading}>
            <Eye className="mr-2 h-4 w-4" />
            Aperçu
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !titre}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Enregistrement..." : publie ? "Publier" : "Enregistrer"}
          </Button>
        </div>
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
                <CardTitle>Contenu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre *</Label>
                  <Input
                    id="titre"
                    value={titre}
                    onChange={(e) => handleTitreChange(e.target.value)}
                    placeholder="Titre de l'actualité"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="slug-de-lactualite"
                  />
                  <p className="text-xs text-gray-500">
                    URL: /actualites/{slug || "..."}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="extrait">Extrait *</Label>
                  <Textarea
                    id="extrait"
                    value={extrait}
                    onChange={(e) => setExtrait(e.target.value)}
                    placeholder="Bref résumé de l'actualité (affiché dans les listes)"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {extrait.length}/250 caractères recommandés
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contenu">Contenu *</Label>
                  <Textarea
                    id="contenu"
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    placeholder="Contenu complet de l'actualité..."
                    rows={15}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publication */}
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="publie"
                    checked={publie}
                    onCheckedChange={(checked) => setPublie(checked as boolean)}
                  />
                  <Label htmlFor="publie" className="cursor-pointer">
                    Publier immédiatement
                  </Label>
                </div>
                <div className="pt-2">
                  <Badge variant={publie ? "default" : "secondary"}>
                    {publie ? "Sera publié" : "Brouillon"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={categorie}
                  onValueChange={(value) =>
                    setCategorie(value as CategorieActualite)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES_ACTUALITES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle>Image de couverture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de l'image</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                {imageUrl && (
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
                {!imageUrl && (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Aucune image</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
