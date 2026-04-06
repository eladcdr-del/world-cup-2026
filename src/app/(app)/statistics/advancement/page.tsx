import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AdvancementStatisticsPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/statistics"
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ArrowRight className="size-4" />
        חזרה לסטטיסטיקות
      </Link>

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="size-6 text-green-600" />
          סקירת קבוצות עולות
        </h1>
        <p className="text-muted-foreground mt-1">
          ניחושי התקדמות קבוצות בשלבי הנוקאאוט
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Users className="mx-auto size-12 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">
            סקירת הקבוצות העולות תתעדכן עם התקדמות הטורניר.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
