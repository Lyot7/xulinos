import { ConfiguratorStepData } from '@/types/configurateur';

// Variable de contrôle pour utiliser les données de test
export const USE_TEST_DATA = false;

// Fonction helper pour obtenir l'URL de l'image
const getImageUrl = (imageId: any, defaultPath: string): string => {
  if (!imageId) return defaultPath;
  
  // Si c'est un objet WordPress avec les propriétés d'image
  if (typeof imageId === 'object' && imageId !== null) {
    // Essayer différentes propriétés pour obtenir l'URL
    if (imageId.url) {
      return imageId.url;
    }
    if (imageId.source_url) {
      return imageId.source_url;
    }
    if (imageId.guid && imageId.guid.rendered) {
      return imageId.guid.rendered;
    }
    if (imageId.link) {
      return imageId.link;
    }
    if (imageId.ID || imageId.id) {
      return `https://xulinos.xyz-agency.com/wp-content/uploads/${imageId.ID || imageId.id}`;
    }
  }
  
  if (typeof imageId === 'number' || (typeof imageId === 'string' && /^\d+$/.test(imageId))) {
    return `https://xulinos.xyz-agency.com/wp-content/uploads/${imageId}`;
  }
  
  if (typeof imageId === 'string' && (imageId.startsWith('http') || imageId.startsWith('/'))) {
    return imageId;
  }
  return defaultPath;
};

// Fonction pour adapter les données ACF de WordPress au format attendu par le composant
export const adaptACFDataForStep = (acfData: any, step: number): ConfiguratorStepData => {
  const adaptedData: ConfiguratorStepData = {};
  
  // Debug: afficher la structure des données ACF reçues
  console.log(`--- ACF Data Structure for Step ${step} ---`);
  console.log('Raw ACF data:', acfData);
  console.log('ACF keys:', Object.keys(acfData));
  Object.keys(acfData).forEach(key => {
    if (key !== 'title' && key !== 'description' && key !== 'paragraph' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
      console.log(`${key}:`, acfData[key], 'Keys:', Object.keys(acfData[key]));
    }
  });
  
  // Copier le titre s'il existe
  if (acfData.title) {
    adaptedData.title = acfData.title;
  }
  
  // Copier la description s'il existe
  if (acfData.description) {
    adaptedData.description = acfData.description;
  }
  
  // Copier le paragraphe s'il existe
  if (acfData.paragraph) {
    adaptedData.paragraph = acfData.paragraph;
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
        if (key !== 'title' && key !== 'description' && key !== 'paragraph' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
          const modelData = acfData[key];
          // Inclure tous les modèles, même ceux avec des champs vides
          if (modelData.hasOwnProperty('titlecouteau') || modelData.hasOwnProperty('imagecouteau') || modelData.hasOwnProperty('descriptioncouteau')) {
            adaptedData.models!.push({
              id: key,
              name: modelData.titlecouteau || key.charAt(0).toUpperCase() + key.slice(1), // Capitaliser le nom de la clé si pas de titre
              description: modelData.descriptioncouteau,
              image: getImageUrl(modelData.imagecouteau, '')
            });
          }
        }
      });
      break;
      
    case 2:
      // Convertir les données de bois
      adaptedData.woods = [];
      Object.keys(acfData).forEach(key => {
        if (key !== 'title' && key !== 'description' && key !== 'paragraph' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
          const woodData = acfData[key];
          // Inclure tous les bois, même ceux avec des champs vides
          // Gérer les différents noms de champs pour les bois
          if (woodData.hasOwnProperty('titlewood') || woodData.hasOwnProperty('imagewood') || 
              woodData.hasOwnProperty('titreessence') || woodData.hasOwnProperty('imageessence') ||
              Object.keys(woodData).length > 0) {
            adaptedData.woods!.push({
              id: key,
              name: woodData.titlewood || woodData.titreessence || key.charAt(0).toUpperCase() + key.slice(1),
              image: getImageUrl(woodData.imagewood || woodData.imageessence, '/images/woods/noyer_foncer.png')
            });
          }
        }
      });
      break;
      
    case 3:
      // Convertir les données de motifs
      adaptedData.patterns = [];
      Object.keys(acfData).forEach(key => {
        if (key !== 'title' && key !== 'description' && key !== 'paragraph' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
          const patternData = acfData[key];
          // Inclure tous les motifs, même ceux avec des champs vides
          // Gérer les différents noms de champs possibles
          if (patternData.hasOwnProperty('titlepattern') || patternData.hasOwnProperty('imagepattern') || 
              patternData.hasOwnProperty('patterntext') || patternData.hasOwnProperty('NomGuillochage') ||
              Object.keys(patternData).length > 0) {
            adaptedData.patterns!.push({
              id: key,
              name: patternData.NomGuillochage || patternData.titlepattern || key.charAt(0).toUpperCase() + key.slice(1),
              pattern: patternData.patterntext || '',
              image: getImageUrl(patternData.imagepattern, '')
            });
          }
        }
      });
      break;
      
    case 4:
      // Convertir les données de champs
      adaptedData.fields = [];
      Object.keys(acfData).forEach(key => {
        if (key !== 'title' && key !== 'description' && key !== 'paragraph' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
          const fieldData = acfData[key];
          // Inclure tous les champs, même ceux avec des données minimales
          // Gérer les noms de champs spécifiques : libelle/texte_indicatif et label/placeholder
          if (fieldData.label || fieldData.placeholder || fieldData.libelle || fieldData.texte_indicatif || Object.keys(fieldData).length > 0) {
            adaptedData.fields!.push({
              id: key,
              label: fieldData.label || fieldData.libelle || '',
              placeholder: fieldData.placeholder || fieldData.texte_indicatif || '',
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
        if (key !== 'title' && key !== 'description' && key !== 'paragraph' && key !== 'message' && acfData[key] && typeof acfData[key] === 'object') {
          const actionData = acfData[key];
          // Inclure toutes les actions, même celles avec des données minimales
          if (actionData.label || actionData.url || Object.keys(actionData).length > 0) {
            adaptedData.actions!.push({
              id: key,
              label: actionData.label || key.charAt(0).toUpperCase() + key.slice(1),
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