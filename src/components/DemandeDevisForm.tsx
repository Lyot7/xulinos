'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import PrimaryButton from '@/components/PrimaryButton';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface Props {
  withCartSummary?: boolean;
  selectedServices?: string;
}

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  panier: string;
  consentement: boolean;
}

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export default function DemandeDevisForm({ withCartSummary = true, selectedServices }: Props) {
  const { getCartSummary, totalItems, totalPrice } = useCart();

  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    panier: '',
    consentement: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: null, message: '' });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => {
    if (selectedServices) {
      setFormData(prev => ({
        ...prev,
        panier: selectedServices.replace(/,/g, ', '),
      }));
    } else if (withCartSummary) {
      setFormData(prev => ({
        ...prev,
        panier: getCartSummary()
      }));
    }
  }, [selectedServices, withCartSummary, getCartSummary]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const input = e.target as HTMLInputElement;
  
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? input.checked : value,
    }));
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    if (!turnstileToken) {
      setStatus({ type: 'error', message: 'Veuillez compléter la vérification de sécurité.' });
      setIsSubmitting(false);
      return;
    }

    const submitData = new FormData();
    submitData.append('nom', formData.nom);
    submitData.append('prenom', formData.prenom);
    submitData.append('email', formData.email);
    submitData.append('telephone', formData.telephone);
    submitData.append('adresse', formData.adresse);
    submitData.append('panier', formData.panier);
    submitData.append('cf-turnstile-response', turnstileToken);

    try {
      const response = await fetch('https://xulinos.xyz-agency.com/wp-json/contact-form-7/v1/contact-forms/265/feedback', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (result.status === 'mail_sent') {
        setStatus({ type: 'success', message: 'Votre demande de devis a été envoyée avec succès !' });
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          adresse: '',
          panier: withCartSummary ? getCartSummary() : '',
          consentement: false,
        });
      } else {
        throw new Error(result.message || 'Erreur lors de l\'envoi du formulaire');
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Erreur lors de l\'envoi. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setTurnstileToken('dev-token');
  }, []);

  return (
    <div className={
      withCartSummary
        ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
        : "max-w-xl mx-auto" // centre le formulaire en mode sans panier
    }>
      {/* Formulaire */}
      <div className="bg-primary rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Vos informations</h2>

        {status.type && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            status.type === 'success'
              ? 'bg-green-600/20 text-green-400 border border-green-600/30'
              : 'bg-red-600/20 text-red-400 border border-red-600/30'
          }`}>
            {status.type === 'success' ? <FaCheckCircle size={20} /> : <FaExclamationTriangle size={20} />}
            <p>{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nom" className="block text-white font-medium mb-2">Nom *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label htmlFor="prenom" className="block text-white font-medium mb-2">Prénom *</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20"
                placeholder="Votre prénom"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="telephone" className="block text-white font-medium mb-2">Téléphone *</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20"
              placeholder="01 23 45 67 89"
            />
          </div>

          <div>
            <label htmlFor="adresse" className="block text-white font-medium mb-2">Adresse *</label>
            <textarea
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 resize-none"
              placeholder="Votre adresse complète"
            />
          </div>

          {(withCartSummary || selectedServices) && (
            <div>
              <label htmlFor="panier" className="block text-white font-medium mb-2">
                {selectedServices ? "Services sélectionnés" : "Détail du panier"}
              </label>
              <textarea
                id="panier"
                name="panier"
                value={formData.panier}
                onChange={handleInputChange}
                rows={selectedServices ? 2 : 6}
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-dark text-white border border-white/20 resize-none"
              />
            </div>
          )}
        <div>
          <label className="flex items-start gap-2 text-sm text-white">
            <input
              type="checkbox"
              name="consentement"
              checked={formData.consentement}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
            <span>
              J'accepte que mes données soient utilisées uniquement dans le cadre de ma demande de devis,
              conformément à la <a href="/politique-de-confidentialite" className="underline text-white/80 hover:text-white">politique de confidentialité</a>.
            </span>
          </label>
        </div>

          <PrimaryButton
            type="submit"
            name={isSubmitting ? "Envoi en cours..." : "Envoyer"}
            disabled={isSubmitting}
            className="w-full py-4 text-lg bg-wenge"
          />
        </form>
      </div>

      {withCartSummary && (
        <div className="bg-primary rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Résumé de votre commande</h2>

          {totalItems === 0 ? (
            <p className="text-white/70">Votre panier est vide.</p>
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
      )}
    </div>
  );
}
