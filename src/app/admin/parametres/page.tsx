"use client";

import { useState, useEffect } from "react";
import {
  Save,
  User,
  Lock,
  Bell,
  Globe,
  Building,
  Mail,
  Phone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createBrowserClient } from "@/lib/supabase";

export default function ParametresPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Profile state
  const [profile, setProfile] = useState({
    nom_complet: "",
    email: "",
    avatar_url: "",
  });

  // Password state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Site settings
  const [siteSettings, setSiteSettings] = useState({
    telephone: "",
    email: "",
    adresse: "",
    facebook: "",
    description: "",
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile({
          nom_complet: profileData.nom_complet || "",
          email: user.email || "",
          avatar_url: profileData.avatar_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      const { error } = await supabase
        .from("profiles")
        .update({
          nom_complet: profile.nom_complet,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      setMessage("Profil mis à jour avec succès");
    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    setLoading(true);
    setMessage("");

    if (passwords.new !== passwords.confirm) {
      setMessage("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (passwords.new.length < 8) {
      setMessage("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      });

      if (error) throw error;

      setPasswords({ current: "", new: "", confirm: "" });
      setMessage("Mot de passe mis à jour avec succès");
    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500">
          Gérez votre profil et les paramètres du site
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.startsWith("Erreur")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profil">
            <User className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="securite">
            <Lock className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="site">
            <Globe className="mr-2 h-4 w-4" />
            Site
          </TabsTrigger>
        </TabsList>

        {/* Profil Tab */}
        <TabsContent value="profil">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Profil</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700">
                  {profile.nom_complet.charAt(0) || "?"}
                </div>
                <div>
                  <h3 className="font-medium">
                    {profile.nom_complet || "Nom"}
                  </h3>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  <Badge className="mt-2">Administrateur</Badge>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nom_complet">Nom complet</Label>
                  <Input
                    id="nom_complet"
                    value={profile.nom_complet}
                    onChange={(e) =>
                      setProfile({ ...profile, nom_complet: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar_url">URL de l'avatar</Label>
                <Input
                  id="avatar_url"
                  value={profile.avatar_url}
                  onChange={(e) =>
                    setProfile({ ...profile, avatar_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <Button onClick={updateProfile} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité Tab */}
        <TabsContent value="securite">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>
                Assurez-vous d'utiliser un mot de passe fort
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Mot de passe actuel</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_password">Nouveau mot de passe</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">
                    Confirmer le nouveau mot de passe
                  </Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button onClick={updatePassword} disabled={loading}>
                <Lock className="mr-2 h-4 w-4" />
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Tab */}
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du Site</CardTitle>
              <CardDescription>
                Configurez les informations générales du site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_telephone">
                    <Phone className="inline mr-2 h-4 w-4" />
                    Téléphone
                  </Label>
                  <Input
                    id="site_telephone"
                    value={siteSettings.telephone}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        telephone: e.target.value,
                      })
                    }
                    placeholder="+243 976 868 417"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_email">
                    <Mail className="inline mr-2 h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="site_email"
                    type="email"
                    value={siteSettings.email}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        email: e.target.value,
                      })
                    }
                    placeholder="contact@drnoflu.cd"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_adresse">
                  <Building className="inline mr-2 h-4 w-4" />
                  Adresse
                </Label>
                <Textarea
                  id="site_adresse"
                  value={siteSettings.adresse}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      adresse: e.target.value,
                    })
                  }
                  placeholder="Adresse complète..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Description du site</Label>
                <Textarea
                  id="site_description"
                  value={siteSettings.description}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description pour le SEO..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_facebook">Page Facebook</Label>
                <Input
                  id="site_facebook"
                  value={siteSettings.facebook}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      facebook: e.target.value,
                    })
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>

              <Button disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les paramètres
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
