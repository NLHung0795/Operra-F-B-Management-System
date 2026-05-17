import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  PlayCircle, 
  StopCircle, 
  Banknote,
  FileText,
  AlertTriangle,
  History,
  TrendingUp
} from 'lucide-react';

const CURRENT_SESSION = {
  id: 'CS-20260406-01',
  startTime: '07:30 AM',
  staff: 'Nguyễn Văn An',
  role: 'Thu ngân',
  startingCash: 2000000,
  ordersCount: 45,
  cashSales: 1550000,
  cardSales: 2100000,
  expenses: 150000,
  expectedCash: 3400000 // starting + cashSales - expenses
};

const PAST_SESSIONS = [
  { date: '05/04/2026', shift: 'Ca Tối', staff: 'Trần Thị Bình', total: 5400000, status: 'Khớp' },
  { date: '05/04/2026', shift: 'Ca Sáng', staff: 'Nguyễn Văn An', total: 3850000, status: 'Lệch -50k' },
  { date: '04/04/2026', shift: 'Ca Tối', staff: 'Lê Minh', total: 6100000, status: 'Khớp' },
];

export function CashSession() {
  const [isSessionOpen, setIsSessionOpen] = useState(true);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [actualCash, setActualCash] = useState<number>(CURRENT_SESSION.expectedCash);

  const handleCloseSession = () => {
    setIsSessionOpen(false);
    setShowCloseModal(false);
  };

  const diff = actualCash - CURRENT_SESSION.expectedCash;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Ca Bán Hàng</h1>
          <p className="text-gray-500 text-sm">Giao ca, kiểm đếm tiền và chốt doanh thu</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
            <History className="w-4 h-4" />
            Lịch sử giao ca
          </button>
        </div>
      </div>

      {isSessionOpen ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">Ca hiện tại: Sáng</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold animate-pulse">
                    Đang mở
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Mã ca: {CURRENT_SESSION.id} • Thu ngân: <span className="font-semibold text-gray-700">{CURRENT_SESSION.staff}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-gray-500 text-sm justify-end">
                <Clock className="w-4 h-4" />
                Mở lúc {CURRENT_SESSION.startTime}
              </div>
              <button 
                onClick={() => setShowCloseModal(true)}
                className="mt-3 flex items-center gap-2 px-6 py-2.5 bg-red-500 rounded-xl text-white text-sm font-bold hover:bg-red-600 transition-all shadow-sm shadow-red-200"
              >
                <StopCircle className="w-5 h-5" />
                ĐÓNG CA & KIỂM TIỀN
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-blue-500" />
                Tiền mặt trong két
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tiền đầu ca</span>
                  <span className="font-semibold text-gray-900">{CURRENT_SESSION.startingCash.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Thu tiền mặt (+)</span>
                  <span className="font-semibold text-emerald-600">+{CURRENT_SESSION.cashSales.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Chi tiền mặt (-)</span>
                  <span className="font-semibold text-red-600">-{CURRENT_SESSION.expenses.toLocaleString()}đ</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-bold text-gray-900">Dự kiến trong két</span>
                  <span className="font-bold text-blue-600 text-lg">{CURRENT_SESSION.expectedCash.toLocaleString()}đ</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Tổng quan doanh thu
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Số lượng đơn</span>
                  <span className="font-semibold text-gray-900">{CURRENT_SESSION.ordersCount} đơn</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Doanh thu tiền mặt</span>
                  <span className="font-semibold text-gray-900">{CURRENT_SESSION.cashSales.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Doanh thu thẻ/ví</span>
                  <span className="font-semibold text-gray-900">{CURRENT_SESSION.cardSales.toLocaleString()}đ</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-bold text-gray-900">TỔNG DOANH THU</span>
                  <span className="font-bold text-emerald-600 text-lg">
                    {(CURRENT_SESSION.cashSales + CURRENT_SESSION.cardSales).toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Cảnh báo & Ghi chú
              </h3>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <ul className="space-y-2 text-sm text-amber-800">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    Chưa có cảnh báo nào trong ca.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    Vui lòng đếm kỹ tiền lẻ trước khi đóng ca.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa có ca bán hàng nào</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Bạn cần mở ca bán hàng để có thể tạo đơn và thanh toán trên hệ thống POS. Tiền đầu ca sẽ được ghi nhận vào két.
          </p>
          <button 
            onClick={() => setIsSessionOpen(true)}
            className="flex items-center gap-2 px-8 py-3.5 bg-[#007AFF] rounded-xl text-white text-base font-bold hover:bg-[#0062CC] transition-all shadow-md shadow-blue-200 mx-auto"
          >
            <PlayCircle className="w-6 h-6" />
            MỞ CA BÁN HÀNG
          </button>
        </div>
      )}

      {/* Lịch sử giao ca */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            Ca bán hàng gần đây
          </h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-sm text-gray-500">
              <th className="py-3 px-6 font-medium">Ngày</th>
              <th className="py-3 px-6 font-medium">Ca</th>
              <th className="py-3 px-6 font-medium">Thu ngân</th>
              <th className="py-3 px-6 font-medium text-right">Tổng thực thu</th>
              <th className="py-3 px-6 font-medium text-center">Trạng thái két</th>
            </tr>
          </thead>
          <tbody>
            {PAST_SESSIONS.map((s, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-4 px-6 text-sm font-medium text-gray-900">{s.date}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{s.shift}</td>
                <td className="py-4 px-6 text-sm text-gray-900 font-semibold">{s.staff}</td>
                <td className="py-4 px-6 text-sm text-gray-900 font-bold text-right">{s.total.toLocaleString()}đ</td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                    s.status === 'Khớp' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Close Session Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50">
              <h3 className="font-bold text-lg text-red-700 flex items-center gap-2">
                <StopCircle className="w-5 h-5" />
                Xác nhận Đóng Ca
              </h3>
              <button onClick={() => setShowCloseModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-sm font-medium text-gray-500">Dự kiến trong két:</span>
                <span className="text-xl font-bold text-blue-600">{CURRENT_SESSION.expectedCash.toLocaleString()}đ</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Nhập số tiền mặt thực tế kiểm đếm:</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={actualCash}
                    onChange={(e) => setActualCash(Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">VNĐ</span>
                </div>
              </div>

              {diff !== 0 && (
                <div className={`p-4 rounded-xl border ${diff > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`w-5 h-5 ${diff > 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                    <span className={`font-bold ${diff > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      Két đang {diff > 0 ? 'THỪA' : 'THIẾU'} tiền!
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${diff > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {Math.abs(diff).toLocaleString()}đ
                  </p>
                  <input 
                    type="text" 
                    placeholder="Ghi chú lý do lệch tiền..." 
                    className="w-full mt-3 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setShowCloseModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  HỦY BỎ
                </button>
                <button 
                  onClick={handleCloseSession}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-md shadow-red-200"
                >
                  CHỐT CA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
