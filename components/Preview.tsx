import React, { useState, useEffect } from 'react';
import { UserData, DocImages } from '../types.ts';
import { ArrowRightIcon, DownloadIcon, WhatsAppIcon, CheckIcon, RefreshIcon } from './icons.tsx';
import { LoadingIcon } from './icons.tsx';

declare var jspdf: any;
declare var html2canvas: any;

interface PreviewProps {
  userData: UserData;
  docImages: DocImages;
  signature: string;
  selfieImage: string | null;
  onBack: () => void;
  onStartOver: () => void;
}

const YCoinCashLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />
        <path d="M35 30 L50 55 L65 30" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 55 L50 75" stroke="white" strokeWidth="10" strokeLinecap="round" />
    </svg>
);


const PdfHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="mb-6">
        <div className="flex justify-between items-center pb-4 border-b-2 border-orange-500">
            <div className="flex items-center gap-4">
                 <YCoinCashLogo className="w-16 h-16" />
                <div>
                    <h1 className="text-xl font-extrabold text-gray-800">كوين كاش</h1>
                    <p className="text-xs text-gray-500">Y Coin Cash</p>
                </div>
            </div>
            <div className="text-left">
                <p className="text-sm font-bold">نموذج KYC</p>
                <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString('en-CA')}</p>
            </div>
        </div>
        <div className="text-center mt-4 bg-slate-100 p-2 rounded-md">
            <h2 className="text-lg font-bold text-orange-600">{title}</h2>
        </div>
    </div>
);


const Field: React.FC<{ label: string; value?: string | null; fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => (
    <div className={`py-1.5 border-b border-slate-100 ${fullWidth ? 'col-span-2' : ''}`}>
        <p className="text-[10px] font-semibold text-gray-500 mb-1">{label}</p>
        <p className="text-[12px] font-bold text-gray-800 font-mono">{value || 'N/A'}</p>
    </div>
);

const FormSection: React.FC<{ title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="mt-4">
        <h3 className="text-base font-bold text-gray-800 pb-2 mb-2 border-b-2 border-slate-200">{title}</h3>
        <div className="grid grid-cols-2 gap-x-8">{children}</div>
    </div>
);

const summarizedTerms = [
    {
        title: "1. التحقق من الهوية (KYC)",
        text: "بتقديمك للمستندات، فإنك توافق على جمعها وحفظها لأغراض التحقق من الهوية (KYC) والامتثال للقوانين المعمول بها لمكافحة غسل الأموال."
    },
    {
        title: "2. مسؤولية المستخدم",
        text: "أنت تقر بأنك المستفيد الفعلي من الخدمة، وأن لديك الخبرة الكافية في مجال العملات الرقمية وتدرك المخاطر المرتبطة بها. أنت مسؤول عن حماية حساباتك وعناوين المحافظ الرقمية الخاصة بك."
    },
    {
        title: "3. تحذير من الاحتيال",
        text: "نحذر بشدة من تحويل أي أموال إلى جهات تروج لأرباح غير واقعية أو أنشطة احتيالية. أي تحويل خارج منصتنا الرسمية يتم على مسؤوليتك الخاصة."
    },
    {
        title: "4. عدم إمكانية استرجاع المبالغ",
        text: "نظراً لطبيعة تقنية البلوك تشين، لا يمكن عكس المعاملات أو استرجاع أي مبالغ بعد إتمام التحويل. تقع على عاتقك مسؤولية التأكد من صحة البيانات المقدمة."
    },
    {
        title: "5. حق تجميد الأموال المشبوهة",
        text: "نحتفظ بالحق في تجميد أي مبالغ إذا اشتبهنا في وجود نشاط غير قانوني أو مخالف لشروطنا، وقد نقوم بإحالة الأمر للجهات القانونية المختصة."
    },
    {
        title: "6. القانون الحاكم",
        text: "تخضع جميع التعاملات وتفسر وفقاً للقوانين النافذة في الجمهورية اليمنية، وأي نزاع يكون من اختصاص المحاكم اليمنية."
    }
];

const PdfDocument: React.FC<Omit<PreviewProps, 'onStartOver' | 'onBack'>> = ({ userData, docImages, signature, selfieImage }) => {
    const today = new Date().toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' });

    return (
        <div className="bg-white text-gray-900 font-[Tajawal,sans-serif]" dir="rtl">
            {/* Page 1: Integrated KYC Form */}
            <div id="pdf-page-1" className="p-10 w-[210mm] bg-white flex flex-col text-black">
                <PdfHeader title="نموذج اعرف عميلك المتكامل (KYC)" />
                <main className="grow text-xs">
                    <FormSection title="البيانات الشخصية وبيانات الهوية">
                        <Field label="الاسم الكامل" value={userData.fullName} fullWidth />
                        <Field label="الجنس" value={userData.gender} />
                        <Field label="الجنسية" value={userData.nationality} />
                        <Field label="تاريخ الميلاد" value={userData.dateOfBirth} />
                        <Field label="مكان الميلاد" value={`${userData.birthGovernorate} - ${userData.birthDistrict}`} />
                        <Field label="نوع الهوية" value={docImages.passport ? "جواز سفر" : "بطاقة شخصية"} />
                        <Field label="رقم الهوية" value={userData.idNumber} />
                        <Field label="مكان الإصدار" value={userData.placeOfIssue} />
                        <Field label="تاريخ الإصدار" value={userData.dateOfIssue} />
                        <Field label="تاريخ الانتهاء" value={userData.expiryDate} />
                    </FormSection>

                    <FormSection title="بيانات التواصل والسكن">
                        <Field label="العنوان الدائم" value={`${userData.addressGovernorate}, ${userData.addressDistrict}, ${userData.addressStreet}`} fullWidth />
                        <Field label="رقم الجوال (واتساب)" value={userData.whatsappNumber} />
                        <Field label="البريد الإلكتروني" value="" />
                    </FormSection>

                    <FormSection title="البيانات المهنية والمالية">
                        <Field label="المهنة / الوظيفة" value={userData.occupation} />
                        <Field label="مصدر الدخل" value={userData.sourceOfFunds} />
                        <Field label="الغرض من فتح الحساب" value={userData.accountPurpose} fullWidth/>
                    </FormSection>
                    
                    <div className="mt-6 pt-4 border-t-2 border-slate-200 text-xs bg-slate-50 p-4 rounded-lg">
                        <p className="font-bold text-sm">إقرار العميل:</p>
                        <p className="mt-2 leading-relaxed">أقر أنا الموقع أدناه، <strong>{userData.fullName}</strong>، بأن جميع البيانات والمعلومات المقدمة في هذا النموذج صحيحة وكاملة ومحدثة، وأتعهد بإبلاغكم فور حدوث أي تغييرات عليها. كما أقر بأنني المستفيد الحقيقي والنهائي من الحساب. وأتحمل المسؤولية القانونية الكاملة المترتبة على صحة هذه البيانات.</p>
                        <div className="flex justify-between items-end mt-6">
                            <div>
                                <p className="font-semibold text-gray-600">اسم العميل:</p>
                                <p className="font-bold text-base text-gray-800">{userData.fullName}</p>
                            </div>
                             <div>
                                <p className="font-semibold text-gray-600">التاريخ:</p>
                                <p className="font-bold text-base text-gray-800">{today}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-600">التوقيع:</p>
                                <img src={signature} alt="Signature" className="h-16 w-40 object-contain bg-white border rounded-md p-1 mt-1" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Page 2: Terms and Conditions Summary */}
            <div id="pdf-page-2" className="p-10 w-[210mm] bg-white flex flex-col text-black">
                <PdfHeader title="ملخص الشروط والأحكام وإقرار الموافقة" />
                <main className="grow mt-4 text-[10px] text-justify space-y-2 leading-normal">
                    <p className="text-sm text-center font-bold mb-4">بموجب التوقيع على هذا المستند، فإنك توافق على الشروط والأحكام الكاملة لـ Y Coin Cash. النقاط التالية هي ملخص لأهم البنود:</p>
                    <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        {summarizedTerms.map((term, index) => (
                            <div key={index}>
                                <h4 className="font-bold text-xs">{term.title}</h4>
                                <p className="text-[9px]">{term.text}</p>
                            </div>
                        ))}
                    </div>
                     <div className="pt-6 mt-6 border-t border-slate-200 bg-orange-50 p-4 rounded-lg text-orange-900">
                        <p className="font-bold text-base">إقرار الموافقة على الشروط والأحكام:</p>
                        <p className="mt-2">أقر أنا الموقع أدناه، <strong>{userData.fullName}</strong>، حامل الهوية رقم <strong>{userData.idNumber}</strong>، بأنني قرأت وفهمت ووافقت على جميع الشروط والأحكام الكاملة للخدمة، والتي يعتبر هذا الملخص جزءاً منها، وأفوض الشركة بتنفيذ كافة العمليات والخدمات وفقاً لذلك. وهذا إقرار نهائي مني لا رجعة فيه.</p>
                        <div className="mt-6 flex items-end justify-between">
                            <div>
                                <p className="font-semibold">اسم العميل: <span className="font-bold">{userData.fullName}</span></p>
                                <p className="font-semibold mt-2">التاريخ: <span className="font-bold">{today}</span></p>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">توقيع العميل:</p>
                                <img src={signature} alt="Signature" className="h-16 w-40 object-contain mt-1 bg-white border rounded-md p-1" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Subsequent Pages for Documents */}
            {selfieImage && (
                <div id="pdf-page-selfie" className="p-10 w-[210mm] bg-white flex flex-col text-black">
                    <PdfHeader title="المرفقات - صورة التحقق الشخصية (سيلفي)" />
                    <main className="grow mt-8 flex flex-col items-center justify-center">
                        <img src={selfieImage} alt="Selfie" className="rounded-lg shadow-md max-w-full h-auto max-h-[220mm] border-4 border-slate-100 p-2" />
                    </main>
                </div>
            )}
            {docImages.front && (
                <div id="pdf-page-id-front" className="p-10 w-[210mm] bg-white flex flex-col text-black">
                    <PdfHeader title="المرفقات - الوجه الأمامي لبطاقة الهوية" />
                    <main className="grow mt-8 flex flex-col items-center justify-center">
                        <img src={docImages.front} alt="ID Front" className="rounded-lg shadow-md max-w-full h-auto max-h-[220mm] border-4 border-slate-100 p-2" />
                    </main>
                </div>
            )}
            {docImages.back && (
                <div id="pdf-page-id-back" className="p-10 w-[210mm] bg-white flex flex-col text-black">
                    <PdfHeader title="المرفقات - الوجه الخلفي لبطاقة الهوية" />
                    <main className="grow mt-8 flex flex-col items-center justify-center">
                        <img src={docImages.back} alt="ID Back" className="rounded-lg shadow-md max-w-full h-auto max-h-[220mm] border-4 border-slate-100 p-2" />
                    </main>
                </div>
            )}
            {docImages.passport && (
                <div id="pdf-page-passport" className="p-10 w-[210mm] bg-white flex flex-col text-black">
                    <PdfHeader title="المرفقات - جواز السفر" />
                    <main className="grow mt-8 flex flex-col items-center justify-center">
                        <img src={docImages.passport} alt="Passport" className="rounded-lg shadow-md max-w-full h-auto max-h-[220mm] border-4 border-slate-100 p-2" />
                    </main>
                </div>
            )}
        </div>
    );
};


const Preview: React.FC<PreviewProps> = ({ userData, docImages, signature, selfieImage, onBack, onStartOver }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    const generatePdf = async () => {
        setIsGenerating(true);
        try {
            const { jsPDF } = jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pageIds = ['pdf-page-1', 'pdf-page-2'];
            if (selfieImage) pageIds.push('pdf-page-selfie');
            if (docImages.front) pageIds.push('pdf-page-id-front');
            if (docImages.back) pageIds.push('pdf-page-id-back');
            if (docImages.passport) pageIds.push('pdf-page-passport');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            for (let i = 0; i < pageIds.length; i++) {
                const pageId = pageIds[i];
                const pageElement = document.getElementById(pageId);
                if (!pageElement) continue;

                if (i > 0) {
                    pdf.addPage();
                }

                const canvas = await html2canvas(pageElement, {
                    scale: 3,
                    useCORS: true,
                    allowTaint: true,
                    windowWidth: pageElement.scrollWidth,
                    windowHeight: pageElement.scrollHeight,
                });
                
                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight, undefined, 'FAST');
            }
            
            const totalPages = pdf.internal.getNumberOfPages();
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(128, 128, 128);

            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                
                const footerText1 = `This document is confidential. © ${new Date().getFullYear()} Y Coin Cash | ycoincash.com.`;
                const footerText2 = `Page ${i} of ${totalPages}`;
                
                const text1Width = pdf.getStringUnitWidth(footerText1) * pdf.getFontSize() / pdf.internal.scaleFactor;
                pdf.text(footerText1, (pdfWidth - text1Width) / 2, pdfHeight - 10, { lang: 'en' });

                const text2Width = pdf.getStringUnitWidth(footerText2) * pdf.getFontSize() / pdf.internal.scaleFactor;
                pdf.text(footerText2, (pdfWidth - text2Width) / 2, pdfHeight - 5, { lang: 'en' });
            }

            const pdfFileName = `KYC_${userData.fullName.replace(/\s/g, '_')}.pdf`;
            const pdfBlob = pdf.output('blob');
            const file = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
            setPdfFile(file);

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                setCanShare(true);
            } else {
                setCanShare(false);
            }
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            setShareError("حدث خطأ أثناء إنشاء ملف PDF.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const timer = setTimeout(() => {
        generatePdf();
    }, 500);

    return () => clearTimeout(timer);
  }, [userData, docImages, signature, selfieImage]); 

  const handleShare = async () => {
    if (!pdfFile) return;
    setShareError(null);

    try {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
             await navigator.share({
                title: `مستند KYC لـ ${userData.fullName}`,
                text: `هذا هو مستند KYC لـ ${userData.fullName}.`,
                files: [pdfFile],
            });
        } else {
            setShareError('المشاركة غير مدعومة على هذا المتصفح. سيتم تنزيل الملف.');
            handleDownload();
        }
    } catch (error) {
         if (error instanceof DOMException && error.name === 'AbortError') {
            console.log("Share action was cancelled by the user.");
        } else {
            console.error("Failed to share PDF:", error);
            setShareError("فشلت المشاركة. سيتم تنزيل الملف بدلاً من ذلك.");
            handleDownload();
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

  return (
    <div className="animate-fade-in" dir="rtl">
        <div className="absolute -left-[9999px] top-0">
             <PdfDocument userData={userData} docImages={docImages} signature={signature} selfieImage={selfieImage}/>
        </div>

        {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-64">
                <LoadingIcon className="w-12 h-12 text-orange-500 animate-spin" />
                <p className="mt-4 text-lg font-semibold text-gray-700">جاري إنشاء المستند...</p>
                <p className="text-sm text-gray-500">قد يستغرق هذا بضع ثوانٍ.</p>
            </div>
        ) : (
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">اكتمل التسجيل بنجاح!</h2>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">تم إنشاء مستند "اعرف عميلك" الخاص بك بنجاح وهو الآن جاهز للمشاركة أو التنزيل.</p>
                
                <div className="mt-8 bg-slate-50 p-4 sm:p-6 rounded-lg border text-right">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">ملخص بيانات العميل</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                       <p><strong className="font-semibold text-gray-500">الاسم:</strong> {userData.fullName}</p>
                       <p><strong className="font-semibold text-gray-500">رقم الهوية:</strong> {userData.idNumber}</p>
                       <p><strong className="font-semibold text-gray-500">تاريخ الميلاد:</strong> {userData.dateOfBirth}</p>
                       <p><strong className="font-semibold text-gray-500">رقم الواتساب:</strong> {userData.whatsappNumber}</p>
                    </div>
                </div>

                {shareError && (
                    <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-center text-sm" role="alert">
                        {shareError}
                    </div>
                )}
                
                <div className="mt-8 flex flex-col sm:flex-row-reverse items-center gap-4">
                    {canShare ? (
                        <button onClick={handleShare} disabled={!pdfFile} className="w-full sm:flex-1 inline-flex items-center justify-center px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                            <span>مشاركة عبر واتساب</span>
                            <WhatsAppIcon className="w-6 h-6 mr-2" />
                        </button>
                    ) : null}
                    <button onClick={handleDownload} disabled={!pdfFile} className={`w-full sm:flex-1 inline-flex items-center justify-center px-8 py-3 text-white font-bold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 ${canShare ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'}`}>
                        <span>تنزيل PDF</span>
                        <DownloadIcon className="w-5 h-5 mr-2" />
                    </button>
                </div>
                {!canShare && !isGenerating && pdfFile && (
                    <p className="mt-4 text-xs text-center text-gray-500 bg-gray-100 p-2 rounded-lg">
                        <strong>نصيحة:</strong> للمشاركة على واتساب، قم بتنزيل الملف أولاً ثم أرفقه يدوياً في المحادثة.
                    </p>
                )}
                 <div className="mt-4 flex flex-col sm:flex-row-reverse items-center gap-4">
                    <button type="button" onClick={onStartOver} className="w-full sm:flex-1 inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
                        <RefreshIcon className="w-5 h-5 ml-2" />
                        <span>البدء من جديد</span>
                    </button>
                    <button type="button" onClick={onBack} className="w-full sm:flex-1 inline-flex items-center justify-center px-8 py-3 bg-transparent text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                        <span>رجوع</span>
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Preview;