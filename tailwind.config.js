/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Readers are often 60+: the two smallest steps are raised (xs 12->14, sm 14->16).
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.35rem' }],
        sm: ['1rem', { lineHeight: '1.6rem' }],
      },
      fontFamily: {
        sans: ['Rubik', 'system-ui', 'sans-serif'],
        serif: ['Rubik', 'serif'],
        // handwriting touches only (signature, short notes), never paragraphs
        hand: ['"Amatic SC"', 'Rubik', 'cursive'],
      },
    },
  },
  plugins: [],
}

