import { data as rawPosts } from "../loaders/posts.data";
import type { Post } from "../types/Post";
import { unique, sift } from "radashi";
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

const posts = rawPosts as unknown as Post[];

export const postData = {
  posts,
  getPost(url: string) {
    return posts.find(el => el.url === url);
  },
  getAllPosts(filter?: (post: Post) => boolean) {
    const filteredPosts = filter ? posts.filter(filter) : posts;
    return filteredPosts.sort((a, b) => compareDates(a.createdAt, b.createdAt));
  },
  getAllTags() {
    return unique(sift(posts.map(el => el.frontmatter?.tags).flat()));
  },
};
