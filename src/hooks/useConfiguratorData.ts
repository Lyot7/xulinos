import { useState, useEffect } from 'react';
import { useWordPressData } from '@/hooks/useWordPressData';
import { getTestDataForStep } from '@/mockData/configurateur-mock-data';
import { adaptACFDataForStep, USE_TEST_DATA } from '@/utils/configurateur-utils';
import { ConfiguratorStepData } from '@/types/configurateur';

export const useConfiguratorData = (currentStep: number) => {
  const { data: wordpressData, loading: wordpressLoading, error: wordpressError } = useWordPressData();
  
  const [allStepsData, setAllStepsData] = useState<Record<number, ConfiguratorStepData>>({});
  const [stepData, setStepData] = useState<ConfiguratorStepData>({});

  // Charger toutes les données des étapes en même temps
  useEffect(() => {
    if (USE_TEST_DATA) {
      console.log('Using test data (USE_TEST_DATA = true)');
      const allData: Record<number, ConfiguratorStepData> = {};
      for (let step = 1; step <= 5; step++) {
        allData[step] = getTestDataForStep(step);
      }
      setAllStepsData(allData);
      return;
    }

    if (wordpressData && typeof wordpressData === 'object') {
      const allData: Record<number, ConfiguratorStepData> = {};
      
      // Traiter les données pour chaque étape
      for (let step = 1; step <= 5; step++) {
        const routeKey = `configurateur${step}`;
        let currentStepWordpressData = null;
        
        try {
          currentStepWordpressData = (wordpressData as Record<string, any>)[routeKey];
        } catch (error) {
          console.log(`Error accessing WordPress data for step ${step}:`, error);
          currentStepWordpressData = null;
        }
        
        if (currentStepWordpressData && typeof currentStepWordpressData === 'object') {
          const wpData = currentStepWordpressData as any;
          
          console.log(`ACF data for step ${step}:`, wpData.acf);
          
          // Vérifier si les données contiennent des champs ACF
          if (wpData.acf && Object.keys(wpData.acf).length > 0) {
            // Adapter les données ACF au format attendu par le composant
            const adaptedData = adaptACFDataForStep(wpData.acf, step);
            allData[step] = adaptedData;
          } else if (wpData.meta && Object.keys(wpData.meta).length > 0) {
            console.log(`Using meta data for step ${step}:`, wpData.meta);
            allData[step] = wpData.meta;
          } else {
            console.log(`No ACF or meta data found for step ${step}.`);
            allData[step] = {};
          }
        } else {
          console.log(`No data found for step ${step} (${routeKey})`);
          allData[step] = {};
        }
      }
      
      setAllStepsData(allData);
    }
  }, USE_TEST_DATA ? [] : [wordpressData]);

  // Mettre à jour les données de l'étape actuelle quand l'étape change
  useEffect(() => {
    if (allStepsData[currentStep]) {
      setStepData(allStepsData[currentStep]);
    } else {
      setStepData({});
    }
  }, [currentStep, allStepsData]);

  return {
    stepData,
    allStepsData,
    loading: wordpressLoading,
    error: wordpressError
  };
}; 