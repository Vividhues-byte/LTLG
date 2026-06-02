"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Search, Loader2 } from "lucide-react";
import {
  articleParts,
  constitutionSchedules,
  searchArticles,
  searchSchedules,
} from "@/data/constitution-loader";
import { useProgressContext } from "@/contexts/progress-context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
// import type { ConstitutionSchedule } from "@/data/constitution-loader";

function ExplorerContent() {
  const router = useRouter();
  const { toggleBookmark, isBookmarked, markArticleRead } = useProgressContext();

  const [tab, setTab] = useState<"articles" | "schedules">("articles");
  const [query, setQuery] = useState("");
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [redirectText, setRedirectText] = useState("");

  const filteredArticles = useMemo(() => {
    let results = searchArticles(query);
    if (bookmarksOnly) results = results.filter((a) => isBookmarked(a.id));
    return results;
  }, [query, bookmarksOnly, isBookmarked]);

  const filteredSchedules = useMemo(() => searchSchedules(query), [query]);

  const displayParts = articleParts.filter((p) => p !== "Constitution of India");

  const navigateToChat = async (text: string, markReadId?: string) => {
    setRedirectText(text);
    setRedirecting(true);
    if (markReadId) markArticleRead(markReadId);
    // small delay so the overlay is visible briefly
    await new Promise((r) => setTimeout(r, 120));
    void router.push(`/chat?q=${encodeURIComponent(text)}`);
  };

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
                  onClick={() => void navigateToChat("Explain the Constitution")}
                  className={cn("rounded-md px-2 py-1 text-[10px] transition-colors bg-muted text-muted-foreground")}
                >
                  All
                </button>
                {displayParts.map((part) => (
                  <button
                    key={part}
                    type="button"
                    onClick={() => void navigateToChat(`Explain ${part}`)}
                    className={cn("rounded-md px-2 py-1 text-[10px] transition-colors bg-muted text-muted-foreground")}
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
                    onClick={() => void navigateToChat(`Explain ${article.number}`, article.id)}
                    className={cn("w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50")}
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
                  onClick={() => void navigateToChat(`Explain Schedule ${schedule.number}: ${schedule.title}`)}
                  className={cn("w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50")}
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

      <div className="flex-1 hidden lg:flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Open an article to chat about it.</div>
      </div>

      {redirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60">
          <div className="rounded-lg border border-border/60 bg-card/90 p-4 flex items-center gap-3">
            <Loader2 className="size-5 animate-spin text-amber-400" />
            <div>
              <div className="font-medium">Redirecting to chat…</div>
              <div className="text-sm text-muted-foreground">{redirectText}</div>
            </div>
          </div>
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
