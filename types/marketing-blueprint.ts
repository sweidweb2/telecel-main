/** Wireframe section on a blueprint marketing page. */
export type BlueprintSectionConfig = {
  id: string;
  title: string;
  /** Optional note under the title (blueprint-only, not final copy). */
  note?: string;
};

/** Wireframe marketing page config (meta + header + skeleton sections). */
export type PageBlueprintConfig = {
  path: string;
  eyebrow?: string;
  title: string;
  description?: string;
  metaTitle: string;
  metaDescription: string;
  /** Omit or leave empty when the route composes real sections itself. */
  sections?: readonly BlueprintSectionConfig[];
};
