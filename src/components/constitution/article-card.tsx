"use client";

import Link from "next/link";
import { Bookmark, ChevronRight } from "lucide-react";
import type { ConstitutionArticle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: ConstitutionArticle;
  bookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  compact?: boolean;
}

export function ArticleCard({
  article,
  bookmarked = false,
  onToggleBookmark,
  compact = false,
}: ArticleCardProps) {
  return (
    <Card className="group border-border/60 bg-card/50 transition-colors hover:border-border hover:bg-card">
      <CardHeader className={cn("pb-2", compact && "p-4 pb-1")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <Badge variant="secondary" className="text-[10px] font-normal">
              {article.number}
            </Badge>
            <CardTitle className="text-base leading-snug">{article.title}</CardTitle>
          </div>
          {onToggleBookmark && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark article"}
              onClick={(e) => {
                e.preventDefault();
                onToggleBookmark(article.id);
              }}
              className={cn(bookmarked && "text-amber-400")}
            >
              <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-3", compact && "p-4 pt-0")}>
        <p className="text-sm text-muted-foreground">{article.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">{article.part}</span>
          <Link
            href={`/chat?q=${encodeURIComponent(
              article.number.toLowerCase().includes("preamble")
                ? "Explain the Preamble"
                : `Explain ${article.number}`
            )}`}
            className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
          >
            Read
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
