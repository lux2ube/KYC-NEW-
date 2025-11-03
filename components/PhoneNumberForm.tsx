import React, { useState } from 'react';
import { UserData } from '../types.ts';
import { ArrowLeftIcon, ArrowRightIcon } from './icons.tsx';

interface PhoneNumberFormProps {
  initialData: UserData;
  onSubmit: (data: Partial<UserData>) => void;
  onBack: () => void;
}

const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({ initialData, onSubmit, onBack }) => {
    const [whatsappNumber, setWhatsappNumber] = useState(initialData.whatsappNumber || '');
    const [error, setError] = useState<string | null>(null);

    const validateAndSetNumber = (value: string) => {
        const newNumber = value.replace(/\D/g, '');
        if (newNumber.length > 9) return;

        setWhatsappNumber(newNumber);
        
        if (newNumber.length > 0 && newNumber.length < 9) {
            setError('يجب أن يتكون الرقم من 9 أرقام.');
        } else if (newNumber.length === 9) {
            const yemenPhoneRegex = /^(70|71|73|77|78)\d{7}$/;
            if (!yemenPhoneRegex.test(newNumber)) {
                setError('الرقم غير صالح. يجب أن يبدأ بـ 70, 71, 73, 77, أو 78.');
            } else {
                setError(null);
            }
        } else {
            setError(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (whatsappNumber.length === 0) {
            setError('الرجاء إدخال رقم الواتساب.');
            return;
        }
        if (!error && whatsappNumber.length === 9) {
            onSubmit({ whatsappNumber });
        }
    };
    
    const isButtonDisabled = !!error || whatsappNumber.length !== 9;

    return (
        <div className="animate-fade-in" dir="rtl">
            <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">رقم التواصل</h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">يرجى إدخال رقم الواتساب الخاص بك (9 أرقام).</p>
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 mt-4">
                    <svg className="w-12 h-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                </div>
            </div>
             <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                <div>
                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">رقم الواتساب</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm" dir="ltr">+967</span>
                        </div>
                        <input
                            type="tel"
                            id="whatsappNumber"
                            name="whatsappNumber"
                            value={whatsappNumber}
                            onChange={(e) => validateAndSetNumber(e.target.value)}
                            placeholder="777123456"
                            className={`block w-full rounded-lg border-0 py-2.5 pl-14 pr-3 text-gray-900 ring-1 ring-inset ${error ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-300 focus:ring-orange-500'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 text-left`}
                            dir="ltr"
                            required
                        />
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                <div className="flex flex-col sm:flex-row-reverse gap-4 pt-6">
                    <button type="submit" disabled={isButtonDisabled} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed">
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

export default PhoneNumberForm;