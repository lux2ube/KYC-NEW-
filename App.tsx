import React, { useState } from 'react';
import { UserData, DocImages, DocumentType } from './types';
import { extractDataFromDocument } from './services/geminiService';

import DocumentUpload from './components/DocumentUpload';
import DetailsForm from './components/DetailsForm';
import PhoneNumberForm from './components/PhoneNumberForm';
import AddressForm from './components/AddressForm';
import PurposeForm from './components/PurposeForm';
import SignaturePad from './components/SignaturePad';
import Preview from './components/Preview';
import StepIndicator from './components/StepIndicator';
import { LoadingIcon } from './components/icons';

const initialUserData: UserData = {
  fullName: '', idNumber: '', dateOfBirth: '', placeOfIssue: '', dateOfIssue: '',
  expiryDate: '', gender: '', nationality: 'يمني', birthGovernorate: '',
  birthDistrict: '', whatsappNumber: '', addressGovernorate: '', addressDistrict: '',
  addressStreet: '', accountPurpose: '', specificPurpose: '',
};

const STEPS = [
  'رفع المستندات', 'مراجعة البيانات', 'رقم التواصل', 'العنوان', 'الغرض من الحساب', 'التوقيع', 'المعاينة النهائية'
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [docImages, setDocImages] = useState<DocImages>({ front: null, back: null, passport: null });
  const [signature, setSignature] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  const handlePrevStep = () => setCurrentStep(prev => prev - 1);

  const handleDocUploadSubmit = async (images: DocImages, docType: DocumentType) => {
    setIsLoading(true);
    setError(null);
    try {
      const extractedData = await extractDataFromDocument(images, docType);
      setUserData(prev => ({ ...prev, ...extractedData }));
      setDocImages(images);
      handleNextStep();
    } catch (e) {
      console.error(e);
      setError('فشل استخراج البيانات. يرجى المحاولة مرة أخرى بصور أوضح.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsSubmit = (data: UserData) => {
    setUserData(data);
    handleNextStep();
  };
  
  const handlePartialUpdate = (data: Partial<UserData>) => {
    setUserData(prev => ({...prev, ...data}));
    handleNextStep();
  };

  const handleSignatureSubmit = (signatureDataUrl: string) => {
    setSignature(signatureDataUrl);
    handleNextStep();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DocumentUpload onSubmit={handleDocUploadSubmit} />;
      case 2:
        return <DetailsForm initialData={userData} onSubmit={handleDetailsSubmit} onBack={handlePrevStep} />;
      case 3:
        return <PhoneNumberForm initialData={userData} onSubmit={handlePartialUpdate} onBack={handlePrevStep} />;
      case 4:
        return <AddressForm initialData={userData} onSubmit={handlePartialUpdate} onBack={handlePrevStep} />;
      case 5:
        return <PurposeForm initialData={userData} onSubmit={handlePartialUpdate} onBack={handlePrevStep} />;
      case 6:
        return <SignaturePad onSubmit={handleSignatureSubmit} onBack={handlePrevStep} />;
      case 7:
        return <Preview userData={userData} docImages={docImages} signature={signature} onBack={handlePrevStep} />;
      default:
        return <div>خطأ: خطوة غير معروفة</div>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-[Tajawal,sans-serif] text-gray-800 flex flex-col items-center p-4 sm:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
            <span className="text-orange-500">Y Coin</span> Cash
        </h1>
        <p className="text-gray-500 mt-2">نظام التحقق من الهوية (KYC)</p>
      </header>
      
      <main className="w-full max-w-4xl bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-gray-200">
        <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} stepNames={STEPS} />
        <div className="mt-8 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-lg">
              <LoadingIcon className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="mt-4 text-lg font-semibold text-gray-700">جاري استخراج البيانات...</p>
              <p className="text-sm text-gray-500">قد يستغرق هذا بضع ثوان.</p>
            </div>
          )}
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">{error}</div>}
          {renderCurrentStep()}
        </div>
      </main>

      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Y Coin Cash. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}

export default App;
