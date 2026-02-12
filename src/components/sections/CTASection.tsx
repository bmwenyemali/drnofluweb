"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/config";

/**
 * Section Call to Action / Contact rapide
 */
export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu gauche */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Besoin d&apos;assistance ?
            </h2>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              Notre équipe est à votre disposition pour répondre à toutes vos
              questions concernant les recettes non fiscales et les procédures
              de la DRNOFLU.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-900 hover:bg-gray-100"
              >
                <Link href="/contact">
                  Nous Contacter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/services">Explorer nos services</Link>
              </Button>
            </div>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Nos Coordonnées
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-primary-200 font-medium">
                    Adresse
                  </p>
                  <p className="text-white">
                    {SITE_CONFIG.adresse.rue}
                    <br />
                    {SITE_CONFIG.adresse.ville}, {SITE_CONFIG.adresse.province}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-primary-200 font-medium">
                    Téléphone
                  </p>
                  <a
                    href={`tel:${SITE_CONFIG.telephone}`}
                    className="text-white hover:text-primary-200"
                  >
                    {SITE_CONFIG.telephone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-primary-200 font-medium">Email</p>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-white hover:text-primary-200"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-primary-200 font-medium">
                    Heures d&apos;ouverture
                  </p>
                  <p className="text-white">
                    Lundi - Vendredi: 8h00 - 16h00
                    <br />
                    Samedi: 8h00 - 12h00
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
