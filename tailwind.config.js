/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { display: ['Inter','ui-sans-serif','system-ui','Segoe UI','Roboto'] },
      boxShadow: { soft: "0 8px 24px rgba(0,0,0,0.08)" }
    },
  },
  plugins: [],
};
