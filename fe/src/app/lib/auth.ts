export interface AuthData {
  username: string;
  roles: string[];
  permissions: string[];
}

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [
    "CREATE_ROLE", "VIEW_ROLE", "UPDATE_ROLE", "DELETE_ROLE",
    "CREATE_PERMISSION", "VIEW_PERMISSION", "VIEW_USER_ACCOUNTS",
    "MANAGE_USER_ACCOUNTS", "MANAGE_COMPANY", "MANAGE_BRANCH",
    "MANAGE_DEPARTMENT", "MANAGE_POSITION", "VIEW_EMPLOYEE",
    "MANAGE_EMPLOYEE", "MANAGE_WORK_ASSIGNMENT", "VIEW_SHIFT_ASSIGNMENT",
    "MANAGE_SHIFT_ASSIGNMENT", "VIEW_ATTENDANCE", "MANAGE_ATTENDANCE",
    "ATTENDANCE_CHECK", "SUBMIT_LEAVE_REQUEST", "APPROVE_LEAVE_REQUEST",
    "VIEW_LEAVE_REQUEST", "OPEN_CLOSE_CASH_SESSION", "VIEW_CASH_SESSION",
    "CREATE_ORDER", "VIEW_ORDER", "UPDATE_ORDER", "CANCEL_ORDER",
    "MANAGE_INVOICE", "MANAGE_EXPENSE", "VIEW_EXPENSE", "MANAGE_PAYROLL",
    "VIEW_PERSONAL_PAYROLL", "VIEW_KPI"
  ],
  MANAGER: [
    "VIEW_EMPLOYEE", "MANAGE_EMPLOYEE", "MANAGE_WORK_ASSIGNMENT",
    "VIEW_SHIFT_ASSIGNMENT", "MANAGE_SHIFT_ASSIGNMENT", "VIEW_ATTENDANCE",
    "MANAGE_ATTENDANCE", "ATTENDANCE_CHECK", "SUBMIT_LEAVE_REQUEST",
    "APPROVE_LEAVE_REQUEST", "VIEW_LEAVE_REQUEST", "OPEN_CLOSE_CASH_SESSION",
    "VIEW_CASH_SESSION", "CREATE_ORDER", "VIEW_ORDER", "UPDATE_ORDER",
    "CANCEL_ORDER", "MANAGE_INVOICE", "MANAGE_EXPENSE", "VIEW_EXPENSE",
    "MANAGE_PAYROLL", "VIEW_PERSONAL_PAYROLL", "VIEW_KPI"
  ],
  CASHIER: [
    "ATTENDANCE_CHECK", "SUBMIT_LEAVE_REQUEST", "VIEW_LEAVE_REQUEST",
    "OPEN_CLOSE_CASH_SESSION", "VIEW_CASH_SESSION", "CREATE_ORDER",
    "VIEW_ORDER", "UPDATE_ORDER", "CANCEL_ORDER", "MANAGE_INVOICE",
    "MANAGE_EXPENSE", "VIEW_EXPENSE", "VIEW_PERSONAL_PAYROLL", "VIEW_KPI"
  ],
  KITCHEN: [
    "ATTENDANCE_CHECK", "SUBMIT_LEAVE_REQUEST", "VIEW_LEAVE_REQUEST",
    "VIEW_PERSONAL_PAYROLL", "VIEW_KPI"
  ],
  EMPLOYEE: [
    "ATTENDANCE_CHECK", "SUBMIT_LEAVE_REQUEST", "VIEW_LEAVE_REQUEST",
    "VIEW_PERSONAL_PAYROLL", "VIEW_KPI"
  ]
};

export function getAuthData(): AuthData {
  const token = localStorage.getItem("accessToken");
  const isMock = import.meta.env.VITE_USE_MOCK_DATA === "true";

  if (!token) {
    if (isMock) {
      // In mock mode without a token, default to ADMIN with standard permissions
      return {
        username: "Mock Admin",
        roles: ["ADMIN"],
        permissions: [
          "CREATE_ROLE", "VIEW_ROLE", "UPDATE_ROLE", "DELETE_ROLE",
          "CREATE_PERMISSION", "VIEW_PERMISSION", "VIEW_USER_ACCOUNTS",
          "MANAGE_USER_ACCOUNTS", "MANAGE_COMPANY", "MANAGE_BRANCH",
          "MANAGE_DEPARTMENT", "MANAGE_POSITION", "VIEW_EMPLOYEE",
          "MANAGE_EMPLOYEE", "MANAGE_WORK_ASSIGNMENT", "VIEW_SHIFT_ASSIGNMENT",
          "MANAGE_SHIFT_ASSIGNMENT", "VIEW_ATTENDANCE", "MANAGE_ATTENDANCE",
          "ATTENDANCE_CHECK", "SUBMIT_LEAVE_REQUEST", "APPROVE_LEAVE_REQUEST",
          "VIEW_LEAVE_REQUEST", "OPEN_CLOSE_CASH_SESSION", "VIEW_CASH_SESSION",
          "CREATE_ORDER", "VIEW_ORDER", "UPDATE_ORDER", "CANCEL_ORDER",
          "MANAGE_INVOICE", "MANAGE_EXPENSE", "VIEW_EXPENSE", "MANAGE_PAYROLL",
          "VIEW_PERSONAL_PAYROLL", "VIEW_KPI"
        ]
      };
    }
    return { username: "Guest", roles: [], permissions: [] };
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    const scope: string = payload.scope || "";
    const authorities = scope.split(" ");

    const roles = authorities
      .filter((a) => a.startsWith("ROLE_"))
      .map((r) => r.replace("ROLE_", ""));
    const permissions = authorities.filter((a) => !a.startsWith("ROLE_"));

    // If roles is empty and mock is active, default to ADMIN roles
    const activeRoles = roles.length > 0 ? roles : (isMock ? ["ADMIN"] : ["EMPLOYEE"]);

    return {
      username: payload.sub || "User",
      roles: activeRoles,
      permissions
    };
  } catch (e) {
    console.error("Error decoding token:", e);
    return { username: "Guest", roles: [], permissions: [] };
  }
}

export function hasPermission(permission: string): boolean {
  const auth = getAuthData();
  const knownRolePermissions = auth.roles
    .map((role) => ROLE_PERMISSIONS[role])
    .filter((permissions): permissions is string[] => Boolean(permissions));

  if (knownRolePermissions.length > 0) {
    return knownRolePermissions.some((permissions) => permissions.includes(permission));
  }

  return (
    auth.permissions.includes(permission)
  );
}

export function hasAnyPermission(permissions: string[]): boolean {
  return permissions.some((p) => hasPermission(p));
}

export function hasRole(role: string): boolean {
  const auth = getAuthData();
  return auth.roles.includes(role);
}

export function hasAnyRole(roles: string[]): boolean {
  const auth = getAuthData();
  return roles.some((r) => auth.roles.includes(r));
}
