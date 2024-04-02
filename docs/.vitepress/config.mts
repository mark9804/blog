import { HeadConfig, defineConfig } from "vitepress";
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';
import px2rem from "postcss-plugin-px2rem";
import tailwindcss from "tailwindcss";
import tailwindConfig from "../../tailwind.config.js";
import AutoImport from "unplugin-auto-import/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { vitePluginForArco } from '@arco-plugins/vite-vue'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blog/",
  title: "今天没有早睡",
  description: "",
  lastUpdated: true,
  markdown: {
    math: true,
    headers: {
      level: [0, 0],
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // lastUpdated: {
    //   text: '最后更新于',
    //   formatOptions: {
    //     dateStyle: 'medium',
    //     timeStyle: 'short',
    //     forceLocale: true,
    //   }
    // },
    search: {
      provider: "local",
    },

    nav: [{ text: "Home", link: "/" }],

    socialLinks: [
      { icon: "github", link: "https://github.com/mark9804" },
    ],

    vite: {
      ssr: { noExternal: ["@arco-design/web-vue"] },
      plugins: [
        AutoImport({
          resolvers: [ArcoResolver()],
        }),
        Components({
          // include: [/\.vue$/, /\.md$/],
          resolvers: [ArcoResolver({ sideEffect: true })],
        }),
        AutoSidebar({
          ignoreList: ["src", "components", "node_modules", ".git", ".vitepress"],
          titleFromFile: true,
        }),
        vitePluginForArco({
          style: 'css'
        })
      ],
      css: {
        postcss: {
          plugins: [
            px2rem({
              rootValue: 16,
              propBlackList: ["font-size", "border", "border-width"],
              exclude: /(node_module)/,
            }),
            tailwindcss(tailwindConfig),
          ],
        },
      },
    },
  },

  transformHead: () => {
    const head: HeadConfig[] = [];
    head.push([
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.blue-archive.io/harmonyos-sans-webfont/harmonyos-sans-sc-400.css",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ]);
    head.push([
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.blue-archive.io/harmonyos-sans-webfont/harmonyos-sans-sc-700.css",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ]);
    //  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0" />
    head.push([
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ]);

    return head;
  },
});
