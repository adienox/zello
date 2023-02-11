/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#20232B",
        primaryDark: "#1D1E24",
        secondary: "#16171B",
        blueHighlight: "#5852D6",
        greenHighlight: "#F3FC89",
        message: "#B785F5",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
