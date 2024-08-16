/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#4f7cff',
        'custom-blue':'#3d5fc4',
      },
    },
  },
  plugins: [],
}
