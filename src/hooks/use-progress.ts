"use client";

import { useCallback, useEffect, useState } from "react";
import type { QuizAttempt, SavedCase, UserProgress } from "@/types";
import { defaultProgress, loadProgress, saveProgress } from "@/lib/storage";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: UserProgress) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  const markArticleRead = useCallback(
    (articleId: string) => {
      setProgress((prev) => {
        if (prev.articlesRead.includes(articleId)) return prev;
        const next = {
          ...prev,
          articlesRead: [...prev.articlesRead, articleId],
          lastVisited: new Date().toISOString(),
        };
        saveProgress(next);
        return next;
      });
    },
    []
  );

  const toggleBookmark = useCallback((articleId: string) => {
    setProgress((prev) => {
      const bookmarks = prev.bookmarks.includes(articleId)
        ? prev.bookmarks.filter((id) => id !== articleId)
        : [...prev.bookmarks, articleId];
      const next = { ...prev, bookmarks, lastVisited: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (articleId: string) => progress.bookmarks.includes(articleId),
    [progress.bookmarks]
  );

  const isCaseBookmarked = useCallback(
    (caseId: string) => progress.bookmarkedCases.some((c) => c.id === caseId),
    [progress.bookmarkedCases]
  );

  const toggleCaseBookmark = useCallback((savedCase: SavedCase) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedCases.some((c) => c.id === savedCase.id);
      const bookmarkedCases = exists
        ? prev.bookmarkedCases.filter((c) => c.id !== savedCase.id)
        : [...prev.bookmarkedCases, savedCase];
      const next = { ...prev, bookmarkedCases, lastVisited: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  }, []);

  const recordQuizAttempt = useCallback((attempt: QuizAttempt) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        quizAttempts: [attempt, ...prev.quizAttempts].slice(0, 50),
        lastVisited: new Date().toISOString(),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const incrementChatCount = useCallback(() => {
    setProgress((prev) => {
      const next = {
        ...prev,
        chatMessagesCount: prev.chatMessagesCount + 1,
        lastVisited: new Date().toISOString(),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    persist({ ...defaultProgress, lastVisited: new Date().toISOString() });
  }, [persist]);

  return {
    progress,
    hydrated,
    markArticleRead,
    toggleBookmark,
    isBookmarked,
    isCaseBookmarked,
    toggleCaseBookmark,
    recordQuizAttempt,
    incrementChatCount,
    resetProgress,
  };
}
