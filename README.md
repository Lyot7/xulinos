# Xulinos - Documentation Technique

## 📋 Vue d'ensemble

**Xulinos** est une application web moderne développée avec Next.js 15 pour une entreprise de coutellerie artisanale. Le site présente des couteaux artisanaux, propose des services d'affûtage et de rémoulage, et permet aux clients de personnaliser leurs couteaux via un configurateur interactif.

## 🏗️ Architecture

### Stack Technologique

- **Framework**: Next.js 15.1.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Icons**: React Icons 5.4.0
- **Animations**: Framer Motion 11.15.0
- **Forms**: React Hook Form 7.54.2
- **CMS**: WordPress (API REST)

### Structure du Projet

```
xulinos/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── (legal)/           # Routes groupées pour les pages légales
│   │   ├── api/               # API Routes Next.js
│   │   ├── a-propos/          # Page À propos
│   │   ├── affutage-remoulage/ # Services d'affûtage
│   │   ├── avis/              # Témoignages clients
│   │   ├── configurateur/     # Configurateur de couteaux
│   │   ├── couteaux/          # Catalogue de couteaux
│   │   ├── demande-devis/     # Formulaire de devis
│   │   └── services/          # Page services
│   ├── components/            # Composants réutilisables
│   ├── context/               # Contextes React (WordPress, Cart)
│   ├── hooks/                 # Hooks personnalisés
│   └── utils/                 # Utilitaires et helpers
├── public/                    # Assets statiques
│   ├── branding/             # Logos et identité visuelle
│   ├── icons/                # Icônes SVG
│   └── images/               # Images du site
└── configuration files
```

## 🚀 Installation et Configuration

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Accès à l'API WordPress (xulinos.xyz-agency.com)

### Installation

```bash
# Cloner le repository
git clone [repository-url]
cd xulinos

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Scripts Disponibles

```bash
npm run dev      # Serveur de développement (port 3000)
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification du code avec ESLint
```

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env.local` à la racine :

```env
# WordPress API
NEXT_PUBLIC_WP_BASE_URL=https://xulinos.xyz-agency.com/wp-json

# Email de contact
CONTACT_EMAIL=lyot.bouquerel@gmail.com
```

### Configuration TypeScript

Le projet utilise TypeScript avec une configuration stricte :
- Path mapping : `@/*` → `./src/*`
- Target ES2017
- Module resolution bundler
- Strict mode activé

## 📱 Fonctionnalités Principales

### 1. Gestion du Contenu WordPress

#### Architecture Context
- **WordPressContext** : Gestion centralisée des données WordPress
- **useWordPressData** : Hook pour récupérer les données
- **useSafeWordPressText** : Hook pour traiter le texte WordPress en toute sécurité

#### Routes API Configurées
```typescript
// src/utils/apiRoutes.ts
const apiRoutes = {
  home: { endpoint: '/wp/v2/pages/6', priority: 1 },
  couteaux: { endpoint: '/wp/v2/couteaux', priority: 2 },
  about: { endpoint: '/wp/v2/pages/13', priority: 3 },
  // ... autres routes
};
```

### 2. Système de Panier

#### CartContext
- Gestion de l'état du panier
- Persistance locale (localStorage)
- Calcul automatique des totaux
- Gestion des quantités

#### Composants Associés
- `Cart.tsx` : Interface du panier
- `CartContext.tsx` : Logique métier

### 3. Configurateur de Couteaux

#### Fonctionnalités
- Sélection de matériaux
- Personnalisation des finitions
- Prévisualisation en temps réel
- Calcul de prix dynamique

#### Composants
- `Stepper.tsx` : Navigation par étapes
- `Switcher.tsx` : Sélecteurs de matériaux
- `GalleryImage.tsx` : Prévisualisation

### 4. Formulaires et Contact

#### API Route Contact
```typescript
// src/app/api/contact/route.ts
POST /api/contact
{
  nom: string,
  objet: string,
  message: string
}
```

#### Fonctionnalités
- Validation côté client et serveur
- Génération automatique de mailto
- Gestion des erreurs
- Feedback utilisateur

### 5. Système de Navigation

#### Structure
- Header responsive avec navigation
- Footer avec liens légaux
- Navigation dynamique basée sur les routes WordPress

#### Composants
- `Header.tsx` : Navigation principale
- `Navbar.tsx` : Menu mobile
- `Footer.tsx` : Pied de page

## 🎨 Design System

### Couleurs (Tailwind)
```css
/* src/app/globals.css */
:root {
  --color-primary: #8B4513;    /* Marron principal */
  --color-dark: #2D1810;       /* Marron foncé */
  --color-light: #F5F5DC;      /* Beige clair */
}
```

### Composants UI
- `PrimaryButton.tsx` : Boutons principaux
- `SecondaryButton.tsx` : Boutons secondaires
- `IconButton.tsx` : Boutons avec icônes
- `ServicesCard.tsx` : Cartes de services

### Responsive Design
- Mobile-first approach
- Breakpoints Tailwind : sm, md, lg, xl
- Images optimisées avec Next.js Image

## 🔄 Gestion d'État

### Contextes React

#### WordPressContext
```typescript
interface WordPressContextType {
  data: Record<string, any>;
  loading: boolean;
  error: Error | null;
  routeErrors: Record<string, Error | null>;
  hasRouteError: (routeKey: string) => boolean;
  isRouteLoaded: (routeKey: string) => boolean;
}
```

#### CartContext
```typescript
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}
```

### Hooks Personnalisés

#### useWordPressData
- Gestion des appels API WordPress
- Cache et optimisation des requêtes
- Gestion des erreurs par route

#### useSafeWordPressText
- Traitement sécurisé du contenu WordPress
- Fallbacks pour les données manquantes
- Décodage HTML

## 🛠️ Utilitaires

### Utilitaires WordPress
```typescript
// src/utils/wordpressApi.ts
- fetchWordPressData(routeKey: string)
- submitWordPressForm(formKey: string, formData: FormData)
- parseWordPressContent(content: any)
- getFeaturedImageUrl(post: any)
```

### Encodage de Texte
```typescript
// src/utils/textEncoding.ts
- extractTextFromWordPress(content: string)
- decodeHtmlEntities(text: string)
```

## 📊 Performance

### Optimisations Next.js
- **Image Optimization** : Composant `next/image` avec lazy loading
- **Code Splitting** : Automatique avec App Router
- **Static Generation** : Pages statiques quand possible
- **Dynamic Imports** : Chargement à la demande

### Optimisations WordPress
- **Cache Context** : Mémorisation des données
- **Priority Loading** : Chargement prioritaire des pages critiques
- **Error Boundaries** : Gestion gracieuse des erreurs API

## 🔒 Sécurité

### Mesures Implémentées
- Validation des formulaires côté client et serveur
- Sanitisation du contenu WordPress
- Protection contre les injections XSS
- Gestion sécurisée des erreurs

### API Security
- Validation des entrées
- Rate limiting (à implémenter)
- CORS configuration

## 🧪 Tests

### Structure Recommandée
```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   └── utils/
```

### Tests à Implémenter
- Tests unitaires des composants
- Tests d'intégration des hooks
- Tests E2E des formulaires
- Tests de performance

## 🚀 Déploiement

### Build de Production
```bash
npm run build
npm run start
```

### Variables d'Environnement Production
```env
NODE_ENV=production
NEXT_PUBLIC_WP_BASE_URL=https://xulinos.xyz-agency.com/wp-json
```

### Optimisations Production
- Compression gzip/brotli
- CDN pour les assets statiques
- Cache headers appropriés
- Monitoring des performances

## 📝 Maintenance

### Logs et Monitoring
- Console logs pour le développement
- Error tracking (à implémenter)
- Performance monitoring (à implémenter)

### Mises à Jour
- Vérifier les dépendances : `npm audit`
- Mettre à jour Next.js et React
- Tester après chaque mise à jour

## 🤝 Contribution

### Standards de Code
- TypeScript strict
- ESLint configuration
- Prettier (à configurer)
- Conventional commits

### Workflow Git
1. Feature branch depuis `main`
2. Développement et tests
3. Pull Request avec description
4. Code review
5. Merge vers `main`

## 📚 Ressources

### Documentation
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

### Outils de Développement
- VS Code avec extensions TypeScript/React
- React Developer Tools
- Next.js DevTools
- Tailwind CSS IntelliSense

---

**Version**: 1.0.0  
**Dernière mise à jour**: Décembre 2024  
**Maintenu par**: Équipe Xulinos
