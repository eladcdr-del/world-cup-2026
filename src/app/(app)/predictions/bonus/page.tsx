"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { BONUS_QUESTIONS } from "@/data/bonus-questions";
import { TEAMS } from "@/data/teams";
import { SCORING_CONFIG } from "@/lib/utils/scoring";
import { saveBonusPrediction } from "@/lib/actions/predictions";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Check, Loader2, HelpCircle } from "lucide-react";
import Image from "next/image";

interface BonusAnswer {
  answer: string;
  saving: boolean;
  saved: boolean;
}

export default function BonusPredictionsPage() {
  const [answers, setAnswers] = useState<Record<number, BonusAnswer>>({});
  const [isLocked, setIsLocked] = useState(false);
  const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>(
    {}
  );

  const deadline = "2026-06-11T12:00:00+03:00";

  const completedCount = Object.values(answers).filter(
    (a) => a.answer.trim() !== ""
  ).length;

  // Save with debounce for number inputs
  const saveAnswer = useCallback(
    async (questionNumber: number, answer: string) => {
      if (isLocked) return;

      // Mock question ID based on question number
      const questionId = `mock-bonus-${questionNumber}`;

      setAnswers((prev) => ({
        ...prev,
        [questionNumber]: {
          answer,
          saving: true,
          saved: false,
        },
      }));

      const result = await saveBonusPrediction(questionId, answer);

      setAnswers((prev) => ({
        ...prev,
        [questionNumber]: {
          ...prev[questionNumber],
          saving: false,
          saved: "success" in result,
        },
      }));

      // Clear saved indicator after 2 seconds
      if ("success" in result) {
        setTimeout(() => {
          setAnswers((prev) => ({
            ...prev,
            [questionNumber]: {
              ...prev[questionNumber],
              saved: false,
            },
          }));
        }, 2000);
      }
    },
    [isLocked]
  );

  const handleTeamSelect = useCallback(
    (questionNumber: number, value: string | null) => {
      if (!value) return;
      setAnswers((prev) => ({
        ...prev,
        [questionNumber]: {
          answer: value,
          saving: false,
          saved: false,
        },
      }));
      saveAnswer(questionNumber, value);
    },
    [saveAnswer]
  );

  const handleNumberChange = useCallback(
    (questionNumber: number, value: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionNumber]: {
          answer: value,
          saving: false,
          saved: prev[questionNumber]?.saved ?? false,
        },
      }));

      // Debounce number input saves
      if (debounceTimers.current[questionNumber]) {
        clearTimeout(debounceTimers.current[questionNumber]);
      }

      debounceTimers.current[questionNumber] = setTimeout(() => {
        if (value.trim() !== "") {
          saveAnswer(questionNumber, value);
        }
      }, 500);
    },
    [saveAnswer]
  );

  // Cleanup timers
  useEffect(() => {
    const timers = debounceTimers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">שאלות בונוס</h1>
        <p className="text-muted-foreground mt-1">
          ענו על 10 שאלות בונוס - {SCORING_CONFIG.BONUS_POINTS} נקודות לכל
          תשובה נכונה
        </p>
      </div>

      {/* Countdown */}
      <CountdownTimer
        deadline={deadline}
        onExpired={() => setIsLocked(true)}
      />

      {/* Progress */}
      <div className="flex items-center gap-3">
        <Badge variant={completedCount === 10 ? "default" : "secondary"}>
          {completedCount}/{BONUS_QUESTIONS.length} תשובות
        </Badge>
        <span className="text-sm text-muted-foreground">
          סה&quot;כ אפשרי: {BONUS_QUESTIONS.length * SCORING_CONFIG.BONUS_POINTS}{" "}
          נקודות
        </span>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {BONUS_QUESTIONS.map((question) => {
          const currentAnswer = answers[question.question_number];
          const isSaving = currentAnswer?.saving ?? false;
          const isSaved = currentAnswer?.saved ?? false;
          const answerValue = currentAnswer?.answer ?? "";

          return (
            <Card key={question.question_number}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {question.question_number}
                  </div>
                  <CardTitle className="text-base">
                    {question.question_text}
                  </CardTitle>
                </div>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">
                      {question.points_value} נקודות
                    </Badge>
                    <Badge variant="secondary">
                      {question.answer_type === "team" ? "קבוצה" : "מספר"}
                    </Badge>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {question.answer_type === "team" ? (
                    <div className="w-full max-w-sm">
                      <Select
                        value={answerValue || undefined}
                        onValueChange={(val) =>
                          handleTeamSelect(question.question_number, val)
                        }
                        disabled={isLocked}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="בחרו קבוצה..." />
                        </SelectTrigger>
                        <SelectContent>
                          {TEAMS.map((team) => (
                            <SelectItem
                              key={team.short_code}
                              value={team.short_code}
                            >
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
                    </div>
                  ) : (
                    <div className="w-full max-w-[120px]">
                      <Input
                        type="number"
                        min={0}
                        max={50}
                        placeholder="0"
                        value={answerValue}
                        onChange={(e) =>
                          handleNumberChange(
                            question.question_number,
                            e.target.value
                          )
                        }
                        disabled={isLocked}
                        className="text-center text-lg font-bold"
                        dir="ltr"
                      />
                    </div>
                  )}

                  {/* Save status */}
                  <div className="flex items-center gap-1.5 min-w-[70px]">
                    {isSaving && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          שומר...
                        </span>
                      </>
                    )}
                    {isSaved && !isSaving && (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">נשמר</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
