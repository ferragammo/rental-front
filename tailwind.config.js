/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx}'],
    theme: {
        extend: {
          fontFamily: {
              geist: ["Geist", "sans-serif"],
              geist_mono: ["Geist Mono", "monospace"],
            },
            colors: {
                'main-black': '#09090b',
                'main-grey': '#19191b',
                'main-light-grey': '#272729',
            },
        },
    },
    plugins: [],
}