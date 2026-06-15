import type { ConstitutionAmendment, ConstitutionSchedule } from "@/data/constitution-loader";
import type { ArticleQAContext, ConstitutionArticle, SavedCase } from "@/types";

export function articleToQAContext(article: ConstitutionArticle): ArticleQAContext {
  return {
    kind: "article",
    id: article.id,
    label: article.number,
    title: article.title,
    category: article.part,
    content: article.content,
    keywords: article.keywords,
  };
}

export function scheduleToQAContext(schedule: ConstitutionSchedule): ArticleQAContext {
  return {
    kind: "schedule",
    id: schedule.id,
    label: schedule.number,
    title: schedule.title,
    category: schedule.part,
    content: schedule.content,
    keywords: schedule.keywords,
  };
}

export function amendmentToQAContext(amendment: ConstitutionAmendment): ArticleQAContext {
  return {
    kind: "amendment",
    id: amendment.id,
    label: amendment.number,
    title: amendment.title,
    category: "Constitutional Amendments",
    content: amendment.summary,
    keywords: [amendment.title.toLowerCase(), String(amendment.year)],
  };
}

export function caseToQAContext(savedCase: SavedCase): ArticleQAContext {
  return {
    kind: "case",
    id: savedCase.id,
    label: savedCase.name,
    title: savedCase.name,
    category: savedCase.articleNumber,
    content: savedCase.summary,
    keywords: [savedCase.articleNumber.toLowerCase()],
  };
}

export function conceptToQAContext(
  id: string,
  label: string,
  title: string,
  content: string,
  category = "Constitutional Concepts"
): ArticleQAContext {
  return { kind: "concept", id, label, title, category, content };
}

export function qaContextStorageKey(context: ArticleQAContext): string {
  return `ltlg-article-qa-${context.kind}-${context.id}`;
}
