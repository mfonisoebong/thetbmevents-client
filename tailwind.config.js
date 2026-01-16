/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        main: "#000000",
        mainLightDark: "rgba(81, 142, 153, 0.4);",
        mainDark: "#1F4E56",
        gold: "#EDB511",
        mainBlue: "#518E99",
        // --------------
        primary: "#FBBC05",
        "background-light": "#F9FAFB",
        "background-dark": "#0F172A",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1E293B",
        "text-light": "#111827",
        "text-dark": "#F3F4F6",
        "text-muted-light": "#4B5563",
        "text-muted-dark": "#9CA3AF",
        // design system
        brand: {
          yellow: '#E8B025',
          teal: '#4F8A92',
          dark: '#0F172A', // Slate 900
          light: '#F8FAFC', // Slate 50
        },
        'black-1c': "#1C1C1C",
      },
      fontFamily: {
        // prototype 2
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        // design system
        header: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // design system
        'brand-gradient': 'linear-gradient(135deg, #E8B025 0%, #4F8A92 100%)',
        'glass-light': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%)',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      // 1) media-query based light: -> uses prefers-color-scheme
      addVariant('light', '@media (prefers-color-scheme: light)')

      // 2) [unused] class-based light-class: -> use a parent .light on the root
      addVariant('light-class', '.light &')
    },
  ],
}
