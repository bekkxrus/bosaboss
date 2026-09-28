/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'red-primary': '#FF0000',
        'red-secondary': '#CC0000',
        'red-tertiary': '#990000',
        'black-primary': '#000000',
        'black-secondary': '#1a0000',
        'black-tertiary': '#330000',
        'dark-primary': '#000000',
        'dark-secondary': '#1a0000',
        'dark-tertiary': '#330000',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, #000000, #1a0000)',
        'section-gradient': 'linear-gradient(to top, #000000, #330000)',
        'card-gradient': 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(26,0,0,0.8))',
        'button-gradient': 'linear-gradient(135deg, #FF0000, #CC0000)',
       'hero-pattern': "linear-gradient(rgba(0,0,0,0.85), rgba(26,0,0,0.8)), url('https://images.pexels.com/photos/2449454/pexels-photo-2449454.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')",
      },
      boxShadow: {
        'red-glow': '0 0 12px rgba(255, 0, 0, 0.15)',
        'red-glow-lg': '0 0 20px rgba(255, 0, 0, 0.25)',
        'card-glow': '0 4px 12px rgba(255, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'logo-pulse': 'logoPulse 4s ease-in-out infinite',
        'truck-move': 'truckMove 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 12px rgba(255, 0, 0, 0.15)' },
          '100%': { boxShadow: '0 0 18px rgba(255, 0, 0, 0.3)' },
        },
        logoPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.9' },
        },
        truckMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};