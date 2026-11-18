import type { DefaultTheme, HeadConfig, UserConfigFn } from "vitepress";
import { withSidebar } from "vitepress-sidebar";
import { BASE_URL, DOMAIN } from "./constants.ts";
import { headConfig } from "./configs/headConfig.ts";
import { markdownConfig } from "./configs/markdownConfig.ts";
import { sidebarConfig } from "./configs/sidebarConfig.ts";
import { themeConfig } from "./configs/themeConfig.ts";
import { createViteConfig } from "./configs/viteConfig.ts";

const SIDEBAR_BOTTOM_PATTERNS = ["考古"];

function isBottomSidebarItem(item: DefaultTheme.SidebarItem): boolean {
  return SIDEBAR_BOTTOM_PATTERNS.some(pattern => item.text?.includes(pattern));
}

function fixSidebarLinks(
  sidebar: DefaultTheme.SidebarItem[]
): DefaultTheme.SidebarItem[] {
  return sidebar
    .map(item => ({
      ...item,
      link:
        item.link && !item.link.startsWith("/") ? `/${item.link}` : item.link,
      items: item.items ? fixSidebarLinks(item.items) : undefined,
    }))
    .sort(
      (a, b) => Number(isBottomSidebarItem(a)) - Number(isBottomSidebarItem(b))
    );
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

const config: UserConfigFn<DefaultTheme.Config> = ({ mode }) => ({
  base: BASE_URL,
  cleanUrls: true,
  title: "今天没有早睡",
  head: headConfig as HeadConfig[],
  description: "",
  lang: "zh-CN",
  sitemap: {
    hostname: DOMAIN,
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
