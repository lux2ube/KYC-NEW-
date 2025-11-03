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
    <div className="mt-1">
        <h3 className="text-base font-bold text-gray-800 pb-2 mb-2 border-b-2 border-slate-200">{title}</h3>
        <div className="grid grid-cols-2 gap-x-8">{children}</div>
    </div>
);

const fullTermsAndConditions = {
    definitions: {
        title: "ثالثًا: التعريفات",
        points: [
            "المنصة / نحن / الموقع: يُقصد بها منصة YCoinCash.com، وتشمل الموقع الرسمي www.ycoincash.com وجميع قنوات الاتصال التابعة لها.",
            "العميل / المستخدم / أنت: الشخص الطبيعي أو الاعتباري الذي يطلب فتح حساب أو يستخدم خدمات المنصة.",
            "الخدمات: جميع عمليات بيع وشراء وتحويل العملات الرقمية والخدمات المساندة لها.",
            "العملات الرقمية: الأصول الرقمية المعتمدة على تقنية البلوك تشين مثل (Bitcoin، Ethereum وغيرها)."
        ]
    },
    legalStatus: {
        title: "رابعًا: الوضع القانوني للمنصة",
        content: "تعمل منصة YCoinCash.com كمزود خدمات رقمية عبر الإنترنت في الجمهورية اليمنية، ولا تُمارس أي نشاط مصرفي أو تمويلي إلا بعد الحصول على التراخيص اللازمة من الجهات المختصة. ويُعد توقيعي على هذه الوثيقة إقرارًا مني بفهم هذا الوضع القانوني وموافقتي على التعامل وفقه."
    },
    mainAgreement: {
        title: "خامسًا: بنود الاتفاق الأساسية",
        points: [
            "أوافق على أن جميع معاملاتي تتم حصريًا عبر الموقع الرسمي www.ycoincash.com أو القنوات المعتمدة المذكورة فيه.",
            "أتحمل المسؤولية الكاملة في حال التعامل مع أي جهة تنتحل هوية المنصة أو تستخدم شعارها دون تصريح.",
            "أقرّ بأن جميع بياناتي صحيحة ومطابقة للوثائق المقدمة.",
            "أوافق على استخدام رقم واتساب الخاص بي كوسيلة تعامل مالي رسمية، وتُعدّ أي مراسلات أو طلبات صادرة منه ملزمة لي قانونيًا.",
            "أوافق على تقديم هويتي أو أي وثائق إضافية متى ما طلبت المنصة ذلك ضمن إجراءات (KYC) و(MAL).",
            "أقرّ بأنني المستفيد الفعلي من الحساب وليس نيابة عن أي طرف ثالث.",
            "أوافق على أنني أستخدم فقط عنوان المحفظة الشخصية الخاصة بي عند الإيداع أو السحب، وأتحمل المسؤولية عن أي خطأ في العنوان.",
            "أُدرك أن جميع المعاملات الرقمية غير قابلة للإلغاء أو الاسترجاع بعد إتمامها.",
            "أقرّ بمعرفتي الكاملة بمخاطر تقلبات العملات الرقمية، وأن المنصة لا تقدم أي نصائح استثمارية.",
            "أوافق على حق المنصة في تجميد أي مبالغ في حال الاشتباه بنشاط احتيالي أو مخالف للقانون، والتعاون مع الجهات الرسمية عند الحاجة.",
            "أوافق على أن خدمات المنصة تُقدّم “كما هي” دون ضمانات، وأن المنصة غير مسؤولة عن أي خسائر ناتجة عن أخطاء المستخدم أو السوق.",
            "أوافق على أن القوانين اليمنية هي الحاكمة، والمحاكم اليمنية هي المختصة بالنظر في أي نزاع ينشأ عن هذا الاتفاق."
        ]
    },
    userObligations: {
        title: "سادسًا: التزامات المستخدم",
        points: [
            "الحفاظ على سرية بيانات الحساب وأمن المحفظة الرقمية.",
            "عدم استخدام المنصة لأي أنشطة مخالفة للقانون اليمني أو لأنظمة مكافحة غسل الأموال وتمويل الإرهاب.",
            "الإبلاغ الفوري عن أي نشاط مشبوه أو اختراق."
        ]
    },
    amendments: {
        title: "سابعًا: التعديلات",
        content: "تحتفظ المنصة بحقها في تعديل الشروط والأحكام دون إشعار مسبق، وتُعتبر التعديلات سارية فور نشرها على الموقع الرسمي. استمرار العميل في استخدام الخدمات بعد ذلك يُعد موافقة ضمنية على التعديلات."
    },
    officialCommunication: {
        title: "ثامنًا: التواصل الرسمي",
        content: "لأي استفسار أو بلاغ رسمي، يتم التواصل عبر الموقع الرسمي فقط: www.ycoincash.com. ولا تُعتمد أي قنوات أخرى ما لم تُذكر صراحةً في الموقع."
    }
};


const PdfDocument: React.FC<Omit<PreviewProps, 'onStartOver' | 'onBack'>> = ({ userData, docImages, signature, selfieImage }) => {
    const today = new Date().toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' });

    return (
        <div className="bg-white text-gray-900 font-[Tajawal,sans-serif]" dir="rtl">
            {/* Page 1: Integrated KYC Form */}
            <div id="pdf-page-1" className="p-10 w-[210mm] bg-white flex flex-col text-black">
                <PdfHeader title="نموذج اعرف عميلك المتكامل (KYC)" />
                <main className="grow text-xs">
                    <div className="flex items-start gap-6">
                        <div className="w-[120px] flex-shrink-0 pt-4">
                            {selfieImage && (
                                <div>
                                    <img src={selfieImage} alt="Selfie" className="rounded-lg shadow-md w-full h-auto border-4 border-slate-100 p-1" />
                                    <p className="text-[9px] text-gray-500 mt-1 font-semibold text-center">صورة التحقق الشخصية</p>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <FormSection title="البيانات الشخصية وبيانات الهوية">
                                <Field label="الاسم الكامل" value={userData.fullName} fullWidth />
                                <Field label="رقم الهوية" value={userData.idNumber} />
                                <Field label="نوع الهوية" value={docImages.passport ? "جواز سفر" : "بطاقة شخصية"} />
                                <Field label="تاريخ الميلاد" value={userData.dateOfBirth} />
                                <Field label="مكان الميلاد" value={`${userData.birthGovernorate} - ${userData.birthDistrict}`} />
                                <Field label="الجنس" value={userData.gender} />
                                <Field label="الجنسية" value={userData.nationality} />
                                <Field label="مكان الإصدار" value={userData.placeOfIssue} />
                                <Field label="تاريخ الإصدار" value={userData.dateOfIssue} />
                                <Field label="تاريخ الانتهاء" value={userData.expiryDate} />
                            </FormSection>
                        </div>
                    </div>

                    <div className="mt-1">
                        <FormSection title="بيانات التواصل والعمل">
                            <Field label="العنوان الدائم" value={`${userData.addressGovernorate}, ${userData.addressDistrict}, ${userData.addressStreet}`} />
                            <Field label="رقم الجوال (واتساب)" value={userData.whatsappNumber} />
                            <Field label="المهنة / الوظيفة" value={userData.occupation} />
                            <Field label="مصدر الدخل" value={userData.sourceOfFunds} />
                            <Field label="الغرض من فتح الحساب" value={userData.accountPurpose} fullWidth/>
                        </FormSection>
                    </div>

                    <div className="mt-4 pt-4 border-t-2 border-slate-200 text-xs bg-slate-50 p-4 rounded-lg">
                        <p className="font-bold text-sm">إقرار العميل:</p>
                        <p className="mt-2 leading-relaxed">أقر أنا الموقع أدناه، <strong>{userData.fullName}</strong>، بأن جميع البيانات والمعلومات المقدمة في هذا النموذج صحيحة وكاملة ومحدثة، وأتعهد بإبلاغكم فور حدوث أي تغييرات عليها. وأتحمل المسؤولية القانونية الكاملة المترتبة على صحة هذه البيانات.</p>
                        <div className="flex justify-between items-end mt-4">
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
                                <img src={signature} alt="Signature" className="h-12 w-32 object-contain bg-white border rounded-md p-1 mt-1" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Page 2: Beneficial Owner Declaration */}
            <div id="pdf-page-beneficial" className="p-10 w-[210mm] bg-white flex flex-col text-black">
                <PdfHeader title="إقرار المستفيد الحقيقي" />
                <main className="grow mt-4 flex flex-col justify-between">
                    <div className="text-sm leading-loose bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <p className="mb-6">أقر أنا الموقع أدناه، <strong>{userData.fullName}</strong>، بصفتي الشخصية، بأنني المستفيد الحقيقي والنهائي من الحساب الذي سيتم فتحه لدى Y Coin Cash، وأنني أتصرف لحسابي الخاص وليس بصفتي وكيلاً أو ممثلاً أو بالنيابة عن أي شخص أو جهة أخرى.</p>
                        <p>كما أتعهد بإبلاغ Y Coin Cash كتابيًا وفورًا في حال تغيرت هذه الصفة في المستقبل، وأتحمل كامل المسؤولية القانونية المترتبة على صحة هذا الإقرار.</p>
                    </div>
                    <div className="mt-12 pt-6 border-t-2 border-slate-200">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="font-semibold text-gray-600">اسم العميل:</p>
                                <p className="font-bold text-lg text-gray-800">{userData.fullName}</p>
                                <p className="font-semibold text-gray-600 mt-4">التاريخ:</p>
                                <p className="font-bold text-lg text-gray-800">{today}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-600">توقيع العميل:</p>
                                <img src={signature} alt="Signature" className="h-20 w-48 object-contain mt-1 bg-white border rounded-md p-1" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Page 3: Terms and Conditions */}
            <div id="pdf-page-terms" className="p-10 w-[210mm] bg-white flex flex-col text-black">
                <PdfHeader title="نموذج اتفاقية فتح حساب" />
                <main className="grow mt-4 text-[9px] text-justify space-y-2 leading-relaxed">
                    <h3 className="text-sm text-center font-bold mb-4 text-gray-700">
                        اتفاقية فتح حساب لدى منصة كوين كاش (YCoinCash.com) - تاريخ النفاذ: 20 / 11 / 2022م
                    </h3>

                    <div className="grid grid-cols-2 gap-x-6">
                        {/* Left Column */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-bold text-xs mb-1 border-b border-slate-200 pb-1">{fullTermsAndConditions.definitions.title}</h4>
                                <ol className="list-decimal list-inside space-y-1 pr-2">
                                    {fullTermsAndConditions.definitions.points.map((p, i) => <li key={i}>{p}</li>)}
                                </ol>
                            </div>
                            <div>
                                <h4 className="font-bold text-xs mb-1 border-b border-slate-200 pb-1">{fullTermsAndConditions.legalStatus.title}</h4>
                                <p>{fullTermsAndConditions.legalStatus.content}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-xs mb-1 border-b border-slate-200 pb-1">{fullTermsAndConditions.userObligations.title}</h4>
                                <ul className="list-disc list-inside space-y-1 pr-2">
                                    {fullTermsAndConditions.userObligations.points.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-xs mb-1 border-b border-slate-200 pb-1">{fullTermsAndConditions.amendments.title}</h4>
                                <p>{fullTermsAndConditions.amendments.content}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-xs mb-1 border-b border-slate-200 pb-1">{fullTermsAndConditions.officialCommunication.title}</h4>
                                <p>{fullTermsAndConditions.officialCommunication.content}</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-bold text-xs mb-1 border-b border-slate-200 pb-1">{fullTermsAndConditions.mainAgreement.title}</h4>
                                <ol className="list-decimal list-inside space-y-1 pr-2">
                                    {fullTermsAndConditions.mainAgreement.points.map((p, i) => <li key={i}>{p}</li>)}
                                </ol>
                            </div>
                        </div>
                    </div>
                    
                    {/* Signature Block */}
                    <div className="pt-4 mt-4 border-t-2 border-slate-300">
                        <h4 className="font-bold text-base text-center mb-2">تاسعًا: توقيع العميل</h4>
                        <p className="text-center text-xs">أقرّ بموافقتي الكاملة على جميع البنود الواردة أعلاه، وأن توقيعي أدناه يُعدّ موافقة رسمية وملزمة قانونيًا.</p>
                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <p className="font-semibold text-gray-600">الاسم:</p>
                                <p className="font-bold text-base text-gray-800">{userData.fullName}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">التاريخ:</p>
                                <p className="font-bold text-base text-gray-800">{today}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-600">التوقيع:</p>
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
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
        setIsGenerating(true);
        setActionError(null);
        try {
            const { jsPDF } = jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pageIds = ['pdf-page-1', 'pdf-page-beneficial', 'pdf-page-terms'];
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
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            setActionError("حدث خطأ أثناء إنشاء ملف PDF.");
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
    if (!pdfFile) {
        setActionError("الملف غير جاهز بعد، يرجى الانتظار قليلاً.");
        return;
    }
    setActionError(null);

    const shareData = {
        title: `مستند KYC لـ ${userData.fullName}`,
        text: `هذا هو مستند KYC لـ ${userData.fullName}.`,
        files: [pdfFile],
    };
    
    if (navigator.share && navigator.canShare?.(shareData)) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.log("Share action was cancelled by the user.");
            } else {
                console.error("Failed to share PDF:", error);
                setActionError("فشلت المشاركة. يرجى محاولة تنزيل الملف بدلاً من ذلك.");
            }
        }
    } else {
        setActionError("المشاركة المباشرة غير مدعومة على هذا المتصفح. يرجى تنزيل الملف ومشاركته يدوياً.");
    }
  };

  const handleDownload = () => {
    if (!pdfFile) {
        setActionError("الملف غير جاهز بعد، يرجى الانتظار قليلاً.");
        return;
    }
    setActionError(null);
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

                {actionError && (
                    <div className="mt-6 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-center text-sm" role="alert">
                        {actionError}
                    </div>
                )}
                
                <div className="mt-6 flex flex-col sm:flex-row-reverse items-center gap-4">
                    <button onClick={handleShare} disabled={!pdfFile} className="w-full sm:flex-1 inline-flex items-center justify-center px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                        <span>مشاركة عبر واتساب</span>
                        <WhatsAppIcon className="w-6 h-6 mr-2" />
                    </button>
                    <button onClick={handleDownload} disabled={!pdfFile} className="w-full sm:flex-1 inline-flex items-center justify-center px-8 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400">
                        <span>تنزيل PDF</span>
                        <DownloadIcon className="w-5 h-5 mr-2" />
                    </button>
                </div>
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