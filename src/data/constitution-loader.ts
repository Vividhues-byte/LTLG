import raw from "@/data/constitution.json";
import type { ArticlePart, ConstitutionArticle } from "@/types";

export interface ConstitutionSchedule {
  id: string;
  number: string;
  title: string;
  part: string;
  summary: string;
  content: string;
  keywords?: string[];
}

export interface ConstitutionAmendment {
  id: string;
  number: string;
  year: number;
  title: string;
  summary: string;
}

interface ConstitutionDataset {
  meta: {
    articleCount: number;
    scheduleCount: number;
    amendmentCount: number;
  };
  articles: (ConstitutionArticle & { articleKey: string })[];
  schedules: ConstitutionSchedule[];
  amendments: ConstitutionAmendment[];
}

const dataset = raw as ConstitutionDataset;

// Ensure a proper Preamble entry exists in the in-memory dataset.
const PREAMBLE_ID = "preamble";
const PREAMBLE_CONTENT =
  "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship;\nEQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation; IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION";
const PREAMBLE_KEYWORDS = [
  "preamble",
  "justice",
  "liberty",
  "equality",
  "fraternity",
  "sovereign",
  "socialist",
  "secular",
  "democratic",
  "republic",
];

const processedArticles: ConstitutionArticle[] = [...dataset.articles];
const preIdx = processedArticles.findIndex((a) => a.id === PREAMBLE_ID);
if (preIdx >= 0) {
  // Merge/override keys for consistency
  processedArticles[preIdx] = {
    ...processedArticles[preIdx],
    id: PREAMBLE_ID,
    number: "Preamble",
    title: "Preamble",
    part: "Preamble",
    content: PREAMBLE_CONTENT,
    summary: PREAMBLE_CONTENT,
    keywords: PREAMBLE_KEYWORDS,
  };
} else {
  // Insert preamble at the front so it behaves like a leading item
  processedArticles.unshift({
    id: PREAMBLE_ID,
    number: "Preamble",
    title: "Preamble",
    part: "Preamble",
    summary: PREAMBLE_CONTENT,
    content: PREAMBLE_CONTENT,
    keywords: PREAMBLE_KEYWORDS,
  });
}

export const constitutionMeta = dataset.meta;
export const constitutionArticles: ConstitutionArticle[] = processedArticles;
export const constitutionSchedules: ConstitutionSchedule[] = dataset.schedules.map((s) => ({
  ...s,
  keywords: s.keywords ?? [],
}));
export const constitutionAmendments: ConstitutionAmendment[] = dataset.amendments;

const articleById = new Map(constitutionArticles.map((a) => [a.id, a]));
const articleByKey = new Map(
  constitutionArticles.map((a) => {
    const raw = dataset.articles.find((r) => r.id === a.id);
    const key = raw?.articleKey ?? (a.number || a.id).toString().toLowerCase().replace(/^article\s*/i, "");
    return [key, a] as [string, ConstitutionArticle];
  })
);

export const articleParts = [
  ...new Set(constitutionArticles.map((a) => a.part)),
].sort() as ArticlePart[];

export function getArticleById(id: string): ConstitutionArticle | undefined {
  return articleById.get(id);
}

export function getArticleByKey(key: string): ConstitutionArticle | undefined {
  const normalized = key.toLowerCase().replace(/^article\s*/i, "").trim();
  if (normalized === "preamble" || normalized === "0") {
    return articleByKey.get("preamble");
  }
  return articleByKey.get(normalized);
}

export function findArticleByQuery(query: string): ConstitutionArticle | undefined {
  const trimmed = query.trim();
  if (/preamble/i.test(trimmed)) {
    return getArticleByKey("preamble");
  }
  const articleMatch = trimmed.match(/(?:article|art\.?)\s*(\d+[a-z]?)/i);
  if (articleMatch) {
    return getArticleByKey(articleMatch[1]);
  }
  if (/^preamble$/i.test(trimmed)) {
    return getArticleByKey("preamble");
  }
  const numOnly = trimmed.match(/^(\d+[a-z]?)$/i);
  if (numOnly) {
    return getArticleByKey(numOnly[1]);
  }
  return undefined;
}

export function searchArticles(query: string): ConstitutionArticle[] {
  const q = query.trim().toLowerCase();
  if (!q) return constitutionArticles;

  const direct = findArticleByQuery(q);
  if (direct) return [direct];

  // Topic shortcuts for common student queries / exam keywords
  const topicMap: Record<string, string[]> = {
    clat: ["14", "19", "21", "32", "226"],
    ailet: ["14", "21", "32"],
    upsc: ["14", "21", "32"],
    "law student": ["14", "19", "21", "32"],
    "fundamental rights": [],
    "fundamental duties": ["51a"],
    "directive principles": [],
    "emergency provisions": [],
    "official language": [],
  };

  if (topicMap[q]) {
    const keys = topicMap[q];
    // If explicit keys provided, return those; otherwise fall back to part matching below
    if (keys.length > 0) {
      return keys.map((k) => getArticleByKey(k)).filter(Boolean) as ConstitutionArticle[];
    }
  }

  return constitutionArticles.filter(
    (article) =>
      article.number.toLowerCase().includes(q) ||
      article.title.toLowerCase().includes(q) ||
      article.summary.toLowerCase().includes(q) ||
      article.content.toLowerCase().includes(q) ||
      article.part.toLowerCase().includes(q) ||
      article.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

export function searchSchedules(query: string): ConstitutionSchedule[] {
  const q = query.trim().toLowerCase();
  if (!q) return constitutionSchedules;
  return constitutionSchedules.filter(
    (s) =>
      s.number.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q)
  );
}

export function getArticlesByPart(part: string): ConstitutionArticle[] {
  return constitutionArticles.filter((a) => a.part === part);
}

export function getArticlesForPartKeyword(keyword: string): ConstitutionArticle[] {
  const k = keyword.toLowerCase();
  if (k.includes("fundamental rights") || k === "part iii") {
    return getArticlesByPart("Part III — Fundamental Rights");
  }
  if (k.includes("directive") || k === "part iv") {
    return constitutionArticles.filter((a) => a.part.includes("Directive Principles"));
  }
  if (k.includes("fundamental duties") || k.includes("part iva")) {
    const art = getArticleByKey("51a");
    return art ? [art] : getArticlesByPart("Part IVA — Fundamental Duties");
  }
  if (k.includes("emergency")) {
    return getArticlesByPart("Part XVIII — Emergency Provisions");
  }
  if (k.includes("official language")) {
    return getArticlesByPart("Part XVII — Official Language");
  }
  return [];
}
