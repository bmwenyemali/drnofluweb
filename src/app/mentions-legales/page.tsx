"use client";

import { FileText, Building2, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@/lib/config";

/**
 * Page Mentions Légales
 */
export default function MentionsLegalesPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mentions Légales
            </h1>
            <p className="text-xl text-primary-100">
              Informations légales concernant le site DRNOFLU
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Éditeur du site */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Éditeur du site
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Dénomination</h3>
                    <p className="text-gray-600">{SITE_CONFIG.fullName}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      ({SITE_CONFIG.name})
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Nature juridique</h3>
                    <p className="text-gray-600">
                      Service public provincial de la République Démocratique du
                      Congo
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold">Coordonnées</h3>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>
                      {SITE_CONFIG.adresse.rue}, {SITE_CONFIG.adresse.commune},{" "}
                      {SITE_CONFIG.adresse.ville},{" "}
                      {SITE_CONFIG.adresse.province}, {SITE_CONFIG.adresse.pays}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span>{SITE_CONFIG.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-5 w-5" />
                    <span>{SITE_CONFIG.email}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">
                    Directeur de la publication
                  </h3>
                  <p className="text-gray-600">
                    Le Directeur Provincial des Recettes Non Fiscales du Lualaba
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hébergement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Hébergement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Hébergeur</h3>
                  <p className="text-gray-600">
                    Vercel Inc.
                    <br />
                    340 S Lemon Ave #4133
                    <br />
                    Walnut, CA 91789, États-Unis
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Propriété intellectuelle */}
            <Card>
              <CardHeader>
                <CardTitle>Propriété intellectuelle</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  L&apos;ensemble de ce site relève de la législation congolaise
                  et internationale sur le droit d&apos;auteur et la propriété
                  intellectuelle. Tous les droits de reproduction sont réservés,
                  y compris pour les documents téléchargeables et les
                  représentations iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support
                  électronique quel qu&apos;il soit est formellement interdite
                  sauf autorisation écrite expresse du Directeur Provincial.
                </p>
                <p>
                  Les marques et logos figurant sur ce site sont des marques
                  déposées. Toute reproduction totale ou partielle de ces
                  marques ou logos, effectuée à partir des éléments du site sans
                  l&apos;autorisation expresse de la DRNOFLU est prohibée.
                </p>
              </CardContent>
            </Card>

            {/* Responsabilité */}
            <Card>
              <CardHeader>
                <CardTitle>Limitation de responsabilité</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Les informations diffusées sur ce site sont présentées à titre
                  informatif et n&apos;ont pas de valeur contractuelle. Malgré
                  tous les soins apportés à la mise à jour régulière du contenu
                  de ce site, la DRNOFLU décline toute responsabilité quant aux
                  erreurs, omissions ou résultats qui pourraient être obtenus
                  par un mauvais usage de ces informations.
                </p>
                <p>
                  La DRNOFLU se réserve le droit de modifier, sans préavis, le
                  contenu de ce site et décline toute responsabilité en cas de
                  retard, d&apos;erreur ou d&apos;omission quant au contenu de
                  ces pages ainsi qu&apos;en cas d&apos;interruption ou
                  d&apos;indisponibilité du service.
                </p>
              </CardContent>
            </Card>

            {/* Liens hypertextes */}
            <Card>
              <CardHeader>
                <CardTitle>Liens hypertextes</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  La création de liens hypertextes vers le site drnoflu.gouv.cd
                  est soumise à l&apos;accord préalable du Directeur Provincial.
                  Les liens hypertextes établis en direction d&apos;autres sites
                  à partir de drnoflu.gouv.cd ne sauraient, en aucun cas,
                  engager la responsabilité de la DRNOFLU.
                </p>
              </CardContent>
            </Card>

            {/* Crédits */}
            <Card>
              <CardHeader>
                <CardTitle>Crédits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    Conception et développement
                  </h3>
                  <p className="text-gray-600">
                    Cellule Communication - DRNOFLU
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Technologies utilisées</h3>
                  <p className="text-gray-600">
                    Next.js, React, Tailwind CSS, Supabase
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Date de mise à jour */}
            <div className="text-center text-gray-500 text-sm">
              <p>Dernière mise à jour : Février 2026</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
