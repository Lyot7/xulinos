# WordPress Data Hook System

Ce système de hooks permet de charger et gérer les données WordPress dans l'application Next.js de façon optimisée.

## Fonctionnalités principales

- **Chargement prioritaire** : Charge d'abord les données de la page actuelle, puis les autres données en arrière-plan
- **Mise en cache** : Évite les requêtes redondantes en mettant en cache les données déjà chargées
- **Hooks réutilisables** : Fournit des hooks spécifiques pour différents types de données (pages, couteaux, etc.)

## Architecture

Le système est composé de plusieurs fichiers :

1. **`src/utils/apiRoutes.ts`** : Configuration des routes API WordPress avec priorités
2. **`src/hooks/useWordPressData.ts`** : Hook principal pour charger les données
3. **`src/context/WordPressContext.tsx`** : Contexte React pour partager les données
4. **`src/utils/wordpressApi.ts`** : Fonctions utilitaires pour l'API WordPress

## Utilisation

### 1. Dans le layout principal

Le `WordPressProvider` est déjà inclus dans le layout principal, ce qui rend les données disponibles dans toute l'application.

### 2. Accès aux données de page

```tsx
import { usePageData } from '@/context/WordPressContext';

function MaPage() {
  const { pageData, loading, error } = usePageData('home');
  
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;
  
  return (
    <div>
      <h1>{pageData?.title?.rendered}</h1>
      {/* Accès aux champs ACF */}
      <p>{pageData?.acf?.mon_champ}</p>
    </div>
  );
}
```

### 3. Accès aux données de couteaux

```tsx
import { useCouteauxData } from '@/context/WordPressContext';

function ListeCouteaux() {
  const { couteaux, loading, error } = useCouteauxData();
  
  if (loading) return <p>Chargement...</p>;
  
  return (
    <div>
      {couteaux.map(couteau => (
        <div key={couteau.id}>
          <h2>{couteau.title.rendered}</h2>
          <p>{couteau.acf.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Configuration des routes

Pour ajouter ou modifier des routes, éditez le fichier `src/utils/apiRoutes.ts`. Chaque route a une clé unique, une URL d'endpoint et une priorité de chargement.

## Traitement des formulaires

Pour soumettre des données à un formulaire WordPress (Contact Form 7), utilisez la fonction `submitWordPressForm` du fichier `src/utils/wordpressApi.ts`.

```tsx
import { submitWordPressForm } from '@/utils/wordpressApi';

// Dans un gestionnaire d'événement
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const response = await submitWordPressForm('formPanier', formData);
  // Traiter la réponse...
};
``` 