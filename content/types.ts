export type PracticeArea = {
  slug: string;
  /** Short label for nav / cards. */
  name: string;
  /** Full H1 for the dedicated page. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  /** Card blurb on the home grid and /services index. */
  excerpt: string;
  intro: string[];
  includes: { title: string; description: string }[];
  forWhom: string[];
  faq: { q: string; a: string }[];
};

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "callout"; text: string }
  | { type: "ul"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readingMinutes: number;
  /** ISO date, used for <time> and JSON-LD. */
  date: string;
  metaTitle: string;
  metaDescription: string;
  blocks: ArticleBlock[];
};

export type TimelineStage = {
  title: string;
  summary: string;
  detail: string;
  risk: string;
  /** Slug of the article that expands on this stage, when one exists. */
  article?: string;
};

export type Faq = { q: string; a: string };

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalPage = {
  title: string;
  metaDescription: string;
  intro: string;
  sections: LegalSection[];
};

export type Project = {
  name: string;
  city: string;
  type: string;
  units: string;
  status: string;
  note: string;
};
