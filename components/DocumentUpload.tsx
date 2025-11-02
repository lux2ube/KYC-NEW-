import React, { useState, useCallback } from 'react';
import { DocumentType, DocImages } from '../types.ts';
// fix: Replaced the unused `ArrowRightIcon` import with `ArrowLeftIcon` to resolve the "Cannot find name" error.
import { UploadIcon, CheckIcon, ArrowLeftIcon } from './icons.tsx';

interface DocumentUploadProps {
  onSubmit: (images: DocImages, docType: DocumentType) => void;
}

const FileInput: React.FC<{ id: string; label: string; onFileSelect: (file: string | null) => void; fileName: string | null }> = ({ id, label, onFileSelect, fileName }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-4">
      <label htmlFor={id} className={`cursor-pointer block w-full p-4 border rounded-lg text-center transition-colors ${fileName ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
        {fileName ? (
          <div className="flex items-center justify-center text-green-600">
            <CheckIcon className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium truncate">{fileName}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center text-gray-600">
             <UploadIcon className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium">{label}</span>
          </div>
        )}
      </label>
      <input id={id} type="file" capture="environment" className="hidden" accept="image/jpeg" onChange={handleFileChange} />
    </div>
  );
};


const DocumentUpload: React.FC<DocumentUploadProps> = ({ onSubmit }) => {
  const [docType, setDocType] = useState<DocumentType>(DocumentType.IDCard);
  const [images, setImages] = useState<DocImages>({ front: null, back: null, passport: null });
  const [fileNames, setFileNames] = useState<{ front: string | null; back: string | null; passport: string | null; }>({ front: null, back: null, passport: null });

  const handleFileSelect = (type: keyof DocImages, dataUrl: string | null, fileName: string) => {
    setImages(prev => ({ ...prev, [type]: dataUrl }));
    setFileNames(prev => ({ ...prev, [type]: fileName }));
  };
  
  const isIdCardReady = docType === DocumentType.IDCard && images.front && images.back;
  const isPassportReady = docType === DocumentType.Passport && images.passport;
  const isReady = isIdCardReady || isPassportReady;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReady) {
      onSubmit(images, docType);
    }
  };

  return (
    <div className="animate-fade-in text-center" dir="rtl">
      <h2 className="text-2xl font-bold text-gray-800">التحقق من الهوية</h2>
      <p className="text-gray-500 mt-2">اختر نوع الهوية ثم قم بتصوير المستندات المطلوبة.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
        <button onClick={() => setDocType(DocumentType.IDCard)} className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${docType === DocumentType.IDCard ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-300 bg-white'}`}>بطاقة شخصية</button>
        <button onClick={() => setDocType(DocumentType.Passport)} className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${docType === DocumentType.Passport ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-300 bg-white'}`}>جواز سفر</button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 max-w-lg mx-auto">
        {docType === DocumentType.IDCard ? (
          <div>
            <FileInput id="id-front" label="تصوير الوجه الأمامي" fileName={fileNames.front} onFileSelect={(data) => handleFileSelect('front', data, 'id_front.jpg')} />
            <FileInput id="id-back" label="تصوير الوجه الخلفي" fileName={fileNames.back} onFileSelect={(data) => handleFileSelect('back', data, 'id_back.jpg')} />
          </div>
        ) : (
          <FileInput id="passport" label="تصوير جواز السفر" fileName={fileNames.passport} onFileSelect={(data) => handleFileSelect('passport', data, 'passport.jpg')} />
        )}
        
        <div className="mt-8">
            <button type="submit" disabled={!isReady} className="w-full inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                <span>استخراج البيانات</span>
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
            </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;