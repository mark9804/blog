import { userProfile } from "./userProfile";
import { navConfig } from "./navConfig";
import { tokenize } from "../utils/tokenizer";

export const themeConfig = {
  userProfile: userProfile,
  logo: userProfile.avatar,
  lastUpdated: {
    text: "最后更新于",
    formatOptions: {
      dateStyle: "medium",
      timeStyle: "short",
      forceLocale: true,
    },
  },

  outline: "deep",

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

  nav: navConfig,

  footer: {
    message:
      "Powered by <a href='https://vitepress.dev' target='_blank'>VitePress</a> and <a href='https://github.com/mark9804/blog/tree/master/docs/.vitepress/theme/components/ElysiumUI' target='_blank'>Elysium UI</a>.<br>This site uses Microsoft Clarity to see how you use our website. By using our site, you agree that we and Microsoft can collect and use this data.",
    copyright: `© 2020${new Date().getFullYear() === 2024 ? "" : " - " + new Date().getFullYear()} Mark Chen. All posts are licensed under <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en' target='_blank'>CC-BY-NC-SA 4.0</a>.`,
  },

  socialLinks: [{ icon: "github", link: "https://github.com/mark9804" }],
};
