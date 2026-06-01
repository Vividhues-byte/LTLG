import { Scale } from "lucide-react";
import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export default function ClatPage() {
  return (
    <ComingSoonPage
      title="CLAT Mock Tests"
      description="Timed CLAT-style mocks on constitutional law — coming soon."
      icon={Scale}
      primaryHref="/quiz"
      primaryLabel="Try Quiz Center"
    />
  );
}
