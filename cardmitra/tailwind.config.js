/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#f0f0ff',
                    100: '#e0e0ff',
                    200: '#c4c4ff',
                    300: '#a0a0ff',
                    400: '#7c7cfa',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                brand: {
                    red: '#a82d2d',
                    gold: '#f59e0b',
                    green: '#10b981',
                    blue: '#0ea5e9',
                }
            },
            animation: {
                'slide-in': 'slideIn 0.4s ease-out',
                'fade-in': 'fadeIn 0.3s ease-out',
                'pulse-slow': 'pulse 3s infinite',
                'card-flip': 'cardFlip 0.6s ease-in-out',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                slideIn: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                cardFlip: {
                    '0%': { transform: 'rotateY(0deg)' },
                    '50%': { transform: 'rotateY(90deg)' },
                    '100%': { transform: 'rotateY(0deg)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                }
            }
        },
    },
    plugins: [],
}
