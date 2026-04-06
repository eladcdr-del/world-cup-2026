"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { MatchPredictionRow } from "@/components/prediction/match-prediction-row";
import { TEAMS, getTeamsByGroup, type TeamSeed } from "@/data/teams";
import { GROUP_LETTERS } from "@/lib/utils/constants";
import { savePrediction } from "@/lib/actions/predictions";
import { ChevronDown, ChevronUp } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface MockMatch {
  id: string;
  matchNumber: number;
  homeTeam: TeamSeed;
  awayTeam: TeamSeed;
  groupLetter: string;
}

interface PredictionState {
  homeScore: number | null;
  awayScore: number | null;
  saving: boolean;
  saved: boolean;
}

// ─── Generate mock matches for a group (round-robin) ────────

function generateGroupMatches(
  groupLetter: string,
  startMatchNumber: number
): MockMatch[] {
  const teams = getTeamsByGroup(groupLetter);
  if (teams.length !== 4) return [];

  // Round-robin: 6 matches for 4 teams
  // Round 1: 0v1, 2v3
  // Round 2: 0v2, 1v3
  // Round 3: 0v3, 1v2
  const pairings: [number, number][] = [
    [0, 1],
    [2, 3],
    [0, 2],
    [1, 3],
    [0, 3],
    [1, 2],
  ];

  return pairings.map(([h, a], i) => ({
    id: `mock-${groupLetter}-${i}`,
    matchNumber: startMatchNumber + i,
    homeTeam: teams[h],
    awayTeam: teams[a],
    groupLetter,
  }));
}

// ─── Generate all group stage matches ───────────────────────

function generateAllGroupMatches(): MockMatch[] {
  const allMatches: MockMatch[] = [];
  let matchNum = 1;

  for (const letter of GROUP_LETTERS) {
    const groupMatches = generateGroupMatches(letter, matchNum);
    allMatches.push(...groupMatches);
    matchNum += groupMatches.length;
  }

  return allMatches;
}

// ─── Main page component ────────────────────────────────────

export default function GroupStagePredictionsPage() {
  const [allMatches] = useState(() => generateAllGroupMatches());
  const [predictions, setPredictions] = useState<
    Record<string, PredictionState>
  >({});
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const [isLocked, setIsLocked] = useState(false);
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );

  // Mock deadline: June 11, 2026 (day before tournament starts)
  const deadline = "2026-06-11T12:00:00+03:00";

  // Count completed predictions
  const completedCount = Object.values(predictions).filter(
    (p) => p.homeScore !== null && p.awayScore !== null
  ).length;
  const totalMatches = allMatches.length;
  const progress =
    totalMatches > 0 ? Math.round((completedCount / totalMatches) * 100) : 0;

  // Group matches by group letter
  const matchesByGroup: Record<string, MockMatch[]> = {};
  for (const match of allMatches) {
    if (!matchesByGroup[match.groupLetter]) {
      matchesByGroup[match.groupLetter] = [];
    }
    matchesByGroup[match.groupLetter].push(match);
  }

  const toggleGroup = useCallback((group: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  }, []);

  const handleScoreChange = useCallback(
    (matchId: string, homeScore: number, awayScore: number) => {
      if (isLocked) return;

      // Update local state immediately
      setPredictions((prev) => ({
        ...prev,
        [matchId]: {
          homeScore,
          awayScore,
          saving: false,
          saved: prev[matchId]?.saved ?? false,
        },
      }));

      // Debounce the save
      if (debounceTimers.current[matchId]) {
        clearTimeout(debounceTimers.current[matchId]);
      }

      debounceTimers.current[matchId] = setTimeout(async () => {
        setPredictions((prev) => ({
          ...prev,
          [matchId]: {
            ...prev[matchId],
            saving: true,
            saved: false,
          },
        }));

        const result = await savePrediction(matchId, homeScore, awayScore);

        setPredictions((prev) => ({
          ...prev,
          [matchId]: {
            ...prev[matchId],
            saving: false,
            saved: "success" in result,
          },
        }));

        // Clear saved indicator after 2 seconds
        if ("success" in result) {
          setTimeout(() => {
            setPredictions((prev) => ({
              ...prev,
              [matchId]: {
                ...prev[matchId],
                saved: false,
              },
            }));
          }, 2000);
        }
      }, 500);
    },
    [isLocked]
  );

  // Cleanup debounce timers
  useEffect(() => {
    const timers = debounceTimers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  // Count predictions per group
  function getGroupPredictionCount(groupLetter: string): number {
    const groupMatchIds = matchesByGroup[groupLetter]?.map((m) => m.id) ?? [];
    return groupMatchIds.filter(
      (id) =>
        predictions[id]?.homeScore !== null &&
        predictions[id]?.awayScore !== null
    ).length;
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">ניחושי שלב הבתים</h1>
        <p className="text-muted-foreground mt-1">
          נחשו את תוצאות 48 משחקי שלב הבתים
        </p>
      </div>

      {/* Countdown */}
      <CountdownTimer
        deadline={deadline}
        onExpired={() => setIsLocked(true)}
      />

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">התקדמות</span>
          <span className="text-muted-foreground">
            {completedCount}/{totalMatches} ניחושים ({progress}%)
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Group sections */}
      <div className="space-y-4">
        {GROUP_LETTERS.map((letter) => {
          const groupMatches = matchesByGroup[letter] ?? [];
          const isCollapsed = collapsedGroups[letter] ?? false;
          const groupPredicted = getGroupPredictionCount(letter);
          const groupTotal = groupMatches.length;

          return (
            <Card key={letter}>
              <CardHeader
                className="cursor-pointer select-none"
                onClick={() => toggleGroup(letter)}
              >
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">
                    בית {letter}
                  </CardTitle>
                  <Badge
                    variant={
                      groupPredicted === groupTotal ? "default" : "secondary"
                    }
                  >
                    {groupPredicted}/{groupTotal}
                  </Badge>
                </div>
                <CardAction>
                  {isCollapsed ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  )}
                </CardAction>
              </CardHeader>

              {!isCollapsed && (
                <CardContent>
                  <div className="divide-y divide-border">
                    {groupMatches.map((match) => {
                      const pred = predictions[match.id];
                      return (
                        <MatchPredictionRow
                          key={match.id}
                          matchNumber={match.matchNumber}
                          homeTeam={{
                            name: match.homeTeam.name_he,
                            flagUrl: match.homeTeam.flag_url,
                          }}
                          awayTeam={{
                            name: match.awayTeam.name_he,
                            flagUrl: match.awayTeam.flag_url,
                          }}
                          homeScore={pred?.homeScore ?? null}
                          awayScore={pred?.awayScore ?? null}
                          onScoreChange={(h, a) =>
                            handleScoreChange(match.id, h, a)
                          }
                          disabled={isLocked}
                          saving={pred?.saving ?? false}
                          saved={pred?.saved ?? false}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
