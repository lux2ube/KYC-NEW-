import React from 'react';

interface ApiKeyPromptProps {
  onSelectKey: () => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSelectKey }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">مفتاح API مطلوب</h2>
        <p className="mt-2 text-gray-600">
          لاستخدام ميزات الذكاء الاصطناعي في هذا التطبيق، يرجى تحديد مفتاح Google AI Studio API الخاص بك.
        </p>
        <div className="mt-6">
          <button 
            onClick={onSelectKey}
            className="w-full inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            اختيار مفتاح API
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          قد يتم تطبيق رسوم. يرجى مراجعة <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">وثائق الفوترة</a> لمزيد من التفاصيل.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
