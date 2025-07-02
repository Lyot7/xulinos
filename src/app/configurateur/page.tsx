'use client';

import { useState } from 'react';
import Stepper from '@/components/Stepper';
import { useCart } from '@/context/CartContext';
import PrimaryButton from '@/components/PrimaryButton';

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
  const { addItem } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedWood, setSelectedWood] = useState<string>('');
  const [selectedEngraving, setSelectedEngraving] = useState<string>('');
  const [modelSearchTerm, setModelSearchTerm] = useState<string>('');
  const [woodSearchTerm, setWoodSearchTerm] = useState<string>('');
  const [engravingSearchTerm, setEngravingSearchTerm] = useState<string>('');
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
      window.location.href = '/';
    }
  };

  const handleFormSubmit = () => {
    // Ajouter le couteau configuré au panier
    const selectedModelData = models.find(m => m.id === selectedModel);
    const selectedWoodData = woods.find(w => w.id === selectedWood);
    const selectedEngravingData = engravingPatterns.find(e => e.id === selectedEngraving);
    
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

    nextStep();
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
              Configuration terminée !
            </h2>
            <div className="space-y-6 text-gray-300 text-sm sm:text-base">
              <p>
                Votre couteau personnalisé a été ajouté à votre panier. Vous pouvez maintenant :
              </p>
              
              <div className="bg-primary rounded-lg p-4 border border-white/10">
                <h3 className="text-white font-medium mb-2">Résumé de votre configuration :</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Modèle : {models.find(m => m.id === selectedModel)?.name || 'Personnalisé'}</li>
                  <li>• Bois : {woods.find(w => w.id === selectedWood)?.name || 'Non spécifié'}</li>
                  <li>• Gravure : {engravingPatterns.find(e => e.id === selectedEngraving)?.name || 'Aucune'}</li>
                  {formData.bladeEngraving && <li>• Gravure lame : {formData.bladeEngraving}</li>}
                  {formData.handleEngraving && <li>• Gravure manche : {formData.handleEngraving}</li>}
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <PrimaryButton
                  name="Continuer mes achats"
                  onClick={() => window.location.href = '/couteaux'}
                  className="flex-1"
                />
                <PrimaryButton
                  name="Voir mon panier"
                  onClick={() => window.location.href = '/demande-devis'}
                  className="flex-1"
                />
              </div>
              
              <p className="text-center text-white/60 text-xs">
                Un devis personnalisé vous sera envoyé après validation de votre demande.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
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
            {renderStepContent()}
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
    </div>
  );
} 
