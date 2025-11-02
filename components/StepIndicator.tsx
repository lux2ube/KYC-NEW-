import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, stepNames }) => {
  return (
    <div className="flex items-center justify-center mb-8 px-4" dir="rtl">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  isActive ? 'bg-orange-500 text-white shadow-lg' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  step
                )}
              </div>
              <p className={`mt-2 text-xs text-center font-semibold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-500'}`}>
                {stepNames[i]}
              </p>
            </div>
            {step < totalSteps && (
              <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
