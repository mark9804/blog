import { defineConfig } from "vitepress";
import { HeadConfig, DefaultTheme } from "vitepress";
import { BASE_URL, DOMAIN } from "./constants";
import { headConfig } from "./configs/headConfig";
import { markdownConfig } from "./configs/markdownConfig";
import { themeConfig } from "./configs/themeConfig";
import { viteConfig } from "./configs/viteConfig";
import { sidebarConfig } from "./configs/sidebarConfig";
import { withSidebar } from "vitepress-sidebar";

function fixSidebarLinks(
  sidebar: DefaultTheme.SidebarItem[]
): DefaultTheme.SidebarItem[] {
  const processedItems = sidebar.map(item => {
    if (item.items) {
      item.items = fixSidebarLinks(item.items);
    }
    if (item.link && !item.link.startsWith("/")) {
      item.link = "/" + item.link;
    }
    return item;
  });

  return processedItems.sort((a, b) => {
    if (a.text?.includes("考古")) return 1;
    if (b.text?.includes("考古")) return -1;
    return 0;
  });
}

function processLinks(sidebar: DefaultTheme.Sidebar): DefaultTheme.Sidebar {
  const processedSidebar: DefaultTheme.Sidebar = {};
  for (const [path, config] of Object.entries(sidebar)) {
    if ("items" in config && Array.isArray(config.items)) {
      processedSidebar[path] = {
        base: config.base,
        items: fixSidebarLinks(config.items),
      };
    }
  }

  return processedSidebar;
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: BASE_URL,
  cleanUrls: true,
  title: "今天没有早睡",
  head: headConfig as HeadConfig[],
  description: "",
  lang: "zh-CN",
  sitemap: {
    hostname: DOMAIN + BASE_URL,
  },
  lastUpdated: true,
  markdown: markdownConfig,
  themeConfig: {
    ...(themeConfig as DefaultTheme.Config),
    sidebar: processLinks(withSidebar({}, sidebarConfig).themeConfig.sidebar),
  },
  vite: viteConfig,
});
