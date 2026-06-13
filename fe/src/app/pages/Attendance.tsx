import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { schedulingApi, organizationApi } from '../lib/api';

// Attendance data structure for API
interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'on-time' | 'late' | 'absent' | 'half-day';
  lateMinutes?: number;
  workHours?: string;
}

// Mock data - used when VITE_USE_MOCK_DATA is true
const mockAttendanceData: AttendanceRecord[] = [
  { id: 'att001', employeeId: 'EMP001', employeeName: 'Nguyễn Văn An', date: '06/04/2026', checkInTime: '07:55', checkOutTime: '17:05', status: 'on-time', lateMinutes: 0, workHours: '8h 10m' },
  { id: 'att002', employeeId: 'EMP002', employeeName: 'Trần Thị Bình', date: '06/04/2026', checkInTime: '08:15', checkOutTime: '17:00', status: 'late', lateMinutes: 15, workHours: '7h 45m' },
  { id: 'att003', employeeId: 'EMP003', employeeName: 'Lê Hoàng Cường', date: '06/04/2026', checkInTime: '07:45', checkOutTime: '16:55', status: 'on-time', lateMinutes: 0, workHours: '8h 10m' },
  { id: 'att004', employeeId: 'EMP004', employeeName: 'Phạm Minh Đức', date: '06/04/2026', checkInTime: '08:30', checkOutTime: '17:30', status: 'late', lateMinutes: 30, workHours: '8h 00m' },
  { id: 'att005', employeeId: 'EMP005', employeeName: 'Hoàng Diệu Linh', date: '06/04/2026', checkInTime: '07:58', checkOutTime: '17:02', status: 'on-time', lateMinutes: 0, workHours: '8h 04m' },
];

export function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'on-time' | 'late' | 'absent'>('all');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateStr = selectedDate.toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
      if (useMock) {
        setRecords(mockAttendanceData);
        setIsLoading(false);
        return;
      }

      try {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // Fetch employees mapping (catch error gracefully to support local fallback)
        const empPage = await organizationApi.getEmployees({ page: 1, size: 100 }).catch(() => ({ data: [] }));
        const employeeMap = new Map((empPage.data || []).map(e => [e.id, e.fullname]));

        // Fetch attendance records
        const apiRecords = await schedulingApi.getAttendanceByDate(formattedDate);

        // Helpers for record parsing
        const formatTime = (isoString?: string) => {
          if (!isoString) return '';
          try {
            const d = new Date(isoString);
            return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
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

        const mapStatus = (statusStr?: string): 'on-time' | 'late' | 'absent' | 'half-day' => {
          const lower = (statusStr || '').toLowerCase();
          if (lower.includes('late')) return 'late';
          if (lower.includes('absent')) return 'absent';
          if (lower.includes('half')) return 'half-day';
          return 'on-time';
        };

        const getLateMinutes = (inStr?: string) => {
          if (!inStr) return 0;
          try {
            const d = new Date(inStr);
            const shiftStart = new Date(d);
            shiftStart.setHours(8, 0, 0, 0);
            if (d.getTime() > shiftStart.getTime()) {
              return Math.floor((d.getTime() - shiftStart.getTime()) / 60000);
            }
          } catch {}
          return 0;
        };

        const mapped: AttendanceRecord[] = (apiRecords || []).map(rec => ({
          id: rec.id,
          employeeId: rec.employeeId,
          employeeName: employeeMap.get(rec.employeeId) || rec.employeeId,
          date: formattedDate,
          checkInTime: formatTime(rec.checkInTime),
          checkOutTime: rec.checkOutTime ? formatTime(rec.checkOutTime) : undefined,
          status: mapStatus(rec.status),
          lateMinutes: getLateMinutes(rec.checkInTime),
          workHours: rec.checkOutTime ? calculateWorkHours(rec.checkInTime, rec.checkOutTime) : undefined,
        }));

        setRecords(mapped);
      } catch (err) {
        console.error('Error loading attendance:', err);
        setError('Không thể kết nối đến máy chủ để lấy dữ liệu chấm công. Microservice hoặc API chưa sẵn sàng.');
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const filteredData = records.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chấm công</h1>
          <p className="text-gray-500 text-sm">Theo dõi thời gian ra vào và hiệu suất làm việc của nhân sự.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button 
            onClick={handlePrevDay}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 font-bold text-gray-800 text-sm">
            <CalendarIcon className="w-4 h-4 text-[#007AFF]" />
            {dateStr}
          </div>
          <button 
            onClick={handleNextDay}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <span className="font-bold">Lưu ý:</span>
          <span>{error}</span>
        </div>
      )}

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

      {/* Main Attendance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
          <div className="flex flex-wrap gap-3">
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
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
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
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Giờ vào</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Giờ ra</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tổng giờ</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Đi muộn</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
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
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
