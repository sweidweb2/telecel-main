import type { Json } from "@/types/database";

export type ActivityLogActor = {
  full_name: string | null;
  email: string | null;
} | null;

export type ActivityLogRow = {
  id: number;
  actor_id: string | null;
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

export type ErrorLogRow = {
  id: number;
  created_at: string;
  severity: string;
  source: string;
  code: string | null;
  message: string;
  actor_id: string | null;
  request_id: string | null;
  context: Json | null;
  actor: ActivityLogActor;
};

export type ErrorLogListResult = {
  rows: ErrorLogRow[];
  total: number;
  totalPages: number;
};
