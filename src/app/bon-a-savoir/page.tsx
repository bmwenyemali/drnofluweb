import { Metadata } from "next";
import Link from "next/link";
import {
  Lightbulb,
  AlertCircle,
  HelpCircle,
  Info,
  Search,
  ChevronRight,
  Calculator,
  FileQuestion,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Bon à Savoir",
  description:
    "Centre d'information - Conseils, astuces et réponses à vos questions sur les recettes non fiscales.",
};

// Données statiques
const infos = [
  {
    id: 1,
    titre: "Droit au reçu",
    contenu:
      "Tout contribuable a le droit d'exiger un reçu officiel pour chaque paiement effectué. Ce reçu est la seule preuve valable de votre paiement.",
    type: "info" as const,
    icone: Info,
  },
  {
    id: 2,
    titre: "Délais de déclaration",
    contenu:
      "Les déclarations doivent être effectuées avant le 15 de chaque mois pour éviter les pénalités de retard. Planifiez vos démarches à l'avance.",
    type: "astuce" as const,
    icone: Lightbulb,
  },
  {
    id: 3,
    titre: "Financement des projets",
    contenu:
      "Les recettes non fiscales collectées financent directement les projets d'infrastructure, d'éducation et de santé dans la province du Lualaba.",
    type: "info" as const,
    icone: Info,
  },
  {
    id: 4,
    titre: "Nouveaux barèmes",
    contenu:
      "Les nouveaux barèmes 2026 sont en vigueur depuis le 1er janvier. Consultez la section Cadre Juridique pour les détails.",
    type: "alerte" as const,
    icone: AlertCircle,
  },
  {
    id: 5,
    titre: "Services en ligne",
    contenu:
      "Bientôt disponible : effectuez vos déclarations et paiements en ligne via notre portail numérique.",
    type: "info" as const,
    icone: Info,
  },
  {
    id: 6,
    titre: "Assistance gratuite",
    contenu:
      "Nos agents sont disponibles pour vous accompagner gratuitement dans vos démarches. N'hésitez pas à nous contacter.",
    type: "astuce" as const,
    icone: Lightbulb,
  },
];

const faq = [
  {
    question: "Qu'est-ce qu'une recette non fiscale ?",
    reponse:
      "Les recettes non fiscales sont des revenus perçus par l'État ou les entités territoriales décentralisées en contrepartie de services rendus, de l'exploitation de ressources naturelles, ou de diverses autorisations administratives. Contrairement aux impôts, elles sont généralement liées à une prestation spécifique.",
  },
  {
    question: "Qui doit payer les recettes non fiscales ?",
    reponse:
      "Toute personne physique ou morale exerçant une activité économique soumise à contribution, les exploitants miniers, les entreprises de transport, les commerçants, et toute entité bénéficiant de services publics provinciaux sont redevables des recettes non fiscales.",
  },
  {
    question: "Comment calculer le montant de ma contribution ?",
    reponse:
      "Le montant dépend du type d'activité et des barèmes en vigueur. Vous pouvez consulter les barèmes officiels sur notre site ou contacter nos services pour obtenir une estimation personnalisée.",
  },
  {
    question: "Où puis-je effectuer mes paiements ?",
    reponse:
      "Les paiements peuvent être effectués aux guichets officiels de la DRNOFLU, dans les agences bancaires partenaires, ou bientôt via notre plateforme en ligne. Assurez-vous de toujours obtenir un reçu officiel.",
  },
  {
    question: "Que faire en cas de litige ?",
    reponse:
      "En cas de litige, vous pouvez adresser une réclamation écrite à la Division Contentieux de la DRNOFLU dans un délai de 30 jours. Votre dossier sera examiné et vous recevrez une réponse dans les meilleurs délais.",
  },
  {
    question: "Les paiements sont-ils déductibles ?",
    reponse:
      "Certaines contributions peuvent être déductibles fiscalement selon la réglementation en vigueur. Nous vous recommandons de consulter un expert-comptable ou nos services pour plus de précisions.",
  },
  {
    question: "Comment obtenir une attestation de paiement ?",
    reponse:
      "Vous pouvez demander une attestation de paiement auprès de nos guichets en présentant vos reçus de paiement. Ce document peut être requis pour certaines démarches administratives.",
  },
  {
    question: "Y a-t-il des exonérations possibles ?",
    reponse:
      "Certaines exonérations peuvent s'appliquer dans des cas spécifiques prévus par la loi. Contactez nos services avec votre dossier pour évaluer votre éligibilité.",
  },
];

const typeConfig = {
  info: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    bgCard: "border-l-4 border-l-blue-500",
  },
  astuce: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    bgCard: "border-l-4 border-l-yellow-500",
  },
  alerte: {
    color: "bg-orange-100 text-orange-700 border-orange-200",
    bgCard: "border-l-4 border-l-orange-500",
  },
  question: {
    color: "bg-purple-100 text-purple-700 border-purple-200",
    bgCard: "border-l-4 border-l-purple-500",
  },
};

/**
 * Page Bon à Savoir - Centre d'information
 */
export default function BonASavoirPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-yellow-600 to-amber-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-10 w-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Bon à Savoir</h1>
            </div>
            <p className="text-xl text-yellow-100">
              Centre d&apos;information - Conseils, astuces et réponses à vos
              questions
            </p>
          </div>
        </div>
      </section>

      {/* Recherche */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher une information..."
                className="pl-12 py-6 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="infos" className="w-full">
            <TabsList className="mb-8 flex justify-center">
              <TabsTrigger value="infos" className="gap-2">
                <Bell className="h-4 w-4" />
                Informations
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-2" id="faq">
                <FileQuestion className="h-4 w-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="calculateur" className="gap-2">
                <Calculator className="h-4 w-4" />
                Simulateur
              </TabsTrigger>
            </TabsList>

            {/* Onglet Informations */}
            <TabsContent value="infos">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {infos.map((info) => {
                  const Icon = info.icone;
                  const config = typeConfig[info.type];
                  return (
                    <Card
                      key={info.id}
                      className={`hover:shadow-lg transition-shadow ${config.bgCard}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${config.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className={config.color}>
                            {info.type === "info" && "Information"}
                            {info.type === "astuce" && "Astuce"}
                            {info.type === "alerte" && "Important"}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                          {info.titre}
                        </h3>
                        <p className="text-gray-600">{info.contenu}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Encart "Le saviez-vous" */}
              <div className="mt-12">
                <Card className="bg-gradient-to-r from-primary-50 to-white border-primary-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary-600" />
                      Le saviez-vous ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">
                          La province du Lualaba est l&apos;une des principales
                          productrices de cuivre et de cobalt en RDC, ce qui
                          génère d&apos;importantes recettes non fiscales.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">
                          Les recettes collectées par la DRNOFLU financent des
                          projets essentiels comme la construction
                          d&apos;écoles, d&apos;hôpitaux et de routes dans toute
                          la province.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">
                          Contribuer régulièrement vous permet d&apos;exercer
                          votre activité en toute légalité et de bénéficier
                          d&apos;une protection juridique.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">
                          La transparence est au cœur de notre action : tous les
                          barèmes et textes officiels sont accessibles
                          publiquement.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet FAQ */}
            <TabsContent value="faq">
              <div className="max-w-3xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Questions Fréquemment Posées
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {faq.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {item.reponse}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>

                <Card className="mt-6 bg-gray-100">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600 mb-4">
                      Vous avez une autre question ?
                    </p>
                    <Button asChild>
                      <Link href="/contact">
                        Contactez-nous
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Simulateur */}
            <TabsContent value="calculateur">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Simulateur de Contribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Calculator className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Bientôt disponible
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Notre simulateur de contribution sera bientôt en ligne
                        pour vous permettre d&apos;estimer le montant de vos
                        obligations.
                      </p>
                      <Button asChild variant="outline">
                        <Link href="/contact">
                          Demander une estimation personnalisée
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Alertes importantes */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-full flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Rappel Important
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Les déclarations du premier trimestre 2026 doivent être
                      effectuées avant le 15 mars 2026. Évitez les pénalités en
                      régularisant votre situation dans les délais.
                    </p>
                    <Button asChild>
                      <Link href="/services#procedures">
                        Voir les procédures
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
