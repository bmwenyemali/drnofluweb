import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Pickaxe,
  Leaf,
  Truck,
  Store,
  Building,
  FileText,
  ArrowLeft,
  CheckCircle,
  FileCheck,
  ClipboardList,
  HelpCircle,
  ArrowRight,
  Wheat,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TYPES_RECETTES } from "@/lib/config";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Pickaxe,
  Leaf,
  Truck,
  Store,
  Building,
  FileText,
  Wheat,
  Heart,
};

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const service = TYPES_RECETTES.find((s) => s.id === id);

  if (!service) {
    return {
      title: "Service non trouvé",
    };
  }

  return {
    title: service.nom,
    description: service.description,
  };
}

export async function generateStaticParams() {
  return TYPES_RECETTES.map((service) => ({
    id: service.id,
  }));
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = TYPES_RECETTES.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.icone] || FileText;
  const details = service.details;

  // Get other services for recommendations
  const otherServices = TYPES_RECETTES.filter((s) => s.id !== id).slice(0, 3);

  return (
    <>
      {/* Hero Banner with Image */}
      <section className="relative bg-gradient-to-br from-primary-900 to-primary-800 text-white">
        {/* Background Image */}
        {service.image && (
          <div className="absolute inset-0">
            <Image
              src={service.image}
              alt={service.nom}
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/70" />
          </div>
        )}

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link
              href="/services"
              className="inline-flex items-center text-primary-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux services
            </Link>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <Icon className="h-10 w-10 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                Recettes Non Fiscales
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {service.nom}
            </h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      {details && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">
                {details.intro}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      {details && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Obligations */}
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ClipboardList className="h-5 w-5 text-primary-600" />
                      Obligations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {details.obligations.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Procédures */}
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileCheck className="h-5 w-5 text-primary-600" />
                      Procédures
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {details.procedures.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-medium shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Documents requis */}
                <Card className="h-full md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-primary-600" />
                      Documents Requis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {details.documents.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary-600 shrink-0 mt-2" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Image Section */}
      {service.image && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={service.image}
                  alt={service.nom}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Besoin d&apos;assistance ?
            </h2>
            <p className="text-gray-600 mb-6">
              Notre équipe est disponible pour vous accompagner dans vos
              démarches relatives aux recettes non fiscales.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Nous contacter
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/juridique">
                  Consulter les textes légaux
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Other Services */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Autres Types de Recettes
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {otherServices.map((otherService) => {
              const OtherIcon = iconMap[otherService.icone] || FileText;
              return (
                <Card
                  key={otherService.id}
                  className="hover:shadow-lg transition-shadow group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-600 transition-colors">
                        <OtherIcon className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-semibold group-hover:text-primary-700 transition-colors">
                        {otherService.nom}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {otherService.description}
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Link href={`/services/${otherService.id}`}>
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
    </>
  );
}
