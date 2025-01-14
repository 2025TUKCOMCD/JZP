/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBg: "#353536",
        customRed: "#AF2828",
        customDarkblue: "#464A5A",
        customYellow: "#FFEB00",
        buttonGray: "#5F657A",
        deleteBlack: "#3C3E44",
        customLightGray: "#C6C6C6",
        headerColor: "#262626",
        logoGray: "#717070",
        screenGray: "#9A9A9A",
        keyPadGray: "#8087A1",
        customBlack: "#1A1A1A",
      },
      fontFamily: {
        sbAggro: ["SBAggroB", "sans-serif"], // SBAggroB 폰트 추가
      },
      fontWeight: {
        light: 300,
        normal: 500,
        bold: 800,
      },
    },
  },
  plugins: [],
};
