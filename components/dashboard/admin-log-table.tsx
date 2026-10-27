/**
 * @deprecated Prefer `@/components/dashboard/admin-data-table`.
 * Re-exports kept so older imports keep working during the rename.
 */
export {
  AdminDataTable as AdminLogTable,
  actorLabel,
  adminRowNumber,
  AdminRowNumberCell,
  type AdminDataColumn as AdminLogColumn,
  type AdminDataFilterContext as AdminLogFilterContext,
} from "@/components/dashboard/admin-data-table";
