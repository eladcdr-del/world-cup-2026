/**
 * FIFA World Cup 2026 - Qualified Teams
 * 48 teams in 12 groups of 4
 * Group draw TBD - using placeholder groups for now
 * Flag URLs use flagcdn.com format
 */

export interface TeamSeed {
  name_he: string;
  name_en: string;
  short_code: string;
  group_letter: string;
  flag_url: string;
}

// NOTE: Group assignments are PLACEHOLDERS until the official draw.
// Update these when FIFA announces the groups.
export const TEAMS: TeamSeed[] = [
  // Group A
  { name_he: "ארה\"ב", name_en: "United States", short_code: "USA", group_letter: "A", flag_url: "/flags/us.svg" },
  { name_he: "מקסיקו", name_en: "Mexico", short_code: "MEX", group_letter: "A", flag_url: "/flags/mx.svg" },
  { name_he: "קנדה", name_en: "Canada", short_code: "CAN", group_letter: "A", flag_url: "/flags/ca.svg" },
  { name_he: "קוסטה ריקה", name_en: "Costa Rica", short_code: "CRC", group_letter: "A", flag_url: "/flags/cr.svg" },

  // Group B
  { name_he: "ברזיל", name_en: "Brazil", short_code: "BRA", group_letter: "B", flag_url: "/flags/br.svg" },
  { name_he: "ארגנטינה", name_en: "Argentina", short_code: "ARG", group_letter: "B", flag_url: "/flags/ar.svg" },
  { name_he: "אורוגוואי", name_en: "Uruguay", short_code: "URU", group_letter: "B", flag_url: "/flags/uy.svg" },
  { name_he: "אקוודור", name_en: "Ecuador", short_code: "ECU", group_letter: "B", flag_url: "/flags/ec.svg" },

  // Group C
  { name_he: "צרפת", name_en: "France", short_code: "FRA", group_letter: "C", flag_url: "/flags/fr.svg" },
  { name_he: "גרמניה", name_en: "Germany", short_code: "GER", group_letter: "C", flag_url: "/flags/de.svg" },
  { name_he: "אנגליה", name_en: "England", short_code: "ENG", group_letter: "C", flag_url: "/flags/gb-eng.svg" },
  { name_he: "ספרד", name_en: "Spain", short_code: "ESP", group_letter: "C", flag_url: "/flags/es.svg" },

  // Group D
  { name_he: "פורטוגל", name_en: "Portugal", short_code: "POR", group_letter: "D", flag_url: "/flags/pt.svg" },
  { name_he: "הולנד", name_en: "Netherlands", short_code: "NED", group_letter: "D", flag_url: "/flags/nl.svg" },
  { name_he: "בלגיה", name_en: "Belgium", short_code: "BEL", group_letter: "D", flag_url: "/flags/be.svg" },
  { name_he: "קרואטיה", name_en: "Croatia", short_code: "CRO", group_letter: "D", flag_url: "/flags/hr.svg" },

  // Group E
  { name_he: "איטליה", name_en: "Italy", short_code: "ITA", group_letter: "E", flag_url: "/flags/it.svg" },
  { name_he: "דנמרק", name_en: "Denmark", short_code: "DEN", group_letter: "E", flag_url: "/flags/dk.svg" },
  { name_he: "שוויץ", name_en: "Switzerland", short_code: "SUI", group_letter: "E", flag_url: "/flags/ch.svg" },
  { name_he: "אוסטריה", name_en: "Austria", short_code: "AUT", group_letter: "E", flag_url: "/flags/at.svg" },

  // Group F
  { name_he: "יפן", name_en: "Japan", short_code: "JPN", group_letter: "F", flag_url: "/flags/jp.svg" },
  { name_he: "דרום קוריאה", name_en: "South Korea", short_code: "KOR", group_letter: "F", flag_url: "/flags/kr.svg" },
  { name_he: "אוסטרליה", name_en: "Australia", short_code: "AUS", group_letter: "F", flag_url: "/flags/au.svg" },
  { name_he: "סעודיה", name_en: "Saudi Arabia", short_code: "KSA", group_letter: "F", flag_url: "/flags/sa.svg" },

  // Group G
  { name_he: "קולומביה", name_en: "Colombia", short_code: "COL", group_letter: "G", flag_url: "/flags/co.svg" },
  { name_he: "פרגוואי", name_en: "Paraguay", short_code: "PAR", group_letter: "G", flag_url: "/flags/py.svg" },
  { name_he: "ונצואלה", name_en: "Venezuela", short_code: "VEN", group_letter: "G", flag_url: "/flags/ve.svg" },
  { name_he: "בוליביה", name_en: "Bolivia", short_code: "BOL", group_letter: "G", flag_url: "/flags/bo.svg" },

  // Group H
  { name_he: "סרביה", name_en: "Serbia", short_code: "SRB", group_letter: "H", flag_url: "/flags/rs.svg" },
  { name_he: "פולין", name_en: "Poland", short_code: "POL", group_letter: "H", flag_url: "/flags/pl.svg" },
  { name_he: "טורקיה", name_en: "Turkey", short_code: "TUR", group_letter: "H", flag_url: "/flags/tr.svg" },
  { name_he: "סקוטלנד", name_en: "Scotland", short_code: "SCO", group_letter: "H", flag_url: "/flags/gb-sct.svg" },

  // Group I
  { name_he: "מרוקו", name_en: "Morocco", short_code: "MAR", group_letter: "I", flag_url: "/flags/ma.svg" },
  { name_he: "סנגל", name_en: "Senegal", short_code: "SEN", group_letter: "I", flag_url: "/flags/sn.svg" },
  { name_he: "ניגריה", name_en: "Nigeria", short_code: "NGA", group_letter: "I", flag_url: "/flags/ng.svg" },
  { name_he: "מצרים", name_en: "Egypt", short_code: "EGY", group_letter: "I", flag_url: "/flags/eg.svg" },

  // Group J
  { name_he: "אירן", name_en: "Iran", short_code: "IRN", group_letter: "J", flag_url: "/flags/ir.svg" },
  { name_he: "קטאר", name_en: "Qatar", short_code: "QAT", group_letter: "J", flag_url: "/flags/qa.svg" },
  { name_he: "אוזבקיסטן", name_en: "Uzbekistan", short_code: "UZB", group_letter: "J", flag_url: "/flags/uz.svg" },
  { name_he: "עיראק", name_en: "Iraq", short_code: "IRQ", group_letter: "J", flag_url: "/flags/iq.svg" },

  // Group K
  { name_he: "וויילס", name_en: "Wales", short_code: "WAL", group_letter: "K", flag_url: "/flags/gb-wls.svg" },
  { name_he: "אוקראינה", name_en: "Ukraine", short_code: "UKR", group_letter: "K", flag_url: "/flags/ua.svg" },
  { name_he: "צ'כיה", name_en: "Czech Republic", short_code: "CZE", group_letter: "K", flag_url: "/flags/cz.svg" },
  { name_he: "סלובניה", name_en: "Slovenia", short_code: "SVN", group_letter: "K", flag_url: "/flags/si.svg" },

  // Group L
  { name_he: "קמרון", name_en: "Cameroon", short_code: "CMR", group_letter: "L", flag_url: "/flags/cm.svg" },
  { name_he: "גאנה", name_en: "Ghana", short_code: "GHA", group_letter: "L", flag_url: "/flags/gh.svg" },
  { name_he: "צ'ילה", name_en: "Chile", short_code: "CHI", group_letter: "L", flag_url: "/flags/cl.svg" },
  { name_he: "הונדורס", name_en: "Honduras", short_code: "HON", group_letter: "L", flag_url: "/flags/hn.svg" },
];

/**
 * Get teams for a specific group
 */
export function getTeamsByGroup(groupLetter: string): TeamSeed[] {
  return TEAMS.filter((t) => t.group_letter === groupLetter);
}

/**
 * Get all unique group letters
 */
export function getGroupLetters(): string[] {
  return [...new Set(TEAMS.map((t) => t.group_letter))].sort();
}
