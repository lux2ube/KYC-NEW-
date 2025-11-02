import React, { useRef, useState, useEffect } from 'react';
import { UserData, DocImages } from '../types.ts';
import { ArrowRightIcon, DownloadIcon } from './icons.tsx';
import { LoadingIcon } from './icons.tsx';

declare var jspdf: any;
declare var html2canvas: any;

interface PreviewProps {
  userData: UserData;
  docImages: DocImages;
  signature: string;
  onBack: () => void;
}

const PdfHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="mb-4">
        <div className="flex justify-between items-start pb-2 border-b-2 border-black">
            <div className="text-right">
                <h1 className="text-base font-extrabold">بنك القطيعي الإسلامي للتمويل الأصغر</h1>
                <p className="text-xs">Al Qutaibi Islamic Bank for MicroFinance</p>
                <p className="text-xs mt-2">Tel: 8009999</p>
            </div>
            <div className="flex flex-col items-center">
                 <div className="w-16 h-16 bg-gray-100 border border-black flex items-center justify-center p-1">
                    <span className="text-[8px] text-center font-bold">شعار البنك</span>
                </div>
                <p className="text-[10px] font-bold mt-1">بنك القطيعي</p>
            </div>
        </div>
        <div className="text-center mt-2 bg-gray-200 p-1">
            <h2 className="text-sm font-bold">{title}</h2>
        </div>
    </div>
);

const Field: React.FC<{ label: string; value?: string | null; fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => (
    <div className={`py-1 text-xs ${fullWidth ? 'col-span-2' : ''}`}>
        <div className="flex items-baseline justify-between">
            <span className="font-bold shrink-0">{label}:</span>
            <span className="w-full border-b border-black border-dotted mx-2"></span>
            <span className="text-left font-mono whitespace-nowrap">{value || ''}</span>
        </div>
    </div>
);

const FormSection: React.FC<{ title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="mt-4">
        <h3 className="text-sm font-bold bg-gray-100 p-1 border-y border-black">{title}</h3>
        <div className="grid grid-cols-2 gap-x-8 mt-2">{children}</div>
    </div>
);

const PdfFooter: React.FC<{ page: number; total: number }> = ({ page, total }) => (
     <footer className="text-center text-[8px] text-gray-500 pt-2 border-t border-gray-300 mt-auto">
        <p>مستند KYC - سري للغاية | Y Coin Cash & Al Qutaibi Bank</p>
        <p>صفحة {page} من {total}</p>
    </footer>
);

const termsAndConditionsText = {
    col1: [
        "1. يوافق صاحب الحساب ويشترط الموافقة على أية من اللوائح أو التعليمات المتعلقة بالتعاقد بغرض فتحه مع البنك، ولا يشارك هذا الحساب في أية أرباح ولا يتحمل أية خسائر.",
        "2. يتعهد صاحب الحساب بتقديم كافة البيانات والمعلومات الصحيحة والمستندات المؤيدة عند التعامل مع الحساب عبر جميع الخدمات الإلكترونية المقدمة من البنك وبما يتوافق مع سياسة البنك والقوانين والتعليمات السارية في الجمهورية اليمنية.",
        "3. يتعهد صاحب الحساب بتحديث بياناته ومعلوماته لدى البنك أولاً بأول، وفي حالة أي تغيير فيها فإنه لا يجوز له استخدام الحساب إلا بعد إخطار البنك وتحديث بياناته.",
        "4. هذا الحساب لدى البنك سري ولا يجوز لأي شخص التعامل عليه إطلاقاً إلا بموجب تفويض خطي من صاحب الحساب، وللبنك الحق في اتخاذ الإجراءات اللازمة للتحقق من صحة التفويض قبل السماح للمفوض له بالتعامل على الحساب.",
        "5. تعتبر سجلات البنك وقيوداته هي المرجع والمعتمد عليه في تحديد أرصدة حسابات العملاء لدى البنك.",
        "6. لا يتحمل البنك أي مسؤولية عن أي ضرر يلحق بصاحب الحساب نتيجة استخدامه الخاطئ أو عدم اتخاذه الاحتياطات اللازمة للحفاظ على سرية بياناته ومعلوماته أو نتيجة إفشائه لها أو لأي سبب آخر خارج عن إرادة البنك.",
        "7. يتم إخطار العميل من البنك إلى العميل عبر رسالة SMS بهوية الحساب عند فتح الحساب أو بحسب ما يراه البنك.",
        "8. للبنك الحق بإلغاء الحساب أو تجميده أو إلغاء الخدمات الإلكترونية المرتبطة بالحساب عندما يرد للبنك ذلك وفي أي وقت يراه مناسباً دون إبداء أي أسباب.",
        "9. يحق للبنك تعديل هذه الشروط والأحكام.",
        "10. في حال فقدان العميل بطاقته الشخصية فيجب عليه إبلاغ البنك بذلك ليتم وقف الحساب ويتم تزويده ببدل فاقد للحساب.",
        "11. يعتبر توقيع العميل على هذا الطلب تفويضاً مطلقاً للبنك في الاستعلام عن العميل من أي جهة يراها البنك مناسبة.",
    ],
    col2: [
        "12. على العميل الالتزام بكافة اللوائح والقرارات والتعليمات النافذة ذات العلاقة عند استخدامه للخدمات الإلكترونية التي يقدمها البنك، كما يقر العميل بأن كافة العمليات التي تتم عبر الخدمات الإلكترونية تكون على مسؤوليته الكاملة ويخلي طرف البنك من أي جهة أخرى عن جميع العمليات التي يجريها عبر الخدمات الإلكترونية.",
        "13. يتعهد العميل بتوفير كافة المتطلبات والمستندات المؤيدة لفتح الحساب، وتحديثها بشكل دوري حسبما تقتضيه سياسة البنك في هذا الشأن.",
        "14. عند القيام بعملية مالية مطلوبة في الخدمات الإلكترونية يجب التأكد من إدخال البيانات بشكل صحيح والتأكد من صحة العملية قبل تنفيذها.",
        "15. لإتمام عملية فتح الحساب لا بد من موافقة العميل على شروط وأحكام الخدمات الإلكترونية عن طريق إدخال رمز التحقق لمرة واحدة OTP المرسل إلى رقم جوال العميل (SMS)، ويعتبر إدخال الرمز بمثابة توقيع إلكتروني ملزم للعميل.",
        "16. يتم تفعيل الحساب بعد استيفاء كافة المتطلبات والمستندات المؤيدة والتوقيع على نموذج فتح الحساب لدى أقرب فرع أو وكيل للبنك.",
        "17. للبنك الحق في رفض أي عملية مالية تتم عبر الخدمات الإلكترونية إذا كانت مشبوهة أو مخالفة لسياسة البنك أو للوائح والقوانين النافذة، دون إبداء الأسباب للعميل.",
        "18. يلتزم العميل بالسرية التامة في كل ما يتعلق ببياناته وتعاملاته عبر الخدمات الإلكترونية، ولا يفصح عنها لأي طرف ثالث.",
        "19. يقر العميل بعلمه أن هذه الخدمة تخضع للرسوم والعمولات التي يحددها البنك، ويوافق على خصمها من حسابه.",
        "20. يقر العميل بموافقته على استقبال الرسائل النصية والإشعارات من البنك بخصوص حسابه والخدمات الإلكترونية.",
        "21. يقر العميل بأنه قد قرأ وفهم جميع الشروط والأحكام المذكورة أعلاه، ويوافق عليها موافقة تامة لا رجعة فيها.",
    ]
};

const PdfDocument: React.FC<PreviewProps> = ({ userData, docImages, signature }) => {
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
                        <Field label="المؤهل" value="" />
                        <Field label="المهنة" value="" />
                        <Field label="الحالة الاجتماعية" value="" />
                        <Field label="عدد من تعولهم" value="" />
                        <Field label="نوع الهوية" value="بطاقة شخصية" />
                        <Field label="رقمها" value={userData.idNumber} />
                        <Field label="تاريخ الإصدار" value={userData.dateOfIssue} />
                        <Field label="مكان الإصدار" value={userData.placeOfIssue} />
                        <Field label="تاريخ الانتهاء" value={userData.expiryDate} />
                    </FormSection>

                    <FormSection title="العنوان">
                        <Field label="العنوان الدائم" value={`${userData.addressGovernorate}, ${userData.addressDistrict}, ${userData.addressStreet}`} fullWidth />
                        <Field label="الجوال" value={userData.whatsappNumber} />
                        <Field label="البريد الإلكتروني" value="" />
                    </FormSection>
                    
                    <FormSection title="البيانات المالية">
                        <Field label="الوظيفة" value="" />
                        <Field label="جهة العمل" value="" />
                        <Field label="الغرض من فتح الحساب" value={userData.accountPurpose} />
                        <Field label="مصدر الدخل" value="" />
                        <Field label="إجمالي الدخل الشهري" value="" />
                    </FormSection>
                     <div className="mt-8 text-xs">
                        <p>أقر أنا الموقع أدناه بأن جميع البيانات أعلاه صحيحة وأتعهد بتحديث بياناتي عند طلب البنك ذلك أو قبل انتهاء سريانها بثلاثة أشهر أو فور حدوث أي تغييرات بها وأتحمل جميع المسؤوليات القانونية المترتبة على إقراري هذا.</p>
                        <div className="flex justify-between items-end mt-8">
                            <div>
                                <p className="font-bold">اسم العميل: {userData.fullName}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold">التوقيع:</p>
                                <img src={signature} alt="Signature" className="h-12 w-32 object-contain bg-white" />
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
                    <p className="text-xs mb-4">يقر العميل بأنه هو المستفيد الحقيقي والنهائي من الحساب والخدمات المرتبطة به.</p>
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
                        <Field label="العنوان الدائم" value={`${userData.birthGovernorate} - ${userData.birthDistrict}`} fullWidth />
                         <Field label="العنوان الحالي" value={`${userData.addressGovernorate}, ${userData.addressDistrict}, ${userData.addressStreet}`} fullWidth />
                         <Field label="الجوال" value={userData.whatsappNumber} />
                    </FormSection>
                    <div className="mt-8 text-xs">
                        <p>أقر أنا الموقع أدناه بأن جميع البيانات أعلاه صحيحة وأتعهد بتحديث بياناتي عند طلب البنك ذلك أو قبل انتهاء سريانها بثلاثة أشهر أو فور حدوث أي تغييرات بها وأتحمل جميع المسؤوليات القانونية المترتبة على إقراري هذا.</p>
                        <div className="flex justify-between items-end mt-8">
                            <div>
                                <p className="font-bold">اسم العميل: {userData.fullName}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold">التوقيع:</p>
                                <img src={signature} alt="Signature" className="h-12 w-32 object-contain bg-white" />
                            </div>
                        </div>
                    </div>
                </main>
                <PdfFooter page={2} total={4} />
            </div>
            
            {/* Page 3: Terms and Conditions */}
            <div id="pdf-page-3" className="p-10 w-[210mm] h-[297mm] bg-white flex flex-col text-black">
                 <PdfHeader title="طلب فتح حساب شخصي - الشروط والأحكام" />
                <main className="grow mt-4 text-[9px] text-justify space-y-2">
                    <h3 className="text-sm font-bold text-center mb-2">أحكام وشروط الخدمات الإلكترونية</h3>
                    <div className="grid grid-cols-2 gap-x-4">
                        <div>{termsAndConditionsText.col1.map((p, i) => <p key={`c1-${i}`} className="mb-1">{p}</p>)}</div>
                        <div>{termsAndConditionsText.col2.map((p, i) => <p key={`c2-${i}`} className="mb-1">{p}</p>)}</div>
                    </div>
                    <div className="pt-4">
                        <p className="font-bold">إقرار وموافقة:</p>
                        <p className="mt-1">أقر أنا الموقع أدناه، {userData.fullName}، حامل الهوية رقم {userData.idNumber}، بأنني قرأت وفهمت ووافقت على جميع الشروط والأحكام المذكورة أعلاه، وأفوض البنك بتنفيذ كافة العمليات والخدمات وفقًا لذلك. وهذا إقرار مني بذلك.</p>
                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <p className="font-bold">اسم العميل: {userData.fullName}</p>
                                <p className="font-bold mt-2">التاريخ: {today}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold">توقيع العميل:</p>
                                <img src={signature} alt="Signature" className="h-12 w-32 object-contain mt-1 bg-white" />
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
                     {docImages.front && (
                        <div>
                            <p className="text-center font-bold mb-2">الوجه الأمامي لبطاقة الهوية</p>
                            <img src={docImages.front} alt="ID Front" className="rounded-lg shadow-lg max-w-full h-auto max-h-80 border" />
                        </div>
                     )}
                     {docImages.back && (
                        <div>
                            <p className="text-center font-bold mb-2">الوجه الخلفي لبطاقة الهوية</p>
                            <img src={docImages.back} alt="ID Back" className="rounded-lg shadow-lg max-w-full h-auto max-h-80 border" />
                        </div>
                     )}
                    {docImages.passport && (
                        <div>
                            <p className="text-center font-bold mb-2">جواز السفر</p>
                            <img src={docImages.passport} alt="Passport" className="rounded-lg shadow-lg max-w-full h-auto max-h-[220mm] border" />
                        </div>
                    )}
                </main>
                <PdfFooter page={4} total={4} />
            </div>

        </div>
    );
};


const Preview: React.FC<PreviewProps> = ({ userData, docImages, signature, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
        try {
            const { jsPDF } = jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageIds = ['pdf-page-1', 'pdf-page-2', 'pdf-page-3', 'pdf-page-4'];

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
    
    // Use a short timeout to ensure the DOM is ready and images are rendered
    const timer = setTimeout(() => {
        generatePdf();
    }, 500);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); 

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

  return (
    <div className="animate-fade-in" dir="rtl">
        {/* Hidden container for PDF generation, rendered unconditionally */}
        <div className="absolute -left-[9999px] top-0">
             <PdfDocument userData={userData} docImages={docImages} signature={signature} onBack={onBack}/>
        </div>

        {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-64">
                <LoadingIcon className="w-12 h-12 text-orange-500 animate-spin" />
                <p className="mt-4 text-lg font-semibold text-gray-700">جاري إنشاء المستند...</p>
            </div>
        ) : (
            <>
                <div className="text-center mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">اكتمل التسجيل بنجاح!</h2>
                    <p className="text-gray-500 mt-2">أصبح مستند KYC الخاص بك جاهزاً للمشاركة أو التنزيل.</p>
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
            </>
        )}
    </div>
  );
};

export default Preview;