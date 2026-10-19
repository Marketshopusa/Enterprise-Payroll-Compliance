import React, { useState } from 'react';
import { CompanyProfile, Contractor } from '../../types';

interface EmailCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractor: Contractor | null;
  company: CompanyProfile;
  fiscalYear: number;
}

export const EmailCopyModal: React.FC<EmailCopyModalProps> = ({
  isOpen,
  onClose,
  contractor,
  company,
  fiscalYear,
}) => {
  const [recipientEmail, setRecipientEmail] = useState(contractor?.email || '');
  const [subject, setSubject] = useState(
    `Formulario Oficial IRS 1099-NEC (${fiscalYear}) - ${company.legalName}`
  );
  const [sent, setSent] = useState(false);

  if (!isOpen || !contractor) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006c4a] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">mail</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Enviar Copia B por Correo Electrónico
              </h2>
              <p className="text-xs text-slate-500">Entrega electrónica segura certificada para el contratista</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#006c4a] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              ¡Copia B Enviada con Éxito!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Se ha remitido el Formulario 1099-NEC adjunto en PDF a <strong className="text-slate-800">{recipientEmail}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Destinatario (Email del Contratista)</label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Asunto</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1.5 leading-relaxed">
              <p className="font-bold text-slate-900">Estimado/a {contractor.name}:</p>
              <p className="text-[11px]">
                Adjunto encontrará su <strong>Formulario 1099-NEC (Copy B - For Recipient)</strong> correspondiente al año fiscal {fiscalYear}, emitido por {company.legalName}.
              </p>
              <p className="text-[11px]">
                Este documento certifica las compensaciones por servicios no dependientes percibidas durante el ejercicio fiscal para su declaración tributaria ante el IRS.
              </p>
            </div>

            {/* Attachment pill */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[#006c4a]">
              <span className="material-symbols-outlined text-lg">attachment</span>
              <div className="flex-1 truncate">
                <p className="font-semibold text-xs truncate">
                  IRS_Form_1099-NEC_CopyB_{contractor.name.replace(/\s+/g, '_')}_{fiscalYear}.pdf
                </p>
                <p className="text-[10px] text-emerald-800">Documento Oficial Certificado • 184 KB</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#006c4a] hover:bg-[#005137] text-white rounded-lg font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Enviar Comprobante</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
