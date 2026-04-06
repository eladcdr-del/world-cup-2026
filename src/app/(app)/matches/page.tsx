"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScoreDisplay } from "@/components/shared/score-input";
import { STAGE_LABELS } from "@/lib/utils/constants";
import { formatMatchDate, formatTime } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";
import {
  Swords,
  Clock,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import type { MatchStage, MatchStatus } from "@/lib/types/database";

interface MatchCard {
  id: string;
  match_number: number;
  stage: MatchStage;
  group_letter: string | null;
  home_team_name: string;
  away_team_name: string;
  home_flag_url: string;
  away_flag_url: string;
  venue: string;
  city: string;
  kickoff_time: string;
  status: MatchStatus;
  home_score_90min: number | null;
  away_score_90min: number | null;
}

// TODO: Fetch from Supabase
const EMPTY_MATCHES: MatchCard[] = [];

const STAGE_TABS: { value: MatchStage | "all"; label: string }[] = [
  { value: "all", label: "הכל" },
  { value: "group", label: "שלב הבתים" },
  { value: "round_of_32", label: "שמינית" },
  { value: "round_of_16", label: "שמינית 2" },
  { value: "quarter_final", label: "רבע" },
  { value: "semi_final", label: "חצי" },
  { value: "final", label: "גמר" },
];

function statusAccent(status: MatchStatus) {
  switch (status) {
    case "live":
      return "border-s-4 border-s-green-500";
    case "finished":
      return "opacity-75";
    default:
      return "";
  }
}

function groupMatchesByDate(matches: MatchCard[]) {
  const grouped: Record<string, MatchCard[]> = {};
  for (const match of matches) {
    const dateKey = new Date(match.kickoff_time).toDateString();
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(match);
  }
  return Object.entries(grouped).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  );
}

export default function MatchesPage() {
  const [stageFilter, setStageFilter] = useState<MatchStage | "all">("all");

  const matches = EMPTY_MATCHES;

  const filtered =
    stageFilter === "all"
      ? matches
      : matches.filter((m) => m.stage === stageFilter);

  const groupedByDate = groupMatchesByDate(filtered);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Swords className="size-6 text-primary" />
          משחקים
        </h1>
        <p className="text-muted-foreground mt-1">
          כל משחקי מונדיאל 2026
        </p>
      </div>

      {/* Stage filter tabs */}
      <Tabs
        value={stageFilter}
        onValueChange={(v) => setStageFilter(v as MatchStage | "all")}
      >
        <TabsList className="flex-wrap">
          {STAGE_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Match list */}
      {matches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Swords className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">
              המשחקים ייטענו מבסיס הנתונים בקרוב.
            </p>
          </CardContent>
        </Card>
      ) : (
        groupedByDate.map(([dateStr, dayMatches]) => (
          <div key={dateStr} className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground sticky top-14 bg-background py-2 z-10">
              {formatMatchDate(dateStr)}
            </h2>
            <div className="grid gap-2">
              {dayMatches.map((match) => (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <Card
                    className={cn(
                      "hover:bg-muted/50 transition-colors cursor-pointer",
                      statusAccent(match.status)
                    )}
                  >
                    <CardContent className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* Match number & group */}
                        <div className="w-12 shrink-0 text-center">
                          <span className="text-xs text-muted-foreground font-mono">
                            #{match.match_number}
                          </span>
                          {match.group_letter && (
                            <Badge variant="outline" className="mt-0.5 text-[10px]">
                              {match.group_letter}
                            </Badge>
                          )}
                        </div>

                        {/* Teams & score */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sm truncate">
                              {match.home_team_name}
                            </span>
                            {match.status === "finished" ? (
                              <ScoreDisplay
                                home={match.home_score_90min}
                                away={match.away_score_90min}
                                size="sm"
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {formatTime(match.kickoff_time)}
                              </span>
                            )}
                            <span className="font-medium text-sm truncate text-left">
                              {match.away_team_name}
                            </span>
                          </div>
                        </div>

                        {/* Status & venue */}
                        <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {match.venue}
                          </span>
                          {match.status === "live" && (
                            <Badge className="bg-green-600 text-[10px] h-4">
                              שידור חי
                            </Badge>
                          )}
                        </div>

                        <ChevronLeft className="size-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
