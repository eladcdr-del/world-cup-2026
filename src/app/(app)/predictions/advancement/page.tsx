"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { TeamBadge } from "@/components/shared/team-badge";
import { TEAMS, getTeamsByGroup, type TeamSeed } from "@/data/teams";
import { GROUP_LETTERS } from "@/lib/utils/constants";
import {
  saveAdvancementPrediction,
  removeAdvancementPrediction,
} from "@/lib/actions/predictions";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Check, Loader2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// ─── Main component ─────────────────────────────────────────

export default function AdvancementPredictionsPage() {
  const [selectedTeams, setSelectedTeams] = useState<Record<string, Set<string>>>(() => {
    const initial: Record<string, Set<string>> = {};
    for (const letter of GROUP_LETTERS) {
      initial[letter] = new Set();
    }
    return initial;
  });
  const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [isLocked, setIsLocked] = useState(false);

  const deadline = "2026-06-11T12:00:00+03:00";

  // Total selected across all groups
  const totalSelected = Object.values(selectedTeams).reduce(
    (sum, set) => sum + set.size,
    0
  );

  const toggleTeam = useCallback(
    async (groupLetter: string, teamCode: string) => {
      if (isLocked) return;

      const current = selectedTeams[groupLetter];
      const isSelected = current.has(teamCode);

      // Each group advances top 2 (in WC 2026 with 48 teams, top 2 + some 3rds, but simplified to 2 per group for 24, plus 8 best thirds = 32)
      // Simplified: allow selecting up to 3 per group (2 guaranteed + potential 3rd)
      if (!isSelected && current.size >= 3) return;

      const newSet = new Set(current);
      if (isSelected) {
        newSet.delete(teamCode);
      } else {
        newSet.add(teamCode);
      }

      setSelectedTeams((prev) => ({
        ...prev,
        [groupLetter]: newSet,
      }));

      // Save to server
      const savingKey = `${groupLetter}-${teamCode}`;
      setSaving((prev) => ({ ...prev, [savingKey]: true }));

      if (isSelected) {
        await removeAdvancementPrediction(teamCode);
      } else {
        await saveAdvancementPrediction(teamCode, "round_of_32", false);
      }

      setSaving((prev) => ({ ...prev, [savingKey]: false }));
    },
    [selectedTeams, isLocked]
  );

  const handleWinnerChange = useCallback(
    async (value: string | null) => {
      if (isLocked || !value) return;
      setTournamentWinner(value);

      setSaving((prev) => ({ ...prev, winner: true }));
      await saveAdvancementPrediction(value, "final", true);
      setSaving((prev) => ({ ...prev, winner: false }));
    },
    [isLocked]
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">ניחוש קבוצות עולות</h1>
        <p className="text-muted-foreground mt-1">
          בחרו אילו קבוצות עולות מכל בית ומי תזכה בטורניר
        </p>
      </div>

      {/* Countdown */}
      <CountdownTimer
        deadline={deadline}
        onExpired={() => setIsLocked(true)}
      />

      {/* Summary */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant={totalSelected >= 24 ? "default" : "secondary"}>
          {totalSelected} קבוצות נבחרו
        </Badge>
        <span className="text-sm text-muted-foreground">
          (בחרו עד 3 קבוצות מכל בית - 2 עולות ישירות + אפשרות למקום 3)
        </span>
      </div>

      {/* Group cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GROUP_LETTERS.map((letter) => {
          const teams = getTeamsByGroup(letter);
          const selected = selectedTeams[letter];

          return (
            <Card key={letter}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>בית {letter}</CardTitle>
                  <Badge
                    variant={selected.size >= 2 ? "default" : "secondary"}
                  >
                    {selected.size} נבחרו
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teams.map((team) => {
                    const isSelected = selected.has(team.short_code);
                    const savingKey = `${letter}-${team.short_code}`;
                    const isSaving = saving[savingKey] ?? false;

                    return (
                      <button
                        key={team.short_code}
                        type="button"
                        disabled={
                          isLocked ||
                          isSaving ||
                          (!isSelected && selected.size >= 3)
                        }
                        onClick={() => toggleTeam(letter, team.short_code)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-start transition-all",
                          "hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>

                        <TeamBadge
                          name={team.name_he}
                          flagUrl={team.flag_url}
                          size="sm"
                        />

                        <span className="text-xs text-muted-foreground me-auto">
                          {team.short_code}
                        </span>

                        {isSaving && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tournament winner */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <CardTitle>מי תזכה בטורניר?</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <Select
              value={tournamentWinner ?? undefined}
              onValueChange={handleWinnerChange}
              disabled={isLocked}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="בחרו קבוצה..." />
              </SelectTrigger>
              <SelectContent>
                {TEAMS.map((team) => (
                  <SelectItem key={team.short_code} value={team.short_code}>
                    <div className="flex items-center gap-2">
                      <div className="rounded-sm overflow-hidden border border-border/50 shadow-sm flex-shrink-0">
                        <Image
                          src={team.flag_url}
                          alt={team.name_he}
                          width={20}
                          height={15}
                          className="object-cover"
                        />
                      </div>
                      <span>{team.name_he}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {tournamentWinner && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                {saving.winner ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                <span className="text-muted-foreground">
                  {saving.winner ? "שומר..." : "נשמר"}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
