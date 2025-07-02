'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { apiRoutes, getRouteKeyFromPath, ApiRoute } from '@/utils/apiRoutes';

// Cache global pour stocker les données entre les rendus
const globalCache: Record<string, any> = {};

interface WordPressData {
  [key: string]: any;
}

interface WordPressDataState {
  data: WordPressData;
  loading: boolean;
  error: Error | null;
  routeErrors: Record<string, Error | null>;
}

export const useWordPressData = () => {
  const pathname = usePathname();
  const [state, setState] = useState<WordPressDataState>({
    data: globalCache, // Utiliser le cache global comme état initial
    loading: Object.keys(globalCache).length === 0, // Si le cache est vide, on est en chargement
    error: null,
    routeErrors: {},
  });
  
  // Référence pour suivre les requêtes en cours
  const fetchingRef = useRef<Record<string, boolean>>({});
  const isMountedRef = useRef(true);
  
  // Fonction pour vérifier si une route a déjà été chargée
  const isRouteLoaded = useCallback((routeKey: string): boolean => {
    return !!state.data[routeKey] || !!fetchingRef.current[routeKey];
  }, [state.data]);

  // Function to fetch data from a specific endpoint
  const fetchData = useCallback(async (route: ApiRoute) => {
    if (!route || !route.endpoint) {
      console.error('Invalid route provided to fetchData');
      return null;
    }

    // Si la route est déjà en cours de chargement ou déjà chargée, ne pas refaire la requête
    if (fetchingRef.current[route.key]) {
      console.log(`Skip fetching ${route.key} - already in progress`);
      return null;
    }

    // Si la route est déjà dans le cache et n'est pas la route actuelle, utiliser le cache
    if (globalCache[route.key] && route.key !== getRouteKeyFromPath(pathname)) {
      console.log(`Using cached data for ${route.key}`);
      return globalCache[route.key];
    }

    try {
      // Marquer cette route comme en cours de chargement
      fetchingRef.current[route.key] = true;
      
      console.log(`Fetching data from ${route.key} endpoint: ${route.endpoint}`);
      
      // Use a basic fetch without AbortController to avoid issues
      const response = await fetch(route.endpoint, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Désactiver le cache du navigateur pour éviter les problèmes de données périmées
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${route.key}: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Data fetched successfully for ${route.key}`);
      
      // Mettre à jour le cache global
      globalCache[route.key] = data;
      
      // Update state safely using functional update
      if (isMountedRef.current) {
        setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            [route.key]: data,
          },
          routeErrors: {
            ...prevState.routeErrors,
            [route.key]: null,
          },
        }));
      }
      
      // Marquer cette route comme terminée
      fetchingRef.current[route.key] = false;
      
      return data;
    } catch (error: any) {
      console.error(`Error fetching ${route.key}:`, error);
      
      // Stocker l'erreur pour cette route spécifique
      const routeError = error instanceof Error ? error : new Error(String(error));
      
      if (isMountedRef.current) {
        setState(prevState => {
          const newRouteErrors = {
            ...prevState.routeErrors,
            [route.key]: routeError,
          };
          
          // Pour les routes optionnelles, ne pas définir l'erreur globale
          if (route.optional) {
            return {
              ...prevState,
              routeErrors: newRouteErrors,
            };
          }
          
          // Pour les routes non optionnelles, définir également l'erreur globale
          return {
            ...prevState,
            routeErrors: newRouteErrors,
            error: routeError,
          };
        });
      }
      
      // Marquer cette route comme terminée même en cas d'erreur
      fetchingRef.current[route.key] = false;
      
      return null;
    }
  }, [pathname]); // Dépendance à pathname pour détecter les changements de page

  // Main function to load data with prioritization
  useEffect(() => {
    isMountedRef.current = true;
    
    const loadData = async () => {
      if (!isMountedRef.current) return;
      
      // Ne pas réinitialiser l'état loading si nous avons déjà des données
      if (Object.keys(state.data).length === 0) {
        setState(prevState => ({ 
          ...prevState, 
          loading: true, 
          error: null,
        }));
      }
      
      try {
        // Get the current page route key
        const currentRouteKey = getRouteKeyFromPath(pathname);
        console.log(`Current path: ${pathname}, Route key: ${currentRouteKey}`);
        
        // Create a prioritized list of routes to fetch
        let routesToFetch = Object.values(apiRoutes).sort((a, b) => a.priority - b.priority);
        
        // If we have a current route, move it to the front
        if (currentRouteKey) {
          const currentRoute = apiRoutes[currentRouteKey];
          if (currentRoute) {
            console.log(`Prioritizing current route: ${currentRouteKey}`);
            routesToFetch = [
              currentRoute,
              ...routesToFetch.filter(route => route.key !== currentRouteKey),
            ];
          }
        }
        
        // Fetch the current route first (toujours refetch la route actuelle)
        if (currentRouteKey && apiRoutes[currentRouteKey] && isMountedRef.current) {
          console.log(`Fetching current route first: ${currentRouteKey}`);
          await fetchData(apiRoutes[currentRouteKey]);
        }
        
        // Then fetch the rest in order of priority, but only if they ne sont pas déjà chargées
        const otherRoutes = routesToFetch.filter(route => 
          route.key !== currentRouteKey && !isRouteLoaded(route.key)
        );
        
        if (isMountedRef.current && otherRoutes.length > 0) {
          console.log(`Fetching ${otherRoutes.length} other routes in priority order`);
          
          // Sequential fetching to avoid overwhelming the server
          for (const route of otherRoutes) {
            if (!isMountedRef.current) break;
            
            try {
              await fetchData(route);
            } catch (routeError) {
              // Ignorer les erreurs des routes individuelles ici
              console.warn(`Skipping error for route ${route.key} to continue loading other routes`);
            }
          }
        }
        
        if (isMountedRef.current) {
          setState(prevState => ({ ...prevState, loading: false }));
          console.log('All data fetching complete');
        }
      } catch (error: any) {
        if (isMountedRef.current) {
          console.error('Error in loadData:', error);
          setState(prevState => ({ 
            ...prevState, 
            loading: false,
            error: error instanceof Error ? error : new Error(String(error))
          }));
        }
      }
    };
    
    loadData();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [pathname, fetchData, isRouteLoaded]);

  return state;
};

export default useWordPressData; 