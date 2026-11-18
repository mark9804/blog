import { decodeHTML } from "entities";
import type { ScholarConfig } from "../components/ElysiumUI/types/ProfileProps.ts";
import type {
  AuthorSegment,
  PublicationItem,
  ScholarData,
} from "../types/Publication.ts";

const OPENALEX_WORKS_API = "https://api.openalex.org/works";
const OPENALEX_SELECT_FIELDS =
  "id,doi,title,publication_year,cited_by_count,counts_by_year,primary_location,authorships";
const REQUEST_TIMEOUT_MS = 8000;

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

interface OpenAlexAuthor {
  id?: string | null;
  display_name?: string | null;
  orcid?: string | null;
}

interface OpenAlexAuthorship {
  author?: OpenAlexAuthor | null;
  raw_author_name?: string | null;
}

interface OpenAlexLocation {
  landing_page_url?: string | null;
  raw_source_name?: string | null;
  source?: {
    display_name?: string | null;
  } | null;
}

interface OpenAlexYearCount {
  year?: number;
  cited_by_count?: number;
}

interface OpenAlexWork {
  id?: string;
  doi?: string | null;
  title?: string | null;
  publication_year?: number | null;
  cited_by_count?: number | null;
  counts_by_year?: OpenAlexYearCount[] | null;
  primary_location?: OpenAlexLocation | null;
  authorships?: OpenAlexAuthorship[] | null;
}

interface OpenAlexWorksResponse {
  results?: OpenAlexWork[];
}

function normalizeAuthorToken(name: string): string {
  return name.replace(/\*/g, "").replace(/\s+/g, " ").trim();
}

function normalizeOpenAlexId(raw?: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/^https?:\/\/openalex\.org\//i, "")
    .trim()
    .toUpperCase();
}

function normalizeOrcid(raw?: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/^https?:\/\/orcid\.org\//i, "")
    .trim()
    .toUpperCase();
}

function normalizeWorkUrl(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  if (/^10\.\d{4,9}\//.test(trimmed)) {
    return `https://doi.org/${trimmed}`;
  }
  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
}

function buildOpenAlexUrls(config?: ScholarConfig): {
  urls: string[];
  authorIdSet: Set<string>;
  orcid: string;
} {
  const authorIds = (config?.openAlexAuthorIds ?? [])
    .map(id => normalizeOpenAlexId(id))
    .filter(id => /^A\d+$/.test(id));
  const orcid = normalizeOrcid(config?.orcid);
  const urls: string[] = [];

  if (authorIds.length > 0) {
    const params = new URLSearchParams({
      filter: `authorships.author.id:${authorIds.join("|")}`,
      select: OPENALEX_SELECT_FIELDS,
      per_page: "100",
      sort: "publication_year:desc",
    });
    urls.push(`${OPENALEX_WORKS_API}?${params.toString()}`);
  }

  if (/^\d{4}-\d{4}-\d{4}-[\dX]{4}$/.test(orcid)) {
    const params = new URLSearchParams({
      filter: `authorships.author.orcid:https://orcid.org/${orcid}`,
      select: OPENALEX_SELECT_FIELDS,
      per_page: "100",
      sort: "publication_year:desc",
    });
    urls.push(`${OPENALEX_WORKS_API}?${params.toString()}`);
  }

  return {
    urls,
    authorIdSet: new Set(authorIds),
    orcid,
  };
}

async function fetchWorksBatch(url: string): Promise<OpenAlexWork[] | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const json = (await response.json()) as OpenAlexWorksResponse;
    return Array.isArray(json.results) ? json.results : null;
  } catch {
    return null;
  }
}

function mapOpenAlexWorks(
  works: OpenAlexWork[],
  authorIdSet: Set<string>,
  orcid: string
): ScholarData {
  const deduped = new Map<string, OpenAlexWork>();
  for (const work of works) {
    const title = decodeHTML(String(work.title ?? "")).trim();
    if (!title) continue;
    const key =
      (work.doi && work.doi.trim().toLowerCase()) ||
      normalizeOpenAlexId(work.id) ||
      title.toLowerCase();
    if (!deduped.has(key)) {
      deduped.set(key, work);
    }
  }

  let totalCitations = 0;
  const citationsPerYear: Record<string, number> = {};
  const publications: PublicationItem[] = [];

  for (const [key, work] of deduped.entries()) {
    const title = decodeHTML(String(work.title ?? "")).trim();
    const venue = decodeHTML(
      String(
        work.primary_location?.source?.display_name ??
          work.primary_location?.raw_source_name ??
          ""
      )
    ).trim();

    const authors: AuthorSegment[] = (work.authorships ?? [])
      .map(entry => {
        const name = decodeHTML(
          String(entry.author?.display_name ?? entry.raw_author_name ?? "")
        ).trim();
        const authorId = normalizeOpenAlexId(entry.author?.id);
        const authorOrcid = normalizeOrcid(entry.author?.orcid);
        const isSelf =
          (Boolean(authorId) && authorIdSet.has(authorId)) ||
          (Boolean(orcid) && authorOrcid === orcid) ||
          SELF_AUTHOR_ALIASES.has(normalizeAuthorToken(name));
        return { name, isSelf };
      })
      .filter(author => author.name.length > 0);

    const citations = Math.max(0, Number(work.cited_by_count) || 0);
    const year = Number(work.publication_year) || 0;
    const url = normalizeWorkUrl(
      work.doi ?? work.primary_location?.landing_page_url
    );

    totalCitations += citations;
    for (const entry of work.counts_by_year ?? []) {
      const y = Number(entry.year);
      const c = Number(entry.cited_by_count) || 0;
      if (y > 0 && c > 0) {
        const yearKey = String(y);
        citationsPerYear[yearKey] = (citationsPerYear[yearKey] ?? 0) + c;
      }
    }

    publications.push({
      id: normalizeOpenAlexId(work.id) || key,
      title,
      authors,
      venue,
      citations,
      year,
      url,
    });
  }

  publications.sort(
    (a, b) =>
      b.year - a.year ||
      b.citations - a.citations ||
      a.title.localeCompare(b.title)
  );

  return {
    totalCitations,
    citationsPerYear,
    publications,
  };
}

export async function fetchScholarData(
  config?: ScholarConfig
): Promise<ScholarData | null> {
  const { urls, authorIdSet, orcid } = buildOpenAlexUrls(config);
  if (urls.length === 0) return null;

  const batches = await Promise.all(urls.map(url => fetchWorksBatch(url)));
  const validBatches = batches.filter(
    (batch): batch is OpenAlexWork[] => batch !== null
  );
  if (validBatches.length === 0) return null;

  return mapOpenAlexWorks(validBatches.flat(), authorIdSet, orcid);
}
