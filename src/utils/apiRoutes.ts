'use client';

/**
 * WordPress API routes configuration
 */

const WP_BASE_URL = 'https://xulinos.xyz-agency.com/wp-json';

export interface ApiRoute {
  key: string;
  endpoint: string;
  priority: number;
}

export const apiRoutes: Record<string, ApiRoute> = {
  // Pages
  home: {
    key: 'home',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/6`,
    priority: 1,
  },
  about: {
    key: 'about',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/13`,
    priority: 2,
  },
  affutageRemoulage: {
    key: 'affutageRemoulage',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/176`,
    priority: 3,
  },
  service: {
    key: 'service',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/204`,
    priority: 4,
  },
  
  // Configurateur pages
  configurateurHome: {
    key: 'configurateurHome',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/25`,
    priority: 5,
  },
  configurateur1: {
    key: 'configurateur1',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/33`,
    priority: 6,
  },
  configurateur2: {
    key: 'configurateur2',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/35`,
    priority: 7,
  },
  configurateur3: {
    key: 'configurateur3',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/37`,
    priority: 8,
  },
  configurateur4: {
    key: 'configurateur4',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/39`,
    priority: 9,
  },
  configurateur5: {
    key: 'configurateur5',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/41`,
    priority: 10,
  },
  
  // Collections
  couteaux: {
    key: 'couteaux',
    endpoint: `${WP_BASE_URL}/wp/v2/couteaux`,
    priority: 2,
  },
  
  // Forms
  formPanier: {
    key: 'formPanier',
    endpoint: `${WP_BASE_URL}/contact-form-7/v1/contact-forms/226/feedback`,
    priority: 11,
  },
  formDevis: {
    key: 'formDevis',
    endpoint: `${WP_BASE_URL}/contact-form-7/v1/contact-forms/265/feedback`,
    priority: 12,
  },
};

// Map of page paths to their corresponding API route keys
export const pathToRouteKeyMap: Record<string, string> = {
  '/': 'home',
  '/a-propos': 'about',
  '/affutage-remoulage': 'affutageRemoulage',
  '/service': 'service',
  '/configurateur': 'configurateurHome',
  '/couteaux': 'couteaux',
};

// Helper function to get route key from current path
export const getRouteKeyFromPath = (path: string): string | null => {
  return pathToRouteKeyMap[path] || null;
}; 