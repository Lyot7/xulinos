'use client';

import { useState, useEffect } from 'react';
import Stepper from '@/components/Stepper';
import { useCart } from '@/context/CartContext';
import PrimaryButton from '@/components/PrimaryButton';
import { useWordPressData } from '@/hooks/useWordPressData';
import { getTestDataForStep } from '@/mockData/configurateur-mock-data';

interface ModelOption {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface WoodOption {
  id: string;
  name: string;
  image: string;
}

interface EngravingOption {
  id: string;
  name: string;
  pattern: string;
  image: string;
}

interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required?: boolean;
}

export interface ConfiguratorStepData {
  title?: string;
  description?: string;
  message?: string;
  models?: ModelOption[];
  woods?: WoodOption[];
  patterns?: EngravingOption[];
  fields?: FormField[];
  actions?: Array<{
    id: string;
    label: string;
    url: string;
    type: string;
  }>;
}

const USE_TEST_DATA = false;

// Fonction pour adapter les données ACF de WordPress au format attendu par le composant
const adaptACFDataForStep = (acfData: any, step: number): ConfiguratorStepData => {
  const adaptedData: ConfiguratorStepData = {};
  
  // Copier le titre s'il existe
  if (acfData.title) {
    adaptedData.title = acfData.title;
  }
  
  // Copier la description s'il existe
  if (acfData.description) {
    adaptedData.description = acfData.description;
  }
  
  // Copier le message s'il existe
  if (acfData.message) {
    adaptedData.message = acfData.message;
  }
  
  // Fonction helper pour obtenir l'URL de l'image
  const getImageUrl = (imageId: any, defaultPath: string = '/images/knives/default.png'): string => {
    if (!imageId) return defaultPath;
    
    // Si c'est un ID numérique, on peut essayer de construire l'URL WordPress
    if (typeof imageId === 'number' || (typeof imageId === 'string' && /^\d+$/.test(imageId))) {
      return `https://xulinos.xyz-agency.com/wp-content/uploads/${imageId}`;
    }
    
    // Si c'est déjà une URL
    if (typeof imageId === 'string' && (imageId.startsWith('http') || imageId.startsWith('/'))) {
      return imageId;
    }
    
    // Sinon, utiliser le chemin par défaut
    return defaultPath;
  };
  
  switch (step) {
    case 1:
      // Convertir les données de modèles
      adaptedData.models = [];
      Object.keys(acfData).forEach(key => {
        if (key !== 'title' && key !== 'description' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
          const modelData = acfData[key];
          // Inclure tous les modèles, même ceux avec des champs vides
          if (modelData.hasOwnProperty('titlecouteau') || modelData.hasOwnProperty('imagecouteau') || modelData.hasOwnProperty('descriptioncouteau')) {
            adaptedData.models!.push({
              id: key,
              name: modelData.titlecouteau || key.charAt(0).toUpperCase() + key.slice(1), // Capitaliser le nom de la clé si pas de titre
              description: modelData.descriptioncouteau || 'Modèle disponible',
              image: getImageUrl(modelData.imagecouteau, '/images/knives/desosseur_en_bois_de_noyer/desosseur_en_bois_de_noyer.png')
            });
          }
        }
      });
      break;
      
         case 2:
       // Convertir les données de bois
       adaptedData.woods = [];
       Object.keys(acfData).forEach(key => {
         if (key !== 'title' && key !== 'description' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
           const woodData = acfData[key];
           if (woodData.hasOwnProperty('titlewood') || woodData.hasOwnProperty('imagewood')) {
             adaptedData.woods!.push({
               id: key,
               name: woodData.titlewood || key.charAt(0).toUpperCase() + key.slice(1),
               image: getImageUrl(woodData.imagewood, '/images/woods/noyer_foncer.png')
             });
           }
         }
       });
       break;
       
     case 3:
       // Convertir les données de motifs
       adaptedData.patterns = [];
       Object.keys(acfData).forEach(key => {
         if (key !== 'title' && key !== 'description' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
           const patternData = acfData[key];
           if (patternData.hasOwnProperty('titlepattern') || patternData.hasOwnProperty('imagepattern') || patternData.hasOwnProperty('patterntext')) {
             adaptedData.patterns!.push({
               id: key,
               name: patternData.titlepattern || key.charAt(0).toUpperCase() + key.slice(1),
               pattern: patternData.patterntext || '',
               image: getImageUrl(patternData.imagepattern, '/images/tattoos/tattoo_snake.png')
             });
           }
         }
       });
       break;
      
    case 4:
      // Convertir les données de champs
      adaptedData.fields = [];
      Object.keys(acfData).forEach(key => {
        if (key !== 'title' && key !== 'description' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
          const fieldData = acfData[key];
          if (fieldData.label || fieldData.placeholder) {
            adaptedData.fields!.push({
              id: key,
              label: fieldData.label || key,
              placeholder: fieldData.placeholder || '',
              type: fieldData.type || 'text',
              required: fieldData.required || false
            });
          }
        }
      });
      break;
      
    case 5:
      // Convertir les données d'actions
      adaptedData.actions = [];
      Object.keys(acfData).forEach(key => {
        if (key !== 'title' && key !== 'description' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
          const actionData = acfData[key];
          if (actionData.label || actionData.url) {
            adaptedData.actions!.push({
              id: key,
              label: actionData.label || key,
              url: actionData.url || '#',
              type: actionData.type || 'primary'
            });
          }
        }
      });
      break;
  }
  
  console.log('Adapted ACF data:', adaptedData);
  return adaptedData;
};

export default function ConfiguratorPage() {
  const { addItem } = useCart();
  const { data: wordpressData, loading: wordpressLoading, error: wordpressError } = USE_TEST_DATA ? 
    { data: {}, loading: false, error: null } : 
    useWordPressData();
  
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
  
  // État pour les données du configurateur
  const [stepData, setStepData] = useState<ConfiguratorStepData>({});

  useEffect(() => {
    // console.log('----------------------------');
    // console.log('Current step:', currentStep);
    // console.log('WordPress data keys:', wordpressData ? Object.keys(wordpressData) : []);
    // console.log('Step data:', stepData);
    // if (wordpressData) {
    //   console.log('Available configurateur routes:', Object.keys(wordpressData).filter(key => key.startsWith('configurateur')));
    // }
  }, [currentStep, wordpressData]);

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

    nextStep();
  };

  const filteredModels = (stepData && stepData.models) ? stepData.models.filter(model => 
    model.name.toLowerCase().includes(modelSearchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(modelSearchTerm.toLowerCase())
  ) : [];

  const filteredWoods = (stepData && stepData.woods) ? stepData.woods.filter(wood => 
    wood.name.toLowerCase().includes(woodSearchTerm.toLowerCase())
  ) : [];

  const filteredEngravingPatterns = (stepData && stepData.patterns) ? stepData.patterns.filter(pattern => 
    pattern.name.toLowerCase().includes(engravingSearchTerm.toLowerCase())
  ) : [];

  const renderStepContent = () => {
    if (wordpressLoading) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-white mt-4">Chargement...</p>
        </div>
      );
    }

    // Si aucune donnée n'est disponible depuis WordPress
    // if (!stepData || Object.keys(stepData).length === 0) {
    //   return (
    //     <div className="text-center py-8">
    //       <div className="text-red-400 mb-4">
    //         <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    //         </svg>
    //       </div>
    //       <h3 className="text-lg font-medium text-white mb-2">Configuration non disponible</h3>
    //     </div>
    //   );
    // }

    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
              {stepData.title || "Étape 1"}
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
              {!stepData.models || stepData.models.length === 0 ? (
                <div className="col-span-full text-center py-6 lg:py-8">
                  <p className="text-gray-400 text-base lg:text-lg">
                    Aucun modèle trouvé
                  </p>
                </div>
              ) : filteredModels.length === 0 ? (
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
                      src={model.image} 
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
              {stepData.title || "Étape 2"}
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
              {!stepData.woods || stepData.woods.length === 0 ? (
                <div className="col-span-full text-center py-6 lg:py-8">
                  <p className="text-gray-400 text-base lg:text-lg">
                    Aucun bois trouvé
                  </p>
                </div>
              ) : filteredWoods.length === 0 ? (
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
                      src={wood.image} 
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
              {stepData.title || "Étape 3"}
            </h2>
            {stepData.description && (
              <p className="text-gray-300 mb-4 lg:mb-6 text-sm sm:text-base">
                {stepData.description}
              </p>
            )}
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
              {!stepData.patterns || stepData.patterns.length === 0 ? (
                <div className="col-span-full text-center py-6 lg:py-8">
                  <p className="text-gray-400 text-base lg:text-lg">
                    Aucun motif trouvé
                  </p>
                </div>
              ) : filteredEngravingPatterns.length === 0 ? (
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
                      src={pattern.image} 
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
              {stepData.title || "Étape 4"}
            </h2>
            <div className="space-y-4 lg:space-y-6">
              {!stepData.fields || stepData.fields.length === 0 ? (
                <div className="text-center py-6 lg:py-8">
                  <p className="text-gray-400 text-base lg:text-lg">
                    Aucun champ trouvé
                  </p>
                </div>
              ) : (
                stepData.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        placeholder={field.placeholder}
                        className="w-full p-3 sm:p-4 rounded-lg bg-pure-white text-deep-black placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none resize-none text-sm sm:text-base"
                        style={{
                          backgroundColor: 'var(--color-pure-white)',
                          color: 'var(--color-deep-black)',
                          borderColor: 'var(--color-gray-medium)',
                          borderWidth: '1px'
                        }}
                        rows={3}
                        value={formData[field.id as keyof typeof formData] || ''}
                        onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      />
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full p-3 sm:p-4 rounded-lg bg-pure-white text-deep-black placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none text-sm sm:text-base"
                        style={{
                          backgroundColor: 'var(--color-pure-white)',
                          color: 'var(--color-deep-black)',
                          borderColor: 'var(--color-gray-medium)',
                          borderWidth: '1px'
                        }}
                        value={formData[field.id as keyof typeof formData] || ''}
                        onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                        required={field.required}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
              {stepData.title || "Étape 5"}
            </h2>
            <div className="space-y-6 text-gray-300 text-sm sm:text-base">
              <p>
                {stepData.message || "Configuration terminée."}
              </p>
              
              <div className="bg-primary rounded-lg p-4 border border-white/10">
                <h3 className="text-white font-medium mb-2">Résumé de votre configuration :</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Modèle : {(stepData && stepData.models) ? stepData.models.find(m => m.id === selectedModel)?.name || 'Non sélectionné' : 'Non sélectionné'}</li>
                  <li>• Bois : {(stepData && stepData.woods) ? stepData.woods.find(w => w.id === selectedWood)?.name || 'Non sélectionné' : 'Non sélectionné'}</li>
                  <li>• Gravure : {(stepData && stepData.patterns) ? stepData.patterns.find(e => e.id === selectedEngraving)?.name || 'Non sélectionné' : 'Non sélectionné'}</li>
                  {formData.bladeEngraving && <li>• Gravure lame : {formData.bladeEngraving}</li>}
                  {formData.handleEngraving && <li>• Gravure manche : {formData.handleEngraving}</li>}
                </ul>
              </div>
              
              {stepData.actions && stepData.actions.length > 0 ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  {stepData.actions.map((action) => (
                    <PrimaryButton
                      key={action.id}
                      name={action.label}
                      onClick={() => window.location.href = action.url}
                      className="flex-1"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">
                    Aucune action configurée
                  </p>
                </div>
              )}
              
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
