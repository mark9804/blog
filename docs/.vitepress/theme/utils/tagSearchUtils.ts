import { withBase } from "vitepress";

export const useSearchTags = {
  go: () => {
    window.location.href = withBase("/tags/");
  },
};
