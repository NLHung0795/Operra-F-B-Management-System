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

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
      <div className="w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
    </div>
    <h1 className="text-2xl font-bold text-gray-900 italic">Tính năng đang phát triển</h1>
    <p className="text-gray-500 mt-2 max-w-xs">Module này đang trong quá trình tích hợp. Vui lòng quay lại sau.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      // HRM Routes
      { path: "employees", Component: Employees },
      { path: "attendance", Component: Attendance },
      { path: "shifts", Component: Shifts },
      { path: "leaves", Component: Leaves },
      { path: "payroll", Component: Payroll },
      
      // POS Routes
      { path: "pos", Component: POSScreen },
      { path: "cash-session", Component: CashSession },
      { path: "products", Component: Products },
      { path: "expenses", Component: Expenses },
      { path: "companies", Component: CompanyManagement },
      { path: "branches", Component: BranchManagement },
      { path: "invoices", Component: NotFound },
      
      { path: "settings", Component: NotFound },
      { path: "*", Component: NotFound },
    ],
  },
]);
