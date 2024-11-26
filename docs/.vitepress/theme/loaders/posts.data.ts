import { spawn } from "cross-spawn";
import { readFileSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import pMap from "p-map";
import { createContentLoader } from "vitepress";
import wordsCount from "words-count";
import type Config from "words-count";

declare global {
  var VITEPRESS_CONFIG: {
    srcDir: string;
    rewrites: {
      inv: Record<string, string>;
    };
  };
}

interface WordsCount {
  default: (text: string, config?: typeof Config) => number;
  wordsCount: (text: string, config?: typeof Config) => number;
  wordsSplit: (text: string, config?: typeof Config) => string[];
  wordsDetect: (
    text: string,
    config?: typeof Config
  ) => { count: number; words: string[] };
}

function transformUrlToPath(url: string) {
  const siteConfig = globalThis.VITEPRESS_CONFIG;

  let file = url.replace(/(^|\/)$/, "$1index").replace(/(\.html)?$/, ".md");
  file = siteConfig.rewrites.inv[file] || file;
  return join(siteConfig.srcDir, file);
}

// getCreatedAt function to fetch the created (first commit) time of a markdown file
async function getCreatedAt(url: string) {
  const file = transformUrlToPath(url);

  return new Promise((resolve, reject) => {
    const cwd = dirname(file);
    if (!existsSync(cwd)) return resolve(0);
    const fileName = basename(file);
    const child = spawn(
      "git",
      ["log", "--diff-filter=A", "--follow", "--format=%ai", "-1", fileName],
      {
        cwd,
      }
    );
    let output = "";
    child.stdout.on("data", (data: Buffer) => (output += String(data)));
    child.on("close", () => resolve(new Date(output).getTime()));
    child.on("error", reject);
  });
}

function getWordCount(content: string) {
  const postContent = content.replace(/---[\s\S]*?---/, "");
  return (wordsCount as unknown as WordsCount).wordsCount(postContent);
}

function getImgCount(content: string) {
  return content.match(/!\[.*?\]\(.*?\)/g)?.length || 0;
}

function getReadingTime(content: string, wpms = 200) {
  // 将样本图片输入 CLIP 得到描述，平均字数约为 229 汉字，以此为标准计算图片阅读时间
  return Math.ceil((getWordCount(content) + getImgCount(content) * 229) / wpms);
}

// Define the custom loader using createContentLoader
const loader = createContentLoader("**/*.md", {
  async transform(rawData) {
    return await pMap(
      rawData,
      async item => {
        if (item.url.endsWith("/")) return { ...item, createdAt: 0 };
        const file = transformUrlToPath(item.url);
        const frontmatter = item.frontmatter;
        const wpms = 200 * (frontmatter?.timeAmp ?? 1);
        const content = readFileSync(file, "utf-8");

        const createdAt =
          item.frontmatter?.createdAt ??
          ((await getCreatedAt(item.url)) as unknown as number);
        const wordsCount = getWordCount(content);
        const imgCount = getImgCount(content);
        const readingTime = getReadingTime(content, wpms);

        return {
          ...item,
          createdAt,
          wordsCount,
          imgCount,
          readingTime,
          src: item.src,
        };
      },
      { concurrency: 64 }
    );
  },
});

// Export the data and the loader
export const data = loader.load();
export default loader;
