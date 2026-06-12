import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@/core/data/auth/auth.types';

interface DashboardHeaderProps {
    user: User;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 md:mb-10 gap-6">
            <div className="flex items-center gap-4">
                <div className="hidden md:block w-1.5 h-12 bg-[#3667AA] rounded-full shrink-0"></div>
                <div>
                    <h1 className="text-[26px] md:text-[32px] font-display font-bold text-[#1C2230] tracking-tight">
                        Viagens
                    </h1>
                </div>
            </div>
        </div>
    );
};
