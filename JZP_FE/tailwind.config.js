// eslint-disable-next-line no-undef
const plugin = require("tailwindcss/plugin");

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
        textGray: "#B4B4B4",
        kakaoPayGray: "#7B7B7B",
      },
      fontFamily: {
        sbAggro: ["SBAggroB", "sans-serif"], // 기본 폰트 설정
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".flip-container": {
          position: "relative",
          width: "100%",
          height: "100%",
        },
        ".flip-card": {
          transition: "transform 0.6s",
          transformStyle: "preserve-3d",
          position: "relative",
          width: "100%",
          height: "100%",
        },
        ".flipped": {
          transform: "rotateY(180deg)",
        },
        ".flip-front, .flip-back": {
          position: "absolute",
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        ".flip-back": {
          transform: "rotateY(180deg)",
        },
      });
    }),
  ],
};
