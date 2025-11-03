import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, stepNames }) => {
  // Progress is 0% at step 1 and 100% at the last step.
  const progressPercentage = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 100;

  return (
    <div className="w-full mb-8 px-4 sm:px-0" dir="rtl">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-bold text-orange-600">{stepNames[currentStep - 1]}</span>
        <span className="text-xs font-semibold text-gray-500">
          الخطوة {currentStep} من {totalSteps}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-orange-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepIndicator;
