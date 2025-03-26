/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Tailwind가 적용될 파일 경로 설정
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f9f8',
          100: '#e8f0ed',
          200: '#d1e2dc',
          300: '#aecbbe',
          400: '#8ab2a1',
          500: '#6d9a87',
          600: '#537b6b',
          700: '#446357',
          800: '#3a5249',
          900: '#31443c',
          950: '#1a2620',
        },
        secondary: {
          50: '#f5f7f6',
          100: '#e6ecea',
          200: '#cedbd7',
          300: '#afc4bd',
          400: '#8ea79c',
          500: '#738d82',
          600: '#5c7267',
          700: '#4c5d54',
          800: '#404c46',
          900: '#36403b',
          950: '#1d2421',
        },
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        nanum: ['"Nanum Square"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
};
