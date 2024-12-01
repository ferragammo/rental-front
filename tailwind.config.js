/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx}'],
    theme: {
        extend: {
            colors: {
                'main-black': '#09090b',
                'main-grey': '#19191b',
                'main-light-grey': '#272729',
            },
        },
    },
    plugins: [],
};
