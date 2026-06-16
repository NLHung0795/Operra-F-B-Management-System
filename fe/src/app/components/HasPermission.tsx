import React from "react";
import { hasPermission, hasAnyPermission } from "../lib/auth";

interface HasPermissionProps {
  permission?: string;
  anyOfPermissions?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HasPermission({
  permission,
  anyOfPermissions,
  children,
  fallback = null
}: HasPermissionProps) {
  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (anyOfPermissions && anyOfPermissions.length > 0) {
    hasAccess = hasAnyPermission(anyOfPermissions);
  } else {
    hasAccess = true;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
export default HasPermission;
