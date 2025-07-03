import { useState, useEffect } from 'react';
import { useWordPressData } from '@/hooks/useWordPressData';
import { getTestDataForStep } from '@/mockData/configurateur-mock-data';
import { adaptACFDataForStep, USE_TEST_DATA } from '@/utils/configurateur-utils';
import { ConfiguratorStepData } from '@/types/configurateur';

export const useConfiguratorData = (currentStep: number) => {
  const { data: wordpressData, loading: wordpressLoading, error: wordpressError } = USE_TEST_DATA ? 
    { data: {}, loading: false, error: null } : 
    useWordPressData();
  
  const [stepData, setStepData] = useState<ConfiguratorStepData>({});

  // Extraire les données de l'étape actuelle depuis WordPress ou utiliser les données de test
  useEffect(() => {
    if (USE_TEST_DATA) {
      console.log('Using test data (USE_TEST_DATA = true)');
      setStepData(getTestDataForStep(currentStep));
      return;
    }

    const routeKey = `configurateur${currentStep}`;
    let currentStepWordpressData = null;
    
    if (wordpressData && typeof wordpressData === 'object') {
      try {
        currentStepWordpressData = (wordpressData as Record<string, any>)[routeKey];
      } catch (error) {
        console.log('Error accessing WordPress data:', error);
        currentStepWordpressData = null;
      }
    }
    
    if (currentStepWordpressData && typeof currentStepWordpressData === 'object') {
      const wpData = currentStepWordpressData as any;
      
      // console.log(`--- Checking ACF data for ${routeKey} ---`);
      // console.log('Full WP data structure:', wpData);
      console.log('ACF data:', wpData.acf);
      // console.log('Meta data:', wpData.meta);
      // console.log('Content:', wpData.content);
      
      // Vérifier si les données contiennent des champs ACF
      if (wpData.acf && Object.keys(wpData.acf).length > 0) {
        // console.log('Using ACF data:', wpData.acf);
        // Adapter les données ACF au format attendu par le composant
        const adaptedData = adaptACFDataForStep(wpData.acf, currentStep);
        setStepData(adaptedData);
      } else if (wpData.meta && Object.keys(wpData.meta).length > 0) {
        console.log('Using meta data:', wpData.meta);
        setStepData(wpData.meta);
      } else {
        console.log('No ACF or meta data found.');
        setStepData({});
      }
    } else {
      console.log(`No data found for ${routeKey}`);
      setStepData({});
    }
  }, USE_TEST_DATA ? [currentStep] : [currentStep, wordpressData]);

  return {
    stepData,
    loading: wordpressLoading,
    error: wordpressError
  };
}; 