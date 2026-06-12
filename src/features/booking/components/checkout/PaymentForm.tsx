import React from 'react';

interface PaymentInputProps {
    field: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    onFocus: () => void;
    hasError: boolean;
    isLast?: boolean;
    halfWidth?: boolean;
    noBorder?: boolean;
    maxLength?: number;
    inputMode?: 'text' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
}

const PaymentInput: React.FC<PaymentInputProps> = ({
    field, placeholder, value, onChange, onFocus, hasError,
    isLast = false, halfWidth = false, noBorder = false, maxLength, inputMode = 'text'
}) => {
    const errorMessage = field === 'cpf' ? "Verifique seu CPF" : "Esta informação é obrigatória.";
    const errorColor = '#EF4444';

    return (
        <div className={`relative ${halfWidth ? 'w-1/2' : 'w-full'} ${!isLast && !noBorder ? 'border-b border-gray-200' : ''} ${halfWidth && !isLast ? 'border-r border-gray-200' : ''}`}>
            <input type="text" inputMode={inputMode} maxLength={maxLength} placeholder={placeholder}
                value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus}
                className={`w-full px-4 py-4 outline-none text-base transition-colors bg-white font-medium ${hasError ? 'placeholder-red-300' : 'placeholder-[#555B66]'}`}
                style={{ color: hasError ? errorColor : '#1C2230' }}
            />
            {hasError && (
                <div className="px-4 pb-2 bg-white">
                    <p className="text-xs font-bold flex items-center gap-1" style={{ color: errorColor }}>
                        <i className="fas fa-exclamation-circle"></i> {errorMessage}
                    </p>
                </div>
            )}
        </div>
    );
};

interface PaymentFormProps {
    paymentMethod: 'credit_card' | 'pix' | null;
    setPaymentMethod: (m: 'credit_card' | 'pix') => void;
    cardData: any;
    updateField: (field: string, val: string) => void;
    fieldErrors: Record<string, boolean>;
    setFieldErrors: (errors: any) => void;
    total: number;
    handleNextStep: () => void;
    showFooter?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
    paymentMethod, setPaymentMethod, cardData, updateField, fieldErrors, setFieldErrors, total, handleNextStep, showFooter = true
}) => {
    return (
        <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100/50 shadow-[0_20px_40px_-4px_rgba(0,0,0,0.08)]">
            <h3 className="text-xl font-display font-bold mb-8" style={{ color: '#1C2230' }}>
                <span className="hidden lg:inline">1. </span>Forma de pagamento
            </h3>
            <div className="space-y-6">
                <div>
                    <div onClick={() => { setPaymentMethod('pix'); setFieldErrors({}); }} className="cursor-pointer group">
                        <div className={`flex items-start justify-between mb-4 p-4 rounded-2xl transition-colors border ${paymentMethod === 'pix' ? 'border-[#1C2230] bg-gray-50' : 'border-transparent hover:bg-gray-50 hover:border-gray-100'}`}>
                            <div className="flex gap-4">
                                <div className="pt-1 mt-0.5"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-[#00B686]"><svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2L4 10L12 18L20 10L12 2Z" /><path d="M12 6L8 10L12 14L16 10L12 6Z" fill="#fff" /></svg></span></div>
                                <div>
                                    <p className="font-bold text-base" style={{ color: '#1C2230' }}>Pix</p>
                                    <p className="text-sm font-medium" style={{ color: '#555B66' }}>Aprovação imediata (Simulado)</p>
                                </div>
                            </div>
                            <div className="relative flex items-center pt-2">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'pix' ? 'border-[#1C2230]' : 'border-gray-300'}`}>
                                    {paymentMethod === 'pix' && <div className="w-2.5 h-2.5 rounded-full bg-[#1C2230]"></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {paymentMethod === 'pix' && (
                        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6 animate-fade-in-up shadow-sm">
                            <PaymentInput field="name" placeholder="Nome" value={cardData.name} onChange={(val) => updateField('name', val)} onFocus={() => setFieldErrors({ ...fieldErrors, name: false })} hasError={!!fieldErrors['name']} />
                            <PaymentInput field="surname" placeholder="Sobrenome" value={cardData.surname} onChange={(val) => updateField('surname', val)} onFocus={() => setFieldErrors({ ...fieldErrors, surname: false })} hasError={!!fieldErrors['surname']} />
                            <PaymentInput field="cpf" placeholder="CPF" value={cardData.cpf} onChange={(val) => updateField('cpf', val)} onFocus={() => setFieldErrors({ ...fieldErrors, cpf: false })} hasError={!!fieldErrors['cpf']} isLast={true} maxLength={14} inputMode="numeric" />
                        </div>
                    )}
                </div>
                <div className="h-px mx-4" style={{ backgroundColor: '#D1D5DB' }}></div>
                <div>
                    <div onClick={() => { setPaymentMethod('credit_card'); setFieldErrors({}); }} className="cursor-pointer group pt-2">
                        <div className="flex items-start justify-between mb-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex gap-4">
                                <div className="pt-1 mt-0.5 text-[#1C2230]"><div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3667AA]"><i className="far fa-credit-card text-lg"></i></div></div>
                                <div>
                                    <p className="font-bold text-base" style={{ color: '#1C2230' }}>Cartão de crédito</p>
                                    <p className="text-sm font-medium" style={{ color: '#555B66' }}>Até 12x de R${(total / 12).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'credit_card' ? 'border-[#1C2230]' : 'border-gray-300'}`}>
                                {paymentMethod === 'credit_card' && <div className="w-2.5 h-2.5 rounded-full bg-[#1C2230]"></div>}
                            </div>
                        </div>
                    </div>
                    {paymentMethod === 'credit_card' && (
                        <div className="space-y-4 animate-fade-in-up px-1">
                            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                <PaymentInput field="cardNumber" placeholder="Número do cartão" value={cardData.cardNumber} onChange={(val) => updateField('cardNumber', val)} onFocus={() => setFieldErrors({ ...fieldErrors, cardNumber: false })} hasError={!!fieldErrors['cardNumber']} maxLength={16} inputMode="numeric" />
                                <div className="flex w-full">
                                    <PaymentInput field="expiry" placeholder="MM/AA" value={cardData.expiry} onChange={(val) => updateField('expiry', val)} onFocus={() => setFieldErrors({ ...fieldErrors, expiry: false })} hasError={!!fieldErrors['expiry']} noBorder={true} halfWidth={true} maxLength={5} inputMode="numeric" />
                                    <PaymentInput field="cvc" placeholder="CVV" value={cardData.cvc} onChange={(val) => updateField('cvc', val)} onFocus={() => setFieldErrors({ ...fieldErrors, cvc: false })} hasError={!!fieldErrors['cvc']} isLast={true} halfWidth={true} maxLength={4} inputMode="numeric" />
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                <PaymentInput field="name" placeholder="Nome impresso no cartão" value={cardData.name} onChange={(val) => updateField('name', val)} onFocus={() => setFieldErrors({ ...fieldErrors, name: false })} hasError={!!fieldErrors['name']} />
                                <PaymentInput field="cpf" placeholder="CPF do titular" value={cardData.cpf} onChange={(val) => updateField('cpf', val)} onFocus={() => setFieldErrors({ ...fieldErrors, cpf: false })} hasError={!!fieldErrors['cpf']} isLast={true} maxLength={14} inputMode="numeric" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showFooter && (
                <div className="hidden lg:flex justify-end mt-10">
                    <button onClick={handleNextStep} className="bg-[#3667AA] text-white font-bold py-4 px-10 rounded-2xl hover:opacity-95 transition-all text-base shadow-lg hover:shadow-xl active:scale-95">
                        Continuar
                    </button>
                </div>
            )}
        </div>
    );
};
