import React, { useState } from 'react';
import { Contractor, PaymentRecord } from '../../types';
import { downloadFile } from '../../utils/irsEFileGenerator';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractors: Contractor[];
  onImportSuccess: (newPayments: PaymentRecord[], newContractors: Contractor[]) => void;
  fiscalYear: number;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  contractors,
  onImportSuccess,
  fiscalYear,
}) => {
  const [csvText, setCsvText] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const template = `Contratista,TIN_SSN,Fecha,Monto,Metodo,Memo\nElena Rostova,394-82-1940,2024-05-15,3500.00,Direct Deposit,Sprint 3 Design\nNuevo Contratista,123-45-6789,2024-06-20,1200.00,Check,Consulting Services\n`;
    downloadFile(template, 'plantilla_pagos_1099.csv', 'text/csv');
  };

  const loadSampleCsv = () => {
    const sample = `Contratista,TIN_SSN,Fecha,Monto,Metodo,Memo
Elena Rostova,394-82-1940,2024-10-01,3500.00,Direct Deposit,UI Redesign Milestone
Marcos Silva,92-8374612,2024-10-12,2800.00,Wire,API Infrastructure
Patricia Ramos,829-10-4821,2024-08-15,1500.00,Zelle,Marketing Strategy
Roberto Gomez,38-2910392,2024-09-02,4200.00,Check,Electrical Maintenance`;
    setCsvText(sample);
    parseCsv(sample);
  };

  const parseCsv = (text: string) => {
    try {
      setError(null);
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        setParsedRows([]);
        return;
      }

      const rows: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
        if (cols.length >= 4) {
          const name = cols[0];
          const tin = cols[1];
          const date = cols[2];
          const amount = parseFloat(cols[3]);
          const method = cols[4] || 'Direct Deposit';
          const memo = cols[5] || 'Pago consolidado';

          if (name && !isNaN(amount)) {
            rows.push({ name, tin, date, amount, method, memo });
          }
        }
      }
      setParsedRows(rows);
    } catch (err: any) {
      setError('Error al procesar el formato CSV. Asegúrese de separar columnas por comas.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  const handleCommit = () => {
    if (parsedRows.length === 0) return;

    const newPayments: PaymentRecord[] = [];
    const newContractors: Contractor[] = [];

    parsedRows.forEach((row, idx) => {
      // Find or create contractor
      let matchedContractor = contractors.find(
        (c) => c.name.toLowerCase() === row.name.toLowerCase() || (row.tin && c.tin === row.tin)
      );

      if (!matchedContractor) {
        matchedContractor = newContractors.find(
          (c) => c.name.toLowerCase() === row.name.toLowerCase() || (row.tin && c.tin === row.tin)
        );
      }

      let contractorId = matchedContractor?.id;

      if (!contractorId) {
        contractorId = `cont-csv-${Date.now()}-${idx}`;
        const created: Contractor = {
          id: contractorId,
          name: row.name,
          tinType: row.tin && row.tin.includes('-') && row.tin.length === 10 ? 'EIN' : 'SSN',
          tin: row.tin || '000-00-0000',
          address: 'Dirección Comercial Pendiente',
          city: 'San Francisco',
          state: 'CA',
          zip: '94101',
          phone: '(000) 000-0000',
          email: `${row.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
          w9Status: 'pending',
          tinMatched: false,
          secondTinNotice: false,
        };
        newContractors.push(created);
      }

      newPayments.push({
        id: `pay-csv-${Date.now()}-${idx}`,
        contractorId,
        contractorName: row.name,
        amount: row.amount,
        date: row.date || `${fiscalYear}-10-01`,
        method: row.method as any,
        memo: row.memo,
        category: 'Imported Payments',
        year: parseInt((row.date || '').slice(0, 4)) || fiscalYear,
      });
    });

    onImportSuccess(newPayments, newContractors);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#131b2e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">upload_file</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Carga Rápida de Pagos vía Excel / CSV
              </h2>
              <p className="text-xs text-slate-500">
                Importa desembolsos emitidos fuera de la plataforma (Zelle, cheques, transferencias)
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
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-800">
              Arrastra tu archivo o pega contenido CSV
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadSampleCsv}
                className="text-[11px] text-[#006c4a] font-semibold hover:underline cursor-pointer"
              >
                Cargar Datos de Muestra
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-[11px] text-slate-600 font-semibold hover:underline cursor-pointer"
              >
                Descargar Plantilla CSV
              </button>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-file-input"
            />
            <label
              htmlFor="csv-file-input"
              className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-3xl text-slate-400">upload</span>
              <span className="font-semibold text-slate-800">Seleccionar archivo .CSV</span>
              <span className="text-[11px] text-slate-500">Columnas: Contratista, TIN, Fecha, Monto, Método, Memo</span>
            </label>
          </div>

          <div>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                parseCsv(e.target.value);
              }}
              placeholder="O pega aquí directamente las filas de Excel / CSV..."
              className="w-full p-2.5 font-mono text-[11px] border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          {error && <p className="text-red-600 font-medium">{error}</p>}

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800">
                  Previsualización ({parsedRows.length} desembolsos detectados)
                </span>
                <span className="font-mono font-bold text-[#006c4a]">
                  Total: ${parsedRows.reduce((s, r) => s + r.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0">
                    <tr>
                      <th className="py-1.5 px-3">Contratista</th>
                      <th className="py-1.5 px-3">TIN</th>
                      <th className="py-1.5 px-3">Fecha</th>
                      <th className="py-1.5 px-3 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((r, i) => (
                      <tr key={i}>
                        <td className="py-1.5 px-3 font-semibold text-slate-800">{r.name}</td>
                        <td className="py-1.5 px-3 font-mono text-slate-500">{r.tin}</td>
                        <td className="py-1.5 px-3 text-slate-500">{r.date}</td>
                        <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-800">
                          ${r.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
              disabled={parsedRows.length === 0}
              onClick={handleCommit}
              className={`px-5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                parsedRows.length > 0
                  ? 'bg-[#006c4a] hover:bg-[#005137] text-white shadow-xs cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-base">check</span>
              <span>Importar {parsedRows.length} Pagos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
