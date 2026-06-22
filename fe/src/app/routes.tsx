import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Employees } from "./pages/Employees";
import { Attendance } from "./pages/Attendance";
import { Payroll } from "./pages/Payroll";
import { Shifts } from "./pages/Shifts";
import { Leaves } from "./pages/Leaves";
import { POSScreen } from "./pages/POSScreen";
import { CashSession } from "./pages/CashSession";
import { Products } from "./pages/Products";
import { Expenses } from "./pages/Expenses";
import { CompanyManagement } from "./pages/CompanyManagement";
import { BranchManagement } from "./pages/BranchManagement";
import { Invoices } from "./pages/Invoices";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { ChangePassword } from "./pages/ChangePassword";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { HasPermission } from "./components/HasPermission";
import { Forbidden } from "./components/Forbidden";
import { hasPermission, hasRole } from "./lib/auth";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
      <div className="w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
    </div>
    <h1 className="text-2xl font-bold text-gray-900 italic">Tính năng đang phát triển</h1>
    <p className="text-gray-500 mt-2 max-w-xs">Module này đang trong quá trình tích hợp. Vui lòng quay lại sau.</p>
  </div>
);

function AttendanceRouteGuard() {
  const isAllowed = hasPermission("VIEW_ATTENDANCE") || hasPermission("ATTENDANCE_CHECK");
  return isAllowed ? <Attendance /> : <Forbidden />;
}

function BranchRouteGuard() {
  const isAllowed = hasPermission("MANAGE_BRANCH") || hasRole("MANAGER");
  return isAllowed ? <BranchManagement /> : <Forbidden />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoute element={<Login />} />,
  },
  {
    path: "/change-password",
    element: <ProtectedRoute element={<ChangePassword />} />,
  },
  {
    path: "/",
    element: <ProtectedRoute element={<MainLayout />} />,
    children: [
      { index: true, Component: Dashboard },
      // HRM Routes
      {
        path: "employees",
        element: (
          <HasPermission permission="VIEW_EMPLOYEE" fallback={<Forbidden />}>
            <Employees />
          </HasPermission>
        ),
      },
      {
        path: "attendance",
        element: <AttendanceRouteGuard />,
      },
      {
        path: "shifts",
        element: (
          <HasPermission permission="VIEW_SHIFT_ASSIGNMENT" fallback={<Forbidden />}>
            <Shifts />
          </HasPermission>
        ),
      },
      {
        path: "leaves",
        element: (
          <HasPermission permission="VIEW_LEAVE_REQUEST" fallback={<Forbidden />}>
            <Leaves />
          </HasPermission>
        ),
      },
      {
        path: "payroll",
        element: (
          <HasPermission permission="VIEW_PERSONAL_PAYROLL" fallback={<Forbidden />}>
            <Payroll />
          </HasPermission>
        ),
      },
      
      // POS Routes
      {
        path: "pos",
        element: (
          <HasPermission permission="CREATE_ORDER" fallback={<Forbidden />}>
            <POSScreen />
          </HasPermission>
        ),
      },
      {
        path: "cash-session",
        element: (
          <HasPermission permission="VIEW_CASH_SESSION" fallback={<Forbidden />}>
            <CashSession />
          </HasPermission>
        ),
      },
      {
        path: "products",
        element: (
          <HasPermission permission="MANAGE_PRODUCT" fallback={<Forbidden />}>
            <Products />
          </HasPermission>
        ),
      },
      {
        path: "expenses",
        element: (
          <HasPermission permission="VIEW_EXPENSE" fallback={<Forbidden />}>
            <Expenses />
          </HasPermission>
        ),
      },
      {
        path: "companies",
        element: (
          <HasPermission permission="MANAGE_COMPANY" fallback={<Forbidden />}>
            <CompanyManagement />
          </HasPermission>
        ),
      },
      {
        path: "branches",
        element: <BranchRouteGuard />,
      },
      {
        path: "invoices",
        element: (
          <HasPermission permission="VIEW_ORDER" fallback={<Forbidden />}>
            <Invoices />
          </HasPermission>
        ),
      },
      
      {
        path: "settings",
        element: (
          <HasPermission permission="CREATE_ROLE" fallback={<Forbidden />}>
            <Settings />
          </HasPermission>
        ),
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
