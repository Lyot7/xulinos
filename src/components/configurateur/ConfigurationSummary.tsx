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
        {stepData.paragraph && (
          <p className="text-left">
            {stepData.paragraph}
          </p>
        )}
        
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
          <></>
        )}
      </div>
    </div>
  );
} 