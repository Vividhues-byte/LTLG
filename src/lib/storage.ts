import type { UserProgress } from "@/types";

export const STORAGE_KEYS = {
  progress: "ltlg-progress",
  chatHistory: "ltlg-chat-history",
} as const;

export const defaultProgress: UserProgress = {
  articlesRead: [],
  bookmarks: [],
  bookmarkedCases: [],
  quizAttempts: [],
  chatMessagesCount: 0,
  lastVisited: new Date().toISOString(),
};

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.progress);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as UserProgress;
    return {
      ...defaultProgress,
      ...parsed,
      articlesRead: parsed.articlesRead ?? [],
      bookmarks: parsed.bookmarks ?? [],
      bookmarkedCases: parsed.bookmarkedCases ?? [],
      quizAttempts: parsed.quizAttempts ?? [],
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
}
