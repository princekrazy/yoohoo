import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#18191B", panel: "#292A2D", line: "#3A3B40", lime: "#B8B9BE", coral: "#B8B9BE", canvas: "#18191B", content: "#242528", button: "#303136", "button-hover": "#38393D", primary: "#F1F1F1", secondary: "#B8B9BE", muted: "#85878D" } } },
  plugins: [],
};
export default config;
