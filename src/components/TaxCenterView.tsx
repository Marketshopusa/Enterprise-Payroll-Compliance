import React, { useState, useEffect } from 'react';
import { ActiveFormTaxType, CompanyProfile, Contractor, CopyType, Form1099Data, FormW2Data, Language, PaymentRecord } from '../types';
import { translations } from '../utils/translations';
import { Irs1099Form } from './Irs1099Form';
import { IrsW2Form } from './IrsW2Form';
import { generateIrsPub1220Txt, downloadFile } from '../utils/irsEFileGenerator';

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
  const [zoomLevel, setZoomLevel] = useState<number>(100);
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

      // Also pre-fill W-2 with exact statutory calculations
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
      // Clean blank state
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

      setW2FormData({
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
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      {/* TOOLBAR: EXPORT / PRINT / COPY SELECTOR */}
      <div className="bg-white border-b border-[#c6c6cd]/60 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 z-20 shrink-0">
        {/* Copy Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#eff4ff] rounded-lg border border-[#c6c6cd]/70 text-xs">
          <button
            onClick={() => setCopyType('Copy B')}
            className={`px-3 py-1.5 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              copyType === 'Copy B'
                ? 'bg-white text-[#0b1c30] shadow-xs border border-[#c6c6cd]/50'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#006c4a]"></span>
            <span>{t.copyB}</span>
          </button>

          <button
            onClick={() => setCopyType('Copy A')}
            className={`px-3 py-1.5 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              copyType === 'Copy A'
                ? 'bg-white text-[#c60b1e] shadow-xs border border-[#c6c6cd]/50'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#c60b1e]"></span>
            <span>{t.copyA}</span>
          </button>

          <button
            onClick={() => setCopyType('Copy C')}
            className={`px-3 py-1.5 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              copyType === 'Copy C'
                ? 'bg-white text-[#0b1c30] shadow-xs border border-[#c6c6cd]/50'
                : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span>{t.copyC}</span>
          </button>
        </div>

        {/* Action Buttons Cluster */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportTxt}
            className="px-3 py-1.5 rounded-lg border border-[#c6c6cd] hover:bg-slate-50 text-[#0b1c30] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Exportar archivo oficial en formato IRS FIRE System (Pub. 1220)"
          >
            <span className="material-symbols-outlined text-base">file_upload</span>
            <span>{t.exportTxt}</span>
          </button>

          <button
            onClick={() => selectedContractor && onOpenPaymentsSummary(selectedContractor.id)}
            disabled={!selectedContractor}
            className={`px-3 py-1.5 rounded-lg border border-[#c6c6cd] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedContractor
                ? 'text-[#0b1c30] hover:bg-slate-50 cursor-pointer shadow-xs'
                : 'text-[#76777d] bg-slate-50 cursor-not-allowed opacity-60'
            }`}
            title="Ver desglose de pagos emitidos"
          >
            <span className="material-symbols-outlined text-base">table_chart</span>
            <span>{t.paymentSummary}</span>
          </button>

          <button
            onClick={() => selectedContractor && onOpenEmailModal(selectedContractor.id)}
            disabled={!selectedContractor}
            className={`px-3 py-1.5 rounded-lg border border-[#c6c6cd] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedContractor
                ? 'text-[#0b1c30] hover:bg-slate-50 cursor-pointer shadow-xs'
                : 'text-[#76777d] bg-slate-50 cursor-not-allowed opacity-60'
            }`}
            title="Enviar comprobante oficial por correo"
          >
            <span className="material-symbols-outlined text-base">mail</span>
            <span>{t.sendEmail}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[#0b1c30] hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Descargar Planilla Oficial en PDF"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Descargar Planilla Oficial (PDF)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-[#000000] hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Imprimir Planilla Oficial en Formato de Impresión IRS"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Imprimir Formulario Oficial ({activeFormType})</span>
          </button>
        </div>
      </div>

      {/* FORM TYPE SWITCHER: 1099-NEC vs W-2 (CRUCIAL FOR ACCOUNTANTS & EMPLOYEES) */}
      <div className="bg-slate-100 border-b border-slate-300 px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 uppercase text-[11px] tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-[#006c4a]">verified</span>
            Formulario Fiscal Oficial ({fiscalYear}):
          </span>

          <div className="flex items-center p-0.5 bg-white rounded-lg border border-slate-300 shadow-2xs">
            <button
              onClick={() => setActiveFormType('1099-NEC')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFormType === '1099-NEC'
                  ? 'bg-[#131b2e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <span>Formulario 1099-NEC</span>
              <span className="text-[10px] font-normal opacity-80">(Contratistas / 1099)</span>
            </button>

            <button
              onClick={() => setActiveFormType('W-2')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFormType === 'W-2'
                  ? 'bg-[#006c4a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <span>Formulario W-2</span>
              <span className="text-[10px] font-normal opacity-80">(Empleados en Nómina)</span>
            </button>
          </div>
        </div>

        {/* CPA Guidance Pill */}
        <div className="text-[11px] text-slate-600 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            {activeFormType === '1099-NEC'
              ? 'IRS Cat. No. 74162Z Oficial para Servicios Independientes'
              : 'IRS / SSA Cat. No. 10134D Oficial con Fórmulas FICA (6.2% SS + 1.45% Medicare)'}
          </span>
        </div>
      </div>

      {/* CONTENT AREA: FORM PREVIEW & SIDE AUDIT */}
      <main className="flex-1 overflow-y-auto p-6 bg-[#f8f9ff]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6 items-start">
          {/* ========================================== */}
          {/* LEFT: THE OFFICIAL IRS FORM CANVAS        */}
          {/* ========================================== */}
          <section className="col-span-12 lg:col-span-8 flex flex-col gap-4">
            {/* Banner: Legal Compliance & Status */}
            <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#006c4a] border border-[#c6c6cd]/60 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">gavel</span>
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-heading font-bold text-sm sm:text-base text-[#0b1c30]">
                      {activeFormType === '1099-NEC'
                        ? `Plantilla Oficial IRS Formulario 1099-NEC (${fiscalYear})`
                        : `Plantilla Oficial IRS Formulario W-2 (${fiscalYear})`}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Certificada para Contadores (CPA) & IRS
                    </span>
                  </div>
                  <p className="text-xs text-[#45464d] mt-0.5">
                    {activeFormType === '1099-NEC'
                      ? `Formulario gubernamental oficial (Cat. No. 74162Z) para el año fiscal ${fiscalYear}. Cumple con todas las normas del IRS Publication 1179.`
                      : `Formulario oficial de salario y retenciones (Cat. No. 10134D) para empleados en nómina formal. Incluye fórmulas automáticas de Seguro Social y Medicare.`}
                  </p>
                </div>
              </div>

              {/* Page Scale / Zoom Indicator */}
              <div className="flex items-center gap-1 bg-[#eff4ff] rounded-lg p-1 text-xs text-[#45464d] font-medium shrink-0">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
                  className="p-1 hover:bg-white rounded transition-colors cursor-pointer"
                  title="Alejar"
                >
                  <span className="material-symbols-outlined text-sm">zoom_out</span>
                </button>
                <span className="px-1.5 font-mono text-[11px]">{zoomLevel}% (Letter)</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
                  className="p-1 hover:bg-white rounded transition-colors cursor-pointer"
                  title="Acercar"
                >
                  <span className="material-symbols-outlined text-sm">zoom_in</span>
                </button>
              </div>
            </div>

            {/* Official IRS Document Container */}
            <div className="overflow-x-auto pb-4">
              {activeFormType === '1099-NEC' ? (
                <Irs1099Form
                  formData={formData}
                  onChange={handle1099FieldChange}
                  copyType={copyType}
                  zoomLevel={zoomLevel}
                />
              ) : (
                <IrsW2Form
                  formData={w2FormData}
                  onChange={handleW2FieldChange}
                  copyType={copyType}
                  zoomLevel={zoomLevel}
                />
              )}
            </div>

            {/* Bottom Contextual Explanatory Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border border-[#c6c6cd]/70 p-3 rounded-lg shadow-xs">
                <div className="flex items-center gap-1.5 text-[#006c4a] font-semibold text-xs">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span>Validación de Algoritmo IRS</span>
                </div>
                <p className="text-xs text-[#45464d] mt-1">
                  Verificación de 9 dígitos para SSN/EIN y congruencia matemática de retenciones fiscales.
                </p>
              </div>

              <div className="bg-white border border-[#c6c6cd]/70 p-3 rounded-lg shadow-xs">
                <div className="flex items-center gap-1.5 text-[#0b1c30] font-semibold text-xs">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>Plazo Límite Legal {fiscalYear}</span>
                </div>
                <p className="text-xs text-[#45464d] mt-1">
                  Entrega al receptor y transmisión electrónica ante IRS / SSA:{' '}
                  <strong className="text-[#0b1c30]">31 de Enero de {fiscalYear + 1}</strong>.
                </p>
              </div>

              <div className="bg-white border border-[#c6c6cd]/70 p-3 rounded-lg shadow-xs">
                <div className="flex items-center gap-1.5 text-[#0b1c30] font-semibold text-xs">
                  <span className="material-symbols-outlined text-base">cloud_sync</span>
                  <span>Sincronización FIRE & IRIS</span>
                </div>
                <p className="text-xs text-[#45464d] mt-1">
                  Estructura compatible para transmisión electrónica directa al IRS portal y sistemas de contabilidad.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* RIGHT: AUDIT & ACCOUNTANT INSTRUCTIONS    */}
          {/* ========================================== */}
          <aside className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            {/* Accounting Audit Verification Card */}
            <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#76777d] text-xl">fact_check</span>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#0b1c30]">
                    Auditoría Contable
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    hasData
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-[#eff4ff] text-[#76777d] border-[#c6c6cd]'
                  }`}
                >
                  {hasData ? 'ESTADO: CONCILIADO' : t.statusNoData}
                </span>
              </div>

              {/* Audit Checklist Items */}
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd]/60">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    hasData ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <span className="material-symbols-outlined text-xs">
                      {hasData ? 'check' : 'hourglass_empty'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#0b1c30]">
                      {activeFormType === '1099-NEC' ? 'Conciliación Box 1 con Nómina' : 'Total Salarios Brutos (Box 1)'}
                    </p>
                    <p className="text-[11px] text-[#45464d] mt-0.5">
                      {selectedContractor
                        ? `${contractorYearPayments.length} desembolsos auditados en ${fiscalYear} para ${selectedContractor.name}.`
                        : 'Sin beneficiario seleccionado. Ingresa un perfil para conciliar.'}
                    </p>
                    <span className="inline-block mt-1 font-mono text-xs font-bold text-[#0b1c30] bg-white px-2 py-0.5 rounded border border-[#c6c6cd]/80">
                      $ {(activeFormType === '1099-NEC' ? formData.box1Compensation : w2FormData.box1Wages).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd]/60">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    selectedContractor?.w9Status === 'signed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    <span className="material-symbols-outlined text-xs">
                      {selectedContractor?.w9Status === 'signed' ? 'verified' : 'description'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#0b1c30]">
                        {activeFormType === '1099-NEC' ? 'Formulario W-9 en Archivo' : 'Formulario W-4 del Empleado'}
                      </p>
                      {selectedContractor && (
                        <button
                          onClick={() => onOpenW9Modal(selectedContractor)}
                          className="text-[10.5px] text-[#006c4a] hover:underline font-semibold cursor-pointer"
                        >
                          Ver Archivo
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#45464d] mt-0.5">
                      {selectedContractor
                        ? selectedContractor.w9Status === 'signed'
                          ? `Validado y firmado digitalmente (${selectedContractor.w9SignedDate || `${fiscalYear}-01-15`})`
                          : 'Pendiente de firma oficial'
                        : 'Sin adjunto fiscal'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd]/60">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    selectedContractor?.tinMatched
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    <span className="material-symbols-outlined text-xs">
                      {selectedContractor?.tinMatched ? 'shield' : 'shield_moon'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#0b1c30]">Validación IRS TIN Matching</p>
                    <p className="text-[11px] text-[#45464d] mt-0.5">
                      {selectedContractor
                        ? 'Formato válido ante la base de datos de la administración fiscal'
                        : 'Pendiente de validación'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guía Contable para Empleados vs Contratistas (Anti-problemas con el CPA) */}
            <div className="bg-white border border-[#c6c6cd]/70 rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="material-symbols-outlined text-[#006c4a] text-xl">school</span>
                <h3 className="font-heading font-bold text-sm text-[#0b1c30]">
                  Instrucciones para el Contador (CPA)
                </h3>
              </div>

              <div className="mt-3 text-xs text-[#45464d] space-y-2.5 leading-relaxed">
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <p className="font-bold text-[11px]">
                    ¿Cómo evitar problemas con el contador?
                  </p>
                  <p className="text-[10.5px] mt-1 leading-snug">
                    • <strong>Formulario 1099-NEC:</strong> Se entrega a <em>contratistas independientes</em> (freelancers, subcontratistas, proveedores de servicios profesionales). Se declara en el Schedule C del Formulario 1040.
                    <br />
                    • <strong>Formulario W-2:</strong> Se entrega a <em>empleados formales en nómina</em> sujeta a retenciones de Seguro Social y Medicare.
                  </p>
                </div>

                <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#c6c6cd]/60 space-y-1">
                  <p className="font-semibold text-[#0b1c30] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#006c4a]">check_circle</span>
                    <span>Validez Legal ante el IRS</span>
                  </p>
                  <p className="text-[11px]">
                    Ambas planillas cumplen con el estándar OCR y Catálogo oficial del IRS para el año fiscal {fiscalYear}. Puedes imprimirlas directamente en papel estándar carta (8.5 x 11 pulgadas).
                  </p>
                </div>
              </div>

              <button
                onClick={() => selectedContractor && onOpenEmailModal(selectedContractor.id)}
                disabled={!selectedContractor}
                className={`w-full mt-4 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  selectedContractor
                    ? 'border-[#006c4a] bg-[#006c4a] hover:bg-[#005137] text-white cursor-pointer shadow-xs'
                    : 'border-[#c6c6cd] text-[#76777d] bg-slate-50 cursor-not-allowed opacity-60'
                }`}
                title={selectedContractor ? 'Enviar Comprobante al Beneficiario' : 'Selecciona un beneficiario para enviar'}
              >
                <span className="material-symbols-outlined text-base">forward_to_inbox</span>
                <span>Enviar Planilla Oficial por Correo</span>
              </button>
            </div>

            {/* Quick Contractor Directory Shortcut */}
            <div className="bg-white border border-dashed border-[#c6c6cd] rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center mx-auto mb-2 text-[#76777d]">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
              <h4 className="font-heading font-semibold text-xs text-[#0b1c30]">
                Directorio de Contratistas y Empleados
              </h4>
              <p className="text-[11px] text-[#76777d] mt-1 mb-3">
                Selecciona cualquier perfil para generar de inmediato su comprobante tributario {fiscalYear}.
              </p>
              <button
                onClick={onOpenContractorDirectory}
                className="w-full py-2 px-3 rounded-lg border border-[#c6c6cd] bg-white hover:bg-slate-50 text-[#0b1c30] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">search</span>
                <span>Explorar Directorio</span>
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
