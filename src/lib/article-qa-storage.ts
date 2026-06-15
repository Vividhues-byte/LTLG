import type { ArticleContextMessage, ArticleQAContext } from "@/types";
import { qaContextStorageKey } from "@/lib/article-qa-context";

export function loadArticleQAHistory(context: ArticleQAContext): ArticleContextMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(qaContextStorageKey(context));
    if (!raw) return [];
    return JSON.parse(raw) as ArticleContextMessage[];
  } catch {
    return [];
  }
}

export function saveArticleQAHistory(
  context: ArticleQAContext,
  messages: ArticleContextMessage[]
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    qaContextStorageKey(context),
    JSON.stringify(messages.slice(-30))
  );
}

export function clearArticleQAHistory(context: ArticleQAContext): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(qaContextStorageKey(context));
}
