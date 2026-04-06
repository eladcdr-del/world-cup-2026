import type { MedalType } from "@/lib/types/database";

/**
 * Scoring configuration - easy to modify when rules change.
 * This mirrors the PostgreSQL calculate_match_points() function.
 */
export const SCORING_CONFIG = {
  // Match prediction points
  EXACT_SCORE: 6,        // Gold - exact score prediction
  WINNER_PLUS_GOAL: 5,   // Silver - correct winner + one correct goal count
  WINNER_ONLY: 4,        // Bronze - correct winner/draw, no goal match
  ONE_GOAL_ONLY: 1,      // Aluminum - wrong winner but one correct goal count
  WRONG: 0,              // Plastic - completely wrong

  // Advancement points
  ADVANCE_FROM_GROUP: 6,
  ADVANCE_TO_QF: 5,
  ADVANCE_TO_SF: 10,
  ADVANCE_TO_FINAL: 15,
  TOURNAMENT_WINNER: 20,

  // Bonus points
  BONUS_POINTS: 7,

  // Number of bonus questions
  BONUS_COUNT: 10,
} as const;

export interface ScoringResult {
  points: number;
  medal: MedalType;
}

/**
 * Calculate match prediction points.
 * Client-side preview of what the DB function does.
 */
export function calculateMatchPoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): ScoringResult {
  // Determine winners
  const predictedWinner =
    predictedHome > predictedAway ? "home" :
    predictedHome < predictedAway ? "away" : "draw";

  const actualWinner =
    actualHome > actualAway ? "home" :
    actualHome < actualAway ? "away" : "draw";

  const homeCorrect = predictedHome === actualHome;
  const awayCorrect = predictedAway === actualAway;

  // Exact score
  if (homeCorrect && awayCorrect) {
    return { points: SCORING_CONFIG.EXACT_SCORE, medal: "gold" };
  }

  // Correct winner + one goal
  if (predictedWinner === actualWinner && (homeCorrect || awayCorrect)) {
    return { points: SCORING_CONFIG.WINNER_PLUS_GOAL, medal: "silver" };
  }

  // Correct winner only
  if (predictedWinner === actualWinner) {
    return { points: SCORING_CONFIG.WINNER_ONLY, medal: "bronze" };
  }

  // Wrong winner but one goal correct
  if (homeCorrect || awayCorrect) {
    return { points: SCORING_CONFIG.ONE_GOAL_ONLY, medal: "aluminum" };
  }

  // Completely wrong
  return { points: SCORING_CONFIG.WRONG, medal: "plastic" };
}

/**
 * Medal display properties
 */
export const MEDAL_CONFIG: Record<MedalType, { label: string; color: string; emoji: string }> = {
  gold: { label: "זהב", color: "text-yellow-600 bg-yellow-50", emoji: "🥇" },
  silver: { label: "כסף", color: "text-gray-500 bg-gray-50", emoji: "🥈" },
  bronze: { label: "ארד", color: "text-orange-700 bg-orange-50", emoji: "🥉" },
  aluminum: { label: "אלומיניום", color: "text-blue-400 bg-blue-50", emoji: "🔩" },
  plastic: { label: "פלסטיק", color: "text-gray-300 bg-gray-50", emoji: "❌" },
};
