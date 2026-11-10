/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'system-ui', 'sans-serif'],
        serif: ['Rubik', 'serif'],
      },
    },
  },
  plugins: [],
}

