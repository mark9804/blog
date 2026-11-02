export interface AuthorSegment {
  name: string;
  isSelf: boolean;
}

export interface PublicationItem {
  title: string;
  authors: AuthorSegment[];
  venue: string;
  citations: number;
  year: number;
}

export interface ScholarData {
  totalCitations: number;
  citationsPerYear: Record<string, number>;
  publications: PublicationItem[];
}
