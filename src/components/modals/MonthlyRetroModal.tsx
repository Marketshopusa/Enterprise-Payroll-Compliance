import React, { useState } from 'react';
import { Contractor, PaymentRecord } from '../../types';

interface MonthlyRetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractors: Contractor[];
  payments: PaymentRecord[];
  fiscalYear: number;
  onSaveMonthlyAmounts: (contractorId: string, monthlyAmounts: number[]) => void;
}

export const MonthlyRetroModal: React.FC<MonthlyRetroModalProps> = ({
  isOpen,
  onClose,
  contractors,
  payments,
  fiscalYear,
  onSaveMonthlyAmounts,
}) => {
  const [selectedContractorId, setSelectedContractorId] = useState<string>(contractors[0]?.id || '');
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // Calculate current monthly amounts for selected contractor
  const getInitialMonthly = (cId: string): number[] => {
    return monthNames.map((_, idx) => {
      const monthNum = (idx + 1).toString().padStart(2, '0');
      return payments
        .filter((p) => p.contractorId === cId && p.date.startsWith(`${fiscalYear}-${monthNum}`))
        .reduce((sum, p) => sum + p.amount, 0);
    });
  };

  const [monthlyValues, setMonthlyValues] = useState<number[]>(() =>
    getInitialMonthly(selectedContractorId)
  );

  if (!isOpen) return null;

  const handleContractorChange = (cId: string) => {
    setSelectedContractorId(cId);
    setMonthlyValues(getInitialMonthly(cId));
  };

  const handleMonthChange = (idx: number, val: string) => {
    const num = parseFloat(val) || 0;
    const next = [...monthlyValues];
    next[idx] = num;
    setMonthlyValues(next);
  };

  const totalYear = monthlyValues.reduce((s, v) => s + v, 0);

  const handleSave = () => {
    if (!selectedContractorId) return;
    onSaveMonthlyAmounts(selectedContractorId, monthlyValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#131b2e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">calendar_view_month</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Entrada Retrospectiva por Mes ({fiscalYear})
              </h2>
              <p className="text-xs text-slate-500">
                Ajuste y consolidación de desembolsos mes a mes para el cierre de ejercicio
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

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Seleccionar Contratista
            </label>
            <select
              value={selectedContractorId}
              onChange={(e) => handleContractorChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
            >
              {contractors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.tinType}: {c.tin})
                </option>
              ))}
            </select>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-800">
                Distribución Mensual de Pagos
              </span>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Anual Acumulado</span>
                <span className="text-base font-bold font-mono text-[#006c4a]">
                  ${totalYear.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {monthNames.map((month, idx) => (
                <div key={month} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="font-bold text-slate-700 block mb-1 text-[11px]">{month} {fiscalYear}</span>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={monthlyValues[idx] || ''}
                      onChange={(e) => handleMonthChange(idx, e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-5 pr-2 py-1 text-xs font-mono font-bold border border-slate-300 rounded focus:outline-none focus:border-slate-800 text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#006c4a] hover:bg-[#005137] text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>Guardar Distribución de Pagos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
