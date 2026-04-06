"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "יש למלא את כל השדות" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "אימייל או סיסמה שגויים" };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "יש לאמת את כתובת האימייל לפני ההתחברות" };
    }
    return { error: "שגיאה בהתחברות. נסו שוב מאוחר יותר." };
  }

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const supabase = await createClient();

  const displayName = formData.get("displayName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!displayName || !email || !password) {
    return { error: "יש למלא את כל השדות" };
  }

  if (password.length < 6) {
    return { error: "הסיסמה חייבת להכיל לפחות 6 תווים" };
  }

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (signUpError) {
    if (signUpError.message.includes("already registered")) {
      return { error: "כתובת האימייל כבר רשומה במערכת" };
    }
    if (signUpError.message.includes("valid email")) {
      return { error: "כתובת אימייל לא תקינה" };
    }
    return { error: "שגיאה בהרשמה. נסו שוב מאוחר יותר." };
  }

  if (data.user) {
    const participantData = {
      user_id: data.user.id,
      tournament_id: "00000000-0000-0000-0000-000000000001",
      display_name: displayName,
      email: email,
      phone: null,
      avatar_url: null,
      status: "active" as const,
      is_paid: false,
      paid_at: null,
      is_admin: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase
      .from("participants") as any)
      .insert(participantData);

    if (insertError) {
      console.error("Failed to create participant record:", insertError);
    }
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
