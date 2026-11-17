import vueJsx from "@vitejs/plugin-vue-jsx";
// @ts-ignore
import px2rem from "postcss-plugin-px2rem";
import AutoImport from "unplugin-auto-import/vite";
import RekaResolver from "reka-ui/resolver";
import Components from "unplugin-vue-components/vite";
import UnoCSS from "unocss/vite";
import { presetAttributify, presetWind3, transformerDirectives } from "unocss";
import vueDevTools from "vite-plugin-vue-devtools";
import { RssPlugin } from "vitepress-plugin-rss";

import { rssConfig } from "./rssConfig";

const platform = process.env.PLATFORM || "default";

export function createViteConfig(mode: string) {
  console.log(`platform: ${platform}\nmode: ${mode}`);

  // Vercel speed-insights analytics component should only be injected on vercel
  const shouldInjectVercelSpeedInsightsComponent =
    mode === "production" && platform === "vercel";

  return {
    define: {
      __INJECT_SPEED_INSIGHTS__: JSON.stringify(
        shouldInjectVercelSpeedInsightsComponent
      ),
    },
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@": "/src",
      },
    },
    server: {
      port: 5500,
      open: true,
    },
    ssr: { noExternal: [] },
    plugins: [
      vueJsx(),
      AutoImport({
        resolvers: [RekaResolver()],
        imports: ["vue"],
      }),
      Components({
        include: [/\.vue$/, /\.md$/, /\.ts$/],
        dirs: [
          ".vitepress/theme/components/ElysiumUI",
          ".vitepress/theme/components/ElysiumUI/ElyIcon",
          ".vitepress/theme/components",
        ],
        resolvers: [RekaResolver()],
      }),
      mode === "development" && vueDevTools(),
      UnoCSS({
        presets: [presetWind3(), presetAttributify()],
        transformers: [transformerDirectives()],
      }),
      RssPlugin(rssConfig),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "",
          api: "modern-compiler",
        },
      },
      postcss: {
        plugins: [
          px2rem({
            rootValue: 16,
            propBlackList: ["font-size", "border", "border-width"],
            exclude: /(node_module)/,
          }),
        ],
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  };
}
