import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'current' | 'white' | 'primary' | 'slate';

interface SpinnerProps {
    /** 
     *  sm: 16px (botões e inline)
     *  md: 24px (cards pequenos)
     *  lg: 32px (cards grandes e seções)
     *  xl: 48px (full-page loader)
     */
    size?: SpinnerSize;

    /** 
     * Cor do spinner 
     * current: Herda a cor do texto do pai (ideal para botões)
     * primary: '#3667AA' (Brand blue)
     * white: '#FFFFFF' (Para fundos escuros independentes)
     * slate: Cinza claro (para carregamentos neutros)
     */
    color?: SpinnerColor;
    className?: string;

    /** Tipo de renderização */
    variant?: 'border' | 'svg';
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    color = 'current',
    className = '',
    variant = 'border'
}) => {
    // Mapeamento de dimensões
    const sizeMap: Record<SpinnerSize, string> = {
        sm: 'w-4 h-4',   // svg: 16x16, div: 16x16 border-2
        md: 'w-6 h-6',   // svg: 24x24, div: 24x24 border-2
        lg: 'w-8 h-8',   // svg: 32x32, div: 32x32 border-[3px]
        xl: 'w-12 h-12'  // svg: 48x48, div: 48x48 border-4
    };

    // Mapeamento de cores de borda para variant='border'
    const colorMapBorder: Record<SpinnerColor, string> = {
        current: 'border-current border-t-transparent',
        white: 'border-white/30 border-t-white',
        primary: 'border-[#3667AA]/30 border-t-[#3667AA]',
        slate: 'border-slate-200 border-t-slate-800'
    };

    // Mapeamento de cores para variant='svg' (fill e stroke)
    const colorMapSvg: Record<SpinnerColor, string> = {
        current: 'text-current',
        white: 'text-white',
        primary: 'text-[#3667AA]',
        slate: 'text-slate-800'
    };

    const borderThickness = size === 'xl' ? 'border-4' : size === 'lg' ? 'border-[3px]' : 'border-2';

    if (variant === 'svg') {
        return (
            <svg
                className={`animate-spin ${sizeMap[size]} ${colorMapSvg[color]} ${className}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        );
    }

    return (
        <div
            className={`inline-block ${sizeMap[size]} ${borderThickness} ${colorMapBorder[color]} rounded-full animate-spin ${className}`}
        />
    );
};
