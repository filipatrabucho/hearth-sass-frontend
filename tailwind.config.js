/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        base: {
          bg: '#0a0912',
          surface: '#131120',
          'surface-2': '#191729',
          'surface-3': '#211f34',
          border: '#28243d',
          'border-soft': '#211e33',
        },
        ink: {
          DEFAULT: '#f3f2f8',
          muted: '#9490ad',
          faint: '#6c6884',
        },
        brand: {
          50: '#f2efff',
          100: '#e4defe',
          200: '#c9befd',
          300: '#ab9afb',
          400: '#8f78f8',
          500: '#7a5cf5',
          600: '#6a42ef',
          700: '#5b32d6',
          800: '#4726a8',
          900: '#361d7d',
        },
        accent: {
          pink: '#f45fb0',
          green: '#3ddc97',
          amber: '#f6b93b',
          red: '#f8695f',
          blue: '#5fa8f5',
        },
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.02) inset, 0 12px 30px -12px rgba(0,0,0,0.55)',
        glow: '0 8px 30px -8px rgba(122,92,245,0.55)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #8f78f8 0%, #6a42ef 55%, #5b32d6 100%)',
        'promo-gradient': 'linear-gradient(160deg, #a78bff 0%, #6a42ef 60%, #3f2a9c 100%)',
        'upgrade-gradient': 'linear-gradient(135deg, #f45fb0 0%, #b463e0 50%, #6a42ef 100%)',
      },
    },
  },
  plugins: [],
}
