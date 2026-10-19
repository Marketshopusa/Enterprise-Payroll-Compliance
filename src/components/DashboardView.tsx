import React, { useState } from 'react';
import { Contractor, Language, PaymentRecord } from '../types';
import { translations } from '../utils/translations';

interface DashboardViewProps {
  contractors: Contractor[];
  payments: PaymentRecord[];
  fiscalYear: number;
  lang: Language;
  onNavigateToTaxCenter: (contractorId?: string) => void;
  onOpenManualPayment: (contractorId?: string) => void;
  onOpenCsvImport: () => void;
  onOpenRetroModal: () => void;
  onOpenBatch1099: () => void;
  onOpenAddContractor: () => void;
  searchQuery: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  contractors,
  payments,
  fiscalYear,
  lang,
  onNavigateToTaxCenter,
  onOpenManualPayment,
  onOpenCsvImport,
  onOpenRetroModal,
  onOpenBatch1099,
  onOpenAddContractor,
  searchQuery,
}) => {
  const t = translations[lang];
  const [filterTab, setFilterTab] = useState<'all' | 'eligible' | 'w9pending'>('all');
  const [revealedTins, setRevealedTins] = useState<Record<string, boolean>>({});

  // Filter payments by current fiscal year
  const yearPayments = payments.filter((p) => p.year === fiscalYear);
  const totalYtd = yearPayments.reduce((acc, p) => acc + p.amount, 0);

  // Calculate contractor totals for the year
  const contractorTotals = contractors.map((c) => {
    const total = yearPayments
      .filter((p) => p.contractorId === c.id)
      .reduce((sum, p) => sum + p.amount, 0);
    const count = yearPayments.filter((p) => p.contractorId === c.id).length;
    return {
      contractor: c,
      total,
      count,
      isEligible: total >= 600,
    };
  });

  const eligibleCount = contractorTotals.filter((c) => c.isEligible).length;
  const registeredCount = contractors.length;
  const w9PendingCount = contractors.filter((c) => c.w9Status === 'pending').length;

  // Monthly disbursement data (Jan to Dec)
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthlyData = monthNames.map((name, index) => {
    const monthNum = (index + 1).toString().padStart(2, '0');
    const amount = yearPayments
      .filter((p) => p.date.startsWith(`${fiscalYear}-${monthNum}`))
      .reduce((sum, p) => sum + p.amount, 0);
    return { name, amount };
  });

  const maxMonthAmount = Math.max(...monthlyData.map((m) => m.amount), 1);

  // Filter contractors table
  const filteredList = contractorTotals.filter(({ contractor, isEligible }) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = contractor.name.toLowerCase().includes(q);
      const matchBiz = contractor.businessName?.toLowerCase().includes(q);
      const matchTin = contractor.tin.includes(q);
      if (!matchName && !matchBiz && !matchTin) return false;
    }

    if (filterTab === 'eligible') return isEligible;
    if (filterTab === 'w9pending') return contractor.w9Status === 'pending';
    return true;
  });

  const toggleTinReveal = (id: string) => {
    setRevealedTins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatTin = (tin: string, isRevealed: boolean, tinType: string) => {
    if (isRevealed) return tin;
    if (tinType === 'SSN') return '•••-••-' + tin.slice(-4);
    return '••-•••' + tin.slice(-4);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-[#f8f9ff]">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Header / Subheader (Image 3) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                {t.dashboardTag.split('•')[0]}
              </span>
              <span className="text-[#c6c6cd]">•</span>
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-100 text-emerald-800">
                {t.dashboardTag.split('•')[1] || 'Periodo Abierto'}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0b1c30] tracking-tight mt-1 font-heading">
              {t.dashboardTitle} {fiscalYear}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenManualPayment()}
              className="px-3.5 py-2 rounded-lg border border-[#c6c6cd] bg-white hover:bg-slate-50 text-[#0b1c30] font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>{t.btnRecordPayment}</span>
            </button>

            <button
              onClick={onOpenBatch1099}
              className="px-4 py-2 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>{t.btnBatch1099}</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards (Image 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Total Pagado YTD */}
          <div className="bg-white border border-[#c6c6cd]/60 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#45464d]">{t.kpiYtd} ({fiscalYear})</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-base">payments</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl lg:text-3xl font-bold font-heading text-[#0b1c30] tracking-tight">
                ${totalYtd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-[#76777d] mt-1 flex items-center gap-1">
                {totalYtd === 0 ? (
                  <span>— {t.kpiYtdSub} (0 {translations[lang].nav.contractors.toLowerCase()})</span>
                ) : (
                  <span className="text-emerald-700 font-semibold">
                    ✓ {yearPayments.length} desembolsos ({contractors.filter((c) => yearPayments.some((p) => p.contractorId === c.id)).length} contratistas)
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* KPI 2: Planillas 1099 Elegibles (≥$600) */}
          <div className="bg-white border border-[#c6c6cd]/60 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#45464d]">{t.kpiEligible}</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-base">fact_check</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl lg:text-3xl font-bold font-heading text-[#0b1c30] tracking-tight">
                {eligibleCount}{' '}
                <span className="text-sm font-normal text-slate-500">
                  / {registeredCount} Contratistas
                </span>
              </p>
              <div className="text-[11px] text-[#76777d] mt-1 flex items-center justify-between">
                <span>{t.kpiLegalThreshold}</span>
                <span className="font-semibold text-slate-700">
                  {eligibleCount > 0 ? `${eligibleCount} listos` : 'Sin registros'}
                </span>
              </div>
            </div>
          </div>

          {/* KPI 3: Cumplimiento W-9 & SSN */}
          <div className="bg-white border border-[#c6c6cd]/60 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#45464d]">{t.kpiW9Compliance}</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-base">verified_user</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl lg:text-3xl font-bold font-heading text-[#0b1c30] tracking-tight">
                  {registeredCount}
                </p>
                <span className="text-sm font-semibold text-slate-700">{t.kpiRegistered}</span>
                {w9PendingCount > 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {w9PendingCount} {t.kpiPending}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#76777d] mt-1">
                {w9PendingCount === 0
                  ? '• Sin contratistas pendientes'
                  : `• ${w9PendingCount} contratistas requieren solicitud W-9`}
              </p>
            </div>
          </div>

          {/* KPI 4: Calendario Fiscal IRS */}
          <div className="bg-white border border-[#c6c6cd]/60 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#45464d]">{t.kpiCalendar}</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-base">calendar_month</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl lg:text-3xl font-bold font-heading text-[#0b1c30] tracking-tight">
                31 Ene {fiscalYear + 1}
              </p>
              <div className="text-[11px] text-[#76777d] mt-1 flex items-center justify-between">
                <span>{t.kpiDeadline}</span>
                <span className="text-emerald-700 font-semibold cursor-pointer hover:underline">
                  {t.configureDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Upload / Actions Banner (Image 3) */}
        <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#e5eeff] text-[#006c4a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#0b1c30]">
                {t.quickUploadTitle}
              </h3>
              <p className="text-xs text-[#45464d] mt-0.5 max-w-2xl leading-relaxed">
                {t.quickUploadDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenCsvImport}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-lg border border-[#c6c6cd] bg-white hover:bg-slate-50 text-[#0b1c30] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              <span>{t.btnImportCsv}</span>
            </button>

            <button
              onClick={onOpenRetroModal}
              className="flex-1 md:flex-initial px-4 py-2 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">view_timeline</span>
              <span>{t.btnRetroEntry}</span>
            </button>
          </div>
        </div>

        {/* Monthly Disbursement Distribution Chart (Image 3) */}
        <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-100 gap-2">
            <span className="text-xs font-bold text-[#45464d] uppercase tracking-wider">
              {t.monthlyDistribution} (${totalYtd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ACUMULADOS)
            </span>
            <span className="text-xs text-[#76777d]">
              {totalYtd === 0 ? t.noActivity : `${yearPayments.length} pagos registrados en ${fiscalYear}`}
            </span>
          </div>

          {totalYtd === 0 ? (
            <div className="my-6 py-12 px-4 rounded-xl border border-dashed border-[#c6c6cd] bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#eff4ff] text-[#76777d] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-xl">bar_chart</span>
              </div>
              <p className="font-heading font-bold text-sm text-[#0b1c30]">
                $0.00 {t.accumulatedDisbursements}
              </p>
              <p className="text-xs text-[#76777d] max-w-md mt-1">
                {t.disbursementsSubtext}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => onOpenManualPayment()}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#c6c6cd] hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-xs cursor-pointer"
                >
                  Registrar Primer Pago
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <div className="grid grid-cols-12 gap-2 h-44 items-end pt-4 px-2">
                {monthlyData.map((item) => {
                  const heightPercent = item.amount > 0 ? Math.max((item.amount / maxMonthAmount) * 100, 10) : 4;
                  return (
                    <div key={item.name} className="flex flex-col items-center gap-1 group relative">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-mono shadow-md pointer-events-none transition-opacity z-10 whitespace-nowrap">
                        {item.name}: ${item.amount.toLocaleString('en-US')}
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full bg-slate-100 rounded-t h-32 flex items-end overflow-hidden">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full transition-all duration-500 rounded-t ${
                            item.amount > 0 ? 'bg-gradient-to-t from-[#006c4a] to-emerald-400' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 mt-1">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {item.amount > 0 ? `$${(item.amount / 1000).toFixed(1)}k` : '$0'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Resumen de Contratistas y Estado Fiscal 2024 Table (Image 3) */}
        <div className="bg-white border border-[#c6c6cd]/70 rounded-xl shadow-xs overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2.5">
              <h3 className="font-heading font-bold text-base text-[#0b1c30]">
                {t.contractorsSummaryTitle} {fiscalYear}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eff4ff] text-[#0b1c30] border border-[#c6c6cd]/50">
                {contractors.length} {t.registeredCount}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Filter Tabs */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.tabAll}
                </button>
                <button
                  onClick={() => setFilterTab('eligible')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    filterTab === 'eligible' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.tabEligible}
                </button>
                <button
                  onClick={() => setFilterTab('w9pending')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    filterTab === 'w9pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.tabW9Pending}
                </button>
              </div>

              {/* Add Contractor button */}
              <button
                onClick={onOpenAddContractor}
                className="px-3 py-1.5 rounded-lg border border-[#c6c6cd] hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center gap-1 cursor-pointer"
                title="Añadir Contratista"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                <span className="hidden sm:inline">Nuevo</span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          {filteredList.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-2xl">group_off</span>
              </div>
              <h4 className="font-heading font-semibold text-slate-800 text-sm">
                No hay contratistas en esta categoría
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Registra a tus contratistas independientes para comenzar a registrar pagos y emitir planillas 1099-NEC.
              </p>
              <button
                onClick={onOpenAddContractor}
                className="mt-4 px-4 py-2 rounded-lg bg-[#006c4a] text-white font-semibold text-xs hover:bg-[#005137] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                <span>Registrar Contratista</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="py-3 px-4">{t.colContractor}</th>
                    <th className="py-3 px-4">{t.colTin}</th>
                    <th className="py-3 px-4">{t.colW9}</th>
                    <th className="py-3 px-4 text-right">Total Pagado {fiscalYear}</th>
                    <th className="py-3 px-4">{t.colStatus1099}</th>
                    <th className="py-3 px-4 text-right">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map(({ contractor, total, count, isEligible }) => {
                    const isRevealed = revealedTins[contractor.id];
                    return (
                      <tr key={contractor.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e5eeff] text-[#006c4a] font-bold flex items-center justify-center shrink-0">
                              {contractor.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[#0b1c30]">{contractor.name}</p>
                              <p className="text-[11px] text-slate-500">
                                {contractor.businessName || contractor.city + ', ' + contractor.state}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span>{formatTin(contractor.tin, isRevealed, contractor.tinType)}</span>
                            <button
                              onClick={() => toggleTinReveal(contractor.id)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer"
                              title={isRevealed ? 'Ocultar TIN' : 'Mostrar TIN'}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {isRevealed ? 'visibility_off' : 'visibility'}
                              </span>
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {contractor.w9Status === 'signed' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="material-symbols-outlined text-xs">verified</span>
                              W-9 Archivado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="material-symbols-outlined text-xs">warning</span>
                              W-9 Pendiente
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          <span className="block text-[10px] text-slate-400 font-sans font-normal">
                            {count} pagos
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {isEligible ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#eff4ff] text-[#006c4a] border border-[#82f5c1]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                              Elegible (≥$600)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-slate-100 text-slate-500">
                              Bajo Umbral (&lt;$600)
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenManualPayment(contractor.id)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Registrar Pago"
                            >
                              <span className="material-symbols-outlined text-base">add_card</span>
                            </button>

                            <button
                              onClick={() => onNavigateToTaxCenter(contractor.id)}
                              className="px-2.5 py-1 rounded bg-[#131b2e] hover:bg-slate-900 text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                              title={t.viewForm1099}
                            >
                              <span className="material-symbols-outlined text-xs">description</span>
                              <span>{t.viewForm1099}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
