/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                xmasbg: "#a0dd6e",
                xmasprim: "#799451",
                xmassec: "#b6cca3",
                xmasacc: "#94bc76",
                xmastext: "#080907",
            },
        },
    },
    plugins: [],
}
