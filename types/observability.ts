import type { Json } from "@/types/database";

export type ActivityLogActor = {
  full_name: string | null;
  email: string | null;
} | null;

/** List-row shape for the admin activity table + detail modal. */
export type ActivityLogRow = {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string | null;
  summary: Json | null;
  created_at: string;
  actor: ActivityLogActor;
};

export type ActivityLogListResult = {
  rows: ActivityLogRow[];
  total: number;
  totalPages: number;
};

/** List-row shape for the admin error table + detail modal. */
export type ErrorLogRow = {
  id: number;
  created_at: string;
  severity: string;
  source: string;
  message: string;
  code: string | null;
  request_id: string | null;
  context: Json | null;
  actor: ActivityLogActor;
};

export type ErrorLogListResult = {
  rows: ErrorLogRow[];
  total: number;
  totalPages: number;
};
