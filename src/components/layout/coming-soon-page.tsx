import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  primaryHref?: string;
  primaryLabel?: string;
}

export function ComingSoonPage({
  title,
  description,
  icon: Icon,
  primaryHref = "/chat",
  primaryLabel = "Try Constitution Chat",
}: ComingSoonPageProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
        <Icon className="size-7 text-amber-400" />
      </div>
      <h1 className="font-serif text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <Card className="mt-8 w-full border-border/60">
        <CardContent className="p-4 text-sm text-muted-foreground">
          This module is on the roadmap. Explore the full Constitution today via Chat and
          Explorer.
        </CardContent>
      </Card>
      <Button className="mt-6" render={<Link href={primaryHref} />}>
        {primaryLabel}
      </Button>
    </div>
  );
}
