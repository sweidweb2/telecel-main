import type { Tables } from "@/types/database";

export type ContactMessage = Tables<"contact_messages">;

export type ContactMessageListResult = {
  messages: ContactMessage[];
  total: number;
  totalPages: number;
};
