"use client";

import { getRelatedArticles } from "@/data/article-learning";
import type { ChatMessage as ChatMessageType } from "@/types";
import { ArticleLearningCard } from "./article-learning-card";
import { MarkdownRenderer } from "./markdown-renderer";
import { cn } from "@/lib/utils";

interface ChatMessageBubbleProps {
  message: ChatMessageType;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[90%] rounded-2xl bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground sm:max-w-[75%]">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  const payload = message.payload;

  if (payload?.type === "article") {
    return (
      <div className="flex justify-start">
        <div className="w-full max-w-full sm:max-w-3xl">
          <ArticleLearningCard
            article={payload.article}
            learning={payload.learning}
            relatedArticles={payload.relatedArticles}
          />
        </div>
      </div>
    );
  }

  if (payload?.type === "articles-list") {
    return (
      <div className="flex justify-start">
        <div className="w-full max-w-full space-y-4 sm:max-w-3xl">
          <p className="rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            {payload.intro}
          </p>
          {payload.items.map((item) => (
            <ArticleLearningCard
              key={item.article.id}
              article={item.article}
              learning={item.learning}
              relatedArticles={getRelatedArticles(item.article.id)}
              compact
            />
          ))}
        </div>
      </div>
    );
  }

  const text =
    payload?.type === "text" ? payload.text : message.content;

  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "max-w-[90%] rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]"
        )}
      >
        <MarkdownRenderer text={text} />
      </div>
    </div>
  );
}
