import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#0b0b0d", panel: "#17171a", line: "#2b2b30", lime: "#FF4545", coral: "#FF4545", canvas: "#0b0b0d" } } },
  plugins: [],
};
export default config;
