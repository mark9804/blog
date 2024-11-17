import type { Post } from "../../../types/Post";

export type CardProps = {
  content: Post;
  maxWidth?: number;
  as?: "card" | "link";
};
