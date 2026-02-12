"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DIRECTION_INFO, CATEGORIES_ACTUALITES } from "@/lib/config";

// Données statiques d'actualités (à remplacer par des données Supabase)
const actualitesRecentes = [
  {
    id: 1,
    titre: "Campagne de sensibilisation sur les recettes non fiscales",
    extrait:
      "La DRNOFLU lance une nouvelle campagne pour informer les contribuables sur leurs obligations...",
    categorie: "communique",
    date: "2026-02-10",
    image: "/images/actualites/campagne.jpg",
  },
  {
    id: 2,
    titre: "Rapport annuel 2025 disponible",
    extrait:
      "Le rapport annuel de la DRNOFLU pour l'année 2025 est maintenant accessible au public...",
    categorie: "rapport",
    date: "2026-02-05",
    image: "/images/actualites/rapport.jpg",
  },
  {
    id: 3,
    titre: "Nouvelle procédure de déclaration simplifiée",
    extrait:
      "Pour faciliter les démarches des contribuables, la DRNOFLU introduit une procédure simplifiée...",
    categorie: "annonce",
    date: "2026-01-28",
    image: "/images/actualites/procedure.jpg",
  },
];

// Liens rapides
const liensRapides = [
  { label: "Formulaires à télécharger", href: "/juridique#formulaires" },
  { label: "Tarification des services", href: "/services#tarification" },
  { label: "Procédures de paiement", href: "/services#procedures" },
  { label: "Questions fréquentes", href: "/bon-a-savoir#faq" },
  { label: "Structure organisationnelle", href: "/structure" },
];

/**
 * Sidebar droite avec actualités et informations
 */
export function SidebarSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale: Actualités */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Actualités Récentes
              </h2>
              <Link
                href="/actualites"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
              >
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="space-y-4">
              {actualitesRecentes.map((actu, index) => {
                const categorie = CATEGORIES_ACTUALITES.find(
                  (c) => c.id === actu.categorie,
                );
                return (
                  <motion.div
                    key={actu.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-48 h-32 sm:h-auto bg-gray-200 relative flex-shrink-0">
                            <div className="absolute inset-0 bg-primary-200 flex items-center justify-center">
                              <span className="text-primary-600 text-sm">
                                Image
                              </span>
                            </div>
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="secondary"
                                className="text-xs bg-primary-100 text-primary-700"
                              >
                                {categorie?.label || "Actualité"}
                              </Badge>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(actu.date).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                            <Link
                              href={`/actualites/${actu.id}`}
                              className="block"
                            >
                              <h3 className="font-semibold text-gray-900 hover:text-primary-700 transition-colors line-clamp-2 mb-2">
                                {actu.titre}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {actu.extrait}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="space-y-6">
            {/* Liens rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary-600 rounded-full" />
                    Accès Rapides
                  </h3>
                  <ul className="space-y-2">
                    {liensRapides.map((lien) => (
                      <li key={lien.href}>
                        <Link
                          href={lien.href}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 py-1.5 transition-colors group"
                        >
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                          {lien.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Gouverneure */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden bg-gradient-to-br from-primary-50 to-white border-primary-100">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-200">
                      <Image
                        src={DIRECTION_INFO.gouverneure.photo}
                        alt={DIRECTION_INFO.gouverneure.nom}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                        {DIRECTION_INFO.gouverneure.titre}
                      </p>
                      <h4 className="font-semibold text-gray-900">
                        {DIRECTION_INFO.gouverneure.nom}
                      </h4>
                    </div>
                  </div>
                  <blockquote className="text-sm text-gray-600 italic border-l-2 border-primary-300 pl-3">
                    &ldquo;{DIRECTION_INFO.gouverneure.slogan}&rdquo;
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>

            {/* Directeur */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-400">
                      <Image
                        src={DIRECTION_INFO.directeur.photo}
                        alt={DIRECTION_INFO.directeur.nom}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-primary-300 font-medium uppercase tracking-wide">
                        {DIRECTION_INFO.directeur.titre}
                      </p>
                      <h4 className="font-semibold">
                        {DIRECTION_INFO.directeur.nom}
                      </h4>
                    </div>
                  </div>
                  <blockquote className="text-sm text-gray-300 italic border-l-2 border-primary-500 pl-3">
                    &ldquo;{DIRECTION_INFO.directeur.slogan}&rdquo;
                  </blockquote>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-gray-600 text-white hover:bg-white/10"
                  >
                    <Link href="/direction">En savoir plus</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
