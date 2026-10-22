/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CompanyProfile, Contractor, Language, NavTab, PaymentRecord } from './types';
import { StorageService, DEFAULT_COMPANY, SAMPLE_COMPANY, SAMPLE_CONTRACTORS, SAMPLE_PAYMENTS } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TaxCenterView } from './components/TaxCenterView';
import { ContractorsView } from './components/ContractorsView';
import { PaymentsLedgerView } from './components/PaymentsLedgerView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { SupportView } from './components/SupportView';

// Modals
import { CompanyConfigModal } from './components/modals/CompanyConfigModal';
import { ManualPaymentModal } from './components/modals/ManualPaymentModal';
import { CsvImportModal } from './components/modals/CsvImportModal';
import { MonthlyRetroModal } from './components/modals/MonthlyRetroModal';
import { RunPayrollModal } from './components/modals/RunPayrollModal';
import { ContractorModal } from './components/modals/ContractorModal';
import { EmailCopyModal } from './components/modals/EmailCopyModal';
import { DemoVideoModal } from './components/modals/DemoVideoModal';
import { W9ViewModal } from './components/modals/W9ViewModal';
import { PaymentsSummaryModal } from './components/modals/PaymentsSummaryModal';

import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileMenuDrawer } from './components/modals/MobileMenuDrawer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [lang, setLang] = useState<Language>('es');
  const [fiscalYear, setFiscalYear] = useState<number>(2026);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Data
  const [company, setCompany] = useState<CompanyProfile>(() => StorageService.getCompany());
  const [contractors, setContractors] = useState<Contractor[]>(() => StorageService.getContractors());
  const [payments, setPayments] = useState<PaymentRecord[]>(() => StorageService.getPayments());

  // Selected contractor for 1099 Preview
  const [selectedContractorId, setSelectedContractorId] = useState<string | null>(null);

  // IRS FIRE status
  const [irsFireConfigured, setIrsFireConfigured] = useState<boolean>(() => {
    return Boolean(company.transmitterControlCode);
  });

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isManualPaymentOpen, setIsManualPaymentOpen] = useState(false);
  const [manualPaymentContractorId, setManualPaymentContractorId] = useState<string | undefined>();
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [isRetroModalOpen, setIsRetroModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isContractorModalOpen, setIsContractorModalOpen] = useState(false);
  const [contractorToEdit, setContractorToEdit] = useState<Contractor | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailContractorId, setEmailContractorId] = useState<string | null>(null);
  const [isDemoVideoOpen, setIsDemoVideoOpen] = useState(false);
  const [isW9ModalOpen, setIsW9ModalOpen] = useState(false);
  const [activeW9Contractor, setActiveW9Contractor] = useState<Contractor | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryContractorId, setSummaryContractorId] = useState<string | null>(null);

  // Save changes to storage
  useEffect(() => {
    StorageService.setCompany(company);
  }, [company]);

  useEffect(() => {
    StorageService.setContractors(contractors);
  }, [contractors]);

  useEffect(() => {
    StorageService.setPayments(payments);
  }, [payments]);

  const hasSampleData = contractors.length > 0 && payments.length > 0;

  const handleToggleSampleData = () => {
    if (hasSampleData) {
      // Clear to clean blank state
      StorageService.clearAllData();
      setCompany(DEFAULT_COMPANY);
      setContractors([]);
      setPayments([]);
      setSelectedContractorId(null);
      setIrsFireConfigured(false);
    } else {
      // Load sample data
      StorageService.loadSampleData();
      setCompany(SAMPLE_COMPANY);
      setContractors(SAMPLE_CONTRACTORS);
      setPayments(SAMPLE_PAYMENTS);
      setSelectedContractorId(SAMPLE_CONTRACTORS[0]?.id || null);
      setIrsFireConfigured(true);
    }
  };

  const handleToggleIrsFire = () => {
    setIrsFireConfigured((prev) => !prev);
  };

  const handleNavigateToTaxCenter = (contractorId?: string) => {
    setCurrentTab('tax-center');
    if (contractorId) {
      setSelectedContractorId(contractorId);
    }
  };

  const handleOpenManualPayment = (contractorId?: string) => {
    setManualPaymentContractorId(contractorId);
    setIsManualPaymentOpen(true);
  };

  const handleSavePayment = (paymentData: Omit<PaymentRecord, 'id'>) => {
    const newRecord: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
    };
    setPayments((prev) => [newRecord, ...prev]);
  };

  const handleDeletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveContractor = (contractor: Contractor) => {
    setContractors((prev) => {
      const exists = prev.some((c) => c.id === contractor.id);
      if (exists) {
        return prev.map((c) => (c.id === contractor.id ? contractor : c));
      }
      return [...prev, contractor];
    });
    if (!selectedContractorId) {
      setSelectedContractorId(contractor.id);
    }
  };

  const handleDeleteContractor = (id: string) => {
    setContractors((prev) => prev.filter((c) => c.id !== id));
    setPayments((prev) => prev.filter((p) => p.contractorId !== id));
    if (selectedContractorId === id) {
      setSelectedContractorId(null);
    }
  };

  const handleCsvImportSuccess = (newPayments: PaymentRecord[], newContractors: Contractor[]) => {
    if (newContractors.length > 0) {
      setContractors((prev) => [...prev, ...newContractors]);
    }
    if (newPayments.length > 0) {
      setPayments((prev) => [...prev, ...newPayments]);
    }
  };

  const handleSaveMonthlyRetro = (contractorId: string, monthlyAmounts: number[]) => {
    const c = contractors.find((item) => item.id === contractorId);
    if (!c) return;

    // Filter out existing payments for this contractor and year, then re-create
    const filteredPayments = payments.filter(
      (p) => !(p.contractorId === contractorId && p.year === fiscalYear)
    );

    const newPayments: PaymentRecord[] = [];
    monthlyAmounts.forEach((amt, idx) => {
      if (amt > 0) {
        const monthNum = (idx + 1).toString().padStart(2, '0');
        newPayments.push({
          id: `pay-retro-${Date.now()}-${idx}`,
          contractorId,
          contractorName: c.name,
          amount: amt,
          date: `${fiscalYear}-${monthNum}-15`,
          method: 'Direct Deposit',
          memo: `Cierre mensual retrospectivo ${monthNum}/${fiscalYear}`,
          category: 'Monthly Consolidation',
          year: fiscalYear,
        });
      }
    });

    setPayments([...filteredPayments, ...newPayments]);
  };

  const handleCommitPayroll = (newPayments: PaymentRecord[]) => {
    setPayments((prev) => [...newPayments, ...prev]);
  };

  const handleSignW9 = (contractorId: string) => {
    setContractors((prev) =>
      prev.map((c) =>
        c.id === contractorId
          ? {
              ...c,
              w9Status: 'signed',
              w9SignedDate: new Date().toISOString().slice(0, 10),
              tinMatched: true,
            }
          : c
      )
    );
    if (activeW9Contractor && activeW9Contractor.id === contractorId) {
      setActiveW9Contractor((prev) =>
        prev
          ? {
              ...prev,
              w9Status: 'signed',
              w9SignedDate: new Date().toISOString().slice(0, 10),
              tinMatched: true,
            }
          : null
      );
    }
  };

  const handleOpenEmailModal = (contractorId: string) => {
    setEmailContractorId(contractorId);
    setIsEmailModalOpen(true);
  };

  const handleOpenPaymentsSummary = (contractorId: string) => {
    setSummaryContractorId(contractorId);
    setIsSummaryModalOpen(true);
  };

  const handleOpenW9Modal = (contractor: Contractor) => {
    setActiveW9Contractor(contractor);
    setIsW9ModalOpen(true);
  };

  const handleBatch1099 = () => {
    // Navigate to Tax Center and select first eligible contractor
    const eligible = contractors.find((c) => {
      const tot = payments
        .filter((p) => p.contractorId === c.id && p.year === fiscalYear)
        .reduce((s, p) => s + p.amount, 0);
      return tot >= 600;
    });
    if (eligible) {
      setSelectedContractorId(eligible.id);
    }
    setCurrentTab('tax-center');
  };

  const activeEmailContractor = contractors.find((c) => c.id === emailContractorId) || null;
  const activeSummaryContractor = contractors.find((c) => c.id === summaryContractorId) || null;

  return (
    <div className="flex h-screen bg-[#f8f9ff] text-[#0b1c30] overflow-hidden antialiased select-text">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        company={company}
        lang={lang}
        onOpenPayroll={() => setIsPayrollModalOpen(true)}
        onOpenCompanySettings={() => setIsCompanyModalOpen(true)}
        onOpenDemoVideo={() => setIsDemoVideoOpen(true)}
        onToggleSampleData={handleToggleSampleData}
        hasSampleData={hasSampleData}
        irsFireConfigured={irsFireConfigured}
        onToggleIrsFire={handleToggleIrsFire}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navigation Header */}
        <Header
          currentTab={currentTab}
          company={company}
          lang={lang}
          onLanguageChange={setLang}
          fiscalYear={fiscalYear}
          onFiscalYearChange={setFiscalYear}
          contractors={contractors}
          selectedContractorId={selectedContractorId}
          onSelectContractor={setSelectedContractorId}
          onBackToDashboard={() => setCurrentTab('dashboard')}
          onOpenManualPayment={() => handleOpenManualPayment(selectedContractorId || undefined)}
          onOpenCompanySettings={() => setIsCompanyModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenHelp={() => setCurrentTab('soporte')}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* View Switcher Container with responsive safe bottom margin for mobile nav */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden pb-16 md:pb-0">
          {currentTab === 'dashboard' && (
            <DashboardView
              contractors={contractors}
              payments={payments}
              fiscalYear={fiscalYear}
              lang={lang}
              onNavigateToTaxCenter={handleNavigateToTaxCenter}
              onOpenManualPayment={handleOpenManualPayment}
              onOpenCsvImport={() => setIsCsvImportOpen(true)}
              onOpenRetroModal={() => setIsRetroModalOpen(true)}
              onOpenBatch1099={handleBatch1099}
              onOpenAddContractor={() => {
                setContractorToEdit(null);
                setIsContractorModalOpen(true);
              }}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'tax-center' && (
            <TaxCenterView
              contractors={contractors}
              payments={payments}
              company={company}
              fiscalYear={fiscalYear}
              lang={lang}
              selectedContractorId={selectedContractorId}
              onSelectContractor={setSelectedContractorId}
              onOpenPaymentsSummary={handleOpenPaymentsSummary}
              onOpenEmailModal={handleOpenEmailModal}
              onOpenContractorDirectory={() => setCurrentTab('contractors')}
              onOpenW9Modal={handleOpenW9Modal}
            />
          )}

          {currentTab === 'contractors' && (
            <ContractorsView
              contractors={contractors}
              payments={payments}
              fiscalYear={fiscalYear}
              lang={lang}
              onAddContractor={() => {
                setContractorToEdit(null);
                setIsContractorModalOpen(true);
              }}
              onEditContractor={(c) => {
                setContractorToEdit(c);
                setIsContractorModalOpen(true);
              }}
              onDeleteContractor={handleDeleteContractor}
              onView1099={handleNavigateToTaxCenter}
              onRecordPayment={handleOpenManualPayment}
              onOpenW9Modal={handleOpenW9Modal}
            />
          )}

          {currentTab === 'payments' && (
            <PaymentsLedgerView
              payments={payments}
              contractors={contractors}
              fiscalYear={fiscalYear}
              lang={lang}
              onOpenManualPayment={() => handleOpenManualPayment()}
              onDeletePayment={handleDeletePayment}
            />
          )}

          {currentTab === 'reportes' && (
            <ReportsView
              company={company}
              contractors={contractors}
              payments={payments}
              fiscalYear={fiscalYear}
              lang={lang}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              company={company}
              onSaveCompany={setCompany}
              lang={lang}
              irsFireConfigured={irsFireConfigured}
              onToggleIrsFire={handleToggleIrsFire}
            />
          )}

          {currentTab === 'soporte' && <SupportView lang={lang} />}
        </div>
      </div>

      {/* Native Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Mobile Drawer (Bottom Sheet) */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        company={company}
        lang={lang}
        onOpenPayroll={() => setIsPayrollModalOpen(true)}
        onOpenCompanySettings={() => setIsCompanyModalOpen(true)}
        onOpenDemoVideo={() => setIsDemoVideoOpen(true)}
        onToggleSampleData={handleToggleSampleData}
        hasSampleData={hasSampleData}
        irsFireConfigured={irsFireConfigured}
        onToggleIrsFire={handleToggleIrsFire}
      />

      {/* Modals */}
      <CompanyConfigModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        company={company}
        onSave={setCompany}
      />

      <ManualPaymentModal
        isOpen={isManualPaymentOpen}
        onClose={() => setIsManualPaymentOpen(false)}
        contractors={contractors}
        defaultContractorId={manualPaymentContractorId}
        onSavePayment={handleSavePayment}
        fiscalYear={fiscalYear}
      />

      <CsvImportModal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
        contractors={contractors}
        onImportSuccess={handleCsvImportSuccess}
        fiscalYear={fiscalYear}
      />

      <MonthlyRetroModal
        isOpen={isRetroModalOpen}
        onClose={() => setIsRetroModalOpen(false)}
        contractors={contractors}
        payments={payments}
        fiscalYear={fiscalYear}
        onSaveMonthlyAmounts={handleSaveMonthlyRetro}
      />

      <RunPayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        contractors={contractors}
        onCommitPayroll={handleCommitPayroll}
        fiscalYear={fiscalYear}
      />

      <ContractorModal
        isOpen={isContractorModalOpen}
        onClose={() => setIsContractorModalOpen(false)}
        onSave={handleSaveContractor}
        contractorToEdit={contractorToEdit}
      />

      <EmailCopyModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        contractor={activeEmailContractor}
        company={company}
        fiscalYear={fiscalYear}
      />

      <DemoVideoModal
        isOpen={isDemoVideoOpen}
        onClose={() => setIsDemoVideoOpen(false)}
      />

      <W9ViewModal
        isOpen={isW9ModalOpen}
        onClose={() => setIsW9ModalOpen(false)}
        contractor={activeW9Contractor}
        onSignW9={handleSignW9}
      />

      <PaymentsSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        contractor={activeSummaryContractor}
        payments={payments}
        fiscalYear={fiscalYear}
      />
    </div>
  );
}
