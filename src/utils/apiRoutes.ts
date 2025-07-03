'use client';

/**
 * WordPress API routes configuration
 */

const WP_BASE_URL = 'https://xulinos.xyz-agency.com/wp-json';

export interface ApiRoute {
  key: string;
  endpoint: string;
  priority: number;
  optional?: boolean;
}

export const apiRoutes: Record<string, ApiRoute> = {
  // Page d'accueil - priorité maximale
  home: {
    key: 'home',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/6`,
    priority: 1,
  },
  
  // Collection couteaux - essentiel pour la page d'accueil
  couteaux: {
    key: 'couteaux',
    endpoint: `${WP_BASE_URL}/wp/v2/couteaux`,
    priority: 2,
  },
  
  // Pages secondaires
  about: {
    key: 'about',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/13`,
    priority: 3,
  },
  affutageRemoulage: {
    key: 'affutageRemoulage',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/176`,
    priority: 4,
  },
  service: {
    key: 'service',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/204`,
    priority: 5,
  },
  
  // Configurateur pages
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
  
  // Pages légales
  cgv: {
    key: 'cgv',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/287`,
    priority: 11,
  },
  configuration: {
    key: 'configuration',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/289`,
    priority: 12,
  },
  mentions: {
    key: 'mentions',
    endpoint: `${WP_BASE_URL}/wp/v2/pages/3`,
    priority: 13,
  },
};

// Map of page paths to their corresponding API route keys
export const pathToRouteKeyMap: Record<string, string> = {
  '/': 'home',
  '/a-propos': 'about',
  '/affutage-remoulage': 'affutageRemoulage',
  '/service': 'service',
  '/configurateur': 'configurateur',
  '/couteaux': 'couteaux',
  '/tos': 'cgv',
  '/privacy': 'mentions',
  '/cookie-policy': 'configuration',
};

// Helper function to get route key from current path
export const getRouteKeyFromPath = (path: string): string | null => {
  // Direct mapping first
  if (pathToRouteKeyMap[path]) {
    return pathToRouteKeyMap[path];
  }
  
  // Dynamic couteau detail route detection
  const couteauMatch = path.match(/^\/couteaux\/(.+)$/);
  if (couteauMatch) {
    return 'couteaux';
  }
  
  return null;
}; 