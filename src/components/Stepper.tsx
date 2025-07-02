interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
  const steps = [
    { number: 1, label: 'Modèle' },
    { number: 2, label: 'Bois' },
    { number: 3, label: 'Guillochage' },
    { number: 4, label: 'Personnalisation' },
    { number: 5, label: 'Confirmation' }
  ];

  return (
    <div className="mb-6 lg:mb-8">
      {/* Mobile version - Simplified horizontal */}
      <div className="flex lg:hidden items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index + 1 <= currentStep
                  ? 'text-black'
                  : 'text-gray-300'
              }`}
              style={{
                backgroundColor: index + 1 <= currentStep 
                  ? 'var(--color-pure-white)' 
                  : '#6C6C6C'
              }}
            >
              {step.number}
            </div>
            {index < totalSteps - 1 && (
              <div
                className="w-8 h-[2px] mx-2"
                style={{
                  backgroundColor: index + 1 < currentStep 
                    ? 'var(--color-pure-white)' 
                    : '#6C6C6C'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Desktop version - With labels */}
      <div className="hidden lg:flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                  index + 1 <= currentStep
                    ? 'text-black'
                    : 'text-gray-300'
                }`}
                style={{
                  backgroundColor: index + 1 <= currentStep 
                    ? 'var(--color-pure-white)' 
                    : '#6C6C6C'
                }}
              >
                {step.number}
              </div>
              <div className={`mt-2 text-xs font-medium ${
                index + 1 <= currentStep ? 'text-white' : 'text-gray-400'
              }`}>
                {step.label}
              </div>
            </div>
            {index < totalSteps - 1 && (
              <div
                className="w-16 h-[2px] mx-4"
                style={{
                  backgroundColor: index + 1 < currentStep 
                    ? 'var(--color-pure-white)' 
                    : '#6C6C6C'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 