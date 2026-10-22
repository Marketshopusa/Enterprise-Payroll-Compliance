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
  onOpenMobileMenu?: () => void;
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
  onOpenMobileMenu,
}) => {
  const t = translations[lang];
  const [contractorDropdownOpen, setContractorDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const selectedContractor = contractors.find((c) => c.id === selectedContractorId);

  return (
    <header className="flex justify-between items-center w-full h-14 sm:h-16 px-3 sm:px-6 bg-white border-b border-[#c6c6cd]/50 sticky top-0 z-30 shrink-0 select-none">
      {/* Left section */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Menu Icon */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
          title="Abrir Menú"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        {/* Mobile Logo Brand */}
        <div
          onClick={onBackToDashboard}
          className="md:hidden flex items-center gap-1.5 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-base">receipt_long</span>
          </div>
          <span className="font-heading font-extrabold text-sm text-[#0b1c30] tracking-tight">
            FiscalPay
          </span>
        </div>

        {currentTab === 'tax-center' ? (
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-1.5 rounded-lg text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors flex items-center cursor-pointer"
              title="Volver al Dashboard"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="h-5 w-px bg-[#c6c6cd]/60"></div>
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-[#45464d] hidden lg:flex">
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
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#c6c6cd] hover:border-slate-400 bg-white text-[#0b1c30] shadow-xs transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#76777d] font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-xs">person_search</span>
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#0b1c30] leading-none truncate max-w-[120px]">
                    {selectedContractor ? selectedContractor.name : t.selectContractor}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#76777d] text-base ml-0.5">
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
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-sm">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchContractor}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-[#c6c6cd]/70 focus:border-slate-500 rounded-lg text-xs text-[#0b1c30] placeholder:text-slate-400 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Circular Flags Language Selector */}
        <div className="flex items-center p-0.5 rounded-full border border-[#c6c6cd] bg-white shadow-xs gap-0.5">
          <button
            onClick={() => onLanguageChange('es')}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              lang === 'es'
                ? 'bg-emerald-50 text-[#006c4a] border border-emerald-300 ring-1 ring-emerald-500/20'
                : 'opacity-50 hover:opacity-100'
            }`}
            title="Español (ES)"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full overflow-hidden shadow-xs shrink-0" viewBox="0 0 512 512">
              <path d="M0 0h512v128H0zm0 384h512v128H0z" fill="#c60b1e" />
              <path d="M0 128h512v256H0z" fill="#ffc400" />
            </svg>
          </button>

          <button
            onClick={() => onLanguageChange('en')}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-emerald-50 text-[#006c4a] border border-emerald-300 ring-1 ring-emerald-500/20'
                : 'opacity-50 hover:opacity-100'
            }`}
            title="English (US)"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full overflow-hidden shadow-xs shrink-0" viewBox="0 0 512 512">
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
            className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-semibold text-[11px] sm:text-xs border border-[#c6c6cd]/70 cursor-pointer focus:outline-none"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
          </select>
        </div>

        {/* Action Button: Desktop only */}
        {currentTab === 'tax-center' ? (
          <button
            onClick={onOpenManualPayment}
            className="hidden lg:flex px-3 py-1.5 rounded-lg border border-[#c6c6cd] bg-white text-[#0b1c30] font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t.recordPayment}
          </button>
        ) : (
          <button
            onClick={onOpenCompanySettings}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#c6c6cd] bg-white text-[#0b1c30] hover:bg-slate-50 text-xs font-semibold shadow-xs cursor-pointer"
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

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-lg text-[#45464d] hover:bg-[#eff4ff] relative cursor-pointer"
            title="Notificaciones"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-800">
                <span>Notificaciones Fiscales</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-normal">
                  Activas
                </span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="p-2 rounded bg-slate-50 border border-slate-200/60">
                  <p className="font-semibold text-slate-800">Fecha Límite IRS 1099-NEC / W-2</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    El plazo oficial de emisión para el año fiscal {fiscalYear} vence el 31 de Enero de {fiscalYear + 1}.
                  </p>
                </div>
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200/60 text-emerald-900">
                  <p className="font-semibold">Plantillas Oficiales Listas</p>
                  <p className="text-[11px] mt-0.5">
                    Formatos 1099-NEC (Cat. 74162Z) y W-2 (Cat. 10134D) disponibles para descarga e impresión.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          onClick={onOpenHelp}
          className="hidden sm:block p-1.5 rounded-lg text-[#45464d] hover:bg-[#eff4ff] cursor-pointer"
          title="Ayuda"
        >
          <span className="material-symbols-outlined text-xl">help_outline</span>
        </button>

        {/* Profile Avatar */}
        <div
          onClick={onOpenCompanySettings}
          className="flex items-center gap-1.5 cursor-pointer ml-0.5"
          title="Configurar Empresa"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#eff4ff] text-[#0b1c30] flex items-center justify-center font-bold text-xs border border-[#c6c6cd]">
            <span className="material-symbols-outlined text-sm sm:text-base text-[#76777d]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
