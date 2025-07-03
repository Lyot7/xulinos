'use client';

/**
 * 
 * WordPress API utility functions
 */

import { apiRoutes } from './apiRoutes';

/**
 * Fetches data from a WordPress API endpoint
 * @param routeKey The key of the route in the apiRoutes object
 * @returns The fetched data or null if there was an error
 */
export const fetchWordPressData = async (routeKey: string): Promise<any | null> => {
  try {
    const route = apiRoutes[routeKey];
    if (!route) {
      throw new Error(`Route key "${routeKey}" not found in apiRoutes`);
    }

    const response = await fetch(route.endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${route.key}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching WordPress data for ${routeKey}:`, error);
    return null;
  }
};

/**
 * Submits data to a WordPress form endpoint
 * @param formKey The key of the form route in the apiRoutes object
 * @param formData The form data to submit
 * @returns The response data or null if there was an error
 */
export const submitWordPressForm = async (formKey: string, formData: FormData): Promise<any | null> => {
  try {
    const route = apiRoutes[formKey];
    if (!route) {
      throw new Error(`Form route key "${formKey}" not found in apiRoutes`);
    }

    const response = await fetch(route.endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to submit form ${formKey}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error submitting form ${formKey}:`, error);
    return null;
  }
};

/**
 * Parses WordPress content to handle HTML content with UTF-8 encoding
 * @param content The WordPress content to parse
 * @returns The parsed content with preserved HTML tags
 */
export function parseWordPressContent(content: { rendered?: string } | string | undefined): string {
  if (!content) return '';
  if (typeof content === 'object' && content.rendered) {
    return decodeHtmlEntities(content.rendered);
  }
  return decodeHtmlEntities(content as string);
}

/**
 * Gets the featured image URL from a WordPress post
 * @param post The WordPress post object
 * @returns The featured image URL or null if not found
 */
export const getFeaturedImageUrl = (post: any): string | null => {
  if (!post || !post._embedded || !post._embedded['wp:featuredmedia']) {
    return null;
  }
  
  const media = post._embedded['wp:featuredmedia'][0];
  return media?.source_url || null;
};

/**
 * Fetches image URL from WordPress media ID
 * @param mediaId The WordPress media ID
 * @returns The image URL or null if not found
 */
export const getImageUrlFromId = async (mediaId: number | string): Promise<string | null> => {
  if (!mediaId) return null;
  
  try {
    const response = await fetch(`https://xulinos.xyz-agency.com/wp-json/wp/v2/media/${mediaId}`);
    if (!response.ok) {
      console.warn(`Failed to fetch media ${mediaId}: ${response.statusText}`);
      return null;
    }
    
    const mediaData = await response.json();
    return mediaData.source_url || null;
  } catch (error) {
    console.error(`Error fetching media ${mediaId}:`, error);
    return null;
  }
};

/**
 * Common utility function to get couteau images (works both client and server side)
 * @param couteau The couteau object from WordPress
 * @returns Object with mainImage and gallery arrays
 */
export const getCouteauImages = async (couteau: any): Promise<{
  mainImage: string | null;
  gallery: string[];
}> => {
  let mainImage = null;
  let gallery: string[] = [];
  
  console.log('🔍 Debug getCouteauImages for couteau:', couteau.id);
  console.log('ACF data:', couteau.acf);
  
  // 1. Essayer d'abord de récupérer l'image depuis les champs ACF galerie
  if (couteau.acf?.galerie && Array.isArray(couteau.acf.galerie) && couteau.acf.galerie.length > 0) {
    console.log('✅ Found ACF galerie:', couteau.acf.galerie);
    const firstImage = couteau.acf.galerie[0];
    mainImage = firstImage.url || firstImage;
    
    // Ajouter les autres images à la galerie
    gallery = couteau.acf.galerie.slice(1).map((item: any) => item.url || item).filter(Boolean);
    console.log('📸 Images from ACF galerie - mainImage:', mainImage, 'gallery:', gallery);
  }
  
  // 2. Essayer les champs ACF image_principale
  if (!mainImage && couteau.acf?.image_principale) {
    console.log('🔍 Trying ACF image_principale:', couteau.acf.image_principale);
    if (typeof couteau.acf.image_principale === 'object' && couteau.acf.image_principale.url) {
      mainImage = couteau.acf.image_principale.url;
      console.log('✅ Found mainImage from ACF image_principale:', mainImage);
    } else if (typeof couteau.acf.image_principale === 'number') {
      try {
        const response = await fetch(`https://xulinos.xyz-agency.com/wp-json/wp/v2/media/${couteau.acf.image_principale}`);
        if (response.ok) {
          const mediaData = await response.json();
          mainImage = mediaData.source_url || null;
          console.log('✅ Found mainImage from ACF image_principale ID:', mainImage);
        }
      } catch (e) {
        console.error(`Error fetching media ${couteau.acf.image_principale}:`, e);
      }
    }
  }
  
  // 3. Si pas d'image ACF, essayer de récupérer les médias associés
  if (!mainImage) {
    console.log('🔍 Trying to fetch media by parent ID:', couteau.id);
    try {
      const mediaRes = await fetch(
        `https://xulinos.xyz-agency.com/wp-json/wp/v2/media?parent=${couteau.id}&per_page=100`,
        { cache: 'no-store' }
      );
      
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        // console.log('📸 Media found by parent:', mediaData);
        if (mediaData.length > 0) {
          mainImage = mediaData[0].source_url || null;
          // Ajouter les autres images à la galerie
          gallery = mediaData.slice(1).map((media: any) => media.source_url).filter(Boolean);
          // console.log('✅ Images from media by parent - mainImage:', mainImage, 'gallery:', gallery);
        }
      }
    } catch (error) {
      console.error(`Error fetching media for couteau ${couteau.id}:`, error);
    }
  }
  
  // 4. Fallback: essayer les champs ACF image_X si rien d'autre ne fonctionne
  if (!mainImage) {
    console.log('🔍 Trying ACF image_X fields');
    const imageFields = [couteau.acf?.image_1, couteau.acf?.image_2, couteau.acf?.image_3, couteau.acf?.image_4, couteau.acf?.image_5, couteau.acf?.image_6];
    console.log('ACF image fields:', imageFields);
    
    const imageId = imageFields.find((id) => id && String(id).trim() !== '');
    
    if (imageId) {
      try {
        const response = await fetch(`https://xulinos.xyz-agency.com/wp-json/wp/v2/media/${imageId}`);
        if (response.ok) {
          const mediaData = await response.json();
          mainImage = mediaData.source_url || null;
          console.log('✅ Found mainImage from ACF image_X:', mainImage);
        }
      } catch (e) {
        console.error(`Error fetching media ${imageId}:`, e);
      }
    }
  }
  
  // 5. Essayer de récupérer la galerie depuis d'autres champs ACF
  if (gallery.length === 0) {
    // console.log('🔍 Looking for additional gallery images in ACF');
    
    // Essayer différents noms de champs pour la galerie
    const galleryFields = [
      couteau.acf?.galerie_images,
      couteau.acf?.images,
      couteau.acf?.photos,
      couteau.acf?.gallery
    ];
    
    for (const field of galleryFields) {
      if (field && Array.isArray(field) && field.length > 0) {
        console.log('✅ Found gallery field:', field);
        gallery = field.map((item: any) => {
          if (typeof item === 'object' && item.url) return item.url;
          if (typeof item === 'string') return item;
          return null;
        }).filter(Boolean);
        break;
      }
    }
    
    // Essayer de récupérer des images individuelles
    if (gallery.length === 0) {
      const individualImageFields = [
        couteau.acf?.image_2, couteau.acf?.image_3, couteau.acf?.image_4, 
        couteau.acf?.image_5, couteau.acf?.image_6, couteau.acf?.image_7, couteau.acf?.image_8
      ];
      
      const imagePromises = individualImageFields
        .filter(id => id && String(id).trim() !== '')
        .map(async (id) => {
          try {
            const response = await fetch(`https://xulinos.xyz-agency.com/wp-json/wp/v2/media/${id}`);
            if (response.ok) {
              const mediaData = await response.json();
              return mediaData.source_url;
            }
          } catch (e) {
            console.error(`Error fetching media ${id}:`, e);
          }
          return null;
        });
      
      const additionalImages = await Promise.all(imagePromises);
      gallery = additionalImages.filter(Boolean);
      console.log('✅ Additional images from ACF image_X fields:', gallery);
    }
  }
  
  // console.log('🎯 Final result - mainImage:', mainImage, 'gallery:', gallery);
  return { mainImage, gallery };
};

/**
 * Processes couteaux data to include image URLs
 * @param couteaux The couteaux data from WordPress
 * @returns Processed couteaux with image URLs
 */
export const processCouteauxImages = async (couteaux: any[]): Promise<any[]> => {
  if (!Array.isArray(couteaux)) return [];

  const processedCouteaux = await Promise.all(
    couteaux.map(async (couteau) => {
      const { mainImage, gallery } = await getCouteauImages(couteau);
      
      return {
        ...couteau,
        acf: {
          ...couteau.acf,
          image_principale: mainImage ? { url: mainImage, alt: '' } : null,
        },
        // Ajouter la galerie pour compatibilité
        gallery: gallery,
      };
    })
  );

  return processedCouteaux;
};

export function decodeHtmlEntities(str: string): string {
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