"use client";

import Link from "next/link";
import { Bookmark, Gavel } from "lucide-react";
import type { SavedCase } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SavedCaseCardProps {
  savedCase: SavedCase;
  bookmarked?: boolean;
  onToggleBookmark?: (savedCase: SavedCase) => void;
}

export function SavedCaseCard({
  savedCase,
  bookmarked = true,
  onToggleBookmark,
}: SavedCaseCardProps) {
  return (
    <Card className="border-border/60 bg-card/50">
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Gavel className="size-3.5 shrink-0 text-violet-400" />
            <Link
              href={`/chat?q=${encodeURIComponent(`Explain ${savedCase.articleNumber}`)}`}
              className="font-medium text-primary hover:underline"
            >
              {savedCase.articleNumber}
            </Link>
            {savedCase.year !== "—" && <span>({savedCase.year})</span>}
          </div>
          {onToggleBookmark && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove saved case"
              onClick={() => onToggleBookmark(savedCase)}
              className={cn(bookmarked && "text-amber-400")}
            >
              <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
            </Button>
          )}
        </div>
        <p className="text-sm font-medium leading-snug">{savedCase.name}</p>
        <p className="text-sm text-muted-foreground">{savedCase.summary}</p>
      </CardContent>
    </Card>
  );
}
