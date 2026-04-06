import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BarChart3, Medal, Gift, Users, ChevronLeft } from "lucide-react";

const statPages = [
  {
    href: "/statistics/medals",
    icon: Medal,
    title: "טבלת מדליות",
    description: "סיכום מדליות של כל המשתתפים",
    color: "text-yellow-600",
  },
  {
    href: "/statistics/bonus",
    icon: Gift,
    title: "סטטוס בונוס",
    description: "מצב שאלות הבונוס ותשובות",
    color: "text-purple-600",
  },
  {
    href: "/statistics/advancement",
    icon: Users,
    title: "סקירת קבוצות עולות",
    description: "ניחושי התקדמות קבוצות",
    color: "text-green-600",
  },
];

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="size-6 text-primary" />
          סטטיסטיקות
        </h1>
        <p className="text-muted-foreground mt-1">
          נתונים ותובנות מהטורניר
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statPages.map((page) => (
          <Link key={page.href} href={page.href}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <page.icon className={`size-5 ${page.color}`} />
                    {page.title}
                  </CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </div>
                <ChevronLeft className="size-4 text-muted-foreground shrink-0 mt-1" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Placeholder summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-1">
              משחקים שהושלמו
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-1">
              ניחושים מדויקים
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-1">
              ממוצע נקודות למשחק
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
