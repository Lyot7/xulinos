import { useState, useEffect } from 'react';
import { getCookieConsentSettings, setCookieConsent, applyCookiePreferences } from '@/utils/cookieConfig';

export type CookieConsentType = 'all' | 'essential' | 'none';

interface CookieConsentState {
  consent: CookieConsentType | null;
  consentDate: string | null;
  hasConsented: boolean;
}

export function useCookieConsent() {
  const [cookieState, setCookieState] = useState<CookieConsentState>({
    consent: null,
    consentDate: null,
    hasConsented: false,
  });

  useEffect(() => {
    // Charger les préférences depuis la configuration centralisée
    const settings = getCookieConsentSettings();
    if (settings) {
      setCookieState({
        consent: settings.consent as CookieConsentType | null,
        consentDate: settings.consentDate,
        hasConsented: settings.hasConsented,
      });
    }
  }, []);

  const setConsent = (type: CookieConsentType) => {
    setCookieConsent(type);
    
    setCookieState({
      consent: type,
      consentDate: new Date().toISOString(),
      hasConsented: true,
    });
  };

  const resetConsent = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookie-consent-date');
    }
    
    setCookieState({
      consent: null,
      consentDate: null,
      hasConsented: false,
    });
  };

  return {
    ...cookieState,
    setConsent,
    resetConsent,
    applyCookiePreferences,
  };
} 