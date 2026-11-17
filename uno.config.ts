import {
  defineConfig,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import presetWind3 from "@unocss/preset-wind3";

const borderAccents = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
  i =>
    [
      `border-accent-${i}00`,
      { "border-color": `var(--color-accent-border-${i}00)` },
    ] as [string, Record<string, string>]
);

export default defineConfig({
  rules: [
    ["font-serif-editorial", { "font-family": "var(--font-family-serif)" }],
    ["font-sans-base", { "font-family": "var(--font-family-base)" }],
    ["bg-paper", { "background-color": "var(--gouache-paper)" }],
    ["bg-chalk", { "background-color": "var(--gouache-chalk)" }],
    ["bg-wash", { "background-color": "var(--gouache-wash)" }],
    ["text-primary", { color: "var(--color-accent-text-primary)" }],
    ["text-secondary", { color: "var(--color-accent-text-secondary)" }],
    ["text-tertiary", { color: "var(--color-accent-text-tertiary)" }],
    ...borderAccents,
  ],
  presets: [
    //@ts-expect-error
    presetWind3(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    breakpoints: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
});
