import React, { useState } from 'react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Paso 1: Configurar Empresa Pagadora & EIN',
      desc: 'Introduce la razón social y número de identificación patronal (EIN) de tu empresa en Configuración o en la barra superior.',
      time: '0:45',
    },
    {
      title: 'Paso 2: Registrar Contratistas y Formularios W-9',
      desc: 'Carga tus contratistas independientes con su SSN/EIN verificado para asegurar cumplimiento legal ante el IRS.',
      time: '1:30',
    },
    {
      title: 'Paso 3: Carga Rápida o Registro de Pagos',
      desc: 'Importa tus pagos anuales vía Excel/CSV, nómina masiva o entrada retrospectiva mes a mes.',
      time: '2:40',
    },
    {
      title: 'Paso 4: Previsualización, Impresión & Exportación IRS FIRE',
      desc: 'Genera las copias oficiales Copy B para el contratista, Copy A en tinta roja oficial del IRS y exporta el archivo TXT para transmisión.',
      time: '4:12',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#131b2e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">play_circle</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Demo Informativo: Cierre Fiscal 1099-NEC
              </h2>
              <p className="text-xs text-slate-500">Guía práctica paso a paso para el cumplimiento de nómina empresarial</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="p-6 space-y-4">
          <div className="relative w-full aspect-video bg-[#0b1c30] rounded-xl overflow-hidden flex flex-col items-center justify-center text-white border border-slate-800 shadow-inner group">
            {!isPlaying ? (
              <div className="text-center p-6 flex flex-col items-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 rounded-full bg-[#006c4a] hover:bg-emerald-600 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer mb-3"
                >
                  <span className="material-symbols-outlined text-3xl text-white">play_arrow</span>
                </button>
                <h3 className="font-heading font-bold text-lg">FiscalPay 1099 Walkthrough</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Aprende a conciliar la Casilla 1, archivar formularios W-9 y exportar archivos planos para el IRS FIRE System.
                </p>
                <span className="mt-3 px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono text-emerald-300 border border-emerald-500/30">
                  Duración: 4 minutos 12 segundos • 1080p
                </span>
              </div>
            ) : (
              <div className="w-full h-full p-6 flex flex-col justify-between bg-slate-900/90 animate-in fade-in">
                <div className="flex justify-between items-center text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold uppercase text-[10px]">
                    Reproduciendo Demo
                  </span>
                  <span className="font-mono text-slate-400">{steps[activeStep].time} / 4:12</span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    {steps[activeStep].title}
                  </p>
                  <p className="text-sm text-slate-200 mt-1">{steps[activeStep].desc}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                    disabled={activeStep === 0}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold disabled:opacity-30 cursor-pointer"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="p-2 rounded-full hover:bg-white/10 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl">pause</span>
                  </button>
                  <button
                    onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
                    disabled={activeStep === steps.length - 1}
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold disabled:opacity-30 cursor-pointer"
                  >
                    Siguiente Paso
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Steps list */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveStep(idx);
                  setIsPlaying(true);
                }}
                className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                  activeStep === idx && isPlaying
                    ? 'border-[#006c4a] bg-emerald-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 block font-mono">{step.time}</span>
                <span className="text-[11px] font-semibold text-slate-800 line-clamp-1">{step.title}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Cerrar Guía
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
