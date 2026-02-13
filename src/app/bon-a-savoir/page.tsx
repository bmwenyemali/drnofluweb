"use client";

import { useState, useEffect, useMemo } from "react";
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
  Filter,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createBrowserClient } from "@/lib/supabase";
import { BonASavoirItem, BaremeSimulation } from "@/lib/types";

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
  information: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    bgCard: "border-l-4 border-l-blue-500",
    icon: Info,
    label: "Information",
  },
  astuce: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    bgCard: "border-l-4 border-l-yellow-500",
    icon: Lightbulb,
    label: "Astuce",
  },
  important: {
    color: "bg-red-100 text-red-700 border-red-200",
    bgCard: "border-l-4 border-l-red-500",
    icon: AlertCircle,
    label: "Important",
  },
};

const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "Tous les types" },
  { value: "astuce", label: "Astuces" },
  { value: "information", label: "Informations" },
  { value: "important", label: "Important" },
];

/**
 * Page Bon à Savoir - Centre d'information
 */
export default function BonASavoirPage() {
  const [items, setItems] = useState<BonASavoirItem[]>([]);
  const [baremes, setBaremes] = useState<BaremeSimulation[]>([]);
  const [tauxChange, setTauxChange] = useState<number>(2850);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Simulator state
  const [selectedBareme, setSelectedBareme] = useState<string>("");
  const [montantBase, setMontantBase] = useState<string>("");
  const [resultat, setResultat] = useState<{ usd: number; fc: number } | null>(
    null,
  );
  const [simulating, setSimulating] = useState(false);

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch bon à savoir items
    const { data: itemsData } = await supabase
      .from("bon_a_savoir")
      .select("*")
      .eq("publie", true)
      .order("ordre", { ascending: true });

    if (itemsData) {
      setItems(itemsData);
    }

    // Fetch baremes for simulator
    const { data: baremesData } = await supabase
      .from("baremes_simulation")
      .select("*")
      .eq("actif", true)
      .order("categorie", { ascending: true })
      .order("description", { ascending: true });

    if (baremesData) {
      setBaremes(baremesData);
    }

    // Fetch exchange rate
    const { data: tauxData } = await supabase
      .from("parametres")
      .select("*")
      .eq("cle", "taux_change_usd_fc")
      .single();

    if (tauxData) {
      setTauxChange(parseFloat(tauxData.valeur));
    }

    setLoading(false);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contenu.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [items, searchQuery, filterType]);

  const handleSimulation = async () => {
    if (!selectedBareme || !montantBase) return;

    setSimulating(true);
    const bareme = baremes.find((b) => b.id === selectedBareme);

    if (!bareme) {
      setSimulating(false);
      return;
    }

    let montantUSD = 0;
    const base = parseFloat(montantBase);

    if (bareme.taux_pourcentage) {
      montantUSD = base * (bareme.taux_pourcentage / 100);
    } else if (bareme.montant_fixe) {
      montantUSD = bareme.montant_fixe;
    }

    const montantFC = montantUSD * tauxChange;

    // Record simulation
    await supabase.from("simulations").insert({
      type_taxe: bareme.description,
      donnees_formulaire: {
        bareme_id: bareme.id,
        montant_base: base,
        categorie: bareme.categorie,
      },
      resultat_usd: montantUSD,
      resultat_fc: montantFC,
      taux_change: tauxChange,
    });

    setResultat({ usd: montantUSD, fc: montantFC });
    setSimulating(false);
  };

  // Group baremes by category
  const baremesGrouped = baremes.reduce(
    (acc, bareme) => {
      const cat = bareme.categorie;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(bareme);
      return acc;
    },
    {} as Record<string, BaremeSimulation[]>,
  );
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

      {/* Recherche et filtre */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher une information..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[200px] h-[52px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <Card className="p-8 text-center">
                  <Info className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    {searchQuery || filterType !== "all"
                      ? "Aucun résultat trouvé pour votre recherche."
                      : "Aucune information disponible pour le moment."}
                  </p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => {
                    const config =
                      typeConfig[item.type as keyof typeof typeConfig] ||
                      typeConfig.information;
                    const Icon = config.icon;
                    return (
                      <Card
                        key={item.id}
                        className={`hover:shadow-lg transition-shadow ${config.bgCard}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${config.color}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <Badge variant="outline" className={config.color}>
                              {config.label}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">
                            {item.titre}
                          </h3>
                          <p className="text-gray-600">{item.contenu}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

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
                  <CardContent className="space-y-6">
                    <p className="text-gray-600">
                      Estimez le montant de votre contribution en sélectionnant
                      le type de taxe et en indiquant le montant de base.
                    </p>

                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : baremes.length === 0 ? (
                      <div className="text-center py-8">
                        <Calculator className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">
                          Le simulateur sera bientôt disponible.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="bareme">Type de contribution</Label>
                            <Select
                              value={selectedBareme}
                              onValueChange={setSelectedBareme}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une taxe..." />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(baremesGrouped).map(
                                  ([categorie, items]) => (
                                    <div key={categorie}>
                                      <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-100">
                                        {categorie}
                                      </div>
                                      {items.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                          {b.description}
                                          {b.taux_pourcentage
                                            ? ` (${b.taux_pourcentage}%)`
                                            : ""}
                                          {b.montant_fixe
                                            ? ` (${b.montant_fixe} USD)`
                                            : ""}
                                        </SelectItem>
                                      ))}
                                    </div>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="montant">
                              Montant de base (USD)
                            </Label>
                            <Input
                              id="montant"
                              type="number"
                              placeholder="Ex: 10000"
                              value={montantBase}
                              onChange={(e) => setMontantBase(e.target.value)}
                              min="0"
                              step="0.01"
                            />
                            <p className="text-xs text-gray-500">
                              Entrez le montant sur lequel appliquer la taxe
                            </p>
                          </div>

                          <Button
                            onClick={handleSimulation}
                            disabled={
                              !selectedBareme || !montantBase || simulating
                            }
                            className="w-full"
                          >
                            {simulating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Calcul en cours...
                              </>
                            ) : (
                              <>
                                <Calculator className="mr-2 h-4 w-4" />
                                Calculer
                              </>
                            )}
                          </Button>
                        </div>

                        {resultat && (
                          <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-6">
                              <h3 className="font-semibold text-lg mb-4 text-green-800">
                                Résultat de la simulation
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-lg border">
                                  <p className="text-sm text-gray-500">
                                    Montant en USD
                                  </p>
                                  <p className="text-2xl font-bold text-green-700">
                                    {resultat.usd.toLocaleString("fr-FR", {
                                      style: "currency",
                                      currency: "USD",
                                    })}
                                  </p>
                                </div>
                                <div className="p-4 bg-white rounded-lg border">
                                  <p className="text-sm text-gray-500">
                                    Montant en FC
                                  </p>
                                  <p className="text-2xl font-bold text-green-700">
                                    {resultat.fc.toLocaleString("fr-FR")} FC
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-4">
                                Taux de change appliqué : 1 USD ={" "}
                                {tauxChange.toLocaleString()} FC
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Note : Ce calcul est indicatif. Le montant final
                                peut varier selon votre situation.
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}

                    <Card className="bg-gray-100">
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-600 mb-4">
                          Besoin d&apos;une estimation personnalisée ?
                        </p>
                        <Button asChild variant="outline">
                          <Link href="/contact">Contactez nos services</Link>
                        </Button>
                      </CardContent>
                    </Card>
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
