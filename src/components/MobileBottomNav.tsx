import React from 'react';
import { NavTab } from '../types';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
}) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: 'dashboard' },
    { id: 'contractors' as NavTab, label: 'Contratistas', icon: 'badge' },
    { id: 'payments' as NavTab, label: 'Nómina', icon: 'payments' },
    { id: 'tax-center' as NavTab, label: 'Planillas', icon: 'receipt_long' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around safe-area-pb">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer relative ${
              isActive ? 'text-[#006c4a]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                isActive ? 'bg-emerald-50 text-[#006c4a]' : ''
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? 'material-symbols-fill' : ''
                }`}
              >
                {tab.icon}
              </span>
            </div>
            <span
              className={`text-[10px] font-semibold tracking-tight mt-0.5 leading-none ${
                isActive ? 'text-[#006c4a] font-bold' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}

      {/* Menu / More Button */}
      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
      >
        <div className="w-9 h-7 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </div>
        <span className="text-[10px] font-semibold tracking-tight mt-0.5 leading-none">
          Más
        </span>
      </button>
    </nav>
  );
};
