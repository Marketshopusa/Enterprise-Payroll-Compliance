import { CompanyProfile, Contractor, PaymentRecord } from '../types';

export const DEFAULT_COMPANY: CompanyProfile = {
  legalName: 'Mi Empresa (Sin configurar)',
  tradeName: '',
  ein: '00-0000000',
  address: 'Dirección Comercial (Calle y Número)',
  city: 'Ciudad',
  state: 'CA',
  zip: '00000',
  phone: '(000) 000-0000',
  contactEmail: 'admin@miempresa.com',
  transmitterControlCode: '',
  isConfigured: false,
};

export const SAMPLE_COMPANY: CompanyProfile = {
  legalName: 'FiscalPay Enterprise Services LLC',
  tradeName: 'FiscalPay Tech',
  ein: '84-2938102',
  address: '100 Montgomery St, Suite 1400',
  city: 'San Francisco',
  state: 'CA',
  zip: '94104',
  phone: '(415) 890-2100',
  contactEmail: 'compliance@fiscalpay.io',
  transmitterControlCode: 'FP109',
  isConfigured: true,
};

export const SAMPLE_CONTRACTORS: Contractor[] = [
  {
    id: 'cont-1',
    name: 'Elena Rostova',
    businessName: 'Rostova Design Studio LLC',
    tinType: 'SSN',
    tin: '394-82-1940',
    address: '742 Evergreen Terrace, Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94110',
    phone: '(415) 555-0192',
    email: 'elena@rostovadesign.com',
    w9Status: 'signed',
    w9SignedDate: '2026-01-15',
    tinMatched: true,
    directSales: false,
    federalWithholding: 0,
    stateWithholding: 0,
    statePayerId: 'CA-9410291',
    stateIncome: 14250,
    accountNumber: 'CNT-9401',
    secondTinNotice: false,
    notes: 'Diseño UX/UI y maquetación de interfaces web.',
  },
  {
    id: 'cont-2',
    name: 'Marcos Silva',
    businessName: 'Silva Cloud Solutions',
    tinType: 'EIN',
    tin: '92-8374612',
    address: '1200 Brickell Ave, Suite 800',
    city: 'Miami',
    state: 'FL',
    zip: '33131',
    phone: '(305) 555-8391',
    email: 'marcos@silvacloud.io',
    w9Status: 'signed',
    w9SignedDate: '2026-02-01',
    tinMatched: true,
    directSales: false,
    federalWithholding: 0,
    stateWithholding: 0,
    statePayerId: 'FL-0000000',
    stateIncome: 8400,
    accountNumber: 'CNT-9402',
    secondTinNotice: false,
    notes: 'Desarrollo backend y arquitectura en AWS / GCP.',
  },
  {
    id: 'cont-3',
    name: 'Sarah Jenkins',
    businessName: 'Jenkins Regulatory Advisory',
    tinType: 'SSN',
    tin: '201-94-8832',
    address: '450 Lexington Ave, Fl 12',
    city: 'New York',
    state: 'NY',
    zip: '10017',
    phone: '(212) 555-7721',
    email: 'sarah.jenkins@regulatorylaw.com',
    w9Status: 'signed',
    w9SignedDate: '2026-03-10',
    tinMatched: true,
    directSales: false,
    federalWithholding: 0,
    stateWithholding: 150,
    statePayerId: 'NY-8491028',
    stateIncome: 5200,
    accountNumber: 'CNT-9403',
    secondTinNotice: false,
    notes: 'Asesoría fiscal corporativa y auditoría 1099.',
  },
  {
    id: 'cont-4',
    name: 'David Chen',
    businessName: 'Chen Technical Writing',
    tinType: 'SSN',
    tin: '582-11-9034',
    address: '88 King St East',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-4819',
    email: 'david@chenwrites.com',
    w9Status: 'pending',
    tinMatched: false,
    directSales: false,
    federalWithholding: 0,
    stateWithholding: 0,
    accountNumber: 'CNT-9404',
    secondTinNotice: false,
    notes: 'Redacción de documentación de API (Bajo umbral de $600).',
  },
  {
    id: 'cont-5',
    name: 'Carlos Mendoza',
    businessName: 'Mendoza Facilities Management',
    tinType: 'EIN',
    tin: '47-3819204',
    address: '3200 North Loop West',
    city: 'Houston',
    state: 'TX',
    zip: '77092',
    phone: '(713) 555-6612',
    email: 'carlos@mendozafacilities.com',
    w9Status: 'signed',
    w9SignedDate: '2026-04-18',
    tinMatched: true,
    directSales: false,
    federalWithholding: 0,
    stateWithholding: 0,
    accountNumber: 'CNT-9405',
    secondTinNotice: false,
    notes: 'Mantenimiento de infraestructura y cableado de red.',
  },
];

export const SAMPLE_PAYMENTS: PaymentRecord[] = [
  // Elena Rostova ($14,250 total)
  { id: 'pay-1', contractorId: 'cont-1', contractorName: 'Elena Rostova', amount: 3500, date: '2026-01-25', method: 'Direct Deposit', memo: 'Sprint 1 Design System', category: 'Design Services', year: 2026 },
  { id: 'pay-2', contractorId: 'cont-1', contractorName: 'Elena Rostova', amount: 3500, date: '2026-03-20', method: 'Direct Deposit', memo: 'Sprint 2 Mobile Prototypes', category: 'Design Services', year: 2026 },
  { id: 'pay-3', contractorId: 'cont-1', contractorName: 'Elena Rostova', amount: 3750, date: '2026-06-15', method: 'Direct Deposit', memo: 'Dashboard & Reports Redesign', category: 'Design Services', year: 2026 },
  { id: 'pay-4', contractorId: 'cont-1', contractorName: 'Elena Rostova', amount: 3500, date: '2026-09-10', method: 'Direct Deposit', memo: 'Design QA & Accessibility Tokens', category: 'Design Services', year: 2026 },

  // Marcos Silva ($8,400 total)
  { id: 'pay-5', contractorId: 'cont-2', contractorName: 'Marcos Silva', amount: 2800, date: '2026-02-15', method: 'Wire', memo: 'Cloud Migration Phase 1', category: 'Software Consulting', year: 2026 },
  { id: 'pay-6', contractorId: 'cont-2', contractorName: 'Marcos Silva', amount: 2800, date: '2026-05-18', method: 'Wire', memo: 'Database Optimization', category: 'Software Consulting', year: 2026 },
  { id: 'pay-7', contractorId: 'cont-2', contractorName: 'Marcos Silva', amount: 2800, date: '2026-08-22', method: 'Wire', memo: 'Kubernetes Cluster Hardening', category: 'Software Consulting', year: 2026 },

  // Sarah Jenkins ($5,200 total)
  { id: 'pay-8', contractorId: 'cont-3', contractorName: 'Sarah Jenkins', amount: 2600, date: '2026-04-10', method: 'Check', reference: 'CHK-1092', memo: 'Q1 Compliance Audit', category: 'Legal Fees', year: 2026 },
  { id: 'pay-9', contractorId: 'cont-3', contractorName: 'Sarah Jenkins', amount: 2600, date: '2026-07-14', method: 'Check', reference: 'CHK-1145', memo: 'Q2 Compliance & Vendor Contracts', category: 'Legal Fees', year: 2026 },

  // David Chen ($450 total - Under $600 threshold)
  { id: 'pay-10', contractorId: 'cont-4', contractorName: 'David Chen', amount: 450, date: '2026-06-05', method: 'Zelle', reference: 'ZEL-8821', memo: 'Developer Onboarding Guide', category: 'Content & Docs', year: 2026 },

  // Carlos Mendoza ($1,850 total)
  { id: 'pay-11', contractorId: 'cont-5', contractorName: 'Carlos Mendoza', amount: 950, date: '2026-05-30', method: 'Check', reference: 'CHK-1110', memo: 'Office Cabling & Server Rack install', category: 'Facility Maintenance', year: 2026 },
  { id: 'pay-12', contractorId: 'cont-5', contractorName: 'Carlos Mendoza', amount: 900, date: '2026-09-28', method: 'Check', reference: 'CHK-1188', memo: 'Network Cable Re-routing', category: 'Facility Maintenance', year: 2026 },
];

export const StorageService = {
  getCompany(): CompanyProfile {
    try {
      const data = localStorage.getItem('fiscalpay_company');
      return data ? JSON.parse(data) : DEFAULT_COMPANY;
    } catch {
      return DEFAULT_COMPANY;
    }
  },

  setCompany(company: CompanyProfile): void {
    localStorage.setItem('fiscalpay_company', JSON.stringify(company));
  },

  getContractors(): Contractor[] {
    try {
      const data = localStorage.getItem('fiscalpay_contractors');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setContractors(contractors: Contractor[]): void {
    localStorage.setItem('fiscalpay_contractors', JSON.stringify(contractors));
  },

  getPayments(): PaymentRecord[] {
    try {
      const data = localStorage.getItem('fiscalpay_payments');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setPayments(payments: PaymentRecord[]): void {
    localStorage.setItem('fiscalpay_payments', JSON.stringify(payments));
  },

  loadSampleData(): void {
    localStorage.setItem('fiscalpay_company', JSON.stringify(SAMPLE_COMPANY));
    localStorage.setItem('fiscalpay_contractors', JSON.stringify(SAMPLE_CONTRACTORS));
    localStorage.setItem('fiscalpay_payments', JSON.stringify(SAMPLE_PAYMENTS));
  },

  clearAllData(): void {
    localStorage.removeItem('fiscalpay_company');
    localStorage.removeItem('fiscalpay_contractors');
    localStorage.removeItem('fiscalpay_payments');
  },
};
