import { ConfiguratorStepData, ConfiguratorFormData } from '@/types/configurateur';
import PrimaryButton from '@/components/PrimaryButton';

interface ConfigurationSummaryProps {
  stepData: ConfiguratorStepData;
  allStepsData: Record<number, ConfiguratorStepData>;
  formData: ConfiguratorFormData;
  selectedModel: string;
  selectedWood: string;
  selectedEngraving: string;
}

export default function ConfigurationSummary({
  stepData,
  allStepsData,
  formData,
  selectedModel,
  selectedWood,
  selectedEngraving
}: ConfigurationSummaryProps) {
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
} 