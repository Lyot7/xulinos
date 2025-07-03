# Utilitaires de traitement de texte WordPress

Ce dossier contient les utilitaires pour traiter les problèmes d'encodage UTF-8 provenant de WordPress.

## Problème résolu

Les données WordPress peuvent parfois contenir des caractères mal encodés, notamment :
- Caractères accentués français (é, è, à, ç, etc.) affichés comme `Ã©`, `Ã¨`, `Ã `, etc.
- Guillemets et apostrophes mal encodés (`â€™`, `â€œ`, etc.)
- Entités HTML non décodées

## Solution finale

### Hooks React autonomes (`src/hooks/useWordPressText.ts`)

**Solution complètement autonome sans dépendances externes :**

- `useSafeWordPressText(text)` : Hook principal pour l'affichage sécurisé
- `useWordPressText(text, options)` : Hook avec options (removeHtml, cleanContent)
- `useWordPressContent(content)` : Pour le contenu HTML WordPress

**Avantages :**
- ✅ Aucune dépendance externe
- ✅ Traitement inline pour éviter les erreurs de fonction
- ✅ Compatible client et serveur
- ✅ Gestion d'erreurs robuste
- ✅ Performance optimisée avec `useMemo`

## Utilisation

### Dans les composants React

```tsx
import { useSafeWordPressText } from '@/hooks/useWordPressText';

function MyComponent({ wordpressData }) {
  const cleanTitle = useSafeWordPressText(wordpressData.title);
  
  return <h1>{cleanTitle}</h1>;
}
```

### Options disponibles

```tsx
import { useWordPressText } from '@/hooks/useWordPressText';

// Texte simple
const simpleText = useSafeWordPressText(wordpressData.title);

// Texte sans HTML
const cleanText = useWordPressText(wordpressData.content, { removeHtml: true });

// Contenu nettoyé
const processedText = useWordPressText(wordpressData.content, { cleanContent: true });
```

## Caractères corrigés

### Entités HTML
- `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`, `&nbsp;`
- `&copy;`, `&reg;`, `&trade;`, `&euro;`, `&pound;`, `&cent;`, `&deg;`
- `&ldquo;`, `&rdquo;`, `&lsquo;`, `&rsquo;`
- `&mdash;`, `&ndash;`, `&hellip;`, `&bull;`

### Accents français
- `Ã©` → `é`, `Ã¨` → `è`, `Ã ` → `à`
- `Ã¢` → `â`, `Ãª` → `ê`, `Ã®` → `î`
- `Ã´` → `ô`, `Ã¹` → `ù`, `Ã»` → `û`
- `Ã§` → `ç`, `Ã‰` → `É`, `Ã€` → `À`

### Accents internationaux
- `Ã¡` → `á`, `Ã­` → `í`, `Ã³` → `ó`, `Ãº` → `ú`
- `Ã±` → `ñ`, `Ã¼` → `ü`, `Ã¶` → `ö`, `Ã¤` → `ä`
- `Ã¥` → `å`, `Ã¸` → `ø`, `Ã¦` → `æ`

### Ponctuation
- `â€™` → `'`, `â€œ` → `"`, `â€` → `"`
- `â€¦` → `…`, `â€"` → `—`

## Intégration automatique

Le hook `useWordPressData` traite automatiquement toutes les données WordPress avec l'encodage correct au niveau de la récupération des données.

## Performance

- **Mise en cache** : Utilisation de `useMemo` pour éviter les recalculs
- **Traitement inline** : Aucun appel de fonction externe
- **Optimisation** : Traitement uniquement quand les données changent

## Architecture

```
src/
├── hooks/
│   └── useWordPressText.ts     # Hooks autonomes pour le traitement
├── utils/
│   ├── textEncoding.ts         # Fonctions utilitaires (optionnelles)
│   └── README.md              # Documentation
└── app/
    └── page.tsx               # Utilisation dans les composants
```

## Résolution des erreurs

Cette solution résout les erreurs courantes :
- ❌ `document.createElement` côté serveur
- ❌ Appels de fonctions externes dans `useMemo`
- ❌ Erreurs de type dans les hooks React
- ❌ Problèmes d'encodage UTF-8

## Test

La solution a été testée avec des cas réels :
- ✅ `L&apos;art du couteau artisanal` → `L'art du couteau artisanal`
- ✅ `Savoir-faire Ã© artisanal` → `Savoir-faire é artisanal`
- ✅ `AffÃ»tage &amp; RÃ©moulage` → `Affûtage & Rémoulage`
- ✅ `Ã€ propos de nous` → `À propos de nous` 