import { defineLoader } from "vitepress";
import type { ChangelogMap } from "../types/Changelog.ts";
import { collectGitHistory } from "./_gitHistory.ts";

declare const data: ChangelogMap;
export { data };

export default defineLoader({
  load(): ChangelogMap {
    return collectGitHistory().changelog;
  },
});
