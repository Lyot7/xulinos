'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import PrimaryButton from '@/components/PrimaryButton';
import { FaCheckCircle, FaExclamationTriangle, FaPaperPlane } from 'react-icons/fa';

interface FormData {
  nom: string;
  objet: string;
  message: string;
}

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export default function DemandeDevisPage() {
  const { getCartSummary, totalItems, totalPrice } = useCart();
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    objet: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: null, message: '' });
  const [mailtoLink, setMailtoLink] = useState<string | null>(null);

  // Charger le résumé du panier au montage du composant
  useEffect(() => {
    const cartSummary = getCartSummary();
    setFormData(prev => ({
      ...prev,
      message: `Demande de devis pour les articles suivants :\n\n${cartSummary}\n\nPrix total : ${totalPrice}€`
    }));
  }, [getCartSummary, totalPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });
    setMailtoLink(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: 'devis'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          type: 'success',
          message: 'Votre demande de devis a été préparée. Votre client email va s\'ouvrir...'
        });
        
        // Ouvrir directement le client email
        window.location.href = result.mailtoLink;
        
        // Réinitialiser le formulaire après un délai
        setTimeout(() => {
          setFormData({
            nom: '',
            objet: '',
            message: '',
          });
          setStatus({ type: null, message: '' });
          setMailtoLink(null);
        }, 2000);
      } else {
        throw new Error(result.error || 'Erreur lors de l\'envoi du formulaire');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setStatus({
        type: 'error',
        message: 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Demande de devis personnalisé
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Remplissez ce formulaire pour recevoir un devis détaillé pour vos couteaux artisanaux.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-primary rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Vos informations
            </h2>

            {/* Message de statut */}
            {status.type && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                status.type === 'success' 
                  ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                  : 'bg-red-600/20 text-red-400 border border-red-600/30'
              }`}>
                {status.type === 'success' ? (
                  <FaCheckCircle size={20} />
                ) : (
                  <FaExclamationTriangle size={20} />
                )}
                <p>{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom complet */}
              <div>
                <label htmlFor="nom" className="block text-white font-medium mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 focus:border-white focus:outline-none transition-colors"
                  placeholder="Votre nom complet"
                />
              </div>

              {/* Objet */}
              <div>
                <label htmlFor="objet" className="block text-white font-medium mb-2">
                  Objet *
                </label>
                <input
                  type="text"
                  id="objet"
                  name="objet"
                  value={formData.objet}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 focus:border-white focus:outline-none transition-colors"
                  placeholder="Objet de votre demande de devis"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">
                  Détails de votre demande *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 focus:border-white focus:outline-none transition-colors resize-none"
                  placeholder="Décrivez vos besoins..."
                />
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-dark font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Préparation en cours...' : 'Préparer ma demande de devis'}
              </button>
            </form>
          </div>

          {/* Résumé du panier */}
          <div className="bg-dark rounded-xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">
              Résumé de votre panier
            </h2>
            
            <div className="space-y-4">
              <div className="text-white/80">
                <p className="mb-2">Articles sélectionnés :</p>
                <div className="bg-white/5 rounded-lg p-4">
                  <pre className="text-sm whitespace-pre-wrap text-white/90">{getCartSummary()}</pre>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center text-white">
                  <span className="font-medium">Total :</span>
                  <span className="text-xl font-bold">{totalPrice}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 