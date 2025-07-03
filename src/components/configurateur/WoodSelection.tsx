import { ConfiguratorStepData } from '@/types/configurateur';

interface WoodSelectionProps {
  stepData: ConfiguratorStepData;
  selectedWood: string;
  setSelectedWood: (wood: string) => void;
  woodSearchTerm: string;
  setWoodSearchTerm: (term: string) => void;
}

export default function WoodSelection({
  stepData,
  selectedWood,
  setSelectedWood,
  woodSearchTerm,
  setWoodSearchTerm
}: WoodSelectionProps) {
  const filteredWoods = (stepData && stepData.woods) ? stepData.woods.filter(wood => 
    wood.name.toLowerCase().includes(woodSearchTerm.toLowerCase())
  ) : [];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
        {stepData.title || "Étape 2"}
      </h2>
      <div className="mb-4 lg:mb-6">
        <input
          type="text"
          placeholder="Recherchez un type de bois (noyer, chêne, érable...)"
          value={woodSearchTerm}
          onChange={(e) => setWoodSearchTerm(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 rounded-full bg-pure-white placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none text-deep-black text-sm sm:text-base"
          style={{
            backgroundColor: 'var(--color-pure-white)',
            color: 'var(--color-deep-black)',
            borderColor: 'var(--color-gray-medium)',
            borderWidth: '1px'
          }}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {!stepData.woods || stepData.woods.length === 0 ? (
          <div className="col-span-full text-center py-6 lg:py-8">
            <p className="text-gray-400 text-base lg:text-lg">
              Aucun bois trouvé
            </p>
          </div>
        ) : filteredWoods.length === 0 ? (
          <div className="col-span-full text-center py-6 lg:py-8">
            <p className="text-gray-400 text-base lg:text-lg">
              Aucun bois ne correspond à votre recherche "{woodSearchTerm}"
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              Essayez avec des termes différents ou videz le champ de recherche
            </p>
          </div>
        ) : (
          filteredWoods.map((wood) => (
            <div
              key={wood.id}
              className={`cursor-pointer transition-all p-2 ${
                selectedWood === wood.id ? 'ring-2 ring-white rounded-lg' : 'hover:opacity-80'
              }`}
              onClick={() => setSelectedWood(wood.id)}
            >
              <div
                className="rounded-lg mb-2"
                style={{ aspectRatio: '2/1' }}
              >
                <img 
                  src={wood.image} 
                  alt={wood.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="text-white text-center font-medium text-xs sm:text-sm">{wood.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 