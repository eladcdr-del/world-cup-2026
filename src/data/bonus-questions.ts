export interface BonusQuestionSeed {
  question_number: number;
  question_text: string;
  answer_type: "team" | "number";
  points_value: number;
}

export const BONUS_QUESTIONS: BonusQuestionSeed[] = [
  {
    question_number: 1,
    question_text: "איזו קבוצה תבקיע את מספר השערים הגדול ביותר בכל הטורניר?",
    answer_type: "team",
    points_value: 7,
  },
  {
    question_number: 2,
    question_text: "איזו קבוצה תבקיע את מספר השערים הנמוך ביותר בכל הטורניר?",
    answer_type: "team",
    points_value: 7,
  },
  {
    question_number: 3,
    question_text: "איזו קבוצה תספוג את מספר השערים הנמוך ביותר בכל הטורניר?",
    answer_type: "team",
    points_value: 7,
  },
  {
    question_number: 4,
    question_text: "איזו קבוצה תספוג את מספר השערים הגדול ביותר בכל הטורניר?",
    answer_type: "team",
    points_value: 7,
  },
  {
    question_number: 5,
    question_text: "איזו קבוצה תקבל את מספר הכרטיסים האדומים הגדול ביותר?",
    answer_type: "team",
    points_value: 7,
  },
  {
    question_number: 6,
    question_text: "מה יהיה מספר השערים הגדול ביותר שיובקע במשחק אחד (לשתי הקבוצות ביחד)?",
    answer_type: "number",
    points_value: 7,
  },
  {
    question_number: 7,
    question_text: "מה יהיה הפרש השערים הגדול ביותר במשחק אחד בכל הטורניר?",
    answer_type: "number",
    points_value: 7,
  },
  {
    question_number: 8,
    question_text: "מאיזו קבוצה יהיה מלך השערים?",
    answer_type: "team",
    points_value: 7,
  },
  {
    question_number: 9,
    question_text: "מי הקבוצה שתכבוש את השער בדקה המוקדמת ביותר?",
    answer_type: "team",
    points_value: 7,
  },
  {
    question_number: 10,
    question_text: "מי הקבוצה שתכבוש את השער בדקה המאוחרת ביותר (90 דקות + תוספת זמן פציעות)?",
    answer_type: "team",
    points_value: 7,
  },
];
