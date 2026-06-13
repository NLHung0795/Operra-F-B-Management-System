import React, { useMemo, useState } from "react";
import { KeyRound, Play, ShieldCheck, TableProperties } from "lucide-react";
import {
  BranchRequest,
  CompanyRequest,
  DepartmentRequest,
  EmployeeRequest,
  EmployeeUpdateRequest,
  PositionRequest,
  ShiftAssignmentRequest,
  WorkAssignmentRequest,
  identityApi,
  organizationApi,
  schedulingApi,
} from "../lib/api";

type Operation = {
  title: string;
  description: string;
  defaults: Record<string, unknown>;
  run: (params: Record<string, unknown>) => Promise<unknown>;
};

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" ? value : Number(value ?? fallback);
}

function parseJson(value: string) {
  return value.trim() ? JSON.parse(value) : {};
}

function ApiOperationCard({ operation }: { operation: Operation }) {
  const [body, setBody] = useState(() => JSON.stringify(operation.defaults, null, 2));
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const callOperation = async () => {
    setIsLoading(true);
    setResult("");

    try {
      const parsed = parseJson(body);
      const response = await operation.run(parsed);
      setResult(JSON.stringify(response ?? { ok: true }, null, 2));
    } catch (error) {
      setResult(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900">{operation.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{operation.description}</p>
        </div>
        <button
          onClick={callOperation}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-2 bg-[#5D4037] text-white rounded-lg text-sm font-semibold disabled:opacity-60"
        >
          <Play className="w-4 h-4" />
          {isLoading ? "Dang goi" : "Goi API"}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          spellCheck={false}
          className="min-h-56 p-4 text-sm font-mono bg-[#FAF9F6] border-0 border-r border-gray-100 outline-none resize-y"
        />
        <pre className="min-h-56 p-4 text-sm overflow-auto bg-gray-950 text-gray-100">
          {result || "// Ket qua se hien thi o day"}
        </pre>
      </div>
    </section>
  );
}

function ApiOperationsPage({
  title,
  description,
  icon: Icon,
  operations,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  operations: Operation[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#EFEBE9] flex items-center justify-center text-[#5D4037]">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {operations.map((operation) => (
          <ApiOperationCard key={operation.title} operation={operation} />
        ))}
      </div>
    </div>
  );
}

export function IdentityApiPage() {
  const operations = useMemo<Operation[]>(
    () => [
      {
        title: "Login",
        description: "POST /identity/auth/login",
        defaults: { username: "admin", password: "12345678" },
        run: async (params) => {
          const response = await identityApi.login({
            username: text(params.username),
            password: text(params.password),
          });
          if (response.token) {
            localStorage.setItem("accessToken", response.token);
          }
          return response;
        },
      },
      {
        title: "Introspect token",
        description: "POST /identity/auth/introspect",
        defaults: { token: "" },
        run: (params) => identityApi.introspect(text(params.token, localStorage.getItem("accessToken") ?? "")),
      },
      {
        title: "Refresh token",
        description: "POST /identity/auth/refresh",
        defaults: { token: "" },
        run: (params) => identityApi.refresh(text(params.token, localStorage.getItem("accessToken") ?? "")),
      },
      {
        title: "Logout",
        description: "POST /identity/auth/logout",
        defaults: { token: "" },
        run: async (params) => {
          const response = await identityApi.logout(text(params.token, localStorage.getItem("accessToken") ?? ""));
          localStorage.removeItem("accessToken");
          return response;
        },
      },
      {
        title: "Register user account",
        description: "POST /identity/useraccounts/registration",
        defaults: {
          username: "new.staff",
          password: "12345678",
          email: "staff@example.com",
          status: "ACTIVE",
          roles: ["USER"],
        },
        run: (params) => identityApi.registerUserAccount(params as any),
      },
      {
        title: "Get user accounts",
        description: "GET /identity/useraccounts",
        defaults: {},
        run: () => identityApi.getUserAccounts(),
      },
      {
        title: "Update password",
        description: "PUT /identity/useraccounts",
        defaults: { password: "new-password" },
        run: (params) => identityApi.updatePassword(text(params.password)),
      },
      {
        title: "Get roles",
        description: "GET /identity/roles",
        defaults: {},
        run: () => identityApi.getRoles(),
      },
      {
        title: "Create role",
        description: "POST /identity/roles",
        defaults: { name: "MANAGER", description: "Manager role", permissions: [] },
        run: (params) => identityApi.createRole(params as any),
      },
      {
        title: "Get permissions",
        description: "GET /identity/permissions",
        defaults: {},
        run: () => identityApi.getPermissions(),
      },
      {
        title: "Create permission",
        description: "POST /identity/permissions",
        defaults: { name: "employee:read", description: "Read employee data" },
        run: (params) => identityApi.createPermission(params as any),
      },
    ],
    [],
  );

  return <ApiOperationsPage title="Identity APIs" description="Auth, user account, role va permission endpoints." icon={KeyRound} operations={operations} />;
}

export function OrganizationApiPage() {
  const operations = useMemo<Operation[]>(
    () => [
      {
        title: "Create company",
        description: "POST /organization/companies",
        defaults: { name: "Operra F&B", taxCode: "0100000000" },
        run: (params) => organizationApi.createCompany(params as CompanyRequest),
      },
      { title: "Get companies", description: "GET /organization/companies", defaults: {}, run: () => organizationApi.getCompanies() },
      {
        title: "Get company",
        description: "GET /organization/companies/{companyId}",
        defaults: { companyId: "" },
        run: (params) => organizationApi.getCompany(text(params.companyId)),
      },
      {
        title: "Update company",
        description: "PUT /organization/companies/{companyId}",
        defaults: { companyId: "", name: "Operra Updated", taxCode: "0100000001" },
        run: (params) => organizationApi.updateCompany(text(params.companyId), params as CompanyRequest),
      },
      {
        title: "Delete company",
        description: "DELETE /organization/companies/{companyId}",
        defaults: { companyId: "" },
        run: (params) => organizationApi.deleteCompany(text(params.companyId)),
      },
      {
        title: "Create branch",
        description: "POST /organization/branches?companyId=",
        defaults: { companyId: "", name: "Branch 1", address: "Address", phone: "0900000000", status: "ACTIVE" },
        run: (params) => organizationApi.createBranch(text(params.companyId), params as BranchRequest),
      },
      {
        title: "Get branches",
        description: "GET /organization/branches?companyId=&status=",
        defaults: { companyId: "", status: "" },
        run: (params) => organizationApi.getBranches({ companyId: text(params.companyId), status: text(params.status) }),
      },
      {
        title: "Get branch",
        description: "GET /organization/branches/{branchId}?companyId=",
        defaults: { companyId: "", branchId: "" },
        run: (params) => organizationApi.getBranch(text(params.companyId), text(params.branchId)),
      },
      {
        title: "Update branch",
        description: "PUT /organization/branches/{branchId}?companyId=",
        defaults: { companyId: "", branchId: "", name: "Branch Updated", address: "Address", phone: "0900000000", status: "ACTIVE" },
        run: (params) => organizationApi.updateBranch(text(params.companyId), text(params.branchId), params as BranchRequest),
      },
      {
        title: "Delete branch",
        description: "DELETE /organization/branches/{branchId}?companyId=",
        defaults: { companyId: "", branchId: "" },
        run: (params) => organizationApi.deleteBranch(text(params.companyId), text(params.branchId)),
      },
      {
        title: "Update branch status",
        description: "PUT /organization/branches/{branchId}/status",
        defaults: { branchId: "", status: "ACTIVE" },
        run: (params) => organizationApi.updateBranchStatus(text(params.branchId), text(params.status)),
      },
      {
        title: "Create department",
        description: "POST /organization/departments",
        defaults: { name: "Operations", description: "Store operations" },
        run: (params) => organizationApi.createDepartment(params as DepartmentRequest),
      },
      { title: "Get departments", description: "GET /organization/departments", defaults: {}, run: () => organizationApi.getDepartments() },
      {
        title: "Get department",
        description: "GET /organization/departments/{departmentId}",
        defaults: { departmentId: "" },
        run: (params) => organizationApi.getDepartment(text(params.departmentId)),
      },
      {
        title: "Update department",
        description: "PUT /organization/departments/{departmentId}",
        defaults: { departmentId: "", name: "Operations", description: "Updated" },
        run: (params) => organizationApi.updateDepartment(text(params.departmentId), params as DepartmentRequest),
      },
      {
        title: "Delete department",
        description: "DELETE /organization/departments/{departmentId}",
        defaults: { departmentId: "" },
        run: (params) => organizationApi.deleteDepartment(text(params.departmentId)),
      },
      {
        title: "Create position",
        description: "POST /organization/positions",
        defaults: { name: "Cashier", description: "Cashier", level: "STAFF", baseSalary: 5000000 },
        run: (params) => organizationApi.createPosition(params as PositionRequest),
      },
      {
        title: "Get positions",
        description: "GET /organization/positions?level=",
        defaults: { level: "" },
        run: (params) => organizationApi.getPositions({ level: text(params.level) }),
      },
      {
        title: "Get position",
        description: "GET /organization/positions/{positionId}",
        defaults: { positionId: "" },
        run: (params) => organizationApi.getPosition(text(params.positionId)),
      },
      {
        title: "Update position",
        description: "PUT /organization/positions/{positionId}",
        defaults: { positionId: "", name: "Cashier", description: "Updated", level: "STAFF", baseSalary: 5000000 },
        run: (params) => organizationApi.updatePosition(text(params.positionId), params as PositionRequest),
      },
      {
        title: "Delete position",
        description: "DELETE /organization/positions/{positionId}",
        defaults: { positionId: "" },
        run: (params) => organizationApi.deletePosition(text(params.positionId)),
      },
      {
        title: "Create employee",
        description: "POST /organization/employees",
        defaults: {
          departmentName: "Operations",
          positionName: "Cashier",
          branchId: "",
          fullname: "New Employee",
          phoneNumber: "0900000000",
          status: "ACTIVE",
          username: "new.employee",
          email: "employee@example.com",
          roles: ["USER"],
        },
        run: (params) => organizationApi.createEmployee(params as EmployeeRequest),
      },
      {
        title: "Get employees",
        description: "GET /organization/employees?page=&size=",
        defaults: { page: 1, size: 10 },
        run: (params) => organizationApi.getEmployees({ page: numberValue(params.page, 1), size: numberValue(params.size, 10) }),
      },
      {
        title: "Get employee",
        description: "GET /organization/employees/{employeeId}",
        defaults: { employeeId: "" },
        run: (params) => organizationApi.getEmployee(text(params.employeeId)),
      },
      {
        title: "Update employee",
        description: "PUT /organization/employees/{employeeId}",
        defaults: { employeeId: "", departmentName: "Operations", positionName: "Cashier", branchId: "", fullname: "Employee Updated", status: "ACTIVE" },
        run: (params) => organizationApi.updateEmployee(text(params.employeeId), params as EmployeeUpdateRequest),
      },
      {
        title: "Update employee status",
        description: "PUT /organization/employees/{employeeId}/status",
        defaults: { employeeId: "", status: "ACTIVE" },
        run: (params) => organizationApi.updateEmployeeStatus(text(params.employeeId), text(params.status)),
      },
      {
        title: "Get employees by branch",
        description: "GET /organization/employees/branch/{branchId}",
        defaults: { branchId: "" },
        run: (params) => organizationApi.getEmployeesByBranch(text(params.branchId)),
      },
      {
        title: "Get employees by department",
        description: "GET /organization/employees/department/{departmentId}",
        defaults: { departmentId: "" },
        run: (params) => organizationApi.getEmployeesByDepartment(text(params.departmentId)),
      },
      {
        title: "Internal get employee",
        description: "GET /organization/internal/employees/{employeeId}",
        defaults: { employeeId: "" },
        run: (params) => organizationApi.getInternalEmployee(text(params.employeeId)),
      },
      {
        title: "Internal count employees by branch",
        description: "GET /organization/internal/employees/branch/{branchId}/count",
        defaults: { branchId: "" },
        run: (params) => organizationApi.countInternalEmployeesByBranch(text(params.branchId)),
      },
      {
        title: "Internal employees by branch",
        description: "GET /organization/internal/employees/branch/{branchId}",
        defaults: { branchId: "" },
        run: (params) => organizationApi.getInternalEmployeesByBranch(text(params.branchId)),
      },
    ],
    [],
  );

  return <ApiOperationsPage title="Organization APIs" description="Company, branch, department, position va employee endpoints." icon={ShieldCheck} operations={operations} />;
}

export function SchedulingApiPage() {
  const operations = useMemo<Operation[]>(
    () => [
      {
        title: "Create work assignment",
        description: "POST /scheduling/work-assignments",
        defaults: { name: "Morning shift", startTime: "08:00:00", endTime: "16:00:00", breakTime: 60, shiftType: "MORNING" },
        run: (params) => schedulingApi.createWorkAssignment(params as WorkAssignmentRequest),
      },
      {
        title: "Get work assignments",
        description: "GET /scheduling/work-assignments?shiftType=",
        defaults: { shiftType: "" },
        run: (params) => schedulingApi.getWorkAssignments({ shiftType: text(params.shiftType) }),
      },
      {
        title: "Get work assignment",
        description: "GET /scheduling/work-assignments/{workAssignmentId}",
        defaults: { workAssignmentId: "" },
        run: (params) => schedulingApi.getWorkAssignment(text(params.workAssignmentId)),
      },
      {
        title: "Update work assignment",
        description: "PUT /scheduling/work-assignments/{workAssignmentId}",
        defaults: { workAssignmentId: "", name: "Morning shift", startTime: "08:00:00", endTime: "16:00:00", breakTime: 60, shiftType: "MORNING" },
        run: (params) => schedulingApi.updateWorkAssignment(text(params.workAssignmentId), params as WorkAssignmentRequest),
      },
      {
        title: "Delete work assignment",
        description: "DELETE /scheduling/work-assignments/{workAssignmentId}",
        defaults: { workAssignmentId: "" },
        run: (params) => schedulingApi.deleteWorkAssignment(text(params.workAssignmentId)),
      },
      {
        title: "Create shift assignment",
        description: "POST /scheduling/shift-assignments",
        defaults: { employeeId: "", workAssignmentId: "", assignedBy: "", date: "2026-06-13" },
        run: (params) => schedulingApi.createShiftAssignment(params as ShiftAssignmentRequest),
      },
      {
        title: "Create bulk shift assignments",
        description: "POST /scheduling/shift-assignments/bulk",
        defaults: { assignedBy: "", assignments: [{ employeeId: "", workAssignmentId: "", date: "2026-06-13" }] },
        run: (params) => schedulingApi.createBulkShiftAssignments(params as any),
      },
      {
        title: "Query shifts by employee and date range",
        description: "GET /scheduling/shift-assignments?employeeId=&fromDate=&toDate=",
        defaults: { employeeId: "", fromDate: "2026-06-13", toDate: "2026-06-20" },
        run: (params) =>
          schedulingApi.getShiftAssignments({
            employeeId: text(params.employeeId),
            fromDate: text(params.fromDate),
            toDate: text(params.toDate),
          }),
      },
      {
        title: "Query shifts by branch and date",
        description: "GET /scheduling/shift-assignments/branch/{branchId}/date/{date}",
        defaults: { branchId: "", date: "2026-06-13" },
        run: (params) => schedulingApi.getShiftAssignmentsByBranchAndDate(text(params.branchId), text(params.date)),
      },
      {
        title: "Update shift assignment",
        description: "PUT /scheduling/shift-assignments/{shiftAssignmentId}",
        defaults: { shiftAssignmentId: "", employeeId: "", workAssignmentId: "", assignedBy: "", date: "2026-06-13" },
        run: (params) => schedulingApi.updateShiftAssignment(text(params.shiftAssignmentId), params as ShiftAssignmentRequest),
      },
      {
        title: "Delete shift assignment",
        description: "DELETE /scheduling/shift-assignments/{shiftAssignmentId}",
        defaults: { shiftAssignmentId: "" },
        run: (params) => schedulingApi.deleteShiftAssignment(text(params.shiftAssignmentId)),
      },
    ],
    [],
  );

  return <ApiOperationsPage title="Scheduling APIs" description="Work assignment va shift assignment endpoints." icon={TableProperties} operations={operations} />;
}
