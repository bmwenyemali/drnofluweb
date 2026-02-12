"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Facebook,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SITE_CONFIG } from "@/lib/config";

// Import dynamique pour éviter les erreurs SSR avec Mapbox
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

/**
 * Page Contact - Formulaire et coordonnées
 */
export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-primary-100">
              Notre équipe est à votre disposition pour répondre à vos questions
            </p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Envoyez-nous un message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Message envoyé !
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Nous avons bien reçu votre message et vous répondrons
                        dans les plus brefs délais.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>
                        Envoyer un autre message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nom">Nom complet *</Label>
                          <Input
                            id="nom"
                            name="nom"
                            placeholder="Votre nom"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="votre@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="telephone">Téléphone</Label>
                          <Input
                            id="telephone"
                            name="telephone"
                            type="tel"
                            placeholder="+243 XXX XXX XXX"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sujet">Sujet *</Label>
                          <Select name="sujet" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un sujet" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="information">
                                Demande d&apos;information
                              </SelectItem>
                              <SelectItem value="declaration">
                                Aide à la déclaration
                              </SelectItem>
                              <SelectItem value="paiement">
                                Question sur un paiement
                              </SelectItem>
                              <SelectItem value="reclamation">
                                Réclamation
                              </SelectItem>
                              <SelectItem value="partenariat">
                                Partenariat
                              </SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Décrivez votre demande..."
                          rows={6}
                          required
                        />
                      </div>

                      <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-100 p-4 rounded-lg">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <p>
                          Vos données personnelles sont traitées conformément à
                          notre politique de confidentialité et ne seront
                          utilisées que pour répondre à votre demande.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Envoi en cours..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Informations de contact */}
            <div className="space-y-6">
              {/* Coordonnées */}
              <Card>
                <CardHeader>
                  <CardTitle>Nos Coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-sm text-gray-600">
                        {SITE_CONFIG.adresse.rue}
                        <br />
                        {SITE_CONFIG.adresse.commune}
                        <br />
                        {SITE_CONFIG.adresse.ville},{" "}
                        {SITE_CONFIG.adresse.province}
                        <br />
                        {SITE_CONFIG.adresse.pays}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Phone className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <a
                        href={`tel:${SITE_CONFIG.telephone}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        {SITE_CONFIG.telephone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Mail className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        {SITE_CONFIG.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Clock className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">Heures d&apos;ouverture</p>
                      <p className="text-sm text-gray-600">
                        Lundi - Vendredi: 8h00 - 16h00
                        <br />
                        Samedi: 8h00 - 12h00
                        <br />
                        Dimanche: Fermé
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Urgences */}
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Urgences
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Pour les questions urgentes concernant les délais de
                    paiement ou les procédures en cours.
                  </p>
                  <p className="font-medium text-orange-700">
                    Ligne directe: {SITE_CONFIG.telephone}
                  </p>
                </CardContent>
              </Card>

              {/* Réseaux sociaux */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-4">Suivez-nous</h3>
                  <div className="flex gap-3">
                    <a
                      href={SITE_CONFIG.reseauxSociaux.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-sm font-medium text-blue-700">
                        Facebook
                      </span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Carte Mapbox */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Notre Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <MapView
                showSiege={true}
                height="400px"
                className="rounded-b-lg"
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
