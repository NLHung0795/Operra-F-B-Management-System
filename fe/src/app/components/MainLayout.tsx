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
  MapPin
} from 'lucide-react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export type AppMode = 'hrm' | 'pos';

const sidebarItems = {
  hrm: [
    { icon: LayoutDashboard, label: 'Tổng quan HRM', path: '/' },
    { icon: Users, label: 'Nhân sự', path: '/employees' },
    { icon: CalendarCheck, label: 'Phân ca (Shift)', path: '/shifts' },
    { icon: Clock, label: 'Chấm công', path: '/attendance' },
    { icon: CalendarHeart, label: 'Nghỉ phép', path: '/leaves' },
    { icon: Wallet, label: 'Bảng lương', path: '/payroll' },
    { icon: Settings, label: 'Cài đặt', path: '/settings' },
  ],
  pos: [
    { icon: LayoutDashboard, label: 'Báo cáo Kinh doanh', path: '/' },
    { icon: ShoppingCart, label: 'Bán hàng (POS)', path: '/pos' },
    { icon: Briefcase, label: 'Ca bán hàng', path: '/cash-session' },
    { icon: Coffee, label: 'Thực đơn (Menu)', path: '/products' },
    { icon: FileText, label: 'Hóa đơn', path: '/invoices' },
    { icon: Building2, label: 'Công ty', path: '/companies' },
    { icon: MapPin, label: 'Chi nhánh', path: '/branches' },
    { icon: DollarSign, label: 'Thu chi (Expense)', path: '/expenses' },
    { icon: Settings, label: 'Cài đặt quán', path: '/settings' },
  ]
};

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mode, setMode] = useState<AppMode>('hrm');
  const navigate = useNavigate();
  const location = useLocation();

  const handleModeSwitch = (newMode: AppMode) => {
    setMode(newMode);
    const validPaths = sidebarItems[newMode].map(i => i.path);
    if (!validPaths.includes(location.pathname) && location.pathname !== '/') {
      navigate('/');
    }
  };

  const currentItems = sidebarItems[mode];

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
        ) : (
          <div className="p-4 border-b border-white/10 flex justify-center shrink-0 relative z-10">
            <button 
              onClick={() => handleModeSwitch(mode === 'hrm' ? 'pos' : 'hrm')}
              className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white"
              title={`Switch to ${mode === 'hrm' ? 'POS' : 'HRM'}`}
            >
              {mode === 'hrm' ? <CreditCard className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            </button>
          </div>
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
          <button className={cn(
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
                <p className="text-sm font-semibold text-[#3E2723] leading-tight">Admin / Quản lý</p>
                <p className="text-xs text-[#8D6E63]">Chi nhánh Quận 1</p>
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
        </main>
      </div>
    </div>
  );
}
