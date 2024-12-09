/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Scans all files in the `app` directory
    "./components/**/*.{js,ts,jsx,tsx}", // If you have a separate `components` directory
    "./pages/**/*.{js,ts,jsx,tsx}", // If you use a `pages` directory as well
  ],
  darkMode: "class", // Enables dark mode using a class
  theme: {
    extend: {},
  },
  plugins: [],
};
