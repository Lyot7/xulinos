import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useConfiguratorData } from '@/hooks/useConfiguratorData';
import { ConfiguratorFormData } from '@/types/configurateur';
import ModelSelection from './ModelSelection';
import WoodSelection from './WoodSelection';
import EngravingSelection from './EngravingSelection';
import PersonalizationForm from './PersonalizationForm';
import ConfigurationSummary from './ConfigurationSummary';

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
  const { stepData, loading } = useConfiguratorData(currentStep);
  
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
    const selectedModelData = (stepData && stepData.models) ? stepData.models.find(m => m.id === selectedModel) : null;
    const selectedWoodData = (stepData && stepData.woods) ? stepData.woods.find(w => w.id === selectedWood) : null;
    const selectedEngravingData = (stepData && stepData.patterns) ? stepData.patterns.find(e => e.id === selectedEngraving) : null;
    
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="text-white mt-4">Chargement...</p>
      </div>
    );
  }

  switch (currentStep) {
    case 1:
      return (
        <ModelSelection
          stepData={stepData}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          modelSearchTerm={modelSearchTerm}
          setModelSearchTerm={setModelSearchTerm}
        />
      );

    case 2:
      return (
        <WoodSelection
          stepData={stepData}
          selectedWood={selectedWood}
          setSelectedWood={setSelectedWood}
          woodSearchTerm={woodSearchTerm}
          setWoodSearchTerm={setWoodSearchTerm}
        />
      );

    case 3:
      return (
        <EngravingSelection
          stepData={stepData}
          selectedEngraving={selectedEngraving}
          setSelectedEngraving={setSelectedEngraving}
          engravingSearchTerm={engravingSearchTerm}
          setEngravingSearchTerm={setEngravingSearchTerm}
        />
      );

    case 4:
      return (
        <PersonalizationForm
          stepData={stepData}
          formData={formData}
          setFormData={setFormData}
        />
      );

    case 5:
      return (
        <ConfigurationSummary
          stepData={stepData}
          formData={formData}
          selectedModel={selectedModel}
          selectedWood={selectedWood}
          selectedEngraving={selectedEngraving}
        />
      );

    default:
      return null;
  }
}

// Export des états pour la navigation
export { ConfiguratorContent }; 