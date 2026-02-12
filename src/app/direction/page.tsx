import { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone, Award, Briefcase, Linkedin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DIRECTION_INFO } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Direction",
  description:
    "Découvrez l'équipe de direction de la DRNOFLU - Direction des Recettes Non Fiscales du Lualaba.",
};

async function getPersonnel() {
  const supabase = await createClient();
  const { data: personnel, error } = await supabase
    .from("personnel")
    .select("*")
    .eq("actif", true)
    .order("ordre", { ascending: true })
    .order("nom", { ascending: true });

  if (error) {
    console.error("Error fetching personnel:", error);
    return [];
  }

  return personnel || [];
}

/**
 * Page Direction - Présentation de l'équipe dirigeante
 */
export default async function DirectionPage() {
  const personnel = await getPersonnel();

  // Grouper le personnel par équipe
  const personnelByTeam = personnel.reduce((acc: any, p: any) => {
    const team = p.equipe || "autre";
    if (!acc[team]) acc[team] = [];
    acc[team].push(p);
    return acc;
  }, {});

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

          {personnelByTeam.direction && personnelByTeam.direction.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {personnelByTeam.direction.map((membre: any) => (
                <Card
                  key={membre.id}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-8 pb-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 relative">
                      {membre.photo_url ? (
                        <Image
                          src={membre.photo_url}
                          alt={membre.nom}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-3xl text-gray-400">👤</span>
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary" className="mb-2">
                      {membre.fonction}
                    </Badge>
                    <h3 className="text-lg font-semibold">{membre.nom}</h3>
                    {membre.departement && (
                      <p className="text-sm text-gray-500">
                        {membre.departement}
                      </p>
                    )}
                    {membre.bio && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {membre.bio}
                      </p>
                    )}
                    <div className="flex justify-center gap-3 mt-4">
                      {membre.email && (
                        <a
                          href={`mailto:${membre.email}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {membre.telephone && (
                        <a
                          href={`tel:${membre.telephone}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      {membre.linkedin && (
                        <a
                          href={membre.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Placeholder cards when no personnel in database */}
              {[
                {
                  titre: "Directeur Adjoint",
                  desc: "Coordination opérationnelle",
                },
                {
                  titre: "Chef Division Recouvrement",
                  desc: "Gestion des recouvrements",
                },
                {
                  titre: "Chef Division Contentieux",
                  desc: "Affaires juridiques",
                },
                {
                  titre: "Chef Division Admin",
                  desc: "Gestion administrative",
                },
                {
                  titre: "Chef Division Études",
                  desc: "Études et statistiques",
                },
                {
                  titre: "Secrétariat de Direction",
                  desc: "Support administratif",
                },
              ].map((poste, idx) => (
                <Card
                  key={idx}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-8 pb-6">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-3xl text-gray-400">👤</span>
                    </div>
                    <Badge variant="secondary" className="mb-2">
                      {poste.titre}
                    </Badge>
                    <h3 className="text-lg font-semibold">À nommer</h3>
                    <p className="text-sm text-gray-500">{poste.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Autres équipes */}
      {(personnelByTeam.division ||
        personnelByTeam.service ||
        personnelByTeam.antenne) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {personnelByTeam.division &&
              personnelByTeam.division.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
                    <Users className="h-6 w-6 text-primary-600" />
                    Chefs de Division
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
                    {personnelByTeam.division.map((membre: any) => (
                      <Card key={membre.id} className="text-center">
                        <CardContent className="py-6">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200 relative">
                            {membre.photo_url ? (
                              <Image
                                src={membre.photo_url}
                                alt={membre.nom}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-2xl text-gray-400">
                                👤
                              </div>
                            )}
                          </div>
                          <h4 className="font-medium">{membre.nom}</h4>
                          <p className="text-xs text-gray-500">
                            {membre.fonction}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

            {personnelByTeam.service && personnelByTeam.service.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-center mb-8">
                  Chefs de Service
                </h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
                  {personnelByTeam.service.map((membre: any) => (
                    <Card key={membre.id} className="text-center">
                      <CardContent className="py-4">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden bg-gray-200 relative">
                          {membre.photo_url ? (
                            <Image
                              src={membre.photo_url}
                              alt={membre.nom}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xl text-gray-400">
                              👤
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium text-sm">{membre.nom}</h4>
                        <p className="text-xs text-gray-500">
                          {membre.fonction}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {personnelByTeam.antenne && personnelByTeam.antenne.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-center mb-8">
                  Responsables d&apos;Antennes
                </h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                  {personnelByTeam.antenne.map((membre: any) => (
                    <Card key={membre.id} className="text-center">
                      <CardContent className="py-4">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden bg-gray-200 relative">
                          {membre.photo_url ? (
                            <Image
                              src={membre.photo_url}
                              alt={membre.nom}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xl text-gray-400">
                              👤
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium text-sm">{membre.nom}</h4>
                        <p className="text-xs text-gray-500">
                          {membre.fonction}
                        </p>
                        {membre.departement && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {membre.departement}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}
