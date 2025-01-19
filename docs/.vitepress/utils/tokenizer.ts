interface SegmentItem {
  segment: string;
  index: number;
  input: string;
}

// @ts-ignore
// https://github.com/lucaong/minisearch/blob/d0cf787d08014b9ebeb5c3009dc30223c1d0d7e7/src/MiniSearch.ts#L2227
const SPACE_OR_PUNCTUATION = new RegExp(/[\n\r\p{Z}\p{P}]+/u);

export function tokenize(text: string): Array<string> {
  // do not count meaningless words
  // FIXME: attempts to extracting to config failed, undefined var
  const STOP_WORDS = new Set([
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
  ]);

  // Firefox doesn't support Intl.Segmenter until version 125
  if (!("Segmenter" in Intl)) {
    return text
      .split(SPACE_OR_PUNCTUATION)
      .flatMap(word => {
        // increase granularity for continuous chinese characters
        if (/^[\u4e00-\u9fa5]+$/.test(word)) {
          return word.split("");
        }
        return word;
      })
      .filter(w => {
        return (
          w.length > 0 && !/^\s+$/.test(w) && !STOP_WORDS.has(w.toLowerCase())
        );
      });
  }
  // @ts-ignore
  const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });

  const segs = Array.from(segmenter.segment(text))
    .map((item: SegmentItem) => item.segment)
    .filter(w => {
      return (
        w.length > 0 && !/^\s+$/.test(w) && !STOP_WORDS.has(w.toLowerCase())
      );
    });

  return Array.from(new Set(segs));
}
