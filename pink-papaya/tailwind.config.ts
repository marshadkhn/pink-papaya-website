import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F2EA",
        mist: "#E6ECEC",
        ink: "#16323C",
        inkSoft: "#4A6068",
        muted: "#B8A892",
        line: "#D9D2C4",
        card: "#FFFFFF",
        accent: "#C97B63",
        btnDark: "#16323C",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)"],
        sans: ["var(--font-inter)"],
        script: ["var(--font-allura)"],
      },
      fontSize: {
        h1: ["72px", { lineHeight: "1.05" }],
        h1m: ["44px", { lineHeight: "1.05" }],
        h2: ["56px", { lineHeight: "1.1" }],
        h2m: ["36px", { lineHeight: "1.1" }],
        h3: ["36px", { lineHeight: "1.15" }],
        h3m: ["28px", { lineHeight: "1.15" }],
        cardTitle: ["28px", { lineHeight: "1.2" }],
        bodyLg: ["18px", { lineHeight: "1.6" }],
        body: ["16px", { lineHeight: "1.65" }],
        small: ["14px", { lineHeight: "1.5" }],
        eyebrow: ["12px", { lineHeight: "1" }],
      },
      letterSpacing: {
        eyebrow: "0.12em",
      },
      borderRadius: {
        card: "8px",
        image: "4px",
      },
      maxWidth: {
        content: "1280px",
        measure: "520px",
      },
    },
  },
  plugins: [],
};

export default config;
