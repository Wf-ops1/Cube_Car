import React from 'react';

export const SafeEnvironmentNotice: React.FC = () => {
    return (
        <div className="flex flex-col items-center text-center gap-2 mb-6 mx-auto max-w-[85%] md:max-w-[260px] shrink-0">
            <i className="fas fa-shield-alt text-slate-500 text-sm mb-1"></i>
            <div className="text-xs text-slate-600 leading-relaxed font-medium whitespace-normal break-words">
                <span className="font-bold text-slate-800 block mb-1">Ambiente Seguro</span>
                Para sua segurança, mantenha as conversas e pagamentos sempre dentro da plataforma.
            </div>
        </div>
    );
};
