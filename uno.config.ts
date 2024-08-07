import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  rules: [
    ["shadow-std", { "box-shadow": "0 0 0.5rem rgba(0, 0, 0, 0.1)" }],
    ["align-self-center", { "align-self": "center" }],
    ["text-3", { color: "var(--color-text-3)" }],
    ["border-fill", { "border-color": "var(--color-fill-2)" }],
    ["text-match", { color: "var(--arona-blue-6)", "font-weight": "bold" }],
  ],
  shortcuts: {
    "card-float": "shadow-std rounded-lg gap-[24px] p-[24px]",
  },
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
      unit: "em",
    }),
    // presetWebFonts({
    //   provider: "bunny",
    //   fonts: {
    //     sans: "Inter",
    //   },
    // }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
