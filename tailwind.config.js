/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                primary: '#3667AA', // Brand Blue
                primaryDark: '#2B5288',

                // MercuryOS-inspired Palette (Warm/Neutral Zinc)
                mercury: {
                    50: '#FAFAFA',  // Paper
                    100: '#F4F4F5', // Mist
                    200: '#E4E4E7',
                    300: '#D4D4D8',
                    400: '#A1A1AA',
                    500: '#71717A',
                    600: '#52525B',
                    700: '#3F3F46',
                    800: '#27272A', // Deep Charcoal
                    900: '#18181B', // Almost Black
                },

                // Deprecating 'typography' in favor of direct utility or mapping
                typography: {
                    primary: '#18181B',   // Zinc-900
                    secondary: '#52525B', // Zinc-600
                    tertiary: '#A1A1AA',  // Zinc-400
                    disabled: '#D4D4D8',  // Zinc-300
                    inverted: '#FAFAFA'   // Zinc-50
                },
                base: '#FAFAFA', // Warm Paper White
            },
            boxShadow: {
                'glow': '0 4px 14px 0 rgba(54, 103, 170, 0.39)',
                'glow-hover': '0 6px 20px rgba(54, 103, 170, 0.23)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.05)',
            },
            backgroundImage: {
                'premium-silver': 'linear-gradient(135deg, #F4F4F5 0%, #FFFFFF 100%)', // Updated to Zinc
                'brand-gradient': 'linear-gradient(to bottom right, #3667AA, #2B5288)',
                'footer-gradient': 'linear-gradient(90deg, #FAFAFA 0%, #F4F4F5 100%)',
            },
            animation: {
                'gradient-xy': 'gradient-xy 15s ease infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                'gradient-xy': {
                    '0%, 100%': {
                        'background-size': '400% 400%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '400% 400%',
                        'background-position': 'right center'
                    }
                },
                'shimmer': {
                    'from': {
                        'background-position': '0 0'
                    },
                    'to': {
                        'background-position': '-200% 0'
                    }
                },
                'fade-in-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(10px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                }
            },
            animation: {
                'gradient-xy': 'gradient-xy 15s ease infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
            },
        },
    },
    plugins: [],
}
