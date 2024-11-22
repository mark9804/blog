import { defineConfig } from "vitepress";
import { HeadConfig, DefaultTheme } from "vitepress";
import { BASE_URL, DOMAIN } from "./constants";
import { headConfig } from "./configs/headConfig";
import { markdownConfig } from "./configs/markdownConfig";
import { themeConfig } from "./configs/themeConfig";
import { viteConfig } from "./configs/viteConfig";
import { sidebarConfig } from "./configs/sidebarConfig";
import { withSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig(
  withSidebar(
    {
      base: BASE_URL,
      title: "今天没有早睡",
      head: headConfig as HeadConfig[],
      description: "",
      lang: "zh-CN",
      sitemap: {
        hostname: DOMAIN + BASE_URL,
      },
      lastUpdated: true,
      markdown: markdownConfig,
      themeConfig: themeConfig as DefaultTheme.Config,
      vite: viteConfig,
    },
    sidebarConfig
  )
);
