'use client';

import React, { ReactNode } from 'react';
import { WordPressProvider } from '@/context/WordPressContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import CookieConsent from '@/components/CookieConsent';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <WordPressProvider>
      <CartProvider>
        <Header />
        {children}
        <Footer />
        <Cart />
        <CookieConsent />
      </CartProvider>
    </WordPressProvider>
  );
} 