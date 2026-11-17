export interface AuthorSegment {
  name: string;
  isSelf: boolean;
}

export interface PublicationItem {
  id: string;
  title: string;
  authors: AuthorSegment[];
  venue: string;
  citations: number;
  year: number;
  url?: string;
}

export interface ScholarData {
  totalCitations: number;
  citationsPerYear: Record<string, number>;
  publications: PublicationItem[];
}
