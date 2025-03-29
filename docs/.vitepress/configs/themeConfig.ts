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
    copyright: `© 2020 - ${new Date().getFullYear()} Mark Chen. Original content licensed under <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en' target='_blank'>CC-BY-NC-SA 4.0</a>.`,
  },

  socialLinks: [
    { icon: "github", link: "https://github.com/mark9804" },
    {
      ariaLabel: "LinkedIn",
      icon: {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/></svg>',
      },
      link: "https://www.linkedin.com/in/zhaolu-chen/",
    },
  ],
};
