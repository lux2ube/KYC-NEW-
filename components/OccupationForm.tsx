import React, { useState } from 'react';
import { UserData } from '../types.ts';
import { ArrowLeftIcon, ArrowRightIcon, BriefcaseIcon } from './icons.tsx';

interface OccupationFormProps {
  initialData: UserData;
  onSubmit: (data: Partial<UserData>) => void;
  onBack: () => void;
}

const OccupationForm: React.FC<OccupationFormProps> = ({ initialData, onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        occupation: initialData.occupation || '',
        sourceOfFunds: initialData.sourceOfFunds || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };
    
    const isButtonDisabled = !formData.occupation || !formData.sourceOfFunds;

    return (
        <div className="animate-fade-in" dir="rtl">
            <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">المهنة ومصدر الدخل</h2>
                <p className="text-gray-500 mt-2">يرجى تقديم معلومات حول مهنتك ومصدر دخلك الرئيسي.</p>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mt-4">
                     <BriefcaseIcon className="w-12 h-12 text-slate-400" />
                </div>
            </div>
             <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                 <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">المهنة / الوظيفة</label>
                    <input
                        type="text"
                        id="occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="مثال: مهندس برمجيات، طبيب، تاجر"
                    />
                </div>
                 <div>
                    <label htmlFor="sourceOfFunds" className="block text-sm font-medium text-gray-700 mb-1">مصدر الدخل</label>
                    <input
                        type="text"
                        id="sourceOfFunds"
                        name="sourceOfFunds"
                        value={formData.sourceOfFunds}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="مثال: راتب شهري، أرباح تجارية، استثمار"
                    />
                </div>
                <div className="flex flex-col sm:flex-row-reverse gap-4 pt-6">
                    <button type="submit" disabled={isButtonDisabled} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-300">
                        <span>التالي</span>
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    </button>
                    <button type="button" onClick={onBack} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                        <span>رجوع</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OccupationForm;