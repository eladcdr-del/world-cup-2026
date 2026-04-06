"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Trophy, Users, HelpCircle, ChevronLeft } from "lucide-react";

interface PredictionSection {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  total: number;
  completed: number;
  badgeLabel: string;
}

export default function PredictionsPage() {
  // TODO: Replace with actual data fetching from getMyPredictions(), etc.
  const counts = {
    groupStage: 0,
    knockout: 0,
    advancement: 0,
    bonus: 0,
  };

  const sections: PredictionSection[] = [
    {
      href: "/predictions/group-stage",
      title: "שלב הבתים",
      description: "ניחוש תוצאות 48 משחקי שלב הבתים",
      icon: <Target className="h-6 w-6" />,
      total: 48,
      completed: counts.groupStage,
      badgeLabel: "ניחושים",
    },
    {
      href: "/predictions/knockout",
      title: "שלב הנוקאאוט",
      description: "ניחוש תוצאות משחקי הנוקאאוט",
      icon: <Trophy className="h-6 w-6" />,
      total: 16,
      completed: counts.knockout,
      badgeLabel: "ניחושים",
    },
    {
      href: "/predictions/advancement",
      title: "קבוצות עולות",
      description: "ניחוש אילו קבוצות עולות משלב הבתים ומי זוכה בטורניר",
      icon: <Users className="h-6 w-6" />,
      total: 32,
      completed: counts.advancement,
      badgeLabel: "קבוצות",
    },
    {
      href: "/predictions/bonus",
      title: "שאלות בונוס",
      description: "10 שאלות בונוס על הטורניר - 7 נקודות לכל תשובה נכונה",
      icon: <HelpCircle className="h-6 w-6" />,
      total: 10,
      completed: counts.bonus,
      badgeLabel: "תשובות",
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">הניחושים שלי</h1>
        <p className="text-muted-foreground mt-1">
          נהל את כל הניחושים שלך למונדיאל 2026
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const progress =
            section.total > 0
              ? Math.round((section.completed / section.total) * 100)
              : 0;

          return (
            <Link key={section.href} href={section.href}>
              <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription className="mt-0.5">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant={progress === 100 ? "default" : "secondary"}>
                        {section.completed}/{section.total} {section.badgeLabel}
                      </Badge>
                      <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
