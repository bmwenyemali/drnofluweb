import { Metadata } from "next";
import Link from "next/link";
import {
  Pickaxe,
  Leaf,
  Truck,
  Store,
  Building,
  FileText,
  ArrowRight,
  Calculator,
  ClipboardList,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TYPES_RECETTES } from "@/lib/config";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Découvrez les différents types de recettes non fiscales collectées par la DRNOFLU et les procédures associées.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Pickaxe,
  Leaf,
  Truck,
  Store,
  Building,
  FileText,
};

/**
 * Page Services - Types de recettes et procédures
 */
export default function ServicesPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Services
            </h1>
            <p className="text-xl text-primary-100">
              Types de recettes non fiscales et procédures de paiement
            </p>
          </div>
        </div>
      </section>

      {/* Types de recettes */}
      <section id="recettes" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary-100 text-primary-700">
              Catégories
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Types de Recettes Non Fiscales
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La DRNOFLU est chargée de la collecte de diverses recettes non
              fiscales couvrant plusieurs secteurs d&apos;activité économique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TYPES_RECETTES.map((recette) => {
              const Icon = iconMap[recette.icone] || FileText;
              return (
                <Card
                  key={recette.id}
                  className="hover:shadow-lg transition-all duration-300 group"
                  id={recette.id}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-600 transition-colors">
                        <Icon className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary-700 transition-colors">
                          {recette.nom}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{recette.description}</p>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Link href={`/services/${recette.id}`}>
                        En savoir plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* Procédures */}
      <section id="procedures" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary-100 text-secondary-700">
              Guide
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Procédures de Paiement</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Suivez ces étapes simples pour effectuer vos paiements
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Étape 1 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    1
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200" />
                </div>
                <ClipboardList className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                <h3 className="font-semibold mb-2">Identification</h3>
                <p className="text-sm text-gray-600">
                  Identifiez le type de recette applicable à votre activité
                </p>
              </div>

              {/* Étape 2 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    2
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200" />
                </div>
                <Calculator className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                <h3 className="font-semibold mb-2">Calcul</h3>
                <p className="text-sm text-gray-600">
                  Calculez le montant dû selon les barèmes en vigueur
                </p>
              </div>

              {/* Étape 3 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    3
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200" />
                </div>
                <CreditCard className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                <h3 className="font-semibold mb-2">Paiement</h3>
                <p className="text-sm text-gray-600">
                  Effectuez le paiement auprès des guichets agréés
                </p>
              </div>

              {/* Étape 4 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  4
                </div>
                <FileText className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                <h3 className="font-semibold mb-2">Reçu</h3>
                <p className="text-sm text-gray-600">
                  Conservez votre reçu comme preuve de paiement
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarification */}
      <section id="tarification" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-100 text-amber-700">Tarifs</Badge>
            <h2 className="text-3xl font-bold mb-4">Barèmes et Tarification</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Les tarifs sont fixés par arrêté provincial et varient selon le
              type de recette et l&apos;activité concernée.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-600 mb-6">
                  Pour consulter les barèmes détaillés, veuillez télécharger le
                  document officiel ou contacter nos services.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild>
                    <Link href="/juridique#baremes">
                      Consulter les barèmes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/contact">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Demander assistance
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions Fréquentes</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Quels sont les modes de paiement acceptés ?
                </AccordionTrigger>
                <AccordionContent>
                  La DRNOFLU accepte les paiements en espèces aux guichets
                  officiels, par virement bancaire sur le compte du Trésor
                  Provincial, et bientôt par mobile money.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Comment obtenir un reçu de paiement ?
                </AccordionTrigger>
                <AccordionContent>
                  Un reçu officiel est délivré automatiquement lors de chaque
                  paiement effectué. Ce reçu doit être conservé comme preuve de
                  paiement et peut être exigé lors des contrôles.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Que faire en cas de contestation ?
                </AccordionTrigger>
                <AccordionContent>
                  Toute contestation doit être adressée par écrit à la Division
                  Contentieux de la DRNOFLU dans un délai de 30 jours suivant la
                  notification. Un accusé de réception vous sera délivré.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Y a-t-il des pénalités de retard ?
                </AccordionTrigger>
                <AccordionContent>
                  Oui, des pénalités sont appliquées en cas de retard de
                  paiement conformément à la réglementation en vigueur. Il est
                  recommandé d&apos;effectuer les paiements dans les délais
                  prescrits.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
