import React from 'react';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Download, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const payrollData = [
  { id: 'PAY-001', name: 'Nguyễn Văn An', role: 'Bếp trưởng', basicSalary: 15000000, allowance: 2000000, bonus: 1500000, tax: 800000, total: 17700000, status: 'Paid' },
  { id: 'PAY-002', name: 'Lê Thị Bình', role: 'Phục vụ', basicSalary: 7000000, allowance: 1000000, bonus: 500000, tax: 0, total: 8500000, status: 'Pending' },
  { id: 'PAY-003', name: 'Trần Văn Cường', role: 'Pha chế', basicSalary: 8500000, allowance: 1200000, bonus: 800000, tax: 0, total: 10500000, status: 'Paid' },
  { id: 'PAY-004', name: 'Phạm Minh Đức', role: 'Quản lý', basicSalary: 12000000, allowance: 1500000, bonus: 2000000, tax: 500000, total: 15000000, status: 'Processing' },
  { id: 'PAY-005', name: 'Hoàng Anh Tuấn', role: 'Bảo vệ', basicSalary: 6000000, allowance: 500000, bonus: 200000, tax: 0, total: 6700000, status: 'Paid' },
];

export function Payroll() {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const payrolls = useMock ? payrollData : [];

  const stats = [
    { label: 'Tổng quỹ lương', value: useMock ? '452.5M' : '0đ', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Lương thực lĩnh', value: useMock ? '415.8M' : '0đ', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Thuế thu nhập', value: useMock ? '25.4M' : '0đ', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Giờ tăng ca', value: useMock ? '342h' : '0h', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Bảng lương</h1>
          <p className="text-gray-500 text-sm">Tính toán lương, thưởng và thuế cho nhân viên tháng 04/2026.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all">
            <Download className="w-4 h-4" />
            Xuất file Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] rounded-xl text-white text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm shadow-blue-200">
            Chốt bảng lương
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-gray-900">Chi tiết bảng lương</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600">
              <Filter className="w-3.5 h-3.5" />
              Lọc theo bộ phận
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nhân viên</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lương cơ bản</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phụ cấp</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thưởng</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thuế/Khấu trừ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thực lĩnh</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payrolls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    Chưa có dữ liệu bảng lương (Vui lòng bật Mock Data hoặc liên kết API)
                  </td>
                </tr>
              ) : (
                payrolls.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{row.name}</span>
                        <span className="text-xs text-gray-500">{row.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.basicSalary.toLocaleString()}đ</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.allowance.toLocaleString()}đ</td>
                    <td className="px-6 py-4 text-sm text-emerald-600">+{row.bonus.toLocaleString()}đ</td>
                    <td className="px-6 py-4 text-sm text-red-500">-{row.tax.toLocaleString()}đ</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.total.toLocaleString()}đ</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 
                        row.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {row.status === 'Paid' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {row.status === 'Pending' && <AlertCircle className="w-3.5 h-3.5" />}
                        {row.status === 'Processing' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                        {row.status === 'Paid' ? 'Đã chi trả' : row.status === 'Pending' ? 'Chờ duyệt' : 'Đang xử lý'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
