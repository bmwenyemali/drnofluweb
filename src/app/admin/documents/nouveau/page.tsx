"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, FileText } from "lucide-react";
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

const CATEGORIES: { id: CategorieDocument; label: string }[] = [
  { id: "ordonnance", label: "Ordonnance" },
  { id: "arrete", label: "Arrêté" },
  { id: "decret", label: "Décret" },
  { id: "loi", label: "Loi" },
  { id: "circulaire", label: "Circulaire" },
  { id: "note", label: "Note" },
  { id: "formulaire", label: "Formulaire" },
  { id: "rapport", label: "Rapport" },
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
  const [categorie, setCategorie] = useState<CategorieDocument>("rapport");
  const [type, setType] = useState<TypeDocument>("pdf");
  const [fichierUrl, setFichierUrl] = useState("");
  const [annee, setAnnee] = useState(new Date().getFullYear().toString());
  const [publie, setPublie] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from("documents")
        .insert({
          titre,
          description: description || null,
          categorie,
          type,
          fichier_url: fichierUrl,
          annee: parseInt(annee),
          publie,
          date_publication: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push("/admin/documents");
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
            <Link href="/admin/documents">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nouveau Document
            </h1>
            <p className="text-gray-500">
              Ajoutez un nouveau document juridique ou formulaire
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
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
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

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description optionnelle du document..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fichierUrl">URL du fichier *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fichierUrl"
                      value={fichierUrl}
                      onChange={(e) => setFichierUrl(e.target.value)}
                      placeholder="https://..."
                      required
                    />
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Entrez l'URL du fichier ou téléchargez-le vers un service de
                    stockage
                  </p>
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
