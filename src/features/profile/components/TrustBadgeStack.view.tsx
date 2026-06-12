import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Smartphone, Calendar, UserCheck } from 'lucide-react';

interface TrustBadgeStackProps {
    isIdentityVerified?: boolean;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    memberSince?: string; // e.g., "Maio 2024"
    className?: string;
}

const TrustBadgeStack: React.FC<TrustBadgeStackProps> = ({
    isIdentityVerified = false,
    isEmailVerified = false,
    isPhoneVerified = false,
    memberSince,
    className = ''
}) => {

    const badges = [
        {
            key: 'identity',
            active: isIdentityVerified,
            icon: ShieldCheck,
            label: 'Identidade Verificada',
            desc: 'Documento oficial validado',
            color: 'text-[#3667AA]'
        },
        {
            key: 'email',
            active: isEmailVerified,
            icon: Mail,
            label: 'Email Confirmado',
            desc: 'Contato validado',
            color: 'text-emerald-500'
        },
        {
            key: 'phone',
            active: isPhoneVerified,
            icon: Smartphone,
            label: 'Telefone Verificado',
            desc: 'Contato móvel ativo',
            color: 'text-violet-500'
        }
    ];

    return (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            <div className="flex flex-wrap justify-center gap-2">
                {badges.map((badge) => (
                    badge.active && (
                        <div key={badge.key} className="relative group cursor-help">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm transition-colors hover:border-slate-200"
                            >
                                <badge.icon size={14} className={badge.color} />
                                <span className="text-[11px] font-semibold text-slate-600 tracking-wide">{badge.label}</span>
                            </motion.div>

                            {/* Elegant Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                {badge.desc}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {memberSince && (
                <div className="flex items-center gap-2 text-slate-400 pl-1">
                    <Calendar size={13} strokeWidth={2.5} />
                    <span className="text-xs font-medium tracking-wide">Membro desde {memberSince}</span>
                </div>
            )}
        </div>
    );
};

export default TrustBadgeStack;
