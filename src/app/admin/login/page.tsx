"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
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
import { createBrowserClient } from "@/lib/supabase";
import { createActivityLogger } from "@/lib/activity-logger";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        },
      );

      if (authError) {
        setError("Email ou mot de passe incorrect");
        setLoading(false);
        return;
      }

      if (data.user) {
        // Vérifier le rôle de l'utilisateur
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, nom_complet")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profile) {
          setError("Profil utilisateur non trouvé");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        if (profile.role !== "admin" && profile.role !== "editeur") {
          setError(
            "Accès non autorisé. Seuls les administrateurs et éditeurs peuvent accéder à ce portail.",
          );
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        // Log the successful login
        const activityLogger = createActivityLogger(supabase);
        await activityLogger.logLogin(
          data.user.email || email,
          profile.nom_complet,
        );

        router.push("/admin");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo1.png"
              alt="DRNOFLU"
              width={100}
              height={100}
              className="mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">DRNOFLU</h1>
          <p className="text-primary-200">Portail d'Administration</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Connexion</CardTitle>
            <CardDescription>
              Accédez au tableau de bord d'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@drnoflu.cd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Se connecter
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                ← Retour au site principal
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-primary-300 text-sm mt-8">
          © 2026 DRNOFLU - Tous droits réservés
        </p>
      </div>
    </div>
  );
}
