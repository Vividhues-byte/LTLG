"use client";

import { Bookmark } from "lucide-react";
import type { ConstitutionArticle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ArticleDetailProps {
  article: ConstitutionArticle;
  bookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}

export function ArticleDetail({
  article,
  bookmarked = false,
  onToggleBookmark,
  onMarkRead,
}: ArticleDetailProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b border-border p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge>{article.number}</Badge>
            <h1 className="text-2xl font-semibold tracking-tight">{article.title}</h1>
            <p className="text-sm text-muted-foreground">{article.part}</p>
          </div>
          {onToggleBookmark && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleBookmark(article.id)}
              className={cn(bookmarked && "border-amber-500/40 text-amber-400")}
            >
              <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
              {bookmarked ? "Saved" : "Bookmark"}
            </Button>
          )}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{article.summary}</p>
        {onMarkRead && (
          <Button variant="secondary" size="sm" onClick={() => onMarkRead(article.id)}>
            Mark as read
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-6">
          <div>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Full Text
            </h2>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
              {article.content}
            </pre>
          </div>
          <Separator />
          <div>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Keywords
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {article.keywords.map((kw) => (
                <Badge key={kw} variant="outline" className="font-normal">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
