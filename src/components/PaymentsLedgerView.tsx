import React, { useState } from 'react';
import { Contractor, Language, PaymentRecord } from '../types';
import { translations } from '../utils/translations';
import { downloadFile } from '../utils/irsEFileGenerator';

interface PaymentsLedgerViewProps {
  payments: PaymentRecord[];
  contractors: Contractor[];
  fiscalYear: number;
  lang: Language;
  onOpenManualPayment: () => void;
  onDeletePayment: (id: string) => void;
}

export const PaymentsLedgerView: React.FC<PaymentsLedgerViewProps> = ({
  payments,
  contractors,
  fiscalYear,
  lang,
  onOpenManualPayment,
  onDeletePayment,
}) => {
  const t = translations[lang];
  const [selectedContractor, setSelectedContractor] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  const yearPayments = payments.filter((p) => p.year === fiscalYear);

  const filteredPayments = yearPayments.filter((p) => {
    if (selectedContractor !== 'all' && p.contractorId !== selectedContractor) return false;
    if (selectedMethod !== 'all' && p.method !== selectedMethod) return false;
    return true;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleExportCsv = () => {
    let csv = 'ID,Contratista,Fecha,Monto,Metodo,Referencia,Memo,Categoria,Año Fiscal\n';
    filteredPayments.forEach((p) => {
      csv += `"${p.id}","${p.contractorName}","${p.date}",${p.amount},"${p.method}","${p.reference || ''}","${p.memo || ''}","${p.category}",${p.year}\n`;
    });
    downloadFile(csv, `FiscalPay_Libro_Pagos_${fiscalYear}.csv`, 'text/csv');
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-[#f8f9ff]">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight font-heading">
              Libro de Pagos y Nómina {fiscalYear}
            </h1>
            <p className="text-xs text-[#45464d] mt-1">
              Registro contable de todas las transferencias, cheques, depósitos directos y desembolsos a contratistas independientes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-lg border border-[#c6c6cd] bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={onOpenManualPayment}
              className="px-4 py-2 rounded-lg bg-[#006c4a] hover:bg-[#005137] text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_card</span>
              <span>Registrar Pago</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-[#c6c6cd]/70 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Contratista
              </label>
              <select
                value={selectedContractor}
                onChange={(e) => setSelectedContractor(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
              >
                <option value="all">Todos los Contratistas</option>
                {contractors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Método de Pago
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
              >
                <option value="all">Todos los Métodos</option>
                <option value="Direct Deposit">Direct Deposit (ACH)</option>
                <option value="Check">Cheque Impreso</option>
                <option value="Zelle">Zelle / Transferencia Rápida</option>
                <option value="Wire">Wire Transfer</option>
                <option value="Card">Tarjeta Corporativa</option>
              </select>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Total Filtrado</span>
            <span className="text-lg font-bold font-mono text-[#006c4a]">
              ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl border border-[#c6c6cd]/70 shadow-xs overflow-hidden">
          {filteredPayments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <h4 className="font-heading font-semibold text-slate-800 text-sm">
                No hay pagos registrados para este filtro
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Registra cheques, transferencias bancarias o Zelle para acumular montos en la Casilla 1 del 1099-NEC.
              </p>
              <button
                onClick={onOpenManualPayment}
                className="mt-4 px-4 py-2 rounded-lg bg-[#006c4a] text-white font-semibold text-xs hover:bg-[#005137] transition-colors cursor-pointer"
              >
                Registrar Pago Ahora
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Contratista</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4">Concepto / Memo</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4 text-right">Monto</th>
                    <th className="py-3 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                        {p.date}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {p.contractorName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {p.method}
                          {p.reference && <span className="font-mono text-[10px] text-slate-500">({p.reference})</span>}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {p.memo || 'Pago de servicios profesionales'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onDeletePayment(p.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                          title="Eliminar registro de pago"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
