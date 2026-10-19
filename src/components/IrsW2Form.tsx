import React from 'react';
import { FormW2Data } from '../types';

interface IrsW2FormProps {
  formData: FormW2Data;
  onChange: (field: keyof FormW2Data, value: any) => void;
  copyType: string;
  zoomLevel: number;
}

export const IrsW2Form: React.FC<IrsW2FormProps> = ({
  formData,
  onChange,
  copyType,
  zoomLevel,
}) => {
  const currentYear = formData.year || 2026;

  // Auto-calculate statutory tax formulas if wages change:
  // Social Security Tax: 6.2% (capped at 2026 wage base)
  // Medicare Tax: 1.45%
  const handleWagesChange = (wages: number) => {
    onChange('box1Wages', wages);
    onChange('box3SocialSecurityWages', wages);
    onChange('box4SocialSecurityWithheld', parseFloat((wages * 0.062).toFixed(2)));
    onChange('box5MedicareWages', wages);
    onChange('box6MedicareWithheld', parseFloat((wages * 0.0145).toFixed(2)));
    onChange('box16StateWages', wages);
  };

  return (
    <div
      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
      className="transition-transform duration-150"
    >
      <div
        id="printable-irs-w2-form"
        className="bg-white border-2 border-black p-7 relative font-sans text-black select-text shadow-xl max-w-[880px] mx-auto min-h-[640px]"
        style={{ width: '880px' }}
      >
        {/* W-2 Header */}
        <div className="border-b-2 border-black pb-2 mb-2 flex justify-between items-start">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-extrabold tracking-tight">22222</span>
              <label className="flex items-center gap-1 cursor-pointer ml-3">
                <span className="text-[9.5px] font-bold text-slate-700">VOID</span>
                <input
                  type="checkbox"
                  checked={formData.voidForm}
                  onChange={(e) => onChange('voidForm', e.target.checked)}
                  className="h-3.5 w-3.5 rounded-none border-black text-black cursor-pointer"
                />
              </label>
            </div>
            <p className="text-[9px] text-slate-600 font-semibold mt-0.5">
              For Official Use Only (SSA & IRS Certified)
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-black">
              Wage and Tax Statement
            </h2>
            <p className="text-[10px] text-slate-600 font-medium">
              Copy B — To Be Filed With Employee's FEDERAL Tax Return
            </p>
          </div>

          <div className="text-right">
            <span className="font-mono text-3xl font-extrabold text-black block leading-none">
              {currentYear}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-800">
              OMB No. 1545-0008
            </span>
          </div>
        </div>

        {/* W-2 Grid Architecture */}
        <div className="grid grid-cols-12 border-t-2 border-l-2 border-black">
          {/* LEFT COLUMN: EMPLOYER & EMPLOYEE DETAILS (Cols 1-6) */}
          <div className="col-span-6 flex flex-col">
            {/* Box a: Employee's social security number */}
            <div className="border-r border-b border-black p-2 min-h-[50px]">
              <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                a Employee’s social security number
              </p>
              <input
                type="text"
                value={formData.employeeSsn}
                onChange={(e) => onChange('employeeSsn', e.target.value)}
                placeholder="000-00-0000"
                className="w-full mt-1 bg-transparent border-0 p-0 font-mono text-sm font-bold text-black tracking-wider focus:outline-none"
              />
            </div>

            {/* Box b: Employer identification number (EIN) */}
            <div className="border-r border-b border-black p-2 min-h-[50px]">
              <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                b Employer identification number (EIN)
              </p>
              <input
                type="text"
                value={formData.employerTin}
                onChange={(e) => onChange('employerTin', e.target.value)}
                placeholder="00-0000000"
                className="w-full mt-1 bg-transparent border-0 p-0 font-mono text-sm font-bold text-black tracking-wider focus:outline-none"
              />
            </div>

            {/* Box c: Employer's name, address, and ZIP code */}
            <div className="border-r border-b border-black p-2 min-h-[110px] flex flex-col justify-between">
              <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                c Employer’s name, address, and ZIP code
              </p>
              <div className="mt-1 flex flex-col gap-0.5 text-xs font-mono font-medium">
                <input
                  type="text"
                  value={formData.employerName}
                  onChange={(e) => onChange('employerName', e.target.value)}
                  placeholder="[EMPLOYER LEGAL NAME]"
                  className="w-full bg-transparent border-0 p-0 font-bold text-xs text-black uppercase focus:outline-none"
                />
                <input
                  type="text"
                  value={formData.employerAddress}
                  onChange={(e) => onChange('employerAddress', e.target.value)}
                  placeholder="[STREET ADDRESS]"
                  className="w-full bg-transparent border-0 p-0 text-xs text-black uppercase focus:outline-none"
                />
                <input
                  type="text"
                  value={formData.employerCityStateZip}
                  onChange={(e) => onChange('employerCityStateZip', e.target.value)}
                  placeholder="[CITY, STATE, ZIP]"
                  className="w-full bg-transparent border-0 p-0 text-xs text-black uppercase focus:outline-none"
                />
              </div>
            </div>

            {/* Box d: Control number */}
            <div className="border-r border-b border-black p-1.5 min-h-[40px]">
              <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                d Control number
              </p>
              <input
                type="text"
                value={formData.controlNumber}
                onChange={(e) => onChange('controlNumber', e.target.value)}
                placeholder="[OPTIONAL CONTROL NO]"
                className="w-full mt-0.5 bg-transparent border-0 p-0 font-mono text-xs text-black focus:outline-none"
              />
            </div>

            {/* Box e: Employee's first name and initial, Last name */}
            <div className="border-r border-b border-black p-2 min-h-[50px]">
              <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                e Employee’s first name and initial | Last name | Suff.
              </p>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={formData.employeeFirstName}
                  onChange={(e) => onChange('employeeFirstName', e.target.value)}
                  placeholder="[FIRST NAME]"
                  className="w-1/2 bg-transparent border-0 p-0 font-mono font-bold text-xs text-black uppercase focus:outline-none"
                />
                <input
                  type="text"
                  value={formData.employeeLastName}
                  onChange={(e) => onChange('employeeLastName', e.target.value)}
                  placeholder="[LAST NAME]"
                  className="w-1/2 bg-transparent border-0 p-0 font-mono font-bold text-xs text-black uppercase focus:outline-none"
                />
              </div>
            </div>

            {/* Box f: Employee's address and ZIP code */}
            <div className="border-r border-b border-black p-2 min-h-[60px]">
              <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                f Employee’s address and ZIP code
              </p>
              <div className="mt-0.5 flex flex-col gap-0.5">
                <input
                  type="text"
                  value={formData.employeeAddress}
                  onChange={(e) => onChange('employeeAddress', e.target.value)}
                  placeholder="[STREET ADDRESS]"
                  className="w-full bg-transparent border-0 p-0 font-mono text-xs text-black uppercase focus:outline-none"
                />
                <input
                  type="text"
                  value={formData.employeeCityStateZip}
                  onChange={(e) => onChange('employeeCityStateZip', e.target.value)}
                  placeholder="[CITY, STATE, ZIP]"
                  className="w-full bg-transparent border-0 p-0 font-mono text-xs text-black uppercase focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: WAGES & TAXES (Cols 7-12) */}
          <div className="col-span-6 flex flex-col">
            {/* Box 1 & 2 */}
            <div className="grid grid-cols-2">
              <div className="border-r border-b border-black p-1.5 min-h-[50px]">
                <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                  1 Wages, tips, other compensation
                </p>
                <div className="mt-1 flex items-baseline justify-end">
                  <span className="text-xs font-mono font-bold mr-1">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.box1Wages}
                    onChange={(e) => handleWagesChange(parseFloat(e.target.value) || 0)}
                    className="font-mono text-sm font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-28"
                  />
                </div>
              </div>

              <div className="border-r border-b border-black p-1.5 min-h-[50px]">
                <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                  2 Federal income tax withheld
                </p>
                <div className="mt-1 flex items-baseline justify-end">
                  <span className="text-xs font-mono font-bold mr-1">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.box2FederalWithheld}
                    onChange={(e) => onChange('box2FederalWithheld', parseFloat(e.target.value) || 0)}
                    className="font-mono text-sm font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-24"
                  />
                </div>
              </div>
            </div>

            {/* Box 3 & 4 (Social Security) */}
            <div className="grid grid-cols-2">
              <div className="border-r border-b border-black p-1.5 min-h-[50px]">
                <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                  3 Social security wages
                </p>
                <div className="mt-1 flex items-baseline justify-end">
                  <span className="text-xs font-mono font-bold mr-1">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.box3SocialSecurityWages}
                    onChange={(e) => onChange('box3SocialSecurityWages', parseFloat(e.target.value) || 0)}
                    className="font-mono text-sm font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-28"
                  />
                </div>
              </div>

              <div className="border-r border-b border-black p-1.5 min-h-[50px]">
                <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                  4 Social security tax withheld (6.2%)
                </p>
                <div className="mt-1 flex items-baseline justify-end">
                  <span className="text-xs font-mono font-bold mr-1">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.box4SocialSecurityWithheld}
                    onChange={(e) => onChange('box4SocialSecurityWithheld', parseFloat(e.target.value) || 0)}
                    className="font-mono text-sm font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-24"
                  />
                </div>
              </div>
            </div>

            {/* Box 5 & 6 (Medicare) */}
            <div className="grid grid-cols-2">
              <div className="border-r border-b border-black p-1.5 min-h-[50px]">
                <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                  5 Medicare wages and tips
                </p>
                <div className="mt-1 flex items-baseline justify-end">
                  <span className="text-xs font-mono font-bold mr-1">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.box5MedicareWages}
                    onChange={(e) => onChange('box5MedicareWages', parseFloat(e.target.value) || 0)}
                    className="font-mono text-sm font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-28"
                  />
                </div>
              </div>

              <div className="border-r border-b border-black p-1.5 min-h-[50px]">
                <p className="text-[8px] font-bold uppercase leading-tight text-slate-800">
                  6 Medicare tax withheld (1.45%)
                </p>
                <div className="mt-1 flex items-baseline justify-end">
                  <span className="text-xs font-mono font-bold mr-1">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.box6MedicareWithheld}
                    onChange={(e) => onChange('box6MedicareWithheld', parseFloat(e.target.value) || 0)}
                    className="font-mono text-sm font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-24"
                  />
                </div>
              </div>
            </div>

            {/* Box 7, 8 & 10 */}
            <div className="grid grid-cols-3">
              <div className="border-r border-b border-black p-1.5 min-h-[46px]">
                <p className="text-[7.5px] font-bold uppercase leading-tight text-slate-800">
                  7 Social security tips
                </p>
                <input
                  type="number"
                  value={formData.box7SocialSecurityTips || 0}
                  onChange={(e) => onChange('box7SocialSecurityTips', parseFloat(e.target.value) || 0)}
                  className="font-mono text-xs font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-full"
                />
              </div>
              <div className="border-r border-b border-black p-1.5 min-h-[46px]">
                <p className="text-[7.5px] font-bold uppercase leading-tight text-slate-800">
                  8 Allocated tips
                </p>
                <input
                  type="number"
                  value={formData.box8AllocatedTips || 0}
                  onChange={(e) => onChange('box8AllocatedTips', parseFloat(e.target.value) || 0)}
                  className="font-mono text-xs font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-full"
                />
              </div>
              <div className="border-r border-b border-black p-1.5 min-h-[46px]">
                <p className="text-[7.5px] font-bold uppercase leading-tight text-slate-800">
                  10 Dependent care
                </p>
                <input
                  type="number"
                  value={formData.box10DependentCare || 0}
                  onChange={(e) => onChange('box10DependentCare', parseFloat(e.target.value) || 0)}
                  className="font-mono text-xs font-bold text-black text-right bg-transparent border-0 p-0 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Box 12 & 13 Checkboxes */}
            <div className="grid grid-cols-2">
              <div className="border-r border-b border-black p-1.5 min-h-[50px]">
                <p className="text-[7.5px] font-bold uppercase leading-tight text-slate-800">
                  12a Code / Amount
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={formData.box12Code}
                    onChange={(e) => onChange('box12Code', e.target.value.toUpperCase())}
                    placeholder="D (401k)"
                    className="w-10 font-mono font-bold text-xs uppercase border-b border-slate-300 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={formData.box12Amount || 0}
                    onChange={(e) => onChange('box12Amount', parseFloat(e.target.value) || 0)}
                    className="font-mono text-xs font-bold text-black text-right focus:outline-none flex-1"
                  />
                </div>
              </div>

              <div className="border-r border-b border-black p-1.5 min-h-[50px]">
                <p className="text-[7.5px] font-bold uppercase leading-tight text-slate-800">
                  13 Checkboxes
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[8.5px]">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.box13Statutory}
                      onChange={(e) => onChange('box13Statutory', e.target.checked)}
                      className="h-3 w-3"
                    />
                    <span>Statutory</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.box13RetirementPlan}
                      onChange={(e) => onChange('box13RetirementPlan', e.target.checked)}
                      className="h-3 w-3"
                    />
                    <span>Retirement</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* STATE & LOCAL TAX ROW (BOXES 15 TO 20) */}
          <div className="col-span-12">
            <div className="grid grid-cols-12 text-left">
              <div className="col-span-2 border-r border-b border-black p-1.5">
                <p className="text-[7.5px] font-bold uppercase text-slate-800">15 State / Employer's state ID</p>
                <div className="flex gap-1 mt-0.5">
                  <input
                    type="text"
                    value={formData.box15State}
                    onChange={(e) => onChange('box15State', e.target.value.toUpperCase())}
                    placeholder="CA"
                    className="w-7 font-mono font-bold text-xs uppercase focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formData.box15StateId}
                    onChange={(e) => onChange('box15StateId', e.target.value)}
                    placeholder="ID No."
                    className="w-16 font-mono text-[10px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="col-span-3 border-r border-b border-black p-1.5">
                <p className="text-[7.5px] font-bold uppercase text-slate-800">16 State wages, tips, etc.</p>
                <div className="flex items-baseline justify-end mt-0.5">
                  <span className="text-xs font-mono font-bold mr-0.5">$</span>
                  <input
                    type="number"
                    value={formData.box16StateWages}
                    onChange={(e) => onChange('box16StateWages', parseFloat(e.target.value) || 0)}
                    className="font-mono text-xs font-bold text-black text-right focus:outline-none w-20"
                  />
                </div>
              </div>

              <div className="col-span-3 border-r border-b border-black p-1.5">
                <p className="text-[7.5px] font-bold uppercase text-slate-800">17 State income tax</p>
                <div className="flex items-baseline justify-end mt-0.5">
                  <span className="text-xs font-mono font-bold mr-0.5">$</span>
                  <input
                    type="number"
                    value={formData.box17StateWithheld}
                    onChange={(e) => onChange('box17StateWithheld', parseFloat(e.target.value) || 0)}
                    className="font-mono text-xs font-bold text-black text-right focus:outline-none w-20"
                  />
                </div>
              </div>

              <div className="col-span-2 border-r border-b border-black p-1.5">
                <p className="text-[7.5px] font-bold uppercase text-slate-800">18 Local wages</p>
                <div className="flex items-baseline justify-end mt-0.5">
                  <span className="text-xs font-mono font-bold mr-0.5">$</span>
                  <input
                    type="number"
                    value={formData.box18LocalWages}
                    onChange={(e) => onChange('box18LocalWages', parseFloat(e.target.value) || 0)}
                    className="font-mono text-xs font-bold text-black text-right focus:outline-none w-16"
                  />
                </div>
              </div>

              <div className="col-span-2 border-r border-b border-black p-1.5">
                <p className="text-[7.5px] font-bold uppercase text-slate-800">19 Local tax</p>
                <div className="flex items-baseline justify-end mt-0.5">
                  <span className="text-xs font-mono font-bold mr-0.5">$</span>
                  <input
                    type="number"
                    value={formData.box19LocalWithheld}
                    onChange={(e) => onChange('box19LocalWithheld', parseFloat(e.target.value) || 0)}
                    className="font-mono text-xs font-bold text-black text-right focus:outline-none w-16"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2.5 pt-1 border-t border-slate-300 flex justify-between items-center text-[9px] text-slate-600">
          <div>
            <span className="font-bold text-black">Form W-2 ({currentYear})</span>
            <span className="mx-1">•</span>
            <span>Department of the Treasury — Internal Revenue Service</span>
            <span className="mx-1">•</span>
            <span className="font-mono">Cat. No. 10134D</span>
          </div>
          <div className="font-mono text-[8.5px] text-slate-500">
            Certified Social Security Administration & IRS Wage Form
          </div>
        </div>
      </div>
    </div>
  );
};
