import React from 'react';

interface HasRoleProps {
  roles?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HasRole({ roles, children, fallback = null }: HasRoleProps) {
  // Get token and decode roles (similar to MainLayout logic)
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  
  let userRoles: string[] = [];
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const scope: string = payload.scope || "";
      const authorities = scope.split(" ");
      
      userRoles = authorities
        .filter(a => a.startsWith("ROLE_"))
        .map(r => r.replace("ROLE_", ""));
    } catch (e) {
      userRoles = [];
    }
  }

  if (!roles || roles.length === 0) {
    return <>{children}</>;
  }

  const hasRole = roles.some(role => userRoles.includes(role));

  if (hasRole) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
