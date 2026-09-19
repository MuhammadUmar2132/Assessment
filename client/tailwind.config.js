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
        browser: {
          bg: '#f1f3f4',
          border: '#dadce0',
          bar: '#ffffff',
          buttonHover: '#e8eaed',
          statusTyped: '#0f766e',
          statusLoading: '#d97706',
          statusShown: '#059669',
          statusHistory: '#4338ca',
          statusNowhere: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}
