import { GoogleGenAI, Type } from "@google/genai";
import { DocImages, DocumentType, UserData } from '../types.ts';

/**
 * Converts a base64 data URL into a format suitable for the Gemini API.
 * @param dataUrl The base64 data URL (e.g., "data:image/jpeg;base64,...").
 * @returns An object with inlineData for the Gemini API.
 */
function fileToGenerativePart(dataUrl: string) {
  const [header, base64Data] = dataUrl.split(',');
  const mimeType = header.split(':')[1].split(';')[0];
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

const schema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING, description: "الاسم الكامل للشخص كما هو مكتوب في المستند. يجب أن يكون دقيقاً." },
    idNumber: { type: Type.STRING, description: "رقم الهوية أو جواز السفر." },
    dateOfBirth: { type: Type.STRING, description: "تاريخ الميلاد بالتنسيق YYYY-MM-DD. إذا كان مكتوبًا هجريًا، قم بتحويله." },
    placeOfIssue: { type: Type.STRING, description: "مكان الإصدار كما هو مكتوب حرفيًا في المستند." },
    dateOfIssue: { type: Type.STRING, description: "تاريخ الإصدار بالتنسيق YYYY-MM-DD." },
    expiryDate: { type: Type.STRING, description: "تاريخ الانتهاء بالتنسيق YYYY-MM-DD." },
    gender: { type: Type.STRING, description: "الجنس (ذكر أو أنثى). إذا لم يكن مكتوبًا، استنتجه من الصورة أو الاسم." },
    nationality: { type: Type.STRING, description: "الجنسية. إذا لم تكن واضحة، افترض أنها 'يمني'." },
    birthGovernorate: { type: Type.STRING, description: "محافظة الميلاد. قم بتحليل مكان الميلاد واستخراج اسم المحافظة فقط من القائمة المتاحة." },
    birthDistrict: { type: Type.STRING, description: "مديرية الميلاد. قم بتحليل مكان الميلاد واستخراج اسم المديرية فقط." },
  },
  required: ["fullName", "idNumber", "dateOfBirth", "placeOfIssue", "dateOfIssue", "expiryDate"]
};

export const extractDataFromDocument = async (images: DocImages, docType: DocumentType): Promise<UserData> => {
  const ai = new GoogleGenAI({ apiKey: "AIzaSyC_7oXl2Yd_X3S7IrC--khRqpl-b_oueF8" });
  const model = "gemini-2.5-pro";
  
  const parts: any[] = [];
  let promptText = `
    أنت خبير في التحقق من الهويات اليمنية. مهمتك هي استخراج المعلومات بدقة متناهية من صور المستندات المقدمة.
    - تعامل مع اللغة العربية بعناية.
    - قم بتحويل أي تواريخ هجرية إلى ميلادية بتنسيق YYYY-MM-DD.
    - إذا كان الجنس غير مذكور، استنتجه من صورة الشخص أو اسمه.
    - إذا كانت الجنسية غير مذكورة، افترض أنها "يمني".
    - بالنسبة لمكان الميلاد، قم بتحليله لتحديد المحافظة والمديرية بدقة.
    - أعد البيانات بتنسيق JSON صارم بناءً على المخطط المحدد.
  `;

  if (docType === DocumentType.IDCard) {
    if (!images.front || !images.back) {
      throw new Error("Front and back images of ID card are required.");
    }
    parts.push({ text: "صورة الوجه الأمامي:" });
    parts.push(fileToGenerativePart(images.front));
    parts.push({ text: "صورة الوجه الخلفي:" });
    parts.push(fileToGenerativePart(images.back));
  } else if (docType === DocumentType.Passport) {
    if (!images.passport) {
      throw new Error("Passport image is required.");
    }
    parts.push(fileToGenerativePart(images.passport));
  } else {
    throw new Error("Unsupported document type.");
  }

  parts.unshift({ text: promptText });

  const response = await ai.models.generateContent({
    model,
    // fix: Corrected the structure of the `contents` parameter to be an object with a `parts` key.
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const text = response.text.trim();
  const jsonData = JSON.parse(text);

  return {
    fullName: jsonData.fullName || '',
    idNumber: jsonData.idNumber || '',
    dateOfBirth: jsonData.dateOfBirth || '',
    placeOfIssue: jsonData.placeOfIssue || '',
    dateOfIssue: jsonData.dateOfIssue || '',
    expiryDate: jsonData.expiryDate || '',
    gender: jsonData.gender === 'ذكر' || jsonData.gender === 'أنثى' ? jsonData.gender : '',
    nationality: jsonData.nationality || 'يمني',
    birthGovernorate: jsonData.birthGovernorate || '',
    birthDistrict: jsonData.birthDistrict || '',
    whatsappNumber: '',
    addressGovernorate: '',
    addressDistrict: '',
    addressStreet: '',
    accountPurpose: '',
    specificPurpose: '',
  };
};