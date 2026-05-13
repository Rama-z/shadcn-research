import { getStoredUser, toSlug } from "@/lib/auth";

export type PermissionAction = "create" | "read" | "update" | "list" | "delete" | "other";

export const usePermission = () => {
  const user = getStoredUser();

  /**
   * Check if user has permission for a specific feature and action
   * @param featureKey The key of the feature (e.g., 'activity-log', 'user-management')
   * @param action The action to check ('create', 'read', 'update', 'delete')
   */
  const can = (featureKey: string, action: PermissionAction): boolean => {
    // Basic safety check
    if (!featureKey || !user?.features) return false;

    const featureSlug = toSlug(featureKey);

    return user.features.some((p) => {
      if (p.action !== action) return false;

      const pSlug = toSlug(p.sidebarLabel);
      const pNameSlug = toSlug(p.name);

      if (pSlug === featureSlug || pNameSlug === featureSlug) return true;

      const cleanPSlug = pSlug.replace(/^(read|list|view|write|create|delete|reference)-/, "");
      const cleanPNameSlug = pNameSlug.replace(
        /^(read|list|view|write|create|delete|reference)-/,
        ""
      );

      return (
        (cleanPSlug.length > 2 && featureSlug.includes(cleanPSlug)) ||
        (cleanPSlug.length > 2 && cleanPSlug.includes(featureSlug)) ||
        (cleanPNameSlug.length > 2 && featureSlug.includes(cleanPNameSlug)) ||
        (cleanPNameSlug.length > 2 && cleanPNameSlug.includes(featureSlug))
      );
    });
  };

  return { can, permissions: user?.features || [] };
};
