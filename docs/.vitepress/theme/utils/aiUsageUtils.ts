export type AiUsageLevel =
  "undisclosed" | "none" | "hint" | "assist" | "pair" | "copilot" | "auto";

export interface AiUsageLlmItem {
  name: string;
  summary?: string;
}

export interface RawAiUsage {
  used?: boolean;
  summary?: string;
  level?: string;
  llms?: Array<AiUsageLlmItem | string>;
}

export interface AiUsage {
  used: boolean;
  level: AiUsageLevel;
  summary?: string;
  llms: AiUsageLlmItem[];
}

export interface AiUsageLevelConfig {
  label: string;
  defaultSummary: string;
}

export interface AiLevelMeta extends AiUsageLevelConfig {
  rank: null | 0 | 1 | 2 | 3 | 4 | 5;
  filledIcon: boolean;
}

export interface AiUsageConfig {
  enabled?: boolean;
  defaultLevel?: AiUsageLevel;
  prefix?: string;
  modelsHeading?: string;
  levels?: Partial<Record<AiUsageLevel, Partial<AiUsageLevelConfig>>>;
}

export interface ResolvedAiUsageConfig {
  enabled: boolean;
  defaultLevel: AiUsageLevel;
  prefix: string;
  modelsHeading: string;
  levels: Record<AiUsageLevel, AiLevelMeta>;
}

const ALL_LEVELS: readonly AiUsageLevel[] = [
  "undisclosed",
  "none",
  "hint",
  "assist",
  "pair",
  "copilot",
  "auto",
];

const VALID_LEVELS = new Set<AiUsageLevel>(ALL_LEVELS);

export const DEFAULT_AI_LEVEL_META: Record<AiUsageLevel, AiLevelMeta> = {
  undisclosed: {
    label: "未声明",
    defaultSummary: "本文未附加 AI 使用声明（通常为早期撰写或未作专门标注）。",
    rank: null,
    filledIcon: false,
  },
  none: {
    label: "未使用",
    defaultSummary: "本文由作者独立撰写，未使用生成式 AI 参与内容生产。",
    rank: 0,
    filledIcon: false,
  },
  hint: {
    label: "检索启发",
    defaultSummary: "仅在构思、资料检索或概念核对阶段参考了 AI 提示。",
    rank: 1,
    filledIcon: false,
  },
  assist: {
    label: "辅助润色",
    defaultSummary: "正文由作者撰写，AI 仅用于措辞润色、勘误或格式整理。",
    rank: 2,
    filledIcon: false,
  },
  pair: {
    label: "结对协作",
    defaultSummary:
      "作者主导结构与核心观点，部分段落或示例与 AI 协作推敲完成。",
    rank: 3,
    filledIcon: false,
  },
  copilot: {
    label: "深度协同",
    defaultSummary:
      "由作者给出详细提纲与技术约束，AI 生成初稿并经作者审校重构。",
    rank: 4,
    filledIcon: true,
  },
  auto: {
    label: "主导生成",
    defaultSummary: "本文主要由 AI 生成，经作者审核后发布。",
    rank: 5,
    filledIcon: true,
  },
};

export function isAiUsageLevel(value: unknown): value is AiUsageLevel {
  return typeof value === "string" && VALID_LEVELS.has(value as AiUsageLevel);
}

export function resolveAiUsageConfig(
  custom?: AiUsageConfig
): ResolvedAiUsageConfig {
  const levels = {} as Record<AiUsageLevel, AiLevelMeta>;

  for (const key of ALL_LEVELS) {
    const base = DEFAULT_AI_LEVEL_META[key];
    const override = custom?.levels?.[key];
    levels[key] = {
      label: override?.label?.trim() || base.label,
      defaultSummary: override?.defaultSummary?.trim() || base.defaultSummary,
      rank: base.rank,
      filledIcon: base.filledIcon,
    };
  }

  const defaultLevel =
    custom?.defaultLevel && isAiUsageLevel(custom.defaultLevel)
      ? custom.defaultLevel
      : "undisclosed";

  return {
    enabled: custom?.enabled !== false,
    defaultLevel,
    prefix: custom?.prefix ?? "AI 声明：",
    modelsHeading: custom?.modelsHeading ?? "参与模型",
    levels,
  };
}

function normalizeLlms(rawLlms: unknown): AiUsageLlmItem[] {
  if (!Array.isArray(rawLlms)) return [];

  const result: AiUsageLlmItem[] = [];
  for (const item of rawLlms) {
    if (typeof item === "string") {
      const name = item.trim();
      if (name) result.push({ name });
      continue;
    }

    if (item && typeof item === "object" && "name" in item) {
      const rawName = (item as { name?: unknown }).name;
      const rawSummary = (item as { summary?: unknown }).summary;
      const name = typeof rawName === "string" ? rawName.trim() : "";
      if (!name) continue;
      const summary =
        typeof rawSummary === "string" && rawSummary.trim()
          ? rawSummary.trim()
          : undefined;
      result.push(summary ? { name, summary } : { name });
    }
  }

  return result;
}

function buildFallbackAiUsage(
  defaultLevel: AiUsageLevel,
  summary?: string
): AiUsage {
  return {
    used: defaultLevel !== "none" && defaultLevel !== "undisclosed",
    level: defaultLevel,
    summary,
    llms: [],
  };
}

/**
 * Normalize raw frontmatter `ai_usage` into a guaranteed, contradiction-free `AiUsage` record.
 * Undeclared or empty inputs resolve to `defaultLevel` (defaults to `"undisclosed"`).
 * Descriptive `summary` text is orthogonal metadata and never alters `used` or `level`.
 */
export function normalizeAiUsage(
  raw: unknown,
  defaultLevel: AiUsageLevel = "undisclosed"
): AiUsage {
  if (typeof raw === "boolean") {
    return raw
      ? { used: true, level: "assist", llms: [] }
      : { used: false, level: "none", llms: [] };
  }

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return buildFallbackAiUsage(defaultLevel);
  }

  const record = raw as Record<string, unknown>;
  const rawUsed = typeof record.used === "boolean" ? record.used : undefined;
  const rawLevel =
    typeof record.level === "string" ? record.level.trim().toLowerCase() : "";
  const validLevel = isAiUsageLevel(rawLevel) ? rawLevel : undefined;
  const summary =
    typeof record.summary === "string" && record.summary.trim()
      ? record.summary.trim()
      : undefined;
  const llms = normalizeLlms(record.llms);

  if (rawUsed === false || validLevel === "none") {
    return {
      used: false,
      level: "none",
      summary,
      llms: [],
    };
  }

  if (validLevel === "undisclosed" && rawUsed !== true) {
    return {
      used: false,
      level: "undisclosed",
      summary,
      llms: [],
    };
  }

  if (rawUsed === undefined && validLevel === undefined && llms.length === 0) {
    return buildFallbackAiUsage(defaultLevel, summary);
  }

  const resolvedLevel: AiUsageLevel =
    validLevel && validLevel !== "undisclosed" ? validLevel : "assist";

  return {
    used: true,
    level: resolvedLevel,
    summary,
    llms,
  };
}
