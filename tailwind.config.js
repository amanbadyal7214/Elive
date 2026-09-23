/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#002249",
        secondary: "#1B365D",
        tertiary: "#2E7D32",
        neutral: {
          900: "#121417", // Main neutral color from mockup
        }
      },
      fontFamily: {
        headline: ["Newsreader", "serif"],
        body: ["PlusJakartaSans", "sans-serif"],
        label: ["PlusJakartaSans", "sans-serif"],
      }
    },
  },
  plugins: [],
}
