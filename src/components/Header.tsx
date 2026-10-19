import React, { useState } from 'react';
import { CompanyProfile, Contractor, Language, NavTab } from '../types';
import { translations } from '../utils/translations';

interface HeaderProps {
  currentTab: NavTab;
  company: CompanyProfile;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  fiscalYear: number;
  onFiscalYearChange: (year: number) => void;
  contractors: Contractor[];
  selectedContractorId: string | null;
  onSelectContractor: (id: string | null) => void;
  onBackToDashboard: () => void;
  onOpenManualPayment: () => void;
  onOpenCompanySettings: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  company,
  lang,
  onLanguageChange,
  fiscalYear,
  onFiscalYearChange,
  contractors,
  selectedContractorId,
  onSelectContractor,
  onBackToDashboard,
  onOpenManualPayment,
  onOpenCompanySettings,
  searchQuery,
  onSearchChange,
  onOpenHelp,
}) => {
  const t = translations[lang];
  const [contractorDropdownOpen, setContractorDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const selectedContractor = contractors.find((c) => c.id === selectedContractorId);

  return (
    <header className="flex justify-between items-center w-full h-16 px-6 bg-white border-b border-[#c6c6cd]/50 sticky top-0 z-30 shrink-0 select-none">
      {/* Left section: Breadcrumb or Search depending on view */}
      {currentTab === 'tax-center' ? (
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-lg text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors flex items-center cursor-pointer"
            title="Volver al Dashboard"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div className="h-5 w-px bg-[#c6c6cd]/60"></div>
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[#45464d] hidden sm:flex">
            <span>{t.breadcrumbTaxCenter}</span>
            <span className="text-[#76777d]">/</span>
            <span>{t.breadcrumb1099}</span>
            <span className="text-[#76777d]">/</span>
            <span className="font-semibold text-[#0b1c30]">{t.breadcrumbPreview}</span>
          </div>

          {/* Contractor Dropdown Selector */}
          <div className="relative ml-1">
            <button
              onClick={() => setContractorDropdownOpen(!contractorDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#c6c6cd] hover:border-slate-400 bg-white text-[#0b1c30] shadow-xs transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#76777d] font-bold text-xs shrink-0">
                <span className="material-symbols-outlined text-sm">person_search</span>
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold text-[#0b1c30] leading-none truncate max-w-[140px]">
                  {selectedContractor ? selectedContractor.name : t.selectContractor}
                </span>
                <span className="block text-[10px] text-[#76777d] leading-tight font-mono truncate max-w-[140px]">
                  {selectedContractor ? (selectedContractor.businessName || selectedContractor.tin) : t.noneSelected}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#76777d] text-lg ml-1">
                keyboard_arrow_down
              </span>
            </button>

            {/* Dropdown Menu */}
            {contractorDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Seleccionar Contratista
                </div>
                <button
                  onClick={() => {
                    onSelectContractor(null);
                    setContractorDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                    !selectedContractorId ? 'bg-slate-100 font-semibold text-emerald-800' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-slate-400">edit_note</span>
                    <span>Planilla en Blanco (Editable)</span>
                  </div>
                  {!selectedContractorId && <span className="text-emerald-600 font-bold">✓</span>}
                </button>

                {contractors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectContractor(c.id);
                      setContractorDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      selectedContractorId === c.id ? 'bg-slate-100 font-semibold text-emerald-800' : 'text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <p className="font-semibold text-slate-900 truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        {c.tinType}: {c.tin}
                      </p>
                    </div>
                    {selectedContractorId === c.id && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 flex-1 max-w-md">
          {/* Search bar matching Image 3 */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchContractor}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-[#c6c6cd]/70 focus:border-slate-500 rounded-lg text-xs text-[#0b1c30] placeholder:text-slate-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right controls: Language, Fiscal Year, Profile, Actions */}
      <div className="flex items-center gap-2.5">
        {/* IRS Compliance Tag */}
        {currentTab === 'tax-center' && (
          <div
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eff4ff] text-[10.5px] font-semibold text-[#45464d] border border-[#c6c6cd]/60"
            title="IRS Publication 1179 compliance"
          >
            <span className="material-symbols-outlined text-[13px] text-[#006c4a]">gavel</span>
            <span>{t.irsEnglishNotice}</span>
          </div>
        )}

        {/* Circular Flags Language Selector (Matching screenshot exactly) */}
        <div className="flex items-center p-0.5 rounded-full border border-[#c6c6cd] bg-white shadow-xs gap-0.5">
          {/* Flag ES (Spain) */}
          <button
            onClick={() => onLanguageChange('es')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              lang === 'es'
                ? 'bg-emerald-50 text-[#006c4a] border border-emerald-300 ring-1 ring-emerald-500/20'
                : 'opacity-50 hover:opacity-100'
            }`}
            title="Español (ES)"
          >
            <svg className="w-4 h-4 rounded-full overflow-hidden shadow-xs shrink-0" viewBox="0 0 512 512">
              <path d="M0 0h512v128H0zm0 384h512v128H0z" fill="#c60b1e" />
              <path d="M0 128h512v256H0z" fill="#ffc400" />
            </svg>
          </button>

          {/* Flag US / EN (USA) */}
          <button
            onClick={() => onLanguageChange('en')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-emerald-50 text-[#006c4a] border border-emerald-300 ring-1 ring-emerald-500/20'
                : 'opacity-50 hover:opacity-100'
            }`}
            title="English (US)"
          >
            <svg className="w-4 h-4 rounded-full overflow-hidden shadow-xs shrink-0" viewBox="0 0 512 512">
              <path d="M0 0h512v512H0z" fill="#bd3d44" />
              <path d="M0 55.5h512M0 129.5h512M0 203.5h512M0 277.5h512M0 351.5h512M0 425.5h512" stroke="#fff" strokeWidth="37" />
              <path d="M0 0h240v256H0z" fill="#192f5d" />
              <circle cx="120" cy="128" fill="#fff" opacity="0.8" r="45" />
            </svg>
          </button>
        </div>

        {/* Fiscal Year Selector */}
        <div className="relative">
          <select
            value={fiscalYear}
            onChange={(e) => onFiscalYearChange(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-semibold text-xs border border-[#c6c6cd]/70 cursor-pointer focus:outline-none"
          >
            <option value={2026}>{t.fiscalYear}: 2026 (En Curso)</option>
            <option value={2025}>{t.fiscalYear}: 2025 (Declaración)</option>
            <option value={2024}>{t.fiscalYear}: 2024 (Histórico)</option>
          </select>
        </div>

        {/* Action Button: Registrar Pago Manual (in Tax Center view) or Configurar Empresa (in Dashboard) */}
        {currentTab === 'tax-center' ? (
          <button
            onClick={onOpenManualPayment}
            className="hidden md:flex px-3 py-1.5 rounded-lg border border-[#c6c6cd] bg-white text-[#0b1c30] font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t.recordPayment}
          </button>
        ) : (
          <button
            onClick={onOpenCompanySettings}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#c6c6cd] bg-white text-[#0b1c30] hover:bg-slate-50 text-xs font-semibold shadow-xs cursor-pointer"
          >
            <div className="text-left">
              <span className="block leading-none">{t.configureCompany}</span>
              <span className="block text-[10px] text-slate-500 font-mono">
                {company.isConfigured ? company.ein : t.companyNotConfigured}
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-600 text-sm">business</span>
          </button>
        )}

        <div className="h-5 w-px bg-[#c6c6cd]/60 mx-0.5"></div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-[#45464d] hover:bg-[#eff4ff] relative cursor-pointer"
            title="Notificaciones de Cumplimiento"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-800">
                <span>Notificaciones Fiscales</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-normal">
                  Activas
                </span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="p-2 rounded bg-slate-50 border border-slate-200/60">
                  <p className="font-semibold text-slate-800">Fecha Límite 1099-NEC</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    El plazo oficial de emisión para el año fiscal 2024 vence el 31 de Enero de 2025.
                  </p>
                </div>
                <div className="p-2 rounded bg-amber-50 border border-amber-200/60 text-amber-900">
                  <p className="font-semibold">Revisión W-9 en Proceso</p>
                  <p className="text-[11px] mt-0.5">
                    Asegúrese de contar con firmas de W-9 antes de generar el lote final.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-lg text-[#45464d] hover:bg-[#eff4ff] cursor-pointer"
          title="Ayuda y Publicaciones IRS"
        >
          <span className="material-symbols-outlined text-xl">help_outline</span>
        </button>

        {/* Profile Avatar */}
        <div
          onClick={onOpenCompanySettings}
          className="flex items-center gap-2 ml-1 cursor-pointer"
          title="Usuario Administrador"
        >
          <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#0b1c30] flex items-center justify-center font-bold text-xs border border-[#c6c6cd]">
            <span className="material-symbols-outlined text-base text-[#76777d]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
