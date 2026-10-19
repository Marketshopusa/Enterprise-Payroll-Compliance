import React, { useState } from 'react';
import { CompanyProfile } from '../../types';

interface CompanyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyProfile;
  onSave: (company: CompanyProfile) => void;
}

export const CompanyConfigModal: React.FC<CompanyConfigModalProps> = ({
  isOpen,
  onClose,
  company,
  onSave,
}) => {
  const [formData, setFormData] = useState<CompanyProfile>(company);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, isConfigured: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#131b2e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">business</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Configuración de la Empresa Pagadora
              </h2>
              <p className="text-xs text-slate-500">Datos oficiales del Pagador (Payer) para el Formulario 1099-NEC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Razón Social Legal (Legal Name) *
            </label>
            <input
              type="text"
              required
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
              placeholder="Ej. FiscalPay Enterprise Services LLC"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Employer Identification Number (EIN) *
              </label>
              <input
                type="text"
                required
                value={formData.ein}
                onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                placeholder="XX-XXXXXXX"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Teléfono Comercial
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(000) 000-0000"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Dirección Comercial (Calle y Número)
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="100 Montgomery St, Suite 1400"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ciudad</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="San Francisco"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estado</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                placeholder="CA"
                maxLength={2}
                className="w-full px-3 py-2 font-mono uppercase border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Código Postal</label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                placeholder="94104"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Correo de Contacto Fiscal
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="compliance@empresa.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                IRS Transmitter Code (TCC)
              </label>
              <input
                type="text"
                value={formData.transmitterControlCode || ''}
                onChange={(e) => setFormData({ ...formData, transmitterControlCode: e.target.value })}
                placeholder="Ej. FP109 (Para FIRE)"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          {/* Modal Footer */}
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
              Guardar Empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
