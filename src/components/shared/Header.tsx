"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";

/**
 * Header principal du site DRNOFLU
 * Navigation responsive avec menu mobile
 */
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("fr");
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
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
                  {LOCALES.find((l) => l.code === currentLocale)?.flag}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LOCALES.map((locale) => (
                  <DropdownMenuItem
                    key={locale.code}
                    onClick={() => setCurrentLocale(locale.code)}
                    className={cn(
                      "cursor-pointer",
                      currentLocale === locale.code && "bg-accent",
                    )}
                  >
                    <span className="mr-2">{locale.flag}</span>
                    {locale.label}
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
                        {item.label}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link href={child.href} className="w-full">
                            {child.label}
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
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Actions à droite */}
          <div className="flex items-center gap-2">
            {/* Bouton Recherche */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Rechercher</span>
            </Button>

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
                          {item.label}
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
                                {child.label}
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
