"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Send, Sparkles } from "lucide-react";
import { generateChatResponse } from "@/lib/chat-engine";
import { STORAGE_KEYS } from "@/lib/storage";
import { constitutionMeta } from "@/data/constitution-loader";
import type { ChatMessage, ChatPayload } from "@/types";
import { useProgressContext } from "@/contexts/progress-context";
import { ChatMessageBubble } from "@/components/chat/chat-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

function loadChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.chatHistory);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function saveChatHistory(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify(messages.slice(-50)));
}

function payloadPreview(payload: ChatPayload): string {
  if (payload.type === "text") return payload.text;
  if (payload.type === "article") {
    return `${payload.article.number}: ${payload.article.title}`;
  }
  return payload.intro;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "",
  timestamp: new Date().toISOString(),
  payload: {
    type: "text",
    text: `Welcome to **LTLG Constitution Chat** — a premium legal learning interface covering all **${constitutionMeta.articleCount} articles** of the Indian Constitution.\n\nAsk *Article 2*, *Article 25*, *Article 300A*, or any keyword. You'll receive the **complete constitutional text** plus explanation, cases, and a quiz.`,
  },
};

const SUGGESTED = [
  "Article 1",
  "Article 14",
  "Article 19",
  "Article 21",
  "Article 25",
  "Article 32",
  "Article 51A",
  "Article 300A",
  "Fundamental Rights",
];

export function ChatInterface() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const { incrementChatCount } = useProgressContext();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const handledQuery = useRef(false);

  useEffect(() => {
    const saved = loadChatHistory();
    if (saved.length > 0) setMessages(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveChatHistory(messages);
  }, [messages, hydrated]);

  // Scroll to the top of the newest assistant message when it completes loading
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "assistant") {
        const el = document.getElementById(`msg-${lastMsg.id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  }, [messages, loading]);

  const submitQuery = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    incrementChatCount();

    await new Promise((r) => setTimeout(r, 300 + Math.random() * 250));

    const response = generateChatResponse(trimmed);
    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: payloadPreview(response.payload),
      timestamp: new Date().toISOString(),
      payload: response.payload,
      relatedArticleIds: response.relatedArticleIds,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  useEffect(() => {
    if (!hydrated || !initialQuery || handledQuery.current) return;
    handledQuery.current = true;
    const trimmed = initialQuery.trim();
    if (!trimmed) return;

    const run = async () => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      incrementChatCount();
      await new Promise((r) => setTimeout(r, 300));
      const response = generateChatResponse(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: payloadPreview(response.payload),
          timestamp: new Date().toISOString(),
          payload: response.payload,
          relatedArticleIds: response.relatedArticleIds,
        },
      ]);
      setLoading(false);
    };
    void run();
  }, [hydrated, initialQuery, incrementChatCount]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/[0.04] via-background to-background">
      <header className="shrink-0 border-b border-border/80 bg-card/40 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
              <Sparkles className="size-5 text-amber-400" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
                Constitution Chat
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {constitutionMeta.articleCount} articles · Full text · No truncation
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-4xl flex-1 min-h-0 gap-0 lg:max-w-6xl lg:gap-6 lg:px-6 lg:py-4">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-4 space-y-3 rounded-xl border border-border/60 bg-card/50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Try asking
            </p>
            <div className="flex flex-col gap-1">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={loading}
                  onClick={() => void submitQuery(q)}
                  className="rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <ScrollArea className="flex-1 px-4 py-4 sm:px-2">
            <div className="mx-auto max-w-3xl space-y-8 pb-4">
              {messages.map((msg) => (
                <div key={msg.id} id={`msg-${msg.id}`}>
                  <ChatMessageBubble message={msg} />
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-card/80 px-4 py-3 text-sm text-muted-foreground shadow-sm">
                    <Loader2 className="size-4 animate-spin text-amber-400" />
                    Loading full article & analysis…
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="shrink-0 border-t border-border/80 bg-card/30 p-4 backdrop-blur-sm">
            <div className="mb-3 flex flex-wrap gap-1.5 lg:hidden">
              {SUGGESTED.slice(0, 5).map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={loading}
                  onClick={() => void submitQuery(q)}
                  className="rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[10px] text-muted-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              className="mx-auto flex max-w-3xl gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void submitQuery(input);
              }}
            >
              <Input
                placeholder="Article 300A, Article 51A, equality, Parliament…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="h-11 flex-1 border-border/80 bg-background/80"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-11 px-4"
              >
                <Send className="size-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
