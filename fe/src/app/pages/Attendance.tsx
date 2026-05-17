import React from 'react';
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

const attendanceData = [
  { id: 'EMP001', name: 'Nguyễn Văn An', date: '06/04/2026', checkIn: '07:55', checkOut: '17:05', status: 'Đúng giờ', late: '0m', workTime: '8h 10m' },
  { id: 'EMP002', name: 'Trần Thị Bình', date: '06/04/2026', checkIn: '08:15', checkOut: '17:00', status: 'Đi muộn', late: '15m', workTime: '7h 45m' },
  { id: 'EMP003', name: 'Lê Hoàng Cường', date: '06/04/2026', checkIn: '07:45', checkOut: '16:55', status: 'Đúng giờ', late: '0m', workTime: '8h 10m' },
  { id: 'EMP004', name: 'Phạm Minh Đức', date: '06/04/2026', checkIn: '08:30', checkOut: '17:30', status: 'Đi muộn', late: '30m', workTime: '8h 00m' },
  { id: 'EMP005', name: 'Hoàng Diệu Linh', date: '06/04/2026', checkIn: '07:58', checkOut: '17:02', status: 'Đúng giờ', late: '0m', workTime: '8h 04m' },
];

export function Attendance() {
  const [selectedDate, setSelectedDate] = React.useState('Hôm nay, 06 Tháng 4, 2026');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chấm công</h1>
          <p className="text-gray-500 text-sm">Theo dõi thời gian ra vào và hiệu suất làm việc của nhân sự.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 font-bold text-gray-800 text-sm">
            <CalendarIcon className="w-4 h-4 text-[#007AFF]" />
            {selectedDate}
          </div>
          <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-sm font-medium text-gray-500">Tỷ lệ đi làm</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">94.2%</h3>
            <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +2.1% so với hôm qua
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-full text-green-600 shrink-0">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-sm font-medium text-gray-500">Số người đi muộn</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">08</h3>
            <p className="text-xs text-orange-600 font-bold mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Giảm 3 người so với hôm qua
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-full text-orange-600 shrink-0">
            <Clock className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-sm font-medium text-gray-500">Vắng mặt (không phép)</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">02</h3>
            <p className="text-xs text-red-600 font-bold mt-2 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Cần liên hệ ngay
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
                placeholder="Tìm tên nhân viên..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
              />
            </div>
            <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option>Tất cả ca làm</option>
              <option>Ca sáng (08:00 - 17:00)</option>
              <option>Ca chiều (14:00 - 22:00)</option>
              <option>Ca gãy</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Lọc nâng cao
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900">
              <Download className="w-4 h-4" />
              Xuất PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {attendanceData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{record.name}</p>
                      <p className="text-xs text-gray-400">{record.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-[#007AFF]">{record.checkIn}</td>
                  <td className="px-6 py-4 text-center font-mono font-medium text-gray-600">{record.checkOut}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium">{record.workTime}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold ${record.late !== '0m' ? 'text-red-500' : 'text-gray-400'}`}>
                      {record.late}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      record.status === 'Đang làm việc' || record.status === 'Đúng giờ'
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
