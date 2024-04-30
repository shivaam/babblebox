/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./babblebox/templates/**/*.html",
    "./babblebox/static/vite_assets/js/**/*.{js,ts,jsx,tsx}",
    '../node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ]
}

