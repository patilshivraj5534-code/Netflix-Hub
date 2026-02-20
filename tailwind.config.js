/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#e50914',
          dark: '#141414'
        }
      }
    }
  },
  plugins: []
};

