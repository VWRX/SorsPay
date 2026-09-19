/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: 'rgba(255,255,255,0.03)',
        border: 'rgba(255,255,255,0.08)',
        'accent-1': '#8b5cf6',
        'accent-2': '#06b6d4',
        'text-primary': '#f5f5f7',
        'text-muted': '#8b8b95'
      },
      boxShadow: {
        glow: '0 0 30px rgba(139,92,246,0.45)',
        cyan: '0 0 20px rgba(6,182,212,0.35)'
      },
      backgroundImage: {
        'hero-grid': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(circle at top, rgba(139,92,246,0.30), transparent 35%), radial-gradient(circle at bottom right, rgba(6,182,212,0.18), transparent 35%)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif']
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' }
        }
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
