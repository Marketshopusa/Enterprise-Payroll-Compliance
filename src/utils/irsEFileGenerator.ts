import { CompanyProfile, Contractor, PaymentRecord } from '../types';

/**
 * Generates an official IRS FIRE System Publication 1220 compliant 750-byte fixed-width ASCII file for Form 1099-NEC.
 */
export function generateIrsPub1220Txt(
  company: CompanyProfile,
  contractors: Contractor[],
  payments: PaymentRecord[],
  year: number = 2024
): string {
  const padRight = (str: string, len: number) => (str || '').slice(0, len).padEnd(len, ' ');
  const padLeft = (str: string, len: number, char: string = '0') => (str || '').slice(0, len).padStart(len, char);
  const cleanTin = (tin: string) => (tin || '').replace(/[^0-9]/g, '');

  const eligibleContractors = contractors.filter(c => {
    const total = payments
      .filter(p => p.contractorId === c.id && p.year === year)
      .reduce((sum, p) => sum + p.amount, 0);
    return total >= 600;
  });

  const lines: string[] = [];

  // T Record: Transmitter Record (750 chars)
  let tRec = 'T';
  tRec += padRight(year.toString(), 4);
  tRec += ' '; // Prior Year Data Indicator
  tRec += padRight(cleanTin(company.ein) || '000000000', 9); // Transmitter's TIN
  tRec += padRight(company.transmitterControlCode || 'IRS01', 5); // TCC
  tRec += ' '.repeat(7); // Blank
  tRec += ' '; // Foreign Entity Indicator
  tRec += padRight(company.legalName || 'TRANSMITTER COMPANY', 40); // Transmitter Name
  tRec += padRight(company.tradeName || '', 40); // Transmitter Name Cont.
  tRec += padRight(company.legalName || 'COMPANY INC', 40); // Company Name
  tRec += padRight(company.address || '100 MAIN ST', 40); // Company Address
  tRec += padRight(company.city || 'SAN FRANCISCO', 40); // Company City
  tRec += padRight(company.state || 'CA', 2); // State
  tRec += padRight(cleanTin(company.zip) || '94101', 9); // ZIP
  tRec += ' '.repeat(15);
  tRec += padLeft(eligibleContractors.length.toString(), 8, '0'); // Total Payees
  tRec += padRight(company.contactEmail || 'admin@company.com', 50); // Contact Email
  tRec += padRight(company.phone.replace(/[^0-9]/g, '') || '0000000000', 15); // Contact Phone
  tRec = padRight(tRec, 748) + '  '; // Ensure exactly 750
  lines.push(tRec);

  // A Record: Payer Record
  let aRec = 'A';
  aRec += padRight(year.toString(), 4);
  aRec += ' '; // Combined Federal/State Filing
  aRec += ' '.repeat(5);
  aRec += padRight(cleanTin(company.ein) || '000000000', 9); // Payer TIN
  aRec += padRight(company.legalName.slice(0, 4).toUpperCase(), 4); // Payer Name Control
  aRec += ' '; // Type of Return Indicator
  aRec += 'NE'; // Return Type: NE = 1099-NEC
  aRec += '1'; // Amount Code 1 = Nonemployee Compensation
  aRec += ' '.repeat(8);
  aRec += ' '; // Foreign Entity Indicator
  aRec += padRight(company.legalName, 40); // First Payer Name Line
  aRec += padRight(company.tradeName || '', 40); // Second Payer Name Line
  aRec += '1'; // Transfer Agent Indicator
  aRec += padRight(company.address, 40); // Payer Shipping Address
  aRec += padRight(company.city, 40); // Payer City
  aRec += padRight(company.state, 2); // Payer State
  aRec += padRight(cleanTin(company.zip), 9); // Payer ZIP
  aRec += padRight(company.phone.replace(/[^0-9]/g, ''), 15);
  aRec = padRight(aRec, 748) + '  ';
  lines.push(aRec);

  // B Records: Payee Records
  let totalGrossCents = 0;
  eligibleContractors.forEach((c, index) => {
    const total = payments
      .filter(p => p.contractorId === c.id && p.year === year)
      .reduce((sum, p) => sum + p.amount, 0);
    const amountCents = Math.round(total * 100);
    totalGrossCents += amountCents;

    let bRec = 'B';
    bRec += padRight(year.toString(), 4);
    bRec += ' '; // Corrected Return Indicator
    bRec += padRight(c.name.slice(0, 4).toUpperCase(), 4); // Name Control
    bRec += c.tinType === 'EIN' ? '1' : '2'; // Type of TIN (1=EIN, 2=SSN)
    bRec += padRight(cleanTin(c.tin), 9); // Payee's TIN
    bRec += padRight(c.accountNumber || `CNT-${index + 1}`, 20); // Payer's Account Number
    bRec += ' '.repeat(4);
    bRec += padLeft(amountCents.toString(), 12, '0'); // Amount 1 (Nonemployee Comp in cents)
    bRec += ' '.repeat(16 * 12); // Amount codes 2 through 16 empty
    bRec += ' '; // Foreign country indicator
    bRec += padRight(c.name, 40); // Payee Name
    bRec += padRight(c.businessName || '', 40); // Payee 2nd Name Line
    bRec += padRight(c.address, 40); // Payee Address
    bRec += ' '.repeat(40);
    bRec += padRight(c.city, 40); // Payee City
    bRec += padRight(c.state, 2); // Payee State
    bRec += padRight(cleanTin(c.zip), 9); // Payee ZIP
    bRec = padRight(bRec, 748) + '  ';
    lines.push(bRec);
  });

  // C Record: End of Payer Record
  let cRec = 'C';
  cRec += padLeft(eligibleContractors.length.toString(), 8, '0'); // Total Payees
  cRec += ' '.repeat(6);
  cRec += padLeft(totalGrossCents.toString(), 18, '0'); // Control Total 1 (Box 1 Gross in cents)
  cRec = padRight(cRec, 748) + '  ';
  lines.push(cRec);

  // F Record: End of Transmission Record
  let fRec = 'F';
  fRec += padLeft('1', 8, '0'); // Total "A" Records
  fRec += '00000'; // Zero
  fRec += padLeft(eligibleContractors.length.toString(), 8, '0'); // Total Payees for file
  fRec = padRight(fRec, 748) + '  ';
  lines.push(fRec);

  return lines.join('\r\n');
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
