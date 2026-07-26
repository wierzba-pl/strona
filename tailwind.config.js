/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F1",
        paperAlt: "#F2ECDF",
        ink: "#171512",
        inkSoft: "#544F45",
        inkFaint: "#8D8778",
        accent: "#D4291B",
        line: "#E3DCC9",
        lineStrong: "#D0C6AC"
      },
      fontFamily: {
        display: ["Anton", "Impact", "sans-serif"],
        script: ["ScriptAccent", "Caveat", "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
        serifDoc: ["Source Serif 4", "Georgia", "serif"]
      },
      maxWidth: {
        site: "1180px"
      },
      borderRadius: {
        ui: "3px"
      }
    }
  },
  plugins: []
};
