import React, { useState } from 'react';
import { Contractor, PaymentRecord } from '../../types';

interface RunPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractors: Contractor[];
  onCommitPayroll: (newPayments: PaymentRecord[]) => void;
  fiscalYear: number;
}

export const RunPayrollModal: React.FC<RunPayrollModalProps> = ({
  isOpen,
  onClose,
  contractors,
  onCommitPayroll,
  fiscalYear,
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState<'Direct Deposit' | 'Check' | 'Zelle' | 'Wire'>('Direct Deposit');
  const [memo, setMemo] = useState<string>('Nómina periódica de contratistas independientes');
  const [amounts, setAmounts] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    contractors.forEach((c) => {
      init[c.id] = 0;
    });
    return init;
  });

  if (!isOpen) return null;

  const handleAmountChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    setAmounts((prev) => ({ ...prev, [id]: num }));
  };

  const totalDisbursement = Object.values(amounts).reduce((s, a) => s + a, 0);
  const activePayeesCount = Object.values(amounts).filter((a) => a > 0).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalDisbursement <= 0) return;

    const createdPayments: PaymentRecord[] = [];
    Object.entries(amounts).forEach(([cId, amount]) => {
      if (amount > 0) {
        const contractor = contractors.find((c) => c.id === cId);
        if (contractor) {
          createdPayments.push({
            id: `pay-run-${Date.now()}-${cId}`,
            contractorId: cId,
            contractorName: contractor.name,
            amount,
            date,
            method,
            memo,
            category: 'Contractor Payroll',
            year: parseInt(date.slice(0, 4)) || fiscalYear,
          });
        }
      }
    });

    onCommitPayroll(createdPayments);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006c4a] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">payments</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Ejecución de Nómina 1099
              </h2>
              <p className="text-xs text-slate-500">
                Calcula desembolsos y actualiza de inmediato el balance tributario acumulado
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fecha de Ejecución</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Método de Dispersión</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="Direct Deposit">Direct Deposit (ACH Masivo)</option>
                <option value="Check">Cheques Físicos</option>
                <option value="Zelle">Zelle para Empresas</option>
                <option value="Wire">Wire Transfer Internacional/Doméstico</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Memo del Lote de Nómina</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Contractors Disbursement List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-800">
                Asignación de Montos por Contratista ({contractors.length} registrados)
              </label>
              <span className="text-[11px] text-slate-500">
                {activePayeesCount} contratistas con pago asignado
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-52 overflow-y-auto bg-slate-50">
              {contractors.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  No hay contratistas registrados aún.
                </div>
              ) : (
                contractors.map((c) => (
                  <div key={c.id} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50">
                    <div>
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {c.tinType}: {c.tin} {c.businessName ? `• ${c.businessName}` : ''}
                      </p>
                    </div>

                    <div className="w-36 relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={amounts[c.id] || ''}
                        onChange={(e) => handleAmountChange(c.id, e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-6 pr-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-right text-xs focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-3 bg-[#e5eeff] rounded-xl border border-[#c6c6cd]/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider block">
                Total a Desembolsar en Lote
              </span>
              <span className="text-xl font-bold font-mono text-[#006c4a]">
                ${totalDisbursement.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[11px] text-slate-600 font-medium">
              Actualizará el acumulado YTD en tiempo real
            </span>
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
              type="submit"
              disabled={totalDisbursement <= 0}
              className={`px-5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                totalDisbursement > 0
                  ? 'bg-[#006c4a] hover:bg-[#005137] text-white shadow-xs cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>Confirmar y Ejecutar Desembolso</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
