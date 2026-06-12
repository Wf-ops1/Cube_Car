import React from 'react';

interface ContactSupportCardProps {
    onContact: () => void;
}

export const ContactSupportCard: React.FC<ContactSupportCardProps> = ({ onContact }) => {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0F172A] text-white p-8 md:p-12 text-center shadow-2xl shadow-slate-900/40">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
                <h2 className="text-2xl font-display font-medium mb-3" style={{ color: '#FFFFFF' }}>Ainda precisa de ajuda?</h2>
                <p className="mb-8 max-w-lg mx-auto text-blue-100 leading-relaxed font-light" style={{ color: '#E0F2FE' }}>
                    Nossa equipe de suporte está disponível 24 horas por dia, 7 dias por semana para garantir a sua tranquilidade.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onContact}
                        className="bg-white text-[#3667AA] font-bold py-3.5 px-8 rounded-xl shadow-lg hover:bg-slate-50 hover:scale-105 transition-all flex items-center justify-center gap-2"
                        style={{ color: '#3667AA' }}
                    >
                        <i className="far fa-envelope"></i> Fale Conosco
                    </button>
                    <button className="bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2" style={{ color: '#FFFFFF' }}>
                        <i className="fab fa-whatsapp text-emerald-400 text-lg"></i> WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};
