import { createClient } from "@/lib/supabase/server";
import type {
  ContactMessage,
  ContactMessageListResult,
} from "@/types/contact-message";
import type { ContactMessageListQuery } from "@/validations/contact-message";

const MESSAGE_COLUMNS =
  "id, full_name, email, phone, subject, message, created_at" as const;

type ServerClient = Awaited<ReturnType<typeof createClient>>;

async function fetchContactMessages(
  supabase: ServerClient,
  query: ContactMessageListQuery,
): Promise<ContactMessageListResult> {
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;

  let request = supabase
    .from("contact_messages")
    .select(MESSAGE_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (query.search) {
    request = request.or(
      `full_name.ilike.%${query.search}%,email.ilike.%${query.search}%,subject.ilike.%${query.search}%`,
    );
  }

  const { data, count, error } = await request;
  if (error) throw error;

  const total = count ?? 0;
  return {
    messages: (data ?? []) as ContactMessage[],
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

export async function getContactMessagesPageData(
  query: ContactMessageListQuery,
): Promise<
  | { status: "forbidden" }
  | { status: "ok"; list: ContactMessageListResult }
> {
  const supabase = await createClient();

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) throw adminError;
  if (!isAdmin) return { status: "forbidden" };

  const list = await fetchContactMessages(supabase, query);
  return { status: "ok", list };
}
