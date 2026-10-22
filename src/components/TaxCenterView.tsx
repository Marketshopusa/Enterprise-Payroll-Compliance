import React, { useState, useEffect } from 'react';
import { ActiveFormTaxType, CompanyProfile, Contractor, CopyType, Form1099Data, FormW2Data, Language, PaymentRecord } from '../types';
import { translations } from '../utils/translations';
import { generateIrsPub1220Txt, downloadFile } from '../utils/irsEFileGenerator';
import { FormViewerModal } from './modals/FormViewerModal';

interface TaxCenterViewProps {
  contractors: Contractor[];
  payments: PaymentRecord[];
  company: CompanyProfile;
  fiscalYear: number;
  lang: Language;
  selectedContractorId: string | null;
  onSelectContractor: (id: string | null) => void;
  onOpenPaymentsSummary: (contractorId: string) => void;
  onOpenEmailModal: (contractorId: string) => void;
  onOpenContractorDirectory: () => void;
  onOpenW9Modal: (contractor: Contractor) => void;
}

export const TaxCenterView: React.FC<TaxCenterViewProps> = ({
  contractors,
  payments,
  company,
  fiscalYear,
  lang,
  selectedContractorId,
  onSelectContractor,
  onOpenPaymentsSummary,
  onOpenEmailModal,
  onOpenContractorDirectory,
  onOpenW9Modal,
}) => {
  const t = translations[lang];
  const [activeFormType, setActiveFormType] = useState<ActiveFormTaxType>('1099-NEC');
  const [copyType, setCopyType] = useState<CopyType>('Copy B');
  const [isFormViewerOpen, setIsFormViewerOpen] = useState(false);
  const [pdfDownloadCount, setPdfDownloadCount] = useState<number>(0);

  const selectedContractor = contractors.find((c) => c.id === selectedContractorId) || null;

  // Calculate Box 1 amount for the selected contractor for active fiscalYear
  const contractorYearPayments = selectedContractor
    ? payments.filter((p) => p.contractorId === selectedContractor.id && p.year === fiscalYear)
    : [];

  const calculatedBox1 = contractorYearPayments.reduce((sum, p) => sum + p.amount, 0);

  // Form 1099-NEC State
  const [formData, setFormData] = useState<Form1099Data>({
    year: fiscalYear,
    voidForm: false,
    correctedForm: false,
    payerName: company.isConfigured ? company.legalName : '',
    payerAddress: company.isConfigured ? company.address : '',
    payerCityStateZip: company.isConfigured ? `${company.city}, ${company.state} ${company.zip}` : '',
    payerPhone: company.isConfigured ? company.phone : '',
    payerTin: company.isConfigured ? company.ein : '',
    recipientTin: '',
    recipientName: '',
    recipientAddress: '',
    recipientCityStateZip: '',
    accountNumber: '',
    secondTinNotice: false,
    box1Compensation: 0,
    box2DirectSales: false,
    box3GoldenParachute: 0,
    box4FederalWithheld: 0,
    box5StateWithheld: 0,
    box6State: '',
    box6PayerStateNo: '',
    box7StateIncome: 0,
  });

  // Form W-2 State (for employees)
  const [w2FormData, setW2FormData] = useState<FormW2Data>({
    year: fiscalYear,
    voidForm: false,
    employerTin: company.isConfigured ? company.ein : '',
    employerName: company.isConfigured ? company.legalName : '',
    employerAddress: company.isConfigured ? company.address : '',
    employerCityStateZip: company.isConfigured ? `${company.city}, ${company.state} ${company.zip}` : '',
    controlNumber: '',
    employeeSsn: '',
    employeeFirstName: '',
    employeeLastName: '',
    employeeAddress: '',
    employeeCityStateZip: '',
    box1Wages: 0,
    box2FederalWithheld: 0,
    box3SocialSecurityWages: 0,
    box4SocialSecurityWithheld: 0,
    box5MedicareWages: 0,
    box6MedicareWithheld: 0,
    box7SocialSecurityTips: 0,
    box8AllocatedTips: 0,
    box10DependentCare: 0,
    box11NonqualifiedPlans: 0,
    box12Code: '',
    box12Amount: 0,
    box13Statutory: false,
    box13RetirementPlan: false,
    box13ThirdPartySickPay: false,
    box14Other: '',
    box15State: '',
    box15StateId: '',
    box16StateWages: 0,
    box17StateWithheld: 0,
    box18LocalWages: 0,
    box19LocalWithheld: 0,
    box20LocalityName: '',
  });

  // Synchronize when selectedContractor or company or fiscalYear changes
  useEffect(() => {
    if (selectedContractor) {
      setFormData({
        year: fiscalYear,
        voidForm: false,
        correctedForm: false,
        payerName: company.isConfigured ? company.legalName : 'Mi Empresa (Sin configurar)',
        payerAddress: company.isConfigured ? company.address : 'Dirección Comercial (Calle y Número)',
        payerCityStateZip: company.isConfigured ? `${company.city}, ${company.state} ${company.zip}` : 'Ciudad, Estado, ZIP',
        payerPhone: company.isConfigured ? company.phone : '(000) 000-0000',
        payerTin: company.isConfigured ? company.ein : '00-0000000',
        recipientTin: selectedContractor.tin,
        recipientName: selectedContractor.businessName
          ? `${selectedContractor.name} / ${selectedContractor.businessName}`
          : selectedContractor.name,
        recipientAddress: selectedContractor.address,
        recipientCityStateZip: `${selectedContractor.city}, ${selectedContractor.state} ${selectedContractor.zip}`,
        accountNumber: selectedContractor.accountNumber || `CNT-${selectedContractor.id.slice(-4)}`,
        secondTinNotice: selectedContractor.secondTinNotice || false,
        box1Compensation: calculatedBox1,
        box2DirectSales: selectedContractor.directSales || false,
        box3GoldenParachute: 0,
        box4FederalWithheld: selectedContractor.federalWithholding || 0,
        box5StateWithheld: selectedContractor.stateWithholding || 0,
        box6State: selectedContractor.state || '',
        box6PayerStateNo: selectedContractor.statePayerId || '',
        box7StateIncome: calculatedBox1,
      });

      const nameParts = selectedContractor.name.split(' ');
      const fName = nameParts[0] || '';
      const lName = nameParts.slice(1).join(' ') || '';
      const ssWithheld = parseFloat((calculatedBox1 * 0.062).toFixed(2));
      const medWithheld = parseFloat((calculatedBox1 * 0.0145).toFixed(2));

      setW2FormData({
        year: fiscalYear,
        voidForm: false,
        employerTin: company.isConfigured ? company.ein : '00-0000000',
        employerName: company.isConfigured ? company.legalName : 'Mi Empresa (Sin configurar)',
        employerAddress: company.isConfigured ? company.address : 'Dirección Comercial',
        employerCityStateZip: company.isConfigured ? `${company.city}, ${company.state} ${company.zip}` : 'Ciudad, Estado, ZIP',
        controlNumber: `W2-${fiscalYear}-${selectedContractor.id.slice(-4)}`,
        employeeSsn: selectedContractor.tin,
        employeeFirstName: fName,
        employeeLastName: lName,
        employeeAddress: selectedContractor.address,
        employeeCityStateZip: `${selectedContractor.city}, ${selectedContractor.state} ${selectedContractor.zip}`,
        box1Wages: calculatedBox1,
        box2FederalWithheld: selectedContractor.federalWithholding || 0,
        box3SocialSecurityWages: calculatedBox1,
        box4SocialSecurityWithheld: ssWithheld,
        box5MedicareWages: calculatedBox1,
        box6MedicareWithheld: medWithheld,
        box7SocialSecurityTips: 0,
        box8AllocatedTips: 0,
        box10DependentCare: 0,
        box11NonqualifiedPlans: 0,
        box12Code: '',
        box12Amount: 0,
        box13Statutory: false,
        box13RetirementPlan: false,
        box13ThirdPartySickPay: false,
        box14Other: '',
        box15State: selectedContractor.state || 'CA',
        box15StateId: selectedContractor.statePayerId || 'CA-000000',
        box16StateWages: calculatedBox1,
        box17StateWithheld: selectedContractor.stateWithholding || 0,
        box18LocalWages: 0,
        box19LocalWithheld: 0,
        box20LocalityName: '',
      });
    } else {
      setFormData({
        year: fiscalYear,
        voidForm: false,
        correctedForm: false,
        payerName: company.isConfigured ? company.legalName : '',
        payerAddress: company.isConfigured ? company.address : '',
        payerCityStateZip: company.isConfigured ? `${company.city}, ${company.state} ${company.zip}` : '',
        payerPhone: company.isConfigured ? company.phone : '',
        payerTin: company.isConfigured ? company.ein : '',
        recipientTin: '',
        recipientName: '',
        recipientAddress: '',
        recipientCityStateZip: '',
        accountNumber: '',
        secondTinNotice: false,
        box1Compensation: 0,
        box2DirectSales: false,
        box3GoldenParachute: 0,
        box4FederalWithheld: 0,
        box5StateWithheld: 0,
        box6State: '',
        box6PayerStateNo: '',
        box7StateIncome: 0,
      });
    }
  }, [selectedContractor, company, calculatedBox1, fiscalYear]);

  const handle1099FieldChange = (field: keyof Form1099Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleW2FieldChange = (field: keyof FormW2Data, value: any) => {
    setW2FormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setPdfDownloadCount((c) => c + 1);
    window.print();
  };

  const handleExportTxt = () => {
    const txtContent = generateIrsPub1220Txt(company, contractors, payments, fiscalYear);
    const filename = `IRS_1099NEC_FIRE_${fiscalYear}_${company.ein.replace(/[^0-9]/g, '') || '000000000'}.txt`;
    downloadFile(txtContent, filename, 'text/plain');
  };

  const hasData = Boolean(selectedContractor || formData.recipientName || formData.box1Compensation > 0);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f8f9ff]">
      {/* Top Mobile-Friendly Sub-Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Centro Fiscal & Emisión Oficial
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Año {fiscalYear}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#0b1c30] tracking-tight font-heading mt-0.5">
            Gestión y Emisión de Planillas Oficiales IRS
          </h1>
        </div>

        {/* Form Type Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shadow-inner">
          <button
            onClick={() => setActiveFormType('1099-NEC')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFormType === '1099-NEC'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-[#006c4a]">badge</span>
            <span>1099-NEC (Contratistas)</span>
          </button>
          <button
            onClick={() => setActiveFormType('W-2')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFormType === 'W-2'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-[#006c4a]">person</span>
            <span>W-2 (Empleados)</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Body */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-[1300px] mx-auto space-y-5">
          {/* ======================================================== */}
          {/* HERO CARD: PLANILLA OFICIAL (CLEAN, COMPACT, ON-DEMAND) */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

            <div className="space-y-3 max-w-2xl relative z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#131b2e] text-white font-mono">
                  {activeFormType} • Cat. {activeFormType === '1099-NEC' ? '74162Z' : '10134D'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Certificada para Contadores (CPA)
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Año Fiscal: {fiscalYear}
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] tracking-tight font-heading">
                  {activeFormType === '1099-NEC'
                    ? `Formulario IRS 1099-NEC Oficial (${fiscalYear})`
                    : `Formulario IRS W-2 Oficial (${fiscalYear})`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {selectedContractor
                    ? `Planilla lista para emisión para ${selectedContractor.name} (${selectedContractor.tinType}: ${selectedContractor.tin}). Total compensación: $${calculatedBox1.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`
                    : 'Planilla oficial del IRS en blanco lista para editar, precargar con contratistas o imprimir para presentación fiscal.'}
                </p>
              </div>

              {/* Beneficiary Badge */}
              <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#e5eeff] text-[#006c4a] font-bold flex items-center justify-center text-xs shrink-0">
                  {selectedContractor ? selectedContractor.name.charAt(0) : '?'}
                </div>
                <div className="truncate">
                  <span className="font-bold text-slate-800">
                    {selectedContractor ? selectedContractor.name : 'Ningún contratista seleccionado (Planilla en blanco)'}
                  </span>
                  {selectedContractor && (
                    <span className="text-slate-500 ml-1.5 font-mono text-[11px]">
                      • {selectedContractor.city}, {selectedContractor.state}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION CLUSTER (TOUCH FRIENDLY) */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0 relative z-10">
              {/* PRIMARY BUTTON: OPEN THE FULL OFFICIAL FORM VIEWER / MODAL */}
              <button
                onClick={() => setIsFormViewerOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#006c4a] hover:bg-[#005137] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-emerald-900/10 active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">open_in_full</span>
                <span>Ver / Editar Planilla Oficial</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#131b2e] hover:bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                  title="Imprimir Formulario Oficial"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  <span>Imprimir Oficial</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  title="Descargar PDF"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Descargar PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportTxt}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                  title="Exportar archivo IRS FIRE TXT (Pub. 1220)"
                >
                  <span className="material-symbols-outlined text-sm">file_upload</span>
                  <span>Exportar e-File TXT</span>
                </button>

                <button
                  onClick={() => selectedContractor && onOpenEmailModal(selectedContractor.id)}
                  disabled={!selectedContractor}
                  className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                    selectedContractor
                      ? 'border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer'
                      : 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed opacity-60'
                  }`}
                  title="Enviar por Correo"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span>Enviar Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* FINANCIAL SUMMARY OF THIS STATEMENT (4 STAT CARDS)       */}
          {/* ======================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block truncate">
                {activeFormType === '1099-NEC' ? 'Casilla 1 (Compensación Bruta)' : 'Casilla 1 (Salarios y Propinas)'}
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#006c4a] mt-1 tracking-tight">
                ${calculatedBox1.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                {contractorYearPayments.length} desembolsos en {fiscalYear}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block truncate">
                Casilla 4 (Retención Federal)
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1 tracking-tight">
                ${(selectedContractor?.federalWithholding || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                Backup withholding
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block truncate">
                {activeFormType === '1099-NEC' ? 'Casilla 5 (Retención Estatal)' : 'FICA Retenido (SS + Med)'}
              </span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1 tracking-tight">
                {activeFormType === '1099-NEC'
                  ? `$${(selectedContractor?.stateWithholding || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  : `$${(w2FormData.box4SocialSecurityWithheld + w2FormData.box6MedicareWithheld).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                {activeFormType === '1099-NEC' ? selectedContractor?.state || 'CA' : 'Fórmulas 6.2% + 1.45%'}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block truncate">
                Cumplimiento Tributario
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${hasData ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <p className="text-sm font-bold text-slate-900 truncate">
                  {hasData ? 'Listo para Emisión' : 'Planilla en Blanco'}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                {selectedContractor?.w9Status === 'signed' ? 'W-9 Archivado ✓' : 'Sin archivar'}
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* GRID: RECIPIENT SELECTOR & ACCOUNTING AUDIT CHECKLIST    */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Quick Recipient Directory (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c4a] text-xl">group</span>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                    Seleccionar Beneficiario para Emisión ({contractors.length})
                  </h3>
                </div>
                <button
                  onClick={onOpenContractorDirectory}
                  className="text-xs text-[#006c4a] hover:underline font-semibold cursor-pointer"
                >
                  Directorio Completo →
                </button>
              </div>

              {/* Blank Template Option */}
              <button
                onClick={() => onSelectContractor(null)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  !selectedContractorId
                    ? 'border-[#006c4a] bg-emerald-50/70 ring-1 ring-[#006c4a]'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">Modo Planilla en Blanco (Rellenar Libre)</p>
                    <p className="text-[11px] text-slate-500">Permite escribir cualquier dato y monto manualmente</p>
                  </div>
                </div>
                {!selectedContractorId && (
                  <span className="text-xs font-bold text-[#006c4a] px-2 py-0.5 rounded-full bg-white border border-emerald-300">
                    Activo
                  </span>
                )}
              </button>

              {/* Contractors List */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {contractors.map((c) => {
                  const isSelected = selectedContractorId === c.id;
                  const cYearPayments = payments.filter((p) => p.contractorId === c.id && p.year === fiscalYear);
                  const total = cYearPayments.reduce((s, p) => s + p.amount, 0);

                  return (
                    <button
                      key={c.id}
                      onClick={() => onSelectContractor(c.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#006c4a] bg-emerald-50/70 ring-1 ring-[#006c4a]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#006c4a] font-bold text-xs flex items-center justify-center shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-xs text-slate-900 truncate">{c.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono truncate">
                            {c.tinType}: {c.tin} • {c.businessName || `${c.city}, ${c.state}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        <span className="text-xs font-bold font-mono text-slate-900 block">
                          ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {cYearPayments.length} pagos
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Accounting Audit & CPA Instructions (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Audit Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c4a] text-lg">verified_user</span>
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                      Verificación & Auditoría Contable
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    IRS Validado
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">Conciliación con Libro Mayor</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {calculatedBox1 > 0
                          ? `Total acumulado auditado de $${calculatedBox1.toFixed(2)} USD para la Casilla 1.`
                          : 'Sin pagos registrados en este ejercicio.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800">Formulario W-9 Oficial</p>
                        {selectedContractor && (
                          <button
                            onClick={() => onOpenW9Modal(selectedContractor)}
                            className="text-[10px] text-[#006c4a] font-bold hover:underline cursor-pointer"
                          >
                            Ver W-9
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {selectedContractor?.w9Status === 'signed'
                          ? `Firmado digitalmente el ${selectedContractor.w9SignedDate || `${fiscalYear}-01-15`}.`
                          : 'Pendiente de adjuntar o firmar.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">TIN Matching & Algoritmo IRS</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Estructura válida de 9 dígitos para emisión reglamentaria ante el IRS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CPA Guidance Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="material-symbols-outlined text-[#006c4a] text-lg">school</span>
                  <h4 className="font-heading font-bold text-xs text-slate-900">
                    Guía Rápida para el Contador (CPA)
                  </h4>
                </div>

                <div className="text-[11px] text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    <strong>• Formulario 1099-NEC:</strong> Se entrega a contratistas independientes (autónomos) para declarar en el Schedule C del Formulario 1040.
                  </p>
                  <p>
                    <strong>• Formulario W-2:</strong> Se entrega a trabajadores en plantilla formal para retenciones de Seguro Social y Medicare (FICA).
                  </p>
                </div>

                <button
                  onClick={() => setIsFormViewerOpen(true)}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>Abrir Planilla en Modo Pantalla Completa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FORM VIEWER MODAL: OPENS THE AUTHENTIC FULL OFFICIAL IRS FORM ON TAP */}
      <FormViewerModal
        isOpen={isFormViewerOpen}
        onClose={() => setIsFormViewerOpen(false)}
        activeFormType={activeFormType}
        setActiveFormType={setActiveFormType}
        copyType={copyType}
        setCopyType={setCopyType}
        formData={formData}
        on1099Change={handle1099FieldChange}
        w2FormData={w2FormData}
        onW2Change={handleW2FieldChange}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        contractorName={selectedContractor?.name}
        fiscalYear={fiscalYear}
      />
    </div>
  );
};
