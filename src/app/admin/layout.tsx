"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  Users,
  Gift,
  Settings,
  GitBranch,
  ArrowRight,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  ClipboardCheck,
  Users,
  Gift,
  Settings,
  GitBranch,
};

const adminNavItems = [
  { href: "/admin/results", label: "הזנת תוצאות", icon: "ClipboardCheck" },
  { href: "/admin/participants", label: "משתתפים", icon: "Users" },
  { href: "/admin/bonus", label: "שאלות בונוס", icon: "Gift" },
  { href: "/admin/tournament", label: "ניהול טורניר", icon: "Settings" },
  { href: "/admin/knockout-setup", label: "טבלת נוקאאוט", icon: "GitBranch" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - RIGHT side in RTL */}
      <aside className="hidden w-64 shrink-0 border-s border-sidebar-border bg-sidebar md:flex md:flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5">
          <Shield className="size-6 text-primary" />
          <span className="text-lg font-bold text-sidebar-foreground">
            פאנל ניהול
          </span>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Back to site */}
        <div className="px-3 pt-3">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
              <ArrowRight className="size-4" />
              חזרה לאתר
            </Button>
          </Link>
        </div>

        <Separator className="mx-3 mt-3 bg-sidebar-border" />

        {/* Nav */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {adminNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = iconMap[item.icon] || Settings;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
          <Link href="/dashboard" className="text-sm text-muted-foreground">
            <ArrowRight className="size-4 inline ml-1" />
            חזרה
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-semibold">פאנל ניהול</span>
        </header>

        {/* Mobile nav tabs */}
        <nav className="flex gap-1 overflow-x-auto border-b bg-muted/30 px-4 py-2 md:hidden">
          {adminNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = iconMap[item.icon] || Settings;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
