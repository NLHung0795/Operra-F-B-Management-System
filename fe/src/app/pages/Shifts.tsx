import React from 'react';
import { 
  Calendar,
  Clock,
  Filter,
  Plus,
  Users,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SHIFT_TYPES = [
  { id: 'morning', name: 'Ca Sáng', time: '08:00 - 16:00', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  { id: 'afternoon', name: 'Ca Chiều', time: '14:00 - 22:00', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { id: 'night', name: 'Ca Tối', time: '18:00 - 02:00', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
];

const MOCK_SCHEDULE = [
  { id: 1, empName: 'Nguyễn Văn An', role: 'Pha chế', shifts: { '2': 'morning', '3': 'morning', '4': 'afternoon', '5': 'off', '6': 'night', '7': 'night', 'CN': 'morning' } },
  { id: 2, empName: 'Trần Thị Bình', role: 'Phục vụ', shifts: { '2': 'afternoon', '3': 'afternoon', '4': 'night', '5': 'night', '6': 'off', '7': 'morning', 'CN': 'morning' } },
  { id: 3, empName: 'Lê Minh', role: 'Bếp chính', shifts: { '2': 'night', '3': 'night', '4': 'off', '5': 'morning', '6': 'morning', '7': 'afternoon', 'CN': 'afternoon' } },
  { id: 4, empName: 'Phạm Hoa', role: 'Thu ngân', shifts: { '2': 'morning', '3': 'off', '4': 'morning', '5': 'afternoon', '6': 'afternoon', '7': 'night', 'CN': 'night' } },
];

const DAYS = ['2', '3', '4', '5', '6', '7', 'CN'];

export function Shifts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ca làm việc F&B</h1>
          <p className="text-gray-500 text-sm">Quản lý và phân ca cho nhân viên nhà hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button className="px-3 py-2 hover:bg-gray-50 text-gray-600 border-r border-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#007AFF]" />
              Tuần 12 - 18 Tháng 4, 2026
            </div>
            <button className="px-3 py-2 hover:bg-gray-50 text-gray-600 border-l border-gray-200">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] rounded-xl text-white text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />
            Xếp ca tự động
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SHIFT_TYPES.map(shift => (
          <div key={shift.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${shift.bg} ${shift.text}`}>
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{shift.name}</h4>
                <p className="text-xs font-medium text-gray-500">{shift.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">4-5 NV</p>
              <p className="text-xs text-gray-400">Định mức</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-sm font-bold text-gray-700 w-64">Nhân viên</th>
                {DAYS.map(day => (
                  <th key={day} className="py-4 px-3 text-sm font-bold text-gray-700 text-center min-w-[120px]">
                    Thứ {day}
                    <div className="text-xs font-normal text-gray-500 mt-1">12/04</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_SCHEDULE.map(emp => (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                        {emp.empName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{emp.empName}</p>
                        <p className="text-xs text-gray-500 font-medium">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  {DAYS.map(day => {
                    const shiftId = emp.shifts[day as keyof typeof emp.shifts];
                    const shiftInfo = SHIFT_TYPES.find(s => s.id === shiftId);
                    
                    return (
                      <td key={day} className="py-3 px-2">
                        {shiftId === 'off' ? (
                          <div className="w-full py-2 px-3 bg-gray-100 rounded-lg text-center border border-gray-200 border-dashed">
                            <span className="text-xs font-semibold text-gray-500">Nghỉ (OFF)</span>
                          </div>
                        ) : shiftInfo ? (
                          <div className={`w-full py-2 px-3 rounded-lg text-center border ${shiftInfo.bg} ${shiftInfo.text} ${shiftInfo.border} cursor-pointer hover:opacity-80 transition-opacity`}>
                            <span className="text-xs font-bold block">{shiftInfo.name}</span>
                          </div>
                        ) : (
                          <div className="w-full py-2 px-3 bg-white rounded-lg text-center border border-gray-200 border-dashed cursor-pointer hover:bg-gray-50">
                            <span className="text-xs font-medium text-gray-400">+ Thêm</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Hiển thị <span className="font-bold text-gray-900">4</span> nhân sự</p>
          <button className="text-sm font-semibold text-[#007AFF] hover:underline">
            Xem toàn bộ 24 nhân viên
          </button>
        </div>
      </div>
    </div>
  );
}
