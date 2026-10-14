import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#202522',
        muted: '#68726a',
        forest: '#183f32',
        canvas: '#f7f8f5',
        line: '#e8eae6',
        sage: '#8e9b8c',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      boxShadow: { soft: '0 14px 38px rgba(25, 45, 33, .08)' },
    },
  },
  plugins: [],
};

export default config;
