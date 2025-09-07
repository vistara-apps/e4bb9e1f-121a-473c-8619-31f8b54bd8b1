/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210 40% 96.1%)',
        accent: 'hsl(210 100% 52%)',
        bg: 'hsl(210 40% 96.1%)',
        surface: 'hsl(210 40% 94.4%)',
        'text-primary': 'hsl(210 40% 12.1%)',
        'text-secondary': 'hsl(210 40% 35.9%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210,40%,12%,0.08)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [],
}
