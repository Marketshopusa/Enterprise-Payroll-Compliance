import React, { useState } from 'react';
import { Contractor, PaymentRecord } from '../../types';

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractors: Contractor[];
  defaultContractorId?: string;
  onSavePayment: (payment: Omit<PaymentRecord, 'id'>) => void;
  fiscalYear: number;
}

export const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({
  isOpen,
  onClose,
  contractors,
  defaultContractorId,
  onSavePayment,
  fiscalYear,
}) => {
  const [contractorId, setContractorId] = useState<string>(
    defaultContractorId || (contractors[0]?.id ?? '')
  );
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(`${fiscalYear}-10-15`);
  const [method, setMethod] = useState<'Check' | 'Zelle' | 'Direct Deposit' | 'Wire' | 'Card'>('Direct Deposit');
  const [reference, setReference] = useState<string>('');
  const [memo, setMemo] = useState<string>('Servicios profesionales independientes');
  const [category, setCategory] = useState<string>('Professional Services');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const chosen = contractors.find((c) => c.id === contractorId);
    if (!chosen) return;

    onSavePayment({
      contractorId,
      contractorName: chosen.name,
      amount: parsedAmount,
      date,
      method,
      reference,
      memo,
      category,
      year: parseInt(date.slice(0, 4)) || fiscalYear,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006c4a] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">payments</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Registrar Pago Manual / Histórico
              </h2>
              <p className="text-xs text-slate-500">Asigna desembolsos que se acumularán en la Casilla 1 del 1099-NEC</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Contratista Beneficiario *
            </label>
            <select
              required
              value={contractorId}
              onChange={(e) => setContractorId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
            >
              {contractors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.tinType}: {c.tin}) {c.businessName ? `— ${c.businessName}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Monto del Desembolso ($ USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fecha del Pago *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Método de Pago</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="Direct Deposit">Direct Deposit (ACH)</option>
                <option value="Check">Cheque Impreso</option>
                <option value="Zelle">Zelle / Transferencia</option>
                <option value="Wire">Wire Transfer</option>
                <option value="Card">Tarjeta Corporativa</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                N° de Referencia / Cheque
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ej. CHK-1092 o TXN-8941"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Categoría Contable</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Design Services, Software Consulting, Legal, etc."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Concepto / Memo</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Descripción del servicio prestado"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
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
              className="px-5 py-2 bg-[#006c4a] hover:bg-[#005137] text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Registrar en Nómina
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
