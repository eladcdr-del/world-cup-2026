"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { KnockoutResultType, TournamentPhase } from "@/lib/types/database";

/**
 * Verify the current user is an admin participant.
 * Returns the participant row or redirects to /dashboard.
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: participant } = await (supabase as any)
    .from("participants")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_admin", true)
    .single();

  if (!participant) redirect("/dashboard");
  return { supabase, participant, userId: user.id };
}

// ─── Match Results ──────────────────────────────────────────

export async function saveMatchResult(
  matchId: string,
  homeScore: number,
  awayScore: number,
  resultType?: KnockoutResultType,
  homeScoreET?: number | null,
  awayScoreET?: number | null,
  penaltyWinner?: string | null
) {
  const { supabase } = await requireAdmin();

  const updateData: Record<string, unknown> = {
    home_score_90min: homeScore,
    away_score_90min: awayScore,
    status: "finished",
  };

  if (resultType) {
    updateData.result_type = resultType;
  }
  if (homeScoreET !== undefined && homeScoreET !== null) {
    updateData.home_score_et = homeScoreET;
  }
  if (awayScoreET !== undefined && awayScoreET !== null) {
    updateData.away_score_et = awayScoreET;
  }
  if (penaltyWinner) {
    updateData.penalty_winner = penaltyWinner;
  }

  // Determine winning team for knockout matches
  if (homeScore !== awayScore) {
    // Clear winner from 90min
    const { data: match } = await (supabase as any)
      .from("matches")
      .select("home_team_id, away_team_id")
      .eq("id", matchId)
      .single();

    if (match) {
      updateData.winning_team_id =
        homeScore > awayScore ? match.home_team_id : match.away_team_id;
    }
  }

  const { error } = await (supabase as any)
    .from("matches")
    .update(updateData)
    .eq("id", matchId);

  if (error) {
    return { error: "שגיאה בשמירת התוצאה: " + error.message };
  }

  revalidatePath("/admin/results");
  revalidatePath("/matches");
  revalidatePath("/leaderboard");
  return { success: true };
}

// ─── Participants ───────────────────────────────────────────

export async function markParticipantPaid(participantId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await (supabase as any)
    .from("participants")
    .update({
      is_paid: true,
      paid_at: new Date().toISOString(),
      status: "paid",
    })
    .eq("id", participantId);

  if (error) {
    return { error: "שגיאה בעדכון תשלום: " + error.message };
  }

  revalidatePath("/admin/participants");
  return { success: true };
}

// ─── Bonus Questions ────────────────────────────────────────

export async function updateBonusAnswer(questionId: string, answer: string) {
  const { supabase } = await requireAdmin();

  const { error } = await (supabase as any)
    .from("bonus_questions")
    .update({ current_answer: answer })
    .eq("id", questionId);

  if (error) {
    return { error: "שגיאה בעדכון תשובה: " + error.message };
  }

  revalidatePath("/admin/bonus");
  return { success: true };
}

export async function finalizeBonusQuestion(questionId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await (supabase as any)
    .from("bonus_questions")
    .update({ is_finalized: true })
    .eq("id", questionId);

  if (error) {
    return { error: "שגיאה בסיום הבונוס: " + error.message };
  }

  revalidatePath("/admin/bonus");
  revalidatePath("/statistics");
  return { success: true };
}

// ─── Tournament Settings ────────────────────────────────────

export async function updateTournamentPhase(phase: TournamentPhase) {
  const { supabase } = await requireAdmin();

  const { error } = await (supabase as any)
    .from("tournaments")
    .update({ current_phase: phase })
    .eq("slug", "wc2026");

  if (error) {
    return { error: "שגיאה בעדכון שלב: " + error.message };
  }

  revalidatePath("/admin/tournament");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTournamentDeadlines(
  groupDeadline: string | null,
  knockoutDeadline: string | null
) {
  const { supabase } = await requireAdmin();

  const { error } = await (supabase as any)
    .from("tournaments")
    .update({
      group_stage_deadline: groupDeadline,
      knockout_deadline: knockoutDeadline,
    })
    .eq("slug", "wc2026");

  if (error) {
    return { error: "שגיאה בעדכון מועדים: " + error.message };
  }

  revalidatePath("/admin/tournament");
  return { success: true };
}
