"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  BarChart3,
  FolderOpen,
  HelpCircle,
  UserCircle,
  Briefcase,
  TrendingUp,
  Lightbulb,
  Activity,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@/lib/supabase";

// Type pour les rôles utilisateur
type UserRole = "admin" | "editeur" | "lecteur";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[]; // Rôles autorisés à voir ce menu
}

const ADMIN_NAV: NavItem[] = [
  {
    label: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "editeur", "lecteur"],
  },
  {
    label: "Actualités",
    href: "/admin/actualites",
    icon: Newspaper,
    roles: ["admin", "editeur"],
  },
  {
    label: "Documents",
    href: "/admin/documents",
    icon: FolderOpen,
    roles: ["admin", "editeur"],
  },
  {
    label: "Bon à savoir",
    href: "/admin/bon-a-savoir",
    icon: Lightbulb,
    roles: ["admin", "editeur"],
  },
  {
    label: "Personnel",
    href: "/admin/personnel",
    icon: UserCircle,
    roles: ["admin"],
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: Briefcase,
    roles: ["admin"],
  },
  {
    label: "Chiffres Clés",
    href: "/admin/chiffres-cles",
    icon: TrendingUp,
    roles: ["admin"],
  },
  {
    label: "Simulations",
    href: "/admin/simulations",
    icon: Calculator,
    roles: ["admin"],
  },
  {
    label: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: Mail,
    roles: ["admin", "editeur"],
  },
  {
    label: "Journal",
    href: "/admin/journal",
    icon: Activity,
    roles: ["admin"],
  },
  {
    label: "Statistiques",
    href: "/admin/statistiques",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    label: "Paramètres",
    href: "/admin/parametres",
    icon: Settings,
    roles: ["admin"],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient();

  // Filter navigation based on user role
  const filteredNav = useMemo(() => {
    const userRole = user?.profile?.role as UserRole | undefined;
    if (!userRole) return [];
    return ADMIN_NAV.filter((item) => item.roles.includes(userRole));
  }, [user?.profile?.role]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/admin/login");
          return;
        }

        // Récupérer le profil utilisateur
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (
          profile &&
          (profile.role === "admin" ||
            profile.role === "editeur" ||
            profile.role === "lecteur")
        ) {
          setUser({ ...session.user, profile });
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    // Skip auth check on login page
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    checkAuth();
  }, [pathname, router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  // Show login page without layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar - Horizontal */}
      <header className="sticky top-0 z-50 bg-primary-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-3">
              <span className="font-bold text-white hidden sm:inline">
                Admin
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {filteredNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {/* Retour au site */}
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Site</span>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:bg-white/10"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profile?.avatar_url} />
                      <AvatarFallback className="bg-white/20 text-white">
                        {user?.profile?.nom_complet?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden xl:inline text-sm font-medium">
                      {user?.profile?.nom_complet || "Admin"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {user?.profile?.nom_complet}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-primary-600 font-medium mt-1">
                      {user?.profile?.role === "admin" && "Administrateur"}
                      {user?.profile?.role === "editeur" && "Éditeur"}
                      {user?.profile?.role === "lecteur" && "Lecteur"}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/parametres">
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10">
            <nav className="container mx-auto px-4 py-2 space-y-1">
              {filteredNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="border-t border-white/10 pt-2 mt-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Retour au site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-300 hover:bg-white/10"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="container mx-auto p-4 lg:p-6">{children}</main>
    </div>
  );
}
