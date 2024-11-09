// @ts-ignore
import { data as usePosts } from "../loaders/posts.data";

export function getCreatedAt(currentPathWithoutBase: string) {
  return usePosts.find(el => el.url === currentPathWithoutBase)?.createdAt;
}
