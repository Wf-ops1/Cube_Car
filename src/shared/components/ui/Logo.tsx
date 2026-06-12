import React from 'react';
// @ts-ignore
import logoSrc from '@/assets/logo.png';

const Logo: React.FC<{ className?: string }> = ({ className = "h-10 w-auto" }) => (
    <img
        src={logoSrc}
        alt="Cube Car Logo"
        className={`${className} object-contain select-none`}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    />
);

export default Logo;
