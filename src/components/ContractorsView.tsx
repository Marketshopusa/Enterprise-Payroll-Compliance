import React, { useState } from 'react';
import { Contractor, Language, PaymentRecord } from '../types';
import { translations } from '../utils/translations';

interface ContractorsViewProps {
  contractors: Contractor[];
  payments: PaymentRecord[];
  fiscalYear: number;
  lang: Language;
  onAddContractor: () => void;
  onEditContractor: (contractor: Contractor) => void;
  onDeleteContractor: (id: string) => void;
  onView1099: (contractorId: string) => void;
  onRecordPayment: (contractorId: string) => void;
  onOpenW9Modal: (contractor: Contractor) => void;
}

export const ContractorsView: React.FC<ContractorsViewProps> = ({
  contractors,
  payments,
  fiscalYear,
  lang,
  onAddContractor,
  onEditContractor,
  onDeleteContractor,
  onView1099,
  onRecordPayment,
  onOpenW9Modal,
}) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'signed' | 'pending'>('all');

  const filtered = contractors.filter((c) => {
    const q = search.toLowerCase();
    const match = c.name.toLowerCase().includes(q) || (c.businessName && c.businessName.toLowerCase().includes(q)) || c.tin.includes(q);
    if (!match) return false;
    if (filter === 'signed') return c.w9Status === 'signed';
    if (filter === 'pending') return c.w9Status === 'pending';
    return true;
  });

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-[#f8f9ff]">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight font-heading">
              Directorio de Contratistas 1099
            </h1>
            <p className="text-xs text-[#45464d] mt-1">
              Gestión de beneficiarios independientes, estados de Formulario W-9, validación de TIN y desembolsos acumulados.
            </p>
          </div>

          <button
            onClick={onAddContractor}
            className="px-4 py-2 rounded-lg bg-[#006c4a] hover:bg-[#005137] text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>+ Registrar Nuevo Contratista</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#c6c6cd]/70 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, empresa o TIN..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Todos ({contractors.length})
            </button>
            <button
              onClick={() => setFilter('signed')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                filter === 'signed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              W-9 Firmado ({contractors.filter((c) => c.w9Status === 'signed').length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                filter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              W-9 Pendiente ({contractors.filter((c) => c.w9Status === 'pending').length})
            </button>
          </div>
        </div>

        {/* Contractors Cards Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-[#c6c6cd]">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">badge</span>
            </div>
            <h4 className="font-heading font-semibold text-slate-800 text-sm">
              No se encontraron contratistas
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Añade un contratista independiente para comenzar a asignarle pagos y preparar sus declaraciones 1099.
            </p>
            <button
              onClick={onAddContractor}
              className="mt-4 px-4 py-2 rounded-lg bg-[#006c4a] text-white font-semibold text-xs hover:bg-[#005137] transition-colors cursor-pointer"
            >
              Añadir Contratista
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => {
              const cPayments = payments.filter((p) => p.contractorId === c.id && p.year === fiscalYear);
              const totalYtd = cPayments.reduce((sum, p) => sum + p.amount, 0);
              const isEligible = totalYtd >= 600;

              return (
                <div
                  key={c.id}
                  className="bg-white border border-[#c6c6cd]/70 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e5eeff] text-[#006c4a] font-bold flex items-center justify-center text-base shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#0b1c30]">{c.name}</h3>
                          <p className="text-[11px] text-slate-500">{c.businessName || 'Contratista Individual'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditContractor(c)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteContractor(c.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">{c.tinType}:</span>
                        <span className="font-semibold text-slate-800">{c.tin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ubicación:</span>
                        <span className="truncate max-w-[170px] text-slate-800">
                          {c.city}, {c.state} {c.zip}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="truncate max-w-[170px] text-slate-800">{c.email}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          Total Pagado {fiscalYear}
                        </span>
                        <span className="text-base font-bold font-mono text-[#0b1c30]">
                          ${totalYtd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="text-right">
                        {isEligible ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Elegible 1099
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                            &lt; $600 USD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenW9Modal(c)}
                      className={`text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                        c.w9Status === 'signed' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {c.w9Status === 'signed' ? 'check_circle' : 'pending'}
                      </span>
                      <span>{c.w9Status === 'signed' ? 'W-9 Archivado' : 'W-9 Pendiente'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onRecordPayment(c.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Registrar Pago"
                      >
                        <span className="material-symbols-outlined text-base">payments</span>
                      </button>

                      <button
                        onClick={() => onView1099(c.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                        <span>1099-NEC</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
