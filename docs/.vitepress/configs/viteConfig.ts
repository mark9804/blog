import vueJsx from "@vitejs/plugin-vue-jsx";
// @ts-ignore
import px2rem from "postcss-plugin-px2rem";
import AutoImport from "unplugin-auto-import/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import UnoCSS from "unocss/vite";
import {
  presetAttributify,
  presetIcons,
  presetWind3,
  transformerDirectives,
} from "unocss";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import vueDevTools from "vite-plugin-vue-devtools";
import { RssPlugin } from "vitepress-plugin-rss";
import {
  GitChangelog,
  GitChangelogMarkdownSection,
} from "@nolebase/vitepress-plugin-git-changelog/vite";

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
      dirs: [
        ".vitepress/theme/components/ElysiumUI",
        ".vitepress/theme/components/ElysiumUI/ElyIcon",
        ".vitepress/theme/components",
      ],
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
        presetWind3(),
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
    GitChangelog({
      repoURL: () => "https://github.com/mark9804/blog",
    }),
    GitChangelogMarkdownSection({
      sections: {
        disableContributors: true,
      },
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
    chunkSizeWarningLimit: 1000,
  },
};
