import { useState, useEffect } from 'react';

/**
 * [Defensive Mobile UX]
 * 
 * This hook is the "Big Hammer" for fixing mobile keyboard layout issues.
 * It does two critical things:
 * 
 * 1. VISUAL VIEWPORT RESIZE:
 *    Instead of relying on '100dvh' (which is flaky when keyboard opens),
 *    we explicitly listen to 'window.visualViewport' resize events.
 *    We set the container height to EXACTLY what the browser reports as visible.
 * 
 * 2. BODY SCROLL LOCK:
 *    To prevent the "Rubber Band" effect (where scrolling the footer moves the whole page),
 *    we force 'overflow: hidden' on the <body> tag while this component is mounted.
 *    This ensures that ONLY the internal message list can scroll, not the app shell.
 */
export const useMobileViewportFix = (isActive: boolean) => {
    const [viewportHeight, setViewportHeight] = useState('100%');

    useEffect(() => {
        // Only run this logic on mobile devices or small screens
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile || !isActive) {
            setViewportHeight('100%');
            return;
        }

        // 1. HANDLER: Sync State with Visual Viewport
        const handleResize = () => {
            if (window.visualViewport) {
                // We use a small buffer (-1px) to avoid any sub-pixel rounding issues causing scrollbars
                setViewportHeight(`${window.visualViewport.height}px`);

                // Force scroll to top disabled - interferes with user context
                // window.scrollTo(0, 0);
            }
        };

        // 2. SETUP: Initial read + Event Listeners
        if (window.visualViewport) {
            handleResize(); // Set initial
            window.visualViewport.addEventListener('resize', handleResize);
            window.visualViewport.addEventListener('scroll', handleResize);
        }

        // 3. DEFENSE: Lock Body AND HTML Scroll
        // This is the "Nuclear Option" against rubber-banding and ghost scrolling
        const originalBodyOverflow = document.body.style.overflow;
        const originalBodyPosition = document.body.style.position;
        const originalBodyWidth = document.body.style.width;

        const originalHtmlOverflow = document.documentElement.style.overflow; // [FIX] Lock HTML too

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed'; // Hard lock
        document.body.style.width = '100%';

        document.documentElement.style.overflow = 'hidden'; // [FIX] Prevent root scroll

        // 4. CLEANUP: Force Restore
        // We force reset to empty string to ensuring the page is ALWAYS scrollable after this hook unmounts.
        // Restoring 'originalBodyOverflow' is risky because if it was already hidden (race condition), we'd lock it forever.
        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
                window.visualViewport.removeEventListener('scroll', handleResize);
            }
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';

            document.documentElement.style.overflow = '';
        };
    }, [isActive]);

    return { viewportHeight };
};
