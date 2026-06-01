"use client";

import Link from "next/link";
import { BookMarked, BookOpen, Compass, Gavel, MessageSquare, Trash2 } from "lucide-react";
import { constitutionMeta } from "@/data/constitution";
import { quizPacks } from "@/data/quizzes";
import { getArticleById } from "@/data/constitution";
import { useProgressContext } from "@/contexts/progress-context";
import { ArticleCard } from "@/components/constitution/article-card";
import { SavedCaseCard } from "@/components/dashboard/saved-case-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const {
    progress,
    hydrated,
    toggleBookmark,
    toggleCaseBookmark,
    isBookmarked,
    resetProgress,
  } = useProgressContext();

  const bookmarkedArticles = progress.bookmarks
    .map(getArticleById)
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const savedCases = progress.bookmarkedCases;
  const recentAttempts = progress.quizAttempts.slice(0, 3);

  const quickLinks = [
    {
      href: "/explorer",
      label: "Explore Articles",
      desc: `${constitutionMeta.articleCount} constitutional articles`,
      icon: Compass,
    },
    {
      href: "/chat",
      label: "Ask the Assistant",
      desc: "Full text, explanations & cases",
      icon: MessageSquare,
    },
    {
      href: "/quiz",
      label: "Take a Quiz",
      desc: `${quizPacks.length} quiz packs`,
      icon: BookOpen,
    },
  ];

  if (!hydrated) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading your progress…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your Indian Constitution learning hub — saved locally on this device.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetProgress}>
          <Trash2 className="size-4" />
          Reset progress
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {quickLinks.map(({ href, label, desc, icon: Icon }) => (
            <Link key={href} href={href}>
              <Card className="h-full transition-colors hover:bg-muted/30">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookMarked className="size-4 text-amber-400" />
            <h2 className="text-sm font-medium">Bookmarks</h2>
          </div>
          <Link href="/explorer" className="text-xs text-primary hover:underline">
            Browse articles
          </Link>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Saved articles
            </h3>
            {bookmarkedArticles.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {bookmarkedArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    bookmarked={isBookmarked(article.id)}
                    onToggleBookmark={toggleBookmark}
                    compact
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-border bg-card/30 px-4 py-6 text-center text-sm text-muted-foreground">
                No saved articles yet. Bookmark articles in the{" "}
                <Link href="/explorer" className="text-primary hover:underline">
                  Constitution Explorer
                </Link>
                .
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Gavel className="size-3.5" />
              Saved cases
            </h3>
            {savedCases.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {savedCases.map((savedCase) => (
                  <SavedCaseCard
                    key={savedCase.id}
                    savedCase={savedCase}
                    onToggleBookmark={toggleCaseBookmark}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-border bg-card/30 px-4 py-6 text-center text-sm text-muted-foreground">
                No saved cases yet. Save landmark cases from{" "}
                <Link href="/chat" className="text-primary hover:underline">
                  Constitution Chat
                </Link>{" "}
                article responses.
              </p>
            )}
          </div>
        </div>
      </section>

      {recentAttempts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium">Recent quiz results</h2>
          <div className="space-y-2">
            {recentAttempts.map((attempt) => {
              const pack = quizPacks.find((q) => q.id === attempt.quizId);
              const pct = Math.round((attempt.score / attempt.total) * 100);
              return (
                <div
                  key={attempt.completedAt}
                  className="flex items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{pack?.title ?? attempt.quizId}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={pct >= 70 ? "default" : "secondary"}>
                    {attempt.score}/{attempt.total} ({pct}%)
                  </Badge>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
