-- ============================================================================
-- World Cup 2026 Prediction Tournament - Initial Schema
-- Migration: 00001_initial_schema.sql
-- ============================================================================

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

CREATE TYPE tournament_phase AS ENUM (
  'pre_tournament',
  'group_stage',
  'pre_knockout',
  'round_of_32',
  'round_of_16',
  'quarter_finals',
  'semi_finals',
  'third_place',
  'final',
  'completed'
);

CREATE TYPE match_stage AS ENUM (
  'group',
  'round_of_32',
  'round_of_16',
  'quarter_final',
  'semi_final',
  'third_place',
  'final'
);

CREATE TYPE match_status AS ENUM (
  'scheduled',
  'live',
  'finished'
);

CREATE TYPE medal_type AS ENUM (
  'gold',
  'silver',
  'bronze',
  'aluminum',
  'plastic'
);

CREATE TYPE participant_status AS ENUM (
  'registered',
  'paid',
  'active',
  'disqualified'
);

CREATE TYPE knockout_result_type AS ENUM (
  'regular_time',
  'extra_time',
  'penalties'
);

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- ---- Tournaments ----
CREATE TABLE tournaments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  current_phase tournament_phase NOT NULL DEFAULT 'pre_tournament',
  entry_fee   numeric NOT NULL DEFAULT 100,
  group_stage_deadline timestamptz,
  knockout_deadline    timestamptz,
  start_date  timestamptz,
  end_date    timestamptz,
  prize_pool  numeric NOT NULL DEFAULT 0,
  settings    jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---- Teams ----
CREATE TABLE teams (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  name_he       text NOT NULL,
  name_en       text NOT NULL,
  short_code    text NOT NULL,
  group_letter  text,
  flag_url      text,
  seed_position int NOT NULL DEFAULT 0,
  is_eliminated boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),

  UNIQUE (tournament_id, short_code)
);

-- ---- Matches ----
CREATE TABLE matches (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id         uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  match_number          int NOT NULL,
  stage                 match_stage NOT NULL,
  group_letter          text,
  home_team_id          uuid REFERENCES teams(id) ON DELETE SET NULL,
  away_team_id          uuid REFERENCES teams(id) ON DELETE SET NULL,
  home_placeholder      text,
  away_placeholder      text,
  venue                 text,
  city                  text,
  kickoff_time          timestamptz,
  status                match_status NOT NULL DEFAULT 'scheduled',
  home_score_90min      int,
  away_score_90min      int,
  home_score_et         int,
  away_score_et         int,
  home_score_penalties  int,
  away_score_penalties  int,
  result_type           knockout_result_type,
  winning_team_id       uuid REFERENCES teams(id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),

  UNIQUE (tournament_id, match_number)
);

-- ---- Participants ----
CREATE TABLE participants (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id       uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name        text NOT NULL,
  email               text NOT NULL,
  phone               text,
  avatar_url          text,
  status              participant_status NOT NULL DEFAULT 'registered',
  is_paid             boolean NOT NULL DEFAULT false,
  paid_at             timestamptz,
  is_admin            boolean NOT NULL DEFAULT false,
  total_points        int NOT NULL DEFAULT 0,
  group_stage_points  int NOT NULL DEFAULT 0,
  knockout_points     int NOT NULL DEFAULT 0,
  bonus_points        int NOT NULL DEFAULT 0,
  advancement_points  int NOT NULL DEFAULT 0,
  current_rank        int NOT NULL DEFAULT 0,
  medals_gold         int NOT NULL DEFAULT 0,
  medals_silver       int NOT NULL DEFAULT 0,
  medals_bronze       int NOT NULL DEFAULT 0,
  medals_aluminum     int NOT NULL DEFAULT 0,
  medals_plastic      int NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  UNIQUE (tournament_id, user_id)
);

-- ---- Match Predictions ----
CREATE TABLE match_predictions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id    uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  match_id          uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  home_score        int NOT NULL,
  away_score        int NOT NULL,
  home_score_et     int,
  away_score_et     int,
  penalty_winner    text,
  points_awarded    int NOT NULL DEFAULT 0,
  medal             medal_type,
  is_locked         boolean NOT NULL DEFAULT false,
  prediction_counts boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (participant_id, match_id)
);

-- ---- Advancement Predictions ----
CREATE TABLE advancement_predictions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id        uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  team_id               uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  predicted_stage       match_stage NOT NULL,
  is_tournament_winner  boolean NOT NULL DEFAULT false,
  points_awarded        int NOT NULL DEFAULT 0,
  is_correct            boolean,
  created_at            timestamptz NOT NULL DEFAULT now(),

  UNIQUE (participant_id, team_id, predicted_stage)
);

-- ---- Bonus Questions ----
CREATE TABLE bonus_questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id   uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  question_number int NOT NULL,
  question_text   text NOT NULL,
  points_value    int NOT NULL DEFAULT 7,
  answer_type     text NOT NULL DEFAULT 'team',
  current_answer  text,
  is_finalized    boolean NOT NULL DEFAULT false,
  admin_notes     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  UNIQUE (tournament_id, question_number)
);

-- ---- Bonus Predictions ----
CREATE TABLE bonus_predictions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id    uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  bonus_question_id uuid NOT NULL REFERENCES bonus_questions(id) ON DELETE CASCADE,
  answer            text NOT NULL,
  is_correct        boolean,
  points_awarded    int NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (participant_id, bonus_question_id)
);

-- ---- Leaderboard Snapshots ----
CREATE TABLE leaderboard_snapshots (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  match_id      uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  match_number  int NOT NULL,
  snapshot      jsonb NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),

  UNIQUE (tournament_id, match_id)
);

-- ---- Match Prediction Stats ----
CREATE TABLE match_prediction_stats (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id           uuid NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  home_win_count     int NOT NULL DEFAULT 0,
  draw_count         int NOT NULL DEFAULT 0,
  away_win_count     int NOT NULL DEFAULT 0,
  total_predictions  int NOT NULL DEFAULT 0,
  score_distribution jsonb NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX idx_matches_tournament_stage ON matches (tournament_id, stage);
CREATE INDEX idx_matches_tournament_kickoff ON matches (tournament_id, kickoff_time);
CREATE INDEX idx_match_predictions_participant ON match_predictions (participant_id);
CREATE INDEX idx_match_predictions_match ON match_predictions (match_id);
CREATE INDEX idx_participants_tournament_points ON participants (tournament_id, total_points DESC);
CREATE INDEX idx_participants_tournament_rank ON participants (tournament_id, current_rank);
CREATE INDEX idx_advancement_predictions_participant ON advancement_predictions (participant_id);
CREATE INDEX idx_advancement_predictions_team ON advancement_predictions (team_id);

-- ============================================================================
-- 4. FUNCTIONS
-- ============================================================================

-- ---- set_updated_at() ----
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---- calculate_match_points ----
CREATE OR REPLACE FUNCTION calculate_match_points(
  predicted_home int,
  predicted_away int,
  actual_home int,
  actual_away int
)
RETURNS TABLE(points int, medal medal_type)
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  predicted_winner text;
  actual_winner    text;
  home_correct     boolean;
  away_correct     boolean;
BEGIN
  -- Determine predicted winner
  IF predicted_home > predicted_away THEN
    predicted_winner := 'home';
  ELSIF predicted_home < predicted_away THEN
    predicted_winner := 'away';
  ELSE
    predicted_winner := 'draw';
  END IF;

  -- Determine actual winner
  IF actual_home > actual_away THEN
    actual_winner := 'home';
  ELSIF actual_home < actual_away THEN
    actual_winner := 'away';
  ELSE
    actual_winner := 'draw';
  END IF;

  -- Check exact score matches
  home_correct := (predicted_home = actual_home);
  away_correct := (predicted_away = actual_away);

  -- Scoring logic
  IF home_correct AND away_correct THEN
    -- Exact score
    points := 6;
    medal := 'gold';
  ELSIF predicted_winner = actual_winner AND (home_correct OR away_correct) THEN
    -- Correct winner + one score correct
    points := 5;
    medal := 'silver';
  ELSIF predicted_winner = actual_winner THEN
    -- Correct winner only
    points := 4;
    medal := 'bronze';
  ELSIF home_correct OR away_correct THEN
    -- One score correct, wrong winner
    points := 1;
    medal := 'aluminum';
  ELSE
    -- Nothing correct
    points := 0;
    medal := 'plastic';
  END IF;

  RETURN NEXT;
END;
$$;

-- ---- recalculate_rankings ----
CREATE OR REPLACE FUNCTION recalculate_rankings(p_tournament_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE participants p
  SET current_rank = ranked.rank_number
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        ORDER BY
          total_points DESC,
          medals_gold DESC,
          medals_silver DESC,
          medals_bronze DESC,
          display_name ASC
      ) AS rank_number
    FROM participants
    WHERE tournament_id = p_tournament_id
  ) AS ranked
  WHERE p.id = ranked.id;
END;
$$;

-- ---- update_prediction_stats ----
CREATE OR REPLACE FUNCTION update_prediction_stats(p_match_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_home_win  int;
  v_draw      int;
  v_away_win  int;
  v_total     int;
  v_scores    jsonb;
BEGIN
  SELECT
    COALESCE(SUM(CASE WHEN home_score > away_score THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN home_score = away_score THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN home_score < away_score THEN 1 ELSE 0 END), 0),
    COUNT(*)
  INTO v_home_win, v_draw, v_away_win, v_total
  FROM match_predictions
  WHERE match_id = p_match_id
    AND prediction_counts = true;

  SELECT COALESCE(
    jsonb_object_agg(score_key, cnt),
    '{}'::jsonb
  )
  INTO v_scores
  FROM (
    SELECT
      home_score || '-' || away_score AS score_key,
      COUNT(*) AS cnt
    FROM match_predictions
    WHERE match_id = p_match_id
      AND prediction_counts = true
    GROUP BY home_score, away_score
  ) sub;

  INSERT INTO match_prediction_stats (match_id, home_win_count, draw_count, away_win_count, total_predictions, score_distribution)
  VALUES (p_match_id, v_home_win, v_draw, v_away_win, v_total, v_scores)
  ON CONFLICT (match_id) DO UPDATE
  SET
    home_win_count     = EXCLUDED.home_win_count,
    draw_count         = EXCLUDED.draw_count,
    away_win_count     = EXCLUDED.away_win_count,
    total_predictions  = EXCLUDED.total_predictions,
    score_distribution = EXCLUDED.score_distribution,
    updated_at         = now();
END;
$$;

-- ---- create_leaderboard_snapshot ----
CREATE OR REPLACE FUNCTION create_leaderboard_snapshot(
  p_tournament_id uuid,
  p_match_id uuid,
  p_match_number int
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_snapshot jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'participant_id', id,
      'display_name', display_name,
      'total_points', total_points,
      'group_stage_points', group_stage_points,
      'knockout_points', knockout_points,
      'bonus_points', bonus_points,
      'advancement_points', advancement_points,
      'current_rank', current_rank,
      'medals_gold', medals_gold,
      'medals_silver', medals_silver,
      'medals_bronze', medals_bronze,
      'medals_aluminum', medals_aluminum,
      'medals_plastic', medals_plastic
    ) ORDER BY current_rank ASC
  )
  INTO v_snapshot
  FROM participants
  WHERE tournament_id = p_tournament_id;

  INSERT INTO leaderboard_snapshots (tournament_id, match_id, match_number, snapshot)
  VALUES (p_tournament_id, p_match_id, p_match_number, COALESCE(v_snapshot, '[]'::jsonb))
  ON CONFLICT (tournament_id, match_id) DO UPDATE
  SET
    snapshot     = EXCLUDED.snapshot,
    match_number = EXCLUDED.match_number,
    created_at   = now();
END;
$$;

-- ---- score_match_predictions (trigger function) ----
CREATE OR REPLACE FUNCTION score_match_predictions()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  pred        record;
  calc        record;
  v_is_group  boolean;
BEGIN
  -- Only fire when match transitions to finished
  IF NEW.status != 'finished' OR OLD.status = 'finished' THEN
    RETURN NEW;
  END IF;

  -- Ensure we have scores
  IF NEW.home_score_90min IS NULL OR NEW.away_score_90min IS NULL THEN
    RETURN NEW;
  END IF;

  v_is_group := (NEW.stage = 'group');

  -- Score each prediction
  FOR pred IN
    SELECT mp.id AS prediction_id,
           mp.participant_id,
           mp.home_score AS pred_home,
           mp.away_score AS pred_away,
           mp.prediction_counts
    FROM match_predictions mp
    WHERE mp.match_id = NEW.id
  LOOP
    -- Calculate points
    SELECT * INTO calc
    FROM calculate_match_points(
      pred.pred_home,
      pred.pred_away,
      NEW.home_score_90min,
      NEW.away_score_90min
    );

    -- Update the prediction
    UPDATE match_predictions
    SET points_awarded = calc.points,
        medal          = calc.medal,
        is_locked      = true
    WHERE id = pred.prediction_id;

    -- Update participant totals (only if prediction counts)
    IF pred.prediction_counts THEN
      UPDATE participants
      SET total_points     = total_points + calc.points,
          group_stage_points = CASE WHEN v_is_group THEN group_stage_points + calc.points ELSE group_stage_points END,
          knockout_points    = CASE WHEN NOT v_is_group THEN knockout_points + calc.points ELSE knockout_points END,
          medals_gold      = CASE WHEN calc.medal = 'gold' THEN medals_gold + 1 ELSE medals_gold END,
          medals_silver    = CASE WHEN calc.medal = 'silver' THEN medals_silver + 1 ELSE medals_silver END,
          medals_bronze    = CASE WHEN calc.medal = 'bronze' THEN medals_bronze + 1 ELSE medals_bronze END,
          medals_aluminum  = CASE WHEN calc.medal = 'aluminum' THEN medals_aluminum + 1 ELSE medals_aluminum END,
          medals_plastic   = CASE WHEN calc.medal = 'plastic' THEN medals_plastic + 1 ELSE medals_plastic END
      WHERE id = pred.participant_id;
    END IF;
  END LOOP;

  -- Recalculate rankings
  PERFORM recalculate_rankings(NEW.tournament_id);

  -- Update prediction stats
  PERFORM update_prediction_stats(NEW.id);

  -- Create leaderboard snapshot
  PERFORM create_leaderboard_snapshot(NEW.tournament_id, NEW.id, NEW.match_number);

  RETURN NEW;
END;
$$;

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

-- Match result scoring trigger
CREATE TRIGGER on_match_result
  AFTER UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION score_match_predictions();

-- updated_at triggers
CREATE TRIGGER set_updated_at_tournaments
  BEFORE UPDATE ON tournaments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_matches
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_participants
  BEFORE UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_match_predictions
  BEFORE UPDATE ON match_predictions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_bonus_questions
  BEFORE UPDATE ON bonus_questions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_bonus_predictions
  BEFORE UPDATE ON bonus_predictions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_match_prediction_stats
  BEFORE UPDATE ON match_prediction_stats
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE tournaments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants            ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_predictions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE advancement_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_questions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_predictions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots   ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_prediction_stats  ENABLE ROW LEVEL SECURITY;

-- ---- tournaments: SELECT for all ----
CREATE POLICY "tournaments_select"
  ON tournaments FOR SELECT
  USING (true);

-- ---- teams: SELECT for all ----
CREATE POLICY "teams_select"
  ON teams FOR SELECT
  USING (true);

-- ---- matches: SELECT for all ----
CREATE POLICY "matches_select"
  ON matches FOR SELECT
  USING (true);

-- ---- participants ----
CREATE POLICY "participants_select"
  ON participants FOR SELECT
  USING (true);

CREATE POLICY "participants_insert"
  ON participants FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM participants
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "participants_update"
  ON participants FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM participants
      WHERE user_id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM participants
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- ---- match_predictions ----
-- Users can always see their own predictions.
-- Others' predictions are visible only after the match is finished.
CREATE POLICY "match_predictions_select"
  ON match_predictions FOR SELECT
  USING (
    -- Own predictions
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = match_predictions.participant_id
        AND p.user_id = auth.uid()
    )
    OR
    -- Others' predictions when match is finished
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_predictions.match_id
        AND m.status = 'finished'
    )
  );

CREATE POLICY "match_predictions_insert"
  ON match_predictions FOR INSERT
  WITH CHECK (
    -- Must be own participant record
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = match_predictions.participant_id
        AND p.user_id = auth.uid()
    )
    -- Match must not be locked
    AND NOT is_locked
  );

CREATE POLICY "match_predictions_update"
  ON match_predictions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = match_predictions.participant_id
        AND p.user_id = auth.uid()
    )
    AND NOT is_locked
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = match_predictions.participant_id
        AND p.user_id = auth.uid()
    )
    AND NOT is_locked
  );

-- ---- advancement_predictions ----
-- Own always visible. Others visible when tournament is past pre_tournament.
CREATE POLICY "advancement_predictions_select"
  ON advancement_predictions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = advancement_predictions.participant_id
        AND p.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM participants p
      JOIN tournaments t ON t.id = p.tournament_id
      WHERE p.id = advancement_predictions.participant_id
        AND t.current_phase != 'pre_tournament'
    )
  );

CREATE POLICY "advancement_predictions_insert"
  ON advancement_predictions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = advancement_predictions.participant_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "advancement_predictions_update"
  ON advancement_predictions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = advancement_predictions.participant_id
        AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = advancement_predictions.participant_id
        AND p.user_id = auth.uid()
    )
  );

-- ---- bonus_questions ----
CREATE POLICY "bonus_questions_select"
  ON bonus_questions FOR SELECT
  USING (true);

CREATE POLICY "bonus_questions_insert"
  ON bonus_questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM participants
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "bonus_questions_update"
  ON bonus_questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM participants
      WHERE user_id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM participants
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- ---- bonus_predictions ----
CREATE POLICY "bonus_predictions_select"
  ON bonus_predictions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = bonus_predictions.participant_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "bonus_predictions_insert"
  ON bonus_predictions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = bonus_predictions.participant_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "bonus_predictions_update"
  ON bonus_predictions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = bonus_predictions.participant_id
        AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM participants p
      WHERE p.id = bonus_predictions.participant_id
        AND p.user_id = auth.uid()
    )
  );

-- ---- leaderboard_snapshots: SELECT for all ----
CREATE POLICY "leaderboard_snapshots_select"
  ON leaderboard_snapshots FOR SELECT
  USING (true);

-- ---- match_prediction_stats: SELECT for all ----
CREATE POLICY "match_prediction_stats_select"
  ON match_prediction_stats FOR SELECT
  USING (true);
