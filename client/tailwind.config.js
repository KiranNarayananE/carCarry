/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsxl}"],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#2b2e4a',
        'real-orange':'#F77D0A',
        'real-blue':'#7290FE'
      },
    }
  },
  plugins: [require("tailwind-scrollbar-hide"), require("daisyui")],
}
