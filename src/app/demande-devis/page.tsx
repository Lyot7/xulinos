'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import PrimaryButton from '@/components/PrimaryButton';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  panier: string;
}

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export default function DemandeDevisPage() {
  const { getCartSummary, totalItems, totalPrice } = useCart();
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    panier: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: null, message: '' });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Charger le résumé du panier au montage du composant
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      panier: getCartSummary()
    }));
  }, [getCartSummary]);

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

    try {
      // Vérifier que le token Turnstile est présent (si vous l'utilisez)
      if (!turnstileToken) {
        setStatus({
          type: 'error',
          message: 'Veuillez compléter la vérification de sécurité.'
        });
        setIsSubmitting(false);
        return;
      }

      // Préparer les données du formulaire
      const submitData = new FormData();
      submitData.append('nom', formData.nom);
      submitData.append('prenom', formData.prenom);
      submitData.append('email', formData.email);
      submitData.append('telephone', formData.telephone);
      submitData.append('adresse', formData.adresse);
      submitData.append('panier', formData.panier);
      submitData.append('cf-turnstile-response', turnstileToken);

      // Envoyer le formulaire à Contact Form 7
      const response = await fetch('https://xulinos.xyz-agency.com/wp-json/contact-form-7/v1/contact-forms/265/feedback', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (result.status === 'mail_sent') {
        setStatus({
          type: 'success',
          message: 'Votre demande de devis a été envoyée avec succès ! Nous vous recontacterons dans les plus brefs délais.'
        });
        // Réinitialiser le formulaire
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          adresse: '',
          panier: getCartSummary(),
        });
      } else {
        throw new Error(result.message || 'Erreur lors de l\'envoi du formulaire');
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

  // Simuler le token Turnstile pour le développement
  useEffect(() => {
    // En production, ce sera géré par le composant Turnstile
    setTurnstileToken('dev-token');
  }, []);

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
              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nom" className="block text-white font-medium mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 focus:border-white focus:outline-none transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="prenom" className="block text-white font-medium mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 focus:border-white focus:outline-none transition-colors"
                    placeholder="Votre prénom"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 focus:border-white focus:outline-none transition-colors"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="telephone" className="block text-white font-medium mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 focus:border-white focus:outline-none transition-colors"
                  placeholder="01 23 45 67 89"
                />
              </div>

              {/* Adresse */}
              <div>
                <label htmlFor="adresse" className="block text-white font-medium mb-2">
                  Adresse *
                </label>
                <textarea
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 focus:border-white focus:outline-none transition-colors resize-none"
                  placeholder="Votre adresse complète"
                />
              </div>

              {/* Panier */}
              <div>
                <label htmlFor="panier" className="block text-white font-medium mb-2">
                  Détail du panier
                </label>
                <textarea
                  id="panier"
                  name="panier"
                  value={formData.panier}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 focus:border-white focus:outline-none transition-colors resize-none"
                  placeholder="Le détail de votre panier apparaîtra ici automatiquement"
                  readOnly
                />
              </div>

              {/* Bouton de soumission */}
              <PrimaryButton
                type="submit"
                name={isSubmitting ? "Envoi en cours..." : "Envoyer"}
                disabled={isSubmitting}
                className="w-full py-4 text-lg"
              />
            </form>
          </div>

          {/* Résumé du panier */}
          <div className="bg-primary rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Résumé de votre commande
            </h2>

            {totalItems === 0 ? (
              <div className="text-center py-12">
                <div className="text-white/50 mb-4">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                  </svg>
                </div>
                <p className="text-white/70 text-lg mb-2">Votre panier est vide</p>
                <p className="text-white/50">
                  Ajoutez des couteaux à votre panier pour faire une demande de devis
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-white">
                  <span className="text-lg">Articles dans le panier:</span>
                  <span className="font-bold">{totalItems}</span>
                </div>
                
                <div className="flex justify-between items-center text-white">
                  <span className="text-lg">Total estimé:</span>
                  <span className="text-2xl font-bold">{totalPrice}€</span>
                </div>
                
                <div className="border-t border-white/20 pt-4">
                  <p className="text-white/80 text-sm">
                    <strong>Note:</strong> Les prix affichés sont indicatifs. 
                    Le devis final tiendra compte de vos spécifications exactes 
                    et des options choisies.
                  </p>
                </div>
                
                <div className="bg-dark rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Ce qui est inclus:</h3>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Consultation personnalisée</li>
                    <li>• Devis détaillé sous 48h</li>
                    <li>• Délais de fabrication</li>
                    <li>• Options de personnalisation</li>
                    <li>• Conditions de livraison</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 