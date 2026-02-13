"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  Users,
  Mail,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Eye,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createBrowserClient } from "@/lib/supabase";

interface DashboardStats {
  actualites: number;
  utilisateurs: number;
  messages: number;
  messagesNonLus: number;
  documents: number;
}

interface RecentItem {
  id: string;
  titre: string;
  date: string;
  type: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    actualites: 0,
    utilisateurs: 0,
    messages: 0,
    messagesNonLus: 0,
    documents: 0,
  });
  const [recentActualites, setRecentActualites] = useState<RecentItem[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch counts
        const [
          { count: actualitesCount },
          { count: utilisateursCount },
          { count: messagesCount },
          { count: messagesNonLusCount },
          { count: documentsCount },
        ] = await Promise.all([
          supabase
            .from("actualites")
            .select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase
            .from("contact_messages")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("contact_messages")
            .select("*", { count: "exact", head: true })
            .eq("lu", false),
          supabase
            .from("documents")
            .select("*", { count: "exact", head: true }),
        ]);

        setStats({
          actualites: actualitesCount || 0,
          utilisateurs: utilisateursCount || 0,
          messages: messagesCount || 0,
          messagesNonLus: messagesNonLusCount || 0,
          documents: documentsCount || 0,
        });

        // Fetch recent actualites
        const { data: actualites } = await supabase
          .from("actualites")
          .select("id, titre, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (actualites) {
          setRecentActualites(
            actualites.map((a) => ({
              id: a.id,
              titre: a.titre,
              date: a.created_at,
              type: "actualite",
            })),
          );
        }

        // Fetch recent messages
        const { data: messages } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (messages) {
          setRecentMessages(messages);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  // Get user role
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const getUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile) {
          setUserRole(profile.role);
        }
      }
    };
    getUserRole();
  }, [supabase]);

  const allStatCards = [
    {
      title: "Actualités",
      value: stats.actualites,
      icon: Newspaper,
      color: "bg-blue-500",
      href: "/admin/actualites",
      trend: "+12%",
      trendUp: true,
      roles: ["admin", "editeur"],
    },
    {
      title: "Utilisateurs",
      value: stats.utilisateurs,
      icon: Users,
      color: "bg-green-500",
      href: "/admin/utilisateurs",
      trend: "+5%",
      trendUp: true,
      roles: ["admin"], // Only admin can see users
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: Mail,
      color: "bg-purple-500",
      href: "/admin/messages",
      badge:
        stats.messagesNonLus > 0
          ? `${stats.messagesNonLus} non lus`
          : undefined,
      roles: ["admin", "editeur"],
    },
    {
      title: "Documents",
      value: stats.documents,
      icon: FileText,
      color: "bg-orange-500",
      href: "/admin/documents",
      roles: ["admin", "editeur"],
    },
  ];

  // Filter cards based on user role
  const statCards = allStatCards.filter(
    (card) => !card.roles || card.roles.includes(userRole),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">
            Bienvenue dans le portail d'administration
          </h2>
          <p className="text-primary-100">
            Gérez les actualités, documents, utilisateurs et messages de la
            DRNOFLU.
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    {stat.badge && (
                      <Badge variant="destructive" className="text-xs">
                        {stat.badge}
                      </Badge>
                    )}
                  </div>
                  {stat.trend && (
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      {stat.trendUp ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={
                          stat.trendUp ? "text-green-600" : "text-red-600"
                        }
                      >
                        {stat.trend}
                      </span>
                      <span className="text-gray-400">ce mois</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <Link
                href={stat.href}
                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-4"
              >
                Voir tout <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Actualités */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">
              Actualités Récentes
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/actualites">
                Voir tout <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentActualites.length > 0 ? (
              <div className="space-y-4">
                {recentActualites.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Newspaper className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.titre}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.date)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/actualites/${item.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucune actualité pour le moment</p>
                <Button asChild className="mt-4">
                  <Link href="/admin/actualites/nouveau">
                    Créer une actualité
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">
              Messages Récents
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/messages">
                Voir tout <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      !message.lu ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        !message.lu ? "bg-blue-200" : "bg-gray-100"
                      }`}
                    >
                      <Mail
                        className={`h-4 w-4 ${
                          !message.lu ? "text-blue-600" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{message.nom}</p>
                        {!message.lu && (
                          <Badge variant="secondary" className="text-xs">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-0.5">
                        {message.sujet}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(message.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucun message pour le moment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto py-4">
              <Link
                href="/admin/actualites/nouveau"
                className="flex flex-col items-center gap-2"
              >
                <Newspaper className="h-6 w-6" />
                <span>Nouvelle Actualité</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link
                href="/admin/documents/nouveau"
                className="flex flex-col items-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>Nouveau Document</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link
                href="/admin/utilisateurs/nouveau"
                className="flex flex-col items-center gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Nouvel Utilisateur</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <Link
                href="/admin/messages"
                className="flex flex-col items-center gap-2"
              >
                <Mail className="h-6 w-6" />
                <span>Voir Messages</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
