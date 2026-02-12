"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Phone, Building2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * Section Hero de la page d'accueil
 * Présentation visuelle principale avec image de fond
 */
export function HeroSection() {
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
              Province du Lualaba - RDC
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Direction des Recettes
              <span className="text-primary-300 block">Non Fiscales</span>
              du Lualaba
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed">
              Au service de la mobilisation des ressources provinciales pour un
              développement durable et équitable du Lualaba.
            </p>

            {/* Boutons d&apos;action */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-900 hover:bg-gray-100"
              >
                <Link href="/services">
                  Nos Services
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
                  Nous Contacter
                </Link>
              </Button>
            </div>

            {/* Liens rapides */}
            <div className="flex flex-wrap gap-6 pt-6 text-sm border-t border-white/20 mt-4">
              <Link
                href="/juridique"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
              >
                <FileText className="h-4 w-4" />
                Cadre Juridique
              </Link>
              <Link
                href="/structure"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
              >
                <Building2 className="h-4 w-4" />
                Notre Structure
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
              >
                <Settings className="h-4 w-4" />
                Administration
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

      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 50L48 45.8C96 41.7 192 33.3 288 33.3C384 33.3 480 41.7 576 50C672 58.3 768 66.7 864 62.5C960 58.3 1056 41.7 1152 35.4C1248 29.2 1344 33.3 1392 35.4L1440 37.5V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
