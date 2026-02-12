import { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone, Award, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DIRECTION_INFO } from "@/lib/config";

export const metadata: Metadata = {
  title: "Direction",
  description:
    "Découvrez l'équipe de direction de la DRNOFLU - Direction des Recettes Non Fiscales du Lualaba.",
};

/**
 * Page Direction - Présentation de l'équipe dirigeante
 */
export default function DirectionPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Notre Direction
            </h1>
            <p className="text-xl text-primary-100">
              Une équipe engagée au service du développement du Lualaba
            </p>
          </div>
        </div>
      </section>

      {/* Directeur Provincial - Section principale */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-2 border-primary-100">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Photo du Directeur */}
                <div className="relative h-[400px] md:h-full bg-gradient-to-br from-primary-100 to-primary-50">
                  <Image
                    src={DIRECTION_INFO.directeur.photo}
                    alt={DIRECTION_INFO.directeur.nom}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                {/* Informations du Directeur */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-primary-100 text-primary-700 hover:bg-primary-100">
                    <Award className="h-3 w-3 mr-1" />
                    {DIRECTION_INFO.directeur.titre}
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {DIRECTION_INFO.directeur.nom}
                  </h2>
                  <blockquote className="text-lg text-gray-600 italic border-l-4 border-primary-500 pl-4 mb-6">
                    &ldquo;{DIRECTION_INFO.directeur.slogan}&rdquo;
                  </blockquote>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Le Directeur Provincial assure la coordination générale des
                    activités de la DRNOFLU et veille à l&apos;atteinte des
                    objectifs de mobilisation des recettes non fiscales pour le
                    développement de la province du Lualaba.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="mailto:directeur@drnoflu.gouv.cd"
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
                    >
                      <Mail className="h-4 w-4" />
                      directeur@drnoflu.gouv.cd
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Gouverneure - Tutelle */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Autorité de Tutelle
            </h2>
            <p className="text-gray-600">
              Gouvernorat de la Province du Lualaba
            </p>
          </div>

          <Card className="max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-3 gap-0">
                {/* Photo de la Gouverneure */}
                <div className="relative h-[300px] md:h-auto bg-gradient-to-br from-secondary-100 to-secondary-50">
                  <Image
                    src={DIRECTION_INFO.gouverneure.photo}
                    alt={DIRECTION_INFO.gouverneure.nom}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                {/* Informations de la Gouverneure */}
                <div className="md:col-span-2 p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-3 bg-secondary-100 text-secondary-700 hover:bg-secondary-100">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {DIRECTION_INFO.gouverneure.titre}
                  </Badge>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {DIRECTION_INFO.gouverneure.nom}
                  </h3>
                  <blockquote className="text-gray-600 italic border-l-4 border-secondary-500 pl-4">
                    &ldquo;{DIRECTION_INFO.gouverneure.slogan}&rdquo;
                  </blockquote>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Équipe de direction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Équipe de Direction
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Directeur Adjoint */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
                <Badge variant="secondary" className="mb-2">
                  Directeur Adjoint
                </Badge>
                <h3 className="text-lg font-semibold">À nommer</h3>
                <p className="text-sm text-gray-500">
                  Coordination opérationnelle
                </p>
              </CardContent>
            </Card>

            {/* Chef de Division Recouvrement */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
                <Badge variant="secondary" className="mb-2">
                  Chef Division Recouvrement
                </Badge>
                <h3 className="text-lg font-semibold">À nommer</h3>
                <p className="text-sm text-gray-500">
                  Gestion des recouvrements
                </p>
              </CardContent>
            </Card>

            {/* Chef de Division Contentieux */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
                <Badge variant="secondary" className="mb-2">
                  Chef Division Contentieux
                </Badge>
                <h3 className="text-lg font-semibold">À nommer</h3>
                <p className="text-sm text-gray-500">Affaires juridiques</p>
              </CardContent>
            </Card>

            {/* Chef de Division Administrative */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
                <Badge variant="secondary" className="mb-2">
                  Chef Division Admin
                </Badge>
                <h3 className="text-lg font-semibold">À nommer</h3>
                <p className="text-sm text-gray-500">Gestion administrative</p>
              </CardContent>
            </Card>

            {/* Chef de Division Études et Statistiques */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
                <Badge variant="secondary" className="mb-2">
                  Chef Division Études
                </Badge>
                <h3 className="text-lg font-semibold">À nommer</h3>
                <p className="text-sm text-gray-500">Études et statistiques</p>
              </CardContent>
            </Card>

            {/* Secrétariat de Direction */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
                <Badge variant="secondary" className="mb-2">
                  Secrétariat de Direction
                </Badge>
                <h3 className="text-lg font-semibold">À nommer</h3>
                <p className="text-sm text-gray-500">Support administratif</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
