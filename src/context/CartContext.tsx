'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types pour les articles du panier
export interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
  type: 'couteau' | 'configurateur' | 'service';
  customizations?: Record<string, any>; // Pour les couteaux configurés
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getCartSummary: () => string; // Pour le formulaire de devis
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  // Calculer les totaux avec des prix nettoyés
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const cleanPrice = formatPrice(item.price);
    return sum + (cleanPrice * item.quantity);
  }, 0);

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('xulinos-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('xulinos-cart', JSON.stringify(items));
  }, [items]);

  // Ajouter un article au panier
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    // Nettoyer le prix avant d'ajouter l'article
    const cleanItem = {
      ...newItem,
      price: formatPrice(newItem.price)
    };

    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === cleanItem.id);
      
      if (existingItem) {
        // Si l'article existe déjà, augmenter la quantité
        return currentItems.map(item =>
          item.id === cleanItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Sinon, ajouter un nouvel article
        return [...currentItems, { ...cleanItem, quantity: 1 }];
      }
    });
  };

  // Supprimer un article du panier
  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  // Mettre à jour la quantité d'un article
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Vider le panier
  const clearCart = () => {
    setItems([]);
  };

  // Gestion de l'ouverture/fermeture du panier
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Générer un résumé du panier pour le formulaire de devis
  const getCartSummary = (): string => {
    if (items.length === 0) {
      return 'Panier vide';
    }

    let summary = `Détail du panier (${totalItems} article${totalItems > 1 ? 's' : ''}):\n\n`;
    
    items.forEach((item, index) => {
      const cleanPrice = formatPrice(item.price);
      const subtotal = cleanPrice * item.quantity;
      
      summary += `${index + 1}. ${item.name}\n`;
      summary += `   - Prix unitaire: ${cleanPrice} €\n`;
      summary += `   - Quantité: ${item.quantity}\n`;
      summary += `   - Sous-total: ${subtotal} €\n`;
      
      if (item.type === 'configurateur' && item.customizations) {
        summary += `   - Personnalisations:\n`;
        Object.entries(item.customizations).forEach(([key, value]) => {
          summary += `     • ${key}: ${value}\n`;
        });
      }
      
      summary += `\n`;
    });
    
    summary += `TOTAL: ${totalPrice} €`;
    
    return summary;
  };

  // Note: Pas de prévention de scroll pour le panier (permet de naviguer en arrière-plan)

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    isCartOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    getCartSummary,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 