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
