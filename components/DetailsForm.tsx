import React, { useState, useEffect } from 'react';
import { UserData } from '../types.ts';
import { YEMEN_LOCATIONS } from '../data/yemenLocations.ts';
import { ArrowLeftIcon, ArrowRightIcon } from './icons.tsx';

interface DetailsFormProps {
  initialData: UserData;
  onSubmit: (data: UserData) => void;
  onBack: () => void;
}

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="pt-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {children}
        </div>
    </div>
);

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

const DetailsForm: React.FC<DetailsFormProps> = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<UserData>(initialData);
  const [birthDistricts, setBirthDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (formData.birthGovernorate) {
      setBirthDistricts(YEMEN_LOCATIONS[formData.birthGovernorate as keyof typeof YEMEN_LOCATIONS] || []);
    } else {
      setBirthDistricts([]);
    }
  }, [formData.birthGovernorate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
        const newState = { ...prev, [name]: value };
        if (name === 'birthGovernorate') {
            newState.birthDistrict = ''; // Reset district when governorate changes
        }
        return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const governorates = Object.keys(YEMEN_LOCATIONS);

  return (
    <div className="animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">البيانات الشخصية</h2>
            <p className="text-gray-500 mt-2">يرجى مراجعة البيانات المستخرجة من المستند وتصحيحها إذا لزم الأمر.</p>
             <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mt-4">
                <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
        </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="البيانات الشخصية المستخرجة">
          <InputField label="الاسم الكامل" name="fullName" value={formData.fullName} onChange={handleChange} className="md:col-span-2" />
          <InputField label="رقم الهوية" name="idNumber" value={formData.idNumber} onChange={handleChange} />
           <SelectField label="الجنس" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">اختر...</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </SelectField>
          <InputField label="تاريخ الميلاد" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" />
          <InputField label="الجنسية" name="nationality" value={formData.nationality} onChange={handleChange} />
          <SelectField label="محافظة الميلاد" name="birthGovernorate" value={formData.birthGovernorate || ''} onChange={handleChange}>
            <option value="">اختر محافظة...</option>
            {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
          </SelectField>
          <SelectField label="مديرية الميلاد" name="birthDistrict" value={formData.birthDistrict || ''} onChange={handleChange} disabled={!formData.birthGovernorate}>
             <option value="">اختر مديرية...</option>
             {birthDistricts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
          </SelectField>
        </FormSection>

        <FormSection title="بيانات إصدار الهوية">
            <InputField label="مكان الإصدار" name="placeOfIssue" value={formData.placeOfIssue} onChange={handleChange} />
            <InputField label="تاريخ الإصدار" name="dateOfIssue" value={formData.dateOfIssue} onChange={handleChange} type="date" />
            <InputField label="تاريخ الانتهاء" name="expiryDate" value={formData.expiryDate} onChange={handleChange} type="date" />
        </FormSection>

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

export default DetailsForm;