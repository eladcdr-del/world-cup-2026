"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error: string } | null, formData: FormData) => {
      const result = await login(formData);
      return result ?? null;
    },
    null
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{"התחברות"}</CardTitle>
        <CardDescription>
          {"הכנסו לחשבון כדי להמשיך"}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          {state?.error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{"אימייל"}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              dir="ltr"
              required
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{"סיסמה"}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              dir="ltr"
              required
              disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? "מתחבר..." : "התחברות"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {"אין לך חשבון?"}{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              {"הירשם"}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
