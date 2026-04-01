import { type UserConfigFn } from "vitepress";
import { HeadConfig, DefaultTheme } from "vitepress";
import { BASE_URL, DOMAIN } from "./constants";
import { headConfig } from "./configs/headConfig";
import { markdownConfig } from "./configs/markdownConfig";
import { themeConfig } from "./configs/themeConfig";
import { createViteConfig } from "./configs/viteConfig";
import { sidebarConfig } from "./configs/sidebarConfig";
import { withSidebar } from "vitepress-sidebar";

const SIDEBAR_BOTTOM_PATTERNS = ["考古"];

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
    const aBottom = SIDEBAR_BOTTOM_PATTERNS.some(p => a.text?.includes(p));
    const bBottom = SIDEBAR_BOTTOM_PATTERNS.some(p => b.text?.includes(p));
    if (aBottom && !bBottom) return 1;
    if (!aBottom && bBottom) return -1;
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
const config: UserConfigFn<DefaultTheme.Config> = ({ mode }) => ({
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
  vite: createViteConfig(mode),
});

export default config;
