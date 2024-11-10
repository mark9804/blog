// @ts-ignore
import { data as usePosts } from "../loaders/posts.data";

export type Post = {
  url: string;
  createdAt: number;
  readingTime: number;
  wordsCount: number;
  imgCount: number;
  src: string;
  html: string;
  frontmatter: Record<string, any>;
  excerpt: string;
};

export const postData = {
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
};
