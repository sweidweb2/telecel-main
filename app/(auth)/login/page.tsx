import { redirect } from "next/navigation";

import { authPath } from "@/constants/routes";
import { getRequestLocale } from "@/lib/i18n/request-locale";

type LoginRedirectProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginRedirectPage({
  searchParams,
}: LoginRedirectProps) {
  const locale = await getRequestLocale();
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  const target = new URL(authPath(locale, "login"), "http://local.invalid");
  if (next) {
    target.searchParams.set("next", next);
  }
  redirect(`${target.pathname}${target.search}`);
}
