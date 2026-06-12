import React, { useState, useEffect } from 'react';

interface CountUpProps {
    end: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ end, prefix = '', suffix = '', decimals = 0, className = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);

            setCount(start + (end - start) * ease);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end]);

    return (
        <span className={`font-display font-bold tabular-nums ${className}`}>
            {prefix}{count.toFixed(decimals).replace('.', ',')}{suffix}
        </span>
    );
};
