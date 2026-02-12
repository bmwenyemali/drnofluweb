import { Metadata } from "next";
import { Building2, Users, Briefcase, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Structure Organisationnelle",
  description:
    "Découvrez l'organigramme et la structure organisationnelle de la DRNOFLU.",
};

// Structure organisationnelle
const organigramme = {
  direction: {
    titre: "Direction Provinciale",
    postes: [
      {
        titre: "Directeur Provincial",
        nom: "Georges Tshata Mbov",
        description: "Coordination générale et supervision",
      },
      {
        titre: "Directeur Adjoint",
        nom: "À nommer",
        description: "Appui à la coordination",
      },
      {
        titre: "Secrétariat de Direction",
        nom: "À nommer",
        description: "Gestion administrative",
      },
    ],
  },
  divisions: [
    {
      nom: "Division Recouvrement",
      description: "Gestion des opérations de recouvrement des recettes",
      responsable: "À nommer",
      bureaux: [
        "Bureau Secteur Minier",
        "Bureau Secteur Environnement",
        "Bureau Secteur Transport",
        "Bureau Secteur Commerce",
        "Bureau Secteur Foncier",
      ],
    },
    {
      nom: "Division Contentieux",
      description: "Gestion des litiges et dossiers juridiques",
      responsable: "À nommer",
      bureaux: [
        "Bureau Litiges",
        "Bureau Recouvrement Forcé",
        "Bureau Documentation Juridique",
      ],
    },
    {
      nom: "Division Administrative et Financière",
      description: "Gestion des ressources humaines et finances",
      responsable: "À nommer",
      bureaux: [
        "Bureau Personnel",
        "Bureau Finances",
        "Bureau Matériel et Logistique",
      ],
    },
    {
      nom: "Division Études, Planification et Statistiques",
      description: "Analyses, prévisions et reporting",
      responsable: "À nommer",
      bureaux: [
        "Bureau Études et Recherches",
        "Bureau Statistiques",
        "Bureau Informatique",
      ],
    },
  ],
  antennes: [
    { nom: "Antenne de Kolwezi", territoire: "Kolwezi" },
    { nom: "Antenne de Dilolo", territoire: "Dilolo" },
    { nom: "Antenne de Kapanga", territoire: "Kapanga" },
    { nom: "Antenne de Lubudi", territoire: "Lubudi" },
    { nom: "Antenne de Mutshatsha", territoire: "Mutshatsha" },
    { nom: "Antenne de Sandoa", territoire: "Sandoa" },
  ],
};

/**
 * Page Structure - Organigramme interactif
 */
export default function StructurePage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Structure Organisationnelle
            </h1>
            <p className="text-xl text-primary-100">
              Organigramme et organisation interne de la DRNOFLU
            </p>
          </div>
        </div>
      </section>

      {/* Direction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary-100 text-primary-700">
              <Building2 className="h-3 w-3 mr-1" />
              Direction
            </Badge>
            <h2 className="text-2xl font-bold">Direction Provinciale</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Directeur */}
            <Card className="mb-6 border-2 border-primary-200 bg-gradient-to-r from-primary-50 to-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                    DP
                  </div>
                  <h3 className="text-xl font-bold text-primary-900">
                    {organigramme.direction.postes[0].titre}
                  </h3>
                  <p className="text-primary-700 font-medium">
                    {organigramme.direction.postes[0].nom}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {organigramme.direction.postes[0].description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Ligne de connexion */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-primary-300" />
            </div>

            {/* Adjoints */}
            <div className="grid md:grid-cols-2 gap-6">
              {organigramme.direction.postes.slice(1).map((poste, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-14 h-14 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-3">
                      <Users className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold">{poste.titre}</h4>
                    <p className="text-sm text-gray-500">{poste.nom}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divisions */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-secondary-100 text-secondary-700">
              <Briefcase className="h-3 w-3 mr-1" />
              Divisions
            </Badge>
            <h2 className="text-2xl font-bold">Divisions Techniques</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {organigramme.divisions.map((division, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow h-full"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary-100 rounded-xl flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-secondary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{division.nom}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {division.description}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Responsable:</span>{" "}
                        <span className="font-medium">
                          {division.responsable}
                        </span>
                      </p>

                      {/* Bureaux */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                          Bureaux:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {division.bureaux.map((bureau, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {bureau}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Antennes Territoriales */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-amber-100 text-amber-700">
              📍 Présence Territoriale
            </Badge>
            <h2 className="text-2xl font-bold">Antennes Territoriales</h2>
            <p className="text-gray-600 mt-2">
              La DRNOFLU dispose d&apos;antennes dans les différents territoires
              de la province du Lualaba.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {organigramme.antennes.map((antenne, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="w-12 h-12 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-3">
                    <Building2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-sm">
                    {antenne.territoire}
                  </h4>
                  <p className="text-xs text-gray-500">{antenne.nom}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact des divisions */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-center">
                Contacter une Division
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                  <Phone className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Standard</p>
                    <p className="font-medium">+243 XXX XXX XXX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                  <Mail className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email général</p>
                    <p className="font-medium">drnoflu@gmail.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
