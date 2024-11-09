// @ts-ignore
import { data as usePosts } from "../loaders/posts.data";

export async function getCreatedAt(currentPathWithoutBase: string) {
  const posts = await usePosts;
  return posts.find(el => el.url === currentPathWithoutBase)?.createdAt;
}
