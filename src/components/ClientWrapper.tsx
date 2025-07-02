'use client';

import React, { ReactNode } from 'react';
import { WordPressProvider } from '@/context/WordPressContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';

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
      </CartProvider>
    </WordPressProvider>
  );
} 