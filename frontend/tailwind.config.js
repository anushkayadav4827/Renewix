/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Renewix Strict Design Tokens
        renewix: {
          forest: '#103D29',
          deep: '#0B2D20',
          green: '#174C32',
          ivory: '#FFF3E5',
          cream: '#F9EBDD',
          peach: '#F9C49B',
          sage: '#D9E5C4',
          dark: '#17251D',
          muted: '#68736A',
          terracotta: '#E28E5C',
          emerald: '#10B981',
          gold: '#E5A93B',
        },
        forest: '#103D29',
        deepGreen: '#0B2D20',
        primaryGreen: '#174C32',
        warmIvory: '#FFF3E5',
        cream: '#F9EBDD',
        softPeach: '#F9C49B',
        sage: '#D9E5C4',
        darkText: '#17251D',
        mutedText: '#68736A',
        amberCaution: '#D97706',
        dangerRed: '#DC2626',
        bgLight: '#FFF3E5',
        bgDark: '#0B2D20',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'editorial': '0 20px 40px -15px rgba(11, 45, 32, 0.08), 0 0 1px 1px rgba(16, 61, 41, 0.05)',
        'editorial-lg': '0 30px 60px -20px rgba(11, 45, 32, 0.15), 0 0 1px 1px rgba(16, 61, 41, 0.08)',
        'hero-card': '0 25px 50px -12px rgba(16, 61, 41, 0.35)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'spin-very-slow': 'spin 35s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
};
