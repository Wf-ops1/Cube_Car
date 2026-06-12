export interface ProfileMenuItem {
    id: string;
    label: string;
    icon: string;
    highlight?: boolean;
    sub?: string;
    badge?: string;
    badgeColor?: string;
    desktopOnly?: boolean;
}

export interface ProfileSection {
    title: string;
    items: ProfileMenuItem[];
}

import { User } from '@/core/data/auth/auth.types';

export const getProfileMenuSections = (user: User): ProfileSection[] => {

    // Logic for verification status badge
    const getVerificationBadge = (status?: string) => {
        switch (status) {
            case 'APPROVED': return { text: 'Verificado', color: 'bg-emerald-100 text-emerald-600' };
            case 'IN_REVIEW': return { text: 'Em Análise', color: 'bg-amber-100 text-amber-600' };
            case 'REJECTED': return { text: 'Ação Necessária', color: 'bg-rose-100 text-rose-600' };
            default: return { text: 'Não Verificado', color: 'bg-slate-100 text-slate-500' };
        }
    };

    const verifStatus = getVerificationBadge(user.verification?.status);

    return [
        {
            title: '',
            items: [
                { id: 'chat', label: 'Mensagens', icon: 'fa-comment-dots', badge: '3', desktopOnly: true },
            ]
        },
        {
            title: 'Motorista',
            items: [
                { id: 'trips', label: 'Minhas Viagens', icon: 'fa-map', desktopOnly: true },
            ]
        },
        {
            title: 'Proprietário',
            items: [
                {
                    id: 'host',
                    label: 'Anuncie seu carro',
                    icon: 'fa-key',
                    highlight: true,
                    sub: 'Comece a ganhar'
                },
                {
                    id: 'owner-center',
                    label: 'Painel do Anfitrião',
                    icon: 'fa-rocket',
                    highlight: false,
                    sub: 'Gerenciar frota'
                },
                { id: 'wallet', label: 'Carteira', icon: 'fa-wallet', sub: 'Saldo e Cartões' },
            ]
        },
        {
            title: 'Minha Conta',
            items: [
                { id: 'profile-edit', label: 'Ver Perfil', icon: 'fa-user-circle' },
                { id: 'favorites', label: 'Favoritos', icon: 'fa-heart' },
                {
                    id: 'verification',
                    label: 'Centro de Verificação',
                    icon: 'fa-lock',
                    badge: verifStatus.text,
                    badgeColor: verifStatus.color
                },
            ]
        },
        {
            title: 'Preferências e Suporte',
            items: [
                { id: 'settings', label: 'Configurações', icon: 'fa-cog' },
                { id: 'help', label: 'Central de Ajuda', icon: 'fa-circle-question' },
                { id: 'logout', label: 'Sair', icon: 'fa-sign-out-alt' },
            ]
        }
    ];
};
