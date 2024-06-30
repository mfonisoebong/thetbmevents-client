/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#000000",
        mainLightDark: "rgba(81, 142, 153, 0.4);",
        mainDark: "#1F4E56",
        gold: "#EDB511",
        mainBlue: "#518E99",
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
  },
  plugins: [],
}
