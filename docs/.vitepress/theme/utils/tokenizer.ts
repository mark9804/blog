interface TokenizerCache {
  stopWords: Set<string>;
  segmenter: Intl.Segmenter | null;
}

interface CachedTokenize {
  (text: string): string[];
  _cache?: TokenizerCache;
}

// Self-contained because VitePress serializes `tokenize.toString()` into client siteData.
export function tokenize(text: string): string[] {
  const self = tokenize as CachedTokenize;
  const cache = (self._cache ??= {
    stopWords: new Set([
      "的",
      "了",
      "和",
      "是",
      "就",
      "都",
      "而",
      "及",
      "与",
      "着",
      "或",
      "一个",
      "没有",
      "我们",
      "你们",
      "他们",
      "它们",
      "这个",
      "那个",
      "这些",
      "那些",
      "什么",
      "怎么",
      "如何",
      "为什么",
    ]),
    segmenter:
      typeof Intl !== "undefined" && "Segmenter" in Intl
        ? new Intl.Segmenter("zh-CN", { granularity: "word" })
        : null,
  });

  if (!cache.segmenter) {
    return text
      .split(/[\n\r\p{Z}\p{P}]+/u)
      .flatMap(word =>
        /^[\u4e00-\u9fa5]+$/.test(word) ? word.split("") : word
      )
      .filter(
        w =>
          w.length > 0 &&
          !/^\s+$/.test(w) &&
          !cache.stopWords.has(w.toLowerCase())
      );
  }

  const segments: string[] = [];
  for (const { segment } of cache.segmenter.segment(text)) {
    if (
      segment.length > 0 &&
      !/^\s+$/.test(segment) &&
      !cache.stopWords.has(segment.toLowerCase())
    ) {
      segments.push(segment);
    }
  }

  return Array.from(new Set(segments));
}
