import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineLoader } from "vitepress";
import type { ChangelogMap, GitCommitEntry } from "../types/Changelog";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.resolve(__dirname, "../../..");
const REPO_ROOT = path.resolve(DOCS_DIR, "..");

declare const data: ChangelogMap;
export { data };

function normalizeDocRelativePath(rawPath: string): string {
  const normalized = rawPath.replace(/\\/g, "/").trim();
  if (
    !normalized.startsWith("docs/") ||
    !normalized.endsWith(".md") ||
    normalized.startsWith("docs/.vitepress/")
  ) {
    return "";
  }
  return normalized.slice("docs/".length);
}

function appendCommit(
  map: ChangelogMap,
  docPath: string,
  commit: GitCommitEntry
) {
  const list = (map[docPath] ??= []);
  if (list[list.length - 1]?.hash !== commit.hash) {
    list.push(commit);
  }
}

function collectGitChangelog(): ChangelogMap {
  let output = "";
  try {
    output = execFileSync(
      "git",
      [
        "-c",
        "core.quotePath=false",
        "log",
        "-M",
        "--no-merges",
        "--name-status",
        "--format=__COMMIT__\x1f%H\x1f%h\x1f%at\x1f%s",
        "--",
        "docs",
      ],
      {
        cwd: REPO_ROOT,
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
      }
    );
  } catch {
    return {};
  }

  const rawMap: ChangelogMap = {};
  const aliasTargets = new Map<string, Set<string>>();
  let currentCommit: GitCommitEntry | null = null;

  for (const line of output.split(/\r?\n/)) {
    if (!line) continue;

    if (line.startsWith("__COMMIT__\x1f")) {
      const [, hash = "", shortHash = "", unixSeconds = "0", subject = ""] =
        line.split("\x1f");
      currentCommit = {
        hash,
        shortHash,
        timestamp: Number(unixSeconds) * 1000,
        subject: subject.trim(),
      };
      continue;
    }

    if (!currentCommit) continue;

    const parts = line.split("\t");
    const status = parts[0] ?? "";

    if (status.startsWith("R") && parts.length >= 3) {
      const oldPath = normalizeDocRelativePath(parts[1]);
      const newPath = normalizeDocRelativePath(parts[2]);
      if (newPath) {
        const targets = aliasTargets.get(newPath) ?? new Set([newPath]);
        for (const target of targets) {
          appendCommit(rawMap, target, currentCommit);
        }
        if (oldPath) {
          aliasTargets.set(oldPath, new Set(targets));
        }
      }
    } else if (parts.length >= 2) {
      const docPath = normalizeDocRelativePath(parts[1]);
      if (docPath) {
        const targets = aliasTargets.get(docPath) ?? new Set([docPath]);
        for (const target of targets) {
          appendCommit(rawMap, target, currentCommit);
        }
      }
    }
  }

  // Keep only currently existing markdown documents to minimize client bundle size
  const filtered: ChangelogMap = {};
  for (const [docPath, commits] of Object.entries(rawMap)) {
    if (commits.length > 0 && existsSync(path.join(DOCS_DIR, docPath))) {
      filtered[docPath] = commits;
    }
  }

  return filtered;
}

export default defineLoader({
  load(): ChangelogMap {
    return collectGitChangelog();
  },
});
