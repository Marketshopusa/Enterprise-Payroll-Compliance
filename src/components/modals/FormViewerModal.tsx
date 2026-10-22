import React, { useState, useEffect } from 'react';
import { ActiveFormTaxType, CopyType, Form1099Data, FormW2Data } from '../../types';
import { Irs1099Form } from '../Irs1099Form';
import { IrsW2Form } from '../IrsW2Form';

interface FormViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFormType: ActiveFormTaxType;
  setActiveFormType: (type: ActiveFormTaxType) => void;
  copyType: CopyType;
  setCopyType: (copy: CopyType) => void;
  formData: Form1099Data;
  on1099Change: (field: keyof Form1099Data, value: any) => void;
  w2FormData: FormW2Data;
  onW2Change: (field: keyof FormW2Data, value: any) => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  contractorName?: string;
  fiscalYear: number;
}

export const FormViewerModal: React.FC<FormViewerModalProps> = ({
  isOpen,
  onClose,
  activeFormType,
  setActiveFormType,
  copyType,
  setCopyType,
  formData,
  on1099Change,
  w2FormData,
  onW2Change,
  onPrint,
  onDownloadPdf,
  contractorName,
  fiscalYear,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Auto-fit to mobile screen width on open
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined') {
        const screenWidth = window.innerWidth;
        if (screenWidth < 640) {
          // mobile phone: 880px form needs ~40-45% zoom to fit without overflow
          const fitZoom = Math.max(38, Math.floor((screenWidth - 24) / 880 * 100));
          setZoomLevel(fitZoom);
        } else if (screenWidth < 1024) {
          setZoomLevel(75);
        } else {
          setZoomLevel(100);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFitScreen = () => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      const fitZoom = screenWidth < 640
        ? Math.max(38, Math.floor((screenWidth - 24) / 880 * 100))
        : screenWidth < 1024 ? 75 : 100;
      setZoomLevel(fitZoom);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#f8f9ff] w-full h-full sm:h-[95vh] sm:max-w-6xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Top Header (Mobile Native Optimized) */}
        <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#131b2e] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">receipt_long</span>
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 font-heading truncate">
                  Planilla Oficial IRS ({fiscalYear})
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {activeFormType}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {contractorName || 'Plantilla en Blanco / Sin Asignar'}
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="px-3 py-1.5 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
              title="Imprimir Formulario Oficial"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span className="hidden sm:inline">Imprimir Oficial</span>
            </button>

            <button
              onClick={onDownloadPdf}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Descargar PDF"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span className="hidden md:inline">PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Cerrar Planilla"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Secondary Bar: Form Switcher & Copy Tabs & Zoom */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs shrink-0">
          {/* Form Switcher */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-300 shadow-2xs">
            <button
              onClick={() => setActiveFormType('1099-NEC')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                activeFormType === '1099-NEC'
                  ? 'bg-[#131b2e] text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              1099-NEC
            </button>
            <button
              onClick={() => setActiveFormType('W-2')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                activeFormType === 'W-2'
                  ? 'bg-[#006c4a] text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              W-2 Empleados
            </button>
          </div>

          {/* Copy Selector */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-300">
            <button
              onClick={() => setCopyType('Copy B')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                copyType === 'Copy B' ? 'bg-[#eff4ff] text-[#006c4a] font-bold' : 'text-slate-500'
              }`}
            >
              Copy B
            </button>
            <button
              onClick={() => setCopyType('Copy A')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                copyType === 'Copy A' ? 'bg-red-50 text-[#c60b1e] font-bold' : 'text-slate-500'
              }`}
            >
              Copy A (IRS)
            </button>
            <button
              onClick={() => setCopyType('Copy C')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                copyType === 'Copy C' ? 'bg-slate-200 text-slate-800 font-bold' : 'text-slate-500'
              }`}
            >
              Copy C
            </button>
          </div>

          {/* Zoom and Fit Controls */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300 text-[11px]">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 35))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
              title="Alejar"
            >
              <span className="material-symbols-outlined text-sm">zoom_out</span>
            </button>

            <span className="px-1.5 font-mono font-bold text-slate-700 min-w-[42px] text-center">
              {zoomLevel}%
            </span>

            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
              title="Acercar"
            >
              <span className="material-symbols-outlined text-sm">zoom_in</span>
            </button>

            <button
              onClick={handleFitScreen}
              className="ml-1 px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-700 text-[10px] cursor-pointer"
              title="Ajustar al ancho de pantalla"
            >
              Ajustar
            </button>
          </div>
        </div>

        {/* Modal Scrollable Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-start justify-center bg-slate-200/60">
          <div className="transition-transform duration-100">
            {activeFormType === '1099-NEC' ? (
              <Irs1099Form
                formData={formData}
                onChange={on1099Change}
                copyType={copyType}
                zoomLevel={zoomLevel}
              />
            ) : (
              <IrsW2Form
                formData={w2FormData}
                onChange={onW2Change}
                copyType={copyType}
                zoomLevel={zoomLevel}
              />
            )}
          </div>
        </div>

        {/* Modal Footer Tip */}
        <div className="px-4 py-2 bg-white border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-between">
          <span className="hidden sm:inline">
            💡 Puedes editar directamente cualquier casilla del formulario o seleccionar un perfil de contratista.
          </span>
          <span className="sm:hidden font-semibold text-slate-700">
            Desliza para explorar todos los campos
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
