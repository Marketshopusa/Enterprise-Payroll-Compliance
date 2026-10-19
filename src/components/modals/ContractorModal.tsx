import React, { useState } from 'react';
import { Contractor, TinType, W9Status } from '../../types';

interface ContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractor: Contractor) => void;
  contractorToEdit?: Contractor | null;
}

export const ContractorModal: React.FC<ContractorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contractorToEdit,
}) => {
  const [name, setName] = useState(contractorToEdit?.name || '');
  const [businessName, setBusinessName] = useState(contractorToEdit?.businessName || '');
  const [tinType, setTinType] = useState<TinType>(contractorToEdit?.tinType || 'SSN');
  const [tin, setTin] = useState(contractorToEdit?.tin || '');
  const [address, setAddress] = useState(contractorToEdit?.address || '');
  const [city, setCity] = useState(contractorToEdit?.city || '');
  const [state, setState] = useState(contractorToEdit?.state || 'CA');
  const [zip, setZip] = useState(contractorToEdit?.zip || '');
  const [phone, setPhone] = useState(contractorToEdit?.phone || '');
  const [email, setEmail] = useState(contractorToEdit?.email || '');
  const [w9Status, setW9Status] = useState<W9Status>(contractorToEdit?.w9Status || 'signed');
  const [accountNumber, setAccountNumber] = useState(contractorToEdit?.accountNumber || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved: Contractor = {
      id: contractorToEdit?.id || `cont-${Date.now()}`,
      name: name.trim(),
      businessName: businessName.trim() || undefined,
      tinType,
      tin: tin.trim() || '000-00-0000',
      address: address.trim() || 'Dirección Comercial',
      city: city.trim() || 'San Francisco',
      state: state.trim().toUpperCase() || 'CA',
      zip: zip.trim() || '94101',
      phone: phone.trim() || '(000) 000-0000',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      w9Status,
      w9SignedDate: w9Status === 'signed' ? contractorToEdit?.w9SignedDate || '2024-01-15' : undefined,
      tinMatched: true,
      accountNumber: accountNumber.trim() || undefined,
      secondTinNotice: false,
    };

    onSave(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006c4a] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">person_add</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                {contractorToEdit ? 'Editar Contratista 1099' : 'Nuevo Contratista Independiente'}
              </h2>
              <p className="text-xs text-slate-500">Datos fiscales oficiales para emisión de Formulario 1099-NEC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 overflow-y-auto text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nombre Completo del Contratista *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Elena Rostova"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Razón Social / Nombre Comercial (DBA)
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ej. Rostova Design Studio LLC"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tipo de Identificación Fiscal</label>
              <select
                value={tinType}
                onChange={(e) => setTinType(e.target.value as TinType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="SSN">SSN (Social Security Number)</option>
                <option value="EIN">EIN (Employer ID Number)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Número de TIN / SSN *
              </label>
              <input
                type="text"
                required
                value={tin}
                onChange={(e) => setTin(e.target.value)}
                placeholder={tinType === 'SSN' ? '000-00-0000' : '00-0000000'}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Dirección Fiscal</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="742 Evergreen Terrace, Apt 4B"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ciudad</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estado</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="CA"
                maxLength={2}
                className="w-full px-3 py-2 font-mono uppercase border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">ZIP Code</label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="94110"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@rostova.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(415) 555-0192"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estado Formulario W-9</label>
              <select
                value={w9Status}
                onChange={(e) => setW9Status(e.target.value as W9Status)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="signed">W-9 Firmado y Archivado</option>
                <option value="pending">W-9 Pendiente de Envío / Firma</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">N° de Cuenta / ID Contratista</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Ej. CNT-9401"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

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
              {contractorToEdit ? 'Actualizar Contratista' : 'Guardar Contratista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
