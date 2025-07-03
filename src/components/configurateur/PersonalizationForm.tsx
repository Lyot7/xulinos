import { ConfiguratorStepData, ConfiguratorFormData } from '@/types/configurateur';

interface PersonalizationFormProps {
  stepData: ConfiguratorStepData;
  formData: ConfiguratorFormData;
  setFormData: (data: ConfiguratorFormData) => void;
}

export default function PersonalizationForm({
  stepData,
  formData,
  setFormData
}: PersonalizationFormProps) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6 text-white">
        {stepData.title || "Étape 4"}
      </h2>
      <div className="space-y-4 lg:space-y-6">
        {!stepData.fields || stepData.fields.length === 0 ? (
          <div className="text-center py-6 lg:py-8">
            <p className="text-gray-400 text-base lg:text-lg">
              Aucun champ trouvé
            </p>
          </div>
        ) : (
          stepData.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  className="w-full p-3 sm:p-4 rounded-lg bg-pure-white text-deep-black placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none resize-none text-sm sm:text-base"
                  style={{
                    backgroundColor: 'var(--color-pure-white)',
                    color: 'var(--color-deep-black)',
                    borderColor: 'var(--color-gray-medium)',
                    borderWidth: '1px'
                  }}
                  rows={3}
                  value={formData[field.id as keyof ConfiguratorFormData] || ''}
                  onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full p-3 sm:p-4 rounded-lg bg-pure-white text-deep-black placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none text-sm sm:text-base"
                  style={{
                    backgroundColor: 'var(--color-pure-white)',
                    color: 'var(--color-deep-black)',
                    borderColor: 'var(--color-gray-medium)',
                    borderWidth: '1px'
                  }}
                  value={formData[field.id as keyof ConfiguratorFormData] || ''}
                  onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                  required={field.required}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 