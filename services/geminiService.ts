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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";
  
  const parts: any[] = [];
  const systemInstruction = `أنت خبير في التحقق من الهويات اليمنية. مهمتك هي استخراج المعلومات بدقة متناهية من صور المستندات المقدمة. تعامل مع اللغة العربية بعناية. قم بتحويل أي تواريخ هجرية إلى ميلادية بتنسيق YYYY-MM-DD. إذا كان الجنس غير مذكور، استنتجه من صورة الشخص أو اسمه. إذا كانت الجنسية غير مذكورة، افترض أنها "يمني". بالنسبة لمكان الميلاد، قم بتحليله لتحديد المحافظة والمديرية بدقة. أعد البيانات بتنسيق JSON صارم بناءً على المخطط المحدد.`;

  if (docType === DocumentType.IDCard) {
    if (!images.front || !images.back) {
      throw new Error("Front and back images of ID card are required.");
    }
    parts.push({ text: "الرجاء استخراج البيانات من صور بطاقة الهوية اليمنية التالية. الوجه الأمامي:" });
    parts.push(fileToGenerativePart(images.front));
    parts.push({ text: "الوجه الخلفي:" });
    parts.push(fileToGenerativePart(images.back));
  } else if (docType === DocumentType.Passport) {
    if (!images.passport) {
      throw new Error("Passport image is required.");
    }
    parts.push({ text: "الرجاء استخراج البيانات من صورة جواز السفر اليمني التالية:" });
    parts.push(fileToGenerativePart(images.passport));
  } else {
    throw new Error("Unsupported document type.");
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: parts }],
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const text = response.text.trim();
  
  let jsonData;
  try {
    jsonData = JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response:", text, e);
    throw new Error("فشل في فهم الرد من الذكاء الاصطناعي. قد تكون الوثيقة غير واضحة أو أن الخدمة تواجه ضغطاً. يرجى المحاولة مرة أخرى.");
  }

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