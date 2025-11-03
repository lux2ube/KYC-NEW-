import React, { useState } from 'react';
import { UserData } from '../types.ts';
import { ArrowLeftIcon, ArrowRightIcon } from './icons.tsx';

interface BeneficialOwnerDeclarationProps {
  userData: UserData;
  onBack: () => void;
  onSubmit: () => void;
}

const BeneficialOwnerDeclaration: React.FC<BeneficialOwnerDeclarationProps> = ({ userData, onBack, onSubmit }) => {
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (agreed) {
            onSubmit();
        }
    };

    return (
        <div className="animate-fade-in" dir="rtl">
            <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">إقرار المستفيد الحقيقي</h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">يرجى قراءة الإقرار أدناه والموافقة عليه للمتابعة.</p>
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 mt-4">
                    <svg className="w-12 h-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
                    </svg>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                <div className="text-base leading-relaxed bg-slate-50 p-6 rounded-lg border border-slate-200 text-gray-700">
                    <p className="mb-4">أقر أنا، <strong>{userData.fullName}</strong>، بصفتي الشخصية، بأنني المستفيد الحقيقي والنهائي من الحساب الذي سيتم فتحه لدى Y Coin Cash، وأنني أتصرف لحسابي الخاص وليس بصفتي وكيلاً أو ممثلاً أو بالنيابة عن أي شخص أو جهة أخرى.</p>
                    <p>كما أتعهد بإبلاغ Y Coin Cash كتابيًا وفورًا في حال تغيرت هذه الصفة في المستقبل، وأتحمل كامل المسؤولية القانونية المترتبة على صحة هذا الإقرار.</p>
                </div>

                <div className="flex items-center">
                    <input
                        id="agree-checkbox"
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <label htmlFor="agree-checkbox" className="mr-3 text-sm font-medium text-gray-900">أقر وأوافق على ما ورد أعلاه.</label>
                </div>

                <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
                    <button type="submit" disabled={!agreed} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed">
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

export default BeneficialOwnerDeclaration;