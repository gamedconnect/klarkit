import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#102A43',
          50: '#E8F0F7',
          100: '#C5D8EA',
          200: '#9FBDD9',
          300: '#79A2C8',
          400: '#5389B7',
          500: '#3A72A4',
          600: '#2D5A84',
          700: '#214363',
          800: '#152C42',
          900: '#102A43',
        },
        teal: {
          DEFAULT: '#2EC4B6',
          50: '#E8FAF9',
          100: '#BFF2EF',
          200: '#85E5DF',
          300: '#50D7CF',
          400: '#2EC4B6',
          500: '#22A99C',
          600: '#198C81',
          700: '#116E66',
          800: '#0A514C',
          900: '#033531',
        },
        brand: {
          navy: '#102A43',
          teal: '#2EC4B6',
          lightgray: '#F5F7FA',
          darkgray: '#1F2933',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
