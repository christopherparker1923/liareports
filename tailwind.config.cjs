/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rhino: "#252f4c",
        puertoRico: "#3cb8ad",
        neptune: "#77b4b5",
        shuttleGray: "#646879",
        blackSqueeze: "#eef6f8",
        santasGray: "#a4a7b7",
        powderBlue: "#b2e6e8",
        osloGray: "#81868c",
        towerGray: "#a8c0c4",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  darkMode: "class",
};
