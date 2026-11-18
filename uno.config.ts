import {
  defineConfig,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  rules: [
    ["text-secondary", { color: "var(--color-accent-text-secondary)" }],
    ["text-tertiary", { color: "var(--color-accent-text-tertiary)" }],
  ],
  presets: [presetWind3()],
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
