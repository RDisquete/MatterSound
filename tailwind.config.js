/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Un negro con un toque de verde/marrón muy sutil (estilo osciloscopio viejo)
        'analog-black': '#050605',
        'vintage-amber': '#fef3c7',
      },
    },
  },
  plugins: [],
}