'use client';

import { useState } from 'react';
import Image from 'next/image';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

function Stepper({ currentStep, totalSteps }: StepperProps) {
  const steps = [
    { number: 1, label: 'Modèle' },
    { number: 2, label: 'Bois' },
    { number: 3, label: 'Guillochage' },
    { number: 4, label: 'Personnalisation' },
    { number: 5, label: 'Confirmation' }
  ];

  return (
    <div className="mb-6 lg:mb-8">
      {/* Mobile version - Simplified horizontal */}
      <div className="flex lg:hidden items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index + 1 <= currentStep
                  ? 'text-black'
                  : 'text-gray-300'
              }`}
              style={{
                backgroundColor: index + 1 <= currentStep 
                  ? 'var(--color-pure-white)' 
                  : '#6C6C6C'
              }}
            >
              {step.number}
            </div>
            {index < totalSteps - 1 && (
              <div
                className="w-8 h-[2px] mx-2"
                style={{
                  backgroundColor: index + 1 < currentStep 
                    ? 'var(--color-pure-white)' 
                    : '#6C6C6C'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Desktop version - With labels */}
      <div className="hidden lg:flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                  index + 1 <= currentStep
                    ? 'text-black'
                    : 'text-gray-300'
                }`}
                style={{
                  backgroundColor: index + 1 <= currentStep 
                    ? 'var(--color-pure-white)' 
                    : '#6C6C6C'
                }}
              >
                {step.number}
              </div>
              <div className={`mt-2 text-xs font-medium ${
                index + 1 <= currentStep ? 'text-white' : 'text-gray-400'
              }`}>
                {step.label}
              </div>
            </div>
            {index < totalSteps - 1 && (
              <div
                className="w-16 h-[2px] mx-4"
                style={{
                  backgroundColor: index + 1 < currentStep 
                    ? 'var(--color-pure-white)' 
                    : '#6C6C6C'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ModelOption {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface WoodOption {
  id: string;
  name: string;
  color: string;
}

interface EngravingOption {
  id: string;
  name: string;
  pattern: string;
}

const models: ModelOption[] = [
  { id: 'kiridashi', name: 'Kiridashi "Yoru"', description: 'Bois d\'ébène, acier damas', image: '/knife-1.jpg' },
  { id: 'damas', name: 'Le Damas sylvestre', description: 'Bois de santal, acier carbone, guillochage', image: '/knife-2.jpg' },
  { id: 'souverain', name: 'Le Souverain', description: 'Bois de fer, lame en acier poli, pliant', image: '/knife-3.jpg' },
];

const woods: WoodOption[] = [
  { id: 'noyer', name: 'Noyer foncé', color: 'var(--color-pure-white)' },
  { id: 'chene', name: 'Chêne', color: 'var(--color-pure-white)' },
  { id: 'erable', name: 'Érable', color: 'var(--color-pure-white)' },
  { id: 'merisier', name: 'Merisier', color: 'var(--color-pure-white)' },
  { id: 'hetre', name: 'Hêtre teinté', color: 'var(--color-pure-white)' },
  { id: 'acajou', name: 'Acajou', color: 'var(--color-pure-white)' },
];

const engravingPatterns: EngravingOption[] = [
  { id: 'snake', name: 'Snake', pattern: '∼∼∼∼∼∼∼∼∼' },
  { id: 'viking', name: 'Nœuds vikings', pattern: '◊◊◊◊◊◊◊◊◊' },
  { id: 'maple', name: 'Érable', pattern: '▼▼▼▼▼▼▼▼▼' },
  { id: 'geometric', name: 'Géométrique', pattern: '▲▼▲▼▲▼▲▼▲' },
  { id: 'tribal', name: 'Tribal', pattern: '≈≈≈≈≈≈≈≈≈' },
];

export default function ConfiguratorPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedWood, setSelectedWood] = useState<string>('');
  const [selectedEngraving, setSelectedEngraving] = useState<string>('');
  const [modelSearchTerm, setModelSearchTerm] = useState<string>('');
  const [woodSearchTerm, setWoodSearchTerm] = useState<string>('');
  const [engravingSearchTerm, setEngravingSearchTerm] = useState<string>('');
  const [fromExistingModel, setFromExistingModel] = useState(false);
  const [formData, setFormData] = useState({
    bladeEngraving: '',
    handleEngraving: '',
    otherDetails: '',
    email: '',
  });

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setModelSearchTerm('');
      setWoodSearchTerm('');  
      setEngravingSearchTerm('');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setModelSearchTerm('');
      setWoodSearchTerm('');
      setEngravingSearchTerm('');
    } else {
      setShowIntro(true);
      setCurrentStep(1);
    }
  };

  const handleFormSubmit = () => {
    nextStep();
  };

  const startFromExistingModel = () => {
    setFromExistingModel(true);
    setShowIntro(false);
    setCurrentStep(1);
  };

  const startFromScratch = () => {
    setFromExistingModel(false);
    setShowIntro(false);
    setCurrentStep(1);
  };

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(modelSearchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(modelSearchTerm.toLowerCase())
  );

  const filteredWoods = woods.filter(wood => 
    wood.name.toLowerCase().includes(woodSearchTerm.toLowerCase())
  );

  const filteredEngravingPatterns = engravingPatterns.filter(pattern => 
    pattern.name.toLowerCase().includes(engravingSearchTerm.toLowerCase())
  );

  const renderIntroPage = () => {
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
        <div className="w-full lg:w-1/2 min-h-screen lg:h-screen flex flex-col justify-center p-4 sm:p-6 lg:p-8">
          <div className="max-w-lg mx-auto lg:mx-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 text-white text-center lg:text-left">
              Configurateur
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-4 lg:mb-6 text-center lg:text-left">
              Bienvenue dans le configurateur de couteaux pliants artisanaux.
            </p>
            
            <p className="text-gray-300 mb-6 lg:mb-8 text-center lg:text-left">
              Sélectionnez un modèle parmi les créations existantes pour l'adapter à votre style ou 
              partez de zéro pour concevoir un couteau unique, entièrement façonné selon vos 
              envies.
            </p>
            
            <p className="text-gray-300 mb-8 lg:mb-12 text-center lg:text-left">
              Matériaux, finitions, mécanisme... chaque détail compte.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={startFromExistingModel}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center text-sm sm:text-base"
                style={{
                  backgroundColor: 'var(--color-wenge)',
                  color: 'var(--color-pure-white)'
                }}
              >
                <span className="mr-2">📋</span>
                Créer à partir d'un modèle existant
              </button>
              
              <button
                onClick={startFromScratch}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center text-sm sm:text-base"
                style={{
                  backgroundColor: 'var(--color-pure-white)',
                  color: 'var(--color-wenge)'
                }}
              >
                <span className="mr-2">⚙️</span>
                Configurer à partir de 0
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
              Sélectionnez un modèle comme base de votre création
            </h2>
            <div className="mb-4 lg:mb-6">
              <input
                type="text"
                placeholder="Recherchez par modèle, matériau ou couleur..."
                value={modelSearchTerm}
                onChange={(e) => setModelSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded-full bg-pure-white placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none text-deep-black text-sm sm:text-base"
                style={{
                  backgroundColor: 'var(--color-pure-white)',
                  color: 'var(--color-deep-black)',
                  borderColor: 'var(--color-gray-medium)',
                  borderWidth: '1px'
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
              {filteredModels.length === 0 ? (
                <div className="col-span-full text-center py-6 lg:py-8">
                  <p className="text-gray-400 text-base lg:text-lg">
                    Aucun modèle ne correspond à votre recherche "{modelSearchTerm}"
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-2">
                    Essayez avec des termes différents ou videz le champ de recherche
                  </p>
                </div>
              ) : (
                filteredModels.map((model) => (
                <div
                  key={model.id}
                  className={`rounded-lg p-2 lg:p-3 cursor-pointer transition-all ${
                    selectedModel === model.id ? 'ring-2 ring-white' : 'hover:opacity-80'
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div 
                    className="rounded-lg mb-2 lg:mb-3"
                    style={{ aspectRatio: '2/1' }}
                  >
                    <img 
                      src="/images/knives/kiridashi-yoru/kiridashi-yoru.png" 
                      alt={model.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-bold mb-1 text-sm lg:text-base" style={{ color: 'var(--color-pure-white)' }}>
                    {model.name}
                  </h3>
                  <p className="text-xs lg:text-sm" style={{ color: 'var(--color-gray-medium)' }}>
                    {model.description}
                  </p>
                </div>
                ))
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
              Choisissez le bois qui donnera du caractère à votre couteau
            </h2>
            <div className="mb-4 lg:mb-6">
              <input
                type="text"
                placeholder="Recherchez un type de bois (noyer, chêne, érable...)"
                value={woodSearchTerm}
                onChange={(e) => setWoodSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded-full bg-pure-white placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none text-deep-black text-sm sm:text-base"
                style={{
                  backgroundColor: 'var(--color-pure-white)',
                  color: 'var(--color-deep-black)',
                  borderColor: 'var(--color-gray-medium)',
                  borderWidth: '1px'
                }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
              {filteredWoods.length === 0 ? (
                <div className="col-span-full text-center py-6 lg:py-8">
                  <p className="text-gray-400 text-base lg:text-lg">
                    Aucun bois ne correspond à votre recherche "{woodSearchTerm}"
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-2">
                    Essayez avec des termes différents ou videz le champ de recherche
                  </p>
                </div>
              ) : (
                filteredWoods.map((wood) => (
                <div
                  key={wood.id}
                  className={`cursor-pointer transition-all p-2 ${
                    selectedWood === wood.id ? 'ring-2 ring-white rounded-lg' : 'hover:opacity-80'
                  }`}
                  onClick={() => setSelectedWood(wood.id)}
                >
                  <div
                    className="rounded-lg mb-2"
                    style={{ aspectRatio: '2/1' }}
                  >
                    <img 
                      src="/images/woods/noyer_foncer.png" 
                      alt={wood.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-white text-center font-medium text-xs sm:text-sm">{wood.name}</p>
                </div>
                ))
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
              Ajoutez un guillochage : une signature artisanale unique !
            </h2>
            <p className="text-gray-300 mb-4 lg:mb-6 text-sm sm:text-base">
              Le guillochage est une gravure réalisée à la lime sur le dos de la lame. Chaque motif est unique et apporte une touche d'élégance et de raffinement à votre couteau.
            </p>
            <div className="mb-4 lg:mb-6">
              <input
                type="text"
                placeholder="Recherchez un motif de guillochage (floral, géométrique...)"
                value={engravingSearchTerm}
                onChange={(e) => setEngravingSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 lg:py-3 rounded-full bg-pure-white text-deep-black placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none text-sm sm:text-base"
                style={{
                  backgroundColor: 'var(--color-pure-white)',
                  color: 'var(--color-deep-black)',
                  borderColor: 'var(--color-gray-medium)',
                  borderWidth: '1px'
                }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
              {filteredEngravingPatterns.length === 0 ? (
                <div className="col-span-full text-center py-6 lg:py-8">
                  <p className="text-gray-400 text-base lg:text-lg">
                    Aucun motif ne correspond à votre recherche "{engravingSearchTerm}"
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-2">
                    Essayez avec des termes différents ou videz le champ de recherche
                  </p>
                </div>
              ) : (
                filteredEngravingPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className={`rounded-lg p-3 lg:p-4 cursor-pointer transition-all text-center ${
                    selectedEngraving === pattern.id ? 'ring-2 ring-white' : 'hover:opacity-80'
                  }`}
                  onClick={() => setSelectedEngraving(pattern.id)}
                >
                  <div 
                    className="rounded-lg mb-2 lg:mb-3"
                    style={{ aspectRatio: '2/1' }}
                  >
                    <img 
                      src="/images/tattoos/tattoo_snake.png" 
                      alt={pattern.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-white font-medium text-xs sm:text-sm">{pattern.name}</p>
                </div>
                ))
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
              Ajoutez une touche personnelle à votre couteau
            </h2>
            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Gravure sur la lame</label>
                <textarea
                  placeholder="Inscrivez un nom, une date, un message ou décrivez une image"
                  className="w-full p-3 sm:p-4 rounded-lg bg-pure-white text-deep-black placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none resize-none text-sm sm:text-base"
                  style={{
                    backgroundColor: 'var(--color-pure-white)',
                    color: 'var(--color-deep-black)',
                    borderColor: 'var(--color-gray-medium)',
                    borderWidth: '1px'
                  }}
                  rows={3}
                  value={formData.bladeEngraving}
                  onChange={(e) => setFormData({...formData, bladeEngraving: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Gravure sur le manche</label>
                <textarea
                  placeholder="Un motif, des initiales ou une texture spécifique ?"
                  className="w-full p-3 sm:p-4 rounded-lg bg-pure-white text-deep-black placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none resize-none text-sm sm:text-base"
                  style={{
                    backgroundColor: 'var(--color-pure-white)',
                    color: 'var(--color-deep-black)',
                    borderColor: 'var(--color-gray-medium)',
                    borderWidth: '1px'
                  }}
                  rows={3}
                  value={formData.handleEngraving}
                  onChange={(e) => setFormData({...formData, handleEngraving: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Autres précisions</label>
                <textarea
                  placeholder="Détaillez ici toute demande spécifique (ex. : finition, ajustements...)"
                  className="w-full p-3 sm:p-4 rounded-lg bg-pure-white text-deep-black placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none resize-none text-sm sm:text-base"
                  style={{
                    backgroundColor: 'var(--color-pure-white)',
                    color: 'var(--color-deep-black)',
                    borderColor: 'var(--color-gray-medium)',
                    borderWidth: '1px'
                  }}
                  rows={3}
                  value={formData.otherDetails}
                  onChange={(e) => setFormData({...formData, otherDetails: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Votre adresse e-mail *</label>
                <input
                  type="email"
                  placeholder="ex. : j.dupond@mail.fr"
                  className="w-full p-3 sm:p-4 rounded-lg bg-pure-white text-deep-black placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none text-sm sm:text-base"
                  style={{
                    backgroundColor: 'var(--color-pure-white)',
                    color: 'var(--color-deep-black)',
                    borderColor: 'var(--color-gray-medium)',
                    borderWidth: '1px'
                  }}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
              Demande de devis envoyé !
            </h2>
            <div className="space-y-4 text-gray-300 text-sm sm:text-base">
              <p>
                Nous avons bien reçu votre demande et nous l'examinerons dans les plus brefs délais. Vous recevrez un retour par e-mail avec un devis détaillé ou toute demande d'informations complémentaires si nécessaire.
              </p>
              <p>
                Merci de votre confiance, et à très bientôt !
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showIntro) {
    return renderIntroPage();
  }

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
      <div className="w-full lg:w-1/2 lg:h-screen flex flex-col">
        {/* Stepper - Fixed at top */}
        <div className="p-4 sm:p-6 lg:p-8 pb-3 lg:pb-4">
          <Stepper currentStep={currentStep} totalSteps={5} />
        </div>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-4">
            {renderStepContent()}
          </div>
        </div>
        
        {/* Navigation buttons - Fixed at bottom */}
        <div className="p-4 sm:p-6 lg:p-8 pt-3 lg:pt-4 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
            <button
              onClick={prevStep}
              className="w-full sm:w-auto px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-medium transition-all hover:opacity-90 text-sm lg:text-base"
              style={{
                backgroundColor: "var(--color-pure-white)",
                color: "var(--color-wenge)" 
              }}
            >
              {currentStep === 1 ? 'Retour au menu' : 'Revenir en arrière'}
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
                    ? 'cursor-not-allowed'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: (currentStep === 1 && !selectedModel) ||
                    (currentStep === 2 && !selectedWood) ||
                    (currentStep === 3 && !selectedEngraving)
                    ? 'var(--color-gray-medium)'
                    : 'var(--color-wenge)',
                  color: (currentStep === 1 && !selectedModel) ||
                    (currentStep === 2 && !selectedWood) ||
                    (currentStep === 3 && !selectedEngraving)
                    ? 'var(--color-gray-medium)'
                    : 'var(--color-pure-white)'
                }}
              >
                  {currentStep === 3 ? "CHOISIR MON GUILLAUCHAGE ET CONTINUER" : "Valider mon choix et continuer".toUpperCase()}
                </button>
            ) : currentStep === 4 ? (
              <button
                  onClick={handleFormSubmit}
                  disabled={!formData.email}
                  className={`w-full sm:w-auto px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-all text-sm lg:text-base ${
                    !formData.email
                      ? 'cursor-not-allowed'
                      : 'hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: !formData.email 
                      ? 'var(--color-gray-medium)' 
                      : 'var(--color-wenge)',
                    color: !formData.email 
                      ? 'var(--color-gray-medium)' 
                      : 'var(--color-pure-white)'
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
  );
} 
