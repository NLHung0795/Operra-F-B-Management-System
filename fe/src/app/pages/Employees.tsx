import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const employees = [
  { 
    id: 'EMP001', 
    name: 'Nguyễn Văn An', 
    position: 'Quản lý cửa hàng', 
    department: 'Vận hành', 
    status: 'Đang làm việc', 
    email: 'an.nv@fabibox.vn', 
    phone: '0901 234 567',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1287&auto=format&fit=crop'
  },
  { 
    id: 'EMP002', 
    name: 'Trần Thị Bình', 
    position: 'Trưởng ca', 
    department: 'Vận hành', 
    status: 'Nghỉ phép', 
    email: 'binh.tt@fabibox.vn', 
    phone: '0902 345 678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop'
  },
  { 
    id: 'EMP003', 
    name: 'Lê Hoàng Cường', 
    position: 'Nhân viên phục vụ', 
    department: 'Vận hành', 
    status: 'Đang làm việc', 
    email: 'cuong.lh@fabibox.vn', 
    phone: '0903 456 789',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop'
  },
  { 
    id: 'EMP004', 
    name: 'Phạm Minh Đức', 
    position: 'Kế toán', 
    department: 'Văn phòng', 
    status: 'Đang làm việc', 
    email: 'duc.pm@fabibox.vn', 
    phone: '0904 567 890',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1160&auto=format&fit=crop'
  },
  { 
    id: 'EMP005', 
    name: 'Hoàng Diệu Linh', 
    position: 'Nhân viên pha chế', 
    department: 'Vận hành', 
    status: 'Đang làm việc', 
    email: 'linh.hd@fabibox.vn', 
    phone: '0905 678 901',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop'
  },
];

export function Employees() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách nhân sự</h1>
          <p className="text-gray-500 text-sm">Quản lý và theo dõi thông tin nhân viên toàn hệ thống.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#5D4037] rounded-xl text-white text-sm font-semibold hover:bg-[#3E2723] transition-all shadow-sm shadow-stone-200">
          <Plus className="w-4 h-4" />
          Thêm nhân viên mới
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]" />
          <input 
            type="text" 
            placeholder="Tìm theo tên, mã NV, email..." 
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F6] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option>Tất cả phòng ban</option>
            <option>Vận hành</option>
            <option>Văn phòng</option>
            <option>Kỹ thuật</option>
          </select>
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option>Trạng thái</option>
            <option>Đang làm việc</option>
            <option>Nghỉ phép</option>
            <option>Đã nghỉ việc</option>
          </select>
          <button className="p-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nhân viên</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vị trí & Phòng ban</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-orange-50" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-500">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-[#5D4037]" />
                        {emp.position}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <MapPin className="w-3 h-3" />
                        {emp.department}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {emp.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Phone className="w-3 h-3" />
                        {emp.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      emp.status === 'Đang làm việc' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white hover:shadow-sm hover:border-gray-200 border border-transparent rounded-lg text-gray-400 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-xs text-gray-500">Hiển thị 1-5 trong số 128 nhân viên</p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-gray-200 rounded-lg bg-white disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-lg bg-[#5D4037] text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 text-xs font-bold hover:bg-[#FAF9F6]">2</button>
              <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 text-xs font-bold hover:bg-[#FAF9F6]">3</button>
            </div>
            <button className="p-1.5 border border-gray-200 rounded-lg bg-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
