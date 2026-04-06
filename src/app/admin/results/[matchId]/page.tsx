"use client";

import { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScoreInput } from "@/components/shared/score-input";
import { saveMatchResult } from "@/lib/actions/admin";
import {
  ArrowRight,
  Save,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Trophy,
  MapPin,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import type { KnockoutResultType } from "@/lib/types/database";

export default function MatchResultEntryPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const [homeScore, setHomeScore] = useState<number | null>(null);
  const [awayScore, setAwayScore] = useState<number | null>(null);
  const [isKnockout, setIsKnockout] = useState(false);
  const [resultType, setResultType] = useState<KnockoutResultType>("regular_time");
  const [homeScoreET, setHomeScoreET] = useState<number | null>(null);
  const [awayScoreET, setAwayScoreET] = useState<number | null>(null);
  const [penaltyWinner, setPenaltyWinner] = useState<"home" | "away" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // TODO: Fetch match details from DB
  const matchDetails = {
    match_number: 0,
    home_team_name: "קבוצת בית",
    away_team_name: "קבוצת חוץ",
    venue: "אצטדיון",
    city: "עיר",
    kickoff_time: new Date().toISOString(),
    stage: "group" as const,
  };

  const needsExtraTime =
    isKnockout && homeScore !== null && awayScore !== null && homeScore === awayScore;

  function handleSave() {
    if (homeScore === null || awayScore === null) {
      setError("יש להזין תוצאה");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await saveMatchResult(
        matchId,
        homeScore,
        awayScore,
        isKnockout ? resultType : undefined,
        needsExtraTime ? homeScoreET : null,
        needsExtraTime ? awayScoreET : null,
        penaltyWinner
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setConfirmOpen(false);
      }
    });
  }

  if (saved) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/results"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowRight className="size-4" />
          חזרה לרשימה
        </Link>

        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <CheckCircle2 className="mx-auto size-16 text-green-600" />
            <h2 className="text-xl font-bold">התוצאה נשמרה בהצלחה!</h2>
            <p className="text-muted-foreground">
              משחק #{matchDetails.match_number}: {matchDetails.home_team_name}{" "}
              <span dir="ltr" className="font-bold mx-2">
                {homeScore} - {awayScore}
              </span>{" "}
              {matchDetails.away_team_name}
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <Button onClick={() => router.push("/admin/results")}>
                חזרה לרשימת המשחקים
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/results"
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ArrowRight className="size-4" />
        חזרה לרשימה
      </Link>

      <div>
        <h1 className="text-2xl font-bold">הזנת תוצאה</h1>
        <p className="text-muted-foreground mt-1">
          משחק #{matchDetails.match_number}
        </p>
      </div>

      {/* Match info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">פרטי המשחק</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4" />
              {matchDetails.venue}, {matchDetails.city}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-4" />
              {new Date(matchDetails.kickoff_time).toLocaleDateString("he-IL")}
            </div>
          </div>
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <p className="text-lg font-bold">{matchDetails.home_team_name}</p>
              <p className="text-xs text-muted-foreground">בית</p>
            </div>
            <span className="text-2xl font-bold text-muted-foreground">VS</span>
            <div className="text-center">
              <p className="text-lg font-bold">{matchDetails.away_team_name}</p>
              <p className="text-xs text-muted-foreground">חוץ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score entry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">תוצאה - 90 דקות</CardTitle>
          <CardDescription>
            הזינו את התוצאה בתום 90 הדקות (כולל תוספת זמן פציעות)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center space-y-2">
              <Label className="text-sm font-medium">
                {matchDetails.home_team_name}
              </Label>
              <ScoreInput value={homeScore} onChange={setHomeScore} />
            </div>
            <span className="text-xl font-bold text-muted-foreground mt-6">:</span>
            <div className="text-center space-y-2">
              <Label className="text-sm font-medium">
                {matchDetails.away_team_name}
              </Label>
              <ScoreInput value={awayScore} onChange={setAwayScore} />
            </div>
          </div>

          {/* Knockout toggle */}
          {matchDetails.stage !== "group" && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="knockout"
                  checked={isKnockout}
                  onChange={(e) => setIsKnockout(e.target.checked)}
                  className="size-4"
                />
                <Label htmlFor="knockout">משחק נוקאאוט (הארכה / פנדלים)</Label>
              </div>
            </>
          )}

          {/* Extra time / penalties */}
          {needsExtraTime && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">
                  תיקו ב-90 דקות - יש להזין תוצאה סופית
                </h3>

                <div className="flex gap-3">
                  <Button
                    variant={resultType === "extra_time" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setResultType("extra_time")}
                  >
                    הארכה
                  </Button>
                  <Button
                    variant={resultType === "penalties" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setResultType("penalties")}
                  >
                    פנדלים
                  </Button>
                </div>

                {resultType === "extra_time" && (
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center space-y-2">
                      <Label className="text-xs">
                        {matchDetails.home_team_name} (הארכה)
                      </Label>
                      <ScoreInput value={homeScoreET} onChange={setHomeScoreET} />
                    </div>
                    <span className="text-lg font-bold text-muted-foreground mt-6">
                      :
                    </span>
                    <div className="text-center space-y-2">
                      <Label className="text-xs">
                        {matchDetails.away_team_name} (הארכה)
                      </Label>
                      <ScoreInput value={awayScoreET} onChange={setAwayScoreET} />
                    </div>
                  </div>
                )}

                {resultType === "penalties" && (
                  <div className="space-y-3">
                    <Label className="text-sm">מי ניצחה בפנדלים?</Label>
                    <div className="flex gap-3">
                      <Button
                        variant={penaltyWinner === "home" ? "default" : "outline"}
                        onClick={() => setPenaltyWinner("home")}
                      >
                        {matchDetails.home_team_name}
                      </Button>
                      <Button
                        variant={penaltyWinner === "away" ? "default" : "outline"}
                        onClick={() => setPenaltyWinner("away")}
                      >
                        {matchDetails.away_team_name}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="size-4" />
              {error}
            </div>
          )}

          {/* Save button with confirmation */}
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger
              render={
                <Button
                  className="w-full gap-2"
                  disabled={homeScore === null || awayScore === null || isPending}
                />
              }
            >
              <Save className="size-4" />
              שמור תוצאה
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>אישור שמירת תוצאה</DialogTitle>
                <DialogDescription>
                  האם אתם בטוחים? לאחר השמירה, הניקוד של כל המשתתפים יעודכן.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {matchDetails.home_team_name} vs {matchDetails.away_team_name}
                </p>
                <p className="text-3xl font-bold mt-2" dir="ltr">
                  {homeScore ?? 0} - {awayScore ?? 0}
                </p>
                {needsExtraTime && resultType === "extra_time" && (
                  <p className="text-sm text-muted-foreground mt-1" dir="ltr">
                    הארכה: {homeScoreET ?? 0} - {awayScoreET ?? 0}
                  </p>
                )}
                {needsExtraTime && resultType === "penalties" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    מנצחת בפנדלים:{" "}
                    {penaltyWinner === "home"
                      ? matchDetails.home_team_name
                      : matchDetails.away_team_name}
                  </p>
                )}
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  ביטול
                </DialogClose>
                <Button onClick={handleSave} disabled={isPending} className="gap-2">
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  אישור ושמירה
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
