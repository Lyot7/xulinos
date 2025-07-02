'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import useWordPressData from '@/hooks/useWordPressData';

interface WordPressContextType {
  data: Record<string, any>;
  loading: boolean;
  error: Error | null;
}

const WordPressContext = createContext<WordPressContextType | undefined>(undefined);

export const WordPressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data, loading, error } = useWordPressData();
  
  // Log the context data whenever it changes
  useEffect(() => {
    console.log('WordPress Context Data:', data);
    console.log('WordPress Context Loading State:', loading);
    if (error) {
      console.error('WordPress Context Error:', error);
    }
  }, [data, loading, error]);

  return (
    <WordPressContext.Provider value={{ data, loading, error }}>
      {children}
    </WordPressContext.Provider>
  );
};

export const useWordPressContext = (): WordPressContextType => {
  const context = useContext(WordPressContext);
  if (context === undefined) {
    throw new Error('useWordPressContext must be used within a WordPressProvider');
  }
  return context;
};

// Helper hooks for specific data types
export const usePageData = (pageKey: string) => {
  const { data, loading, error } = useWordPressContext();
  
  // Log when this specific page data is accessed
  useEffect(() => {
    console.log(`Accessing page data for key: ${pageKey}`);
    console.log(`Page data available:`, data[pageKey] || null);
  }, [pageKey, data]);
  
  return {
    pageData: data[pageKey] || null,
    loading,
    error,
  };
};

export const useCouteauxData = () => {
  const { data, loading, error } = useWordPressContext();
  
  // Log when couteaux data is accessed
  useEffect(() => {
    console.log(`Accessing couteaux data`);
    console.log(`Couteaux data available:`, data['couteaux'] || []);
    console.log(`Number of couteaux:`, data['couteaux'] ? data['couteaux'].length : 0);
  }, [data]);
  
  return {
    couteaux: data['couteaux'] || [],
    loading,
    error,
  };
}; 