import { decodeHTML } from "entities";
import type { ProfileProps } from "../components/ElysiumUI/types/ProfileProps";
import type {
  AuthorSegment,
  PublicationItem,
  ScholarData,
} from "../types/Publication";

const SCHOLAR_ENDPOINT_META_KEY = "google-scholar-api-endpoint";

const SELF_AUTHOR_ALIASES = new Set([
  "Z Chen",
  "Z. Chen",
  "Zhaolu Chen",
  "Mark Chen",
  "陳朝鹿",
  "陈朝鹿",
  "陳 朝鹿",
  "陈 朝鹿",
]);

export const EMPTY_SCHOLAR_DATA: ScholarData = {
  totalCitations: 0,
  citationsPerYear: {},
  publications: [],
};

interface RawPublication {
  title?: unknown;
  authors?: unknown;
  venue?: unknown;
  citations?: unknown;
  year?: unknown;
}

interface RawScholarResponse {
  total_citations?: unknown;
  citations_per_year?: Record<string, unknown>;
  publications?: RawPublication[];
}

export function getScholarEndpoint(meta?: ProfileProps["meta"]): string {
  const entry = meta?.find(item => item.name === SCHOLAR_ENDPOINT_META_KEY);
  return typeof entry?.value === "string" ? entry.value.trim() : "";
}

function normalizeAuthorToken(name: string): string {
  return name.replace(/\*/g, "").replace(/\s+/g, " ").trim();
}

function parseAuthors(rawAuthors: string): AuthorSegment[] {
  return rawAuthors
    .split(/[,，]\s*/)
    .map(token => token.trim())
    .filter(Boolean)
    .map(name => ({
      name,
      isSelf: SELF_AUTHOR_ALIASES.has(normalizeAuthorToken(name)),
    }));
}

export function parseScholarResponse(rawText: string): ScholarData | null {
  // Upstream PHP script emits invalid JSON `"total_citations": ,` when citations are empty
  const sanitizedJson = rawText.replace(/:\s*,/g, ": 0,");

  let parsed: RawScholarResponse;
  try {
    parsed = JSON.parse(sanitizedJson) as RawScholarResponse;
  } catch {
    return null;
  }

  if (!parsed || !Array.isArray(parsed.publications)) {
    return null;
  }

  const citationsPerYear: Record<string, number> = {};
  if (
    parsed.citations_per_year &&
    typeof parsed.citations_per_year === "object"
  ) {
    for (const [year, count] of Object.entries(parsed.citations_per_year)) {
      citationsPerYear[year.trim()] = Number(count) || 0;
    }
  }

  const publications: PublicationItem[] = parsed.publications
    .map(pub => {
      const title = decodeHTML(String(pub.title ?? "")).trim();
      const rawAuthors = decodeHTML(String(pub.authors ?? "")).trim();
      const venue = decodeHTML(String(pub.venue ?? "")).trim();
      return {
        title,
        authors: parseAuthors(rawAuthors),
        venue,
        citations: Number(pub.citations) || 0,
        year: Number(pub.year) || 0,
      };
    })
    .filter(pub => pub.title.length > 0)
    .sort((a, b) => b.year - a.year);

  return {
    totalCitations: Number(parsed.total_citations) || 0,
    citationsPerYear,
    publications,
  };
}

export async function fetchScholarData(
  endpoint: string
): Promise<ScholarData | null> {
  if (!endpoint) return null;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) return null;
    const text = await response.text();
    return parseScholarResponse(text);
  } catch {
    return null;
  }
}
