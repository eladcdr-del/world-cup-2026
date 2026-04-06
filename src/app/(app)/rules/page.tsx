import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Target, Gift, Star, Medal, AlertTriangle } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">חוקי הטורניר</h1>
        <p className="text-muted-foreground mt-1">
          כל מה שצריך לדעת על שיטת הניקוד והכללים
        </p>
      </div>

      {/* Entry & Prizes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            דמי השתתפות ופרסים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>דמי השתתפות: <strong>100 ₪</strong> למשתתף</p>
          <div className="space-y-2">
            <h4 className="font-semibold">חלוקת הפרסים:</h4>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">מקום 1</Badge>
                ~50% מקופת הפרסים
              </li>
              <li className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">מקום 2</Badge>
                ~29% מקופת הפרסים
              </li>
              <li className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">מקום 3</Badge>
                ~10% מקופת הפרסים
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary">מצטיין שלב בתים</Badge>
                ~10% מקופת הפרסים
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">מקום אחרון</Badge>
                ~1% מקופת הפרסים (פרס עידוד)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Match Scoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            ניקוד על תוצאות משחקים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            לכל משחק ניתן לצבור עד 6 נקודות. הניקוד מחושב על סמך תוצאת 90 הדקות בלבד (כולל תוספת זמן פציעות).
          </p>
          <div className="grid gap-3">
            {[
              { points: 6, medal: "זהב", desc: "ניחוש מדויק של התוצאה", color: "bg-yellow-100 text-yellow-800 border-yellow-300", example: "ניחשת 2-1, התוצאה 2-1" },
              { points: 5, medal: "כסף", desc: "ניחוש המנצחת + ניחוש מספר גולים של צד אחד", color: "bg-gray-100 text-gray-700 border-gray-300", example: "ניחשת 2-0, התוצאה 3-0" },
              { points: 4, medal: "ארד", desc: "ניחוש המנצחת בלבד (ללא ניחוש גולים)", color: "bg-orange-100 text-orange-700 border-orange-300", example: "ניחשת 3-1, התוצאה 2-0" },
              { points: 1, medal: "אלומיניום", desc: "ניחוש שגוי של המנצחת, אבל ניחוש מספר גולים של צד אחד", color: "bg-blue-50 text-blue-600 border-blue-200", example: "ניחשת 1-2, התוצאה 1-0" },
              { points: 0, medal: "פלסטיק", desc: "ניחוש שגוי לחלוטין", color: "bg-gray-50 text-gray-400 border-gray-200", example: "ניחשת 3-0, התוצאה 1-1" },
            ].map((item) => (
              <div key={item.points} className={`p-3 rounded-lg border ${item.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg">{item.points} נקודות</span>
                    <span className="mx-2">-</span>
                    <span className="font-medium">{item.medal}</span>
                  </div>
                </div>
                <p className="text-sm mt-1">{item.desc}</p>
                <p className="text-xs mt-1 opacity-75">דוגמה: {item.example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advancement Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-green-600" />
            ניקוד על קבוצות עולות
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            ניקוד נוסף עבור ניחוש נכון של קבוצות שעולות לשלבים הבאים:
          </p>
          <div className="grid gap-2">
            {[
              { stage: "עולה משלב הבתים", points: 6 },
              { stage: "עולה לרבע גמר", points: 5 },
              { stage: "עולה לחצי גמר", points: 10 },
              { stage: "עולה לגמר", points: 15 },
              { stage: "אלופת העולם", points: 20 },
            ].map((item) => (
              <div key={item.stage} className="flex items-center justify-between p-2 rounded bg-muted/50">
                <span className="text-sm">{item.stage}</span>
                <Badge variant="secondary" className="font-bold">{item.points} נק&apos;</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Knockout Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            כללים מיוחדים לשלב הנוקאאוט
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="space-y-2 list-disc list-inside">
            <li>הניקוד על תוצאת המשחק מחושב רק על 90 הדקות (כולל תוספת זמן פציעות).</li>
            <li>אין ניקוד על הארכה ופנדלים.</li>
            <li>אם בחרתם תיקו, עליכם לקבוע תוצאה לאחר הארכה, ואם עדיין תיקו - מי מנצחת בפנדלים.</li>
            <li className="font-semibold text-destructive">
              כלל חשוב: ניחוש משחק נוקאאוט ייחשב רק אם ניחשתם נכון את שתי הקבוצות המשתתפות במשחק!
            </li>
            <li>ניקוד על קבוצות עולות ניתן גם אם לא השתתפתם בהימור על המשחק עצמו.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Bonus Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-600" />
            שאלות בונוס
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            10 שאלות בונוס, כל שאלה שווה <strong>7 נקודות</strong>.
            תשובות הבונוס יכולות להשתנות במהלך הטורניר ומתעדכנות בסוף.
            רק תוצאות 90 דקות נספרות.
          </p>
          <ol className="space-y-2 text-sm list-decimal list-inside">
            <li>איזו קבוצה תבקיע את מספר השערים הגדול ביותר?</li>
            <li>איזו קבוצה תבקיע את מספר השערים הנמוך ביותר?</li>
            <li>איזו קבוצה תספוג את מספר השערים הנמוך ביותר?</li>
            <li>איזו קבוצה תספוג את מספר השערים הגדול ביותר?</li>
            <li>איזו קבוצה תקבל את מספר האדומים הגדול ביותר?</li>
            <li>מספר השערים הגדול ביותר במשחק אחד (שתי הקבוצות ביחד)?</li>
            <li>הפרש השערים הגדול ביותר במשחק אחד?</li>
            <li>מאיזו קבוצה יהיה מלך השערים?</li>
            <li>הקבוצה שתכבוש שער בדקה המוקדמת ביותר?</li>
            <li>הקבוצה שתכבוש שער בדקה המאוחרת ביותר?</li>
          </ol>
        </CardContent>
      </Card>

      {/* Medal Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-yellow-600" />
            טבלת מדליות
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-muted-foreground mb-3">
            בנוסף לניקוד, כל ניחוש מקבל &quot;מדליה&quot; בהתאם לדיוק:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { medal: "🥇", label: "זהב", desc: "תוצאה מדויקת" },
              { medal: "🥈", label: "כסף", desc: "מנצחת + גול" },
              { medal: "🥉", label: "ארד", desc: "מנצחת בלבד" },
              { medal: "🔩", label: "אלומיניום", desc: "גול בלבד" },
              { medal: "❌", label: "פלסטיק", desc: "טעות מלאה" },
            ].map((item) => (
              <div key={item.label} className="text-center p-2 rounded bg-muted/50">
                <div className="text-2xl">{item.medal}</div>
                <div className="font-medium mt-1">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-xs text-muted-foreground text-center pb-8">
        הכללים עשויים להתעדכן. שינויים יודיעו לכל המשתתפים מראש.
      </p>
    </div>
  );
}
