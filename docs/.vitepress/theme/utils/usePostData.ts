import { data as usePosts } from "../loaders/posts.data";
import type { Post } from "../types/Post";
import { unique, sift } from "radash";
import { compareDates } from "./timeUtils";

export function createFilter(pattern?: string) {
  return function (post: Post) {
    return (
      post.frontmatter?.publish !== false &&
      !post.url.endsWith("/") &&
      !!post.url.match(new RegExp(pattern ?? "" + "/"))
    );
  };
}

export const defaultFilter = createFilter("breves");
export const defaultQuaversFilter = createFilter("quavers");

export const postData = {
  async getAllPosts(filter?: (post: Post) => boolean) {
    const posts = (await usePosts) as Post[];
    const filteredPosts = filter ? posts.filter(filter) : posts;
    return filteredPosts.sort((a, b) => compareDates(a.createdAt, b.createdAt));
  },

  async getCreatedAt(currentPathWithoutBase: string) {
    const posts = (await usePosts) as Post[];
    return posts.find(el => el.url === currentPathWithoutBase)?.createdAt ?? 0;
  },

  async getReadingTime(currentPathWithoutBase: string) {
    const posts = (await usePosts) as Post[];
    return (
      posts.find(el => el.url === currentPathWithoutBase)?.readingTime ?? 0
    );
  },

  async getWordsCount(currentPathWithoutBase: string) {
    const posts = (await usePosts) as Post[];
    return posts.find(el => el.url === currentPathWithoutBase)?.wordsCount ?? 0;
  },

  async getImgCount(currentPathWithoutBase: string) {
    const posts = (await usePosts) as Post[];
    return posts.find(el => el.url === currentPathWithoutBase)?.imgCount ?? 0;
  },

  async getAllTags() {
    const posts = (await usePosts) as Post[];
    return unique(sift(posts.map(el => el.frontmatter?.tags).flat()));
  },
};
