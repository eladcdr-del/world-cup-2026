import { createClient } from "@/lib/supabase/server";

/**
 * Get the current tournament
 */
export async function getTournament() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tournaments")
    .select("*")
    .single();
  return data;
}

/**
 * Get the current participant (logged-in user)
 */
export async function getCurrentParticipant() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("participants")
    .select("*")
    .eq("user_id", user.id)
    .single();
  return data;
}

/**
 * Get all participants for leaderboard
 */
export async function getLeaderboard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("participants")
    .select("*")
    .order("current_rank", { ascending: true });
  return data ?? [];
}

/**
 * Get participant by ID
 */
export async function getParticipantById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("participants")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

/**
 * Get all teams
 */
export async function getTeams() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .order("group_letter")
    .order("seed_position");
  return data ?? [];
}

/**
 * Get teams by group
 */
export async function getTeamsByGroup(groupLetter: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("group_letter", groupLetter)
    .order("seed_position");
  return data ?? [];
}

/**
 * Get all matches with teams
 */
export async function getMatches() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(*),
      away_team:teams!matches_away_team_id_fkey(*)
    `)
    .order("match_number");
  return data ?? [];
}

/**
 * Get matches by stage
 */
export async function getMatchesByStage(stage: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(*),
      away_team:teams!matches_away_team_id_fkey(*)
    `)
    .eq("stage", stage)
    .order("match_number");
  return data ?? [];
}

/**
 * Get a single match with teams
 */
export async function getMatchById(matchId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(*),
      away_team:teams!matches_away_team_id_fkey(*)
    `)
    .eq("id", matchId)
    .single();
  return data;
}

/**
 * Get match predictions for current user
 */
export async function getMyMatchPredictions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: participant } = await supabase
    .from("participants")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!participant) return [];

  const { data } = await supabase
    .from("match_predictions")
    .select("*")
    .eq("participant_id", participant.id);
  return data ?? [];
}

/**
 * Get match prediction stats
 */
export async function getMatchPredictionStats(matchId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("match_prediction_stats")
    .select("*")
    .eq("match_id", matchId)
    .single();
  return data;
}

/**
 * Get predictions for a finished match (all participants)
 */
export async function getMatchPredictions(matchId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("match_predictions")
    .select(`
      *,
      participant:participants(display_name)
    `)
    .eq("match_id", matchId)
    .order("points_awarded", { ascending: false });
  return data ?? [];
}

/**
 * Get bonus questions
 */
export async function getBonusQuestions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bonus_questions")
    .select("*")
    .order("question_number");
  return data ?? [];
}

/**
 * Get current user's bonus predictions
 */
export async function getMyBonusPredictions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: participant } = await supabase
    .from("participants")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!participant) return [];

  const { data } = await supabase
    .from("bonus_predictions")
    .select("*")
    .eq("participant_id", participant.id);
  return data ?? [];
}

/**
 * Get all advancement predictions for current user
 */
export async function getMyAdvancementPredictions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: participant } = await supabase
    .from("participants")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!participant) return [];

  const { data } = await supabase
    .from("advancement_predictions")
    .select(`
      *,
      team:teams(*)
    `)
    .eq("participant_id", participant.id);
  return data ?? [];
}
