"use client";

import { cn } from "@/lib/utils";
import { ScoreInput } from "@/components/shared/score-input";
import { TeamBadge } from "@/components/shared/team-badge";
import { MEDAL_CONFIG } from "@/lib/utils/scoring";
import type { MedalType } from "@/lib/types/database";
import { Check, Loader2 } from "lucide-react";

interface MatchPredictionRowProps {
  matchNumber: number;
  homeTeam: { name: string; flagUrl: string };
  awayTeam: { name: string; flagUrl: string };
  homeScore: number | null;
  awayScore: number | null;
  onScoreChange: (homeScore: number, awayScore: number) => void;
  disabled?: boolean;
  saving?: boolean;
  saved?: boolean;
  actualResult?: { home: number; away: number } | null;
  medal?: MedalType | null;
}

export function MatchPredictionRow({
  matchNumber,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  onScoreChange,
  disabled = false,
  saving = false,
  saved = false,
  actualResult,
  medal,
}: MatchPredictionRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 py-3 px-2 sm:px-3 rounded-lg transition-colors",
        "hover:bg-muted/50",
        disabled && "opacity-60"
      )}
      dir="rtl"
    >
      {/* Match number */}
      <span className="text-xs text-muted-foreground w-5 flex-shrink-0 text-center">
        {matchNumber}
      </span>

      {/* Home team (right side in RTL) */}
      <div className="flex-1 min-w-0 flex justify-end">
        <TeamBadge
          name={homeTeam.name}
          flagUrl={homeTeam.flagUrl}
          size="sm"
          reverse
        />
      </div>

      {/* Score inputs */}
      <div className="flex items-center gap-1" dir="ltr">
        <ScoreInput
          value={homeScore}
          onChange={(val) => onScoreChange(val, awayScore ?? 0)}
          disabled={disabled}
        />
        <span className="text-lg font-bold text-muted-foreground px-0.5">:</span>
        <ScoreInput
          value={awayScore}
          onChange={(val) => onScoreChange(homeScore ?? 0, val)}
          disabled={disabled}
        />
      </div>

      {/* Away team (left side in RTL) */}
      <div className="flex-1 min-w-0 flex justify-start">
        <TeamBadge
          name={awayTeam.name}
          flagUrl={awayTeam.flagUrl}
          size="sm"
        />
      </div>

      {/* Status / Medal */}
      <div className="w-8 flex-shrink-0 flex items-center justify-center">
        {saving && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {saved && !saving && !medal && (
          <Check className="h-4 w-4 text-green-500" />
        )}
        {medal && (
          <span
            className={cn(
              "text-sm font-medium rounded-full px-1.5 py-0.5",
              MEDAL_CONFIG[medal].color
            )}
            title={MEDAL_CONFIG[medal].label}
          >
            {MEDAL_CONFIG[medal].emoji}
          </span>
        )}
        {actualResult && !medal && (
          <span className="text-xs text-muted-foreground" dir="ltr">
            {actualResult.home}-{actualResult.away}
          </span>
        )}
      </div>
    </div>
  );
}
