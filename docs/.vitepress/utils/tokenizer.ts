interface SegmentItem {
  segment: string;
  index: number;
  input: string;
}

const SPACE_OR_PUNCTUATION = new RegExp(/[\n\r\p{Z}\p{P}]+/u);

export function tokenize(text: string): Array<string> {
  // Firefox doesn't support Intl.Segmenter until version 125
  if (!("Segmenter" in Intl)) {
    // https://github.com/lucaong/minisearch/blob/d0cf787d08014b9ebeb5c3009dc30223c1d0d7e7/src/MiniSearch.ts#L2227
    return text.split(SPACE_OR_PUNCTUATION).filter(w => w.length > 0);
  }

  // @ts-ignore
  const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });

  const segs = Array.from(segmenter.segment(text)).map(
    (item: SegmentItem) => item.segment
  );
  const uniqueSegs = Array.from(new Set(segs));
  return uniqueSegs.filter(w => !/^\s+$/.test(w) && w.length > 0);
}
