import { ConfiguratorStepData } from '@/types/configurateur';

interface StepPreviewProps {
  allStepsData: Record<number, ConfiguratorStepData>;
  currentStep: number;
}

export default function StepPreview({ allStepsData, currentStep }: StepPreviewProps) {
  const getPreviewData = () => {
    const previews = [];
    
    if (currentStep !== 1 && allStepsData[1]?.models?.length) {
      previews.push({
        title: 'Modèles disponibles',
        count: allStepsData[1].models.length,
        items: allStepsData[1].models.slice(0, 3).map(m => m.name)
      });
    }
    
    if (currentStep !== 2 && allStepsData[2]?.woods?.length) {
      previews.push({
        title: 'Types de bois',
        count: allStepsData[2].woods.length,
        items: allStepsData[2].woods.slice(0, 3).map(w => w.name)
      });
    }
    
    if (currentStep !== 3 && allStepsData[3]?.patterns?.length) {
      previews.push({
        title: 'Motifs de guillochage',
        count: allStepsData[3].patterns.length,
        items: allStepsData[3].patterns.slice(0, 3).map(p => p.name)
      });
    }
    
    return previews;
  };

  const previews = getPreviewData();

  if (previews.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <h3 className="text-white font-medium mb-3 text-sm">Aperçu des options disponibles :</h3>
      <div className="space-y-3">
        {previews.map((preview, index) => (
          <div key={index} className="text-xs">
            <div className="text-gray-300 font-medium mb-1">
              {preview.title} ({preview.count} option{preview.count > 1 ? 's' : ''})
            </div>
            <div className="text-gray-400 text-xs">
              {preview.items.join(', ')}
              {preview.count > 3 && ` et ${preview.count - 3} autre${preview.count - 3 > 1 ? 's' : ''}...`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 