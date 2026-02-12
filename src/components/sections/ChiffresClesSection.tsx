"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, FolderOpen, Award } from "lucide-react";
import { CHIFFRES_CLES } from "@/lib/config";

/**
 * Section Chiffres Clés avec animation de comptage
 */
export function ChiffresClesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const icons = [TrendingUp, Users, FolderOpen, Award];

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            DRNOFLU en Chiffres
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des résultats concrets au service du développement du Lualaba
          </p>
        </motion.div>

        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {CHIFFRES_CLES.map((chiffre, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <div className="absolute -top-4 left-6 bg-primary-600 rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="pt-6">
                    <AnimatedCounter
                      value={chiffre.valeur}
                      prefix={chiffre.prefixe}
                      suffix={chiffre.suffixe}
                      isInView={isInView}
                    />
                    <h3 className="text-sm md:text-base font-medium text-gray-600 mt-2">
                      {chiffre.label}
                    </h3>
                    {chiffre.description && (
                      <p className="text-xs text-gray-400 mt-1 hidden md:block">
                        {chiffre.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Compteur animé pour les chiffres
 */
function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  isInView,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div className="text-3xl md:text-4xl font-bold text-primary-700">
      {prefix}
      {count.toLocaleString("fr-FR")}
      {suffix}
    </div>
  );
}
