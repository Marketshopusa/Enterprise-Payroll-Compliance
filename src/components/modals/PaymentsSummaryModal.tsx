import React from 'react';
import { Contractor, PaymentRecord } from '../../types';

interface PaymentsSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractor: Contractor | null;
  payments: PaymentRecord[];
  fiscalYear: number;
}

export const PaymentsSummaryModal: React.FC<PaymentsSummaryModalProps> = ({
  isOpen,
  onClose,
  contractor,
  payments,
  fiscalYear,
}) => {
  if (!isOpen || !contractor) return null;

  const contractorPayments = payments.filter(
    (p) => p.contractorId === contractor.id && p.year === fiscalYear
  );

  const total = contractorPayments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#131b2e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">table_chart</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Resumen de Pagos: {contractor.name}
              </h2>
              <p className="text-xs text-slate-500">
                Auditoría detallada de desembolsos conciliados para la Casilla 1 ({fiscalYear})
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between border border-[#c6c6cd]/60">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Desembolsado YTD</span>
              <span className="text-xl font-bold font-mono text-[#006c4a]">
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </span>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-white border border-[#c6c6cd]">
              {contractorPayments.length} transacciones registradas
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2 px-3">Fecha</th>
                  <th className="py-2 px-3">Método</th>
                  <th className="py-2 px-3">Memo</th>
                  <th className="py-2 px-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {contractorPayments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 px-3 text-slate-600">{p.date}</td>
                    <td className="py-2 px-3 font-sans">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {p.method}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-700 truncate max-w-[150px]">
                      {p.memo || 'Servicios'}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      ${p.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#131b2e] text-white rounded-lg font-semibold hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Cerrar Resumen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
