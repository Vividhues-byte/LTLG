"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bookmark, Search } from "lucide-react";
import {
  articleParts,
  constitutionSchedules,
  getArticleById,
  searchArticles,
  searchSchedules,
} from "@/data/constitution-loader";
import { useProgressContext } from "@/contexts/progress-context";
import { ArticleDetail } from "@/components/constitution/article-detail";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ArticlePart } from "@/types";
import type { ConstitutionSchedule } from "@/data/constitution-loader";

function ScheduleDetail({ schedule }: { schedule: ConstitutionSchedule }) {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b border-border p-6">
        <Badge>{schedule.number}</Badge>
        <h1 className="text-2xl font-semibold tracking-tight">{schedule.title}</h1>
        <p className="text-sm text-muted-foreground">{schedule.summary}</p>
      </div>
      <ScrollArea className="flex-1">
        <pre className="whitespace-pre-wrap p-6 font-sans text-sm leading-relaxed text-foreground/90">
          {schedule.content}
        </pre>
      </ScrollArea>
    </div>
  );
}

function ExplorerContent() {
  const searchParams = useSearchParams();
  const articleParam = searchParams.get("article");
  const { toggleBookmark, isBookmarked, markArticleRead } = useProgressContext();

  const [tab, setTab] = useState<"articles" | "schedules">("articles");
  const [query, setQuery] = useState("");
  const [partFilter, setPartFilter] = useState<ArticlePart | "all">("all");
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  useEffect(() => {
    if (articleParam) {
      setTab("articles");
      setSelectedArticleId(articleParam);
      markArticleRead(articleParam);
    }
  }, [articleParam, markArticleRead]);

  const filteredArticles = useMemo(() => {
    let results = searchArticles(query);
    if (partFilter !== "all") {
      results = results.filter((a) => a.part === partFilter);
    }
    if (bookmarksOnly) {
      results = results.filter((a) => isBookmarked(a.id));
    }
    return results;
  }, [query, partFilter, bookmarksOnly, isBookmarked]);

  const filteredSchedules = useMemo(() => searchSchedules(query), [query]);

  const selectedArticle = selectedArticleId ? getArticleById(selectedArticleId) : null;
  const selectedSchedule =
    selectedScheduleId
      ? constitutionSchedules.find((s) => s.id === selectedScheduleId)
      : null;

  const selectArticle = useCallback(
    (id: string) => {
      setSelectedArticleId(id);
      setSelectedScheduleId(null);
      markArticleRead(id);
    },
    [markArticleRead]
  );

  useEffect(() => {
    if (tab === "articles" && !selectedArticleId && filteredArticles.length > 0) {
      setSelectedArticleId(filteredArticles[0].id);
    }
  }, [tab, filteredArticles, selectedArticleId]);

  useEffect(() => {
    if (tab === "schedules" && !selectedScheduleId && filteredSchedules.length > 0) {
      setSelectedScheduleId(filteredSchedules[0].id);
    }
  }, [tab, filteredSchedules, selectedScheduleId]);

  const displayParts = articleParts.filter((p) => p !== "Constitution of India");

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <div className="flex w-full flex-col border-b border-border lg:w-[22rem] lg:border-b-0 lg:border-r xl:w-96">
        <div className="space-y-3 border-b border-border p-4">
          <div>
            <h1 className="font-serif text-lg font-semibold">Constitution Explorer</h1>
            <p className="text-xs text-muted-foreground">
              {filteredArticles.length} articles · {constitutionSchedules.length} schedules
            </p>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "articles" | "schedules")}>
            <TabsList className="w-full">
              <TabsTrigger value="articles" className="flex-1">
                Articles
              </TabsTrigger>
              <TabsTrigger value="schedules" className="flex-1">
                Schedules
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={tab === "articles" ? "Article 25, keyword, title…" : "Search schedules…"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {tab === "articles" && (
            <>
              <ScrollArea className="max-h-24">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPartFilter("all")}
                    className={cn(
                      "rounded-md px-2 py-1 text-[10px] transition-colors",
                      partFilter === "all"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    All
                  </button>
                  {displayParts.map((part) => (
                    <button
                      key={part}
                      type="button"
                      onClick={() => setPartFilter(part)}
                      className={cn(
                        "rounded-md px-2 py-1 text-[10px] transition-colors",
                        partFilter === part
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {part.replace(/^Part [IVX]+A? — /, "P").slice(0, 22)}
                    </button>
                  ))}
                </div>
              </ScrollArea>
              <button
                type="button"
                onClick={() => setBookmarksOnly((b) => !b)}
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  bookmarksOnly ? "text-amber-400" : "text-muted-foreground"
                )}
              >
                <Bookmark className={cn("size-3.5", bookmarksOnly && "fill-current")} />
                Bookmarks only
              </button>
            </>
          )}
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-0.5 p-2">
            {tab === "articles" ? (
              filteredArticles.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">No articles found.</p>
              ) : (
                filteredArticles.map((article) => (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => selectArticle(article.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                      selectedArticleId === article.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {article.number}
                      </Badge>
                      {isBookmarked(article.id) && (
                        <Bookmark className="size-3 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium">{article.title}</p>
                  </button>
                ))
              )
            ) : filteredSchedules.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">No schedules found.</p>
            ) : (
              filteredSchedules.map((schedule) => (
                <button
                  key={schedule.id}
                  type="button"
                  onClick={() => {
                    setSelectedScheduleId(schedule.id);
                    setSelectedArticleId(null);
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                    selectedScheduleId === schedule.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-muted/50"
                  )}
                >
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {schedule.number}
                  </Badge>
                  <p className="mt-1 text-sm font-medium">{schedule.title}</p>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="hidden min-w-0 flex-1 lg:flex">
        {tab === "articles" && selectedArticle ? (
          <ArticleDetail
            article={selectedArticle}
            bookmarked={isBookmarked(selectedArticle.id)}
            onToggleBookmark={toggleBookmark}
            onMarkRead={markArticleRead}
          />
        ) : tab === "schedules" && selectedSchedule ? (
          <ScheduleDetail schedule={selectedSchedule} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Select an item to read
          </div>
        )}
      </div>

      {tab === "articles" && selectedArticle && (
        <div className="border-t border-border lg:hidden">
          <ArticleDetail
            article={selectedArticle}
            bookmarked={isBookmarked(selectedArticle.id)}
            onToggleBookmark={toggleBookmark}
            onMarkRead={markArticleRead}
          />
        </div>
      )}
      {tab === "schedules" && selectedSchedule && (
        <div className="border-t border-border lg:hidden">
          <ScheduleDetail schedule={selectedSchedule} />
        </div>
      )}
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading explorer…
        </div>
      }
    >
      <ExplorerContent />
    </Suspense>
  );
}
