export type ActivityLogActor = {
  full_name: string | null;
  email: string | null;
} | null;

/** List-row shape — only columns rendered (or keyed) in the admin table. */
export type ActivityLogRow = {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
  actor: ActivityLogActor;
};

export type ActivityLogListResult = {
  rows: ActivityLogRow[];
  total: number;
  totalPages: number;
};

/** List-row shape — `code` / `request_id` / `context` stay searchable/writable, not listed. */
export type ErrorLogRow = {
  id: number;
  created_at: string;
  severity: string;
  source: string;
  message: string;
  actor: ActivityLogActor;
};

export type ErrorLogListResult = {
  rows: ErrorLogRow[];
  total: number;
  totalPages: number;
};
