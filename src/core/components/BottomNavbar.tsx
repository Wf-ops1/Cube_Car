import React from 'react';
// import { motion } from 'framer-motion'; // Removed for CSS Performance
import { Compass, Map, MessageCircle, User } from 'lucide-react';

interface BottomNavbarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    user: any;
    onLoginClick?: () => void;
    forceHidden?: boolean; // [UX] Allow external control (e.g. chat search)
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ activePage, onNavigate, user, onLoginClick, forceHidden = false }) => {
    const navItems = [
        { id: 'home', label: 'Explorar', icon: Compass },
        { id: 'dashboard', label: 'Viagens', icon: Map },
        { id: 'chat', label: 'Mensagens', icon: MessageCircle },
        { id: 'profile', label: 'Perfil', icon: User },
    ];

    // Scroll Logic for "Immersive Mode"
    const [isVisible, setIsVisible] = React.useState(true);
    const lastScrollY = React.useRef(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if scrolling UP or at the very top
            if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
                setIsVisible(true);
            }
            // Hide if scrolling DOWN and not at the top
            else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            id="bottom-navbar"
            className={`md:hidden fixed bottom-6 left-0 right-0 z-[90] flex justify-center pointer-events-none transition-all duration-500 ease-in-out ${isVisible && !forceHidden ? 'translate-y-0 opacity-100' : 'translate-y-[200px] opacity-0'
                }`}
        >
            <div className="pointer-events-auto w-[85%] max-w-[400px]">
                {/* Container Glass - Taller & Wider per request */}
                <div className="bg-white/90  backdrop-blur-2xl border border-white/60  rounded-[2.5rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] h-[70px] px-6 flex items-center justify-between">

                    {navItems.map((item) => {
                        const isActive = activePage === item.id || (item.id === 'profile' && (activePage === 'wallet' || activePage === 'favorites' || activePage === 'financial' || activePage === 'owner-center'));
                        const isRestricted = !user && item.id !== 'home';
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                }}
                                className="relative w-20 h-full flex flex-col items-center justify-center outline-none tap-highlight-transparent"
                            >
                                {/* Floating Circle Background (CSS Optimized) */}
                                <div
                                    className={`absolute z-20 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive
                                        // Solid Brand Blue for Navigation Consistency
                                        ? 'bg-[#3667AA] text-white shadow-xl shadow-blue-900/20 ring-4 ring-white/20 -translate-y-[34px] scale-110'
                                        : 'bg-transparent text-mercury-400  hover:bg-slate-50 -translate-y-[10px] scale-100'
                                        }`}
                                >
                                    <Icon
                                        size={22}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className="relative z-10"
                                    />
                                </div>

                                {/* Label - "Estado Neutro" always visible but distinct color */}
                                <span
                                    className={`absolute bottom-3 text-[10px] font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-[#3667AA]' : 'text-mercury-400'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BottomNavbar;
