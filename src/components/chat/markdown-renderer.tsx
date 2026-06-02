import React from "react";

// Lightweight renderer tailored for AI-generated content.
// Strips leftover markdown artifacts and produces clean, friendly paragraphs.
export function MarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;

  // Remove raw markdown tokens we don't want to display literally
  const cleaned = String(text)
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/(^|\n)>\s?/g, "\n")
    .replace(/(^|\n)#+\s*/g, "\n")
    .replace(/\r/g, "")
    .trim();

  // Split into paragraphs by two or more newlines
  const paragraphs = cleaned.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="space-y-4 text-sm leading-relaxed text-foreground">
      {paragraphs.map((p, i) => {
        // Detect simple bullet blocks that use '-' at line start
        if (/^(-|\*)\s+/m.test(p)) {
          const items = p.split(/\n/).map((l) => l.replace(/^(-|\*)\s+/, "").trim()).filter(Boolean);
          return (
            <ul key={i} className="list-disc ml-5 space-y-1">
              {items.map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{p}</p>;
      })}
    </div>
  );
}