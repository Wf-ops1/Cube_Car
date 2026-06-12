import React, { useState, useEffect, useCallback, useRef } from 'react';

interface NavItem {
    id: string;
    label: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'location-section', label: 'Localização' },
    { id: 'reviews-section', label: 'Avaliações' },
    { id: 'owner-section', label: 'Proprietário' },
];

/**
 * StickyNav - Scrollspy navigation for CarDetails (Desktop Only)
 * 
 * Architecture note: CarDetails is rendered inside a `createPortal` with a
 * `fixed inset-0 overflow-y-auto` container. This means `window.scroll` never
 * fires. We auto-detect the nearest scrollable ancestor on mount and attach
 * the scroll listener there.
 */
export const StickyNav: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLElement | null>(null);

    // Find the scrollable ancestor on mount
    useEffect(() => {
        if (!navRef.current) return;

        let el: HTMLElement | null = navRef.current.parentElement;
        while (el) {
            const style = getComputedStyle(el);
            if (
                style.overflowY === 'auto' ||
                style.overflowY === 'scroll' ||
                style.overflow === 'auto' ||
                style.overflow === 'scroll'
            ) {
                scrollContainerRef.current = el;
                break;
            }
            el = el.parentElement;
        }

        // Fallback to window-level scroll (shouldn't happen in this app)
        if (!scrollContainerRef.current) {
            scrollContainerRef.current = document.documentElement;
        }
    }, []);

    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Visibility: Show after the hero info section scrolls out of view
        const trigger = document.getElementById('hero-info-section');
        if (trigger) {
            const rect = trigger.getBoundingClientRect();
            setIsVisible(rect.bottom < 60); // Show when hero is scrolled past
        } else {
            // Fallback
            const scrollTop = container === document.documentElement
                ? window.scrollY
                : container.scrollTop;
            setIsVisible(scrollTop > 400);
        }

        // Scrollspy: detect active section
        let currentId = '';

        // Check if we are at the bottom of the page
        const isAtBottom = container === document.documentElement
            ? (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100
            : (container.scrollHeight - container.scrollTop) <= container.clientHeight + 100;

        if (isAtBottom && NAV_ITEMS.length > 0) {
            currentId = NAV_ITEMS[NAV_ITEMS.length - 1].id;
        } else {
            for (const item of NAV_ITEMS) {
                const section = document.getElementById(item.id);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // Active when section overlaps with the top area of viewport
                    // Adjust offset for better feel
                    if (rect.top <= 180 && rect.bottom >= 180) {
                        currentId = item.id;
                        // Don't break here, we want the last visible one if multiple act differently
                        // actually usually first visible is better for top-down reading
                        // stick with break for top-down priority
                        break;
                    }
                }
            }
        }
        setActiveSection(currentId);
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Attach to the correct scroll target
        const target = container === document.documentElement ? window : container;
        target.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => target.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToSection = (id: string) => {
        const container = scrollContainerRef.current;
        const element = document.getElementById(id);
        if (!element || !container) return;

        const navHeight = 56; // Height of this sticky nav

        if (container === document.documentElement) {
            const top = element.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        } else {
            // For overflow containers: calculate element offset relative to container
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const scrollOffset = elementRect.top - containerRect.top + container.scrollTop - navHeight;
            container.scrollTo({ top: scrollOffset, behavior: 'smooth' });
        }

        setActiveSection(id);
    };

    return (
        <div
            ref={navRef}
            className={`
        hidden lg:block sticky top-0 z-40
        bg-white/95 backdrop-blur-sm
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 border-b border-gray-100 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-8 h-20 overflow-x-auto no-scrollbar">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`
                relative px-3 py-4 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer hover:bg-gray-50 rounded-t-md
                ${activeSection === item.id
                                    ? 'text-[#3667AA] font-bold'
                                    : 'text-slate-500 hover:text-slate-800'
                                }
              `}
                        >
                            {item.label}
                            {/* Active underline indicator */}
                            <span
                                className={`
                  absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full transition-all duration-200
                  ${activeSection === item.id
                                        ? 'bg-[#3667AA] scale-x-100'
                                        : 'bg-transparent scale-x-0'
                                    }
                `}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
