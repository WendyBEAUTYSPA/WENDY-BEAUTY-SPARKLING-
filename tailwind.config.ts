import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#140A10", bgAlt: "#1C0F16", panel: "#241420",
        surface: "#F3E7DE", surface2: "#EAD9CC",
        ink: "#2B1A20", inkSoft: "#5B4048",
        inkInverse: "#F6ECE4", inkInverseSoft: "#CBB3BA",
        gold: "#C9A467", goldSoft: "#DCC28E",
        rose: "#D98CA3", magenta: "#E23E7C", wine: "#6E1E3D"
      },
      fontFamily: { display: ["Fraunces", "serif"], sans: ["Manrope", "system-ui", "sans-serif"] },
      borderRadius: { lg: "22px", md: "14px", sm: "9px" }
    }
  },
  plugins: []
};
export default config;