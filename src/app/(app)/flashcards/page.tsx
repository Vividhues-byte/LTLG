import { Brain } from "lucide-react";
import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export default function FlashcardsPage() {
  return (
    <ComingSoonPage
      title="Flashcards"
      description="Spaced-repetition flashcards for articles, landmark cases, and amendment facts — coming soon."
      icon={Brain}
      primaryHref="/quiz"
      primaryLabel="Practice in Quiz Center"
    />
  );
}
