import { NextResponse } from "next/server";

import { DEFAULT_LOCALE } from "@/constants/locales";
import { authPath, ROUTES } from "@/constants/routes";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const redirectTo =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : ROUTES.dashboard;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(redirectTo, origin));
    }
  }

  return NextResponse.redirect(
    new URL(authPath(DEFAULT_LOCALE, "login"), origin)
  );
}
