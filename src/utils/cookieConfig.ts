export interface CookieConfig {
  name: string;
  description: string;
  category: 'essential' | 'analytics' | 'marketing';
  duration: string;
  provider: string;
}

export const COOKIE_CATEGORIES = {
  essential: {
    name: 'Cookies essentiels',
    description: 'Nécessaires au fonctionnement du site',
    color: 'bg-green-50 border-green-200 text-green-800'
  },
  analytics: {
    name: 'Cookies analytiques',
    description: 'Nous aident à comprendre l\'utilisation du site',
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  marketing: {
    name: 'Cookies marketing',
    description: 'Utilisés pour personnaliser les publicités',
    color: 'bg-purple-50 border-purple-200 text-purple-800'
  }
};

export const COOKIES_LIST: CookieConfig[] = [
  // Cookies essentiels
  {
    name: 'cookie-consent',
    description: 'Stocke vos préférences de consentement aux cookies',
    category: 'essential',
    duration: '1 an',
    provider: 'Xulinos'
  },
  {
    name: 'cart-items',
    description: 'Stocke les articles dans votre panier',
    category: 'essential',
    duration: 'Session',
    provider: 'Xulinos'
  },
  {
    name: 'language-preference',
    description: 'Stocke votre préférence de langue',
    category: 'essential',
    duration: '1 an',
    provider: 'Xulinos'
  },
  
  // Cookies analytiques
  {
    name: '_ga',
    description: 'Google Analytics - Identifie les utilisateurs uniques',
    category: 'analytics',
    duration: '2 ans',
    provider: 'Google'
  },
  {
    name: '_ga_*',
    description: 'Google Analytics - Identifie les sessions',
    category: 'analytics',
    duration: '2 ans',
    provider: 'Google'
  },
  {
    name: '_gid',
    description: 'Google Analytics - Identifie les sessions',
    category: 'analytics',
    duration: '24 heures',
    provider: 'Google'
  },
  
  // Cookies marketing
  {
    name: '_fbp',
    description: 'Facebook Pixel - Suivi des conversions',
    category: 'marketing',
    duration: '3 mois',
    provider: 'Facebook'
  },
  {
    name: '_fbc',
    description: 'Facebook Pixel - Suivi des clics',
    category: 'marketing',
    duration: '2 ans',
    provider: 'Facebook'
  }
];

export const getCookiesByCategory = (category: 'essential' | 'analytics' | 'marketing') => {
  return COOKIES_LIST.filter(cookie => cookie.category === category);
};

export const getCookieConsentSettings = () => {
  if (typeof window === 'undefined') return null;
  
  return {
    consent: localStorage.getItem('cookie-consent'),
    consentDate: localStorage.getItem('cookie-consent-date'),
    hasConsented: !!localStorage.getItem('cookie-consent')
  };
};

export const setCookieConsent = (type: 'all' | 'essential' | 'none') => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('cookie-consent', type);
  localStorage.setItem('cookie-consent-date', new Date().toISOString());
  
  // Appliquer les préférences
  applyCookiePreferences(type);
};

export const applyCookiePreferences = (type: 'all' | 'essential' | 'none') => {
  if (typeof window === 'undefined') return;
  
  switch (type) {
    case 'all':
      // Activer tous les cookies
      enableAnalytics();
      enableMarketing();
      break;
    case 'essential':
      // Désactiver les cookies non-essentiels
      disableAnalytics();
      disableMarketing();
      break;
    case 'none':
      // Désactiver tous les cookies non-essentiels
      disableAnalytics();
      disableMarketing();
      break;
  }
};

const enableAnalytics = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
  }
};

const disableAnalytics = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }
};

const enableMarketing = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      ad_storage: 'granted'
    });
  }
};

const disableMarketing = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      ad_storage: 'denied'
    });
  }
};

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
} 