import { ConfiguratorStepData } from "@/types/configurateur";

export const getTestDataForStep = (step: number): ConfiguratorStepData => {
  switch (step) {
    case 1:
      return {
        title: "Sélectionnez un modèle comme base de votre création",
        models: [
          { 
            id: 'kiridashi', 
            name: 'Kiridashi "Yoru"', 
            description: 'Bois d\'ébène, acier damas', 
            image: '/images/knives/kiridashi-yoru/kiridashi-yoru.png' 
          },
          { 
            id: 'damas', 
            name: 'Le Damas sylvestre', 
            description: 'Bois de santal, acier carbone, guillochage', 
            image: '/images/knives/le_damas_sylvestre/variant_01.jpg' 
          },
          { 
            id: 'souverain', 
            name: 'Le Souverain', 
            description: 'Bois de fer, lame en acier poli, pliant', 
            image: '/images/knives/le-souverain/le-souverain.png' 
          }
        ]
      };
    
    case 2:
      return {
        title: "Choisissez le bois qui donnera du caractère à votre couteau",
        woods: [
          { id: 'noyer', name: 'Noyer foncé', image: '/images/woods/noyer_foncer.png' },
          { id: 'chene', name: 'Chêne', image: '/images/woods/noyer_foncer.png' },
          { id: 'erable', name: 'Érable', image: '/images/woods/noyer_foncer.png' },
          { id: 'merisier', name: 'Merisier', image: '/images/woods/noyer_foncer.png' },
          { id: 'hetre', name: 'Hêtre teinté', image: '/images/woods/noyer_foncer.png' },
          { id: 'acajou', name: 'Acajou', image: '/images/woods/noyer_foncer.png' }
        ]
      };
    
    case 3:
      return {
        title: "Ajoutez un guillochage : une signature artisanale unique !",
        description: "Le guillochage est une gravure réalisée à la lime sur le dos de la lame. Chaque motif est unique et apporte une touche d'élégance et de raffinement à votre couteau.",
        patterns: [
          { id: 'snake', name: 'Snake', image: '/images/tattoos/tattoo_snake.png', pattern: '∼∼∼∼∼∼∼∼∼' },
          { id: 'viking', name: 'Nœuds vikings', image: '/images/tattoos/tattoo_snake.png', pattern: '◊◊◊◊◊◊◊◊◊' },
          { id: 'maple', name: 'Érable', image: '/images/tattoos/tattoo_snake.png', pattern: '▼▼▼▼▼▼▼▼▼' },
          { id: 'geometric', name: 'Géométrique', image: '/images/tattoos/tattoo_snake.png', pattern: '▲▼▲▼▲▼▲▼▲' },
          { id: 'tribal', name: 'Tribal', image: '/images/tattoos/tattoo_snake.png', pattern: '≈≈≈≈≈≈≈≈≈' }
        ]
      };
    
    case 4:
      return {
        title: "Ajoutez une touche personnelle à votre couteau",
        fields: [
          { 
            id: 'bladeEngraving', 
            label: 'Gravure sur la lame', 
            placeholder: 'Inscrivez un nom, une date, un message ou décrivez une image',
            type: 'textarea' 
          },
          { 
            id: 'handleEngraving', 
            label: 'Gravure sur le manche', 
            placeholder: 'Un motif, des initiales ou une texture spécifique ?',
            type: 'textarea' 
          },
          { 
            id: 'otherDetails', 
            label: 'Autres précisions', 
            placeholder: 'Détaillez ici toute demande spécifique (ex. : finition, ajustements...)',
            type: 'textarea' 
          },
          { 
            id: 'email', 
            label: 'Votre adresse e-mail *', 
            placeholder: 'ex. : j.dupond@mail.fr',
            type: 'email',
            required: true 
          }
        ]
      };
    
    case 5:
      return {
        title: "Configuration terminée !",
        paragraph: "Félicitations ! Votre couteau artisanal personnalisé a été créé selon vos spécifications. Chaque pièce est unique et sera fabriquée avec le plus grand soin par nos artisans.",
        message: "Votre couteau personnalisé a été ajouté à votre panier. Vous pouvez maintenant :",
        actions: [
          { 
            id: 'continue_shopping', 
            label: 'Continuer mes achats', 
            url: '/couteaux',
            type: 'primary' 
          },
          { 
            id: 'view_cart', 
            label: 'Voir mon panier', 
            url: '/demande-devis',
            type: 'primary' 
          }
        ]
      };
    
    default:
      return {};
  }
};
