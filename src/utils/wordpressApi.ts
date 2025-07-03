'use client';

/**
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
export const parseWordPressContent = (content: { rendered?: string } | string | undefined): string => {
  if (!content) return '';
  
  let rawContent: string;
  
  if (typeof content === 'object' && content.rendered) {
    rawContent = content.rendered;
  } else {
    rawContent = content as string;
  }
  
  // Décode les entités HTML pour gérer l'encodage UTF-8
  // Utilisation d'une approche compatible SSR
  const decodedContent = rawContent
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  return decodedContent;
};

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