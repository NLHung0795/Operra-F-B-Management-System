import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Edit
} from 'lucide-react';
import { schedulingApi, organizationApi } from '../lib/api';
import { hasPermission, hasAnyRole, getAuthData } from '../lib/auth';
import { toast } from 'sonner';

// Attendance data structure for API
interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInDateKey: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'on-time' | 'late' | 'absent' | 'half-day';
  lateMinutes?: number;
  workHours?: string;
  checkInStatus?: string;
  checkOutStatus?: string;
}

// Mock data - used when VITE_USE_MOCK_DATA is true
const mockAttendanceData: AttendanceRecord[] = [
  { id: 'att001', employeeId: 'EMP001', employeeName: 'Nguyễn Văn An', date: '06/04/2026', checkInDateKey: '2026-04-06', checkInTime: '07:55', checkOutTime: '17:05', status: 'on-time', lateMinutes: 0, workHours: '8h 10m', checkInStatus: 'CHECK_IN_ON_TIME', checkOutStatus: 'CHECK_OUT_ON_TIME' },
  { id: 'att002', employeeId: 'EMP002', employeeName: 'Trần Thị Bình', date: '06/04/2026', checkInDateKey: '2026-04-06', checkInTime: '08:15', checkOutTime: '17:00', status: 'late', lateMinutes: 15, workHours: '7h 45m', checkInStatus: 'CHECK_IN_LATE', checkOutStatus: 'CHECK_OUT_ON_TIME' },
  { id: 'att003', employeeId: 'EMP003', employeeName: 'Lê Hoàng Cường', date: '06/04/2026', checkInDateKey: '2026-04-06', checkInTime: '07:45', checkOutTime: '16:55', status: 'on-time', lateMinutes: 0, workHours: '8h 10m', checkInStatus: 'CHECK_IN_ON_TIME', checkOutStatus: 'CHECK_OUT_ON_TIME' },
  { id: 'att004', employeeId: 'EMP004', employeeName: 'Phạm Minh Đức', date: '06/04/2026', checkInDateKey: '2026-04-06', checkInTime: '08:30', checkOutTime: '17:30', status: 'late', lateMinutes: 30, workHours: '8h 00m', checkInStatus: 'CHECK_IN_LATE', checkOutStatus: 'CHECK_OUT_ON_TIME' },
  { id: 'att005', employeeId: 'EMP005', employeeName: 'Hoàng Diệu Linh', date: '06/04/2026', checkInDateKey: '2026-04-06', checkInTime: '07:58', checkOutTime: '17:02', status: 'on-time', lateMinutes: 0, workHours: '8h 04m', checkInStatus: 'CHECK_IN_ON_TIME', checkOutStatus: 'CHECK_OUT_ON_TIME' },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Tháng ${i + 1}`,
}));

const buildYearOptions = (centerYear: number, range = 2) =>
  Array.from({ length: range * 2 + 1 }, (_, i) => centerYear - range + i);

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toCheckInDateKey = (isoString?: string) => {
  if (!isoString) return '';
  try {
    return new Date(isoString).toISOString().slice(0, 10);
  } catch {
    return '';
  }
};

const formatTime = (isoString?: string) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  } catch {
    return '';
  }
};

const formatDisplayDate = (isoString?: string) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
};

const calculateWorkHours = (inStr?: string, outStr?: string) => {
  if (!inStr || !outStr) return '-';
  try {
    const d1 = new Date(inStr);
    const d2 = new Date(outStr);
    const diffMs = d2.getTime() - d1.getTime();
    if (diffMs <= 0) return '-';
    const diffMins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hrs}h ${mins}m`;
  } catch {
    return '-';
  }
};

const mapStatus = (rec: { checkInStatus?: string; checkInTime?: string }): AttendanceRecord['status'] => {
  if (rec.checkInStatus === 'CHECK_IN_LATE') return 'late';
  if (!rec.checkInTime) return 'absent';
  return 'on-time';
};

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

const removeVietnameseTones = (str: string): string => {
  if (!str) return '';
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Combine accents
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  return str;
};

export function Attendance() {
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(now);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [viewMode, setViewMode] = useState<'month' | 'day'>('day');

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenDatePicker = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (e) {
        dateInputRef.current.click();
      }
    }
  };
  const [monthRecords, setMonthRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'on-time' | 'late' | 'absent'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [currentEmployeeName, setCurrentEmployeeName] = useState<string>('');
  const [todayShift, setTodayShift] = useState<any | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<any | null>(null);
  const [loadingTimecard, setLoadingTimecard] = useState(false);
  const [timecardNonce, setTimecardNonce] = useState(0);

  const auth = getAuthData();
  const canViewTeamAttendance = hasAnyRole(["ADMIN", "MANAGER"]);
  const canUseTimecard = hasPermission("ATTENDANCE_CHECK");

  useEffect(() => {
    const fetchTimecardData = async () => {
      setLoadingTimecard(true);
      try {
        let empId = localStorage.getItem('employeeId');
        setCurrentEmployeeName(localStorage.getItem('employeeName') || auth.username);

        if (useMock) {
          empId = getLoggedInUserAccountId();
        } else if (!empId) {
          try {
            const emp = await organizationApi.getEmployeesMe();
            if (emp && emp.id) {
              empId = emp.id;
              localStorage.setItem('employeeId', empId);
              localStorage.setItem('employeeName', emp.fullname);
              setCurrentEmployeeName(emp.fullname);
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
      } catch (err) {
        console.error("Failed to load timecard data on Attendance page:", err);
      } finally {
        setLoadingTimecard(false);
      }
    };

    fetchTimecardData();
  }, [refreshTrigger, timecardNonce, useMock]);

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
      setRefreshTrigger(prev => prev + 1);
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
      setRefreshTrigger(prev => prev + 1);
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
      setRefreshTrigger(prev => prev + 1);
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
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      toast.error("Check-out thất bại: " + err.message);
    }
  };

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [checkInStatus, setCheckInStatus] = useState<string>('');
  const [checkOutStatus, setCheckOutStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleOpenEditModal = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setCheckInStatus(record.checkInStatus || 'CHECK_IN_ON_TIME');
    setCheckOutStatus(record.checkOutStatus || '');
    setSubmitError(null);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRecord(null);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (useMock) {
      const idx = mockAttendanceData.findIndex(r => r.id === selectedRecord.id);
      if (idx !== -1) {
        mockAttendanceData[idx].checkInStatus = checkInStatus;
        mockAttendanceData[idx].checkOutStatus = checkOutStatus || undefined;
        if (checkInStatus === 'CHECK_IN_LATE') {
          mockAttendanceData[idx].status = 'late';
        } else {
          mockAttendanceData[idx].status = 'on-time';
        }
      }
      setIsSubmitting(false);
      setIsEditModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
      return;
    }

    try {
      await schedulingApi.updateAttendanceStatus(selectedRecord.id, {
        checkInStatus,
        checkOutStatus: checkOutStatus || undefined,
      });
      setIsSubmitting(false);
      setIsEditModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err?.message || 'Cập nhật trạng thái chấm công thất bại.');
      setIsSubmitting(false);
    }
  };

  const dateStr = selectedDate.toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  const handlePrevDay = () => {
    setViewMode('day');
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    setSelectedMonth(newDate.getMonth() + 1);
    setSelectedYear(newDate.getFullYear());
  };

  const handleNextDay = () => {
    setViewMode('day');
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    setSelectedMonth(newDate.getMonth() + 1);
    setSelectedYear(newDate.getFullYear());
  };

  const handleMonthChange = (month: number) => {
    const maxDay = getDaysInMonth(selectedYear, month);
    const day = Math.min(selectedDate.getDate(), maxDay);
    const newDate = new Date(selectedYear, month - 1, day);
    setSelectedMonth(month);
    setSelectedDate(newDate);
  };

  const handleYearChange = (year: number) => {
    const maxDay = getDaysInMonth(year, selectedMonth);
    const day = Math.min(selectedDate.getDate(), maxDay);
    const newDate = new Date(year, selectedMonth - 1, day);
    setSelectedYear(year);
    setSelectedDate(newDate);
  };

  const handleViewWholeMonth = () => {
    setViewMode('month');
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      toast.error("Không có dữ liệu để xuất!");
      return;
    }

    const headers = [
      "Mã nhân viên",
      "Họ và tên",
      "Ngày",
      "Giờ vào",
      "Giờ ra",
      "Tổng giờ",
      "Đi muộn (phút)",
      "Trạng thái"
    ];

    const rows = filteredData.map(record => {
      const badgeInfo = getStatusBadge(record.status);
      return [
        record.employeeId,
        record.employeeName,
        record.date || record.checkInDateKey,
        record.checkInTime || "-",
        record.checkOutTime || "-",
        record.workHours || "-",
        record.lateMinutes || 0,
        badgeInfo.label
      ];
    });

    const cleanHeaders = headers.map(h => removeVietnameseTones(h));
    const cleanRows = rows.map(row => row.map(val => removeVietnameseTones(String(val))));

    const csvContent = "\uFEFF" + [
      "sep=,",
      cleanHeaders.join(","),
      ...cleanRows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const viewName = viewMode === "month" ? `ca_thang_${selectedMonth}_${selectedYear}` : selectedDateKey;
    const cleanViewName = removeVietnameseTones(viewName);
    link.setAttribute("download", `Bao_cao_cham_cong_${cleanViewName}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Xuất báo cáo chấm công thành công!");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
      if (useMock) {
        setMonthRecords(mockAttendanceData);
        setIsLoading(false);
        return;
      }

      try {
        let employeeMap = new Map<string, string>();
        let apiRecords: any[] = [];

        if (canViewTeamAttendance) {
          const empPage = await organizationApi.getEmployees({ page: 1, size: 100 }).catch(() => ({ data: [] }));
          employeeMap = new Map((empPage.data || []).map(e => [e.id, e.fullname]));

          apiRecords = await schedulingApi.getAttendanceByMonth(selectedMonth, selectedYear);
        } else {
          if (!employeeId) {
            setMonthRecords([]);
            setIsLoading(false);
            return;
          }

          apiRecords = await schedulingApi.getAttendance(
            employeeId,
            selectedMonth,
            selectedYear
          );
        }

        const mapped: AttendanceRecord[] = (apiRecords || []).map(rec => ({
          id: rec.id,
          employeeId: rec.employeeId,
          employeeName:
            employeeMap.get(rec.employeeId) ||
            currentEmployeeName ||
            localStorage.getItem('employeeName') ||
            auth.username ||
            rec.employeeId,
          date: formatDisplayDate(rec.checkInTime),
          checkInDateKey: toCheckInDateKey(rec.checkInTime),
          checkInTime: formatTime(rec.checkInTime),
          checkOutTime: rec.checkOutTime ? formatTime(rec.checkOutTime) : undefined,
          status: mapStatus(rec),
          lateMinutes: rec.lateMinutes ?? 0,
          workHours: rec.workedMinutes != null
            ? `${Math.floor(rec.workedMinutes / 60)}h ${rec.workedMinutes % 60}m`
            : rec.checkOutTime
              ? calculateWorkHours(rec.checkInTime, rec.checkOutTime)
              : undefined,
          checkInStatus: rec.checkInStatus,
          checkOutStatus: rec.checkOutStatus,
        }));

        setMonthRecords(mapped);
      } catch (err) {
        console.error('Error loading attendance:', err);
        setError('Không thể kết nối đến máy chủ để lấy dữ liệu chấm công. Hãy chắc chắn BE endpoint /attendance/month hoặc /attendance?employeeId=&month=&year= đã sẵn sàng, hoặc kích hoạt VITE_USE_MOCK_DATA.');
        setMonthRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, refreshTrigger, employeeId, currentEmployeeName, canViewTeamAttendance]);

  const yearOptions = buildYearOptions(new Date().getFullYear());
  const selectedDateKey = toDateKey(selectedDate);

  const records = viewMode === 'month'
    ? monthRecords
    : monthRecords.filter((record) => record.checkInDateKey === selectedDateKey);

  const filteredData = records.filter(record => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalPresent: records.filter(r => r.status !== 'absent').length,
    lateCount: records.filter(r => r.status === 'late').length,
    absentCount: records.filter(r => r.status === 'absent').length,
    attendanceRate: records.length > 0 
      ? ((records.filter(r => r.status !== 'absent').length / records.length) * 100).toFixed(1) 
      : '0.0',
  };

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const styles = {
      'on-time': 'bg-emerald-50 text-emerald-700',
      'late': 'bg-orange-50 text-orange-700',
      'absent': 'bg-red-50 text-red-700',
      'half-day': 'bg-amber-50 text-amber-700',
    };
    const labels = {
      'on-time': 'Đúng giờ',
      'late': 'Đi muộn',
      'absent': 'Vắng mặt',
      'half-day': 'Nửa ngày',
    };
    return { style: styles[status], label: labels[status] };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {canViewTeamAttendance ? "Quản lý chấm công" : "Lịch sử chấm công"}
          </h1>
          <p className="text-gray-500 text-sm">
            {canViewTeamAttendance 
              ? "Theo dõi thời gian ra vào và hiệu suất làm việc của nhân sự." 
              : "Xem lịch sử ra vào và chấm công của cá nhân."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
            <CalendarIcon className="w-4 h-4 text-[#007AFF] shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
              className="bg-transparent border-none text-sm font-bold text-gray-800 focus:outline-none focus:ring-0 cursor-pointer"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <span className="text-gray-300">/</span>
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="bg-transparent border-none text-sm font-bold text-gray-800 focus:outline-none focus:ring-0 cursor-pointer"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <input
              ref={dateInputRef}
              type="date"
              value={toDateKey(selectedDate)}
              onChange={(e) => {
                if (e.target.value) {
                  const newDate = new Date(e.target.value);
                  setSelectedDate(newDate);
                  setSelectedMonth(newDate.getMonth() + 1);
                  setSelectedYear(newDate.getFullYear());
                  setViewMode('day');
                }
              }}
              className="sr-only"
            />
            <button
              onClick={handlePrevDay}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div 
              onClick={handleOpenDatePicker}
              className="flex items-center gap-2 px-3 py-1.5 font-bold text-gray-800 text-sm min-w-[180px] justify-center cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
              title="Click để chọn ngày"
            >
              <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
              {viewMode === 'month' ? (
                <span className="text-[#007AFF]">Cả tháng {selectedMonth}/{selectedYear}</span>
              ) : (
                dateStr
              )}
            </div>
            <button
              onClick={handleNextDay}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 text-sm font-bold transition-colors ${
                viewMode === 'day'
                  ? 'bg-[#007AFF] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Theo ngày
            </button>
            <button
              onClick={handleViewWholeMonth}
              className={`px-3 py-2 text-sm font-bold transition-colors ${
                viewMode === 'month'
                  ? 'bg-[#007AFF] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cả tháng
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <span className="font-bold">Lưu ý:</span>
          <span>{error}</span>
        </div>
      )}

      {canViewTeamAttendance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-sm font-medium text-gray-500">Tỷ lệ đi làm</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.attendanceRate}%</h3>
            <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              {stats.totalPresent}/{records.length} người
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-full text-green-600 shrink-0">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-sm font-medium text-gray-500">Số người đi muộn</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.lateCount}</h3>
            <p className="text-xs text-orange-600 font-bold mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Chi tiết xem bảng dưới
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-full text-orange-600 shrink-0">
            <Clock className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-sm font-medium text-gray-500">Vắng mặt (không phép)</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.absentCount}</h3>
            <p className="text-xs text-red-600 font-bold mt-2 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Cần theo dõi
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-full text-red-600 shrink-0">
            <XCircle className="w-8 h-8" />
          </div>
          </div>
        </div>
      )}

      {/* Timecard chấm công cá nhân (EMPLOYEE, MANAGER, ...) */}
      {canUseTimecard && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md">
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
            </div>
          )}
        </div>
      )}

      {/* Main Attendance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
          <div className="flex flex-wrap gap-3">
            {canViewTeamAttendance && (
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm tên nhân viên hoặc mã..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                />
              </div>
            )}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="on-time">Đúng giờ</option>
              <option value="late">Đi muộn</option>
              <option value="absent">Vắng mặt</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Xuất Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#007AFF]/20 border-t-[#007AFF] rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-500">Đang tải dữ liệu chấm công...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nhân viên</th>
                  {viewMode === 'month' && (
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Ngày</th>
                  )}
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Giờ vào</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Giờ ra</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tổng giờ</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Đi muộn</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                  {canViewTeamAttendance && (
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Thao tác</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={viewMode === 'month' ? 8 : 7} className="px-6 py-8 text-center text-sm text-gray-500">
                      Không có dữ liệu chấm công phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record) => {
                    const badgeInfo = getStatusBadge(record.status);
                    return (
                      <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{record.employeeName}</p>
                            <p className="text-xs text-gray-400">{record.employeeId}</p>
                          </div>
                        </td>
                        {viewMode === 'month' && (
                          <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">{record.date}</td>
                        )}
                        <td className="px-6 py-4 text-center font-mono font-bold text-[#007AFF]">{record.checkInTime}</td>
                        <td className="px-6 py-4 text-center font-mono font-medium text-gray-600">{record.checkOutTime || '-'}</td>
                        <td className="px-6 py-4 text-center text-sm font-medium">{record.workHours || '-'}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-xs font-bold ${record.lateMinutes && record.lateMinutes > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {record.lateMinutes ? `${record.lateMinutes}m` : '0m'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeInfo.style}`}>
                            {badgeInfo.label}
                          </span>
                        </td>
                        {canViewTeamAttendance && (
                          <td className="px-6 py-4 text-center">
                            {hasPermission('MANAGE_ATTENDANCE') && (
                              <button
                                onClick={() => handleOpenEditModal(record)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#007AFF] transition-colors"
                                title="Chỉnh sửa trạng thái"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Status Modal */}
      {isEditModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Sửa trạng thái chấm công</h3>
                <p className="text-xs text-gray-500 mt-1">Cập nhật cho nhân viên: <span className="font-bold text-gray-700">{selectedRecord.employeeName}</span></p>
              </div>
              <button 
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-xl font-medium">&times;</span>
              </button>
            </div>

            <form onSubmit={handleUpdateStatus}>
              <div className="p-6 space-y-4">
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                    {submitError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái Check-in</label>
                  <select
                    value={checkInStatus}
                    onChange={(e) => setCheckInStatus(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all font-medium text-gray-800"
                  >
                    <option value="CHECK_IN_ON_TIME">Đúng giờ (CHECK_IN_ON_TIME)</option>
                    <option value="CHECK_IN_LATE">Đi muộn (CHECK_IN_LATE)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái Check-out</label>
                  <select
                    value={checkOutStatus}
                    onChange={(e) => setCheckOutStatus(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all font-medium text-gray-800"
                  >
                    <option value="">Chưa có / Chưa ra ca</option>
                    <option value="CHECK_OUT_ON_TIME">Đúng giờ (CHECK_OUT_ON_TIME)</option>
                    <option value="CHECK_OUT_SOON">Về sớm (CHECK_OUT_SOON)</option>
                    <option value="CLOSED">Đóng ca (CLOSED)</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-600 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#007AFF] hover:bg-[#0066CC] disabled:bg-[#007AFF]/50 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-[#007AFF]/10"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
