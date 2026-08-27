/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'on-bg': 'var(--on-bg)',
        'on-bg-muted': 'var(--on-bg-muted)',
        'on-primary': 'var(--on-primary)',
        'on-primary-muted': 'var(--on-primary-muted)',
        primary: 'var(--app-primary)',
        secondary: '#20878E',
      },},
  },
  plugins: [],
}
