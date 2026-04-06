"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { updateBonusAnswer, finalizeBonusQuestion } from "@/lib/actions/admin";
import { BONUS_QUESTIONS } from "@/data/bonus-questions";
import {
  Gift,
  Save,
  Lock,
  Unlock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface QuestionState {
  answer: string;
  isFinalized: boolean;
  saving: boolean;
  finalizing: boolean;
  error: string | null;
  saved: boolean;
}

export default function AdminBonusPage() {
  const [questions, setQuestions] = useState<QuestionState[]>(
    BONUS_QUESTIONS.map(() => ({
      answer: "",
      isFinalized: false,
      saving: false,
      finalizing: false,
      error: null,
      saved: false,
    }))
  );

  const [finalizeIdx, setFinalizeIdx] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function updateField(idx: number, field: Partial<QuestionState>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, ...field } : q))
    );
  }

  function handleSaveAnswer(idx: number) {
    const q = questions[idx];
    if (!q.answer.trim()) {
      updateField(idx, { error: "יש להזין תשובה" });
      return;
    }

    updateField(idx, { saving: true, error: null });
    startTransition(async () => {
      // TODO: Use real question ID from DB
      const questionId = `bonus-${idx + 1}`;
      const result = await updateBonusAnswer(questionId, q.answer);
      if (result.error) {
        updateField(idx, { saving: false, error: result.error });
      } else {
        updateField(idx, { saving: false, saved: true });
        setTimeout(() => updateField(idx, { saved: false }), 2000);
      }
    });
  }

  function handleFinalize(idx: number) {
    updateField(idx, { finalizing: true, error: null });
    startTransition(async () => {
      const questionId = `bonus-${idx + 1}`;
      const result = await finalizeBonusQuestion(questionId);
      if (result.error) {
        updateField(idx, { finalizing: false, error: result.error });
      } else {
        updateField(idx, { finalizing: false, isFinalized: true });
      }
      setFinalizeIdx(null);
    });
  }

  const finalizedCount = questions.filter((q) => q.isFinalized).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gift className="size-6 text-primary" />
          ניהול שאלות בונוס
        </h1>
        <p className="text-muted-foreground mt-1">
          עדכנו תשובות וסיימו שאלות בונוס
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <div className="text-sm text-muted-foreground">
            שאלות שהושלמו:{" "}
            <span className="font-bold text-foreground">
              {finalizedCount} / {BONUS_QUESTIONS.length}
            </span>
          </div>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: `${(finalizedCount / BONUS_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question cards */}
      <div className="grid gap-4">
        {BONUS_QUESTIONS.map((bq, idx) => {
          const q = questions[idx];
          return (
            <Card
              key={bq.question_number}
              className={
                q.isFinalized
                  ? "border-green-300 bg-green-50/50"
                  : undefined
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {bq.question_number}
                    </span>
                    שאלה {bq.question_number}
                  </CardTitle>
                  {q.isFinalized ? (
                    <Badge className="bg-green-600 gap-1">
                      <Lock className="size-3" />
                      הושלם
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Unlock className="size-3" />
                      ממתין
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm mt-1">
                  {bq.question_text}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>סוג תשובה: {bq.answer_type === "team" ? "קבוצה" : "מספר"}</span>
                  <span>|</span>
                  <span>שווי: {bq.points_value} נקודות</span>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="sr-only">תשובה</Label>
                    <Input
                      placeholder={
                        bq.answer_type === "team"
                          ? "שם הקבוצה..."
                          : "מספר..."
                      }
                      value={q.answer}
                      onChange={(e) =>
                        updateField(idx, { answer: e.target.value })
                      }
                      disabled={q.isFinalized}
                      type={bq.answer_type === "number" ? "number" : "text"}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 shrink-0"
                    onClick={() => handleSaveAnswer(idx)}
                    disabled={q.saving || q.isFinalized}
                  >
                    {q.saving ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : q.saved ? (
                      <CheckCircle2 className="size-3.5 text-green-600" />
                    ) : (
                      <Save className="size-3.5" />
                    )}
                    {q.saved ? "נשמר" : "עדכן תשובה"}
                  </Button>
                </div>

                {q.error && (
                  <p className="text-destructive text-xs flex items-center gap-1">
                    <AlertTriangle className="size-3" />
                    {q.error}
                  </p>
                )}

                {!q.isFinalized && q.answer.trim() && (
                  <Dialog
                    open={finalizeIdx === idx}
                    onOpenChange={(open) =>
                      setFinalizeIdx(open ? idx : null)
                    }
                  >
                    <DialogTrigger
                      render={
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-1 w-full"
                        />
                      }
                    >
                      <Lock className="size-3.5" />
                      סיים בונוס
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>אישור סיום בונוס</DialogTitle>
                        <DialogDescription>
                          לאחר הסיום לא ניתן יהיה לשנות את התשובה. התוצאה
                          תישלח לכל המשתתפים.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-3 text-center">
                        <p className="text-sm text-muted-foreground">
                          שאלה: {bq.question_text}
                        </p>
                        <p className="text-lg font-bold mt-2">
                          תשובה: {q.answer}
                        </p>
                      </div>
                      <DialogFooter>
                        <DialogClose render={<Button variant="outline" />}>
                          ביטול
                        </DialogClose>
                        <Button
                          onClick={() => handleFinalize(idx)}
                          disabled={q.finalizing}
                          className="gap-1"
                        >
                          {q.finalizing && (
                            <Loader2 className="size-4 animate-spin" />
                          )}
                          אישור וסיום
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
