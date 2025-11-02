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
}
