import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  ExternalLink,
  Settings,
} from "lucide-react";
import { SITE_CONFIG, MAIN_NAV } from "@/lib/config";
import { Separator } from "@/components/ui/separator";

/**
 * Footer du site DRNOFLU
 * Contient les liens, coordonnées et informations légales
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Section principale */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Colonne 1: À propos */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo1.png"
                alt="Logo DRNOFLU"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <div>
                <h2 className="text-lg font-bold">DRNOFLU</h2>
                <p className="text-xs text-gray-400">
                  Direction des Recettes Non Fiscales
                </p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              La Direction des Recettes Non Fiscales du Lualaba est
              l&apos;institution provinciale chargée de la collecte et de la
              gestion des recettes non fiscales pour le développement de la
              province.
            </p>
            {/* Réseaux sociaux */}
            <div className="flex gap-3">
              <a
                href={SITE_CONFIG.reseauxSociaux.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors flex items-center gap-2"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
                <span className="text-sm">Suivez-nous</span>
              </a>
            </div>
          </div>

          {/* Colonne 2: Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              {MAIN_NAV.slice(0, 7).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services#minier"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Secteur Minier
                </Link>
              </li>
              <li>
                <Link
                  href="/services#environnement"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Environnement
                </Link>
              </li>
              <li>
                <Link
                  href="/services#transport"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Transport
                </Link>
              </li>
              <li>
                <Link
                  href="/services#commerce"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Commerce
                </Link>
              </li>
              <li>
                <Link
                  href="/juridique"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cadre Juridique
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  {SITE_CONFIG.adresse.rue}
                  <br />
                  {SITE_CONFIG.adresse.commune}
                  <br />
                  {SITE_CONFIG.adresse.ville}, {SITE_CONFIG.adresse.province}
                  <br />
                  {SITE_CONFIG.adresse.pays}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a
                  href={`tel:${SITE_CONFIG.telephone}`}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  {SITE_CONFIG.telephone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Séparateur */}
      <Separator className="bg-gray-800" />

      {/* Section inférieure */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {currentYear} {SITE_CONFIG.fullName}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link
              href="/admin"
              className="hover:text-white flex items-center gap-1"
            >
              <Settings className="h-3 w-3" />
              Administration
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/mentions-legales" className="hover:text-white">
              Mentions légales
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/confidentialite" className="hover:text-white">
              Politique de confidentialité
            </Link>
            <span className="text-gray-600">|</span>
            <a
              href="https://www.akilig.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-400 flex items-center gap-1"
            >
              Développé par AKILI Group
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
