"use client";

import { Suspense, useMemo, useState } from "react";
import { Bookmark, Search } from "lucide-react";
import {
  articleParts,
  constitutionSchedules,
  searchArticles,
  searchSchedules,
  getArticleById,
  constitutionArticles,
} from "@/data/constitution-loader";
import { useProgressContext } from "@/contexts/progress-context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
// import type { ConstitutionSchedule } from "@/data/constitution-loader";

function ExplorerContent() {
  const { toggleBookmark, isBookmarked, markArticleRead, progress } = useProgressContext();

  const [tab, setTab] = useState<"articles" | "schedules">("articles");
  const [query, setQuery] = useState("");
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [partFilter, setPartFilter] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    let results = searchArticles(query);
    if (bookmarksOnly) results = results.filter((a) => isBookmarked(a.id));
    if (partFilter) results = results.filter((a) => a.part === partFilter);
    return results;
  }, [query, bookmarksOnly, isBookmarked, partFilter]);

  const filteredSchedules = useMemo(() => searchSchedules(query), [query]);

  const displayParts = articleParts.filter((p) => p !== "Constitution of India");
  const selectedArticle = selectedArticleId ? getArticleById(selectedArticleId) : undefined;
  const selectedSchedule = selectedScheduleId
    ? constitutionSchedules.find((s) => s.id === selectedScheduleId)
    : undefined;

  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [] as typeof constitutionArticles;
    const keywords = selectedArticle.keywords ?? [];
    const byKeywords = constitutionArticles.filter(
      (a) => a.id !== selectedArticle.id && a.keywords.some((k) => keywords.includes(k))
    );
    const byPart = constitutionArticles.filter((a) => a.id !== selectedArticle.id && a.part === selectedArticle.part);
    const combined = [...new Map([...byKeywords, ...byPart].map((a) => [a.id, a])).values()];
    return combined.slice(0, 6);
  }, [selectedArticle]);

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="relative z-10 flex w-full flex-col min-h-0 border-b border-border lg:w-[22rem] lg:border-b-0 lg:border-r xl:w-96">
        <div className="space-y-3 border-b border-border p-4 flex-none">
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

          <div className="flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <Input
              placeholder={tab === "articles" ? "Article 25, keyword, title…" : "Search schedules…"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          {tab === "articles" && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setPartFilter(null);
                    setQuery("");
                    setTab("articles");
                  }}
                  className={cn(
                    "rounded-md px-2 py-1 text-[10px] transition-colors",
                    !partFilter ? "bg-amber-400 text-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  All
                </button>
                {displayParts.map((part) => (
                  <button
                    key={part}
                    type="button"
                    onClick={() => {
                      setPartFilter(part);
                      setTab("articles");
                    }}
                    className={cn(
                      "rounded-md px-2 py-1 text-[10px] transition-colors",
                      partFilter === part ? "bg-amber-400 text-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {part}
                  </button>
                ))}
              </div>
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
            </div>
          )}
        </div>

        <div className="min-h-0 lg:flex-1 lg:overflow-auto">
          <div className="space-y-0.5 p-2">
            {tab === "articles" ? (
              filteredArticles.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">No articles found.</p>
              ) : (
                filteredArticles.map((article) => (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => {
                      setSelectedArticleId(article.id);
                      setSelectedScheduleId(null);
                    }}
                    className={cn("w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50", selectedArticleId === article.id && "bg-muted/40")}
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
                  className={cn("w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50", selectedScheduleId === schedule.id && "bg-muted/40")}
                >
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {schedule.number}
                  </Badge>
                  <p className="mt-1 text-sm font-medium">{schedule.title}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 lg:flex items-start justify-center">
        <div className="w-full max-w-4xl p-4 lg:p-6 min-h-0 overflow-auto">
          {!selectedArticle && !selectedSchedule ? (
            <div className="text-muted-foreground text-sm">Open an article or schedule to read it here.</div>
          ) : selectedArticle ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{selectedArticle.number}</Badge>
                    <h2 className="text-xl font-serif">{selectedArticle.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{selectedArticle.part}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(selectedArticle.id)}
                    className={cn(
                      "rounded-md px-3 py-1 text-sm",
                      isBookmarked(selectedArticle.id) ? "bg-amber-400 text-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isBookmarked(selectedArticle.id) ? "Bookmarked" : "Bookmark"}
                  </button>
                  <button
                    type="button"
                    onClick={() => markArticleRead(selectedArticle.id)}
                    className="rounded-md px-3 py-1 text-sm bg-muted text-muted-foreground"
                  >
                    {progress.articlesRead.includes(selectedArticle.id) ? "Read" : "Mark as read"}
                  </button>
                </div>
              </div>

              <div className="prose max-w-none whitespace-pre-wrap">{selectedArticle.content}</div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {(selectedArticle.keywords || []).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setQuery(k)}
                      className="rounded-md px-2 py-1 text-[12px] bg-muted text-muted-foreground"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Related articles</div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {relatedArticles.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No related articles found.</div>
                  ) : (
                    relatedArticles.map((ra) => (
                      <button
                        key={ra.id}
                        type="button"
                        onClick={() => setSelectedArticleId(ra.id)}
                        className="w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline" className="text-[10px] font-normal">
                            {ra.number}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm font-medium">{ra.title}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{selectedSchedule?.number}</Badge>
                <h2 className="text-xl font-serif">{selectedSchedule?.title}</h2>
              </div>
              <div className="prose max-w-none whitespace-pre-wrap">{selectedSchedule?.content}</div>
            </div>
          )}
        </div>
      </div>
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
