import { useState, useEffect } from 'react';

/**
 * Hook to detect mobile viewport.
 * Uses matchMedia for performance (instead of resize listeners).
 * Breakpoint synchronization with Tailwind 'lg' (1024px).
 */
export const useIsMobile = (breakpoint = 1024) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Safe check for SSR
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

        const update = () => setIsMobile(media.matches);

        // Initial check
        update();

        // Listener
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, [breakpoint]);

    return isMobile;
};
