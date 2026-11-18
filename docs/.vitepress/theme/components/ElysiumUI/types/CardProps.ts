import type { Post } from "../../../types/Post";

export type CardProps = {
  content?: Post;
  maxWidth?: number | string;
  href?: string;
  ariaLabel?: string;
  external?: boolean;
};
