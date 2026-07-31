/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta institucional. Los tonos 50–400 son tintes derivados de la
        // marca para fondos, bordes y estados hover.
        plum: {
          50: '#faf7fc',
          100: '#f2eaf7',
          200: '#e3d3ee',
          300: '#c9aede',
          400: '#a87ec7',
          500: '#8553a6',
          600: '#7833a6',
          700: '#64278c',
          800: '#421a5c',
          900: '#210d26',
        },
        ink: '#0d0d0d',
        muted: '#6b6472',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(33, 13, 38, 0.04), 0 4px 16px rgba(33, 13, 38, 0.06)',
        'card-hover': '0 2px 4px rgba(33, 13, 38, 0.06), 0 12px 28px rgba(33, 13, 38, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};
