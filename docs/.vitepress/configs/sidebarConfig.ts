import type { VitePressSidebarOptions } from "vitepress-sidebar/types";

const commonConfig: VitePressSidebarOptions = {
  documentRootPath: "/docs",
  useTitleFromFileHeading: true,
  useTitleFromFrontmatter: true,
  useFolderTitleFromIndexFile: true,
  collapsed: true,
  sortFolderTo: "top",
};

export const sidebarConfig: VitePressSidebarOptions[] = [
  {
    scanStartPath: "breves",
    resolvePath: "/breves",
    ...commonConfig,
  },
  {
    scanStartPath: "quavers",
    resolvePath: "/quavers",
    ...commonConfig,
  },
];
