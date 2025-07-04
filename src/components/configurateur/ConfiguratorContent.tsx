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
  selectedModelName?: string;
  selectedWoodName?: string;
  selectedEngravingName?: string;
}

export default function ConfiguratorContent({
  currentStep,
  setCurrentStep,
  nextStep,
  handleFormSubmit,
  onStateChange,
  selectedModelName: parentSelectedModelName,
  selectedWoodName: parentSelectedWoodName,
  selectedEngravingName: parentSelectedEngravingName
}: ConfiguratorContentProps) {
  const { addItem } = useCart();
  const { stepData, allStepsData, loading } = useConfiguratorData(currentStep);
  
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedWood, setSelectedWood] = useState<string>('');
  const [selectedEngraving, setSelectedEngraving] = useState<string>('');
  const [selectedModelName, setSelectedModelName] = useState<string>('');
  const [selectedWoodName, setSelectedWoodName] = useState<string>('');
  const [selectedEngravingName, setSelectedEngravingName] = useState<string>('');
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
        selectedModel: selectedModelName || selectedModel,
        selectedWood: selectedWoodName || selectedWood,
        selectedEngraving: selectedEngravingName || selectedEngraving,
        formData
      });
    }
  }, [selectedModel, selectedWood, selectedEngraving, selectedModelName, selectedWoodName, selectedEngravingName, formData, onStateChange]);

  const clearSearchTerms = () => {
    setModelSearchTerm('');
    setWoodSearchTerm('');
    setEngravingSearchTerm('');
  };

  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
    clearSearchTerms();
  };

  const handleFormSubmitInternal = async () => {
    // Ajouter le couteau configuré au panier
    const selectedModelData = (allStepsData[1] && allStepsData[1].models) ? allStepsData[1].models.find(m => m.id === selectedModel) : null;
    const selectedWoodData = (allStepsData[2] && allStepsData[2].woods) ? allStepsData[2].woods.find(w => w.id === selectedWood) : null;
    const selectedEngravingData = (allStepsData[3] && allStepsData[3].patterns) ? allStepsData[3].patterns.find(e => e.id === selectedEngraving) : null;
    
    const customizations = {
      'Modèle': selectedModelData?.name || 'Personnalisé',
      'Bois': selectedWoodData?.name || 'Non spécifié',
      'Guillochage': selectedEngravingData?.name || 'Aucun',
      'Gravure lame': formData.bladeEngraving || 'Aucune',
      'Gravure manche': formData.handleEngraving || 'Aucune',
      'Autres détails': formData.otherDetails || 'Aucun',
      'Email': formData.email || 'Non renseigné',
      ...formData
    };

    let message = '';
    Object.entries(customizations).forEach(([key, value]) => {
      message += `${key} : ${value}\n`;
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.email || 'Client configurateur',
          objet: 'Nouvelle configuration couteau personnalisée',
          message,
          type: 'configurateur'
        })
      });
      const result = await response.json();
      if (response.ok && result.success && result.mailtoLink) {
        window.location.href = result.mailtoLink;
      } else {
        alert(result.error || 'Erreur lors de la préparation de l’email.');
      }
    } catch (error) {
      console.error('Erreur lors de l’envoi du mail configurateur :', error);
      alert('Erreur lors de l’envoi du mail.');
    }

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
              setSelectedModelName={setSelectedModelName}
              modelSearchTerm={modelSearchTerm}
              setModelSearchTerm={setModelSearchTerm}
            />
          </div>
        );

      case 2:
        return (
          <div>
            <WoodSelection
              stepData={stepData}
              selectedWood={selectedWood}
              setSelectedWood={setSelectedWood}
              setSelectedWoodName={setSelectedWoodName}
              woodSearchTerm={woodSearchTerm}
              setWoodSearchTerm={setWoodSearchTerm}
            />
          </div>
        );

      case 3:
        return (
          <div>
            <EngravingSelection
              stepData={stepData}
              selectedEngraving={selectedEngraving}
              setSelectedEngraving={setSelectedEngraving}
              setSelectedEngravingName={setSelectedEngravingName}
              engravingSearchTerm={engravingSearchTerm}
              setEngravingSearchTerm={setEngravingSearchTerm}
            />
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
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 lg:py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Chargement...</p>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
}