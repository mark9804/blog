import { sift, unique } from "radashi";
import { data as posts } from "../loaders/posts.data.ts";
import type { Post } from "../types/Post.ts";

export function createFilter(prefix?: string) {
  const normalizedPrefix = prefix ? `/${prefix}/` : "";
  return function (post: Post): boolean {
    return (
      post.frontmatter?.publish !== false &&
      !post.url.endsWith("/") &&
      (!normalizedPrefix || post.url.startsWith(normalizedPrefix))
    );
  };
}

export const defaultFilter = createFilter("breves");
export const defaultQuaversFilter = createFilter("quavers");

const postMap = new Map<string, Post>(posts.map(post => [post.url, post]));

export const postData = {
  posts,
  getPost(url: string): Post | undefined {
    return postMap.get(url);
  },
  getAllPosts(filter?: (post: Post) => boolean): Post[] {
    const selected = filter ? posts.filter(filter) : [...posts];
    return selected.sort((a, b) => b.createdAt - a.createdAt);
  },
  getAllTags(): string[] {
    return unique(
      sift(
        posts
          .filter(
            post =>
              post.frontmatter?.publish !== false && !post.url.endsWith("/")
          )
          .flatMap(post => post.frontmatter?.tags ?? [])
      )
    );
  },
};
