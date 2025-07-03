'use client';

import React, { useState } from 'react';
import { FaCookieBite, FaTimes, FaCheck, FaShieldAlt, FaBan } from 'react-icons/fa';
import { useCookieConsent, CookieConsentType } from '@/hooks/useCookieConsent';

export default function CookieManager() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { consent, setConsent, resetConsent } = useCookieConsent();

  const handleConsent = (type: CookieConsentType) => {
    setConsent(type);
    setIsVisible(false);
  };

  const handleReset = () => {
    resetConsent();
    setIsVisible(false);
  };

  const getConsentText = () => {
    switch (consent) {
      case 'all':
        return 'Tous les cookies acceptés';
      case 'essential':
        return 'Cookies essentiels seulement';
      case 'none':
        return 'Cookies refusés';
      default:
        return 'Préférences non définies';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors text-sm"
      >
        <FaCookieBite className="text-sm" />
        <span>Gérer les cookies</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsVisible(false)}
      />
      
      {/* Popup */}
      <div className="relative bg-dark border border-primary/20 rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <div className="flex items-center space-x-3">
            <FaCookieBite className="text-primary text-xl" />
            <h2 className="text-lg font-bold text-white">Gestion des cookies</h2>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-4 p-3 bg-primary/10 rounded-md border border-primary/20">
            <p className="text-sm text-white/80">
              <strong>Préférence actuelle :</strong> {getConsentText()}
            </p>
          </div>

          <p className="text-white/80 mb-4">
            Vous pouvez modifier vos préférences de cookies à tout moment.
          </p>

          {/* Cookie Details */}
          <div className="mb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-white hover:text-white/80 font-medium text-sm flex items-center"
            >
              {showDetails ? 'Masquer' : 'Voir'} les détails
              <span className={`ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showDetails && (
              <div className="mt-3 space-y-2 text-sm text-white/70">
                <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                  <h4 className="font-medium text-white mb-1">Cookies essentiels</h4>
                  <p>Nécessaires au fonctionnement du site (panier, préférences de langue)</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                  <h4 className="font-medium text-white mb-1">Cookies analytiques</h4>
                  <p>Nous aident à comprendre comment vous utilisez notre site</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                  <h4 className="font-medium text-white mb-1">Cookies marketing</h4>
                  <p>Utilisés pour personnaliser les publicités et le contenu</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Accepter tous */}
            <button
              onClick={() => handleConsent('all')}
              className={`w-full flex items-center justify-center space-x-2 font-medium py-2 px-3 rounded-md transition-colors text-sm ${
                consent === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <FaCheck className="text-sm" />
              <span>Accepter tous les cookies</span>
            </button>

            {/* Cookies essentiels seulement */}
            <button
              onClick={() => handleConsent('essential')}
              className={`w-full flex items-center justify-center space-x-2 font-medium py-2 px-3 rounded-md transition-colors text-sm ${
                consent === 'essential' 
                  ? 'bg-primary text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <FaShieldAlt className="text-sm" />
              <span>Cookies essentiels seulement</span>
            </button>

            {/* Refuser */}
            <button
              onClick={() => handleConsent('none')}
              className={`w-full flex items-center justify-center space-x-2 font-medium py-2 px-3 rounded-md transition-colors text-sm ${
                consent === 'none' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
              }`}
            >
              <FaBan className="text-sm" />
              <span>Refuser tous les cookies</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="w-full text-white/60 hover:text-white font-medium py-2 px-4 text-sm"
            >
              Réinitialiser les préférences
            </button>
          </div>

          {/* Footer */}
          <div className="mt-3 text-xs text-white/60 text-center">
            En continuant à utiliser ce site, vous acceptez notre{' '}
            <a href="/privacy" className="text-white hover:underline">
              politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 