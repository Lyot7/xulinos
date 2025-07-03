'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { FaTimes, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import PrimaryButton from './PrimaryButton';
import { useRouter } from 'next/navigation';
import { useSafeWordPressText } from '@/hooks/useWordPressText';
import { extractTextFromWordPress } from '@/utils/textEncoding';

const Cart: React.FC = () => {
  const {
    items,
    totalItems,
    totalPrice,
    isCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    closeCart,
  } = useCart();
  
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleDevis = () => {
    closeCart();
    router.push('/demande-devis');
  };

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => new Set(prev).add(itemId));
  };

  // Fonction utilitaire pour nettoyer et formater le prix
  const formatPrice = (price: any): number => {
    if (typeof price === 'number') {
      return price;
    }
    if (typeof price === 'string') {
      // Supprimer le symbole € et les espaces, puis convertir en nombre
      const cleanPrice = price.replace(/[€\s]/g, '').replace(',', '.');
      return parseFloat(cleanPrice) || 0;
    }
    return 0;
  };

  // Traiter toutes les données du panier en une fois
  const processedItems = useMemo(() => {
    return items.map(item => {
      // Utiliser les fonctions utilitaires directement au lieu des hooks
      const processedName = item.name ? 
        item.name
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .replace(/Ã©/g, 'é')
          .replace(/Ã¨/g, 'è')
          .replace(/Ã /g, 'à')
          .replace(/Ã¢/g, 'â')
          .replace(/Ãª/g, 'ê')
          .replace(/Ã®/g, 'î')
          .replace(/Ã´/g, 'ô')
          .replace(/Ã¹/g, 'ù')
          .replace(/Ã»/g, 'û')
          .replace(/Ã§/g, 'ç')
          : '';
      
      const processedDescription = extractTextFromWordPress(item.description);
      const cleanPrice = formatPrice(item.price);
      const subtotal = cleanPrice * item.quantity;
      
      // Traiter les personnalisations si elles existent
      const processedCustomizations = item.customizations ? 
        Object.fromEntries(
          Object.entries(item.customizations).map(([key, value]) => [
            key.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#039;/g, "'")
               .replace(/&nbsp;/g, ' ')
               .replace(/Ã©/g, 'é')
               .replace(/Ã¨/g, 'è')
               .replace(/Ã /g, 'à')
               .replace(/Ã¢/g, 'â')
               .replace(/Ãª/g, 'ê')
               .replace(/Ã®/g, 'î')
               .replace(/Ã´/g, 'ô')
               .replace(/Ã¹/g, 'ù')
               .replace(/Ã»/g, 'û')
               .replace(/Ã§/g, 'ç'),
            String(value).replace(/&amp;/g, '&')
                         .replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&quot;/g, '"')
                         .replace(/&#039;/g, "'")
                         .replace(/&nbsp;/g, ' ')
                         .replace(/Ã©/g, 'é')
                         .replace(/Ã¨/g, 'è')
                         .replace(/Ã /g, 'à')
                         .replace(/Ã¢/g, 'â')
                         .replace(/Ãª/g, 'ê')
                         .replace(/Ã®/g, 'î')
                         .replace(/Ã´/g, 'ô')
                         .replace(/Ã¹/g, 'ù')
                         .replace(/Ã»/g, 'û')
                         .replace(/Ã§/g, 'ç')
          ])
        ) : undefined;

      return {
        ...item,
        processedName,
        processedDescription,
        cleanPrice,
        subtotal,
        processedCustomizations,
      };
    });
  }, [items]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />
      
      {/* Panier */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-dark shadow-xl z-50 flex flex-col">
        {/* Header du panier */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            Mon panier ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            className="text-white hover:text-white/70 transition-colors p-2"
            aria-label="Fermer le panier"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Contenu du panier */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="text-white/50 mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                </svg>
              </div>
              <p className="text-white/70 text-lg mb-2">Votre panier est vide</p>
              <p className="text-white/50 text-sm">
                Ajoutez des couteaux pour commencer votre commande
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {processedItems.map((item) => {
                // Vérifier si l'image a échoué à charger
                const imageHasError = imageErrors.has(item.id);
                
                return (
                  <div key={item.id} className="bg-primary rounded-lg p-4">
                    <div className="flex gap-4">
                      {/* Image du produit */}
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-700 flex items-center justify-center">
                        {item.image && item.image !== "" && !imageHasError ? (
                          <Image
                            src={item.image}
                            alt={item.processedName}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(item.id)}
                          />
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white/50">
                            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM15 15V13.5C15 12.7 14.3 12 13.5 12S12 12.7 12 13.5V15H10V13.5C10 11.6 11.6 10 13.5 10S17 11.6 17 13.5V15H15ZM6 6H18V18H6V6Z"/>
                          </svg>
                        )}
                      </div>
                      
                      {/* Détails du produit */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {item.processedName}
                        </h3>
                        <p className="text-white/70 text-sm truncate">
                          {item.processedDescription}
                        </p>
                        <p className="text-white font-bold text-lg">
                          {item.cleanPrice} €
                        </p>
                        
                        {/* Personnalisations pour les couteaux configurés */}
                        {item.type === 'configurateur' && item.processedCustomizations && (
                          <div className="mt-2 space-y-1">
                            {Object.entries(item.processedCustomizations).slice(0, 2).map(([key, value]) => (
                              <p key={key} className="text-white/60 text-xs">
                                {key}: {value}
                              </p>
                            ))}
                            {Object.keys(item.processedCustomizations).length > 2 && (
                              <p className="text-white/60 text-xs">
                                +{Object.keys(item.processedCustomizations).length - 2} autres options
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Bouton supprimer */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/50 hover:text-red-400 transition-colors p-2"
                        aria-label="Supprimer cet article"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                    
                    {/* Contrôles de quantité */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                          aria-label="Diminuer la quantité"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="text-white font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                          aria-label="Augmenter la quantité"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      
                      <p className="text-white font-bold">
                        Sous-total: {item.subtotal} €
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {/* Bouton vider le panier */}
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full text-red-400 hover:text-red-300 text-sm py-2 transition-colors"
                >
                  Vider le panier
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer du panier */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-white text-lg font-medium">Total:</span>
              <span className="text-white text-2xl font-bold">{totalPrice} €</span>
            </div>
            
            {/* Bouton demander un devis */}
            <PrimaryButton
              name="Demander un devis"
              onClick={handleDevis}
              className="w-full py-4 text-lg"
            />
            
            <p className="text-white/60 text-xs text-center">
              Les prix sont indicatifs. Un devis personnalisé vous sera envoyé.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart; 