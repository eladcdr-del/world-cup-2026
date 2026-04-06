export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TournamentPhase =
  | "pre_tournament"
  | "group_stage"
  | "pre_knockout"
  | "round_of_32"
  | "round_of_16"
  | "quarter_finals"
  | "semi_finals"
  | "third_place"
  | "final"
  | "completed";

export type MatchStage =
  | "group"
  | "round_of_32"
  | "round_of_16"
  | "quarter_final"
  | "semi_final"
  | "third_place"
  | "final";

export type MatchStatus = "scheduled" | "live" | "finished";
export type MedalType = "gold" | "silver" | "bronze" | "aluminum" | "plastic";
export type ParticipantStatus = "registered" | "paid" | "active" | "disqualified";
export type KnockoutResultType = "regular_time" | "extra_time" | "penalties";

// ─── Row types ───────────────────────────────────────────────

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  current_phase: TournamentPhase;
  entry_fee: number;
  group_stage_deadline: string | null;
  knockout_deadline: string | null;
  start_date: string;
  end_date: string;
  prize_pool: number;
  settings: Json;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  tournament_id: string;
  name_he: string;
  name_en: string;
  short_code: string;
  group_letter: string;
  flag_url: string;
  seed_position: number;
  is_eliminated: boolean;
  created_at: string;
}

export interface Match {
  id: string;
  tournament_id: string;
  match_number: number;
  stage: MatchStage;
  group_letter: string | null;
  home_team_id: string | null;
  away_team_id: string | null;
  home_placeholder: string | null;
  away_placeholder: string | null;
  venue: string;
  city: string;
  kickoff_time: string;
  status: MatchStatus;
  home_score_90min: number | null;
  away_score_90min: number | null;
  home_score_et: number | null;
  away_score_et: number | null;
  home_score_penalties: number | null;
  away_score_penalties: number | null;
  result_type: KnockoutResultType | null;
  winning_team_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  tournament_id: string;
  user_id: string;
  display_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  status: ParticipantStatus;
  is_paid: boolean;
  paid_at: string | null;
  is_admin: boolean;
  total_points: number;
  group_stage_points: number;
  knockout_points: number;
  bonus_points: number;
  advancement_points: number;
  current_rank: number;
  medals_gold: number;
  medals_silver: number;
  medals_bronze: number;
  medals_aluminum: number;
  medals_plastic: number;
  created_at: string;
  updated_at: string;
}

export interface MatchPrediction {
  id: string;
  participant_id: string;
  match_id: string;
  home_score: number;
  away_score: number;
  home_score_et: number | null;
  away_score_et: number | null;
  penalty_winner: string | null;
  points_awarded: number;
  medal: MedalType | null;
  is_locked: boolean;
  prediction_counts: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdvancementPrediction {
  id: string;
  participant_id: string;
  team_id: string;
  predicted_stage: MatchStage;
  is_tournament_winner: boolean;
  points_awarded: number;
  is_correct: boolean | null;
  created_at: string;
}

export interface BonusQuestion {
  id: string;
  tournament_id: string;
  question_number: number;
  question_text: string;
  points_value: number;
  answer_type: string;
  current_answer: string | null;
  is_finalized: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BonusPrediction {
  id: string;
  participant_id: string;
  bonus_question_id: string;
  answer: string;
  is_correct: boolean | null;
  points_awarded: number;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardSnapshot {
  id: string;
  tournament_id: string;
  match_id: string;
  match_number: number;
  snapshot: Json;
  created_at: string;
}

export interface MatchPredictionStats {
  id: string;
  match_id: string;
  home_win_count: number;
  draw_count: number;
  away_win_count: number;
  total_predictions: number;
  score_distribution: Json;
  created_at: string;
  updated_at: string;
}

// ─── Insert types ────────────────────────────────────────────

export type TournamentInsert = Omit<Tournament, "id" | "created_at" | "updated_at">;
export type TeamInsert = Omit<Team, "id" | "created_at">;
export type MatchInsert = Omit<Match, "id" | "created_at" | "updated_at">;

export type ParticipantInsert = {
  tournament_id: string;
  user_id: string;
  display_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  status?: ParticipantStatus;
  is_paid?: boolean;
  paid_at?: string | null;
  is_admin?: boolean;
};

export type MatchPredictionInsert = {
  participant_id: string;
  match_id: string;
  home_score: number;
  away_score: number;
  home_score_et?: number | null;
  away_score_et?: number | null;
  penalty_winner?: string | null;
};

export type AdvancementPredictionInsert = {
  participant_id: string;
  team_id: string;
  predicted_stage: MatchStage;
  is_tournament_winner?: boolean;
};

export type BonusPredictionInsert = {
  participant_id: string;
  bonus_question_id: string;
  answer: string;
};

// ─── Database type for Supabase client ───────────────────────

export interface Database {
  public: {
    Tables: {
      tournaments: {
        Row: Tournament;
        Insert: TournamentInsert;
        Update: Partial<TournamentInsert>;
      };
      teams: {
        Row: Team;
        Insert: TeamInsert;
        Update: Partial<TeamInsert>;
      };
      matches: {
        Row: Match;
        Insert: MatchInsert;
        Update: Partial<Omit<Match, "id" | "created_at" | "updated_at">>;
      };
      participants: {
        Row: Participant;
        Insert: ParticipantInsert;
        Update: Partial<Omit<Participant, "id" | "created_at" | "updated_at">>;
      };
      match_predictions: {
        Row: MatchPrediction;
        Insert: MatchPredictionInsert;
        Update: Partial<Omit<MatchPrediction, "id" | "created_at" | "updated_at">>;
      };
      advancement_predictions: {
        Row: AdvancementPrediction;
        Insert: AdvancementPredictionInsert;
        Update: Partial<Omit<AdvancementPrediction, "id" | "created_at">>;
      };
      bonus_questions: {
        Row: BonusQuestion;
        Insert: Omit<BonusQuestion, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BonusQuestion, "id" | "created_at" | "updated_at">>;
      };
      bonus_predictions: {
        Row: BonusPrediction;
        Insert: BonusPredictionInsert;
        Update: Partial<BonusPredictionInsert>;
      };
      leaderboard_snapshots: {
        Row: LeaderboardSnapshot;
        Insert: Omit<LeaderboardSnapshot, "id" | "created_at">;
        Update: Partial<Omit<LeaderboardSnapshot, "id" | "created_at">>;
      };
      match_prediction_stats: {
        Row: MatchPredictionStats;
        Insert: Omit<MatchPredictionStats, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MatchPredictionStats, "id" | "created_at" | "updated_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      tournament_phase: TournamentPhase;
      match_stage: MatchStage;
      match_status: MatchStatus;
      medal_type: MedalType;
      participant_status: ParticipantStatus;
      knockout_result_type: KnockoutResultType;
    };
  };
}

// ─── Extended types with joins ───────────────────────────────

export type MatchWithTeams = Match & {
  home_team: Team | null;
  away_team: Team | null;
};

export type MatchPredictionWithMatch = MatchPrediction & {
  match: MatchWithTeams;
};

export type ParticipantWithRank = Participant & {
  rank_change?: number;
};
