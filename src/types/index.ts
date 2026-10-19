export type TinType = 'SSN' | 'EIN';
export type W9Status = 'signed' | 'pending' | 'missing';
export type CopyType = 'Copy B' | 'Copy A' | 'Copy C';
export type Language = 'es' | 'en';
export type NavTab = 'dashboard' | 'contractors' | 'payments' | 'tax-center' | 'reportes' | 'settings' | 'soporte';

export interface Contractor {
  id: string;
  name: string;
  businessName?: string;
  tinType: TinType;
  tin: string; // "123-45-6789" or "12-3456789"
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  w9Status: W9Status;
  w9SignedDate?: string;
  tinMatched: boolean;
  directSales?: boolean;
  federalWithholding?: number;
  stateWithholding?: number;
  statePayerId?: string;
  stateIncome?: number;
  accountNumber?: string;
  secondTinNotice?: boolean;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  contractorId: string;
  contractorName: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: 'Check' | 'Zelle' | 'Direct Deposit' | 'Wire' | 'Card';
  reference?: string;
  memo?: string;
  category: string;
  year: number;
}

export interface CompanyProfile {
  legalName: string;
  tradeName?: string;
  ein: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  contactEmail: string;
  transmitterControlCode?: string;
  isConfigured: boolean;
}

export type ActiveFormTaxType = '1099-NEC' | 'W-2';

export interface Form1099Data {
  year: number;
  voidForm: boolean;
  correctedForm: boolean;
  payerName: string;
  payerAddress: string;
  payerCityStateZip: string;
  payerPhone: string;
  payerTin: string;
  recipientTin: string;
  recipientName: string;
  recipientAddress: string;
  recipientCityStateZip: string;
  accountNumber: string;
  secondTinNotice: boolean;
  box1Compensation: number;
  box2DirectSales: boolean;
  box3GoldenParachute?: number;
  box4FederalWithheld: number;
  box5StateWithheld: number;
  box6State: string;
  box6PayerStateNo: string;
  box7StateIncome: number;
}

export interface FormW2Data {
  year: number;
  voidForm: boolean;
  employerTin: string; // EIN Box b
  employerName: string; // Box c
  employerAddress: string;
  employerCityStateZip: string;
  controlNumber: string; // Box d
  employeeSsn: string; // Box a
  employeeFirstName: string; // Box e
  employeeLastName: string;
  employeeAddress: string; // Box f
  employeeCityStateZip: string;
  box1Wages: number; // Wages, tips, other compensation
  box2FederalWithheld: number; // Federal income tax withheld
  box3SocialSecurityWages: number; // Social security wages
  box4SocialSecurityWithheld: number; // Social security tax withheld (6.2%)
  box5MedicareWages: number; // Medicare wages and tips
  box6MedicareWithheld: number; // Medicare tax withheld (1.45%)
  box7SocialSecurityTips: number;
  box8AllocatedTips: number;
  box10DependentCare: number;
  box11NonqualifiedPlans: number;
  box12Code: string;
  box12Amount: number;
  box13Statutory: boolean;
  box13RetirementPlan: boolean;
  box13ThirdPartySickPay: boolean;
  box14Other: string;
  box15State: string;
  box15StateId: string;
  box16StateWages: number;
  box17StateWithheld: number;
  box18LocalWages: number;
  box19LocalWithheld: number;
  box20LocalityName: string;
}

