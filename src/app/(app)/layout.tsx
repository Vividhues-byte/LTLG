import { AppShell } from "@/components/layout/app-shell";
import { ProgressProvider } from "@/contexts/progress-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <AppShell>{children}</AppShell>
    </ProgressProvider>
  );
}
