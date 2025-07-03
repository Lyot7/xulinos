interface LoadingIndicatorProps {
  allStepsData: Record<number, any>;
  loading: boolean;
}

export default function LoadingIndicator({ allStepsData, loading }: LoadingIndicatorProps) {
  if (!loading && Object.keys(allStepsData).length > 0) {
    return null;
  }

  const getLoadedStepsCount = () => {
    return Object.keys(allStepsData).filter(key => 
      allStepsData[parseInt(key)] && Object.keys(allStepsData[parseInt(key)]).length > 0
    ).length;
  };

  const loadedSteps = getLoadedStepsCount();
  const totalSteps = 5;

  return (
    <div className="mb-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300">
          {loading ? 'Chargement des données...' : 'Données chargées'}
        </span>
        <span className="text-gray-400">
          {loadedSteps}/{totalSteps} étapes
        </span>
      </div>
      
      {/* Barre de progression */}
      <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
        <div 
          className="bg-white h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${(loadedSteps / totalSteps) * 100}%` }}
        />
      </div>
      
      {/* Détails des étapes chargées */}
      {loadedSteps > 0 && (
        <div className="mt-2 text-xs text-gray-400">
          {allStepsData[1]?.models?.length && (
            <span className="mr-3">✓ {allStepsData[1].models.length} modèles</span>
          )}
          {allStepsData[2]?.woods?.length && (
            <span className="mr-3">✓ {allStepsData[2].woods.length} bois</span>
          )}
          {allStepsData[3]?.patterns?.length && (
            <span className="mr-3">✓ {allStepsData[3].patterns.length} motifs</span>
          )}
          {allStepsData[4]?.fields?.length && (
            <span className="mr-3">✓ {allStepsData[4].fields.length} champs</span>
          )}
          {allStepsData[5] && Object.keys(allStepsData[5]).length > 0 && (
            <span>✓ Résumé configuré</span>
          )}
        </div>
      )}
    </div>
  );
} 