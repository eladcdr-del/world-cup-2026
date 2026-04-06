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
  { name_he: "ארה\"ב", name_en: "United States", short_code: "USA", group_letter: "A", flag_url: "https://flagcdn.com/w80/us.png" },
  { name_he: "מקסיקו", name_en: "Mexico", short_code: "MEX", group_letter: "A", flag_url: "https://flagcdn.com/w80/mx.png" },
  { name_he: "קנדה", name_en: "Canada", short_code: "CAN", group_letter: "A", flag_url: "https://flagcdn.com/w80/ca.png" },
  { name_he: "קוסטה ריקה", name_en: "Costa Rica", short_code: "CRC", group_letter: "A", flag_url: "https://flagcdn.com/w80/cr.png" },

  // Group B
  { name_he: "ברזיל", name_en: "Brazil", short_code: "BRA", group_letter: "B", flag_url: "https://flagcdn.com/w80/br.png" },
  { name_he: "ארגנטינה", name_en: "Argentina", short_code: "ARG", group_letter: "B", flag_url: "https://flagcdn.com/w80/ar.png" },
  { name_he: "אורוגוואי", name_en: "Uruguay", short_code: "URU", group_letter: "B", flag_url: "https://flagcdn.com/w80/uy.png" },
  { name_he: "אקוודור", name_en: "Ecuador", short_code: "ECU", group_letter: "B", flag_url: "https://flagcdn.com/w80/ec.png" },

  // Group C
  { name_he: "צרפת", name_en: "France", short_code: "FRA", group_letter: "C", flag_url: "https://flagcdn.com/w80/fr.png" },
  { name_he: "גרמניה", name_en: "Germany", short_code: "GER", group_letter: "C", flag_url: "https://flagcdn.com/w80/de.png" },
  { name_he: "אנגליה", name_en: "England", short_code: "ENG", group_letter: "C", flag_url: "https://flagcdn.com/w80/gb-eng.png" },
  { name_he: "ספרד", name_en: "Spain", short_code: "ESP", group_letter: "C", flag_url: "https://flagcdn.com/w80/es.png" },

  // Group D
  { name_he: "פורטוגל", name_en: "Portugal", short_code: "POR", group_letter: "D", flag_url: "https://flagcdn.com/w80/pt.png" },
  { name_he: "הולנד", name_en: "Netherlands", short_code: "NED", group_letter: "D", flag_url: "https://flagcdn.com/w80/nl.png" },
  { name_he: "בלגיה", name_en: "Belgium", short_code: "BEL", group_letter: "D", flag_url: "https://flagcdn.com/w80/be.png" },
  { name_he: "קרואטיה", name_en: "Croatia", short_code: "CRO", group_letter: "D", flag_url: "https://flagcdn.com/w80/hr.png" },

  // Group E
  { name_he: "איטליה", name_en: "Italy", short_code: "ITA", group_letter: "E", flag_url: "https://flagcdn.com/w80/it.png" },
  { name_he: "דנמרק", name_en: "Denmark", short_code: "DEN", group_letter: "E", flag_url: "https://flagcdn.com/w80/dk.png" },
  { name_he: "שוויץ", name_en: "Switzerland", short_code: "SUI", group_letter: "E", flag_url: "https://flagcdn.com/w80/ch.png" },
  { name_he: "אוסטריה", name_en: "Austria", short_code: "AUT", group_letter: "E", flag_url: "https://flagcdn.com/w80/at.png" },

  // Group F
  { name_he: "יפן", name_en: "Japan", short_code: "JPN", group_letter: "F", flag_url: "https://flagcdn.com/w80/jp.png" },
  { name_he: "דרום קוריאה", name_en: "South Korea", short_code: "KOR", group_letter: "F", flag_url: "https://flagcdn.com/w80/kr.png" },
  { name_he: "אוסטרליה", name_en: "Australia", short_code: "AUS", group_letter: "F", flag_url: "https://flagcdn.com/w80/au.png" },
  { name_he: "סעודיה", name_en: "Saudi Arabia", short_code: "KSA", group_letter: "F", flag_url: "https://flagcdn.com/w80/sa.png" },

  // Group G
  { name_he: "קולומביה", name_en: "Colombia", short_code: "COL", group_letter: "G", flag_url: "https://flagcdn.com/w80/co.png" },
  { name_he: "פרגוואי", name_en: "Paraguay", short_code: "PAR", group_letter: "G", flag_url: "https://flagcdn.com/w80/py.png" },
  { name_he: "ונצואלה", name_en: "Venezuela", short_code: "VEN", group_letter: "G", flag_url: "https://flagcdn.com/w80/ve.png" },
  { name_he: "בוליביה", name_en: "Bolivia", short_code: "BOL", group_letter: "G", flag_url: "https://flagcdn.com/w80/bo.png" },

  // Group H
  { name_he: "סרביה", name_en: "Serbia", short_code: "SRB", group_letter: "H", flag_url: "https://flagcdn.com/w80/rs.png" },
  { name_he: "פולין", name_en: "Poland", short_code: "POL", group_letter: "H", flag_url: "https://flagcdn.com/w80/pl.png" },
  { name_he: "טורקיה", name_en: "Turkey", short_code: "TUR", group_letter: "H", flag_url: "https://flagcdn.com/w80/tr.png" },
  { name_he: "סקוטלנד", name_en: "Scotland", short_code: "SCO", group_letter: "H", flag_url: "https://flagcdn.com/w80/gb-sct.png" },

  // Group I
  { name_he: "מרוקו", name_en: "Morocco", short_code: "MAR", group_letter: "I", flag_url: "https://flagcdn.com/w80/ma.png" },
  { name_he: "סנגל", name_en: "Senegal", short_code: "SEN", group_letter: "I", flag_url: "https://flagcdn.com/w80/sn.png" },
  { name_he: "ניגריה", name_en: "Nigeria", short_code: "NGA", group_letter: "I", flag_url: "https://flagcdn.com/w80/ng.png" },
  { name_he: "מצרים", name_en: "Egypt", short_code: "EGY", group_letter: "I", flag_url: "https://flagcdn.com/w80/eg.png" },

  // Group J
  { name_he: "אירן", name_en: "Iran", short_code: "IRN", group_letter: "J", flag_url: "https://flagcdn.com/w80/ir.png" },
  { name_he: "קטאר", name_en: "Qatar", short_code: "QAT", group_letter: "J", flag_url: "https://flagcdn.com/w80/qa.png" },
  { name_he: "אוזבקיסטן", name_en: "Uzbekistan", short_code: "UZB", group_letter: "J", flag_url: "https://flagcdn.com/w80/uz.png" },
  { name_he: "עיראק", name_en: "Iraq", short_code: "IRQ", group_letter: "J", flag_url: "https://flagcdn.com/w80/iq.png" },

  // Group K
  { name_he: "וויילס", name_en: "Wales", short_code: "WAL", group_letter: "K", flag_url: "https://flagcdn.com/w80/gb-wls.png" },
  { name_he: "אוקראינה", name_en: "Ukraine", short_code: "UKR", group_letter: "K", flag_url: "https://flagcdn.com/w80/ua.png" },
  { name_he: "צ'כיה", name_en: "Czech Republic", short_code: "CZE", group_letter: "K", flag_url: "https://flagcdn.com/w80/cz.png" },
  { name_he: "סלובניה", name_en: "Slovenia", short_code: "SVN", group_letter: "K", flag_url: "https://flagcdn.com/w80/si.png" },

  // Group L
  { name_he: "קמרון", name_en: "Cameroon", short_code: "CMR", group_letter: "L", flag_url: "https://flagcdn.com/w80/cm.png" },
  { name_he: "גאנה", name_en: "Ghana", short_code: "GHA", group_letter: "L", flag_url: "https://flagcdn.com/w80/gh.png" },
  { name_he: "צ'ילה", name_en: "Chile", short_code: "CHI", group_letter: "L", flag_url: "https://flagcdn.com/w80/cl.png" },
  { name_he: "הונדורס", name_en: "Honduras", short_code: "HON", group_letter: "L", flag_url: "https://flagcdn.com/w80/hn.png" },
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
