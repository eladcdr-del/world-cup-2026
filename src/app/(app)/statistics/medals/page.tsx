import { Card, CardContent } from "@/components/ui/card";
import { Medal } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MedalsStatisticsPage() {
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
          <Medal className="size-6 text-yellow-600" />
          טבלת מדליות
        </h1>
        <p className="text-muted-foreground mt-1">
          סיכום מדליות כל המשתתפים
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Medal className="mx-auto size-12 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">
            טבלת המדליות תתמלא לאחר שיוזנו תוצאות משחקים.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
