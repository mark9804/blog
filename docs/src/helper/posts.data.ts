import { spawn } from "cross-spawn";
import fs from "fs";
import path from "path";
import pMap from "p-map";
import { createContentLoader } from "vitepress";
import wordsCount from "words-count";
import type Config from "words-count";

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
  return path.join(siteConfig.srcDir, file);
}

// getLastUpdated function to fetch the last update time of a markdown file
async function getLastUpdated(url) {
  const file = transformUrlToPath(url);

  return new Promise((resolve, reject) => {
    const cwd = path.dirname(file);
    if (!fs.existsSync(cwd)) return resolve(0);
    const fileName = path.basename(file);
    const child = spawn("git", ["log", "-1", '--pretty="%ai"', fileName], {
      cwd,
    });
    let output = "";
    child.stdout.on("data", data => (output += String(data)));
    child.on("close", () => resolve(new Date(output).getTime()));
    child.on("error", reject);
  });
}

function getWordCount(url) {
  const file = transformUrlToPath(url);
  const content = fs.readFileSync(file, "utf-8");
  const postContent = content.replace(/---[\s\S]*?---/, "");
  return (wordsCount as unknown as WordsCount).wordsCount(postContent);
}

function getReadingTime(url, wpms = 200) {
  return Math.ceil(getWordCount(url) / wpms);
}

// Define the custom loader using createContentLoader
const loader = createContentLoader("**/*.md", {
  async transform(rawData) {
    const data = await pMap(
      rawData,
      async item => {
        const lastUpdated = (await getLastUpdated(
          item.url
        )) as unknown as number;
        const wordsCount = getWordCount(item.url);
        const readingTime = getReadingTime(item.url);

        return { ...item, lastUpdated, wordsCount, readingTime };
      },
      { concurrency: 64 }
    );
    // Sort the data based on the lastUpdated field
    data.sort((a, b) => b.lastUpdated - a.lastUpdated);
    return data;
  },
});

// Export the data and the loader
export const data = loader.load();
export default loader;
