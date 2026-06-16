import React, { useState, useEffect } from 'react';
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
  Target,
  CheckCircle2
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
import { schedulingApi, organizationApi } from '../lib/api';
import { toast } from 'sonner';
import { getAuthData } from '../lib/auth';

const getLoggedInUserAccountId = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
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
    return payload.sub || null;
  } catch (e) {
    return null;
  }
};

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
  const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const auth = getAuthData();
  const isAdmin = auth.roles.includes('ADMIN');

  const isHrm = mode === 'hrm';

  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [todayShift, setTodayShift] = useState<any | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<any | null>(null);
  const [summary, setSummary] = useState<any | null>(null);
  const [loadingTimecard, setLoadingTimecard] = useState(false);
  const [timecardNonce, setTimecardNonce] = useState(0);

  useEffect(() => {
    const fetchTimecardData = async () => {
      setLoadingTimecard(true);
      try {
        let empId = localStorage.getItem('employeeId');

        if (useMock) {
          empId = getLoggedInUserAccountId();
        } else if (!empId) {
          try {
            const emp = await organizationApi.getEmployeesMe();
            if (emp && emp.id) {
              empId = emp.id;
              localStorage.setItem('employeeId', empId);
            }
          } catch (err) {
            console.error("Failed to fetch current employee profile:", err);
          }
        }

        setEmployeeId(empId);

        if (!empId) {
          setLoadingTimecard(false);
          return;
        }

        if (useMock) {
          setLoadingTimecard(false);
          return;
        }

        const todayStr = new Date().toISOString().slice(0, 10);
        
        // 1. Get today's shift assignments
        const shifts = await schedulingApi.getShiftAssignments({
          employeeId: empId,
          fromDate: todayStr,
          toDate: todayStr
        });
        
        const activeShift = shifts && shifts.length > 0 ? shifts[0] : null;
        setTodayShift(activeShift);

        // 2. Get this month's attendance
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const attendanceList = await schedulingApi.getAttendance(empId, currentMonth, currentYear);
        const todayRecord = (attendanceList || []).find(att => {
          if (!att.checkInTime) return false;
          const checkInDate = new Date(att.checkInTime).toISOString().slice(0, 10);
          return checkInDate === todayStr;
        });
        setTodayAttendance(todayRecord || null);

        // 3. Get monthly summary
        const summaryData = await schedulingApi.getAttendanceSummary(empId, currentMonth, currentYear);
        setSummary(summaryData);
      } catch (err) {
        console.error("Failed to load timecard data:", err);
      } finally {
        setLoadingTimecard(false);
      }
    };

    fetchTimecardData();
  }, [useMock, timecardNonce]);

  const handleCheckIn = async () => {
    if (useMock) {
      const mockRecord = {
        id: "att_mock_" + Date.now(),
        checkInTime: new Date().toISOString(),
        status: "CHECK_IN_ON_TIME",
        location: "Văn phòng"
      };
      setTodayAttendance(mockRecord);
      toast.success("Check-in thành công (Giả lập)!");
      return;
    }

    if (!employeeId || !todayShift) {
      toast.error("Không tìm thấy ca làm việc của bạn hôm nay");
      return;
    }

    try {
      const res = await schedulingApi.checkIn(employeeId, todayShift.id, "Văn phòng");
      toast.success("Check-in thành công!");
      setTodayAttendance(res);
      setTimecardNonce(n => n + 1);
    } catch (err: any) {
      toast.error("Check-in thất bại: " + err.message);
    }
  };

  const handleCheckOut = async () => {
    if (useMock) {
      setTodayAttendance((prev: any) => ({
        ...prev,
        checkOutTime: new Date().toISOString()
      }));
      toast.success("Check-out thành công (Giả lập)!");
      return;
    }

    if (!employeeId || !todayShift) {
      toast.error("Không tìm thấy ca làm việc hôm nay");
      return;
    }

    try {
      const res = await schedulingApi.checkOut(employeeId, todayShift.id, "Văn phòng");
      toast.success("Check-out thành công!");
      setTodayAttendance(res);
      setTimecardNonce(n => n + 1);
    } catch (err: any) {
      toast.error("Check-out thất bại: " + err.message);
    }
  };

  const statsHrm = [
    { label: 'Tổng nhân sự', value: useMock ? '154' : '0', change: useMock ? '+12%' : '0%', icon: Users, color: 'text-[#5D4037]', bg: 'bg-[#EFEBE9]' },
    { label: 'Chấm công hôm nay', value: useMock ? '142' : '0', change: useMock ? '92%' : '0%', icon: Clock, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Ca làm đang chạy', value: useMock ? '24' : '0', change: useMock ? 'Đủ người' : 'Không có', icon: CalendarCheck, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Quỹ lương dự kiến', value: useMock ? '452M' : '0đ', change: useMock ? '+5%' : '0%', icon: DollarSign, color: 'text-stone-700', bg: 'bg-stone-50' },
  ];

  const statsPos = [
    { label: 'Doanh thu hôm nay', value: useMock ? '18.5M' : '0đ', change: useMock ? '+15%' : '0%', icon: Banknote, color: 'text-[#5D4037]', bg: 'bg-[#EFEBE9]' },
    { label: 'Số đơn hàng', value: useMock ? '142' : '0', change: useMock ? '+20' : '0', icon: ShoppingCart, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Giá trị trung bình', value: useMock ? '130k' : '0đ', change: useMock ? '+5k' : '0đ', icon: TrendingUp, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Lợi nhuận gộp', value: useMock ? '6.2M' : '0đ', change: useMock ? '+12%' : '0%', icon: Target, color: 'text-stone-700', bg: 'bg-stone-50' },
  ];

  const activitiesList = useMock 
    ? (isHrm ? [
        { id: 1, type: 'attendance', user: 'Nguyễn Văn An (Pha chế)', action: 'Check-in trễ 15 phút', time: '08:15 AM', status: 'warning' },
        { id: 2, type: 'shift', user: 'Trần Thị Bình (Phục vụ)', action: 'Đổi ca thành công', time: '09:30 AM', status: 'success' },
        { id: 3, type: 'leave', user: 'Lê Minh (Bếp chính)', action: 'Tạo đơn xin nghỉ phép', time: '11:20 AM', status: 'pending' },
        { id: 4, type: 'payroll', user: 'Kế toán', action: 'Chốt bảng công tháng 4', time: '14:45 PM', status: 'info' },
      ] : [
        { id: 1, type: 'sale', user: 'Thu ngân 1', action: 'Thanh toán đơn #1045 (350k)', time: '18:20 PM', status: 'success' },
        { id: 2, type: 'session', user: 'Quản lý', action: 'Mở ca Tối (Tiền két: 2M)', time: '17:30 PM', status: 'info' },
        { id: 3, type: 'expense', user: 'Thu ngân 1', action: 'Chi mua đá viên (-50k)', time: '15:10 PM', status: 'warning' },
        { id: 4, type: 'sale', user: 'Phục vụ bàn', action: 'Khách bàn 12 gọi thêm món', time: '14:05 PM', status: 'success' },
      ])
    : [];

  const stats = isHrm ? statsHrm : statsPos;
  const attendanceChartData = useMock ? attendanceData : [];
  const revenueChartData = useMock ? revenueData : [];

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
            {!useMock ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                Chưa có dữ liệu biểu đồ (Vui lòng bật Mock Data)
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {isHrm ? (
                  <BarChart data={attendanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="attendance" name="Đúng giờ" fill="#5D4037" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" name="Đi muộn" fill="#D7CCC8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} formatter={(val) => `${val}M`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    <Line type="monotone" dataKey="amount" name="Doanh thu (Tr)" stroke="#5D4037" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#5D4037' }} activeDot={{ r: 6 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Timecard Chấm công */}
          {!isAdmin && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#5D4037]" />
                <h3 className="text-lg font-bold text-gray-900">
                  Khu vực chấm công
                </h3>
              </div>

            {loadingTimecard ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-6 h-6 border-2 border-[#5D4037]/20 border-t-[#5D4037] rounded-full animate-spin mb-2" />
                <p className="text-xs text-gray-400">Đang tải ca làm việc...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase">Ca làm hôm nay</p>
                  {useMock ? (
                    <div className="mt-1">
                      <p className="text-sm font-bold text-gray-800">Ca sáng (MOCK_SHIFT)</p>
                      <p className="text-xs text-gray-500 font-medium">Khung giờ: 08:00 - 16:00</p>
                    </div>
                  ) : todayShift ? (
                    <div className="mt-1">
                      <p className="text-sm font-bold text-gray-800">
                        {todayShift.workAssignment?.name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        Khung giờ: {todayShift.workAssignment?.startTime.slice(0, 5)} - {todayShift.workAssignment?.endTime.slice(0, 5)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-red-500 mt-1">Hôm nay không có lịch phân ca</p>
                  )}
                </div>

                {(useMock || todayShift) && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-gray-500 font-semibold px-1">
                      <span className="flex items-center gap-1">
                        {todayAttendance ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-gray-300" />
                        )}
                        Check-in
                        {todayAttendance?.checkInTime && (
                          <span className="font-mono text-gray-700">
                            ({new Date(todayAttendance.checkInTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        {todayAttendance?.checkOutTime ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-gray-300" />
                        )}
                        Check-out
                        {todayAttendance?.checkOutTime && (
                          <span className="font-mono text-gray-700">
                            ({new Date(todayAttendance.checkOutTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})
                          </span>
                        )}
                      </span>
                    </div>

                    {!todayAttendance ? (
                      <button
                        onClick={handleCheckIn}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm"
                      >
                        Check-in
                      </button>
                    ) : !todayAttendance.checkOutTime ? (
                      <button
                        onClick={handleCheckOut}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-sm"
                      >
                        Check-out
                      </button>
                    ) : (
                      <div className="w-full py-2.5 bg-gray-100 text-gray-500 font-bold rounded-xl text-center text-sm border border-gray-200">
                        Đã hoàn thành chấm công hôm nay!
                      </div>
                    )}
                  </div>
                )}

                {summary && (
                  <div className="border-t pt-4 grid grid-cols-2 gap-2 text-center bg-[#FAF9F6]/50 p-2 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Số ca đi làm</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{summary.attendanceCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Số giờ làm</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{summary.totalHours ? summary.totalHours.toFixed(1) : 0}h</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          )}

          {/* Hoạt động gần đây */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Hoạt động gần đây
              </h3>
              <button className="text-[#007AFF] text-xs font-semibold hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-4">
              {activitiesList.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-12">Không có hoạt động nào gần đây</p>
              ) : (
                activitiesList.map((activity) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
