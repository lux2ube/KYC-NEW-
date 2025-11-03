import React, { useState } from 'react';
import { UserData, DocImages, DocumentType } from './types.ts';
import { extractDataFromDocument } from './services/geminiService.ts';

import DocumentUpload from './components/DocumentUpload.tsx';
import LivenessCheck from './components/LivenessCheck.tsx';
import DetailsForm from './components/DetailsForm.tsx';
import PhoneNumberForm from './components/PhoneNumberForm.tsx';
import AddressForm from './components/AddressForm.tsx';
import PurposeForm from './components/PurposeForm.tsx';
import OccupationForm from './components/OccupationForm.tsx';
import SignaturePad from './components/SignaturePad.tsx';
import Preview from './components/Preview.tsx';
import StepIndicator from './components/StepIndicator.tsx';
import { LoadingIcon } from './components/icons.tsx';

const initialUserData: UserData = {
  fullName: '', idNumber: '', dateOfBirth: '', placeOfIssue: '', dateOfIssue: '',
  expiryDate: '', gender: '', nationality: 'يمني', birthGovernorate: '',
  birthDistrict: '', whatsappNumber: '', addressGovernorate: '', addressDistrict: '',
  addressStreet: '', accountPurpose: '', specificPurpose: '', occupation: '', sourceOfFunds: '',
};

const STEPS = [
  'رفع المستندات', 'صورة السيلفي', 'مراجعة البيانات', 'رقم التواصل', 'العنوان', 'الغرض من الحساب', 'المهنة ومصدر الدخل', 'التوقيع', 'المعاينة النهائية'
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [docImages, setDocImages] = useState<DocImages>({ front: null, back: null, passport: null });
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
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
      if (e instanceof Error) {
        if (e.message === 'API_KEY_INVALID') {
            setError('فشل المصادقة. يرجى التأكد من صحة مفتاح API المقدم.');
        } else {
            setError(e.message);
        }
      } else {
        setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLivenessCheckSubmit = (selfie: string) => {
    setSelfieImage(selfie);
    handleNextStep();
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
  
  const handleStartOver = () => {
    setCurrentStep(1);
    setUserData(initialUserData);
    setDocImages({ front: null, back: null, passport: null });
    setSelfieImage(null);
    setSignature('');
    setError(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DocumentUpload onSubmit={handleDocUploadSubmit} />;
      case 2:
        return <LivenessCheck onBack={handlePrevStep} onSubmit={handleLivenessCheckSubmit} />;
      case 3:
        return <DetailsForm initialData={userData} onSubmit={handleDetailsSubmit} onBack={handlePrevStep} />;
      case 4:
        return <PhoneNumberForm initialData={userData} onSubmit={handlePartialUpdate} onBack={handlePrevStep} />;
      case 5:
        return <AddressForm initialData={userData} onSubmit={handlePartialUpdate} onBack={handlePrevStep} />;
      case 6:
        return <PurposeForm initialData={userData} onSubmit={handlePartialUpdate} onBack={handlePrevStep} />;
      case 7:
        return <OccupationForm initialData={userData} onSubmit={handlePartialUpdate} onBack={handlePrevStep} />;
      case 8:
        return <SignaturePad onSubmit={handleSignatureSubmit} onBack={handlePrevStep} />;
      case 9:
        return <Preview userData={userData} docImages={docImages} signature={signature} selfieImage={selfieImage} onBack={handlePrevStep} onStartOver={handleStartOver} />;
      default:
        return <div>خطأ: خطوة غير معروفة</div>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-[Tajawal,sans-serif] text-gray-800 flex flex-col items-center p-4 sm:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            <span className="text-orange-500">Y Coin</span> Cash
        </h1>
        <p className="text-gray-500 mt-2">نظام التحقق من الهوية (KYC)</p>
      </header>
      
      <main className="w-full max-w-4xl bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
        <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} stepNames={STEPS} />
        <div className="mt-6 sm:mt-8 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-lg">
              <LoadingIcon className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="mt-4 text-lg font-semibold text-gray-700">جاري التحقق...</p>
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