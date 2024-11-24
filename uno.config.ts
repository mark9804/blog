import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

const borderAccents = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => [
  `border-accent-${i}00`,
  { "border-color": `var(--color-accent-border-${i}00)` },
]);

export default defineConfig({
  rules: [
    [
      "shadow-card",
      { "box-shadow": "0 1rem 3rem var(--color-accent-shadow-200)" },
    ],
    [
      "shadow-card-hover",
      { "box-shadow": "0 1rem 3rem var(--color-accent-shadow-300)" },
    ],
    ["text-primary", { color: "var(--color-accent-text-primary)" }],
    ["text-secondary", { color: "var(--color-accent-text-secondary)" }],
    ["text-tertiary", { color: "var(--color-accent-text-tertiary)" }],
    // @ts-ignore
    ...borderAccents,
  ],
  shortcuts: {
    "home-title":
      "text-2xl font-bold decoration-underline decoration-4 underline-offset-10 decoration-[var(--color-accent)]",
  },
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
      unit: "em",
    }),
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
