import { HeadConfig, defineConfig } from "vitepress";
import px2rem from "postcss-plugin-px2rem";
import AutoImport from "unplugin-auto-import/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { generateSidebar } from "vitepress-sidebar";
import UnoCSS from "unocss/vite";
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
} from "unocss";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

import implicitFigures from "markdown-it-implicit-figures";
import { mark } from "@mdit/plugin-mark";
import { ruby } from "@mdit/plugin-ruby";
import { spoiler } from "@mdit/plugin-spoiler";
import { imgSize } from "@mdit/plugin-img-size";
import { imgLazyload } from "@mdit/plugin-img-lazyload";
import { sub } from "@mdit/plugin-sub";
import { sup } from "@mdit/plugin-sup";

import vueDevTools from "vite-plugin-vue-devtools";
// @ts-ignore
import type { UserProfile } from "../src/types/UserProfile";

const SPACE_OR_PUNCTUATION = new RegExp(
  // ts-ignore
  /[\n\r -#%-*,-/:;?@[-\]_{}\u00A0\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u1680\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2000-\u200A\u2010-\u2029\u202F-\u2043\u2045-\u2051\u2053-\u205F\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u3000-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+/
);

export function tokenize(text: string): Array<string> {
  // Firefox doesn't support Intl.Segmenter currently
  if (!("Segmenter" in Intl)) {
    // https://github.com/lucaong/minisearch/blob/c3101a31e57d609ef8c55352655235ba25376011/src/MiniSearch.ts#L2018
    return text.split(SPACE_OR_PUNCTUATION);
  }

  // @ts-ignore: seems like Intl.Segmenter is not supported by the lang server
  const segmenter = new Intl.Segmenter("cn", { granularity: "word" });
  // @ts-ignore
  const segs = Array.from(segmenter.segment(text)).map(item => item.segment);
  const uniqueSegs = Array.from(new Set(segs));
  return uniqueSegs.filter(w => !/^\s+$/.test(w));
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blog/",
  title: "今天没有早睡",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/blog/favicon.ico",
      },
    ],
    [
      "link",
      {
        rel: "manifest",
        href: "/blog/manifest.json",
      },
    ],
    [
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.blue-archive.io/harmonyos-sans-webfont/harmonyos-sans-sc-400.css",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ],
    [
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.blue-archive.io/harmonyos-sans-webfont/harmonyos-sans-sc-700.css",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ],
    [
      "link",
      {
        rel: "prefetch",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0",
        as: "style",
        onload: "this.rel='stylesheet';this.onload=null;",
      },
    ],
    [
      "script",
      {
        async: "",
        defer: "",
        type: "text/javascript",
      },
      `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "m0pjwvqh46");`,
    ],
  ],
  description: "",
  lastUpdated: true,
  markdown: {
    math: true,
    headers: {
      level: [2, 6],
    },
    config: md => {
      md.use(implicitFigures, {
        figcaption: true,
        copyAttrs: "^class$",
      })
        .use(mark)
        .use(ruby)
        .use(spoiler)
        .use(imgSize)
        .use(imgLazyload)
        .use(sub)
        .use(sup);
    },
  },

  themeConfig: {
    // @ts-ignore
    userProfile: {
      name: "今天早睡了吗",
      email: "mail@blue-archive.io",
      avatar: "avatar.webp",
      bio: "To trace the bright moonlight",
    } as UserProfile,
    // https://vitepress.dev/reference/default-theme-config
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
        forceLocale: true,
      },
    },
    sidebar: generateSidebar({
      documentRootPath: "/docs",
      useTitleFromFileHeading: true,
      useTitleFromFrontmatter: true,
      useFolderTitleFromIndexFile: true,
      // useFolderLinkFromIndexFile: false,
      // hyphenToSpace: true,
      // underscoreToSpace: true,
      // capitalizeFirst: true,
      // capitalizeEachWords: true,
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
      excludePattern: ["tags.md"],
      // excludeFilesByFrontmatter: false,
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

      options: {
        miniSearch: {
          options: {
            tokenize,
          },
        },
      },
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

    footer: {
      message:
        "We improve our products and advertising by using Microsoft Clarity to see how you use our website. By using our site, you agree that we and Microsoft can collect and use this data.",
      copyright: `© 2024-${new Date().getFullYear()} Mark Chen`,
    },

    socialLinks: [{ icon: "github", link: "https://github.com/mark9804" }],
  },

  vite: {
    server: {
      port: 5500,
      open: true,
    },
    ssr: { noExternal: ["@arco-design/web-vue"] },
    plugins: [
      AutoImport({
        resolvers: [ArcoResolver({ sideEffect: true, resolveIcons: true })],
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
    ],
    css: {
      postcss: {
        plugins: [
          px2rem({
            rootValue: 16,
            propBlackList: ["font-size", "border", "border-width"],
            exclude: /(node_module)/,
          }),
          // vitePluginForArco({
          //   style: "css",
          // }),
        ],
      },
    },
  },
});
