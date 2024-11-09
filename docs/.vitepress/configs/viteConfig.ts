import vueJsx from "@vitejs/plugin-vue-jsx";
import px2rem from "postcss-plugin-px2rem";
import AutoImport from "unplugin-auto-import/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import UnoCSS from "unocss/vite";
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
} from "unocss";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import vueDevTools from "vite-plugin-vue-devtools";
import { RssPlugin } from "vitepress-plugin-rss";
import { rssConfig } from "./rssConfig";

export const viteConfig = {
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 5500,
    open: true,
  },
  ssr: { noExternal: ["@arco-design/web-vue"] },
  plugins: [
    vueJsx(),
    AutoImport({
      resolvers: [ArcoResolver({ sideEffect: true, resolveIcons: true })],
      imports: ["vue"],
    }),
    Components({
      include: [/\.vue$/, /\.md$/, /\.ts$/],
      resolvers: [
        ArcoResolver({ sideEffect: true, resolveIcons: true }),
        IconsResolver({
          alias: {
            park: "icon-park",
          },
        }),
      ],
    }),
    Icons(),
    vueDevTools(),
    UnoCSS({
      presets: [
        presetUno(),
        presetIcons({
          extraProperties: {
            display: "inline-block",
            "vertical-align": "middle",
          },
        }),
        presetAttributify(),
      ],
      transformers: [transformerDirectives()],
    }),
    RssPlugin(rssConfig),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "",
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
};
