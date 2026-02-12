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
import { CategorieDocument, TypeDocument } from "@/lib/types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { FileUpload } from "@/components/admin/FileUpload";

const CATEGORIES: { id: CategorieDocument; label: string }[] = [
  { id: "ordonnance", label: "Ordonnance" },
  { id: "arrete", label: "Arrêté" },
  { id: "decret", label: "Décret" },
  { id: "loi", label: "Loi" },
  { id: "circulaire", label: "Circulaire" },
  { id: "note", label: "Note" },
  { id: "formulaire", label: "Formulaire" },
  { id: "rapport", label: "Rapport" },
  { id: "livre", label: "Livre" },
  { id: "guide", label: "Guide" },
];

const TYPES: { id: TypeDocument; label: string }[] = [
  { id: "pdf", label: "PDF" },
  { id: "doc", label: "DOC" },
  { id: "docx", label: "DOCX" },
  { id: "xls", label: "XLS" },
  { id: "xlsx", label: "XLSX" },
];

export default function NouveauDocumentPage() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [resume, setResume] = useState("");
  const [auteur, setAuteur] = useState("");
  const [nombrePages, setNombrePages] = useState("");
  const [categorie, setCategorie] = useState<CategorieDocument>("rapport");
  const [type, setType] = useState<TypeDocument>("pdf");
  const [fichierUrl, setFichierUrl] = useState("");
  const [imageCouvertureUrl, setImageCouvertureUrl] = useState("");
  const [tailleFichier, setTailleFichier] = useState<number | undefined>();
  const [annee, setAnnee] = useState(new Date().getFullYear().toString());
  const [publie, setPublie] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleFileUpload = (url: string, fileSize?: number) => {
    setFichierUrl(url);
    if (fileSize) setTailleFichier(fileSize);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("documents")
        .insert({
          titre,
          description: description || null,
          resume: resume || null,
          auteur: auteur || null,
          nombre_pages: nombrePages ? parseInt(nombrePages) : null,
          categorie,
          type,
          fichier_url: fichierUrl,
          image_couverture_url: imageCouvertureUrl || null,
          taille_fichier: tailleFichier || null,
          annee: parseInt(annee),
          publie,
          date_publication: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push("/admin/documents");
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
            <Link href="/admin/documents">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nouveau Document
            </h1>
            <p className="text-gray-500">
              Ajoutez un nouveau document à la bibliothèque
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading || !titre || !fichierUrl}
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
                <CardTitle>Informations du Document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre *</Label>
                  <Input
                    id="titre"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    placeholder="Titre du document"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="auteur">Auteur</Label>
                    <Input
                      id="auteur"
                      value={auteur}
                      onChange={(e) => setAuteur(e.target.value)}
                      placeholder="Nom de l'auteur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombrePages">Nombre de pages</Label>
                    <Input
                      id="nombrePages"
                      type="number"
                      value={nombrePages}
                      onChange={(e) => setNombrePages(e.target.value)}
                      placeholder="Ex: 50"
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description courte</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brève description du document..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Résumé détaillé</Label>
                  <Textarea
                    id="resume"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder="Résumé complet du document, points clés..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fichier */}
            <Card>
              <CardHeader>
                <CardTitle>Fichier du document *</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  value={fichierUrl}
                  onChange={handleFileUpload}
                  folder="drnoflu/documents"
                  placeholder="Cliquez pour télécharger le document"
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
                    Publier immédiatement
                  </Label>
                </div>
                <div className="pt-2">
                  <Badge variant={publie ? "default" : "secondary"}>
                    {publie ? "Sera publié" : "Non publié"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Category & Type */}
            <Card>
              <CardHeader>
                <CardTitle>Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select
                    value={categorie}
                    onValueChange={(value) =>
                      setCategorie(value as CategorieDocument)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type de fichier</Label>
                  <Select
                    value={type}
                    onValueChange={(value) => setType(value as TypeDocument)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Année</Label>
                  <Select value={annee} onValueChange={setAnnee}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Image de couverture */}
            <Card>
              <CardHeader>
                <CardTitle>Image de couverture</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={imageCouvertureUrl}
                  onChange={setImageCouvertureUrl}
                  folder="drnoflu/documents/covers"
                  aspectRatio="portrait"
                  placeholder="Image de la première page"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Recommandé: Image de la première page du document
                </p>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-3xl">
                    {type === "pdf" ? "📄" : type.includes("xls") ? "📊" : "📝"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {titre || "Titre du document"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {CATEGORIES.find((c) => c.id === categorie)?.label} •{" "}
                      {type.toUpperCase()}
                      {nombrePages && ` • ${nombrePages} pages`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
