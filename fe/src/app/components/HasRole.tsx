import React from 'react';
import { hasAnyRole } from '../lib/auth';

interface HasRoleProps {
  roles?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HasRole({ roles, children, fallback = null }: HasRoleProps) {
  if (!roles || roles.length === 0) {
    return <>{children}</>;
  }

  const hasRole = hasAnyRole(roles);

  if (hasRole) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

