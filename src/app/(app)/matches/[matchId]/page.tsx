"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreDisplay } from "@/components/shared/score-input";
import { MedalIcon } from "@/components/shared/medal-icon";
import { STAGE_LABELS } from "@/lib/utils/constants";
import { formatMatchDate, formatTime } from "@/lib/utils/dates";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  Users,
  Swords,
} from "lucide-react";
import type { MatchStage, MedalType } from "@/lib/types/database";

// Dynamic import for recharts to avoid SSR issues
import dynamic from "next/dynamic";
const PredictionPieChart = dynamic(
  () => import("./prediction-pie-chart"),
  { ssr: false }
);

// Placeholder types
interface MatchDetail {
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
  status: "scheduled" | "live" | "finished";
  home_score_90min: number | null;
  away_score_90min: number | null;
}

interface PredictionBreakdown {
  participant_name: string;
  predicted_home: number;
  predicted_away: number;
  points: number;
  medal: MedalType | null;
}

interface PredictionStats {
  home_win_count: number;
  draw_count: number;
  away_win_count: number;
  total_predictions: number;
}

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.matchId as string;

  // TODO: Fetch from Supabase
  const match = null as MatchDetail | null;
  const predictions = [] as PredictionBreakdown[];
  const stats = null as PredictionStats | null;

  if (!match) {
    return (
      <div className="space-y-6">
        <Link
          href="/matches"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowRight className="size-4" />
          חזרה למשחקים
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <Swords className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">
              פרטי המשחק ייטענו מבסיס הנתונים.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isFinished = match.status === "finished";
  const isUpcoming = match.status === "scheduled";
  const stageLabel = STAGE_LABELS[match.stage] || match.stage;

  return (
    <div className="space-y-6">
      <Link
        href="/matches"
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ArrowRight className="size-4" />
        חזרה למשחקים
      </Link>

      {/* Match card - large display */}
      <Card className="overflow-hidden">
        <div className="bg-primary/5 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">{stageLabel}</Badge>
            {match.group_letter && (
              <Badge variant="outline">בית {match.group_letter}</Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            משחק #{match.match_number}
          </span>
        </div>

        <CardContent className="py-6">
          {/* Date & venue */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />
              {formatMatchDate(match.kickoff_time)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {formatTime(match.kickoff_time)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {match.venue}, {match.city}
            </span>
          </div>

          {/* Teams & score */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center space-y-2 flex-1">
              <p className="text-xl font-bold">{match.home_team_name}</p>
            </div>

            {isFinished ? (
              <ScoreDisplay
                home={match.home_score_90min}
                away={match.away_score_90min}
                size="lg"
              />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">
                VS
              </span>
            )}

            <div className="text-center space-y-2 flex-1">
              <p className="text-xl font-bold">{match.away_team_name}</p>
            </div>
          </div>

          {match.status === "live" && (
            <div className="mt-4 text-center">
              <Badge className="bg-green-600 gap-1 text-sm">
                <span className="size-2 rounded-full bg-white animate-pulse" />
                שידור חי
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prediction distribution (upcoming) */}
      {isUpcoming && stats && stats.total_predictions > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="size-5" />
              מה אומרים המשתתפים?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PredictionPieChart
              homeWin={stats.home_win_count}
              draw={stats.draw_count}
              awayWin={stats.away_win_count}
              homeTeamName={match.home_team_name}
              awayTeamName={match.away_team_name}
            />
          </CardContent>
        </Card>
      )}

      {isUpcoming && (!stats || stats.total_predictions === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="size-5" />
              מה אומרים המשתתפים?
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center text-muted-foreground">
            עדיין אין מספיק ניחושים להצגת סטטיסטיקות
          </CardContent>
        </Card>
      )}

      {/* Prediction breakdown (finished) */}
      {isFinished && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="size-5" />
              ניחושי המשתתפים
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {predictions.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                אין ניחושים להצגה
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead className="text-center">ניחוש</TableHead>
                    <TableHead className="text-center">נקודות</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictions
                    .sort((a, b) => b.points - a.points)
                    .map((pred, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {pred.participant_name}
                        </TableCell>
                        <TableCell className="text-center">
                          <ScoreDisplay
                            home={pred.predicted_home}
                            away={pred.predicted_away}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {pred.points}
                        </TableCell>
                        <TableCell>
                          {pred.medal && (
                            <MedalIcon medal={pred.medal} size="sm" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
