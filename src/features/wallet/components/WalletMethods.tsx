import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayoutMethod, ConfigStep, PixDetails, BankDetails } from '../types';
import { Spinner } from '@/shared/components/ui/Spinner';
import { BackButton } from '@/core/components/buttons/BackButton';

const SUPPORTED_BANKS = [
    { code: '001', name: 'Banco do Brasil' },
    { code: '104', name: 'Caixa Econômica Federal' },
    { code: '341', name: 'Itaú' },
    { code: '237', name: 'Bradesco' },
    { code: '033', name: 'Santander' },
    { code: '260', name: 'Nubank' },
    { code: '077', name: 'Banco Inter' },
    { code: '336', name: 'C6 Bank' },
];

const PIX_KEY_TYPES = [
    { value: 'cpf', label: 'CPF' },
    { value: 'cnpj', label: 'CNPJ' },
    { value: 'email', label: 'E-mail' },
    { value: 'phone', label: 'Telefone' },
    { value: 'random', label: 'Chave Aleatória' },
];

interface WalletMethodsProps {
    currentMethod: PayoutMethod | null;
    onSave: (method: PayoutMethod) => void;
    onDelete: () => void;
}

const WalletMethods: React.FC<WalletMethodsProps> = ({ currentMethod, onSave, onDelete }) => {
    const [configStep, setConfigStep] = useState<ConfigStep>(currentMethod ? 'success' : 'method-select');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Temp Form States
    const [tempPix, setTempPix] = useState<PixDetails>({ keyType: 'cpf', key: '' });
    const [tempBank, setTempBank] = useState<BankDetails>({ bankCode: '', agency: '', account: '', digit: '', accountType: 'corrente' });

    const handleSave = () => {
        setConfigStep('saving');
        setTimeout(() => {
            const method: PayoutMethod = configStep === 'form-pix'
                ? { type: 'pix', details: tempPix }
                : { type: 'bank', details: tempBank };
            onSave(method);
            setConfigStep('success');
        }, 1200);
    };

    return (
        <div className="max-w-xl mx-auto px-6 py-20 lg:py-32">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-typography-primary mb-16">
                Configurações de Recebimento
            </h3>

            <AnimatePresence mode="wait">
                {configStep === 'method-select' && (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <p className="text-sm text-typography-tertiary mb-10 leading-relaxed">
                            Para garantir a segurança das suas transações, escolha como deseja que os valores sejam creditados em sua conta pessoal.
                        </p>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => setConfigStep('form-pix')}
                                className="group flex items-center justify-between p-8 border border-gray-100 rounded-[2rem] hover:border-typography-primary transition-all text-left bg-white/50"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 flex items-center justify-center text-typography-tertiary group-hover:text-typography-primary transition-colors">
                                        <i className="fas fa-qrcode text-2xl"></i>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Instantâneo</span>
                                        <p className="text-base font-display font-bold text-typography-primary">Chave Pix</p>
                                    </div>
                                </div>
                                <i className="fas fa-chevron-right text-[10px] text-gray-300 group-hover:text-typography-primary transition-colors"></i>
                            </button>

                            <button
                                onClick={() => setConfigStep('form-bank')}
                                className="group flex items-center justify-between p-8 border border-gray-100 rounded-[2rem] hover:border-typography-primary transition-all text-left bg-white/50"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 flex items-center justify-center text-typography-tertiary group-hover:text-typography-primary transition-colors">
                                        <i className="fas fa-university text-2xl"></i>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-typography-tertiary uppercase tracking-widest mb-1">Tradicional</span>
                                        <p className="text-base font-display font-bold text-typography-primary">Transferência Bancária</p>
                                    </div>
                                </div>
                                <i className="fas fa-chevron-right text-[10px] text-gray-300 group-hover:text-typography-primary transition-colors"></i>
                            </button>
                        </div>
                    </motion.div>
                )}

                {(configStep === 'form-pix' || configStep === 'form-bank') && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-10"
                    >
                        <div className="space-y-2">
                            <h4 className="text-2xl font-display font-bold text-typography-primary">
                                {configStep === 'form-pix' ? 'Dados do Pix' : 'Dados Bancários'}
                            </h4>
                            <p className="text-xs text-typography-tertiary uppercase tracking-widest">Preencha com atenção para evitar falhas</p>
                        </div>

                        <div className="space-y-6">
                            {configStep === 'form-pix' ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-typography-tertiary ml-1">Tipo de Chave</label>
                                        <div className="relative">
                                            <div
                                                onClick={() => setOpenDropdown(openDropdown === 'pix' ? null : 'pix')}
                                                className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium flex justify-between items-center cursor-pointer hover:border-typography-primary transition-all"
                                            >
                                                {PIX_KEY_TYPES.find(t => t.value === tempPix.keyType)?.label}
                                                <i className={`fas fa-chevron-down text-[10px] transition-transform ${openDropdown === 'pix' ? 'rotate-180' : ''}`}></i>
                                            </div>
                                            {openDropdown === 'pix' && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                                                    {PIX_KEY_TYPES.map(t => (
                                                        <div
                                                            key={t.value}
                                                            onClick={() => { setTempPix({ ...tempPix, keyType: t.value }); setOpenDropdown(null); }}
                                                            className="px-6 py-4 hover:bg-gray-50 text-sm font-medium cursor-pointer"
                                                        >
                                                            {t.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-typography-tertiary ml-1">Valor da Chave</label>
                                        <input
                                            type="text"
                                            value={tempPix.key}
                                            onChange={e => setTempPix({ ...tempPix, key: e.target.value })}
                                            className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-typography-primary transition-all"
                                            placeholder="Digite sua chave aqui"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-typography-tertiary ml-1">Banco</label>
                                        <div className="relative">
                                            <div
                                                onClick={() => setOpenDropdown(openDropdown === 'bank' ? null : 'bank')}
                                                className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium flex justify-between items-center cursor-pointer hover:border-typography-primary transition-all"
                                            >
                                                {tempBank.bankCode ? SUPPORTED_BANKS.find(b => b.code === tempBank.bankCode)?.name : 'Selecione o banco'}
                                                <i className={`fas fa-chevron-down text-[10px] transition-transform ${openDropdown === 'bank' ? 'rotate-180' : ''}`}></i>
                                            </div>
                                            {openDropdown === 'bank' && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-50">
                                                    {SUPPORTED_BANKS.map(b => (
                                                        <div
                                                            key={b.code}
                                                            onClick={() => { setTempBank({ ...tempBank, bankCode: b.code }); setOpenDropdown(null); }}
                                                            className="px-6 py-4 hover:bg-gray-50 text-sm font-medium cursor-pointer"
                                                        >
                                                            {b.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-typography-tertiary ml-1">Agência</label>
                                        <input type="text" value={tempBank.agency} onChange={e => setTempBank({ ...tempBank, agency: e.target.value })} className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-typography-primary transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-typography-tertiary ml-1">Conta e Dígito</label>
                                        <div className="flex gap-2">
                                            <input type="text" value={tempBank.account} onChange={e => setTempBank({ ...tempBank, account: e.target.value })} className="flex-1 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-typography-primary transition-all" />
                                            <input type="text" value={tempBank.digit} onChange={e => setTempBank({ ...tempBank, digit: e.target.value })} className="w-16 bg-white border border-gray-100 rounded-2xl px-4 py-4 text-sm font-medium outline-none text-center focus:border-typography-primary transition-all" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleSave}
                                className="w-full bg-typography-primary text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
                            >
                                Salvar Configurações
                            </button>
                            <div className="flex justify-center w-full">
                                <BackButton onClick={() => setConfigStep('method-select')} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {configStep === 'saving' && (
                    <motion.div key="saving" className="py-20 flex flex-col items-center justify-center space-y-6">
                        <Spinner size="lg" color="primary" />
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-typography-tertiary text-center">Criptografando seus dados...</p>
                    </motion.div>
                )}

                {configStep === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-12"
                    >
                        <div className="p-10 border border-emerald-100 bg-emerald-50/20 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 relative overflow-hidden group hover:border-emerald-200 transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <i className="fas fa-check text-2xl"></i>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xl font-display font-bold text-typography-primary">
                                    {currentMethod?.type === 'pix' ? 'Pix Configurado' : 'Conta Bancária Ativa'}
                                </h4>
                                <p className="text-sm text-typography-tertiary leading-relaxed">
                                    Sua identidade financeira foi validada. O sistema agora sabe como entregar seus ganhos.
                                </p>
                            </div>

                            <div className="w-full pt-6 border-t border-emerald-100/50 flex flex-col items-center">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">DADOS ATUAIS</p>
                                <p className="text-xs font-mono text-typography-secondary bg-white px-4 py-2 rounded-xl shadow-sm">
                                    {currentMethod?.type === 'pix'
                                        ? (currentMethod.details as PixDetails).key
                                        : `${(currentMethod?.details as BankDetails).agency} / ${(currentMethod?.details as BankDetails).account}-${(currentMethod?.details as BankDetails).digit}`
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-8">
                            <button
                                onClick={() => setConfigStep('method-select')}
                                className="text-[11px] font-bold text-typography-tertiary hover:text-typography-primary uppercase tracking-widest transition-colors"
                            >
                                Alterar Método
                            </button>
                            <div className="w-px h-4 bg-gray-200"></div>
                            <button
                                onClick={onDelete}
                                className="text-[11px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                            >
                                Remover Vínculo
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WalletMethods;
