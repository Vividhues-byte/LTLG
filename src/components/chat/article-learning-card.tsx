"use client";

import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  Gavel,
  Lightbulb,
  Scale,
  Sparkles,
} from "lucide-react";
import { toSavedCase } from "@/lib/case-bookmarks";
import type { ArticleLearning, ConstitutionArticle } from "@/types";
import { useProgressContext } from "@/contexts/progress-context";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { InlineArticleQuiz } from "./inline-article-quiz";
import { MarkdownRenderer } from "./markdown-renderer";

interface ArticleLearningCardProps {
  article: ConstitutionArticle;
  learning: ArticleLearning;
  relatedArticles: Pick<ConstitutionArticle, "id" | "number" | "title" | "part">[];
  compact?: boolean;
}

export function ArticleLearningCard({
  article,
  learning,
  relatedArticles,
  compact = false,
}: ArticleLearningCardProps) {
  const { isCaseBookmarked, toggleCaseBookmark } = useProgressContext();

  // Helpers to produce the new short, user-friendly response format
  const stripMarkdown = (s: string) =>
    s
      .replace(/(^|\n)#+\s*/g, "\n")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/>\s?/g, "")
      .replace(/\n{2,}/g, "\n\n")
      .trim();

  const splitSentences = (text: string) => {
    if (!text) return [];
    // Simple sentence splitter by punctuation followed by space/newline
    const parts = text
      .replace(/\n/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map((p) => p.trim())
      .filter(Boolean);
    return parts;
  };

  const getSimpleExplanation = () => {
    const cleaned = stripMarkdown(learning.explanation || "");
    const sents = splitSentences(cleaned);
    if (sents.length >= 2) return sents.slice(0, Math.min(4, sents.length)).join(" ");
    if (learning.explanation) return cleaned.split("\n")[0];
    return article.summary || "";
  };

  const getWhyItMatters = () => {
    const bullets: string[] = [];
    if (learning.whyItMatters) {
      const sents = splitSentences(stripMarkdown(learning.whyItMatters));
      for (const s of sents) {
        if (bullets.length >= 3) break;
        if (!bullets.includes(s)) bullets.push(s);
      }
    }
    if (bullets.length === 0 && learning.keyPoints?.length) {
      for (const kp of learning.keyPoints.slice(0, 3)) bullets.push(kp);
    }
    return bullets.slice(0, 3);
  };

  const getExample = () => {
    const cleaned = stripMarkdown(learning.explanation || "");
    const exampleMatch = cleaned.match(/(?:Suppose|For example|Example|Practical Example)[:\s-]*([^\n\r]+)(?:\n|$)/i);
    if (exampleMatch && exampleMatch[1]) return exampleMatch[1].trim();
    // fallback: craft a short, beginner-friendly example using keywords
    const kw = article.keywords?.[0] || article.summary?.split(" ").slice(0, 3).join(" ");
    return `For example, if someone's ${kw} is affected (e.g. arrested without proper process), this article helps protect their rights.`;
  };

  const getKeyPoints = () => {
    if (learning.keyPoints?.length) return learning.keyPoints.slice(0, 3);
    const pts = [article.summary];
    if (article.keywords?.length) pts.push(...article.keywords.slice(0, 2));
    return pts.filter(Boolean).slice(0, 3);
  };

  return (
    <Card className="w-full overflow-visible border-amber-500/10 bg-card/90 shadow-lg shadow-black/20 ring-1 ring-border/80">
      <CardHeader className="space-y-3 border-b border-border/60 bg-gradient-to-r from-amber-500/5 to-transparent pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="font-normal">{article.number}</Badge>
          <Badge variant="outline" className="font-normal">
            {article.part}
          </Badge>
        </div>
        <div>
          <h2 className="font-serif text-lg font-semibold leading-snug tracking-tight sm:text-xl">
            {article.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{article.summary}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        <div className="px-4 py-4 sm:px-6">
          <div className="mb-2 text-sm font-medium">Simple Explanation</div>
          <p className="text-sm leading-relaxed text-foreground">{getSimpleExplanation()}</p>

          <div className="mt-4 mb-2 text-sm font-medium">Why It Matters</div>
          <ul className="ml-4 list-disc text-sm leading-relaxed text-foreground">
            {getWhyItMatters().map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>

          <div className="mt-4 mb-2 text-sm font-medium">Example</div>
          <p className="text-sm leading-relaxed text-foreground">{getExample()}</p>

          <div className="mt-4 mb-2 text-sm font-medium">Key Points</div>
          <ul className="ml-4 list-disc text-sm leading-relaxed text-foreground">
            {getKeyPoints().map((kp, idx) => (
              <li key={idx}>{kp}</li>
            ))}
          </ul>
        </div>

        <div className="px-4 sm:px-6">
          <Accordion
            defaultValue={compact ? ["explanation"] : ["cases"]}
            className="w-full"
          >
            <AccordionItem value="full">
              <AccordionTrigger className="text-sm font-medium">
                <span className="flex items-center gap-2">
                  <BookOpen className="size-3.5" />
                  View Full Article
                </span>
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                <pre className="whitespace-pre-wrap rounded-lg border border-border/40 bg-muted/20 p-4 font-sans text-sm leading-relaxed text-foreground">
                  {article.content}
                </pre>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cases">
              <AccordionTrigger className="text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Gavel className="size-4 text-violet-400" />
                  Landmark Cases ({learning.landmarkCases.length})
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                {learning.landmarkCases.map((c) => {
                  const saved = toSavedCase(article.id, article.number, c);
                  const savedCase = isCaseBookmarked(saved.id);
                  return (
                    <div
                      key={`${c.name}-${c.year}`}
                      className="rounded-lg border border-border/60 bg-muted/30 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {c.name}
                          {c.year !== "—" && (
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                              ({c.year})
                            </span>
                          )}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={savedCase ? "Remove saved case" : "Save case"}
                          onClick={() => toggleCaseBookmark(saved)}
                          className={cn(savedCase && "text-amber-400")}
                        >
                          <Bookmark className={cn("size-4", savedCase && "fill-current")} />
                        </Button>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {c.summary}
                      </p>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="related">
              <AccordionTrigger className="text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Lightbulb className="size-4 text-amber-300" />
                  Related Articles
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  {relatedArticles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No related articles listed.</p>
                  ) : (
                    relatedArticles.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/explorer?article=${rel.id}`}
                        className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                      >
                        <span>
                          <span className="font-medium">{rel.number}</span>
                          <span className="text-muted-foreground"> — {rel.title}</span>
                        </span>
                        <Scale className="size-3.5 shrink-0 text-muted-foreground" />
                      </Link>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Separator />

        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <InlineArticleQuiz
            questions={learning.quizQuestions}
            articleNumber={article.number}
          />
        </div>
      </CardContent>
    </Card>
  );
}
