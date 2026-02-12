"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User, Mail, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createBrowserClient } from "@/lib/supabase";

export default function NouvelUtilisateurPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomComplet, setNomComplet] = useState("");
  const [role, setRole] = useState<"admin" | "editeur" | "lecteur">("lecteur");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Note: Creating users requires admin privileges or service role
      // In production, this should be done via an Edge Function with service role
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom_complet: nomComplet,
            role: role,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Update the profile with the role
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          email,
          nom_complet: nomComplet,
          role,
        });

        if (profileError) throw profileError;
      }

      router.push("/admin/utilisateurs");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      setLoading(false);
    }
  };

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
            Nouvel Utilisateur
          </h1>
          <p className="text-gray-500">Créez un nouveau compte utilisateur</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Informations de l'utilisateur</CardTitle>
            <CardDescription>
              Remplissez les informations pour créer un nouveau compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
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
                Adresse email *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean@drnoflu.cd"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                <Lock className="inline mr-2 h-4 w-4" />
                Mot de passe *
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 caractères"
                minLength={8}
                required
              />
              <p className="text-xs text-gray-500">
                Le mot de passe doit contenir au moins 8 caractères
              </p>
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
                Les administrateurs ont un accès complet. Les éditeurs peuvent
                gérer le contenu.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Création..." : "Créer l'utilisateur"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/utilisateurs">Annuler</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
