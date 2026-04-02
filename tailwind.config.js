/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#252525',
        fire: '#c7720a',
        pure: '#eeefe2',
        wisdom: '#f1ece0',
      },
    },
  },
  plugins: [],
}
