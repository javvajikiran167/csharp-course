/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        cream: {
          DEFAULT: '#FBF8F1',
          50: '#FDFBF6',
          100: '#FBF8F1',
          200: '#F5EFDF',
          300: '#EFE7CC',
          400: '#E7DDB8',
          500: '#D8CCA0',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          50: '#F5F5F5',
          400: '#7A7670',
          500: '#5A5650',
          600: '#3D3A35',
          700: '#1A1A1A',
        },
        // Accent (amber 600 family)
        amber: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706', // primary accent
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Semantic
        ok:  { DEFAULT: '#15803D', soft: '#DCFCE7', text: '#14532D' },
        err: { DEFAULT: '#B91C1C', soft: '#FEE2E2', text: '#7F1D1D' },
        info:{ DEFAULT: '#1D4ED8', soft: '#DBEAFE', text: '#1E3A8A' },
        // Code surfaces (dark code on light page)
        code: {
          bg:     '#1E1E1E',
          header: '#2A2A2A',
          border: '#3A3A3A',
          text:   '#F5F5F5',
          dim:    '#A0A0A0',
        },
        // Hairline borders (warm-tinted)
        hairline: '#E7E0CC',
      },
      fontFamily: {
        sans:  ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['"Crimson Pro"', 'Georgia', 'serif'],
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display':  ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h1':       ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'h2':       ['1.5rem',  { lineHeight: '1.3' }],
        'h3':       ['1.125rem',{ lineHeight: '1.45' }],
        'body':     ['1rem',    { lineHeight: '1.75' }],
        'caption':  ['0.8125rem',{ lineHeight: '1.55', letterSpacing: '0.02em' }],
        'eyebrow':  ['0.6875rem',{ lineHeight: '1.4', letterSpacing: '0.14em' }],
        'code':     ['0.875rem',{ lineHeight: '1.65' }],
      },
      maxWidth: {
        prose: '68ch',
        page:  '76rem',
      },
      boxShadow: {
        card: '0 1px 0 0 #E7E0CC',
        cardHover: '0 4px 16px -4px rgba(26,26,26,0.08), 0 1px 0 0 #E7E0CC',
      },
      borderRadius: {
        none: '0',
        sm:   '2px',
        DEFAULT: '4px',
      },
    },
  },
  plugins: [],
};
