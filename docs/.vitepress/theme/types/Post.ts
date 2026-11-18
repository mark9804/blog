export interface PostMeta {
  hidden?: boolean;
  timeAmp?: number;
  hideArticleInfo?: boolean;
  hideEditTime?: boolean;
  hideReadingTime?: boolean;
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
}

export interface Post {
  url: string;
  createdAt: number;
  readingTime: number;
  wordsCount: number;
  imgCount: number;
  frontmatter: PostFrontmatter;
}
