import React, { useState } from 'react';
import { CompanyProfile, Language } from '../types';
import { translations } from '../utils/translations';

interface SettingsViewProps {
  company: CompanyProfile;
  onSaveCompany: (company: CompanyProfile) => void;
  lang: Language;
  irsFireConfigured: boolean;
  onToggleIrsFire: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  company,
  onSaveCompany,
  lang,
  irsFireConfigured,
  onToggleIrsFire,
}) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<CompanyProfile>(company);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCompany({ ...formData, isConfigured: true });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-[#f8f9ff]">
      <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight font-heading">
            Configuración de la Empresa & Cumplimiento IRS
          </h1>
          <p className="text-xs text-[#45464d] mt-1">
            Administra los datos patronales oficiales, credenciales de transmisión electrónica FIRE y preferencias del sistema.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Configuración de la empresa actualizada con éxito.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#c6c6cd]/70 shadow-xs p-6 space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="font-heading font-bold text-sm text-[#0b1c30]">
              Identificación Patronal Oficial (Payer Information)
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              IRS Publication 1179 Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Razón Social Legal (Legal Name) *
              </label>
              <input
                type="text"
                required
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nombre Comercial (DBA / Trade Name)
              </label>
              <input
                type="text"
                value={formData.tradeName || ''}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                placeholder="Opcional"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="font-semibold text-slate-700 block mb-1">Teléfono</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Correo de Cumplimiento</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Dirección Comercial
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ciudad</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estado</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                maxLength={2}
                className="w-full px-3 py-2 font-mono uppercase border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Código Postal (ZIP)</label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h3 className="font-heading font-bold text-sm text-[#0b1c30] mb-3">
              Configuración de Transmisión Electrónica IRS FIRE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Transmitter Control Code (TCC) de 5 dígitos
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={formData.transmitterControlCode || ''}
                  onChange={(e) => setFormData({ ...formData, transmitterControlCode: e.target.value })}
                  placeholder="Ej. FP109"
                  className="w-full px-3 py-2 font-mono uppercase border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-800">Estado Conexión FIRE</p>
                  <p className="text-[11px] text-slate-500">
                    {irsFireConfigured ? 'Validado para transmisión digital' : 'Pendiente de credenciales TCC'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleIrsFire}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    irsFireConfigured
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {irsFireConfigured ? 'Configurado ✓' : 'Activar Modo FIRE'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#006c4a] hover:bg-[#005137] text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Guardar Cambios de Configuración
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
