import React from 'react';
import { CopyType, Form1099Data } from '../types';

interface Irs1099FormProps {
  formData: Form1099Data;
  onChange: (field: keyof Form1099Data, value: any) => void;
  copyType: CopyType;
  zoomLevel: number;
}

export const Irs1099Form: React.FC<Irs1099FormProps> = ({
  formData,
  onChange,
  copyType,
  zoomLevel,
}) => {
  const isRedCopyA = copyType === 'Copy A';
  const currentYear = formData.year || 2026;

  // IRS Copy A uses official OCR-A red drop-out ink (#c60b1e / #b91c1c)
  // Copy B and C use deep black/charcoal high-contrast ink
  const borderColor = isRedCopyA ? 'border-[#c60b1e]' : 'border-black';
  const dividerColor = isRedCopyA ? 'border-[#c60b1e]' : 'border-black';
  const labelColor = isRedCopyA ? 'text-[#c60b1e]' : 'text-black';
  const titleColor = isRedCopyA ? 'text-[#c60b1e]' : 'text-black';
  const subtextColor = isRedCopyA ? 'text-[#c60b1e]' : 'text-slate-700';

  return (
    <div
      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
      className="transition-transform duration-150"
    >
      <div
        id="printable-irs-form"
        className="bg-white border-2 border-black p-7 relative font-sans text-black select-text shadow-xl max-w-[880px] mx-auto min-h-[640px]"
        style={{ width: '880px' }}
      >
        {/* Optical Scanner Alignment Target Marks (IRS Publication 1179) */}
        {isRedCopyA && (
          <>
            <div className="absolute top-2 left-2 text-[#c60b1e] font-mono text-xs font-bold select-none">┌</div>
            <div className="absolute top-2 right-2 text-[#c60b1e] font-mono text-xs font-bold select-none">┐</div>
            <div className="absolute bottom-2 left-2 text-[#c60b1e] font-mono text-xs font-bold select-none">└</div>
            <div className="absolute bottom-2 right-2 text-[#c60b1e] font-mono text-xs font-bold select-none">┘</div>
          </>
        )}

        {/* Form Top Header Strip */}
        <div className={`border-b-2 ${borderColor} pb-1.5 mb-1.5 flex justify-between items-baseline`}>
          <div className="w-1/3 flex items-center gap-3">
            <span className={`font-mono text-xl font-bold tracking-widest ${titleColor}`}>
              9595
            </span>
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <span className={`text-[9.5px] font-bold ${labelColor}`}>VOID</span>
              <input
                type="checkbox"
                checked={formData.voidForm}
                onChange={(e) => onChange('voidForm', e.target.checked)}
                className={`h-3.5 w-3.5 rounded-none ${isRedCopyA ? 'border-[#c60b1e] text-[#c60b1e]' : 'border-black text-black'} focus:ring-0 cursor-pointer`}
              />
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <span className={`text-[9.5px] font-bold ${labelColor}`}>CORRECTED</span>
              <input
                type="checkbox"
                checked={formData.correctedForm}
                onChange={(e) => onChange('correctedForm', e.target.checked)}
                className={`h-3.5 w-3.5 rounded-none ${isRedCopyA ? 'border-[#c60b1e] text-[#c60b1e]' : 'border-black text-black'} focus:ring-0 cursor-pointer`}
              />
            </label>
          </div>

          <div className="w-1/3 text-center">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${subtextColor}`}>
              {isRedCopyA ? 'DO NOT STAPLE OR TEAR' : 'OFFICIAL FEDERAL TAX FORM'}
            </span>
          </div>

          <div className="w-1/3 text-right">
            <span className={`text-[10.5px] font-bold font-mono ${titleColor}`}>
              OMB No. 1545-0116
            </span>
          </div>
        </div>

        {/* Main IRS Form Grid Architecture */}
        <div className={`grid grid-cols-12 border-t-2 border-l-2 ${borderColor}`}>
          {/* ===================================== */}
          {/* LEFT COLUMN: PAYER & RECIPIENT INFO  */}
          {/* ===================================== */}
          <div className="col-span-7 flex flex-col">
            {/* PAYER'S Name and Address Box */}
            <div className={`border-r border-b ${dividerColor} p-2 min-h-[110px] flex flex-col justify-between bg-white relative`}>
              <p className={`text-[8px] font-bold uppercase leading-tight tracking-tight ${labelColor}`}>
                PAYER’S name, street address, city or town, state or province, country, ZIP or foreign postal code, and telephone no.
              </p>
              <div className="mt-1 flex flex-col gap-0.5 text-xs font-mono font-medium text-black">
                <input
                  type="text"
                  value={formData.payerName}
                  onChange={(e) => onChange('payerName', e.target.value)}
                  placeholder="[PAYER LEGAL NAME]"
                  className="w-full bg-transparent border-0 p-0 font-bold text-[13px] text-black focus:outline-none placeholder:text-slate-300 placeholder:font-normal uppercase"
                />
                <input
                  type="text"
                  value={formData.payerAddress}
                  onChange={(e) => onChange('payerAddress', e.target.value)}
                  placeholder="[STREET ADDRESS]"
                  className="w-full bg-transparent border-0 p-0 text-xs text-black focus:outline-none placeholder:text-slate-300 uppercase"
                />
                <input
                  type="text"
                  value={formData.payerCityStateZip}
                  onChange={(e) => onChange('payerCityStateZip', e.target.value)}
                  placeholder="[CITY, STATE, ZIP CODE]"
                  className="w-full bg-transparent border-0 p-0 text-xs text-black focus:outline-none placeholder:text-slate-300 uppercase"
                />
                <input
                  type="text"
                  value={formData.payerPhone}
                  onChange={(e) => onChange('payerPhone', e.target.value)}
                  placeholder="[TEL: (000) 000-0000]"
                  className="w-full bg-transparent border-0 p-0 text-xs font-mono text-black focus:outline-none placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* TIN ROW */}
            <div className="grid grid-cols-2">
              <div className={`border-r border-b ${dividerColor} p-2`}>
                <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                  PAYER’S TIN
                </p>
                <input
                  type="text"
                  value={formData.payerTin}
                  onChange={(e) => onChange('payerTin', e.target.value)}
                  placeholder="XX-XXXXXXX"
                  className="w-full mt-1.5 bg-transparent border-0 p-0 font-mono text-sm font-bold text-black tracking-wider focus:outline-none placeholder:text-slate-300"
                />
              </div>
              <div className={`border-r border-b ${dividerColor} p-2`}>
                <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                  RECIPIENT’S TIN
                </p>
                <input
                  type="text"
                  value={formData.recipientTin}
                  onChange={(e) => onChange('recipientTin', e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  className="w-full mt-1.5 bg-transparent border-0 p-0 font-mono text-sm font-bold text-black tracking-wider focus:outline-none placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* RECIPIENT'S Name */}
            <div className={`border-r border-b ${dividerColor} p-2 min-h-[52px]`}>
              <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                RECIPIENT’S name
              </p>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => onChange('recipientName', e.target.value)}
                placeholder="[RECIPIENT INDIVIDUAL OR BUSINESS NAME]"
                className="w-full mt-1 bg-transparent border-0 p-0 font-mono font-bold text-sm text-black uppercase focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
              />
            </div>

            {/* Street Address */}
            <div className={`border-r border-b ${dividerColor} p-2 min-h-[46px]`}>
              <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                Street address (including apt. no.)
              </p>
              <input
                type="text"
                value={formData.recipientAddress}
                onChange={(e) => onChange('recipientAddress', e.target.value)}
                placeholder="[STREET ADDRESS]"
                className="w-full mt-1 bg-transparent border-0 p-0 font-mono text-xs font-semibold text-black uppercase focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
              />
            </div>

            {/* City, State, ZIP */}
            <div className={`border-r border-b ${dividerColor} p-2 min-h-[46px]`}>
              <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                City or town, state or province, country, and ZIP or foreign postal code
              </p>
              <input
                type="text"
                value={formData.recipientCityStateZip}
                onChange={(e) => onChange('recipientCityStateZip', e.target.value)}
                placeholder="[CITY, STATE, ZIP]"
                className="w-full mt-1 bg-transparent border-0 p-0 font-mono text-xs font-semibold text-black uppercase focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
              />
            </div>

            {/* Account Number & 2nd TIN notice */}
            <div className="grid grid-cols-2">
              <div className={`border-r border-b ${dividerColor} p-1.5`}>
                <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                  Account number (see instructions)
                </p>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => onChange('accountNumber', e.target.value)}
                  placeholder="[OPTIONAL ACCOUNT #]"
                  className="w-full mt-1 bg-transparent border-0 p-0 font-mono text-xs text-black focus:outline-none placeholder:text-slate-300"
                />
              </div>
              <div className={`border-r border-b ${dividerColor} p-1.5 flex items-center justify-between`}>
                <div>
                  <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                    2nd TIN not.
                  </p>
                  <span className={`text-[8px] ${subtextColor}`}>Notice</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.secondTinNotice}
                  onChange={(e) => onChange('secondTinNotice', e.target.checked)}
                  className={`h-3.5 w-3.5 rounded-none ${isRedCopyA ? 'border-[#c60b1e] text-[#c60b1e]' : 'border-black text-black'} cursor-pointer`}
                />
              </div>
            </div>
          </div>

          {/* ===================================== */}
          {/* RIGHT COLUMN: TAX BOXES, YEAR & COPY */}
          {/* ===================================== */}
          <div className="col-span-5 flex flex-col">
            {/* Header: Form Title & Year */}
            <div className={`border-r border-b ${dividerColor} p-2.5 flex justify-between items-center ${isRedCopyA ? 'bg-red-50/40' : 'bg-slate-50/60'}`}>
              <div>
                <p className={`text-[12px] font-extrabold uppercase tracking-tight ${titleColor} leading-tight`}>
                  Nonemployee Compensation
                </p>
                <p className={`text-[10px] ${subtextColor} mt-0.5`}>
                  Form <span className={`font-extrabold ${titleColor} text-xs`}>1099-NEC</span>
                </p>
                <p className={`text-[8px] ${subtextColor}`}>
                  (Rev. December {currentYear} / Continuous Use)
                </p>
              </div>
              <div className="text-right">
                <span className={`font-mono text-3xl font-extrabold tracking-tight ${titleColor}`}>
                  {currentYear}
                </span>
              </div>
            </div>

            {/* BOX 1: NONEMPLOYEE COMPENSATION */}
            <div className={`border-r border-b ${dividerColor} p-2 flex flex-col justify-between min-h-[58px]`}>
              <div className="flex items-center justify-between">
                <p className={`text-[8.5px] font-bold uppercase tracking-tight ${labelColor}`}>
                  1 Nonemployee compensation
                </p>
                <span className={`text-[8px] font-mono font-bold uppercase ${isRedCopyA ? 'text-[#c60b1e]' : 'text-slate-500'}`}>
                  Reportable Gross
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-end">
                <span className={`text-sm font-mono font-bold mr-1 ${isRedCopyA ? 'text-[#c60b1e]' : 'text-black'}`}>$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.box1Compensation}
                  onChange={(e) => onChange('box1Compensation', parseFloat(e.target.value) || 0)}
                  className="font-mono text-xl font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-36"
                />
              </div>
            </div>

            {/* BOX 2: DIRECT SALES */}
            <div className={`border-r border-b ${dividerColor} p-1.5 flex items-center justify-between min-h-[42px]`}>
              <p className={`text-[8px] font-bold uppercase leading-tight pr-2 ${labelColor}`}>
                2 Payer made direct sales totaling $5,000 or more of consumer products to certain buyers for resale
              </p>
              <input
                type="checkbox"
                checked={formData.box2DirectSales}
                onChange={(e) => onChange('box2DirectSales', e.target.checked)}
                className={`h-3.5 w-3.5 rounded-none ${isRedCopyA ? 'border-[#c60b1e] text-[#c60b1e]' : 'border-black text-black'} cursor-pointer shrink-0`}
              />
            </div>

            {/* BOX 3: GOLDEN PARACHUTE / RESERVED (2025/2026 IRS REVISION) */}
            <div className={`border-r border-b ${dividerColor} p-1.5 flex flex-col justify-between min-h-[40px]`}>
              <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                3 Excess golden parachute payments
              </p>
              <div className="flex items-baseline justify-end">
                <span className={`text-xs font-mono font-bold mr-1 ${isRedCopyA ? 'text-[#c60b1e]' : 'text-slate-400'}`}>$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.box3GoldenParachute || 0}
                  onChange={(e) => onChange('box3GoldenParachute', parseFloat(e.target.value) || 0)}
                  className="font-mono text-xs font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-24"
                />
              </div>
            </div>

            {/* BOX 4: FEDERAL INCOME TAX WITHHELD */}
            <div className={`border-r border-b ${dividerColor} p-2 flex flex-col justify-between min-h-[48px]`}>
              <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                4 Federal income tax withheld
              </p>
              <div className="flex items-baseline justify-end">
                <span className={`text-sm font-mono font-bold mr-1 ${isRedCopyA ? 'text-[#c60b1e]' : 'text-black'}`}>$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.box4FederalWithheld}
                  onChange={(e) => onChange('box4FederalWithheld', parseFloat(e.target.value) || 0)}
                  className="font-mono text-sm font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-28"
                />
              </div>
            </div>

            {/* COPY IDENTIFIER BOX */}
            <div className={`border-r border-b ${dividerColor} p-2 flex-1 flex flex-col justify-center ${isRedCopyA ? 'bg-red-50/60' : 'bg-slate-100/70'}`}>
              <p className={`text-sm font-extrabold ${titleColor} leading-none`}>
                {copyType}
              </p>
              <p className={`text-[10px] font-bold ${titleColor} mt-0.5 leading-snug`}>
                {copyType === 'Copy A' && 'For Internal Revenue Service Center'}
                {copyType === 'Copy B' && 'For Recipient'}
                {copyType === 'Copy C' && 'For Payer'}
              </p>
              <p className={`text-[8px] ${subtextColor} leading-tight mt-1`}>
                {copyType === 'Copy A' && 'File with Form 1096 by January 31. For Privacy Act and Paperwork Reduction Act Notice, see the current General Instructions for Certain Information Returns.'}
                {copyType === 'Copy B' && 'This is important tax information and is being furnished to the Internal Revenue Service. If you are required to file a return, a negligence penalty or other sanction may be imposed on you if this income is taxable and the IRS determines that it has not been reported.'}
                {copyType === 'Copy C' && 'For Payer records. Keep for your files for at least 4 years as required by IRS regulations.'}
              </p>
            </div>
          </div>

          {/* ===================================== */}
          {/* STATE TAX INFORMATION (BOXES 5, 6, 7) */}
          {/* ===================================== */}
          <div className="col-span-12">
            <div className="grid grid-cols-12 text-left">
              {/* Box 5: State tax withheld */}
              <div className={`col-span-4 border-r border-b ${dividerColor} p-2`}>
                <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                  5 State tax withheld
                </p>
                <div className="mt-1 flex items-baseline justify-end">
                  <span className={`text-xs font-mono font-bold mr-1 ${isRedCopyA ? 'text-[#c60b1e]' : 'text-slate-400'}`}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.box5StateWithheld}
                    onChange={(e) => onChange('box5StateWithheld', parseFloat(e.target.value) || 0)}
                    className="font-mono text-xs font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-24"
                  />
                </div>
              </div>

              {/* Box 6: State / Payer's state no. */}
              <div className={`col-span-4 border-r border-b ${dividerColor} p-2`}>
                <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                  6 State / Payer’s state no.
                </p>
                <div className="mt-1 flex items-center justify-between gap-1">
                  <input
                    type="text"
                    value={formData.box6State}
                    onChange={(e) => onChange('box6State', e.target.value)}
                    placeholder="[ST]"
                    className="w-12 bg-transparent border-0 p-0 font-mono font-bold text-xs text-black uppercase focus:outline-none placeholder:text-slate-300"
                  />
                  <input
                    type="text"
                    value={formData.box6PayerStateNo}
                    onChange={(e) => onChange('box6PayerStateNo', e.target.value)}
                    placeholder="[STATE ID NUMBER]"
                    className="flex-1 bg-transparent border-0 p-0 font-mono text-[11px] text-black text-right focus:outline-none placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Box 7: State income */}
              <div className={`col-span-4 border-r border-b ${dividerColor} p-2`}>
                <p className={`text-[8px] font-bold uppercase leading-tight ${labelColor}`}>
                  7 State income
                </p>
                <div className="mt-1 flex items-baseline justify-end">
                  <span className={`text-xs font-mono font-bold mr-1 ${isRedCopyA ? 'text-[#c60b1e]' : 'text-slate-400'}`}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.box7StateIncome}
                    onChange={(e) => onChange('box7StateIncome', parseFloat(e.target.value) || 0)}
                    className="font-mono text-xs font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Official Legal Footer */}
        <div className={`mt-2 pt-1 flex flex-col md:flex-row justify-between items-center text-[9px] ${subtextColor} gap-2`}>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${titleColor}`}>
              Form 1099-NEC ({currentYear})
            </span>
            <span>•</span>
            <span className="font-mono">Cat. No. 74162Z</span>
            <span>•</span>
            <span className="font-mono">www.irs.gov/Form1099NEC</span>
            <span>•</span>
            <span>Department of the Treasury - Internal Revenue Service</span>
          </div>

          <div className="text-[8.5px] font-mono italic text-slate-500">
            {isRedCopyA ? 'IRS OCR Scannable Document' : '(Keep for your records)'}
          </div>
        </div>

        {/* Perforation line simulation for print */}
        <div className="mt-3 pt-1 border-t border-dashed border-slate-300 flex items-center justify-between text-[8px] text-slate-400 font-mono select-none">
          <span>✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </span>
          <span>CUT HERE</span>
        </div>
      </div>
    </div>
  );
};
