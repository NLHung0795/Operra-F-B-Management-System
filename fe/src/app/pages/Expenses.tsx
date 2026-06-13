import React from 'react';
import { DollarSign, Plus, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MOCK_EXPENSES = [
  { id: 1, date: '12/04/2026', type: 'Thu', amount: 500000, category: 'Thêm tiền lẻ', note: 'Quản lý nạp thêm', staff: 'Nguyễn Văn An' },
  { id: 2, date: '12/04/2026', type: 'Chi', amount: 150000, category: 'Mua nguyên liệu', note: 'Mua đá viên, chanh', staff: 'Trần Thị Bình' },
  { id: 3, date: '11/04/2026', type: 'Chi', amount: 50000, category: 'Phí vận chuyển', note: 'Giao hàng gấp', staff: 'Lê Minh' },
];

export function Expenses() {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const expenses = useMock ? MOCK_EXPENSES : [];
  const totalIncome = useMock ? 5500000 : 0;
  const totalExpense = useMock ? 1250000 : 0;
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sổ Thu Chi (Expenses)</h1>
          <p className="text-gray-500 text-sm">Ghi nhận các khoản thu/chi phát sinh trong ca bán hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] rounded-xl text-white text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />
            Tạo phiếu Thu / Chi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng Thu (Tháng này)</p>
              <h4 className="text-2xl font-bold text-emerald-600">{totalIncome.toLocaleString()}đ</h4>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng Chi (Tháng này)</p>
              <h4 className="text-2xl font-bold text-red-600">{totalExpense.toLocaleString()}đ</h4>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#007AFF] flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Số dư hiện tại</p>
              <h4 className="text-2xl font-bold text-gray-900">{balance.toLocaleString()}đ</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Ngày tạo</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Loại</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Số tiền</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Hạng mục</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Ghi chú</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Người tạo</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  Chưa có dữ liệu thu chi (Vui lòng bật Mock Data hoặc liên kết API)
                </td>
              </tr>
            ) : (
              expenses.map(exp => (
                <tr key={exp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{exp.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      exp.type === 'Thu' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {exp.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-bold ${exp.type === 'Thu' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {exp.type === 'Thu' ? '+' : '-'}{exp.amount.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{exp.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 italic">{exp.note}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">{exp.staff}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
