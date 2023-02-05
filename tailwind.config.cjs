/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./play.html",
    "./end.html",
    "./help.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["halloween"],
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "halloween",
  }
}

