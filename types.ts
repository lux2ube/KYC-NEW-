export enum DocumentType {
  IDCard = 'IDCard',
  Passport = 'Passport',
}

export interface DocImages {
  front: string | null;
  back: string | null;
  passport: string | null;
}

export interface UserData {
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  placeOfIssue: string;
  dateOfIssue: string;
  expiryDate: string;
  gender: string;
  nationality: string;
  birthGovernorate: string;
  birthDistrict: string;
  whatsappNumber: string;
  addressGovernorate: string;
  addressDistrict: string;
  addressStreet: string;
  accountPurpose: string;
  specificPurpose: string;
  occupation: string;
  sourceOfFunds: string;
}

// FIX: Define a named global interface for the aistudio object to resolve type conflicts with other global declarations.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  
  interface Window {
    aistudio?: AIStudio;
  }
}