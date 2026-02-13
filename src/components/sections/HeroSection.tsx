"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Phone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

/**
 * Section Hero de la page d'accueil
 * Présentation visuelle principale avec image de fond
 */
export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/batiment.png"
          alt="Bâtiment DRNOFLU"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/80 to-primary-900/60" />
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Colonne gauche: Texte principal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {t("hero", "province")}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t("hero", "title1")}
              <span className="text-primary-300 block">
                {t("hero", "title2")}
              </span>
              {t("hero", "title3")}
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed">
              {t("hero", "subtitle")}
            </p>

            {/* Boutons d&apos;action */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-900 hover:bg-gray-100"
              >
                <Link href="/services">
                  {t("hero", "ourServices")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/10 hover:bg-white/20"
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  {t("hero", "contactUs")}
                </Link>
              </Button>
            </div>

            {/* Liens rapides */}
            <div className="flex flex-wrap gap-4 pt-6 text-sm border-t border-white/20 mt-4">
              <Link
                href="/juridique"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors font-semibold shadow-lg"
              >
                <FileText className="h-4 w-4" />
                {t("hero", "legalFramework")}
              </Link>
              <Link
                href="/structure"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors font-semibold shadow-lg"
              >
                <Building2 className="h-4 w-4" />
                {t("hero", "ourStructure")}
              </Link>
            </div>
          </motion.div>

          {/* Colonne droite: Logo/Emblème */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
              <Image
                src="/images/logo1.png"
                alt="Logo DRNOFLU"
                width={350}
                height={350}
                className="relative z-10 drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
