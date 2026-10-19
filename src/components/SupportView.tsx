import React from 'react';
import { Language } from '../types';

interface SupportViewProps {
  lang: Language;
}

export const SupportView: React.FC<SupportViewProps> = () => {
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-[#f8f9ff]">
      <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight font-heading">
            Centro de Ayuda & Normativa Fiscal IRS 1099-NEC
          </h1>
          <p className="text-xs text-[#45464d] mt-1">
            Guía oficial de especificaciones IRS Publication 1179, preguntas frecuentes y soporte técnico especializado.
          </p>
        </div>

        {/* Regulatory Guidelines Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-5 shadow-xs">
            <span className="material-symbols-outlined text-[#006c4a] text-2xl mb-2">gavel</span>
            <h3 className="font-heading font-bold text-sm text-[#0b1c30]">IRS Publication 1179</h3>
            <p className="text-xs text-[#45464d] mt-1">
              Cat. No. 74162Z: Especificaciones técnicas oficiales para la impresión y formato de sustitutos del Formulario 1099-NEC.
            </p>
          </div>

          <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-5 shadow-xs">
            <span className="material-symbols-outlined text-[#0b1c30] text-2xl mb-2">event_available</span>
            <h3 className="font-heading font-bold text-sm text-[#0b1c30]">Plazo Límite Legal (Año Fiscal 2026)</h3>
            <p className="text-xs text-[#45464d] mt-1">
              <strong>31 de Enero de 2027</strong> es la fecha límite obligatoria tanto para entregar la Copia B al beneficiario como para transmitir la Copia A al IRS / SSA (o 31 de Enero de 2026 para el ejercicio 2025).
            </p>
          </div>

          <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-5 shadow-xs">
            <span className="material-symbols-outlined text-[#006c4a] text-2xl mb-2">verified</span>
            <h3 className="font-heading font-bold text-sm text-[#0b1c30]">1099-NEC (Contratistas) vs W-2 (Empleados)</h3>
            <p className="text-xs text-[#45464d] mt-1">
              Para evitar sanciones contables por clasificación errónea: el <strong>Formulario 1099-NEC</strong> es exclusivo para contratistas independientes, mientras que el <strong>Formulario W-2</strong> es obligatorio para empleados de nómina con retenciones FICA.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-xl border border-[#c6c6cd]/70 shadow-xs p-6 space-y-4">
          <h2 className="font-heading font-bold text-base text-[#0b1c30] border-b border-slate-100 pb-3">
            Preguntas Frecuentes de Contabilidad y Cierre Fiscal
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
              <p className="font-bold text-slate-900 text-xs">
                ¿Por qué el Formulario 1099-NEC se mantiene en inglés oficial?
              </p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                De acuerdo con la reglamentación del Departamento del Tesoro de EE.UU. (IRS Publication 1179), todos los formularios fiscales oficiales que se entregan al contratista o se remiten al IRS deben conservar la redacción, encabezados y títulos en el inglés estandarizado oficial para su validez legal. La plataforma ofrece interfaz y asistencia en español, preservando la fidelidad legal de la planilla.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
              <p className="font-bold text-slate-900 text-xs">
                ¿Qué diferencia existe entre Copy A, Copy B y Copy C?
              </p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                • <strong>Copy A:</strong> Es la copia oficial para el IRS impresa en tinta roja especial o transmitida electrónicamente vía FIRE/IRIS.
                <br />
                • <strong>Copy B:</strong> Es la copia que debe entregarse al contratista independiente antes del 31 de Enero.
                <br />
                • <strong>Copy C:</strong> Es la copia para los archivos de la empresa pagadora, que debe conservarse por un mínimo de 4 años.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
              <p className="font-bold text-slate-900 text-xs">
                ¿Cómo funciona la transmisión electrónica IRS FIRE?
              </p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                El sistema genera automáticamente el archivo .TXT con estructura fija de 750 caracteres (registros T, A, B, C y F) bajo la Publicación 1220. Este archivo puede subirse directamente al portal FIRE (Filing Information Returns Electronically) del IRS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
