/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontSize: {
        'base': ['18px', '1.6'],
        'lg': ['20px', '1.6'],
        'xl': ['22px', '1.5'],
        '2xl': ['26px', '1.4'],
        '3xl': ['30px', '1.3'],
        '4xl': ['36px', '1.2'],
      },
      minHeight: {
        'tap': '48px',
      },
    },
  },
  plugins: [],
}
