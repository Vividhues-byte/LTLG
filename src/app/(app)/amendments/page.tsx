"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Search } from "lucide-react";
import { constitutionAmendments } from "@/data/constitution-loader";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AmendmentsPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = constitutionAmendments.filter(
    (a) =>
      !q ||
      a.number.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q)
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8">
      <div>
        <div className="flex items-center gap-2">
          <FileText className="size-6 text-primary" />
          <h1 className="font-serif text-2xl font-semibold tracking-tight">Amendments Hub</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Major constitutional amendments and their impact. Article text reflects the consolidated
          Constitution.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search amendments…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((amendment) => (
          <Card key={amendment.id} className="border-border/60">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{amendment.number}</Badge>
                <Badge variant="outline">{amendment.year}</Badge>
              </div>
              <CardTitle className="text-base">{amendment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{amendment.summary}</p>
              <Link
                href="/explorer"
                className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
              >
                Explore affected articles →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
