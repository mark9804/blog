import { withBase, useRouter } from "vitepress";
import { computed, type ComputedRef } from "vue";

function normalizeTags(
  rawTags: readonly string[],
  validTags?: ReadonlySet<string>
): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const entry of rawTags) {
    for (const part of entry.split(",")) {
      const tag = part.trim();
      if (!tag || seen.has(tag)) continue;
      if (validTags && !validTags.has(tag)) continue;
      seen.add(tag);
      result.push(tag);
    }
  }

  return result;
}

export function buildTagsUrl(tags: string[]): string {
  const baseUrl = withBase("/tags");
  const normalized = normalizeTags(tags);
  if (normalized.length === 0) {
    return baseUrl;
  }

  const params = new URLSearchParams();
  for (const tag of normalized) {
    params.append("tags", tag);
  }
  return `${baseUrl}?${params.toString()}`;
}

export function useTagNavigation(validTags?: ReadonlySet<string>): {
  selectedTags: ComputedRef<string[]>;
  navigateToTag: (tag: string) => Promise<void>;
  setSelectedTags: (tags: string[], replace?: boolean) => Promise<void>;
  toggleTag: (tag: string) => Promise<void>;
  clearTags: () => Promise<void>;
} {
  const router = useRouter();

  const selectedTags = computed<string[]>(() => {
    const params = new URLSearchParams(router.route.query);
    return normalizeTags(params.getAll("tags"), validTags);
  });

  function navigateToTag(tag: string): Promise<void> {
    return router.go(buildTagsUrl([tag]));
  }

  function setSelectedTags(tags: string[], replace = true): Promise<void> {
    return router.go(buildTagsUrl(tags), { replace });
  }

  function toggleTag(tag: string): Promise<void> {
    const current = selectedTags.value;
    const next = current.includes(tag)
      ? current.filter(item => item !== tag)
      : [...current, tag];
    return setSelectedTags(next);
  }

  function clearTags(): Promise<void> {
    return setSelectedTags([]);
  }

  return {
    selectedTags,
    navigateToTag,
    setSelectedTags,
    toggleTag,
    clearTags,
  };
}
