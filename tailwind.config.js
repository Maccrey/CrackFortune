/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mystical: ['Cinzel', 'serif'],
        'serif-kr': ['Noto Serif KR', 'serif'],
        'serif-jp': ['Noto Serif JP', 'serif'],
      },
    },
  },
  plugins: [],
}
