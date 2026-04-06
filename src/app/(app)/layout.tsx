"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Trophy,
  Swords,
  Grid3X3,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Users,
  Gift,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions/auth";

const mainNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "לוח בקרה" },
  { href: "/predictions", icon: Target, label: "ניחושים" },
  { href: "/leaderboard", icon: Trophy, label: "טבלת דירוג" },
  { href: "/matches", icon: Swords, label: "משחקים" },
  { href: "/groups", icon: Grid3X3, label: "בתים" },
  { href: "/statistics", icon: BarChart3, label: "סטטיסטיקות" },
  { href: "/rules", icon: BookOpen, label: "חוקי הטורניר" },
];

const adminNavItems = [
  { href: "/admin/results", icon: ClipboardCheck, label: "הזנת תוצאות" },
  { href: "/admin/participants", icon: Users, label: "משתתפים" },
  { href: "/admin/bonus", icon: Gift, label: "שאלות בונוס" },
  { href: "/admin/tournament", icon: Settings, label: "ניהול טורניר" },
];

const mobileNavItems = mainNavItems.slice(0, 4);

const pageTitles: Record<string, string> = {
  "/dashboard": "לוח בקרה",
  "/predictions": "ניחושים",
  "/leaderboard": "טבלת דירוג",
  "/matches": "משחקים",
  "/groups": "בתים",
  "/statistics": "סטטיסטיקות",
  "/rules": "חוקי הטורניר",
  "/admin/results": "הזנת תוצאות",
  "/admin/participants": "משתתפים",
  "/admin/bonus": "שאלות בונוס",
  "/admin/tournament": "ניהול טורניר",
};

// TODO: Replace with real admin check from user session
const isAdmin = true;

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <span className="text-2xl">{"\u26BD"}</span>
        <span className="text-lg font-bold text-sidebar-foreground">
          {"מונדיאל 2026"}
        </span>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="size-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <Separator className="my-3 bg-sidebar-border" />
              <span className="mb-1 px-3 text-xs font-medium text-sidebar-foreground/50">
                {"ניהול"}
              </span>
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="size-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </ScrollArea>

      <Separator className="bg-sidebar-border" />

      {/* User section */}
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition-colors hover:bg-sidebar-accent/50"
          >
            <Avatar size="sm">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                {"מ"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-sidebar-foreground">
                {"משתמש"}
              </span>
            </div>
            <ChevronDown className="size-4 shrink-0 text-sidebar-foreground/50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <DropdownMenuItem>
              <Settings className="size-4" />
              <span>{"הגדרות פרופיל"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive"
            >
              <LogOut className="size-4" />
              <span>{"התנתקות"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPageTitle = pageTitles[pathname] || "מונדיאל 2026";

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar - on the RIGHT side for RTL */}
      <aside className="hidden w-64 shrink-0 border-s border-sidebar-border bg-sidebar md:block">
        <SidebarNav />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background px-4">
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">{"תפריט"}</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-sidebar p-0" showCloseButton={false}>
              <SheetHeader className="sr-only">
                <SheetTitle>{"תפריט ניווט"}</SheetTitle>
              </SheetHeader>
              <SidebarNav onNavigate={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold">{currentPageTitle}</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>

        {/* Mobile bottom navigation */}
        <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t bg-background md:hidden">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("size-5", isActive && "text-primary")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
