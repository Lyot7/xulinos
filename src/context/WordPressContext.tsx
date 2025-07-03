'use client';

import React, { createContext, useContext, ReactNode, useEffect, useMemo, useState } from 'react';
import useWordPressData from '@/hooks/useWordPressData';
import { processCouteauxImages } from '@/utils/wordpressApi';

interface WordPressContextType {
  data: Record<string, any>;
  loading: boolean;
  error: Error | null;
  routeErrors: Record<string, Error | null>;
  hasRouteError: (routeKey: string) => boolean;
  isRouteLoaded: (routeKey: string) => boolean;
}

const WordPressContext = createContext<WordPressContextType | undefined>(undefined);

export const WordPressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data, loading, error, routeErrors } = useWordPressData();
  
  // Log the context data only when it changes significantly
  useEffect(() => {
    // Éviter de logger à chaque rendu
    console.log('WordPress Context Data:', Object.keys(data));
    console.log('WordPress Context Loading State:', loading);
    
    if (error) {
      console.error('WordPress Context Error:', error);
    }
    
    // Log route-specific errors
    const routeErrorKeys = Object.keys(routeErrors || {}).filter(key => routeErrors[key] !== null);
    if (routeErrorKeys.length > 0) {
      console.warn('WordPress Route Errors:', 
        routeErrorKeys.reduce((acc, key) => {
          acc[key] = routeErrors[key]?.message || 'Unknown error';
          return acc;
        }, {} as Record<string, string>)
      );
    }
  }, [loading, error, routeErrors]);

  // Helper function to check if a specific route has an error
  const hasRouteError = (routeKey: string): boolean => {
    return !!routeErrors && !!routeErrors[routeKey];
  };
  
  // Helper function to check if a specific route is loaded
  const isRouteLoaded = (routeKey: string): boolean => {
    return !!data && !!data[routeKey];
  };
  
  // Mémoriser la valeur du contexte pour éviter les rendus inutiles
  const contextValue = useMemo(() => ({
    data,
    loading,
    error,
    routeErrors,
    hasRouteError,
    isRouteLoaded
  }), [data, loading, error, routeErrors]);

  return (
    <WordPressContext.Provider value={contextValue}>
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
  const { data, loading, error, hasRouteError, isRouteLoaded } = useWordPressContext();
  
  // Log when this specific page data is accessed, mais seulement une fois
  useEffect(() => {
    console.log(`Accessing page data for key: ${pageKey}`);
    console.log(`Page data available:`, data[pageKey] || null);
  }, [pageKey, isRouteLoaded(pageKey)]);
  
  return {
    pageData: data[pageKey] || null,
    loading: loading && !isRouteLoaded(pageKey),
    error: hasRouteError(pageKey) ? error : null,
    hasError: hasRouteError(pageKey),
    isLoaded: isRouteLoaded(pageKey)
  };
};

export const useCouteauxData = () => {
  const { data, loading, error, hasRouteError, isRouteLoaded } = useWordPressContext();
  const [processedCouteaux, setProcessedCouteaux] = useState<any[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  
  // Process couteaux images when data is loaded
  useEffect(() => {
    const processImages = async () => {
      if (isRouteLoaded('couteaux') && Array.isArray(data['couteaux'])) {
        setImagesLoading(true);
        try {
          const processed = await processCouteauxImages(data['couteaux']);
          setProcessedCouteaux(processed);
          console.log('Processed couteaux with images:', processed);
        } catch (error) {
          console.error('Error processing couteaux images:', error);
          setProcessedCouteaux(data['couteaux'] || []);
        } finally {
          setImagesLoading(false);
        }
      }
    };
    
    processImages();
  }, [isRouteLoaded('couteaux'), data['couteaux']]);
  
  // Log when couteaux data is accessed, mais seulement une fois
  useEffect(() => {
    if (isRouteLoaded('couteaux')) {
      console.log(`Accessing couteaux data`);
      console.log(`Couteaux data available:`, data['couteaux'] || []);
      console.log(`Number of couteaux:`, data['couteaux'] ? data['couteaux'].length : 0);
    }
  }, [isRouteLoaded('couteaux'), data]);
  
  return {
    couteaux: processedCouteaux.length > 0 ? processedCouteaux : (Array.isArray(data['couteaux']) ? data['couteaux'] : []),
    loading: (loading && !isRouteLoaded('couteaux')) || imagesLoading,
    error: hasRouteError('couteaux') ? error : null,
    hasError: hasRouteError('couteaux'),
    isLoaded: isRouteLoaded('couteaux') && !imagesLoading
  };
}; 