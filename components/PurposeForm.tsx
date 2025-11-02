import React, { useState } from 'react';
import { UserData } from '../types.ts';
import { ArrowLeftIcon, ArrowRightIcon } from './icons.tsx';

interface PurposeFormProps {
  initialData: UserData;
  onSubmit: (data: Partial<UserData>) => void;
  onBack: () => void;
}

const InputField: React.FC<{ label: string; name: keyof UserData; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; className?: string; }> = ({ label, name, value, onChange, type = 'text', className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
    />
  </div>
);

const SelectField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; className?: string; disabled?: boolean; }> = ({ label, name, value, onChange, children, className = '', disabled=false }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-lg bg-white disabled:bg-gray-100"
        >
            {children}
        </select>
    </div>
);

const PurposeForm: React.FC<PurposeFormProps> = ({ initialData, onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        accountPurpose: initialData.accountPurpose || '',
        specificPurpose: initialData.specificPurpose || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">الغرض من فتح الحساب</h2>
                <p className="text-gray-500 mt-2">يرجى تحديد سبب فتح الحساب.</p>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mt-4">
                     <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <SelectField label="الغرض الرئيسي" name="accountPurpose" value={formData.accountPurpose} onChange={handleChange} className="md:col-span-2">
                        <option value="">اختر...</option>
                        <option value="Deposit">إيداع</option>
                        <option value="Trading">تداول</option>
                        <option value="Brokerage">وساطة</option>
                        <option value="Online Shopping">شراء منتجات عبر الإنترنت</option>
                        <option value="Personal">شخصي</option>
                    </SelectField>
                    <InputField label="حدد الغرض (اختياري)" name="specificPurpose" value={formData.specificPurpose} onChange={handleChange} className="md:col-span-2"/>
                </div>
                <div className="flex flex-col sm:flex-row-reverse gap-4 pt-6">
                    <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
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

export default PurposeForm;