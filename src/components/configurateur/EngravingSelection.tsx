import { ConfiguratorStepData } from '@/types/configurateur';
import SearchInput from '@/components/SearchInput';

interface EngravingSelectionProps {
  stepData: ConfiguratorStepData;
  selectedEngraving: string;
  setSelectedEngraving: (engraving: string) => void;
  engravingSearchTerm: string;
  setEngravingSearchTerm: (term: string) => void;
}

export default function EngravingSelection({
  stepData,
  selectedEngraving,
  setSelectedEngraving,
  engravingSearchTerm,
  setEngravingSearchTerm
}: EngravingSelectionProps) {
  const filteredEngravingPatterns = (stepData && stepData.patterns) ? stepData.patterns.filter(pattern => 
    pattern.name.toLowerCase().includes(engravingSearchTerm.toLowerCase())
  ) : [];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
        {stepData.title || "Étape 3"}
      </h2>
      {stepData.description && (
        <p className="text-gray-300 mb-4 lg:mb-6 text-sm sm:text-base">
          {stepData.description}
        </p>
      )}
      <SearchInput
        value={engravingSearchTerm}
        onChange={setEngravingSearchTerm}
        placeholder="Recherchez un motif de guillochage (floral, géométrique...)"
        className="mb-4 lg:mb-6"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {!stepData.patterns || stepData.patterns.length === 0 ? (
          <div className="col-span-full text-center py-6 lg:py-8">
            <p className="text-gray-400 text-base lg:text-lg">
              Aucun motif trouvé
            </p>
          </div>
        ) : filteredEngravingPatterns.length === 0 ? (
          <div className="col-span-full text-center py-6 lg:py-8">
            <p className="text-gray-400 text-base lg:text-lg">
              Aucun motif ne correspond à votre recherche "{engravingSearchTerm}"
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              Essayez avec des termes différents ou videz le champ de recherche
            </p>
          </div>
        ) : (
          filteredEngravingPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className={`rounded-lg p-3 lg:p-4 cursor-pointer transition-all text-center ${
                selectedEngraving === pattern.id ? 'ring-2 ring-white' : 'hover:opacity-80'
              }`}
              onClick={() => setSelectedEngraving(pattern.id)}
            >
              <div 
                className="rounded-lg mb-2 lg:mb-3"
                style={{ aspectRatio: '2/1' }}
              >
                <img 
                  src={pattern.image} 
                  alt={pattern.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="text-white font-medium text-xs sm:text-sm">{pattern.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 