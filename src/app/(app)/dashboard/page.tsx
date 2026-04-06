import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trophy, Target, Hash, Medal } from "lucide-react";

const statCards = [
  {
    title: "סה\"כ נקודות",
    value: "0",
    icon: Trophy,
    color: "text-amber-500",
  },
  {
    title: "דירוג נוכחי",
    value: "-",
    icon: Hash,
    color: "text-blue-500",
  },
  {
    title: "משחקים שנוחשו",
    value: "0/104",
    icon: Target,
    color: "text-green-500",
  },
  {
    title: "מדליות",
    value: "0",
    icon: Medal,
    color: "text-purple-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome message */}
      <div>
        <h2 className="text-2xl font-bold">
          {"ברוך הבא למונדיאל 2026!"}
        </h2>
        <p className="mt-1 text-muted-foreground">
          {"הנה סיכום מהיר של המצב שלך בטורניר"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                {stat.title}
              </CardDescription>
              <stat.icon className={cn("size-5 shrink-0", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next match placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>{"המשחק הבא"}</CardTitle>
          <CardDescription>
            {"המשחק הקרוב ביותר שעדיין לא ניחשתם"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-8 text-center text-muted-foreground">
            <Target className="size-12 opacity-30" />
            <p>{"המשחקים יתעדכנו בקרוב"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

