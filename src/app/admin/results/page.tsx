"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { STAGE_LABELS } from "@/lib/utils/constants";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  Search,
  ChevronLeft,
} from "lucide-react";
import type { MatchStatus, MatchStage } from "@/lib/types/database";

// Placeholder match data until DB is connected
interface MatchRow {
  id: string;
  match_number: number;
  stage: MatchStage;
  group_letter: string | null;
  home_team_name: string;
  away_team_name: string;
  kickoff_time: string;
  status: MatchStatus;
  home_score_90min: number | null;
  away_score_90min: number | null;
}

const EMPTY_MATCHES: MatchRow[] = [];

function statusBadge(status: MatchStatus) {
  switch (status) {
    case "scheduled":
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="size-3" />
          ממתין
        </Badge>
      );
    case "live":
      return (
        <Badge className="bg-green-600 gap-1">
          <span className="size-2 rounded-full bg-white animate-pulse" />
          שידור חי
        </Badge>
      );
    case "finished":
      return (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="size-3" />
          הסתיים
        </Badge>
      );
  }
}

export default function AdminResultsPage() {
  const [filter, setFilter] = useState<"all" | "scheduled" | "finished">("all");
  const [search, setSearch] = useState("");

  // TODO: Fetch from Supabase
  const matches = EMPTY_MATCHES;

  const filtered = matches.filter((m) => {
    if (filter === "scheduled" && m.status !== "scheduled") return false;
    if (filter === "finished" && m.status !== "finished") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.home_team_name.toLowerCase().includes(q) ||
        m.away_team_name.toLowerCase().includes(q) ||
        String(m.match_number).includes(q)
      );
    }
    return true;
  });

  // Group matches by stage
  const byStage = filtered.reduce(
    (acc, m) => {
      const key = m.stage;
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    },
    {} as Record<string, MatchRow[]>
  );

  const stageOrder: MatchStage[] = [
    "group",
    "round_of_32",
    "round_of_16",
    "quarter_final",
    "semi_final",
    "third_place",
    "final",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardCheck className="size-6 text-primary" />
          הזנת תוצאות
        </h1>
        <p className="text-muted-foreground mt-1">
          בחרו משחק להזנת התוצאה הסופית
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          defaultValue="all"
          onValueChange={(v) => setFilter(v as typeof filter)}
        >
          <TabsList>
            <TabsTrigger value="all">הכל</TabsTrigger>
            <TabsTrigger value="scheduled">ממתינים</TabsTrigger>
            <TabsTrigger value="finished">הושלמו</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי קבוצה או מספר..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
      </div>

      {/* Match list */}
      {matches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardCheck className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">
              אין משחקים להצגה. המשחקים ייטענו מבסיס הנתונים.
            </p>
          </CardContent>
        </Card>
      ) : (
        stageOrder.map((stage) => {
          const stageMatches = byStage[stage];
          if (!stageMatches?.length) return null;

          return (
            <div key={stage} className="space-y-3">
              <h2 className="text-lg font-semibold">
                {STAGE_LABELS[stage] || stage}
              </h2>
              <div className="grid gap-2">
                {stageMatches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/admin/results/${match.id}`}
                  >
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="flex items-center gap-4 py-3 px-4">
                        <span className="text-xs text-muted-foreground font-mono w-8">
                          #{match.match_number}
                        </span>
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                          <span className="font-medium truncate">
                            {match.home_team_name}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            vs
                          </span>
                          <span className="font-medium truncate">
                            {match.away_team_name}
                          </span>
                        </div>
                        {match.status === "finished" && (
                          <span
                            className="font-bold tabular-nums text-sm"
                            dir="ltr"
                          >
                            {match.home_score_90min} - {match.away_score_90min}
                          </span>
                        )}
                        {statusBadge(match.status)}
                        <ChevronLeft className="size-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
