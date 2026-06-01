import React from "react";

export function MarkdownRenderer({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  
  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-sm font-semibold text-foreground mt-3 mb-1">
              {parseInline(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }
        
        // Bullet list
        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").filter(i => i.trim().startsWith("- "));
          return (
            <ul key={idx} className="list-disc space-y-1.5 pl-5">
              {items.map((item, i) => (
                <li key={i}>{parseInline(item.replace(/^-\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        // Default Paragraph
        return (
          <p key={idx} className="whitespace-pre-wrap">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function parseInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-foreground/80">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}