"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Pickaxe,
  Leaf,
  Truck,
  Store,
  Building,
  FileText,
  ArrowRight,
  Wheat,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TYPES_RECETTES } from "@/lib/config";
import { useTranslation } from "@/lib/i18n";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Pickaxe,
  Leaf,
  Truck,
  Store,
  Building,
  FileText,
  Wheat,
  Heart,
};

/**
 * Section présentation des services/types de recettes
 */
export function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-primary-100 text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            {t("services", "sectionLabel")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("services", "title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("services", "subtitle")}
          </p>
        </motion.div>

        {/* Grille de services */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {TYPES_RECETTES.slice(0, 8).map((recette, index) => {
            const Icon = iconMap[recette.icone] || FileText;
            return (
              <motion.div
                key={recette.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/services/${recette.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group border-gray-200 hover:border-primary-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-4 bg-primary-100 rounded-xl group-hover:bg-primary-600 transition-colors mb-4">
                          <Icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                          {recette.nom}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                          {recette.description}
                        </p>
                        <span className="mt-4 text-primary-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          {t("services", "learnMore")}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bouton voir plus */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <Button asChild size="lg">
            <Link href="/services">
              {t("services", "viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
