import { Metadata } from "next";
import Image from "next/image";
import {
  Target,
  Eye,
  Heart,
  Award,
  History,
  Users,
  Building2,
  Scale,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "À Propos",
  description:
    "Découvrez la mission, la vision et les valeurs de la Direction des Recettes Non Fiscales du Lualaba (DRNOFLU).",
};

/**
 * Page À Propos - Présentation de la DRNOFLU
 */
export default function AProposPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">À Propos</h1>
            <p className="text-xl text-primary-100">
              La Direction des Recettes Non Fiscales du Lualaba au service du
              développement provincial
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Valeurs */}
      <section id="mission" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <Card className="border-t-4 border-t-primary-600">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <Target className="h-6 w-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold">Notre Mission</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Mobiliser efficacement les ressources non fiscales
                  provinciales dans le respect des textes légaux en vigueur,
                  pour financer le développement durable de la province du
                  Lualaba et améliorer les conditions de vie de ses habitants.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-t-4 border-t-secondary-600">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-secondary-100 rounded-xl">
                    <Eye className="h-6 w-6 text-secondary-600" />
                  </div>
                  <h2 className="text-xl font-bold">Notre Vision</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Devenir une institution de référence en matière de collecte
                  des recettes non fiscales en République Démocratique du Congo,
                  reconnue pour son professionnalisme, sa transparence et son
                  impact positif sur le développement provincial.
                </p>
              </CardContent>
            </Card>

            {/* Valeurs */}
            <Card className="border-t-4 border-t-amber-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Heart className="h-6 w-6 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold">Nos Valeurs</h2>
                </div>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    Intégrité et transparence
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    Professionnalisme
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    Service au public
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    Efficacité et innovation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    Équité et justice
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Historique */}
      <section id="historique" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary-100 rounded-xl">
                <History className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold">Notre Historique</h2>
            </div>

            <div className="space-y-8">
              <div className="relative pl-8 border-l-2 border-primary-200">
                <div className="absolute left-0 top-0 w-4 h-4 bg-primary-600 rounded-full -translate-x-[9px]" />
                <h3 className="text-lg font-semibold mb-2">
                  Création de la Province du Lualaba
                </h3>
                <p className="text-gray-600">
                  Suite au démembrement de l&apos;ancienne province du Katanga,
                  la province du Lualaba a été créée avec ses propres structures
                  administratives et financières.
                </p>
              </div>

              <div className="relative pl-8 border-l-2 border-primary-200">
                <div className="absolute left-0 top-0 w-4 h-4 bg-primary-600 rounded-full -translate-x-[9px]" />
                <h3 className="text-lg font-semibold mb-2">
                  Mise en place de la DRNOFLU
                </h3>
                <p className="text-gray-600">
                  La Direction des Recettes Non Fiscales du Lualaba a été
                  instituée pour assurer la gestion et la collecte des recettes
                  non fiscales de la province.
                </p>
              </div>

              <div className="relative pl-8 border-l-2 border-primary-200">
                <div className="absolute left-0 top-0 w-4 h-4 bg-primary-600 rounded-full -translate-x-[9px]" />
                <h3 className="text-lg font-semibold mb-2">
                  Modernisation et Digitalisation
                </h3>
                <p className="text-gray-600">
                  La DRNOFLU s&apos;engage dans un processus de modernisation de
                  ses services avec le développement d&apos;outils numériques
                  pour faciliter les démarches des contribuables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectifs */}
      <section id="valeurs" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Nos Objectifs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">
                  Service aux Contribuables
                </h3>
                <p className="text-sm text-gray-600">
                  Faciliter les démarches et améliorer l&apos;expérience des
                  contribuables
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">
                  Excellence Opérationnelle
                </h3>
                <p className="text-sm text-gray-600">
                  Optimiser les processus de collecte et de gestion des recettes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Développement Provincial</h3>
                <p className="text-sm text-gray-600">
                  Contribuer au financement des projets de développement du
                  Lualaba
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Scale className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Équité Fiscale</h3>
                <p className="text-sm text-gray-600">
                  Garantir une application juste et équitable des contributions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
