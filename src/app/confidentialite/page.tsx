"use client";

import {
  Shield,
  Cookie,
  Database,
  Lock,
  Eye,
  UserCheck,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/config";

/**
 * Page Politique de Confidentialité
 */
export default function ConfidentialitePage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-primary-100">
              Protection de vos données personnelles
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  La Direction des Recettes Non Fiscales du Lualaba (DRNOFLU)
                  s&apos;engage à protéger la vie privée des utilisateurs de son
                  site internet. Cette politique de confidentialité explique
                  comment nous collectons, utilisons, stockons et protégeons vos
                  informations personnelles.
                </p>
                <p>
                  En utilisant notre site, vous acceptez les pratiques décrites
                  dans cette politique de confidentialité.
                </p>
              </CardContent>
            </Card>

            {/* Données collectées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Données collectées
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h3>Données fournies volontairement</h3>
                <p>
                  Nous collectons les informations que vous nous fournissez
                  directement :
                </p>
                <ul>
                  <li>
                    <strong>Formulaire de contact :</strong> nom, adresse email,
                    numéro de téléphone (optionnel), sujet et contenu du message
                  </li>
                  <li>
                    <strong>Simulations de taxes :</strong> données relatives
                    aux calculs effectués (anonymes par défaut)
                  </li>
                </ul>

                <h3>Données collectées automatiquement</h3>
                <p>
                  Lors de votre navigation, nous pouvons collecter
                  automatiquement certaines informations techniques :
                </p>
                <ul>
                  <li>Adresse IP (anonymisée)</li>
                  <li>Type de navigateur et version</li>
                  <li>Système d&apos;exploitation</li>
                  <li>Pages visitées et temps passé</li>
                  <li>Date et heure de connexion</li>
                </ul>
              </CardContent>
            </Card>

            {/* Utilisation des données */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Utilisation des données
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>Vos données personnelles sont utilisées pour :</p>
                <ul>
                  <li>Répondre à vos demandes de contact et questions</li>
                  <li>Vous fournir les informations et services demandés</li>
                  <li>Améliorer notre site et nos services</li>
                  <li>Établir des statistiques anonymes de fréquentation</li>
                  <li>Assurer la sécurité et le bon fonctionnement du site</li>
                </ul>
                <p>
                  Nous ne vendons, n&apos;échangeons ni ne louons vos
                  informations personnelles à des tiers à des fins commerciales.
                </p>
              </CardContent>
            </Card>

            {/* Protection des données */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Protection des données
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Nous mettons en œuvre des mesures de sécurité appropriées pour
                  protéger vos données personnelles contre tout accès non
                  autorisé, modification, divulgation ou destruction :
                </p>
                <ul>
                  <li>Chiffrement des données en transit (HTTPS/SSL)</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Sauvegarde régulière des données</li>
                  <li>Surveillance continue des systèmes</li>
                  <li>Hébergement sécurisé (Supabase/Vercel)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Notre site utilise des cookies essentiels au bon
                  fonctionnement du site :
                </p>
                <ul>
                  <li>
                    <strong>Cookies de session :</strong> nécessaires pour
                    maintenir votre session de navigation
                  </li>
                  <li>
                    <strong>Cookies d&apos;authentification :</strong> pour
                    l&apos;accès aux espaces sécurisés (administration)
                  </li>
                  <li>
                    <strong>Cookies de préférences :</strong> pour mémoriser vos
                    choix (langue, affichage)
                  </li>
                </ul>
                <p>
                  Vous pouvez configurer votre navigateur pour refuser les
                  cookies, mais certaines fonctionnalités du site pourraient ne
                  plus fonctionner correctement.
                </p>
              </CardContent>
            </Card>

            {/* Droits des utilisateurs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Vos droits
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Conformément aux lois applicables, vous disposez des droits
                  suivants concernant vos données personnelles :
                </p>
                <ul>
                  <li>
                    <strong>Droit d&apos;accès :</strong> obtenir une copie de
                    vos données personnelles
                  </li>
                  <li>
                    <strong>Droit de rectification :</strong> demander la
                    correction de données inexactes
                  </li>
                  <li>
                    <strong>Droit à l&apos;effacement :</strong> demander la
                    suppression de vos données
                  </li>
                  <li>
                    <strong>Droit d&apos;opposition :</strong> vous opposer au
                    traitement de vos données
                  </li>
                  <li>
                    <strong>Droit à la portabilité :</strong> recevoir vos
                    données dans un format structuré
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Conservation des données */}
            <Card>
              <CardHeader>
                <CardTitle>Conservation des données</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Vos données personnelles sont conservées pendant la durée
                  nécessaire aux finalités pour lesquelles elles ont été
                  collectées :
                </p>
                <ul>
                  <li>
                    <strong>Messages de contact :</strong> 2 ans après le
                    dernier échange
                  </li>
                  <li>
                    <strong>Données de navigation :</strong> 13 mois maximum
                  </li>
                  <li>
                    <strong>Données de simulation :</strong> 1 an (anonymisées)
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Nous contacter
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Pour toute question concernant cette politique de
                  confidentialité ou pour exercer vos droits, vous pouvez nous
                  contacter :
                </p>
                <ul>
                  <li>
                    Par email :{" "}
                    <a href={`mailto:${SITE_CONFIG.email}`}>
                      {SITE_CONFIG.email}
                    </a>
                  </li>
                  <li>Par téléphone : {SITE_CONFIG.telephone}</li>
                  <li>
                    Par courrier : {SITE_CONFIG.adresse.rue},{" "}
                    {SITE_CONFIG.adresse.ville}, {SITE_CONFIG.adresse.province}
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card>
              <CardHeader>
                <CardTitle>Modifications de la politique</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Nous nous réservons le droit de modifier cette politique de
                  confidentialité à tout moment. Les modifications seront
                  publiées sur cette page avec une date de mise à jour. Nous
                  vous encourageons à consulter régulièrement cette page pour
                  rester informé de nos pratiques en matière de protection des
                  données.
                </p>
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
