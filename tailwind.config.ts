import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hoon/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        neutral: {
          150: "#e7e5e4",
          250: "#d6d3d1",
          350: "#a8a29e",
          450: "#78716c",
          550: "#57534e",
          750: "#292524",
          850: "#1c1917"
        }
      },
      scale: {
        102: "1.02",
        103: "1.03"
      }
    }
  },
  plugins: []
};

export default config;
