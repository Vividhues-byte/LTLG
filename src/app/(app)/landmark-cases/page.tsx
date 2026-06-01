"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Gavel, Search } from "lucide-react";
import { getArticleLearning } from "@/data/article-learning";
import { constitutionArticles } from "@/data/constitution-loader";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandmarkCasesPage() {
  const [query, setQuery] = useState("");

  const cases = useMemo(() => {
    const all: Array<{
      articleId: string;
      articleNumber: string;
      name: string;
      year: string;
      summary: string;
    }> = [];

    for (const article of constitutionArticles) {
      const learning = getArticleLearning(article.id);
      if (!learning) continue;
      for (const c of learning.landmarkCases) {
        if (c.name.includes("Constitutional interpretation")) continue;
        all.push({
          articleId: article.id,
          articleNumber: article.number,
          name: c.name,
          year: c.year,
          summary: c.summary,
        });
      }
    }

    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.articleNumber.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8">
      <div>
        <div className="flex items-center gap-2">
          <Gavel className="size-6 text-violet-400" />
          <h1 className="font-serif text-2xl font-semibold tracking-tight">Landmark Cases</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Supreme Court cases linked to constitutional articles — save cases from Chat to your
          Dashboard.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search cases…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {cases.map((c) => (
          <Card key={`${c.articleId}-${c.name}`} className="border-border/60">
            <CardContent className="space-y-2 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{c.articleNumber}</Badge>
                {c.year !== "—" && (
                  <span className="text-xs text-muted-foreground">{c.year}</span>
                )}
              </div>
              <p className="text-sm font-medium leading-snug">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.summary}</p>
              <Link
                href={`/chat?q=${encodeURIComponent(c.articleNumber)}`}
                className="text-xs font-medium text-primary hover:underline"
              >
                Read article in Chat →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {cases.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">No cases match your search.</p>
      )}
    </div>
  );
}
