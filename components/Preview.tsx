import React, { useRef, useState, useEffect } from 'react';
import { UserData, DocImages } from '../types';
import { ArrowRightIcon, DownloadIcon } from './icons';
import { LoadingIcon } from './icons';

declare var jspdf: any;
declare var html2canvas: any;

interface PreviewProps {
  userData: UserData;
  docImages: DocImages;
  signature: string;
  onBack: () => void;
}

const PdfDocument: React.FC<PreviewProps> = ({ userData, docImages, signature }) => {
    const getPurposeDisplay = (purpose: string) => {
        const purposes: { [key: string]: string } = {
            'Deposit': 'إيداع',
            'Trading': 'تداول',
            'Brokerage': 'وساطة',
            'Online Shopping': 'شراء منتجات عبر الإنترنت',
            'Personal': 'شخصي',
        };
        return purposes[purpose] || purpose;
    };
    
    return (
        <div className="bg-white text-gray-900 font-[Tajawal,sans-serif]" dir="rtl">
            {/* Page 1: Personal & Account Details */}
            <div id="pdf-page-1" className="p-10 w-[210mm] h-[297mm] bg-white flex flex-col">
                <header className="flex justify-between items-center pb-4 border-b-2 border-orange-500">
                    <h1 className="text-3xl font-extrabold text-gray-800">Y COIN CASH</h1>
                    <p className="text-lg font-bold text-orange-500">طلب فتح حساب شخصي</p>
                </header>
                <div className="grow mt-8 space-y-6">
                    {/* Personal Details Section */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-700 mb-3">البيانات الشخصية</h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm p-4 bg-slate-50 rounded-lg">
                            <div><strong className="text-gray-500">الاسم الكامل:</strong> {userData.fullName}</div>
                            <div><strong className="text-gray-500">رقم الهوية:</strong> {userData.idNumber}</div>
                            <div><strong className="text-gray-500">تاريخ الميلاد:</strong> {userData.dateOfBirth}</div>
                            <div><strong className="text-gray-500">الجنس:</strong> {userData.gender}</div>
                            <div><strong className="text-gray-500">الجنسية:</strong> {userData.nationality}</div>
                            <div><strong className="text-gray-500">مكان الميلاد:</strong> {`${userData.birthGovernorate} - ${userData.birthDistrict}`}</div>
                            <div><strong className="text-gray-500">رقم الواتساب:</strong> {userData.whatsappNumber}</div>
                        </div>
                    </section>
                    {/* ID Details Section */}
                     <section>
                        <h2 className="text-xl font-bold text-gray-700 mb-3">بيانات الهوية</h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm p-4 bg-slate-50 rounded-lg">
                            <div><strong className="text-gray-500">مكان الإصدار:</strong> {userData.placeOfIssue}</div>
                            <div><strong className="text-gray-500">تاريخ الإصدار:</strong> {userData.dateOfIssue}</div>
                            <div><strong className="text-gray-500">تاريخ الانتهاء:</strong> {userData.expiryDate}</div>
                        </div>
                    </section>
                     {/* Address and Purpose Section */}
                     <section>
                        <h2 className="text-xl font-bold text-gray-700 mb-3">العنوان والغرض من الحساب</h2>
                        <div className="grid grid-cols-1 gap-y-2 text-sm p-4 bg-slate-50 rounded-lg">
                            <div><strong className="text-gray-500">العنوان الحالي:</strong> {`${userData.addressGovernorate}, ${userData.addressDistrict}, ${userData.addressStreet}`}</div>
                            <div><strong className="text-gray-500">الغرض من الحساب:</strong> {getPurposeDisplay(userData.accountPurpose)} ({userData.specificPurpose})</div>
                        </div>
                    </section>
                </div>
                <footer className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
                    <p>Y Coin Cash KYC Document - سري وسري للغاية</p>
                </footer>
            </div>

            {/* Page 2: Terms and Conditions */}
            <div id="pdf-page-2" className="p-10 w-[210mm] h-[297mm] bg-white flex flex-col text-xs">
                 <header className="flex justify-between items-center pb-4 border-b-2 border-orange-500">
                    <h1 className="text-3xl font-extrabold text-gray-800">Y COIN CASH</h1>
                    <p className="text-lg font-bold text-orange-500">الشروط والأحكام</p>
                </header>
                <div className="grow mt-4 overflow-y-auto text-justify space-y-2">
                    <p><strong className="font-bold">1. الموافقة على الشروط:</strong> باستخدامك لخدماتنا، فإنك توافق على الالتزام بجميع بنود هذه الوثيقة.</p>
                    <p><strong className="font-bold">2. الوضع القانوني:</strong> تعمل المنصة كمزود خدمات عبر الإنترنت وفقًا للقوانين النافذة في الجمهورية اليمنية.</p>
                    <p><strong className="font-bold">3. إجراءات التحقق (KYC):</strong> قد نطلب وثائق رسمية للامتثال لإجراءات التحقق من الهوية ومكافحة غسل الأموال.</p>
                    <p><strong className="font-bold">4. المستفيد الحقيقي:</strong> يقر المستخدم بأنه المستفيد الفعلي من الخدمة وأن جميع المعاملات تجري لصالحه الشخصي.</p>
                    <p><strong className="font-bold">5. حدود المسؤولية:</strong> تُقدّم خدماتنا "كما هي" دون أي ضمانات، ولا نتحمل مسؤولية أي خسائر تنشأ عن استخدامها.</p>
                    <p><strong className="font-bold">6. تجميد المبالغ:</strong> نحتفظ بالحق في تجميد أي مبالغ عند الاشتباه في وجود نشاط احتيالي أو غير قانوني.</p>
                    <p><strong className="font-bold">7. القانون الحاكم:</strong> تخضع جميع البنود وتُفسَّر وفقًا للقوانين النافذة في الجمهورية اليمنية.</p>
                    <div className="pt-12">
                        <p className="font-bold">إقرار وتوقيع العميل:</p>
                        <p className="mt-2">أقر أنا الموقع أدناه، {userData.fullName}، بأنني قرأت وفهمت ووافقت على جميع الشروط والأحكام المذكورة أعلاه، وأتعهد بالالتزام بها. كما أقر بصحة جميع البيانات والمستندات المقدمة من قبلي.</p>
                        <div className="mt-8 flex items-end justify-between">
                            <div>
                                <p><strong>التوقيع:</strong></p>
                                <img src={signature} alt="Signature" className="h-16 mt-2 bg-white" />
                            </div>
                            <div>
                                <p><strong>التاريخ:</strong> {new Date().toLocaleDateString('ar-EG')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                 <footer className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
                    <p>Y Coin Cash KYC Document - سري وسري للغاية</p>
                </footer>
            </div>
            
            {/* Page 3: Attached Documents */}
            <div id="pdf-page-3" className="p-10 w-[210mm] h-[297mm] bg-white flex flex-col">
                <header className="flex justify-between items-center pb-4 border-b-2 border-orange-500">
                    <h1 className="text-3xl font-extrabold text-gray-800">Y COIN CASH</h1>
                    <p className="text-lg font-bold text-orange-500">المستندات المرفقة</p>
                </header>
                <div className="grow mt-8 flex flex-col items-center justify-center space-y-8">
                     {docImages.front && (
                        <div>
                            <p className="text-center font-bold mb-2">الوجه الأمامي لبطاقة الهوية</p>
                            <img src={docImages.front} alt="ID Front" className="rounded-lg shadow-lg max-w-full h-auto max-h-80" />
                        </div>
                     )}
                     {docImages.back && (
                        <div>
                            <p className="text-center font-bold mb-2">الوجه الخلفي لبطاقة الهوية</p>
                            <img src={docImages.back} alt="ID Back" className="rounded-lg shadow-lg max-w-full h-auto max-h-80" />
                        </div>
                     )}
                    {docImages.passport && (
                        <div>
                            <p className="text-center font-bold mb-2">جواز السفر</p>
                            <img src={docImages.passport} alt="Passport" className="rounded-lg shadow-lg max-w-full h-auto max-h-[220mm]" />
                        </div>
                    )}
                </div>
                <footer className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
                    <p>Y Coin Cash KYC Document - سري وسري للغاية</p>
                </footer>
            </div>

        </div>
    );
};


const Preview: React.FC<PreviewProps> = ({ userData, docImages, signature, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
        setIsGenerating(true);
        try {
            const { jsPDF } = jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageIds = ['pdf-page-1', 'pdf-page-2', 'pdf-page-3'];

            for (let i = 0; i < pageIds.length; i++) {
                const pageElement = document.getElementById(pageIds[i]);
                if (pageElement) {
                    const canvas = await html2canvas(pageElement, { scale: 2 });
                    const imgData = canvas.toDataURL('image/png');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    
                    if (i > 0) {
                        pdf.addPage();
                    }
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                }
            }
            
            const pdfFileName = `KYC_${userData.fullName.replace(/\s/g, '_')}.pdf`;
            const pdfBlob = pdf.output('blob');
            const file = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
            setPdfFile(file);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("حدث خطأ أثناء إنشاء ملف PDF.");
        } finally {
            setIsGenerating(false);
        }
    };
    generatePdf();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleShare = async () => {
    if (!pdfFile) return;

    try {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
             await navigator.share({
                title: `مستند KYC لـ ${userData.fullName}`,
                text: `هذا هو مستند KYC لـ ${userData.fullName}.`,
                files: [pdfFile],
            });
        } else {
            alert('المتصفح لا يدعم المشاركة. سيتم تنزيل الملف بدلاً من ذلك.');
            handleDownload();
        }
    } catch (error) {
         if (error instanceof DOMException && error.name === 'AbortError') {
            console.log("Share action was cancelled by the user.");
        } else {
            console.error("Failed to share PDF:", error);
            alert("حدث خطأ أثناء مشاركة ملف PDF.");
        }
    }
  };

  const handleDownload = () => {
    if (!pdfFile) return;
    const url = URL.createObjectURL(pdfFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isGenerating) {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <LoadingIcon className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="mt-4 text-lg font-semibold text-gray-700">جاري إنشاء المستند...</p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in" dir="rtl">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">اكتمل التسجيل بنجاح!</h2>
            <p className="text-gray-500 mt-2">أصبح مستند KYC الخاص بك جاهزاً للمشاركة أو التنزيل.</p>
        </div>
        
        {/* Hidden container for PDF generation */}
        <div className="absolute -left-[9999px] top-0">
             <PdfDocument userData={userData} docImages={docImages} signature={signature} onBack={onBack}/>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="font-bold text-lg mb-2">ملخص البيانات</h3>
            <p className="text-sm text-gray-600">تم استخدام هذه البيانات لإنشاء مستند KYC الخاص بك.</p>
            <div className="mt-4 border-t pt-4">
                 <p><strong className="text-gray-500">الاسم:</strong> {userData.fullName}</p>
                 <p><strong className="text-gray-500">رقم الهوية:</strong> {userData.idNumber}</p>
                 <p><strong className="text-gray-500">رقم الواتساب:</strong> {userData.whatsappNumber}</p>
            </div>
        </div>

      <div className="flex flex-col sm:flex-row-reverse items-center gap-4 pt-8">
        <button onClick={handleShare} disabled={!pdfFile} className="w-full sm:flex-1 inline-flex items-center justify-center px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
            <span>مشاركة عبر واتساب</span>
        </button>
         <button onClick={handleDownload} disabled={!pdfFile} className="w-auto h-12 px-4 inline-flex items-center justify-center bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400">
            <DownloadIcon className="w-5 h-5"/>
        </button>
        <button type="button" onClick={onBack} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
          <ArrowRightIcon className="w-5 h-5 ml-2" />
          <span>رجوع</span>
        </button>
      </div>
    </div>
  );
};

export default Preview;