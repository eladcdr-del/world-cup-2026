"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Participant,
  MatchPrediction,
  AdvancementPrediction,
  BonusPrediction,
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

  const deadline = (tournament as Record<string, string | null>)[deadlineField];
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
    const participant = await getParticipant();
    if (!participant) return { error: "יש להתחבר כדי לשמור ניחושים" };

    const deadlineError = await checkDeadline("group_stage_deadline");
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(insertData as any, { onConflict: "participant_id,match_id" });

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

export async function getMyPredictions(): Promise<{
  data: MatchPrediction[];
  error: string | null;
}> {
  try {
    const participant = await getParticipant();
    if (!participant) return { data: [], error: null };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("match_predictions")
      .select("*")
      .eq("participant_id", participant.id);

    if (error) return { data: [], error: "שגיאה בטעינת הניחושים" };
    return { data: data ?? [], error: null };
  } catch {
    return { data: [], error: "שגיאה לא צפויה" };
  }
}

// ─── Advancement Predictions ────────────────────────────────

export async function saveAdvancementPrediction(
  teamId: string,
  stage: string,
  isTournamentWinner: boolean = false
): Promise<ActionResult> {
  try {
    const participant = await getParticipant();
    if (!participant) return { error: "יש להתחבר כדי לשמור ניחושים" };

    const deadlineError = await checkDeadline("group_stage_deadline");
    if (deadlineError) return { error: deadlineError };

    const supabase = await createClient();

    // Tournament winner is handled via the is_tournament_winner field in the upsert

    const insertData: AdvancementPredictionInsert = {
      participant_id: participant.id,
      team_id: teamId,
      predicted_stage: stage as MatchStage,
      is_tournament_winner: isTournamentWinner,
    };

    const { error } = await supabase
      .from("advancement_predictions")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(insertData as any, { onConflict: "participant_id,team_id,predicted_stage" });

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

export async function getMyAdvancementPredictions(): Promise<{
  data: AdvancementPrediction[];
  error: string | null;
}> {
  try {
    const participant = await getParticipant();
    if (!participant) return { data: [], error: null };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("advancement_predictions")
      .select("*")
      .eq("participant_id", participant.id);

    if (error) return { data: [], error: "שגיאה בטעינת הניחושים" };
    return { data: data ?? [], error: null };
  } catch {
    return { data: [], error: "שגיאה לא צפויה" };
  }
}

// ─── Bonus Predictions ──────────────────────────────────────

export async function saveBonusPrediction(
  questionId: string,
  answer: string
): Promise<ActionResult> {
  try {
    const participant = await getParticipant();
    if (!participant) return { error: "יש להתחבר כדי לשמור ניחושים" };

    const deadlineError = await checkDeadline("group_stage_deadline");
    if (deadlineError) return { error: deadlineError };

    const supabase = await createClient();

    const insertData: BonusPredictionInsert = {
      participant_id: participant.id,
      bonus_question_id: questionId,
      answer,
    };

    const { error } = await supabase
      .from("bonus_predictions")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(insertData as any, { onConflict: "participant_id,bonus_question_id" });

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

export async function getMyBonusPredictions(): Promise<{
  data: BonusPrediction[];
  error: string | null;
}> {
  try {
    const participant = await getParticipant();
    if (!participant) return { data: [], error: null };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bonus_predictions")
      .select("*")
      .eq("participant_id", participant.id);

    if (error) return { data: [], error: "שגיאה בטעינת הניחושים" };
    return { data: data ?? [], error: null };
  } catch {
    return { data: [], error: "שגיאה לא צפויה" };
  }
}
