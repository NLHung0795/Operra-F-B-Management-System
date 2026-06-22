import React from 'react';
import { 
  Award,
  TrendingUp,
  Target,
  BarChart2,
  ThumbsUp,
  AlertTriangle,
  ChevronDown,
  Search,
  Download
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
  Cell
} from 'recharts';
import { hasPermission } from '../lib/auth';

const KPI_METRICS = [
  { id: 1, name: 'Điểm phục vụ KH (CSAT)', target: '4.5/5', current: '4.7', status: 'success', icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 2, name: 'Doanh thu Up-sell / NV', target: '20M', current: '18.5M', status: 'warning', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 3, name: 'Điểm VSTP (QSC)', target: '95%', current: '98%', status: 'success', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 4, name: 'Tỷ lệ đi muộn', target: '< 5%', current: '8%', status: 'danger', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
];

const STAFF_PERFORMANCE = [
  { id: 1, name: 'Nguyễn Văn An', role: 'Pha chế', score: 9.2, target: 9.0, status: 'Xuất sắc' },
  { id: 2, name: 'Trần Thị Bình', role: 'Phục vụ', score: 8.5, target: 8.5, status: 'Đạt' },
  { id: 3, name: 'Lê Minh', role: 'Bếp chính', score: 9.5, target: 9.0, status: 'Xuất sắc' },
  { id: 4, name: 'Phạm Hoa', role: 'Thu ngân', score: 7.8, target: 8.5, status: 'Cần cố gắng' },
];

export function KPI() {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const canViewTeamKpi = hasPermission("VIEW_EMPLOYEE") || hasPermission("MANAGE_EMPLOYEE");
  const metrics = useMock ? KPI_METRICS : [];
  const performances = useMock ? STAFF_PERFORMANCE : [];
  const chartData = performances.map(item => ({
    name: item.name,
    score: item.score,
    target: item.target
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đánh giá Hiệu suất (KPI)</h1>
          <p className="text-gray-500 text-sm">Quản lý mục tiêu và hiệu quả công việc nhân sự F&B</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 shadow-sm cursor-pointer">
              <option>Tháng 4, 2026</option>
              <option>Tháng 3, 2026</option>
              <option>Quý 1, 2026</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {canViewTeamKpi && (
            <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] rounded-xl text-white text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm shadow-blue-200">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.length === 0 ? (
          <div className="col-span-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center text-sm text-gray-500">
            Chưa có chỉ số mục tiêu KPI (Vui lòng bật Mock Data)
          </div>
        ) : (
          metrics.map(metric => (
            <div key={metric.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  metric.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                  metric.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                }`}>
                  Mục tiêu: {metric.target}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className="text-2xl font-bold text-gray-900">{metric.current}</h4>
                  <span className="text-xs font-semibold text-gray-400">hiện tại</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {canViewTeamKpi && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Biểu đồ Điểm KPI Nhân viên</h3>
            <button className="flex items-center gap-2 text-sm font-semibold text-[#007AFF] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              <BarChart2 className="w-4 h-4" />
              Chi tiết
            </button>
          </div>
          <div className="h-[300px] w-full">
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">
                Chưa có dữ liệu biểu đồ (Vui lòng bật Mock Data)
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="score" name="Điểm thực tế" fill="#007AFF" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= entry.target ? '#10B981' : entry.score >= entry.target - 1 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                  <Bar dataKey="target" name="Mục tiêu" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Xếp hạng Tháng</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#007AFF]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm nhân viên..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {performances.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-8">Chưa có xếp hạng nhân sự</p>
            ) : (
              performances.sort((a, b) => b.score - a.score).map((staff, idx) => (
                <div key={staff.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' :
                      idx === 1 ? 'bg-gray-100 text-gray-600 border border-gray-200' :
                      idx === 2 ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#007AFF] transition-colors">{staff.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{staff.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      staff.score >= staff.target ? 'text-emerald-600' : 'text-amber-600'
                    }`}>{staff.score}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">{staff.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <button className="mt-4 w-full py-2.5 bg-gray-50 text-[#007AFF] text-sm font-bold rounded-xl hover:bg-blue-50 transition-all border border-gray-100">
            Đánh giá toàn bộ nhân sự
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
