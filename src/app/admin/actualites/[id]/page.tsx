"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, X, Star, Loader2, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createBrowserClient } from "@/lib/supabase";
import { CATEGORIES_ACTUALITES } from "@/lib/config";
import { CategorieActualite } from "@/lib/types";
import { ImageUpload, MultiImageUpload } from "@/components/admin/ImageUpload";
import { YouTubeInput } from "@/components/admin/YouTubeInput";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export default function EditActualitePage() {
  const params = useParams();
  const router = useRouter();
  const actualiteId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [titre, setTitre] = useState("");
  const [slug, setSlug] = useState("");
  const [extrait, setExtrait] = useState("");
  const [contenu, setContenu] = useState("");
  const [categorie, setCategorie] = useState<CategorieActualite>("general");
  const [imageUrl, setImageUrl] = useState("");
  const [galerieImages, setGalerieImages] = useState<string[]>([]);
  const [videosYoutube, setVideosYoutube] = useState<string[]>([]);
  const [publie, setPublie] = useState(false);
  const [aLaUne, setALaUne] = useState(false);

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchActualite();
  }, [actualiteId]);

  const fetchActualite = async () => {
    if (!actualiteId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("actualites")
        .select("*")
        .eq("id", actualiteId)
        .single();

      if (error) throw error;

      if (data) {
        setTitre(data.titre || "");
        setSlug(data.slug || "");
        setExtrait(data.extrait || "");
        setContenu(data.contenu || "");
        setCategorie(data.categorie || "general");
        setImageUrl(data.image_url || "");
        setGalerieImages(data.galerie_images || []);
        setVideosYoutube(data.videos_youtube || []);
        setPublie(data.publie || false);
        setALaUne(data.a_la_une || false);
      }
    } catch (err: unknown) {
      console.error("Error fetching actualite:", err);
      setError("Impossible de charger l'actualité");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitreChange = (value: string) => {
    setTitre(value);
    if (!slug || slug === generateSlug(titre)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("actualites")
        .update({
          titre,
          slug,
          extrait,
          contenu,
          categorie,
          image_url: imageUrl || null,
          galerie_images: galerieImages,
          videos_youtube: videosYoutube,
          publie,
          a_la_une: aLaUne,
          date_publication: publie ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", actualiteId);

      if (updateError) throw updateError;

      setSuccess("Actualité mise à jour avec succès");
      setTimeout(() => {
        router.push("/admin/actualites");
      }, 1500);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("actualites")
        .delete()
        .eq("id", actualiteId);

      if (error) throw error;

      router.push("/admin/actualites");
    } catch (err: unknown) {
      console.error("Error deleting:", err);
      setError("Erreur lors de la suppression");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

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
              Modifier l&apos;actualité
            </h1>
            <p className="text-gray-500">{titre || "Sans titre"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette actualité ? Cette
                  action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" asChild>
            <Link href={`/actualites/${slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </Link>
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !titre}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg">
          {success}
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
                    placeholder="Bref résumé de l'actualité"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contenu de l&apos;article *</Label>
                  <RichTextEditor
                    value={contenu}
                    onChange={setContenu}
                    placeholder="Rédigez le contenu complet de l'actualité..."
                    minHeight="400px"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Galerie d'images */}
            <Card>
              <CardHeader>
                <CardTitle>Galerie d&apos;images</CardTitle>
              </CardHeader>
              <CardContent>
                <MultiImageUpload
                  value={galerieImages}
                  onChange={setGalerieImages}
                  folder="website/actualites"
                  maxImages={10}
                />
              </CardContent>
            </Card>

            {/* Vidéos YouTube */}
            <Card>
              <CardHeader>
                <CardTitle>Vidéos YouTube</CardTitle>
              </CardHeader>
              <CardContent>
                <YouTubeInput
                  value={videosYoutube}
                  onChange={setVideosYoutube}
                  maxVideos={5}
                />
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
                    Publié
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aLaUne"
                    checked={aLaUne}
                    onCheckedChange={(checked) => setALaUne(checked as boolean)}
                  />
                  <Label
                    htmlFor="aLaUne"
                    className="cursor-pointer flex items-center gap-1"
                  >
                    <Star className="h-4 w-4 text-yellow-500" />À la une
                  </Label>
                </div>
                <div className="pt-2 flex gap-2">
                  <Badge variant={publie ? "default" : "secondary"}>
                    {publie ? "Publié" : "Brouillon"}
                  </Badge>
                  {aLaUne && (
                    <Badge
                      variant="outline"
                      className="border-yellow-500 text-yellow-600"
                    >
                      À la une
                    </Badge>
                  )}
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
              <CardContent>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  folder="website/actualites"
                  aspectRatio="video"
                  placeholder="Cliquez pour ajouter une image de couverture"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
