'use client';

import React, { ReactNode } from 'react';
import { WordPressProvider } from '@/context/WordPressContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface WordPressProviderWrapperProps {
  children: ReactNode;
}

export const WordPressProviderWrapper: React.FC<WordPressProviderWrapperProps> = ({ children }) => {
  return (
    <WordPressProvider>
      <Header />
      {children}
      <Footer />
    </WordPressProvider>
  );
}; 