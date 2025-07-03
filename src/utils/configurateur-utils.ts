import { ConfiguratorStepData } from '@/types/configurateur';

// Variable de contrôle pour utiliser les données de test
export const USE_TEST_DATA = false;

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

// Fonction pour adapter les données ACF de WordPress au format attendu par le composant
export const adaptACFDataForStep = (acfData: any, step: number): ConfiguratorStepData => {
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