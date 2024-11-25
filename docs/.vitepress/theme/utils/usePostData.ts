import { data as usePosts } from "../loaders/posts.data";
import type { Post } from "../types/Post";
import { unique, sift } from "radash";

export function defaultFilter(post: Post) {
  return (
    !post.frontmatter?.publish &&
    !post.url.endsWith("/") &&
    !!post.url.match(/posts\//)
  );
}

export const postData = {
  async getAllPosts(filter?: (post: Post) => boolean) {
    const posts = (await usePosts) as Post[];
    const sortedPosts = posts.sort((a, b) => b.createdAt - a.createdAt);
    return filter ? sortedPosts.filter(filter) : sortedPosts;
  },

  async getCreatedAt(currentPathWithoutBase: string) {
    const posts = (await usePosts) as Post[];
    return posts.find(el => el.url === currentPathWithoutBase)?.createdAt;
  },

  async getReadingTime(currentPathWithoutBase: string) {
    const posts = (await usePosts) as Post[];
    return posts.find(el => el.url === currentPathWithoutBase)?.readingTime;
  },

  async getWordsCount(currentPathWithoutBase: string) {
    const posts = (await usePosts) as Post[];
    return posts.find(el => el.url === currentPathWithoutBase)?.wordsCount;
  },

  async getImgCount(currentPathWithoutBase: string) {
    const posts = (await usePosts) as Post[];
    return posts.find(el => el.url === currentPathWithoutBase)?.imgCount;
  },

  async getAllTags() {
    const posts = (await usePosts) as Post[];
    return unique(sift(posts.map(el => el.frontmatter?.tags).flat()));
  },
};
