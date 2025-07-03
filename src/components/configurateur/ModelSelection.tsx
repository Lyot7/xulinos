import { ConfiguratorStepData } from '@/types/configurateur';

interface ModelSelectionProps {
  stepData: ConfiguratorStepData;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  modelSearchTerm: string;
  setModelSearchTerm: (term: string) => void;
}

export default function ModelSelection({
  stepData,
  selectedModel,
  setSelectedModel,
  modelSearchTerm,
  setModelSearchTerm
}: ModelSelectionProps) {
  const filteredModels = (stepData && stepData.models) ? stepData.models.filter(model => 
    model.name.toLowerCase().includes(modelSearchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(modelSearchTerm.toLowerCase())
  ) : [];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
        {stepData.title || "Étape 1"}
      </h2>
      <div className="mb-4 lg:mb-6">
        <input
          type="text"
          placeholder="Recherchez par modèle, matériau ou couleur..."
          value={modelSearchTerm}
          onChange={(e) => setModelSearchTerm(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 rounded-full bg-pure-white placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none text-deep-black text-sm sm:text-base"
          style={{
            backgroundColor: 'var(--color-pure-white)',
            color: 'var(--color-deep-black)',
            borderColor: 'var(--color-gray-medium)',
            borderWidth: '1px'
          }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {!stepData.models || stepData.models.length === 0 ? (
          <div className="col-span-full text-center py-6 lg:py-8">
            <p className="text-gray-400 text-base lg:text-lg">
              Aucun modèle trouvé
            </p>
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="col-span-full text-center py-6 lg:py-8">
            <p className="text-gray-400 text-base lg:text-lg">
              Aucun modèle ne correspond à votre recherche "{modelSearchTerm}"
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              Essayez avec des termes différents ou videz le champ de recherche
            </p>
          </div>
        ) : (
          filteredModels.map((model) => (
            <div
              key={model.id}
              className={`rounded-lg p-2 lg:p-3 cursor-pointer transition-all ${
                selectedModel === model.id ? 'ring-2 ring-white' : 'hover:opacity-80'
              }`}
              onClick={() => setSelectedModel(model.id)}
            >
              <div 
                className="rounded-lg mb-2 lg:mb-3"
                style={{ aspectRatio: '2/1' }}
              >
                <img 
                  src={model.image} 
                  alt={model.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="font-bold mb-1 text-sm lg:text-base" style={{ color: 'var(--color-pure-white)' }}>
                {model.name}
              </h3>
              <p className="text-xs lg:text-sm" style={{ color: 'var(--color-gray-medium)' }}>
                {model.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 