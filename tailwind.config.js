/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/feature-flags/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Playfair Display', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        iris: {
          forest: '#1B3A2E',
          emerald: '#006D4E',
          offwhite: '#FAF7F2',
          black: '#111111',
          sage: '#DDE6DA',
          sand: '#EDE6DA',
          rose: '#EAD8D6',
          mist: '#D6DEE6',
        },
        emotion: {
          500: '#9A7CA7',
          subtle: '#E9DDEE',
        },
      },
      transitionDuration: {
        base: '200ms',
        emotional: '400ms',
      },
      boxShadow: {
        iris: '0 24px 80px rgba(27, 58, 46, 0.10)',
      },
    },
  },
  plugins: [],
};
