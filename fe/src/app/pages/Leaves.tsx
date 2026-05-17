import React from 'react';
import { CalendarHeart, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

const MOCK_LEAVES = [
  { id: 1, emp: 'Nguyễn Văn An', type: 'Nghỉ ốm', dates: '12/04 - 13/04', status: 'approved' },
  { id: 2, emp: 'Trần Thị Bình', type: 'Việc cá nhân', dates: '15/04', status: 'pending' },
  { id: 3, emp: 'Lê Minh', type: 'Nghỉ phép năm', dates: '20/04 - 25/04', status: 'rejected' },
];

export function Leaves() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nghỉ phép (Leave Requests)</h1>
          <p className="text-gray-500 text-sm">Quản lý và phê duyệt đơn xin nghỉ phép của nhân sự</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] rounded-xl text-white text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          Tạo đơn nghỉ phép
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Nhân viên</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Loại phép</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Thời gian</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LEAVES.map(leave => (
              <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 font-bold text-gray-900">{leave.emp}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{leave.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-semibold">{leave.dates}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                    leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {leave.status === 'approved' ? 'Đã duyệt' : leave.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {leave.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Duyệt">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Từ chối">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
