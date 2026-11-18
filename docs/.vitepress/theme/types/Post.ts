import type { AiUsage, RawAiUsage } from "../utils/aiUsageUtils.ts";

export interface PostMeta {
  hidden?: boolean;
  timeAmp?: number;
  hideArticleInfo?: boolean;
  hideEditTime?: boolean;
  hideReadingTime?: boolean;
  hideAiUsage?: boolean;
}

export interface PostFrontmatter {
  title?: string;
  description?: string;
  tags?: string[];
  cover?: string;
  publish?: boolean;
  comment?: boolean;
  gitChangelog?: boolean;
  createdAt?: number | string;
  meta?: PostMeta;
  ai_usage?: RawAiUsage | AiUsage | boolean;
}

export interface Post {
  url: string;
  createdAt: number;
  readingTime: number;
  wordsCount: number;
  imgCount: number;
  frontmatter: PostFrontmatter;
}
