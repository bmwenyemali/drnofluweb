import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Tag,
  Clock,
  ChevronRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES_ACTUALITES } from "@/lib/config";
import { Actualite } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getActualite(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("actualites")
    .select(
      `
      *,
      auteur:profiles(nom_complet, avatar_url)
    `,
    )
    .eq("slug", slug)
    .eq("publie", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Actualite;
}

async function getRelatedActualites(
  currentId: string,
  categorie: string,
  limit: number = 3,
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("actualites")
    .select("id, titre, slug, image_url, date_publication, extrait")
    .eq("publie", true)
    .eq("categorie", categorie)
    .neq("id", currentId)
    .order("date_publication", { ascending: false })
    .limit(limit);

  return data || [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const actualite = await getActualite(slug);

  if (!actualite) {
    return {
      title: "Actualité non trouvée",
    };
  }

  return {
    title: actualite.titre,
    description: actualite.extrait,
    openGraph: {
      title: actualite.titre,
      description: actualite.extrait,
      images: actualite.image_url ? [actualite.image_url] : [],
    },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCategorieLabel(id: string) {
  return CATEGORIES_ACTUALITES.find((c) => c.id === id)?.label || id;
}

function getCategorieColor(id: string) {
  const colors: Record<string, string> = {
    communique: "bg-blue-100 text-blue-800",
    rapport: "bg-purple-100 text-purple-800",
    evenement: "bg-green-100 text-green-800",
    annonce: "bg-orange-100 text-orange-800",
    general: "bg-gray-100 text-gray-800",
  };
  return colors[id] || colors.general;
}

function extractYoutubeId(url: string): string | null {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

// Simple markdown to HTML (same as RichTextEditor)
function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>',
    )
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary-600 hover:underline" target="_blank" rel="noopener">$1</a>',
    )
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="rounded-lg my-6 max-w-full" />',
    )
    .replace(
      /^&gt; (.*$)/gim,
      '<blockquote class="border-l-4 border-primary-500 pl-4 my-4 italic text-gray-600">$1</blockquote>',
    )
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, "<br />");

  return `<p class="mb-4">${html}</p>`;
}

export default async function ActualiteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const actualite = await getActualite(slug);

  if (!actualite) {
    notFound();
  }

  const relatedActualites = await getRelatedActualites(
    actualite.id,
    actualite.categorie,
  );

  const readTime = Math.max(
    1,
    Math.ceil(actualite.contenu.split(" ").length / 200),
  );

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        {actualite.image_url ? (
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src={actualite.image_url}
              alt={actualite.titre}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        ) : (
          <div className="h-[300px] bg-gradient-to-br from-primary-900 to-primary-800" />
        )}

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Badge className={getCategorieColor(actualite.categorie)}>
                <Tag className="mr-1 h-3 w-3" />
                {getCategorieLabel(actualite.categorie)}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">
                {actualite.titre}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(
                      actualite.date_publication || actualite.created_at,
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readTime} min de lecture</span>
                </div>
                {actualite.auteur && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{actualite.auteur.nom_complet}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb & Back */}
      <section className="py-4 border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center text-sm text-gray-500">
              <Link href="/" className="hover:text-primary-600">
                Accueil
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/actualites" className="hover:text-primary-600">
                Actualités
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 truncate max-w-[200px]">
                {actualite.titre}
              </span>
            </nav>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/actualites">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Article Content */}
            <article className="lg:col-span-2">
              {/* Extrait */}
              <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                {actualite.extrait}
              </p>

              <Separator className="my-8" />

              {/* Contenu */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(actualite.contenu),
                }}
              />

              {/* Galerie d'images */}
              {actualite.galerie_images &&
                actualite.galerie_images.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold mb-4">
                      Galerie photos
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {actualite.galerie_images.map((img, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden"
                        >
                          <Image
                            src={img}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Vidéos YouTube */}
              {actualite.videos_youtube &&
                actualite.videos_youtube.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold mb-4">Vidéos</h3>
                    <div className="space-y-4">
                      {actualite.videos_youtube.map((url, index) => {
                        const videoId = extractYoutubeId(url);
                        if (!videoId) return null;
                        return (
                          <div
                            key={index}
                            className="relative aspect-video rounded-lg overflow-hidden"
                          >
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={`Vidéo ${index + 1}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Share buttons */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-500">
                    Partager:
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          `https://drnofluweb.vercel.app/actualites/${actualite.slug}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          actualite.titre,
                        )}&url=${encodeURIComponent(
                          `https://drnofluweb.vercel.app/actualites/${actualite.slug}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Twitter
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `${actualite.titre} https://drnofluweb.vercel.app/actualites/${actualite.slug}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Author Card */}
              {actualite.auteur && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Auteur</h3>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={actualite.auteur.avatar_url} />
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {actualite.auteur.nom_complet?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {actualite.auteur.nom_complet}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rédacteur DRNOFLU
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Articles */}
              {relatedActualites.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Articles similaires
                    </h3>
                    <div className="space-y-4">
                      {relatedActualites.map((item) => (
                        <Link
                          key={item.id}
                          href={`/actualites/${item.slug}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            {item.image_url && (
                              <div className="relative w-20 h-16 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image_url}
                                  alt={item.titre}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2">
                                {item.titre}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(item.date_publication || "")}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <Card className="bg-primary-50 border-primary-100">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-primary-900 mb-2">
                    Restez informé
                  </h3>
                  <p className="text-sm text-primary-700 mb-4">
                    Suivez toutes nos actualités
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/actualites">Voir toutes les actualités</Link>
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
