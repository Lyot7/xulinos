'use client';

import { useState, useEffect } from 'react';
import { fetchWordPressData, parseWordPressContent } from '../utils/wordpressApi';

interface LegalPageData {
  title: string;
  content: string;
  date: string;
  loading: boolean;
  error: string | null;
}

export const useLegalPage = (pageKey: 'cgv' | 'configuration' | 'mentions'): LegalPageData => {
  const [data, setData] = useState<LegalPageData>({
    title: '',
    content: '',
    date: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await fetchWordPressData(pageKey);
        
        if (!response) {
          throw new Error('Impossible de récupérer les données');
        }

        // Traitement UTF-8 et préservation des balises HTML
        const title = response.title?.rendered || response.title || '';
        const content = parseWordPressContent(response.content);
        const date = response.date ? new Date(response.date).toLocaleDateString('fr-FR') : '';

        setData({
          title,
          content,
          date,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error(`Erreur lors du chargement de la page ${pageKey}:`, error);
        setData({
          title: '',
          content: '',
          date: '',
          loading: false,
          error: 'Erreur lors du chargement de la page',
        });
      }
    };

    fetchData();
  }, [pageKey]);

  return data;
}; 