"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MedalCount, MedalIcon } from "@/components/shared/medal-icon";
import { ScoreDisplay } from "@/components/shared/score-input";
import { formatRank } from "@/lib/utils/format";
import {
  ArrowRight,
  Trophy,
  Target,
  Users,
  Gift,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { MedalType } from "@/lib/types/database";

// Placeholder data
interface ParticipantDetail {
  id: string;
  display_name: string;
  current_rank: number;
  total_points: number;
  group_stage_points: number;
  knockout_points: number;
  bonus_points: number;
  advancement_points: number;
  medals_gold: number;
  medals_silver: number;
  medals_bronze: number;
  medals_aluminum: number;
  medals_plastic: number;
}

interface MatchPred {
  match_number: number;
  home_team: string;
  away_team: string;
  predicted_home: number;
  predicted_away: number;
  actual_home: number | null;
  actual_away: number | null;
  points: number;
  medal: MedalType | null;
}

interface AdvancementPred {
  team_name: string;
  predicted_stage: string;
  is_correct: boolean | null;
}

interface BonusPred {
  question_number: number;
  question_text: string;
  answer: string;
  is_correct: boolean | null;
}

export default function ParticipantDetailPage() {
  const params = useParams();
  const participantId = params.id as string;
  const [activeTab, setActiveTab] = useState("matches");

  // TODO: Fetch from Supabase
  const participant = null as ParticipantDetail | null;
  const matchPredictions: MatchPred[] = [];
  const advancementPredictions: AdvancementPred[] = [];
  const bonusPredictions: BonusPred[] = [];

  if (!participant) {
    return (
      <div className="space-y-6">
        <Link
          href="/leaderboard"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowRight className="size-4" />
          חזרה לדירוג
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">
              לא נמצא משתתף. הנתונים ייטענו מבסיס הנתונים.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/leaderboard"
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ArrowRight className="size-4" />
        חזרה לדירוג
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{participant.display_name}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Trophy className="size-4 text-yellow-600" />
                  דירוג: {formatRank(participant.current_rank)}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="size-4 text-primary" />
                  {participant.total_points} נקודות
                </span>
              </div>
            </div>
            <MedalCount
              gold={participant.medals_gold}
              silver={participant.medals_silver}
              bronze={participant.medals_bronze}
              aluminum={participant.medals_aluminum}
              plastic={participant.medals_plastic}
            />
          </div>

          {/* Points breakdown */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-6">
            {[
              { label: "שלב בתים", value: participant.group_stage_points },
              { label: "נוקאאוט", value: participant.knockout_points },
              { label: "קבוצות עולות", value: participant.advancement_points },
              { label: "בונוס", value: participant.bonus_points },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg bg-muted/50 p-3 text-center"
              >
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="matches">ניחושי משחקים</TabsTrigger>
          <TabsTrigger value="advancement">קבוצות עולות</TabsTrigger>
          <TabsTrigger value="bonus">בונוס</TabsTrigger>
        </TabsList>

        {/* Match Predictions */}
        <TabsContent value="matches">
          {matchPredictions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                אין ניחושי משחקים להצגה
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>משחק</TableHead>
                      <TableHead className="text-center">ניחוש</TableHead>
                      <TableHead className="text-center">תוצאה</TableHead>
                      <TableHead className="text-center">נקודות</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matchPredictions.map((mp) => (
                      <TableRow key={mp.match_number}>
                        <TableCell className="font-mono text-xs">
                          {mp.match_number}
                        </TableCell>
                        <TableCell className="text-sm">
                          {mp.home_team} - {mp.away_team}
                        </TableCell>
                        <TableCell className="text-center">
                          <ScoreDisplay
                            home={mp.predicted_home}
                            away={mp.predicted_away}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <ScoreDisplay
                            home={mp.actual_home}
                            away={mp.actual_away}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {mp.points}
                        </TableCell>
                        <TableCell>
                          {mp.medal && <MedalIcon medal={mp.medal} size="sm" />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Advancement Predictions */}
        <TabsContent value="advancement">
          {advancementPredictions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                אין ניחושי קבוצות עולות להצגה
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {advancementPredictions.map((ap, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div>
                        <p className="font-medium">{ap.team_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {ap.predicted_stage}
                        </p>
                      </div>
                      {ap.is_correct === null ? (
                        <Badge variant="outline">ממתין</Badge>
                      ) : ap.is_correct ? (
                        <Badge className="bg-green-600 gap-1">
                          <CheckCircle2 className="size-3" />
                          נכון
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="size-3" />
                          שגוי
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Bonus Predictions */}
        <TabsContent value="bonus">
          {bonusPredictions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                אין תשובות בונוס להצגה
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {bonusPredictions.map((bp) => (
                <Card key={bp.question_number}>
                  <CardContent className="py-3 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {bp.question_number}. {bp.question_text}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        תשובה: <strong>{bp.answer}</strong>
                      </p>
                    </div>
                    {bp.is_correct === null ? (
                      <Badge variant="outline">ממתין</Badge>
                    ) : bp.is_correct ? (
                      <Badge className="bg-green-600 gap-1">
                        <CheckCircle2 className="size-3" />
                        נכון
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="size-3" />
                        שגוי
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
