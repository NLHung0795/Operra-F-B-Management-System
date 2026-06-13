import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Wallet, 
  CalendarCheck, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  Bell,
  Search,
  ShoppingCart,
  Coffee,
  CreditCard,
  Building2,
  Briefcase,
  CalendarHeart,
  FileText,
  DollarSign,
  MapPin,
  PlugZap
} from 'lucide-react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { identityApi } from '../lib/api';
import { Toaster } from './ui/sonner';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export type AppMode = 'hrm' | 'pos';

interface SidebarItem {
  icon: any;
  label: string;
  path: string;
  roles?: string[];
}

const sidebarItems: Record<AppMode, SidebarItem[]> = {
  hrm: [
    { icon: LayoutDashboard, label: 'Tổng quan HRM', path: '/' },
    { icon: Users, label: 'Nhân sự', path: '/employees', roles: ['ADMIN', 'MANAGER'] },
    { icon: CalendarCheck, label: 'Phân ca (Shift)', path: '/shifts', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { icon: Clock, label: 'Chấm công', path: '/attendance', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { icon: CalendarHeart, label: 'Nghỉ phép', path: '/leaves', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { icon: Wallet, label: 'Bảng lương', path: '/payroll', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { icon: Settings, label: 'Cài đặt', path: '/settings', roles: ['ADMIN'] },
  ],
  pos: [
    { icon: LayoutDashboard, label: 'Báo cáo Kinh doanh', path: '/', roles: ['ADMIN', 'MANAGER'] },
    { icon: ShoppingCart, label: 'Bán hàng (POS)', path: '/pos', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { icon: Briefcase, label: 'Ca bán hàng', path: '/cash-session', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { icon: Coffee, label: 'Thực đơn (Menu)', path: '/products', roles: ['ADMIN', 'MANAGER'] },
    { icon: FileText, label: 'Hóa đơn', path: '/invoices', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { icon: Building2, label: 'Công ty', path: '/companies', roles: ['ADMIN'] },
    { icon: MapPin, label: 'Chi nhánh', path: '/branches', roles: ['ADMIN'] },
    { icon: DollarSign, label: 'Thu chi (Expense)', path: '/expenses', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { icon: Settings, label: 'Cài đặt quán', path: '/settings', roles: ['ADMIN'] },
  ]
};

const getAuthData = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  if (!token) return { username: "Guest", roles: [] as string[], permissions: [] as string[] };
  
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
    
    const roles = authorities
      .filter(a => a.startsWith("ROLE_"))
      .map(r => r.replace("ROLE_", ""));
    const permissions = authorities.filter(a => !a.startsWith("ROLE_"));
    
    return {
      username: payload.sub || "User",
      roles,
      permissions
    };
  } catch (e) {
    return { username: "Guest", roles: [] as string[], permissions: [] as string[] };
  }
};

const getRoleLabel = (roles: string[]) => {
  if (roles.includes("ADMIN")) return "Quản trị viên";
  if (roles.includes("MANAGER")) return "Quản lý";
  if (roles.includes("CASHIER")) return "Thu ngân";
  if (roles.includes("EMPLOYEE")) return "Nhân viên";
  return "Nhân viên";
};

export function MainLayout() {
  const isMock = import.meta.env.VITE_USE_MOCK_DATA === "true";
  const auth = getAuthData();
  const userRoles = auth.roles.length > 0 ? auth.roles : (isMock ? ['ADMIN'] : ['EMPLOYEE']);
  
  const canAccessHrm = userRoles.includes("ADMIN") || userRoles.includes("MANAGER") || userRoles.includes("EMPLOYEE");
  const canAccessPos = userRoles.includes("ADMIN") || userRoles.includes("MANAGER") || userRoles.includes("CASHIER");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mode, setMode] = useState<AppMode>(() => {
    if (canAccessHrm) return 'hrm';
    if (canAccessPos) return 'pos';
    return 'hrm';
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleModeSwitch = (newMode: AppMode) => {
    setMode(newMode);
    const validPaths = sidebarItems[newMode].map(i => i.path);
    if (!validPaths.includes(location.pathname) && location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
      if (token) {
        await identityApi.logout(token);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      navigate('/login', { replace: true });
    }
  };

  const currentItems = sidebarItems[mode].filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => userRoles.includes(role));
  });

  return (
    <div className="flex h-screen bg-[#FAF9F6] text-[#2C1810]">
      <aside 
        className={cn(
          "bg-[#3E2723] text-[#FAF9F6] flex flex-col transition-all duration-300 ease-in-out shrink-0 relative overflow-hidden",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Subtle Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,138.7C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0 relative z-10">
          <div className="w-8 h-8 bg-[#D7CCC8] rounded-lg flex items-center justify-center shrink-0">
            <div className="w-4 h-4 bg-[#3E2723] rounded-full" />
          </div>
          {isSidebarOpen && <span className="ml-3 font-bold text-xl tracking-tight text-white">FABiBox+</span>}
        </div>

        {isSidebarOpen ? (
          (canAccessHrm && canAccessPos) && (
            <div className="p-4 border-b border-white/10 shrink-0 relative z-10">
              <div className="bg-white/10 p-1 rounded-xl flex items-center relative">
                <div 
                  className={cn(
                    "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#FAF9F6] rounded-lg shadow-sm transition-all duration-300",
                    mode === 'hrm' ? "left-1" : "left-[calc(50%+2px)]"
                  )}
                />
                <button 
                  onClick={() => handleModeSwitch('hrm')}
                  className={cn(
                    "relative flex-1 py-1.5 px-2 text-sm font-semibold rounded-lg transition-colors z-10",
                    mode === 'hrm' ? "text-[#3E2723]" : "text-white/80 hover:text-white"
                  )}
                >
                  iPOS HRM
                </button>
                <button 
                  onClick={() => handleModeSwitch('pos')}
                  className={cn(
                    "relative flex-1 py-1.5 px-2 text-sm font-semibold rounded-lg transition-colors z-10",
                    mode === 'pos' ? "text-[#3E2723]" : "text-white/80 hover:text-white"
                  )}
                >
                  POS & Sales
                </button>
              </div>
            </div>
          )
        ) : (
          (canAccessHrm && canAccessPos) && (
            <div className="p-4 border-b border-white/10 flex justify-center shrink-0 relative z-10">
              <button 
                onClick={() => handleModeSwitch(mode === 'hrm' ? 'pos' : 'hrm')}
                className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white"
                title={`Switch to ${mode === 'hrm' ? 'POS' : 'HRM'}`}
              >
                {mode === 'hrm' ? <CreditCard className="w-5 h-5" /> : <Users className="w-5 h-5" />}
              </button>
            </div>
          )
        )}

        <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto relative z-10">
          {currentItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-[#FAF9F6] text-[#3E2723] shadow-sm font-semibold" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0 relative z-10">
          <button 
            onClick={handleLogout}
            className={cn(
            "flex items-center w-full px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-xl transition-all"
          )}>
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="ml-3">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-[#EFEBE9] flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#FAF9F6] rounded-lg text-[#5D4037]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]" />
              <input 
                type="text" 
                placeholder={mode === 'hrm' ? "Tìm nhân viên, ca làm..." : "Tìm món, hóa đơn..."} 
                className="pl-10 pr-4 py-2 bg-[#FAF9F6] border border-[#EFEBE9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8D6E63]/20 w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {mode === 'pos' && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#EFEBE9] border border-[#D7CCC8] rounded-lg text-[#5D4037] text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-[#8D6E63] animate-pulse" />
                Ca: Sáng (Đang mở)
              </div>
            )}
            <button className="p-2 hover:bg-[#FAF9F6] rounded-full text-[#5D4037] relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#8D6E63] rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-[#EFEBE9]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#3E2723] leading-tight">
                  {localStorage.getItem('username') || auth.username || 'Nhân viên'}
                </p>
                <p className="text-xs text-[#8D6E63]">{getRoleLabel(userRoles)}</p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1758129090913-b1c6953d47d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGJ1c2luZXNzJTIwcGVyc29uJTIwcHJvZmlsZXxlbnwxfHx8fDE3NzU0NjQzNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                alt="Avatar" 
                className="w-10 h-10 rounded-full object-cover border-2 border-[#D7CCC8]"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#FAF9F6] p-6">
          <Outlet context={{ mode }} />
          <Toaster />
        </main>
      </div>
    </div>
  );
}
