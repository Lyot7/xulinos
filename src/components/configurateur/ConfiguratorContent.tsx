import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useConfiguratorData } from '@/hooks/useConfiguratorData';
import { ConfiguratorFormData } from '@/types/configurateur';
import ModelSelection from './ModelSelection';
import WoodSelection from './WoodSelection';
import EngravingSelection from './EngravingSelection';
import PersonalizationForm from './PersonalizationForm';
import ConfigurationSummary from './ConfigurationSummary';
import StepPreview from './StepPreview';
import LoadingIndicator from './LoadingIndicator';

interface ConfiguratorContentProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  handleFormSubmit: () => void;
  onStateChange?: (state: {
    selectedModel: string;
    selectedWood: string;
    selectedEngraving: string;
    formData: ConfiguratorFormData;
  }) => void;
}

export default function ConfiguratorContent({
  currentStep,
  setCurrentStep,
  nextStep,
  handleFormSubmit,
  onStateChange
}: ConfiguratorContentProps) {
  const { addItem } = useCart();
  const { stepData, allStepsData, loading } = useConfiguratorData(currentStep);
  
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedWood, setSelectedWood] = useState<string>('');
  const [selectedEngraving, setSelectedEngraving] = useState<string>('');
  const [modelSearchTerm, setModelSearchTerm] = useState<string>('');
  const [woodSearchTerm, setWoodSearchTerm] = useState<string>('');
  const [engravingSearchTerm, setEngravingSearchTerm] = useState<string>('');
  const [formData, setFormData] = useState<ConfiguratorFormData>({
    bladeEngraving: '',
    handleEngraving: '',
    otherDetails: '',
    email: '',
  });

  // Notifier les changements d'état au parent
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        selectedModel,
        selectedWood,
        selectedEngraving,
        formData
      });
    }
  }, [selectedModel, selectedWood, selectedEngraving, formData, onStateChange]);

  const clearSearchTerms = () => {
    setModelSearchTerm('');
    setWoodSearchTerm('');
    setEngravingSearchTerm('');
  };

  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
    clearSearchTerms();
  };

  const handleFormSubmitInternal = () => {
    // Ajouter le couteau configuré au panier
    const selectedModelData = (allStepsData[1] && allStepsData[1].models) ? allStepsData[1].models.find(m => m.id === selectedModel) : null;
    const selectedWoodData = (allStepsData[2] && allStepsData[2].woods) ? allStepsData[2].woods.find(w => w.id === selectedWood) : null;
    const selectedEngravingData = (allStepsData[3] && allStepsData[3].patterns) ? allStepsData[3].patterns.find(e => e.id === selectedEngraving) : null;
    
    const customizations = {
      'Modèle': selectedModelData?.name || 'Personnalisé',
      'Bois': selectedWoodData?.name || 'Non spécifié',
      'Gravure': selectedEngravingData?.name || 'Aucune',
      'Gravure lame': formData.bladeEngraving || 'Aucune',
      'Gravure manche': formData.handleEngraving || 'Aucune',
      'Autres détails': formData.otherDetails || 'Aucun',
    };

    // Prix estimé basé sur la complexité
    let estimatedPrice = 350; // Prix de base
    if (formData.bladeEngraving) estimatedPrice += 50;
    if (formData.handleEngraving) estimatedPrice += 30;
    if (formData.otherDetails) estimatedPrice += 20;

    addItem({
      id: `config-${Date.now()}`, // ID unique basé sur le timestamp
      name: `Couteau configuré - ${selectedModelData?.name || 'Personnalisé'}`,
      price: estimatedPrice,
      description: `Couteau artisanal personnalisé selon vos spécifications`,
      image: selectedModelData?.image || '/images/knives/desosseur_en_bois_de_noyer/desosseur_en_bois_de_noyer.png',
      type: 'configurateur',
      customizations,
    });

    handleFormSubmit();
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <ModelSelection
              stepData={stepData}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              modelSearchTerm={modelSearchTerm}
              setModelSearchTerm={setModelSearchTerm}
            />
            <StepPreview allStepsData={allStepsData} currentStep={currentStep} />
          </div>
        );

      case 2:
        return (
          <div>
            <WoodSelection
              stepData={stepData}
              selectedWood={selectedWood}
              setSelectedWood={setSelectedWood}
              woodSearchTerm={woodSearchTerm}
              setWoodSearchTerm={setWoodSearchTerm}
            />
            <StepPreview allStepsData={allStepsData} currentStep={currentStep} />
          </div>
        );

      case 3:
        return (
          <div>
            <EngravingSelection
              stepData={stepData}
              selectedEngraving={selectedEngraving}
              setSelectedEngraving={setSelectedEngraving}
              engravingSearchTerm={engravingSearchTerm}
              setEngravingSearchTerm={setEngravingSearchTerm}
            />
            <StepPreview allStepsData={allStepsData} currentStep={currentStep} />
          </div>
        );

      case 4:
        return (
          <div>
            <PersonalizationForm
              stepData={stepData}
              formData={formData}
              setFormData={setFormData}
            />
            <StepPreview allStepsData={allStepsData} currentStep={currentStep} />
          </div>
        );

      case 5:
        return (
          <ConfigurationSummary
            stepData={stepData}
            allStepsData={allStepsData}
            formData={formData}
            selectedModel={selectedModel}
            selectedWood={selectedWood}
            selectedEngraving={selectedEngraving}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <LoadingIndicator allStepsData={allStepsData} loading={loading} />
      {renderContent()}
    </div>
  );
}