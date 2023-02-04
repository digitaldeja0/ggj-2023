/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["night"],
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
    darkTheme: "night",
  }
}

// controls.maxPolarAngle = Math.PI * 0.49;
// controls.minPolarAngle = Math.PI * 0.4;
// controls.maxDistance = Math.PI * 0.1;
// controls.minDistance = Math.PI * 5;
// controls.maxZoom = Math.PI * 5;