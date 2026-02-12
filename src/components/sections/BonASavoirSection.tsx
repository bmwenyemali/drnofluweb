"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  AlertCircle,
  HelpCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Exemples de "Bon à Savoir" (à remplacer par des données Supabase)
const bonASavoirItems = [
  {
    id: 1,
    titre: "Le saviez-vous ?",
    contenu:
      "Tout contribuable a le droit de demander un reçu officiel pour chaque paiement effectué à la DRNOFLU.",
    type: "info" as const,
  },
  {
    id: 2,
    titre: "Astuce",
    contenu:
      "Effectuez vos déclarations avant le 15 de chaque mois pour éviter les pénalités de retard.",
    type: "astuce" as const,
  },
  {
    id: 3,
    titre: "Important",
    contenu:
      "Les recettes non fiscales contribuent directement au financement des infrastructures provinciales.",
    type: "alerte" as const,
  },
  {
    id: 4,
    titre: "Question fréquente",
    contenu:
      "Comment calculer le montant de ma contribution ? Utilisez notre simulateur en ligne ou contactez nos services.",
    type: "question" as const,
  },
];

const typeConfig = {
  info: {
    icon: Info,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
  },
  astuce: {
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    iconColor: "text-yellow-600",
  },
  alerte: {
    icon: AlertCircle,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    iconColor: "text-orange-600",
  },
  question: {
    icon: HelpCircle,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    iconColor: "text-purple-600",
  },
};

/**
 * Section "Bon à Savoir" - Informations courtes et utiles
 */
export function BonASavoirSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            💡 Centre d&apos;Information
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bon à Savoir
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des informations essentielles pour mieux comprendre les recettes non
            fiscales et vos droits en tant que contribuable.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {bonASavoirItems.map((item, index) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        <Icon className={`h-4 w-4 ${config.iconColor}`} />
                      </div>
                      <Badge variant="outline" className={config.color}>
                        {item.titre}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.contenu}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <Button asChild variant="outline">
            <Link href="/bon-a-savoir">
              Voir plus d&apos;informations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
