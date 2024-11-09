import { userProfile } from "./userProfile";
import { navConfig } from "./navConfig";
import { tokenize } from "../utils/tokenizer";

export const themeConfig = {
  userProfile: userProfile,
  lastUpdated: {
    text: "最后更新于",
    formatOptions: {
      dateStyle: "medium",
      timeStyle: "short",
      forceLocale: true,
    },
  },

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
      "We improve our products and advertising by using Microsoft Clarity to see how you use our website. By using our site, you agree that we and Microsoft can collect and use this data.",
    copyright: `© 2024-${new Date().getFullYear()} Mark Chen`,
  },

  socialLinks: [{ icon: "github", link: "https://github.com/mark9804" }],
};
