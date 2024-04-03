import { HeadConfig, defineConfig } from "vitepress";
import px2rem from "postcss-plugin-px2rem";
import AutoImport from "unplugin-auto-import/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { vitePluginForArco } from "@arco-plugins/vite-vue";
import { generateSidebar } from "vitepress-sidebar";
import UnoCSS from "unocss/vite";

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
    },
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

    sidebar: generateSidebar({
      documentRootPath: "/docs",
      useTitleFromFileHeading: true,
      useTitleFromFrontmatter: true,
      useFolderTitleFromIndexFile: true,
      // useFolderLinkFromIndexFile: false,
      // hyphenToSpace: true,
      // underscoreToSpace: true,
      capitalizeFirst: true,
      capitalizeEachWords: true,
      collapsed: true,
      collapseDepth: 2,
      // sortMenusByName: false,
      // sortMenusByFrontmatterOrder: false,
      // sortMenusByFrontmatterDate: false,
      // sortMenusOrderByDescending: false,
      // sortMenusOrderNumericallyFromTitle: false,
      // sortMenusOrderNumericallyFromLink: false,
      // frontmatterOrderDefaultValue: 0,
      // manualSortFileNameByPriority: ['first.md', 'second', 'third.md'],
      // removePrefixAfterOrdering: false,
      // prefixSeparator: '.',
      // excludeFiles: ['first.md', 'secret.md'],
      // excludeFilesByFrontmatter: false,
      // excludeFolders: ['secret-folder'],
      // includeDotFiles: false,
      // includeRootIndexFile: false,
      // includeFolderIndexFile: false,
      // includeEmptyFolder: false,
      // rootGroupText: 'Contents',
      // rootGroupLink: 'https://github.com/jooy2',
      // rootGroupCollapsed: false,
      // convertSameNameSubFileToGroupIndexPage: false,
      // folderLinkNotIncludesFileName: false,
      // keepMarkdownSyntaxFromTitle: false,
      // debugPrint: true,
    }),

    search: {
      provider: "local",
    },

    nav: [
      { text: "首页", link: "/" },
      {
        text: "碧蓝档案剧情站",
        items: [
          { text: "首页", link: "https://blue-archive.io" },
          { text: "Bilibili", link: "https://space.bilibili.com/1413213021" },
        ],
      },
      {
        text: "友链",
        items: [
          { text: "Arona Bot", link: "https://doc.arona.diyigemt.com/" },
          { text: "BA OST Index", link: "https://ba.cnfast.top/" },
          {
            text: "Armstrong-一位视障学生的日志",
            link: "https://armstrong.viyf.org/",
          },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/mark9804" }],

    vite: {
      ssr: { noExternal: ["@arco-design/web-vue"] },
      plugins: [
        AutoImport({
          resolvers: [ArcoResolver()],
        }),
        Components({
          include: [/\.vue$/, /\.md$/],
          resolvers: [ArcoResolver({ sideEffect: true })],
        }),
        UnoCSS(),
        vitePluginForArco({
          style: "css",
        }),
      ],
      css: {
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
