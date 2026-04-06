"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Participant,
  MatchPredictionInsert,
  AdvancementPredictionInsert,
  BonusPredictionInsert,
  MatchStage,
} from "@/lib/types/database";

type ActionResult = { success: true } | { error: string };

async function getParticipant(): Promise<Participant | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: participant } = await supabase
    .from("participants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return participant;
}

async function checkDeadline(deadlineField: "group_stage_deadline" | "knockout_deadline"): Promise<string | null> {
  const supabase = await createClient();
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("group_stage_deadline, knockout_deadline")
    .single();

  if (!tournament) return "הטורניר לא נמצא";

  const deadline = tournament[deadlineField];
  if (deadline && new Date(deadline) < new Date()) {
    return "הזמן להגשת ניחושים עבר";
  }
  return null;
}

// ─── Match Predictions ──────────────────────────────────────

export async function savePrediction(
  matchId: string,
  homeScore: number,
  awayScore: number
): Promise<ActionResult> {
  try {
    const [participant, deadlineError] = await Promise.all([
      getParticipant(),
      checkDeadline("group_stage_deadline"),
    ]);
    if (!participant) return { error: "יש להתחבר כדי לשמור ניחושים" };
    if (deadlineError) return { error: deadlineError };

    const supabase = await createClient();

    const insertData: MatchPredictionInsert = {
      participant_id: participant.id,
      match_id: matchId,
      home_score: homeScore,
      away_score: awayScore,
    };

    const { error } = await supabase
      .from("match_predictions")
      .upsert(insertData, { onConflict: "participant_id,match_id" });

    if (error) {
      console.error("Error saving prediction:", error);
      return { error: "שגיאה בשמירת הניחוש" };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "שגיאה לא צפויה" };
  }
}

// ─── Advancement Predictions ────────────────────────────────

export async function saveAdvancementPrediction(
  teamId: string,
  stage: string,
  isTournamentWinner: boolean = false
): Promise<ActionResult> {
  try {
    const [participant, deadlineError] = await Promise.all([
      getParticipant(),
      checkDeadline("group_stage_deadline"),
    ]);
    if (!participant) return { error: "יש להתחבר כדי לשמור ניחושים" };
    if (deadlineError) return { error: deadlineError };

    const supabase = await createClient();

    const insertData: AdvancementPredictionInsert = {
      participant_id: participant.id,
      team_id: teamId,
      predicted_stage: stage as MatchStage,
      is_tournament_winner: isTournamentWinner,
    };

    const { error } = await supabase
      .from("advancement_predictions")
      .upsert(insertData, { onConflict: "participant_id,team_id,predicted_stage" });

    if (error) {
      console.error("Error saving advancement prediction:", error);
      return { error: "שגיאה בשמירת הניחוש" };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "שגיאה לא צפויה" };
  }
}

export async function removeAdvancementPrediction(teamId: string): Promise<ActionResult> {
  try {
    const participant = await getParticipant();
    if (!participant) return { error: "יש להתחבר כדי לשמור ניחושים" };

    const supabase = await createClient();
    const { error } = await supabase
      .from("advancement_predictions")
      .delete()
      .eq("participant_id", participant.id)
      .eq("team_id", teamId);

    if (error) return { error: "שגיאה במחיקת הניחוש" };
    return { success: true };
  } catch {
    return { error: "שגיאה לא צפויה" };
  }
}

// ─── Bonus Predictions ──────────────────────────────────────

export async function saveBonusPrediction(
  questionId: string,
  answer: string
): Promise<ActionResult> {
  try {
    const [participant, deadlineError] = await Promise.all([
      getParticipant(),
      checkDeadline("group_stage_deadline"),
    ]);
    if (!participant) return { error: "יש להתחבר כדי לשמור ניחושים" };
    if (deadlineError) return { error: deadlineError };

    const supabase = await createClient();

    const insertData: BonusPredictionInsert = {
      participant_id: participant.id,
      bonus_question_id: questionId,
      answer,
    };

    const { error } = await supabase
      .from("bonus_predictions")
      .upsert(insertData, { onConflict: "participant_id,bonus_question_id" });

    if (error) {
      console.error("Error saving bonus prediction:", error);
      return { error: "שגיאה בשמירת הניחוש" };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "שגיאה לא צפויה" };
  }
}
