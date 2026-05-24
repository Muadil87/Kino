import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: 'var(--border-color)',
        input: 'var(--border-color)',
        ring: 'var(--accent-primary)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--surface)',
        muted: 'var(--text-muted)',
        accent: 'var(--accent-primary)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        accent: 'var(--shadow-accent)',
      },
      transitionTimingFunction: {
        kino: 'var(--ease-out)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
