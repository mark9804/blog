export interface GitCommitEntry {
  hash: string;
  shortHash: string;
  timestamp: number;
  subject: string;
}

export type ChangelogMap = Record<string, GitCommitEntry[]>;
