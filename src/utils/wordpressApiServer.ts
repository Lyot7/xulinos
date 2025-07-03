/**
 * WordPress API utility functions for server-side use
 */

/**
 * Server-side version of getCouteauImages (no 'use client' directive)
 * @param couteau The couteau object from WordPress
 * @returns Object with mainImage and gallery arrays
 */
export const getCouteauImagesServer = async (couteau: any): Promise<{
  mainImage: string | null;
  gallery: string[];
}> => {
  let mainImage = null;
  let gallery: string[] = [];
  
  // Essayer d'abord de récupérer l'image depuis les champs ACF galerie
  if (couteau.acf?.galerie && Array.isArray(couteau.acf.galerie) && couteau.acf.galerie.length > 0) {
    const firstImage = couteau.acf.galerie[0];
    mainImage = firstImage.url || firstImage;
    
    // Ajouter les autres images à la galerie
    gallery = couteau.acf.galerie.slice(1).map((item: any) => item.url || item).filter(Boolean);
  }
  
  // Si pas d'image ACF, essayer de récupérer les médias associés
  if (!mainImage) {
    try {
      const mediaRes = await fetch(
        `https://xulinos.xyz-agency.com/wp-json/wp/v2/media?parent=${couteau.id}`,
        { next: { revalidate: 60 } }
      );
      
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        if (mediaData.length > 0) {
          mainImage = mediaData[0].source_url || null;
          // Ajouter les autres images à la galerie
          gallery = mediaData.slice(1).map((media: any) => media.source_url).filter(Boolean);
        }
      }
    } catch (error) {
      console.error(`Error fetching media for couteau ${couteau.id}:`, error);
    }
  }
  
  // Fallback: essayer les champs ACF image_X si rien d'autre ne fonctionne
  if (!mainImage) {
    const imageFields = [couteau.acf?.image_1, couteau.acf?.image_2, couteau.acf?.image_3, couteau.acf?.image_4, couteau.acf?.image_5, couteau.acf?.image_6];
    const imageId = imageFields.find((id) => id && String(id).trim() !== '');
    
    if (imageId) {
      try {
        const response = await fetch(`https://xulinos.xyz-agency.com/wp-json/wp/v2/media/${imageId}`, { next: { revalidate: 60 } });
        if (response.ok) {
          const mediaData = await response.json();
          mainImage = mediaData.source_url || null;
        }
      } catch (e) {
        console.error(`Error fetching media ${imageId}:`, e);
      }
    }
  }
  
  return { mainImage, gallery };
};

/**
 * Server-side version of decodeHtmlEntities
 * @param str The string to decode
 * @returns The decoded string
 */
export function decodeHtmlEntitiesServer(str: string): string {
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

/**
 * Server-side version of parseWordPressContent
 * @param content The WordPress content to parse
 * @returns The parsed content with preserved HTML tags
 */
export function parseWordPressContentServer(content: { rendered?: string } | string | undefined): string {
  if (!content) return '';
  if (typeof content === 'object' && content.rendered) {
    return decodeHtmlEntitiesServer(content.rendered);
  }
  return decodeHtmlEntitiesServer(content as string);
} 