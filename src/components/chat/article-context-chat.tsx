"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, Trash2 } from "lucide-react";
import { generateArticleQAResponse } from "@/lib/article-qa-engine";
import {
  clearArticleQAHistory,
  loadArticleQAHistory,
  saveArticleQAHistory,
} from "@/lib/article-qa-storage";
import type { ArticleContextMessage, ArticleQAContext, ArticleQAResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ArticleContextChatProps {
  context: ArticleQAContext;
  onOpenRelated?: (id: string) => void;
  className?: string;
}

function QAResponseView({
  response,
  onOpenRelated,
}: {
  response: ArticleQAResponse;
  onOpenRelated?: (id: string) => void;
}) {
  return (
    <div className="space-y-3 text-sm">
      <section>
        <p className="text-[10px] font-medium uppercase tracking-wider text-amber-400/90">
          Direct answer
        </p>
        <p className="mt-1 leading-relaxed text-foreground">{response.directAnswer}</p>
      </section>

      <section>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Relevant provision
        </p>
        <pre className="mt-1 whitespace-pre-wrap rounded-lg border border-border/50 bg-muted/30 p-3 font-sans text-xs leading-relaxed text-foreground/90">
          {response.provision}
        </pre>
      </section>

      <section>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Explanation
        </p>
        <p className="mt-1 leading-relaxed text-muted-foreground">{response.explanation}</p>
      </section>

      {response.examTip && (
        <section className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-amber-400">
            CLAT / exam tip
          </p>
          <p className="mt-1 text-muted-foreground">{response.examTip}</p>
        </section>
      )}

      {response.relatedArticles.length > 0 && (
        <section>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Related articles
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {response.relatedArticles.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onOpenRelated?.(a.id)}
                className={cn(
                  "rounded-md border border-border/60 px-2.5 py-1 text-xs transition-colors hover:bg-muted/50",
                  onOpenRelated && "cursor-pointer text-primary"
                )}
              >
                {a.number}: {a.title}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function ArticleContextChat({
  context,
  onOpenRelated,
  className,
}: ArticleContextChatProps) {
  const [messages, setMessages] = useState<ArticleContextMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contextKey = `${context.kind}-${context.id}`;

  useEffect(() => {
    setMessages(loadArticleQAHistory(context));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when context id/kind changes
  }, [contextKey]);

  useEffect(() => {
    if (hydrated) saveArticleQAHistory(context, messages);
  }, [messages, hydrated, contextKey, context]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const ask = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ArticleContextMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 280 + Math.random() * 200));

    const response = generateArticleQAResponse(context, text);
    const assistantMsg: ArticleContextMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response.directAnswer,
      response,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  }, [context, input, loading]);

  const placeholder =
    context.kind === "article"
      ? "Ask anything about this article…"
      : context.kind === "schedule"
        ? "Ask anything about this schedule…"
        : context.kind === "amendment"
          ? "Ask about this amendment…"
          : "Ask anything about this topic…";

  return (
    <Card className={cn("border-amber-500/15 bg-card/80 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-4 text-amber-400" />
            <div>
              <CardTitle className="text-base font-medium">
                {context.kind === "schedule"
                  ? "Ask About This Schedule"
                  : context.kind === "amendment"
                    ? "Ask About This Amendment"
                    : context.kind === "case"
                      ? "Ask About This Case"
                      : "Ask About This Article"}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Questions are answered in the context of {context.label}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Clear conversation"
              onClick={() => {
                clearArticleQAHistory(context);
                setMessages([]);
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {messages.length > 0 && (
          <div className="max-h-80 space-y-4 overflow-y-auto rounded-lg border border-border/50 bg-muted/10 p-3">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[90%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">
                      {msg.content}
                    </div>
                  </div>
                ) : msg.response ? (
                  <QAResponseView response={msg.response} onOpenRelated={onOpenRelated} />
                ) : (
                  <p className="text-sm text-muted-foreground">{msg.content}</p>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Analyzing {context.label}…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {messages.length === 0 && !loading && (
          <p className="text-xs text-muted-foreground">
            Try: &quot;What is the minimum quorum?&quot;, &quot;Explain clause 2&quot;, or
            &quot;Landmark cases related to this article&quot;
          </p>
        )}

        <Separator />

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void ask();
          }}
        >
          <Input
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()} size="default">
            <Send className="size-4" />
            <span className="hidden sm:inline">Ask</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
