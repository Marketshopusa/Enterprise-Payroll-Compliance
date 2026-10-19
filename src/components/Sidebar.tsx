import React from 'react';
import { CompanyProfile, Language, NavTab } from '../types';
import { translations } from '../utils/translations';

interface SidebarProps {
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

export const Sidebar: React.FC<SidebarProps> = ({
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

  const navItems = [
    { id: 'dashboard' as NavTab, label: t.nav.dashboard, icon: 'dashboard' },
    { id: 'contractors' as NavTab, label: t.nav.contractors, icon: 'badge' },
    { id: 'payments' as NavTab, label: t.nav.ledger, icon: 'payments' },
    { id: 'tax-center' as NavTab, label: t.nav.taxCenter, icon: 'receipt_long' },
    { id: 'reportes' as NavTab, label: t.nav.reports, icon: 'analytics' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col justify-between p-4 bg-white border-r border-[#c6c6cd]/40 z-40 select-none overflow-y-auto">
      <div className="flex flex-col gap-4">
        {/* App Header / Logo */}
        <div
          className="flex items-center gap-3 px-2 py-1 cursor-pointer"
          onClick={() => onSelectTab('dashboard')}
        >
          <div className="w-9 h-9 rounded-lg bg-[#000000] flex items-center justify-center text-white shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </div>
          <div className="truncate">
            <span className="text-[17px] font-bold text-[#0b1c30] tracking-tight block truncate">
              {t.appTitle}
            </span>
            <span className="text-[11px] text-[#76777d] block -mt-0.5 truncate">
              {t.appSubtitle}
            </span>
          </div>
        </div>

        {/* Quick Action CTA: Ejecutar Nómina */}
        <button
          onClick={onOpenPayroll}
          className="w-full py-2.5 px-3 rounded-lg bg-[#006c4a] hover:bg-[#005137] text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">payments</span>
          <span>{t.runPayroll}</span>
        </button>

        {/* Main Navigation Menu */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#e5eeff] text-[#0b1c30] font-semibold shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive ? 'text-[#006c4a] material-symbols-fill' : ''
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-[13.5px] leading-snug">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Demo Video Card (from Image 3) */}
        <div
          onClick={onOpenDemoVideo}
          className="mt-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer group"
        >
          <div className="relative w-full h-24 rounded-lg bg-[#131b2e] flex items-center justify-center overflow-hidden mb-2 shadow-inner">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-2xl">play_arrow</span>
            </div>
            <span className="absolute bottom-1.5 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono">
              4:12
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">{t.demoVideo}</p>
              <p className="text-[11px] text-slate-500">{t.demoVideoSub}</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-sm group-hover:text-slate-700">
              open_in_new
            </span>
          </div>
        </div>

        {/* Quick Demo Data Switcher */}
        <div className="p-2 bg-[#f1f5f9] rounded-lg border border-slate-200/80 text-center">
          <button
            onClick={onToggleSampleData}
            className="w-full py-1.5 px-2 rounded text-[11px] font-semibold text-slate-700 hover:text-black bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">
              {hasSampleData ? 'refresh' : 'dataset'}
            </span>
            <span>{hasSampleData ? t.clearToBlank : t.loadSampleData}</span>
          </button>
        </div>
      </div>

      {/* Footer Links & Organization Profile */}
      <div className="pt-3 border-t border-[#c6c6cd]/40 flex flex-col gap-1.5">
        <button
          onClick={() => onSelectTab('settings')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
            currentTab === 'settings'
              ? 'bg-[#e5eeff] text-[#0b1c30] font-semibold'
              : 'text-[#45464d] hover:bg-[#eff4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">settings</span>
          <span className="text-xs">{t.nav.settings}</span>
        </button>

        <button
          onClick={() => onSelectTab('soporte')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
            currentTab === 'soporte'
              ? 'bg-[#e5eeff] text-[#0b1c30] font-semibold'
              : 'text-[#45464d] hover:bg-[#eff4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">help</span>
          <span className="text-xs">{t.nav.support}</span>
        </button>

        {/* Organization Profile Card - Matches Image 1 & 3 */}
        <div
          onClick={onOpenCompanySettings}
          className="mt-1 p-2 rounded-lg bg-[#f8f9ff] flex items-center justify-between border border-[#c6c6cd]/60 cursor-pointer hover:bg-[#eff4ff] transition-colors"
          title={t.configureCompany}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded bg-[#d3e4fe] text-[#0b1c30] font-bold text-xs flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm text-[#76777d]">business</span>
            </div>
            <div className="truncate">
              <p className="text-[11px] text-[#0b1c30] font-semibold truncate">
                {company.isConfigured ? company.legalName : t.companyDefaultName}
              </p>
              <p className="text-[10px] text-[#76777d] truncate font-mono">
                EIN: {company.isConfigured ? company.ein : '00-0000000'}
              </p>
            </div>
          </div>
          <span
            className="material-symbols-outlined text-[#76777d] hover:text-[#0b1c30] text-base shrink-0"
            title={t.configureCompany}
          >
            tune
          </span>
        </div>

        {/* IRS FIRE Status Pill (from Image 3) */}
        <div
          onClick={onToggleIrsFire}
          className="mt-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-between text-[11px] text-slate-700 cursor-pointer transition-colors"
          title="Configurar credenciales del IRS FIRE (Filing Information Returns Electronically)"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                irsFireConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="truncate">
              {irsFireConfigured ? t.irsFireConfigured : t.irsFireNotConfigured}
            </span>
          </div>
          <span className="material-symbols-outlined text-sm text-slate-400">settings</span>
        </div>
      </div>
    </aside>
  );
};
