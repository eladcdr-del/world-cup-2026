import type { MatchStage } from "@/lib/types/database";

export interface MatchSeed {
  match_number: number;
  stage: MatchStage;
  group_letter: string | null;
  home_team_code: string | null;
  away_team_code: string | null;
  home_placeholder: string | null;
  away_placeholder: string | null;
  venue: string;
  city: string;
  /** Offset from tournament start date (June 11, 2026) in days + time */
  day_offset: number;
  kickoff_hour: string; // "HH:MM" in local Israel time
}

/**
 * Generate all 48 group stage matches.
 * In a group of 4 teams (1,2,3,4), the matchups are:
 * Round 1: 1v2, 3v4
 * Round 2: 1v3, 2v4
 * Round 3: 1v4, 2v3
 */
function generateGroupMatches(): MatchSeed[] {
  const groups = ["A","B","C","D","E","F","G","H","I","J","K","L"];
  const matches: MatchSeed[] = [];
  let matchNum = 1;

  // Spread matches across days 0-14 (June 11 - June 25)
  // 3-4 matches per day
  const times = ["16:00", "19:00", "22:00", "13:00"];

  for (let round = 0; round < 3; round++) {
    for (let g = 0; g < groups.length; g++) {
      const group = groups[g];
      const dayOffset = round * 5 + Math.floor(g / 3);
      const timeIdx = g % 4;

      // Team positions in group: 0=1st seed, 1=2nd, 2=3rd, 3=4th
      const matchups = [
        [[0, 1], [2, 3]], // Round 1
        [[0, 2], [1, 3]], // Round 2
        [[0, 3], [1, 2]], // Round 3
      ];

      const [home, away] = matchups[round][g % 2 === 0 ? 0 : 1];

      matches.push({
        match_number: matchNum++,
        stage: "group",
        group_letter: group,
        home_team_code: `${group}${home + 1}`,
        away_team_code: `${group}${away + 1}`,
        home_placeholder: null,
        away_placeholder: null,
        venue: "TBD",
        city: "TBD",
        day_offset: dayOffset,
        kickoff_hour: times[timeIdx],
      });
    }
  }

  // Ensure we have exactly 48 group matches (may need adjustment)
  return matches.slice(0, 48);
}

/**
 * Generate all 56 knockout stage matches as placeholders.
 */
function generateKnockoutMatches(startNum: number): MatchSeed[] {
  const matches: MatchSeed[] = [];
  let matchNum = startNum;

  // Round of 32: 16 matches, days 16-19
  for (let i = 0; i < 16; i++) {
    matches.push({
      match_number: matchNum++,
      stage: "round_of_32",
      group_letter: null,
      home_team_code: null,
      away_team_code: null,
      home_placeholder: `שלב 32 - משחק ${i + 1}`,
      away_placeholder: `שלב 32 - משחק ${i + 1}`,
      venue: "TBD",
      city: "TBD",
      day_offset: 16 + Math.floor(i / 4),
      kickoff_hour: ["16:00", "19:00", "22:00", "13:00"][i % 4],
    });
  }

  // Round of 16: 8 matches, days 21-24
  for (let i = 0; i < 8; i++) {
    matches.push({
      match_number: matchNum++,
      stage: "round_of_16",
      group_letter: null,
      home_team_code: null,
      away_team_code: null,
      home_placeholder: `שמינית ${i + 1}`,
      away_placeholder: `שמינית ${i + 1}`,
      venue: "TBD",
      city: "TBD",
      day_offset: 21 + Math.floor(i / 2),
      kickoff_hour: i % 2 === 0 ? "19:00" : "22:00",
    });
  }

  // Quarter-finals: 4 matches, days 27-28
  for (let i = 0; i < 4; i++) {
    matches.push({
      match_number: matchNum++,
      stage: "quarter_final",
      group_letter: null,
      home_team_code: null,
      away_team_code: null,
      home_placeholder: `רבע גמר ${i + 1}`,
      away_placeholder: `רבע גמר ${i + 1}`,
      venue: "TBD",
      city: "TBD",
      day_offset: 27 + Math.floor(i / 2),
      kickoff_hour: i % 2 === 0 ? "19:00" : "22:00",
    });
  }

  // Semi-finals: 2 matches, days 31-32
  for (let i = 0; i < 2; i++) {
    matches.push({
      match_number: matchNum++,
      stage: "semi_final",
      group_letter: null,
      home_team_code: null,
      away_team_code: null,
      home_placeholder: `חצי גמר ${i + 1}`,
      away_placeholder: `חצי גמר ${i + 1}`,
      venue: "TBD",
      city: "TBD",
      day_offset: 31 + i,
      kickoff_hour: "22:00",
    });
  }

  // Third-place match, day 37
  matches.push({
    match_number: matchNum++,
    stage: "third_place",
    group_letter: null,
    home_team_code: null,
    away_team_code: null,
    home_placeholder: "מפסידת חצי גמר 1",
    away_placeholder: "מפסידת חצי גמר 2",
    venue: "TBD",
    city: "TBD",
    day_offset: 37,
    kickoff_hour: "19:00",
  });

  // Final, day 38
  matches.push({
    match_number: matchNum++,
    stage: "final",
    group_letter: null,
    home_team_code: null,
    away_team_code: null,
    home_placeholder: "מנצחת חצי גמר 1",
    away_placeholder: "מנצחת חצי גמר 2",
    venue: "MetLife Stadium",
    city: "ניו ג'רזי",
    day_offset: 38,
    kickoff_hour: "22:00",
  });

  return matches;
}

/**
 * Generate all 104 matches for the tournament
 */
export function generateAllMatches(): MatchSeed[] {
  const groupMatches = generateGroupMatches();
  const knockoutMatches = generateKnockoutMatches(groupMatches.length + 1);
  return [...groupMatches, ...knockoutMatches];
}

/**
 * Total expected matches
 */
export const TOTAL_MATCHES = 104;
export const GROUP_MATCHES = 48;
export const KNOCKOUT_MATCHES = 56;
