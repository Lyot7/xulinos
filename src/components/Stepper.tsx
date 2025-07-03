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
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isFuture = stepNumber > currentStep;

          return (
            <div key={index}>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCompleted || isCurrent
                    ? 'text-black'
                    : 'text-gray-300'
                }`}
                style={{
                  backgroundColor: isCompleted || isCurrent
                    ? 'var(--color-pure-white)' 
                    : '#6C6C6C'
                }}
              >
                {step.number}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop version - With labels */}
      <div className="hidden lg:flex items-center justify-center relative">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isFuture = stepNumber > currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center relative" style={{ minWidth: '115px' }}>
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold relative z-10 ${
                  isCompleted || isCurrent
                    ? 'text-black'
                    : 'text-gray-300'
                }`}
                style={{
                  backgroundColor: isCompleted || isCurrent
                    ? 'var(--color-pure-white)' 
                    : '#6C6C6C'
                }}
              >
                {step.number}
              </div>
              <div className={`mt-2 text-xs font-medium text-center ${
                isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
              }`}>
                {step.label}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className="absolute top-6 h-[2px] z-0"
                  style={{
                    left: '54px', // 24px (demi-cercle) + 30px (espacement)
                    width: '100px', // Agrandi
                    backgroundColor: isCompleted
                      ? 'var(--color-pure-white)' 
                      : '#6C6C6C'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 