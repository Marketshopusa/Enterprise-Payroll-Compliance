import React from 'react';
import { Contractor } from '../../types';

interface W9ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractor: Contractor | null;
  onSignW9?: (contractorId: string) => void;
}

export const W9ViewModal: React.FC<W9ViewModalProps> = ({
  isOpen,
  onClose,
  contractor,
  onSignW9,
}) => {
  if (!isOpen || !contractor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#131b2e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">verified_user</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Formulario W-9 Oficial en Archivo (IRS)
              </h2>
              <p className="text-xs text-slate-500">
                Request for Taxpayer Identification Number and Certification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Official W-9 Sheet Container */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
          <div className="border-2 border-slate-900 p-5 rounded-xs bg-white text-slate-900">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-2 mb-3 flex justify-between items-start">
              <div>
                <span className="text-2xl font-bold font-heading">Form W-9</span>
                <p className="text-[10px] text-slate-600">(Rev. March 2024) Dept. of the Treasury - IRS</p>
              </div>
              <div className="text-center">
                <span className="text-sm font-bold uppercase tracking-wider block">
                  Request for Taxpayer Identification Number and Certification
                </span>
                <span className="text-[10px] text-slate-500">Give Form to the requester. Do not send to the IRS.</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold">OMB No. 1545-0429</span>
              </div>
            </div>

            {/* Line 1: Name */}
            <div className="border border-slate-900 p-2">
              <p className="text-[9px] uppercase font-bold text-slate-600">
                1 Name of entity/individual (as shown on your income tax return)
              </p>
              <p className="font-bold text-sm text-slate-900 mt-1">{contractor.name}</p>
            </div>

            {/* Line 2: Business Name */}
            <div className="border-x border-b border-slate-900 p-2">
              <p className="text-[9px] uppercase font-bold text-slate-600">
                2 Business name/disregarded entity name, if different from above
              </p>
              <p className="font-semibold text-xs text-slate-800 mt-0.5">
                {contractor.businessName || '— Mismo que el nombre individual —'}
              </p>
            </div>

            {/* Line 3: Tax Classification */}
            <div className="border-x border-b border-slate-900 p-2">
              <p className="text-[9px] uppercase font-bold text-slate-600">
                3 Check appropriate box for federal tax classification
              </p>
              <div className="flex items-center gap-4 mt-1 text-[11px]">
                <label className="flex items-center gap-1.5 font-medium">
                  <input type="checkbox" checked={contractor.tinType === 'SSN'} readOnly />
                  <span>Individual / sole proprietor</span>
                </label>
                <label className="flex items-center gap-1.5 font-medium">
                  <input type="checkbox" checked={contractor.tinType === 'EIN'} readOnly />
                  <span>Limited Liability Company (LLC)</span>
                </label>
                <label className="flex items-center gap-1.5 font-medium text-slate-400">
                  <input type="checkbox" disabled />
                  <span>Corporation</span>
                </label>
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-2 border-x border-b border-slate-900">
              <div className="p-2 border-r border-slate-900">
                <p className="text-[9px] uppercase font-bold text-slate-600">5 Address (number, street, and apt. no.)</p>
                <p className="font-semibold mt-0.5">{contractor.address}</p>
              </div>
              <div className="p-2">
                <p className="text-[9px] uppercase font-bold text-slate-600">6 City, state, and ZIP code</p>
                <p className="font-semibold mt-0.5">{contractor.city}, {contractor.state} {contractor.zip}</p>
              </div>
            </div>

            {/* Part I: Taxpayer Identification Number (TIN) */}
            <div className="mt-3 border-2 border-slate-900 p-3 bg-slate-50">
              <p className="text-xs font-bold uppercase text-slate-900">Part I: Taxpayer Identification Number (TIN)</p>
              <p className="text-[10px] text-slate-600 mt-0.5 mb-2">
                Enter your TIN in the appropriate box. The TIN provided must match the name given on line 1.
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-700 block">Social Security Number</span>
                  <span className="font-mono font-bold text-sm bg-white px-3 py-1 border border-slate-400 rounded-xs block mt-1">
                    {contractor.tinType === 'SSN' ? contractor.tin : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-700 block">Employer Identification Number</span>
                  <span className="font-mono font-bold text-sm bg-white px-3 py-1 border border-slate-400 rounded-xs block mt-1">
                    {contractor.tinType === 'EIN' ? contractor.tin : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Part II: Certification */}
            <div className="mt-3 border-2 border-slate-900 p-3 bg-white">
              <p className="text-xs font-bold uppercase text-slate-900">Part II: Certification</p>
              <p className="text-[10.5px] text-slate-700 mt-1 leading-relaxed">
                Under penalties of perjury, I certify that:
                1. The number shown on this form is my correct taxpayer identification number; and
                2. I am not subject to backup withholding; and
                3. I am a U.S. citizen or other U.S. person.
              </p>

              <div className="mt-3 pt-3 border-t border-slate-300 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Firma Digital Registrada</p>
                  <p className="font-serif italic text-base font-bold text-slate-900">
                    {contractor.w9Status === 'signed' ? contractor.name : 'Pendiente de Firma'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Fecha de Validación</p>
                  <p className="font-mono text-xs font-bold text-slate-800">
                    {contractor.w9SignedDate || 'Pendiente'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {contractor.w9Status === 'pending' && onSignW9 && (
                <button
                  onClick={() => onSignW9(contractor.id)}
                  className="px-4 py-2 bg-[#006c4a] hover:bg-[#005137] text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">draw</span>
                  <span>Firmar y Archivar W-9 Digitalmente</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Imprimir W-9</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-[#131b2e] text-white rounded-lg font-semibold text-xs hover:bg-slate-900 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
