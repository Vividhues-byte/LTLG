"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale } from "lucide-react";
import { navigationSections } from "@/config/navigation";
import { constitutionMeta } from "@/data/constitution-loader";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-primary/30 ring-1 ring-amber-500/30">
            <Scale className="size-4 text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="font-serif text-sm font-semibold tracking-wide">LTLG</p>
            <p className="text-[10px] text-muted-foreground">Legal Constitution Lab</p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
          {constitutionMeta.articleCount} articles · {constitutionMeta.scheduleCount} schedules
        </p>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-4 px-2">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <p className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ href, label, icon: Icon, badge }) => {
                  const active =
                    href === "/" ? pathname === "/" : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-amber-400" : "opacity-70"
                        )}
                      />
                      <span className="flex-1 truncate">{label}</span>
                      {badge && (
                        <Badge variant="outline" className="h-4 px-1 text-[9px]">
                          {badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-lg border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent px-3 py-2.5">
          <p className="text-xs font-medium text-amber-400/90">Complete Constitution</p>
          <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
            Every article searchable — full text, no truncation.
          </p>
        </div>
      </div>
    </aside>
  );
}
