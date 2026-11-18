import { fileURLToPath } from "node:url";
// @ts-expect-error postcss-plugin-px2rem does not ship TypeScript declarations
import px2rem from "postcss-plugin-px2rem";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import type { UserConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";
import { RssPlugin } from "vitepress-plugin-rss";
import { rssConfig } from "./rssConfig.ts";

const platform = process.env.PLATFORM || "default";
const docsSrcDir = fileURLToPath(new URL("../../src", import.meta.url));

export function createViteConfig(mode: string): UserConfig {
  // Vercel speed-insights analytics component should only be injected on Vercel
  const shouldInjectVercelSpeedInsightsComponent =
    mode === "production" && platform === "vercel";

  return {
    define: {
      __INJECT_SPEED_INSIGHTS__: JSON.stringify(
        shouldInjectVercelSpeedInsightsComponent
      ),
    },
    resolve: {
      // Required by demo imports in docs/breves/frontend/create-fluent-2-styled-input-vue.md
      alias: {
        "@": docsSrcDir,
      },
    },
    server: {
      port: 5500,
      open: true,
    },
    plugins: [
      AutoImport({
        imports: ["vue"],
      }),
      Components({
        include: [/\.vue$/, /\.md$/, /\.ts$/],
        dirs: [".vitepress/theme/components"],
      }),
      mode === "development" && vueDevTools(),
      UnoCSS(),
      RssPlugin(rssConfig),
    ],
    css: {
      postcss: {
        plugins: [
          px2rem({
            rootValue: 16,
            propBlackList: ["font-size", "border", "border-width"],
            exclude: /node_modules/,
          }),
        ],
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  };
}
