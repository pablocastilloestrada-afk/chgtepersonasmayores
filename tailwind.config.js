/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
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
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontSize: {
        'base': ['18px', '1.6'],
        'sm': ['16px', '1.6'],
        'lg': ['20px', '1.6'],
        'xl': ['22px', '1.5'],
        '2xl': ['26px', '1.4'],
        '3xl': ['30px', '1.3'],
        '4xl': ['36px', '1.2'],
      },
      minHeight: {
        'tap': '48px',
      },
      spacing: {
        'tap': '48px',
      },
    },
  },
  plugins: [],
}
