import { TZDate } from "@date-fns/tz";
import { createContentLoader } from "vitepress";
import wordsCountModule from "words-count";
import { aiUsageConfig } from "../../configs/themeConfig.ts";
import type { Post, PostFrontmatter } from "../types/Post.ts";
import { normalizeAiUsage } from "../utils/aiUsageUtils.ts";
import { DEFAULT_TIMEZONE } from "../utils/timeUtils.ts";
import { collectGitHistory } from "./_gitHistory.ts";

declare global {
  var VITEPRESS_CONFIG:
    | {
        rewrites?: {
          inv?: Record<string, string>;
        };
      }
    | undefined;
}

type WordsCountFn = (text: string) => number;

const countWords: WordsCountFn =
  typeof wordsCountModule === "function"
    ? wordsCountModule
    : (wordsCountModule as { wordsCount: WordsCountFn }).wordsCount;

const FRONTMATTER_BLOCK_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
const MARKDOWN_IMAGE_RE = /!\[.*?\]\(.*?\)/g;
const LOCAL_DATETIME_RE =
  /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/;
const EXPLICIT_OFFSET_RE = /(?:Z|[+-]\d{2}:?\d{2})$/i;

// Average caption equivalence (~229 Chinese characters per image)
const WORDS_PER_IMAGE = 229;
const BASE_WORDS_PER_MINUTE = 200;

function urlToDocPath(url: string): string {
  const raw = url
    .replace(/^\//, "")
    .replace(/(^|\/)$/, "$1index")
    .replace(/(\.html)?$/, ".md");
  return globalThis.VITEPRESS_CONFIG?.rewrites?.inv?.[raw] || raw;
}

function parseCreatedAt(raw: unknown): number | null {
  if (typeof raw === "number") {
    return Number.isFinite(raw) && raw > 0 ? raw : null;
  }

  if (raw instanceof Date) {
    const ms = raw.getTime();
    return Number.isFinite(ms) && ms > 0 ? ms : null;
  }

  if (typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
  }

  if (EXPLICIT_OFFSET_RE.test(trimmed)) {
    const parsed = Date.parse(trimmed);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  const match = LOCAL_DATETIME_RE.exec(trimmed);
  if (match) {
    const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;
    const tzDate = new TZDate(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
      DEFAULT_TIMEZONE
    );
    const ms = tzDate.getTime();
    return Number.isFinite(ms) && ms > 0 ? ms : null;
  }

  const fallback = Date.parse(trimmed);
  return Number.isFinite(fallback) && fallback > 0 ? fallback : null;
}

declare const data: Post[];
export { data };

export default createContentLoader<Post[]>("**/*.md", {
  includeSrc: true,
  transform(rawData): Post[] {
    const { initialTimestamps } = collectGitHistory();
    const posts: Post[] = [];

    for (const item of rawData) {
      const rawFrontmatter = (item.frontmatter ?? {}) as PostFrontmatter;
      if (item.url.endsWith("/") || rawFrontmatter.publish === false) {
        continue;
      }

      const frontmatter: PostFrontmatter = {
        ...rawFrontmatter,
        ai_usage: normalizeAiUsage(
          rawFrontmatter.ai_usage,
          aiUsageConfig.defaultLevel
        ),
      };

      const docPath = urlToDocPath(item.url);
      const createdAt =
        parseCreatedAt(frontmatter.createdAt) ??
        initialTimestamps[docPath] ??
        0;

      const body = (item.src ?? "").replace(FRONTMATTER_BLOCK_RE, "");
      const wordsCount = countWords(body);
      const imgCount = body.match(MARKDOWN_IMAGE_RE)?.length ?? 0;
      const wpms = BASE_WORDS_PER_MINUTE * (frontmatter.meta?.timeAmp ?? 1);
      const readingTime = Math.ceil(
        (wordsCount + imgCount * WORDS_PER_IMAGE) /
          (wpms > 0 ? wpms : BASE_WORDS_PER_MINUTE)
      );

      posts.push({
        url: item.url,
        createdAt,
        readingTime,
        wordsCount,
        imgCount,
        frontmatter,
      });
    }

    posts.sort((a, b) => b.createdAt - a.createdAt);
    return posts;
  },
});
