import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-bl from-blue-950 via-blue-900 to-green-900 px-4 text-center">
      <div className="flex max-w-lg flex-col items-center gap-6">
        <span className="text-6xl">{"\u26BD"}</span>

        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          {"מונדיאל 2026"}
        </h1>

        <h2 className="text-xl font-medium text-blue-200 sm:text-2xl">
          {"טורניר ניחושים"}
        </h2>

        <p className="max-w-md text-blue-100/80">
          {"נחשו תוצאות משחקי המונדיאל, צברו נקודות והתחרו מול חברים. מי יהיה המנחש הטוב ביותר?"}
        </p>

        <div className="mt-4 flex gap-4">
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "lg" }), "min-w-28")}
          >
            {"התחברות"}
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "min-w-28 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            )}
          >
            {"הרשמה"}
          </Link>
        </div>
      </div>
    </div>
  );
}
