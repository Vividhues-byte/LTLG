"use client";

import Link from "next/link";
import { Menu, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "./app-sidebar";

export function MobileHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-64 p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center gap-2">
        <Scale className="size-4 text-primary" />
        <span className="text-sm font-semibold">{title}</span>
      </Link>
    </header>
  );
}
