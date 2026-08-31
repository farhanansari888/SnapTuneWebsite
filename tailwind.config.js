/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#CAB4FF",
        "on-primary": "#150838",
        "primary-container": "#6A4FBF",
        "on-primary-container": "#EDE0FF",
        "secondary": "#F5B3D0",
        "on-secondary": "#3D1529",
        "secondary-container": "#6E3060",
        "on-secondary-container": "#FFD9EB",
        "tertiary": "#6EE9DF",
        "on-tertiary": "#003835",
        "tertiary-container": "#004E49",
        "on-tertiary-container": "#A1F5EA",
        "surface-dim": "#07060F",
        "surface": "#0C0B18",
        "surface-container-lowest": "#07060F",
        "surface-container-low": "#12102A",
        "surface-container": "#19163A",
        "surface-container-high": "#231E4C",
        "surface-container-highest": "#2E284A",
        "surface-bright": "#3A3560",
        "surface-tint": "#CAB4FF",
        "on-surface": "#EDE8FC",
        "on-surface-variant": "#B0A8CC",
        "background": "#07060F",
        "on-background": "#EDE8FC",
        "outline": "#706A88",
        "outline-variant": "#3C3660",
        "error": "#FFB4AB",
        "error-container": "#93000A",
        "surface-variant": "#2E284A"
      }
    }
  },
  plugins: []
};
