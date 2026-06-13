import React from 'react';
import { 
  Briefcase, 
  Users, 
  Search, 
  Calendar, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Mail,
  Phone,
  MoreVertical,
  Filter
} from 'lucide-react';

const candidates = [
  { id: 'CAN-101', name: 'Trần Minh Hải', position: 'Trưởng ca', status: 'Interviewing', source: 'TopCV', date: '04/04/2026', email: 'hai.tm@gmail.com', phone: '0988 123 456' },
  { id: 'CAN-102', name: 'Lê Thảo My', position: 'Thu ngân', status: 'Pending', source: 'Facebook', date: '05/04/2026', email: 'my.le@yahoo.com', phone: '0977 234 567' },
  { id: 'CAN-103', name: 'Vũ Quốc Anh', position: 'Nhân viên Bếp', status: 'Hired', source: 'Referral', date: '02/04/2026', email: 'anh.vq@gmail.com', phone: '0911 345 678' },
  { id: 'CAN-104', name: 'Phạm Hồng Nhung', position: 'Phục vụ', status: 'Rejected', source: 'LinkedIn', date: '01/04/2026', email: 'nhung.ph@gmail.com', phone: '0966 456 789' },
  { id: 'CAN-105', name: 'Đỗ Tiến Đạt', position: 'Bảo vệ', status: 'New', source: 'TuyenDung', date: '06/04/2026', email: 'dat.dt@gmail.com', phone: '0955 567 890' },
];

export function Recruitment() {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const candidateList = useMock ? candidates : [];

  const stats = [
    { label: 'Ứng viên mới', value: useMock ? '12' : '0', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Phỏng vấn', value: useMock ? '5' : '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Đã tuyển', value: useMock ? '8' : '0', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Tin tuyển dụng', value: useMock ? '4' : '0', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tuyển dụng</h1>
          <p className="text-gray-500 text-sm">Theo dõi quy trình tuyển dụng và ứng viên tiềm năng.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all">
            <Calendar className="w-4 h-4" />
            Lịch phỏng vấn
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] rounded-xl text-white text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm shadow-blue-200">
            <UserPlus className="w-4 h-4" />
            Tạo tin tuyển dụng
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm ứng viên, vị trí..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600">
            <Filter className="w-3.5 h-3.5" />
            Bộ lọc
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidateList.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center text-sm text-gray-500">
            Chưa có ứng viên nào (Vui lòng bật Mock Data)
          </div>
        ) : (
          candidateList.map((can) => (
            <div key={can.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-bold text-lg">
                    {can.name.split(' ').pop()?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#007AFF] transition-colors">{can.name}</h3>
                    <p className="text-xs text-gray-500">{can.id} • {can.date}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 text-[#007AFF]" />
                  <span className="font-medium">{can.position}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{can.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{can.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  can.status === 'Hired' ? 'bg-emerald-50 text-emerald-700' : 
                  can.status === 'Interviewing' ? 'bg-blue-50 text-blue-700' : 
                  can.status === 'Rejected' ? 'bg-red-50 text-red-700' : 
                  'bg-gray-50 text-gray-700'
                }`}>
                  {can.status === 'Hired' ? 'Đã tuyển' : 
                   can.status === 'Interviewing' ? 'Đang phỏng vấn' : 
                   can.status === 'Rejected' ? 'Từ chối' : 
                   can.status === 'New' ? 'Mới ứng tuyển' : 'Chờ duyệt'}
                </span>
                <span className="text-xs font-medium text-gray-400">Nguồn: {can.source}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
