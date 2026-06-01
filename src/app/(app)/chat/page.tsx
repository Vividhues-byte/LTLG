"use client";

import { Suspense } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading chat…
        </div>
      }
    >
      <ChatInterface />
    </Suspense>
  );
}
