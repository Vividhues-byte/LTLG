"use client";

import { AppSidebar } from "./app-sidebar";
import { MobileHeader } from "./mobile-header";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

export function AppShell({ children, title = "LTLG" }: AppShellProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileHeader title={title} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
