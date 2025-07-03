'use client';

import { useState, useEffect } from 'react';
import Stepper from '@/components/Stepper';
import ConfiguratorContent from '@/components/configurateur/ConfiguratorContent';
import { ConfiguratorFormData } from '@/types/configurateur';
import { useConfiguratorData } from '@/hooks/useConfiguratorData';

export default function ConfiguratorPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedWood, setSelectedWood] = useState<string>('');
  const [selectedEngraving, setSelectedEngraving] = useState<string>('');
  const [formData, setFormData] = useState<ConfiguratorFormData>({
    bladeEngraving: '',
    handleEngraving: '',
    otherDetails: '',
    email: '',
  });

  const { stepData, allStepsData, loading, error } = useConfiguratorData(currentStep);

  useEffect(() => {
    console.log('=== CONFIGURATOR PAGE DEBUG ===');
    console.log('Current step:', currentStep);
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Step data:', stepData);
    console.log('All steps data:', allStepsData);
    
    if (stepData && stepData.models) {
      console.log('Models found:', stepData.models.length);
      console.log('Models data:', stepData.models);
    } else {
      console.log('No models in stepData');
    }
    
    if (allStepsData[1] && allStepsData[1].models) {
      console.log('Models in step 1:', allStepsData[1].models.length);
      console.log('Step 1 models:', allStepsData[1].models);
    } else {
      console.log('No models in allStepsData[1]');
    }
  }, [currentStep, loading, error, stepData, allStepsData]);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      window.location.href = '/';
    }
  };

  const handleFormSubmit = () => {
    nextStep();
  };

  const handleStateChange = (state: {
    selectedModel: string;
    selectedWood: string;
    selectedEngraving: string;
    formData: ConfiguratorFormData;
  }) => {
    setSelectedModel(state.selectedModel);
    setSelectedWood(state.selectedWood);
    setSelectedEngraving(state.selectedEngraving);
    setFormData(state.formData);
  };

  const isFormValid = () => {
    // Check if there's an email in the standard email field
    if (formData.email && formData.email.trim()) {
      console.log('Valid email found in formData.email:', formData.email);
      return true;
    }
    
    // Check if any field contains an email (contains @ symbol and looks like email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasValidEmail = Object.values(formData).some(value => 
      value && typeof value === 'string' && emailRegex.test(value.trim())
    );
    
    console.log('Has valid email in any field:', hasValidEmail);
    console.log('All form values:', Object.values(formData));
    
    return hasValidEmail;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: 'var(--color-jet)' }}>
      {/* Image section - Top on mobile, Left on desktop */}
      <div className="w-full lg:w-1/2 h-64 lg:h-screen relative" style={{ backgroundColor: 'var(--color-wenge)' }}>
        <img 
          src="/images/knives/desosseur_en_bois_de_noyer/desosseur_en_bois_de_noyer.png" 
          alt="Désosseur en bois de noyer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content section - Bottom on mobile, Right on desktop */}
      <div className="w-full lg:w-1/2 lg:h-screen overflow-y-auto">
        {/* Stepper - Fixed at top */}
        <div className="p-4 sm:p-6 lg:p-8 pb-3 lg:pb-4">
          <Stepper currentStep={currentStep} totalSteps={5} />
        </div>
        
        {/* Content area */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="pb-4">
            <ConfiguratorContent
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              nextStep={nextStep}
              handleFormSubmit={handleFormSubmit}
              onStateChange={handleStateChange}
            />
          </div>
          
          {/* Navigation buttons - Directly after content */}
          <div className="py-4 sm:py-6 lg:py-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
              <button
                onClick={prevStep}
                className="w-full sm:w-auto px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-medium transition-all hover:opacity-90 text-sm lg:text-base"
                style={{
                  backgroundColor: "var(--color-pure-white)",
                  color: "var(--color-wenge)" 
                }}
              >
                {currentStep === 1 ? 'Retour à l\'accueil' : 'Revenir en arrière'}
              </button>
              
              {currentStep < 4 ? (
                              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !selectedModel) ||
                  (currentStep === 2 && !selectedWood) ||
                  (currentStep === 3 && !selectedEngraving)
                }
                className={`w-full sm:w-auto px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm lg:text-base ${
                  (currentStep === 1 && !selectedModel) ||
                  (currentStep === 2 && !selectedWood) ||
                  (currentStep === 3 && !selectedEngraving)
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: 'var(--color-wenge)',
                  color: 'var(--color-pure-white)'
                }}
              >
                  {currentStep === 3 ? "CHOISIR MON GUILLAUCHAGE ET CONTINUER" : "Valider mon choix et continuer".toUpperCase()}
                </button>
              ) : currentStep === 4 ? (
                <button
                  onClick={handleFormSubmit}
                  disabled={!isFormValid()}
                  className={`w-full sm:w-auto px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-all text-sm lg:text-base ${
                    !isFormValid()
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: 'var(--color-wenge)',
                    color: 'var(--color-pure-white)'
                  }}
                >
                  {"Valider mes personnalisations et terminer".toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full sm:w-auto px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium hover:opacity-90 transition-all text-sm lg:text-base"
                  style={{
                    backgroundColor: 'var(--color-wenge)',
                    color: 'var(--color-pure-white)'
                  }}
                >
                  Revenir vers l'accueil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
