import { withBase } from "vitepress";
import { unique } from "radash";

export const useSearchTags = {
  get: () =>
    new URL(window.location.href).searchParams
      .get("keywords")
      ?.split(",")
      .filter(Boolean) || [],

  set: (tags: string[]) => {
    const url = new URL(window.location.href);
    url.searchParams.set("keywords", unique(tags).join(","));
    window.location.href = url.toString();
  },

  push: (tags: string[]) => {
    const currentTags = useSearchTags.get();
    useSearchTags.set([...currentTags, ...tags]);
  },

  remove: (tag: string) => {
    const currentTags = useSearchTags.get();
    useSearchTags.set(currentTags.filter(t => t !== tag));
  },

  go: (tags: string[]) => {
    window.location.href = withBase(
      `/tags/?keywords=${encodeURIComponent(unique(tags).join(","))}`
    );
  },
};
