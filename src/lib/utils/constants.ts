export const TOURNAMENT_ID = "wc2026"; // Will be replaced with actual UUID from DB

export const STAGE_LABELS: Record<string, string> = {
  group: "שלב הבתים",
  round_of_32: "שמינית הגמר",
  round_of_16: "שמינית הגמר (סבב 2)",
  quarter_final: "רבע גמר",
  semi_final: "חצי גמר",
  third_place: "משחק על מקום שלישי",
  final: "גמר",
};

export const PHASE_LABELS: Record<string, string> = {
  pre_tournament: "לפני הטורניר",
  group_stage: "שלב הבתים",
  pre_knockout: "לפני שלב הנוקאאוט",
  round_of_32: "שמינית הגמר",
  round_of_16: "שמינית הגמר (סבב 2)",
  quarter_finals: "רבע גמר",
  semi_finals: "חצי גמר",
  third_place: "משחק על מקום שלישי",
  final: "גמר",
  completed: "הטורניר הסתיים",
};

export const GROUP_LETTERS = [
  "A", "B", "C", "D", "E", "F",
  "G", "H", "I", "J", "K", "L",
] as const;

export const BONUS_QUESTIONS_HE = [
  "איזו קבוצה תבקיע את מספר השערים הגדול ביותר בכל הטורניר?",
  "איזו קבוצה תבקיע את מספר השערים הנמוך ביותר בכל הטורניר?",
  "איזו קבוצה תספוג את מספר השערים הנמוך ביותר בכל הטורניר?",
  "איזו קבוצה תספוג את מספר השערים הגדול ביותר בכל הטורניר?",
  "איזו קבוצה תקבל את מספר הכרטיסים האדומים הגדול ביותר?",
  "מה יהיה מספר השערים הגדול ביותר שיובקע במשחק אחד (לשתי הקבוצות ביחד)?",
  "מה יהיה הפרש השערים הגדול ביותר במשחק אחד בכל הטורניר?",
  "מאיזו קבוצה יהיה מלך השערים?",
  "מי הקבוצה שתכבוש את השער בדקה המוקדמת ביותר?",
  "מי הקבוצה שתכבוש את השער בדקה המאוחרת ביותר (90 דקות + תוספת)?",
];

export const NAV_ITEMS = [
  { href: "/dashboard", label: "לוח בקרה", icon: "LayoutDashboard" },
  { href: "/predictions", label: "ניחושים", icon: "Target" },
  { href: "/leaderboard", label: "טבלת דירוג", icon: "Trophy" },
  { href: "/matches", label: "משחקים", icon: "Swords" },
  { href: "/groups", label: "בתים", icon: "Grid3X3" },
  { href: "/statistics", label: "סטטיסטיקות", icon: "BarChart3" },
  { href: "/rules", label: "חוקי הטורניר", icon: "BookOpen" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { href: "/admin/results", label: "הזנת תוצאות", icon: "ClipboardCheck" },
  { href: "/admin/participants", label: "משתתפים", icon: "Users" },
  { href: "/admin/bonus", label: "שאלות בונוס", icon: "Gift" },
  { href: "/admin/tournament", label: "ניהול טורניר", icon: "Settings" },
  { href: "/admin/knockout-setup", label: "טבלת נוקאאוט", icon: "GitBranch" },
] as const;
