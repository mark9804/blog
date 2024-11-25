import { defineConfig } from "vitepress";
import { HeadConfig, DefaultTheme } from "vitepress";
import { BASE_URL, DOMAIN } from "./constants";
import { headConfig } from "./configs/headConfig";
import { markdownConfig } from "./configs/markdownConfig";
import { themeConfig } from "./configs/themeConfig";
import { viteConfig } from "./configs/viteConfig";
import { sidebarConfig } from "./configs/sidebarConfig";
import { withSidebar } from "vitepress-sidebar";

// withSidebar 在设置了 `resolvePath` 后不会在 `link` 前添加 `/`，
// 导致 VitePress 不能正确应用 `is-active` 类
// 这里手动递归处理一下添加
function processLinks(
  items: DefaultTheme.SidebarItem[]
): DefaultTheme.SidebarItem[] {
  const processedItems = items.map(item => {
    if (item.items) {
      item.items = processLinks(item.items);
    }
    if (item.link && !item.link.startsWith("/")) {
      item.link = "/" + item.link;
    }
    return item;
  });

  // 将归档文件夹移到末尾
  return processedItems.sort((a, b) => {
    if (a.text?.includes("归档")) return 1;
    if (b.text?.includes("归档")) return -1;
    return 0;
  });
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
  themeConfig: {
    ...(themeConfig as DefaultTheme.Config),
    sidebar: processLinks(
      withSidebar({}, sidebarConfig).themeConfig.sidebar || []
    ),
  },
  vite: viteConfig,
});
