export type ApiResponse<T> = {
  code: number;
  message?: string;
  result?: T;
};

export type PageResponse<T> = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: T[];
};

export type CompanyResponse = {
  id: string;
  name: string;
  taxCode: string;
};

export type CompanyRequest = {
  name: string;
  taxCode?: string;
};

export type BranchResponse = {
  id: string;
  companyId: string;
  name: string;
  address?: string;
  phone?: string;
  status?: string;
};

export type BranchRequest = {
  name: string;
  address?: string;
  phone?: string;
  status?: string;
};

export type DepartmentResponse = {
  id: string;
  name: string;
  description?: string;
};

export type DepartmentRequest = {
  name: string;
  description?: string;
};

export type PositionResponse = {
  id: string;
  name: string;
  description?: string;
  level?: string;
  baseSalary?: number;
};

export type PositionRequest = {
  name: string;
  description?: string;
  level?: string;
  baseSalary?: number;
};

export type EmployeeResponse = {
  id: string;
  departmentName?: string;
  positionName?: string;
  branchName?: string;
  fullname: string;
  dob?: string;
  phoneNumber?: string;
  hireDay?: string;
  status?: string;
};

export type EmployeeRequest = {
  departmentName: string;
  positionName: string;
  branchId: string;
  fullname: string;
  dob?: string;
  phoneNumber?: string;
  hireDay?: string;
  status?: string;
  username: string;
  email: string;
  roles?: string[];
};

export type EmployeeUpdateRequest = Omit<EmployeeRequest, "username" | "email" | "roles">;

export type WorkAssignmentRequest = {
  name: string;
  startTime: string;
  endTime: string;
  breakTime?: number;
  shiftType: string;
};

export type WorkAssignmentResponse = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakTime?: number;
  shiftType: string;
};

export type ShiftAssignmentResponse = {
  id: string;
  employee: EmployeeResponse;
  workAssignment: WorkAssignmentResponse;
  assignedBy: EmployeeResponse;
  date: string;
};

export type ShiftAssignmentRequest = {
  employeeId: string;
  workAssignmentId: string;
  assignedBy: string;
  date: string;
};

export type BulkShiftAssignmentRequest = {
  assignedBy: string;
  assignments: Array<{
    employeeId: string;
    workAssignmentId: string;
    date: string;
  }>;
};

export type AuthenticationRequest = {
  username: string;
  password: string;
};

export type AuthenticationResponse = {
  token: string;
  authenticated: boolean;
  mustChangePassword?: boolean;
};

export type PermissionResponse = {
  name: string;
  description?: string;
};

export type RoleResponse = {
  name: string;
  description?: string;
  permissions?: PermissionResponse[];
};

export type UserAccountCreationRequest = {
  username: string;
  password: string;
  email: string;
  creationDate?: string;
  status?: string;
  roles?: string[];
};

export type UserAccountCreationResponse = {
  id: string;
  username: string;
  email: string;
  creationDate?: string;
  roles?: string[];
};

// Attendance Types
export type AttendanceResponse = {
  id: string;
  employeeId: string;
  shiftAssignmentId: string;
  checkInTime: string;
  checkOutTime?: string;
  method: string;
  location: string;
  status: string;
};

export type AttendanceRequest = {
  employeeId: string;
  shiftAssignmentId: string;
  checkInTime: string;
  checkOutTime?: string;
  method: string;
  location: string;
  status: string;
};

// Payroll Types (Placeholder for future backend implementation)
export type PayrollResponse = {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowance: number;
  bonus: number;
  deductions: number;
  tax: number;
  netSalary: number;
  status: string;
};

// Leave Request Types (Placeholder for future backend implementation)
export type LeaveRequestResponse = {
  id: string;
  employeeId: string;
  type: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
};

export type LeaveRequestRequest = {
  employeeId: string;
  type: string;
  fromDate: string;
  toDate: string;
  reason: string;
};

// Product Types (Placeholder for future backend implementation)
export type ProductResponse = {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  price: number;
  status: string;
};

export type ProductRequest = {
  name: string;
  categoryId: string;
  price: number;
  status?: string;
};

export type ProductCategoryResponse = {
  id: string;
  name: string;
  description?: string;
};

export type ProductCategoryRequest = {
  name: string;
  description?: string;
};

// Order Types (Placeholder for future backend implementation)
export type OrderResponse = {
  id: string;
  orderNo: string;
  employeeId: string;
  tableId: string;
  items: OrderItemResponse[];
  totalPrice: number;
  status: string;
  orderTime: string;
};

export type OrderItemResponse = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount?: number;
};

export type ServiceAreaResponse = {
  id: string;
  name: string;
  status: string;
};

export type TableResponse = {
  id: string;
  name: string;
  areaId: string;
  capacity: number;
  status: string;
};

const identityBaseUrl = import.meta.env.VITE_API_GATEWAY_URL 
  ? `${import.meta.env.VITE_API_GATEWAY_URL}/identity`
  : import.meta.env.VITE_IDENTITY_API_URL ?? "http://localhost:8888/api/v1/identity";
  
const organizationBaseUrl = import.meta.env.VITE_API_GATEWAY_URL 
  ? `${import.meta.env.VITE_API_GATEWAY_URL}/organization`
  : import.meta.env.VITE_ORGANIZATION_API_URL ?? "http://localhost:8888/api/v1/organization";
  
const schedulingBaseUrl = import.meta.env.VITE_API_GATEWAY_URL 
  ? `${import.meta.env.VITE_API_GATEWAY_URL}/scheduling`
  : import.meta.env.VITE_SCHEDULING_API_URL ?? "http://localhost:8888/api/v1/scheduling";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken") ?? localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(baseUrl: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => undefined)) as ApiResponse<T> | undefined;

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload?.result as T;
}

function toQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const value = query.toString();
  return value ? `?${value}` : "";
}

export const organizationApi = {
  createCompany: (body: CompanyRequest) =>
    request<CompanyResponse>(organizationBaseUrl, "/companies", { method: "POST", body: JSON.stringify(body) }),
  getCompanies: () => request<CompanyResponse[]>(organizationBaseUrl, "/companies"),
  getCompany: (companyId: string) => request<CompanyResponse>(organizationBaseUrl, `/companies/${companyId}`),
  updateCompany: (companyId: string, body: CompanyRequest) =>
    request<CompanyResponse>(organizationBaseUrl, `/companies/${companyId}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteCompany: (companyId: string) => request<void>(organizationBaseUrl, `/companies/${companyId}`, { method: "DELETE" }),

  createBranch: (companyId: string, body: BranchRequest) =>
    request<BranchResponse>(organizationBaseUrl, `/branches${toQuery({ companyId })}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getBranches: (params: { companyId?: string; status?: string } = {}) =>
    request<BranchResponse[]>(organizationBaseUrl, `/branches${toQuery(params)}`),
  getBranch: (companyId: string, branchId: string) =>
    request<BranchResponse>(organizationBaseUrl, `/branches/${branchId}${toQuery({ companyId })}`),
  updateBranch: (companyId: string, branchId: string, body: BranchRequest) =>
    request<BranchResponse>(organizationBaseUrl, `/branches/${branchId}${toQuery({ companyId })}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteBranch: (companyId: string, branchId: string) =>
    request<void>(organizationBaseUrl, `/branches/${branchId}${toQuery({ companyId })}`, { method: "DELETE" }),
  updateBranchStatus: (branchId: string, status: string) =>
    request<BranchResponse>(organizationBaseUrl, `/branches/${branchId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  createDepartment: (body: DepartmentRequest) =>
    request<DepartmentResponse>(organizationBaseUrl, "/departments", { method: "POST", body: JSON.stringify(body) }),
  getDepartments: () => request<DepartmentResponse[]>(organizationBaseUrl, "/departments"),
  getDepartment: (departmentId: string) => request<DepartmentResponse>(organizationBaseUrl, `/departments/${departmentId}`),
  updateDepartment: (departmentId: string, body: DepartmentRequest) =>
    request<DepartmentResponse>(organizationBaseUrl, `/departments/${departmentId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteDepartment: (departmentId: string) =>
    request<void>(organizationBaseUrl, `/departments/${departmentId}`, { method: "DELETE" }),

  createPosition: (body: PositionRequest) =>
    request<PositionResponse>(organizationBaseUrl, "/positions", { method: "POST", body: JSON.stringify(body) }),
  getPositions: (params: { level?: string } = {}) =>
    request<PositionResponse[]>(organizationBaseUrl, `/positions${toQuery(params)}`),
  getPosition: (positionId: string) => request<PositionResponse>(organizationBaseUrl, `/positions/${positionId}`),
  updatePosition: (positionId: string, body: PositionRequest) =>
    request<PositionResponse>(organizationBaseUrl, `/positions/${positionId}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePosition: (positionId: string) => request<void>(organizationBaseUrl, `/positions/${positionId}`, { method: "DELETE" }),

  createEmployee: (body: EmployeeRequest) =>
    request<EmployeeResponse>(organizationBaseUrl, "/employees", { method: "POST", body: JSON.stringify(body) }),
  getEmployees: (params: { page?: number; size?: number } = {}) =>
    request<PageResponse<EmployeeResponse>>(
      organizationBaseUrl,
      `/employees${toQuery({ page: params.page ?? 1, size: params.size ?? 10 })}`,
    ),
  getEmployee: (employeeId: string) => request<EmployeeResponse>(organizationBaseUrl, `/employees/${employeeId}`),
  updateEmployee: (employeeId: string, body: EmployeeUpdateRequest) =>
    request<EmployeeResponse>(organizationBaseUrl, `/employees/${employeeId}`, { method: "PUT", body: JSON.stringify(body) }),
  updateEmployeeStatus: (employeeId: string, status: string) =>
    request<EmployeeResponse>(organizationBaseUrl, `/employees/${employeeId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  getEmployeesByBranch: (branchId: string) => request<EmployeeResponse[]>(organizationBaseUrl, `/employees/branch/${branchId}`),
  getEmployeesByDepartment: (departmentId: string) =>
    request<EmployeeResponse[]>(organizationBaseUrl, `/employees/department/${departmentId}`),
  getInternalEmployee: (employeeId: string) => request<EmployeeResponse>(organizationBaseUrl, `/internal/employees/${employeeId}`),
  countInternalEmployeesByBranch: (branchId: string) =>
    request<number>(organizationBaseUrl, `/internal/employees/branch/${branchId}/count`),
  getInternalEmployeesByBranch: (branchId: string) =>
    request<EmployeeResponse[]>(organizationBaseUrl, `/internal/employees/branch/${branchId}`),
};

export const schedulingApi = {
  createWorkAssignment: (body: WorkAssignmentRequest) =>
    request<WorkAssignmentResponse>(schedulingBaseUrl, "/work-assignments", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getWorkAssignments: (params: { shiftType?: string } = {}) =>
    request<WorkAssignmentResponse[]>(schedulingBaseUrl, `/work-assignments${toQuery(params)}`),
  getWorkAssignment: (workAssignmentId: string) =>
    request<WorkAssignmentResponse>(schedulingBaseUrl, `/work-assignments/${workAssignmentId}`),
  updateWorkAssignment: (workAssignmentId: string, body: WorkAssignmentRequest) =>
    request<WorkAssignmentResponse>(schedulingBaseUrl, `/work-assignments/${workAssignmentId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteWorkAssignment: (workAssignmentId: string) =>
    request<void>(schedulingBaseUrl, `/work-assignments/${workAssignmentId}`, { method: "DELETE" }),

  createShiftAssignment: (body: ShiftAssignmentRequest) =>
    request<ShiftAssignmentResponse>(schedulingBaseUrl, "/shift-assignments", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  createBulkShiftAssignments: (body: BulkShiftAssignmentRequest) =>
    request<ShiftAssignmentResponse[]>(schedulingBaseUrl, "/shift-assignments/bulk", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getShiftAssignments: (params: { employeeId: string; fromDate: string; toDate: string }) =>
    request<ShiftAssignmentResponse[]>(schedulingBaseUrl, `/shift-assignments${toQuery(params)}`),
  getShiftAssignmentsByBranchAndDate: (branchId: string, date: string) =>
    request<ShiftAssignmentResponse[]>(schedulingBaseUrl, `/shift-assignments/branch/${branchId}/date/${date}`),
  updateShiftAssignment: (shiftAssignmentId: string, body: ShiftAssignmentRequest) =>
    request<ShiftAssignmentResponse>(schedulingBaseUrl, `/shift-assignments/${shiftAssignmentId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteShiftAssignment: (shiftAssignmentId: string) =>
    request<void>(schedulingBaseUrl, `/shift-assignments/${shiftAssignmentId}`, { method: "DELETE" }),

  // Attendance API
  createAttendance: (body: AttendanceRequest) =>
    request<AttendanceResponse>(schedulingBaseUrl, "/attendance", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getAttendance: (employeeId: string, params: { fromDate: string; toDate: string } = { fromDate: "", toDate: "" }) =>
    request<AttendanceResponse[]>(
      schedulingBaseUrl,
      `/attendance${toQuery({ employeeId, ...params })}`,
    ),
  getAttendanceByDate: (date: string) =>
    request<AttendanceResponse[]>(schedulingBaseUrl, `/attendance/date/${date}`),
  checkIn: (employeeId: string, shiftAssignmentId: string, location: string) =>
    request<AttendanceResponse>(schedulingBaseUrl, `/attendance/check-in`, {
      method: "POST",
      body: JSON.stringify({ employeeId, shiftAssignmentId, location, method: "manual" }),
    }),
  checkOut: (attendanceId: string) =>
    request<AttendanceResponse>(schedulingBaseUrl, `/attendance/${attendanceId}/check-out`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
};

export const identityApi = {
  login: (body: AuthenticationRequest) =>
    request<AuthenticationResponse>(identityBaseUrl, "/auth/login", { method: "POST", body: JSON.stringify(body) }),
  introspect: (token: string) =>
    request<{ valid: boolean }>(identityBaseUrl, "/auth/introspect", { method: "POST", body: JSON.stringify({ token }) }),
  logout: (token: string) =>
    request<void>(identityBaseUrl, "/auth/logout", { method: "POST", body: JSON.stringify({ token }) }),
  refresh: (token: string) =>
    request<{ token: string }>(identityBaseUrl, "/auth/refresh", { method: "POST", body: JSON.stringify({ token }) }),
  registerUserAccount: (body: UserAccountCreationRequest) =>
    request<UserAccountCreationResponse>(identityBaseUrl, "/useraccounts/registration", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getUserAccounts: () => request<UserAccountCreationResponse[]>(identityBaseUrl, "/useraccounts"),
  updatePassword: (password: string) =>
    request<{ status: string }>(identityBaseUrl, "/useraccounts", { method: "PUT", body: JSON.stringify({ password }) }),
  getRoles: () => request<RoleResponse[]>(identityBaseUrl, "/roles"),
  createRole: (body: { name: string; description?: string; permissions?: string[] }) =>
    request<RoleResponse>(identityBaseUrl, "/roles", { method: "POST", body: JSON.stringify(body) }),
  getPermissions: () => request<PermissionResponse[]>(identityBaseUrl, "/permissions"),
  createPermission: (body: { name: string; description?: string }) =>
    request<PermissionResponse>(identityBaseUrl, "/permissions", { method: "POST", body: JSON.stringify(body) }),
};
