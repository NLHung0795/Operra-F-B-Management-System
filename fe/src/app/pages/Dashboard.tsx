import React from 'react';
import { 
  Users, 
  Clock, 
  Download, 
  Briefcase, 
  CalendarCheck,
  FileText,
  DollarSign,
  ChevronRight,
  TrendingUp,
  Award,
  ShoppingCart,
  Banknote,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { useOutletContext } from 'react-router';
import type { AppMode } from '../components/MainLayout';

const attendanceData = [
  { day: 'Th 2', attendance: 85, late: 12 },
  { day: 'Th 3', attendance: 88, late: 8 },
  { day: 'Th 4', attendance: 75, late: 20 },
  { day: 'Th 5', attendance: 92, late: 5 },
  { day: 'Th 6', attendance: 90, late: 7 },
  { day: 'Th 7', attendance: 82, late: 15 },
  { day: 'CN', attendance: 95, late: 3 },
];

const revenueData = [
  { time: '08:00', amount: 2.5 },
  { time: '10:00', amount: 5.2 },
  { time: '12:00', amount: 12.8 },
  { time: '14:00', amount: 8.5 },
  { time: '16:00', amount: 6.1 },
  { time: '18:00', amount: 15.4 },
  { time: '20:00', amount: 22.5 },
  { time: '22:00', amount: 10.2 },
];

export function Dashboard() {
  const { mode } = useOutletContext<{ mode: AppMode }>();

  const isHrm = mode === 'hrm';

  const statsHrm = [
    { label: 'Tổng nhân sự', value: '154', change: '+12%', icon: Users, color: 'text-[#5D4037]', bg: 'bg-[#EFEBE9]' },
    { label: 'Chấm công hôm nay', value: '142', change: '92%', icon: Clock, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Ca làm đang chạy', value: '24', change: 'Đủ người', icon: CalendarCheck, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Quỹ lương dự kiến', value: '452M', change: '+5%', icon: DollarSign, color: 'text-stone-700', bg: 'bg-stone-50' },
  ];

  const statsPos = [
    { label: 'Doanh thu hôm nay', value: '18.5M', change: '+15%', icon: Banknote, color: 'text-[#5D4037]', bg: 'bg-[#EFEBE9]' },
    { label: 'Số đơn hàng', value: '142', change: '+20', icon: ShoppingCart, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Giá trị trung bình', value: '130k', change: '+5k', icon: TrendingUp, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Lợi nhuận gộp', value: '6.2M', change: '+12%', icon: Target, color: 'text-stone-700', bg: 'bg-stone-50' },
  ];

  const activities = isHrm ? [
    { id: 1, type: 'attendance', user: 'Nguyễn Văn An (Pha chế)', action: 'Check-in trễ 15 phút', time: '08:15 AM', status: 'warning' },
    { id: 2, type: 'shift', user: 'Trần Thị Bình (Phục vụ)', action: 'Đổi ca thành công', time: '09:30 AM', status: 'success' },
    { id: 3, type: 'leave', user: 'Lê Minh (Bếp chính)', action: 'Tạo đơn xin nghỉ phép', time: '11:20 AM', status: 'pending' },
    { id: 4, type: 'payroll', user: 'Kế toán', action: 'Chốt bảng công tháng 4', time: '14:45 PM', status: 'info' },
  ] : [
    { id: 1, type: 'sale', user: 'Thu ngân 1', action: 'Thanh toán đơn #1045 (350k)', time: '18:20 PM', status: 'success' },
    { id: 2, type: 'session', user: 'Quản lý', action: 'Mở ca Tối (Tiền két: 2M)', time: '17:30 PM', status: 'info' },
    { id: 3, type: 'expense', user: 'Thu ngân 1', action: 'Chi mua đá viên (-50k)', time: '15:10 PM', status: 'warning' },
    { id: 4, type: 'sale', user: 'Phục vụ bàn', action: 'Khách bàn 12 gọi thêm món', time: '14:05 PM', status: 'success' },
  ];

  const stats = isHrm ? statsHrm : statsPos;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isHrm ? 'Tổng quan Nhân sự (HRM)' : 'Báo cáo Kinh doanh (POS)'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isHrm ? 'Quản lý nhân viên, ca làm và chấm công.' : 'Theo dõi doanh thu, đơn hàng và ca bán.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Hệ thống: Online
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] rounded-xl text-white text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm shadow-blue-200">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.change.startsWith('+') || stat.change.startsWith('Đ') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {isHrm ? 'Phân tích Chấm công' : 'Biểu đồ Doanh thu Hôm nay'}
              </h3>
              <p className="text-xs text-gray-500">
                {isHrm ? 'Thống kê 7 ngày gần nhất' : 'Theo khung giờ'}
              </p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100">
              <option>Hôm nay</option>
              <option>Tuần này</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {isHrm ? (
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="attendance" name="Đúng giờ" fill="#5D4037" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late" name="Đi muộn" fill="#D7CCC8" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} formatter={(val) => `${val}M`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  <Line type="monotone" dataKey="amount" name="Doanh thu (Tr)" stroke="#5D4037" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#5D4037' }} activeDot={{ r: 6 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Hoạt động gần đây
            </h3>
            <button className="text-[#007AFF] text-xs font-semibold hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-50 rounded-xl hover:bg-gray-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.status === 'warning' ? "bg-amber-50 text-amber-600" :
                    activity.status === 'success' ? "bg-emerald-50 text-emerald-600" :
                    activity.status === 'info' ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-600"
                  }`}>
                    {activity.type === 'attendance' && <Clock className="w-5 h-5" />}
                    {activity.type === 'sale' && <Banknote className="w-5 h-5" />}
                    {activity.type === 'session' && <Briefcase className="w-5 h-5" />}
                    {activity.type === 'expense' && <DollarSign className="w-5 h-5" />}
                    {activity.type === 'leave' && <CalendarCheck className="w-5 h-5" />}
                    {activity.type === 'shift' && <Users className="w-5 h-5" />}
                    {activity.type === 'payroll' && <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-[#007AFF] transition-colors">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.user} • {activity.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
