import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  Compass,
  FileText,
  Gavel,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Scale,
  Zap,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationSections: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/chat", label: "Constitution Chat", icon: MessageSquare },
      { href: "/explorer", label: "Constitution Explorer", icon: Compass },
      { href: "/quiz", label: "Quiz Center", icon: BookOpen },
    ],
  },
  {
    title: "Legal Library",
    items: [
      { href: "/landmark-cases", label: "Landmark Cases", icon: Gavel },
      { href: "/amendments", label: "Amendments Hub", icon: FileText },
      { href: "/flashcards", label: "Flashcards", icon: Brain },
    ],
  },
  {
    title: "Exam Prep",
    items: [
      { href: "/legal-news", label: "Legal News", icon: Newspaper },
      { href: "/current-affairs", label: "Current Affairs", icon: Zap },
      { href: "/clat", label: "CLAT Mock Tests", icon: Scale, badge: "Soon" },
    ],
  },
];

export const allNavItems = navigationSections.flatMap((s) => s.items);
