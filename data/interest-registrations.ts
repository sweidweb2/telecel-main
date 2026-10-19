import { createClient } from "@/lib/supabase/server";
import type {
  InterestRegistration,
  InterestRegistrationListResult,
} from "@/types/interest-registration";
import type { InterestRegistrationListQuery } from "@/validations/interest-registration";

const REGISTRATION_COLUMNS =
  "id, full_name, email, phone, company_name, sector, country, pitch, consent, created_at" as const;

type ServerClient = Awaited<ReturnType<typeof createClient>>;

async function fetchInterestRegistrations(
  supabase: ServerClient,
  query: InterestRegistrationListQuery,
): Promise<InterestRegistrationListResult> {
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;

  let request = supabase
    .from("interest_registrations")
    .select(REGISTRATION_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (query.search) {
    request = request.or(
      `full_name.ilike.%${query.search}%,email.ilike.%${query.search}%,company_name.ilike.%${query.search}%`,
    );
  }

  const { data, count, error } = await request;
  if (error) throw error;

  const total = count ?? 0;
  return {
    registrations: (data ?? []) as InterestRegistration[],
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

/**
 * Admin gate then list. Shared client avoids duplicate createClient round trips.
 */
export async function getInterestRegistrationsPageData(
  query: InterestRegistrationListQuery,
): Promise<
  | { status: "forbidden" }
  | { status: "ok"; list: InterestRegistrationListResult }
> {
  const supabase = await createClient();

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) throw adminError;
  if (!isAdmin) return { status: "forbidden" };

  const list = await fetchInterestRegistrations(supabase, query);
  return { status: "ok", list };
}
