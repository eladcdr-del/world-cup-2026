"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  updateTournamentPhase,
  updateTournamentDeadlines,
} from "@/lib/actions/admin";
import { PHASE_LABELS } from "@/lib/utils/constants";
import { formatCurrency } from "@/lib/utils/format";
import type { TournamentPhase } from "@/lib/types/database";
import {
  Settings,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Clock,
  Layers,
} from "lucide-react";

const phases = Object.entries(PHASE_LABELS) as [TournamentPhase, string][];

export default function AdminTournamentPage() {
  const [currentPhase, setCurrentPhase] = useState<TournamentPhase>("pre_tournament");
  const [groupDeadline, setGroupDeadline] = useState("");
  const [knockoutDeadline, setKnockoutDeadline] = useState("");

  const [phaseSaving, setPhaseSaving] = useState(false);
  const [deadlineSaving, setDeadlineSaving] = useState(false);
  const [phaseSaved, setPhaseSaved] = useState(false);
  const [deadlineSaved, setDeadlineSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [, startTransition] = useTransition();

  // TODO: Read from DB
  const totalPaid = 0;
  const prizePool = totalPaid * 100;

  function handlePhaseUpdate() {
    setPhaseSaving(true);
    setError(null);
    startTransition(async () => {
      const result = await updateTournamentPhase(currentPhase);
      setPhaseSaving(false);
      if (result.error) {
        setError(result.error);
      } else {
        setPhaseSaved(true);
        setTimeout(() => setPhaseSaved(false), 2000);
      }
    });
  }

  function handleDeadlineUpdate() {
    setDeadlineSaving(true);
    setError(null);
    startTransition(async () => {
      const result = await updateTournamentDeadlines(
        groupDeadline || null,
        knockoutDeadline || null
      );
      setDeadlineSaving(false);
      if (result.error) {
        setError(result.error);
      } else {
        setDeadlineSaved(true);
        setTimeout(() => setDeadlineSaved(false), 2000);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="size-6 text-primary" />
          הגדרות טורניר
        </h1>
        <p className="text-muted-foreground mt-1">
          ניהול שלבים, מועדים וקופת פרסים
        </p>
      </div>

      {/* Prize Pool */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="size-5 text-yellow-600" />
            קופת פרסים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">{formatCurrency(prizePool)}</div>
            <Badge variant="secondary">
              {totalPaid} משתתפים משלמים x 100 &#8362;
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Phase selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="size-5 text-blue-600" />
            שלב נוכחי
          </CardTitle>
          <CardDescription>
            בחרו את השלב הנוכחי בטורניר
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex-1 space-y-1.5">
              <Label>שלב</Label>
              <Select
                value={currentPhase}
                onValueChange={(v) => setCurrentPhase(v as TournamentPhase)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {phases.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handlePhaseUpdate}
              disabled={phaseSaving}
              className="gap-2 shrink-0"
            >
              {phaseSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : phaseSaved ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {phaseSaved ? "עודכן!" : "עדכן שלב"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="size-5 text-orange-600" />
            מועדי סגירה
          </CardTitle>
          <CardDescription>
            הגדירו את המועדים האחרונים להגשת ניחושים
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="group-deadline">דדליין שלב בתים</Label>
              <Input
                id="group-deadline"
                type="datetime-local"
                value={groupDeadline}
                onChange={(e) => setGroupDeadline(e.target.value)}
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="knockout-deadline">דדליין שלב נוקאאוט</Label>
              <Input
                id="knockout-deadline"
                type="datetime-local"
                value={knockoutDeadline}
                onChange={(e) => setKnockoutDeadline(e.target.value)}
                dir="ltr"
              />
            </div>
          </div>
          <Button
            onClick={handleDeadlineUpdate}
            disabled={deadlineSaving}
            className="gap-2"
          >
            {deadlineSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : deadlineSaved ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            {deadlineSaved ? "עודכן!" : "עדכן מועדים"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm">
          <AlertTriangle className="size-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
