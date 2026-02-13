"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Shield,
  Phone,
  FileText,
  Camera,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createBrowserClient } from "@/lib/supabase";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Profile } from "@/lib/types";

export default function EditUtilisateurPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [nomComplet, setNomComplet] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editeur" | "lecteur">("lecteur");
  const [telephone, setTelephone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setNomComplet(data.nom_complet || "");
        setEmail(data.email || "");
        setRole(data.role || "lecteur");
        setTelephone(data.telephone || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
      }
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setError("Impossible de charger l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          nom_complet: nomComplet,
          role,
          telephone,
          bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      setSuccess("Utilisateur mis à jour avec succès");
      setTimeout(() => {
        router.push("/admin/utilisateurs");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setSaving(false);
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/utilisateurs">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Modifier l&apos;utilisateur
          </h1>
          <p className="text-gray-500">{email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Modifiez les informations de l&apos;utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                    {success}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nomComplet">
                    <User className="inline mr-2 h-4 w-4" />
                    Nom complet *
                  </Label>
                  <Input
                    id="nomComplet"
                    value={nomComplet}
                    onChange={(e) => setNomComplet(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline mr-2 h-4 w-4" />
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    L&apos;email ne peut pas être modifié
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">
                    <Phone className="inline mr-2 h-4 w-4" />
                    Téléphone
                  </Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="+243 XXX XXX XXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">
                    <FileText className="inline mr-2 h-4 w-4" />
                    Biographie
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Courte description..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">
                    <Shield className="inline mr-2 h-4 w-4" />
                    Rôle *
                  </Label>
                  <Select value={role} onValueChange={(v) => setRole(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        Administrateur - Accès complet
                      </SelectItem>
                      <SelectItem value="editeur">
                        Éditeur - Gestion du contenu
                      </SelectItem>
                      <SelectItem value="lecteur">
                        Lecteur - Lecture seule
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Les administrateurs ont un accès complet. Les éditeurs
                    peuvent gérer le contenu.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Camera className="inline mr-2 h-4 w-4" />
                  Photo de profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-2xl bg-primary-100 text-primary-700">
                      {nomComplet.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <ImageUpload
                  value={avatarUrl}
                  onChange={setAvatarUrl}
                  folder="website/avatars"
                  aspectRatio="square"
                  placeholder="Télécharger une photo"
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Button type="submit" className="w-full" disabled={saving}>
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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/admin/utilisateurs">Annuler</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
