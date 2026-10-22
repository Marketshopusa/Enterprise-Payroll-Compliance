import React from 'react';
import { CompanyProfile, Language, NavTab } from '../../types';
import { translations } from '../../utils/translations';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  company: CompanyProfile;
  lang: Language;
  onOpenPayroll: () => void;
  onOpenCompanySettings: () => void;
  onOpenDemoVideo: () => void;
  onToggleSampleData: () => void;
  hasSampleData: boolean;
  irsFireConfigured: boolean;
  onToggleIrsFire: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  company,
  lang,
  onOpenPayroll,
  onOpenCompanySettings,
  onOpenDemoVideo,
  onToggleSampleData,
  hasSampleData,
  irsFireConfigured,
  onToggleIrsFire,
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  const handleNav = (tab: NavTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop touch to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Sheet Content */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto z-10 animate-in slide-in-from-bottom-5 duration-200">
        {/* Drag handle pill */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#000000] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">receipt_long</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900 leading-tight">
                FiscalPay 1099
              </h3>
              <p className="text-[11px] text-slate-500">Menú & Herramientas de Cumplimiento</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quick CTA: Run Payroll */}
        <button
          onClick={() => {
            onClose();
            onOpenPayroll();
          }}
          className="w-full py-3 px-4 rounded-xl bg-[#006c4a] hover:bg-[#005137] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">payments</span>
          <span>{t.runPayroll}</span>
        </button>

        {/* Company Card */}
        <div
          onClick={() => {
            onClose();
            onOpenCompanySettings();
          }}
          className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-[#d3e4fe] text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
              <span className="material-symbols-outlined text-base">business</span>
            </div>
            <div className="truncate">
              <p className="font-bold text-xs text-slate-900 truncate">
                {company.isConfigured ? company.legalName : t.companyDefaultName}
              </p>
              <p className="text-[11px] text-slate-500 font-mono truncate">
                EIN: {company.isConfigured ? company.ein : '00-0000000'}
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-lg">tune</span>
        </div>

        {/* Navigation Grid */}
        <div className="space-y-1 text-xs">
          <button
            onClick={() => handleNav('reportes')}
            className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
              currentTab === 'reportes' ? 'bg-[#e5eeff] text-[#0b1c30] font-bold' : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-lg">analytics</span>
              <span>Reportes & Cierre Anual Form 1096</span>
            </div>
            <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
          </button>

          <button
            onClick={() => handleNav('settings')}
            className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
              currentTab === 'settings' ? 'bg-[#e5eeff] text-[#0b1c30] font-bold' : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-lg">settings</span>
              <span>Configuración Patronal & EIN</span>
            </div>
            <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
          </button>

          <button
            onClick={() => handleNav('soporte')}
            className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
              currentTab === 'soporte' ? 'bg-[#e5eeff] text-[#0b1c30] font-bold' : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-lg">help</span>
              <span>Soporte Técnico & Guía IRS Pub 1179</span>
            </div>
            <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
          </button>
        </div>

        {/* Demo Video Card */}
        <div
          onClick={() => {
            onClose();
            onOpenDemoVideo();
          }}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-slate-700 text-lg">play_circle</span>
            <span className="text-xs font-semibold text-slate-800">Ver Demo Informativo (4 min)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">1080p</span>
        </div>

        {/* IRS FIRE Toggle */}
        <div
          onClick={onToggleIrsFire}
          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <span className={`w-2 h-2 rounded-full ${irsFireConfigured ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            <span className="font-medium text-slate-700 truncate">
              {irsFireConfigured ? 'IRS FIRE: Conectado' : 'IRS FIRE: No configurado'}
            </span>
          </div>
          <span className="material-symbols-outlined text-sm text-slate-400">settings</span>
        </div>

        {/* Sample Data Toggle */}
        <button
          onClick={() => {
            onToggleSampleData();
            onClose();
          }}
          className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">
            {hasSampleData ? 'refresh' : 'dataset'}
          </span>
          <span>{hasSampleData ? 'Limpiar a Plantilla en Blanco' : 'Cargar Datos Demo'}</span>
        </button>
      </div>
    </div>
  );
};
