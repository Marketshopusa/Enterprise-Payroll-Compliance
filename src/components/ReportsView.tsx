import React from 'react';
import { CompanyProfile, Contractor, Language, PaymentRecord } from '../types';
import { translations } from '../utils/translations';
import { generateIrsPub1220Txt, downloadFile } from '../utils/irsEFileGenerator';

interface ReportsViewProps {
  company: CompanyProfile;
  contractors: Contractor[];
  payments: PaymentRecord[];
  fiscalYear: number;
  lang: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  company,
  contractors,
  payments,
  fiscalYear,
  lang,
}) => {
  const t = translations[lang];

  const yearPayments = payments.filter((p) => p.year === fiscalYear);
  const eligibleContractors = contractors.filter((c) => {
    const total = yearPayments
      .filter((p) => p.contractorId === c.id)
      .reduce((sum, p) => sum + p.amount, 0);
    return total >= 600;
  });

  const totalBox1 = eligibleContractors.reduce((sum, c) => {
    const total = yearPayments
      .filter((p) => p.contractorId === c.id)
      .reduce((s, p) => s + p.amount, 0);
    return sum + total;
  }, 0);

  const totalBox4 = eligibleContractors.reduce((sum, c) => sum + (c.federalWithholding || 0), 0);
  const totalBox5 = eligibleContractors.reduce((sum, c) => sum + (c.stateWithholding || 0), 0);

  const handleDownloadEfile = () => {
    const txt = generateIrsPub1220Txt(company, contractors, payments, fiscalYear);
    downloadFile(txt, `IRS_FIRE_1099NEC_${fiscalYear}.txt`, 'text/plain');
  };

  const handlePrint1096 = () => {
    window.print();
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-[#f8f9ff]">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight font-heading">
              Reportes & Cierre Anual IRS Form 1096
            </h1>
            <p className="text-xs text-[#45464d] mt-1">
              Consolidación general de planillas 1099-NEC, archivo para transmisión electrónica IRS FIRE y hoja de transmisión Formulario 1096.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadEfile}
              className="px-3.5 py-2 rounded-lg bg-[#006c4a] hover:bg-[#005137] text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">file_upload</span>
              <span>Generar Archivo IRS FIRE (TXT)</span>
            </button>

            <button
              onClick={handlePrint1096}
              className="px-3.5 py-2 rounded-lg border border-[#c6c6cd] bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Imprimir Formulario 1096</span>
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Formularios 1099-NEC a Emitir</span>
            <span className="text-2xl font-bold font-mono text-[#0b1c30] mt-1 block">
              {eligibleContractors.length}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Contratistas con pagos ≥ $600
            </span>
          </div>

          <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Total Box 1 (Compensación)</span>
            <span className="text-2xl font-bold font-mono text-[#006c4a] mt-1 block">
              ${totalBox1.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Monto total deducible para la empresa
            </span>
          </div>

          <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Total Box 4 (Retención Federal)</span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
              ${totalBox4.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Backup withholding reportado
            </span>
          </div>

          <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Total Box 5 (Retención Estatal)</span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
              ${totalBox5.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Retenciones tributarias estatales
            </span>
          </div>
        </div>

        {/* Official Form 1096 Preview Card */}
        <div className="bg-white border-2 border-slate-900 rounded-sm shadow-md p-6 max-w-4xl mx-auto w-full font-sans text-slate-900">
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
            <div>
              <span className="font-extrabold text-xl font-heading">Form 1096</span>
              <p className="text-[10px] text-slate-600">Department of the Treasury - Internal Revenue Service</p>
            </div>
            <div className="text-center">
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Annual Summary and Transmittal of U.S. Information Returns
              </h2>
              <p className="text-[10px] text-slate-500">Attach to Form 1099-NEC (Copy A) submissions</p>
            </div>
            <div className="text-right">
              <span className="font-bold font-mono text-xl">{fiscalYear}</span>
              <p className="text-[9px] text-slate-500">OMB No. 1545-0108</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
            <div className="border border-slate-400 p-3 rounded-xs">
              <p className="text-[10px] font-bold text-slate-600 uppercase">Filer's Name & Address</p>
              <p className="font-bold text-sm text-slate-900 mt-1">{company.legalName}</p>
              <p className="text-slate-700">{company.address}</p>
              <p className="text-slate-700">{company.city}, {company.state} {company.zip}</p>
              <p className="text-slate-700 font-mono mt-1">TEL: {company.phone}</p>
            </div>

            <div className="border border-slate-400 p-3 rounded-xs flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Employer Identification Number (EIN)</p>
                <p className="font-mono font-bold text-base text-slate-900 mt-1">{company.ein}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <p className="text-[9px] font-bold text-slate-600 uppercase">Box 3: Total Forms</p>
                  <p className="font-mono font-bold text-sm text-slate-900">{eligibleContractors.length}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-600 uppercase">Box 5: Total Amount</p>
                  <p className="font-mono font-bold text-sm text-slate-900">${totalBox1.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form checkbox row */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={true} readOnly className="h-4 w-4 rounded-none text-slate-900" />
              <span className="font-bold text-slate-900">Form 1099-NEC (Box 71)</span>
            </div>
            <span className="text-[11px] text-slate-600">
              Transmitir al IRS antes del 31 de Enero de {fiscalYear + 1}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};
