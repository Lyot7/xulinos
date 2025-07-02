'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { apiRoutes, getRouteKeyFromPath, ApiRoute } from '@/utils/apiRoutes';

interface WordPressData {
  [key: string]: any;
}

interface WordPressDataState {
  data: WordPressData;
  loading: boolean;
  error: Error | null;
}

export const useWordPressData = () => {
  const pathname = usePathname();
  const [state, setState] = useState<WordPressDataState>({
    data: {},
    loading: true,
    error: null,
  });

  // Function to fetch data from a specific endpoint
  const fetchData = useCallback(async (route: ApiRoute) => {
    try {
      console.log(`Fetching data from ${route.key} endpoint: ${route.endpoint}`);
      const response = await fetch(route.endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${route.key}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Data fetched successfully for ${route.key}:`, data);
      setState((prevState) => ({
        ...prevState,
        data: {
          ...prevState.data,
          [route.key]: data,
        },
      }));
      return data;
    } catch (error) {
      console.error(`Error fetching ${route.key}:`, error);
      setState((prevState) => ({
        ...prevState,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
      return null;
    }
  }, []);

  // Main function to load data with prioritization
  useEffect(() => {
    const loadData = async () => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      
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
      
      // Fetch the current route first
      if (currentRouteKey && apiRoutes[currentRouteKey]) {
        console.log(`Fetching current route first: ${currentRouteKey}`);
        await fetchData(apiRoutes[currentRouteKey]);
      }
      
      // Then fetch the rest in order of priority
      const otherRoutes = routesToFetch.filter(route => 
        route.key !== currentRouteKey
      );
      
      console.log(`Fetching ${otherRoutes.length} other routes in priority order`);
      
      // Use Promise.all to fetch the rest in parallel
      await Promise.all(
        otherRoutes.map(route => fetchData(route))
      );
      
      setState((prevState) => ({ ...prevState, loading: false }));
      console.log('All data fetching complete');
    };
    
    loadData();
  }, [pathname, fetchData]);

  return state;
};

export default useWordPressData; 