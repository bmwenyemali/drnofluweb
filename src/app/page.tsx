import {
  HeroSection,
  ChiffresClesSection,
  ServicesSection,
  SidebarSection,
  BonASavoirSection,
  CTASection,
} from "@/components/sections";

/**
 * Page d'accueil du site DRNOFLU
 * Présentation institutionnelle avec sections principales
 */
export default function HomePage() {
  return (
    <>
      {/* Section Hero avec image du bâtiment */}
      <HeroSection />

      {/* Chiffres clés animés */}
      <ChiffresClesSection />

      {/* Présentation des services/types de recettes */}
      <ServicesSection />

      {/* Section actualités + sidebar avec direction */}
      <SidebarSection />

      {/* Section Bon à Savoir */}
      <BonASavoirSection />

      {/* Call to Action / Contact */}
      <CTASection />
    </>
  );
}
