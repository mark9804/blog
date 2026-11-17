export type GiscusBooleanString = "0" | "1";
export type GiscusInputPosition = "top" | "bottom";
export type GiscusRepo = `${string}/${string}`;
export type GiscusMapping =
  "url" | "title" | "og:title" | "specific" | "number" | "pathname";
export type GiscusLoading = "lazy" | "eager";

export interface GiscusProps {
  id?: string;
  host?: string;
  repo: GiscusRepo;
  repoId: string;
  category?: string;
  categoryId?: string;
  mapping: GiscusMapping;
  term?: string;
  theme?: string;
  strict?: GiscusBooleanString;
  reactionsEnabled?: GiscusBooleanString;
  emitMetadata?: GiscusBooleanString;
  inputPosition?: GiscusInputPosition;
  lang?: string;
  loading?: GiscusLoading;
  routeKey?: string;
}
