import React, { useState, useEffect } from 'react';
import { UserData } from '../types.ts';
import { YEMEN_LOCATIONS } from '../data/yemenLocations.ts';
import { ArrowLeftIcon, ArrowRightIcon } from './icons.tsx';
import { InputField, SelectField } from './FormControls.tsx';

interface AddressFormProps {
  initialData: UserData;
  onSubmit: (data: Partial<UserData>) => void;
  onBack: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ initialData, onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        addressGovernorate: initialData.addressGovernorate || '',
        addressDistrict: initialData.addressDistrict || '',
        addressStreet: initialData.addressStreet || '',
    });
    const [districts, setDistricts] = useState<string[]>([]);
    
    useEffect(() => {
        if (formData.addressGovernorate) {
            setDistricts(YEMEN_LOCATIONS[formData.addressGovernorate as keyof typeof YEMEN_LOCATIONS] || []);
        } else {
            setDistricts([]);
        }
    }, [formData.addressGovernorate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'addressGovernorate') {
                newState.addressDistrict = ''; // Reset district when governorate changes
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
        <div className="animate-fade-in" dir="rtl">
            <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">عنوان السكن</h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">يرجى إدخال تفاصيل عنوانك الحالي بدقة.</p>
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 mt-4">
                     <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
            </div>
             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 sm:gap-y-6">
                    <SelectField label="المحافظة" name="addressGovernorate" value={formData.addressGovernorate} onChange={handleChange} className="md:col-span-2">
                        <option value="">اختر محافظة...</option>
                        {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                    </SelectField>
                    <SelectField label="المديرية" name="addressDistrict" value={formData.addressDistrict} onChange={handleChange} disabled={!formData.addressGovernorate}>
                       <option value="">اختر مديرية...</option>
                       {districts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                    </SelectField>
                    <InputField label="الشارع / الحي" name="addressStreet" value={formData.addressStreet} onChange={handleChange} />
                </div>
                <div className="flex flex-col sm:flex-row-reverse gap-4 pt-6">
                    <button type="submit" disabled={!formData.addressGovernorate || !formData.addressDistrict || !formData.addressStreet} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-300">
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

export default AddressForm;