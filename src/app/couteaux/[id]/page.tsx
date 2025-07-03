import KnifeDetail from "@/components/KnifeDetail";
import { notFound } from "next/navigation";

// Version server-only, pure JS, pas de 'use client'
function decodeHtmlEntitiesServer(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'");
}

function parseWordPressContentServer(content: { rendered?: string } | string | undefined): string {
  if (!content) return '';
  if (typeof content === 'object' && content.rendered) {
    return decodeHtmlEntitiesServer(content.rendered);
  }
  return decodeHtmlEntitiesServer(content as string);
}

interface Props {
  params: { id: string };
}

export default async function KnifeDetailPage({ params }: Props) {
  const { id } = await params;

  const res = await fetch(`https://xulinos.xyz-agency.com/wp-json/wp/v2/couteaux/${id}?_embed`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    notFound(); // ou gestion d'erreur
  }

  const knife = await res.json();

  // Récupérer les images de la galerie depuis les champs ACF
  let gallery: string[] = [];
  
  // Essayer de récupérer la galerie depuis les champs ACF
  if (knife.acf?.galerie && Array.isArray(knife.acf.galerie)) {
    gallery = knife.acf.galerie.map((item: any) => item.url || item).filter(Boolean);
  }
  
  // Si pas de galerie ACF, essayer de récupérer les médias associés
  if (gallery.length === 0 && knife._embedded?.["wp:featuredmedia"]) {
    // Récupérer tous les médias associés à ce couteau
    try {
      const mediaRes = await fetch(
        `https://xulinos.xyz-agency.com/wp-json/wp/v2/media?parent=${id}`,
        { next: { revalidate: 60 } }
      );
      
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        gallery = mediaData
          .filter((media: any) => media.source_url && media.source_url !== knife._embedded?.["wp:featuredmedia"]?.[0]?.source_url)
          .map((media: any) => media.source_url);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des médias:", error);
    }
  }

  // Traite le titre et la description en UTF-8 (server-only)
  const name = parseWordPressContentServer(knife.title?.rendered);
  const description = parseWordPressContentServer(knife.content?.rendered);

  // Log de debug pour vérifier les valeurs
  console.log({
    id: knife?.id,
    name,
    price: knife.acf?.prix,
    available: knife.class_list?.includes("couteaux_tag-disponible-a-lachat"),
    description,
    mainImage: knife._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    gallery
  });

  return (
    <KnifeDetail
      id={knife?.id?.toString() || ''}
      name={name || ''}
      price={typeof knife.acf?.prix === 'number' ? knife.acf?.prix : (parseFloat(knife.acf?.prix) || '—')}
      available={!!knife.class_list?.includes("couteaux_tag-disponible-a-lachat")}
      description={description || ''}
      mainImage={knife._embedded?.["wp:featuredmedia"]?.[0]?.source_url || ''}
      gallery={Array.isArray(gallery) ? gallery : []}
    />
  );
}
