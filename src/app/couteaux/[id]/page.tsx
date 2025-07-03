import KnifeDetail from "@/components/KnifeDetail";
import { notFound } from "next/navigation";
import { getCouteauImagesServer, parseWordPressContentServer } from "@/utils/wordpressApiServer";

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

  // Log complet des données du couteau pour debug
  console.log('🔍 Complete knife data:', {
    id: knife?.id,
    title: knife?.title?.rendered,
    acf: knife?.acf,
    featured_media: knife?.featured_media,
    _embedded: knife?._embedded
  });

  // Utiliser la fonction commune pour récupérer les images
  const { mainImage, gallery } = await getCouteauImagesServer(knife);

  // Traite le titre et la description en UTF-8 (server-only)
  const name = parseWordPressContentServer(knife.title?.rendered);
  const description = parseWordPressContentServer(knife.content?.rendered);

  // Log de debug pour vérifier les valeurs
  console.log('🎯 KnifeDetailPage result:', {
    id: knife?.id,
    name,
    price: knife.acf?.prix,
    available: knife.class_list?.includes("couteaux_tag-disponible-a-lachat"),
    description: description?.substring(0, 100) + '...',
    mainImage,
    gallery,
    galleryLength: gallery?.length || 0
  });

  return (
    <KnifeDetail
      id={knife?.id?.toString() || ''}
      name={name || ''}
      price={typeof knife.acf?.prix === 'number' ? knife.acf?.prix : (parseFloat(knife.acf?.prix) || '—')}
      available={!!knife.class_list?.includes("couteaux_tag-disponible-a-lachat")}
      description={description || ''}
      mainImage={mainImage || ''}
      gallery={Array.isArray(gallery) ? gallery : []}
    />
  );
}
