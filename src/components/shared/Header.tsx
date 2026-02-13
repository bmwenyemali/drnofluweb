"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MAIN_NAV, LOCALES, SITE_CONFIG } from "@/lib/config";
import { useTranslation, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./SearchDialog";

/**
 * Header principal du site DRNOFLU
 * Navigation responsive avec menu mobile
 */
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { locale, setLocale, t } = useTranslation();
  const pathname = usePathname();

  // Keyboard shortcut: Ctrl+K or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Map nav paths to translation keys
  const getNavLabel = (href: string, originalLabel: string) => {
    const navMap: Record<
      string,
      keyof typeof import("@/lib/i18n/translations").translations.nav
    > = {
      "/": "home",
      "/a-propos": "about",
      "/services": "services",
      "/actualites": "news",
      "/contact": "contact",
      "/juridique": "legal",
      "/structure": "structure",
      "/direction": "direction",
      "/bon-a-savoir": "goodToKnow",
      "/cartographie": "map",
    };
    const key = navMap[href];
    if (key) {
      return t("nav", key);
    }
    return originalLabel;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Barre supérieure */}
      <div className="bg-primary-900 text-white py-1.5 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">📞 {SITE_CONFIG.telephone}</span>
            <span className="hidden md:inline">📧 {SITE_CONFIG.email}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Sélecteur de langue */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 h-7 px-2"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {LOCALES.find((l) => l.code === locale)?.flag}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LOCALES.map((loc) => (
                  <DropdownMenuItem
                    key={loc.code}
                    onClick={() => setLocale(loc.code as Locale)}
                    className={cn(
                      "cursor-pointer",
                      locale === loc.code && "bg-accent",
                    )}
                  >
                    <span className="mr-2">{loc.flag}</span>
                    {loc.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo2.png"
              alt="Logo DRNOFLU"
              width={70}
              height={70}
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {MAIN_NAV.map((item) => (
              <div key={item.href} className="relative group">
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "h-9 px-3 text-sm font-medium",
                          isActive(item.href)
                            ? "text-primary-700 bg-primary-50"
                            : "text-gray-700 hover:text-primary-700 hover:bg-primary-50",
                        )}
                      >
                        {getNavLabel(item.href, item.label)}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link href={child.href} className="w-full">
                            {getNavLabel(child.href, child.label)}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-md transition-colors",
                      isActive(item.href)
                        ? "text-primary-700 bg-primary-50"
                        : "text-gray-700 hover:text-primary-700 hover:bg-primary-50",
                    )}
                  >
                    {getNavLabel(item.href, item.label)}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Actions à droite */}
          <div className="flex items-center gap-2">
            {/* Bouton Recherche */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm hidden md:inline">Rechercher</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-gray-100 border rounded">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Search Dialog */}
            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

            {/* Menu Mobile */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col gap-4 mt-6">
                  {/* Logo dans le menu mobile */}
                  <Link
                    href="/"
                    className="flex items-center gap-3 mb-4"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image
                      src="/images/logo1.png"
                      alt="Logo DRNOFLU"
                      width={40}
                      height={40}
                    />
                    <span className="font-bold text-primary-900">DRNOFLU</span>
                  </Link>

                  {/* Liens de navigation mobile */}
                  <nav className="flex flex-col gap-1">
                    {MAIN_NAV.map((item) => (
                      <div key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isActive(item.href)
                              ? "text-primary-700 bg-primary-50"
                              : "text-gray-700 hover:text-primary-700 hover:bg-primary-50",
                          )}
                        >
                          {getNavLabel(item.href, item.label)}
                        </Link>
                        {item.children && (
                          <div className="pl-4 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-1.5 text-sm text-gray-600 hover:text-primary-700"
                              >
                                {getNavLabel(child.href, child.label)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>

                  {/* Contact dans le menu mobile */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600 mb-2">Contact:</p>
                    <p className="text-sm">{SITE_CONFIG.telephone}</p>
                    <p className="text-sm">{SITE_CONFIG.email}</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
