import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#090b0c", panel: "#111516", line: "#252c2d", lime: "#c9f458" } } },
  plugins: [],
};
export default config;
