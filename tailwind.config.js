/* eslint-env node */
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Gentium Book Plus', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
  important: 'body',
};
