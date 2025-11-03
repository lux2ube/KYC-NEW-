import React, { useRef, useState, useEffect } from 'react';
import { UserData, DocImages } from '../types.ts';
import { ArrowRightIcon, DownloadIcon, ShareIcon, CheckIcon, RefreshIcon } from './icons.tsx';
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
    <div className={`py-2 border-b border-slate-100 ${fullWidth ? 'col-span-2' : ''}`}>
        <p className="text-[10px] font-semibold text-gray-500 mb-1">{label}</p>
        <p className="text-[12px] font-bold text-gray-800 font-mono">{value || 'N/A'}</p>
    </div>
);

const FormSection: React.FC<{ title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="mt-6">
        <h3 className="text-base font-bold text-gray-800 pb-2 mb-2 border-b-2 border-slate-200">{title}</h3>
        <div className="grid grid-cols-2 gap-x-8">{children}</div>
    </div>
);

const PdfFooter: React.FC<{ page: number; total: number }> = ({ page, total }) => (
     <footer className="text-center text-[9px] text-gray-400 py-3 border-t border-slate-200 mt-auto">
        <p>This document is confidential. &copy; {new Date().getFullYear()} Y Coin Cash | ycoincash.com.</p>
        <p>Page {page} of {total}</p>
    </footer>
);

const termsAndConditionsText = {
    col1: [
        "1. يوافق صاحب الحساب ويشترط الموافقة على أية من اللوائح أو التعليمات المتعلقة بالتعاقد بغرض فتحه مع الشركة، ولا يشارك هذا الحساب في أية أرباح ولا يتحمل أية خسائر.",
        "2. يتعهد صاحب الحساب بتقديم كافة البيانات والمعلومات الصحيحة والمستندات المؤيدة عند التعامل مع الحساب عبر جميع الخدمات الإلكترونية المقدمة من الشركة وبما يتوافق مع سياسة الشركة والقوانين والتعليمات السارية في الجمهورية اليمنية.",
        "3. يتعهد صاحب الحساب بتحديث بياناته ومعلوماته لدى الشركة أولاً بأول، وفي حالة أي تغيير فيها فإنه لا يجوز له استخدام الحساب إلا بعد إخطار الشركة وتحديث بياناته.",
        "4. هذا الحساب لدى الشركة سري ولا يجوز لأي شخص التعامل عليه إطلاقاً إلا بموجب تفويض خطي من صاحب الحساب، وللشركة الحق في اتخاذ الإجراءات اللازمة للتحقق من صحة التفويض قبل السماح للمفوض له بالتعامل على الحساب.",
        "5. تعتبر سجلات الشركة وقيوداته هي المرجع والمعتمد عليه في تحديد أرصدة حسابات العملاء لدى الشركة.",
        "6. لا تتحمل الشركة أي مسؤولية عن أي ضرر يلحق بصاحب الحساب نتيجة استخدامه الخاطئ أو عدم اتخاذه الاحتياطات اللازمة للحفاظ على سرية بياناته ومعلوماته أو نتيجة إفشائه لها أو لأي سبب آخر خارج عن إرادة الشركة.",
        "7. يتم إخطار العميل من الشركة إلى العميل عبر رسالة SMS بهوية الحساب عند فتح الحساب أو بحسب ما تراه الشركة.",
        "8. للشركة الحق بإلغاء الحساب أو تجميده أو إلغاء الخدمات الإلكترونية المرتبطة بالحساب عندما يرد للشركة ذلك وفي أي وقت تراه مناسباً دون إبداء أي أسباب.",
        "9. يحق للشركة تعديل هذه الشروط والأحكام.",
        "10. في حال فقدان العميل بطاقته الشخصية فيجب عليه إبلاغ الشركة بذلك ليتم وقف الحساب ويتم تزويده ببدل فاقد للحساب.",
        "11. يعتبر توقيع العميل على هذا الطلب تفويضاً مطلقاً للشركة في الاستعلام عن العميل من أي جهة تراها الشركة مناسبة.",
    ],
    col2: [
        "12. على العميل الالتزام بكافة اللوائح والقرارات والتعليمات النافذة ذات العلاقة عند استخدامه للخدمات الإلكترونية التي تقدمها الشركة، كما يقر العميل بأن كافة العمليات التي تتم عبر الخدمات الإلكترونية تكون على مسؤليته الكاملة ويخلي طرف الشركة من أي جهة أخرى عن جميع العمليات التي يجريها عبر الخدمات الإلكترونية.",
        "13. يتعهد العميل بتوفير كافة المتطلبات والمستندات المؤيدة لفتح الحساب، وتحديثها بشكل دوري حسبما تقتضيه سياسة الشركة في هذا الشأن.",
        "14. عند القيام بعملية مالية مطلوبة في الخدمات الإلكترونية يجب التأكد من إدخال البيانات بشكل صحيح والتأكد من صحة العملية قبل تنفيذها.",
        "15. لإتمام عملية فتح الحساب لا بد من موافقة العميل على شروط وأحكام الخدمات الإلكترونية عن طريق إدخال رمز التحقق لمرة واحدة OTP المرسل إلى رقم جوال العميل (SMS)، ويعتبر إدخال الرمز بمثابة توقيع إلكتروني ملزم للعميل.",
        "16. يتم تفعيل الحساب بعد استيفاء كافة المتطلبات والمستندات المؤيدة والتوقيع على نموذج فتح الحساب لدى أقرب فرع أو وكيل للشركة.",
        "17. للشركة الحق في رفض أي عملية مالية تتم عبر الخدمات الإلكترونية إذا كانت مشبوهة أو مخالفة لسياسة الشركة أو للوائح والقوانين النافذة، دون إبداء الأسباب للعميل.",
        "18. يلتزم العميل بالسرية التامة في كل ما يتعلق ببياناته وتعاملاته عبر الخدمات الإلكترونية، ولا يفصح عنها لأي طرف ثالث.",
        "19. يقر العميل بعلمه أن هذه الخدمة تخضع للرسوم والعمولات التي تحددها الشركة، ويوافق على خصمها من حسابه.",
        "20. يقر العميل بموافقته على استقبال الرسائل النصية والإشعارات من الشركة بخصوص حسابه والخدمات الإلكترونية.",
        "21. يقر العميل بأنه قد قرأ وفهم جميع الشروط والأحكام المذكورة أعلاه، ويوافق عليها موافقة تامة لا رجعة فيها.",
    ]
};

const PdfDocument: React.FC<Omit<PreviewProps, 'onStartOver'>> = ({ userData, docImages, signature, selfieImage }) => {
    const today = new Date().toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' });

    return (
        <div className="bg-white text-gray-900 font-[Tajawal,sans-serif]" dir="rtl">
            {/* Page 1: KYC Form */}
            <div id="pdf-page-1" className="p-10 w-[210mm] h-[297mm] bg-white flex flex-col text-black">
                <PdfHeader title="نموذج اعرف عميلك (KYC) لعميل شخصي" />
                <main className="grow text-xs">
                    <FormSection title="البيانات الشخصية للعميل">
                        <Field label="الاسم بالكامل بالعربي" value={userData.fullName} fullWidth />
                        <Field label="الاسم بالكامل بالانجليزي" value="" fullWidth/>
                        <Field label="الجنس" value={userData.gender} />
                        <Field label="الجنسية" value={userData.nationality} />
                        <Field label="تاريخ الميلاد" value={userData.dateOfBirth} />
                        <Field label="مكان الميلاد" value={`${userData.birthGovernorate} - ${userData.birthDistrict}`} />
                    </FormSection>

                    <FormSection title="بيانات إثبات الهوية">
                         <Field label="نوع الهوية" value="بطاقة شخصية" />
                        <Field label="رقمها" value={userData.idNumber} />
                        <Field label="تاريخ الإصدار" value={userData.dateOfIssue} />
                        <Field label="مكان الإصدار" value={userData.placeOfIssue} />
                        <Field label="تاريخ الانتهاء" value={userData.expiryDate} />
                    </FormSection>
                    
                     <FormSection title="بيانات التواصل والغرض من الحساب">
                        <Field label="العنوان الدائم" value={`${userData.addressGovernorate}, ${userData.addressDistrict}, ${userData.addressStreet}`} fullWidth />
                        <Field label="الجوال" value={userData.whatsappNumber} />
                        <Field label="البريد الإلكتروني" value="" />
                        <Field label="الغرض من فتح الحساب" value={userData.accountPurpose} fullWidth/>
                    </FormSection>

                    <FormSection title="البيانات المهنية والمالية">
                        <Field label="المهنة / الوظيفة" value={userData.occupation} />
                        <Field label="مصدر الدخل" value={userData.sourceOfFunds} />
                    </FormSection>

                     <div className="mt-8 text-xs bg-slate-50 p-4 rounded-lg">
                        <p className="font-bold">إقرار العميل:</p>
                        <p className="mt-2">أقر أنا الموقع أدناه بأن جميع البيانات أعلاه صحيحة وأتعهد بتحديثها فور حدوث أي تغييرات، وأتحمل جميع المسؤوليات القانونية المترتبة على إقراري هذا.</p>
                        <div className="flex justify-between items-end mt-6">
                            <div>
                                <p className="font-semibold text-gray-600">اسم العميل:</p>
                                <p className="font-bold text-base text-gray-800">{userData.fullName}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-600">التوقيع:</p>
                                <img src={signature} alt="Signature" className="h-14 w-36 object-contain bg-white border rounded-md p-1 mt-1" />
                            </div>
                        </div>
                    </div>
                </main>
                <PdfFooter page={1} total={4} />
            </div>

            {/* Page 2: Beneficiary Form */}
            <div id="pdf-page-2" className="p-10 w-[210mm] h-[297mm] bg-white flex flex-col text-black">
                <PdfHeader title="نموذج المستفيد الحقيقي" />
                 <main className="grow text-xs">
                    <p className="text-sm mb-4 bg-blue-50 text-blue-800 p-3 rounded-md">يقر العميل بأنه هو المستفيد الحقيقي والنهائي من الحساب والخدمات المرتبطة به.</p>
                    <FormSection title="البيانات الأساسية للمستفيد الحقيقي">
                        <Field label="الاسم الكامل" value={userData.fullName} fullWidth />
                        <Field label="الجنسية" value={userData.nationality} />
                        <Field label="الجنس" value={userData.gender} />
                        <Field label="نوع الهوية" value="بطاقة شخصية" />
                        <Field label="رقمها" value={userData.idNumber} />
                        <Field label="تاريخ الميلاد" value={userData.dateOfBirth} />
                         <Field label="تاريخ الانتهاء" value={userData.expiryDate} />
                    </FormSection>
                    <FormSection title="عنوان المستفيد الحقيقي">
                         <Field label="العنوان الدائم (مكان الميلاد)" value={`${userData.birthGovernorate} - ${userData.birthDistrict}`} fullWidth />
                         <Field label="العنوان الحالي" value={`${userData.addressGovernorate}, ${userData.addressDistrict}, ${userData.addressStreet}`} fullWidth />
                         <Field label="الجوال" value={userData.whatsappNumber} />
                    </FormSection>
                    <div className="mt-8 text-xs bg-slate-50 p-4 rounded-lg">
                        <p className="font-bold">إقرار العميل:</p>
                        <p className="mt-2">أقر أنا الموقع أدناه بصحة جميع البيانات المذكورة أعلاه وأوافق على شروط وأحكام الشركة المتعلقة بالمستفيد الحقيقي.</p>
                        <div className="flex justify-between items-end mt-6">
                            <div>
                                <p className="font-semibold text-gray-600">اسم العميل:</p>
                                <p className="font-bold text-base text-gray-800">{userData.fullName}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-600">التوقيع:</p>
                                <img src={signature} alt="Signature" className="h-14 w-36 object-contain bg-white border rounded-md p-1 mt-1" />
                            </div>
                        </div>
                    </div>
                </main>
                <PdfFooter page={2} total={4} />
            </div>
            
            {/* Page 3: Terms and Conditions */}
            <div id="pdf-page-3" className="p-10 w-[210mm] h-[297mm] bg-white flex flex-col text-black">
                 <PdfHeader title="طلب فتح حساب شخصي - الشروط والأحكام" />
                <main className="grow mt-4 text-[10px] text-justify space-y-2 leading-relaxed">
                    <h3 className="text-base font-bold text-center mb-4 text-gray-800">أحكام وشروط الخدمات الإلكترونية</h3>
                    <div className="grid grid-cols-2 gap-x-6">
                        <div className="space-y-2">{termsAndConditionsText.col1.map((p, i) => <p key={`c1-${i}`}>{p}</p>)}</div>
                        <div className="space-y-2">{termsAndConditionsText.col2.map((p, i) => <p key={`c2-${i}`}>{p}</p>)}</div>
                    </div>
                    <div className="pt-6 mt-4 border-t border-slate-200 bg-slate-50 p-4 rounded-lg">
                        <p className="font-bold text-base text-gray-800">إقرار وموافقة:</p>
                        <p className="mt-2">أقر أنا الموقع أدناه، {userData.fullName}، حامل الهوية رقم {userData.idNumber}، بأنني قرأت وفهمت ووافقت على جميع الشروط والأحكام المذكورة أعلاه، وأفوض الشركة بتنفيذ كافة العمليات والخدمات وفقًا لذلك. وهذا إقرار مني بذلك.</p>
                        <div className="mt-6 flex items-end justify-between">
                            <div>
                                <p className="font-semibold text-gray-600">اسم العميل: <span className="font-bold text-gray-800">{userData.fullName}</span></p>
                                <p className="font-semibold text-gray-600 mt-2">التاريخ: <span className="font-bold text-gray-800">{today}</span></p>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-600">توقيع العميل:</p>
                                <img src={signature} alt="Signature" className="h-14 w-36 object-contain mt-1 bg-white border rounded-md p-1" />
                            </div>
                        </div>
                    </div>
                </main>
                 <PdfFooter page={3} total={4} />
            </div>
            
            {/* Page 4: Attached Documents */}
            <div id="pdf-page-4" className="p-10 w-[210mm] h-[297mm] bg-white flex flex-col">
                <PdfHeader title="المستندات المرفقة" />
                <main className="grow mt-8 flex flex-col items-center justify-center space-y-8">
                     {selfieImage && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-center font-bold text-gray-700 mb-3">صورة التحقق الشخصية (سيلفي)</p>
                            <img src={selfieImage} alt="Selfie" className="rounded-lg shadow-md max-w-full h-auto max-h-64" />
                        </div>
                     )}
                     {docImages.front && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-center font-bold text-gray-700 mb-3">الوجه الأمامي لبطاقة الهوية</p>
                            <img src={docImages.front} alt="ID Front" className="rounded-lg shadow-md max-w-full h-auto max-h-64" />
                        </div>
                     )}
                     {docImages.back && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-center font-bold text-gray-700 mb-3">الوجه الخلفي لبطاقة الهوية</p>
                            <img src={docImages.back} alt="ID Back" className="rounded-lg shadow-md max-w-full h-auto max-h-64" />
                        </div>
                     )}
                    {docImages.passport && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-center font-bold text-gray-700 mb-3">جواز السفر</p>
                            <img src={docImages.passport} alt="Passport" className="rounded-lg shadow-md max-w-full h-auto max-h-[200mm]" />
                        </div>
                    )}
                </main>
                <PdfFooter page={4} total={4} />
            </div>

        </div>
    );
};


const Preview: React.FC<PreviewProps> = ({ userData, docImages, signature, selfieImage, onBack, onStartOver }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
        try {
            const { jsPDF } = jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageIds = ['pdf-page-1', 'pdf-page-2', 'pdf-page-3', 'pdf-page-4'];

            for (let i = 0; i < pageIds.length; i++) {
                const pageElement = document.getElementById(pageIds[i]);
                if (pageElement) {
                    const canvas = await html2canvas(pageElement, { scale: 3, useCORS: true, allowTaint: true });
                    const imgData = canvas.toDataURL('image/png');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    
                    if (i > 0) {
                        pdf.addPage();
                    }
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
                }
            }
            
            const pdfFileName = `KYC_${userData.fullName.replace(/\s/g, '_')}.pdf`;
            const pdfBlob = pdf.output('blob');
            const file = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
            setPdfFile(file);
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
        {/* Hidden container for PDF generation, rendered unconditionally */}
        <div className="absolute -left-[9999px] top-0">
             <PdfDocument userData={userData} docImages={docImages} signature={signature} selfieImage={selfieImage} onBack={onBack}/>
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
                    <button onClick={handleShare} disabled={!pdfFile} className="w-full sm:flex-1 inline-flex items-center justify-center px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                        <span>مشاركة المستند</span>
                        <ShareIcon className="w-5 h-5 mr-2" />
                    </button>
                    <button onClick={handleDownload} disabled={!pdfFile} className="w-auto h-12 px-4 inline-flex items-center justify-center bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400">
                        <DownloadIcon className="w-5 h-5"/>
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