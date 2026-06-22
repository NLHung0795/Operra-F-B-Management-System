import React, { useState } from "react";
import {
  FileText,
  Search,
  Calendar,
  Filter,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  X,
  CreditCard,
  User,
  Coffee,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { HasPermission } from "../components/HasPermission";

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
}

interface Invoice {
  id: string;
  date: string;
  table: string;
  amount: number;
  paymentMethod: string;
  status: "Completed" | "Cancelled";
  staff: string;
  items: InvoiceItem[];
  discount: number;
  subtotal: number;
  cashSessionId: string;
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-20260613-001",
    date: "13/06/2026 14:30",
    table: "Bàn 1",
    subtotal: 85000,
    discount: 0,
    amount: 85000,
    paymentMethod: "Tiền mặt",
    status: "Completed",
    staff: "Nguyễn Văn An",
    cashSessionId: "CS-20260613-01",
    items: [
      { name: "Cà phê Đen", qty: 2, price: 25000 },
      { name: "Bánh Sừng Trâu", qty: 1, price: 35000 },
    ],
  },
  {
    id: "INV-20260613-002",
    date: "13/06/2026 14:45",
    table: "Bàn 4",
    subtotal: 45000,
    discount: 5000,
    amount: 40000,
    paymentMethod: "Chuyển khoản (QR)",
    status: "Completed",
    staff: "Nguyễn Văn An",
    cashSessionId: "CS-20260613-01",
    items: [
      { name: "Trà Đào Cam Sả", qty: 1, price: 45000 },
    ],
  },
  {
    id: "INV-20260613-003",
    date: "13/06/2026 15:10",
    table: "Mang đi (Takeaway)",
    subtotal: 58000,
    discount: 0,
    amount: 58000,
    paymentMethod: "Thẻ",
    status: "Completed",
    staff: "Trần Thị Bình",
    cashSessionId: "CS-20260613-02",
    items: [
      { name: "Cà phê Sữa", qty: 2, price: 29000 },
    ],
  },
  {
    id: "INV-20260613-004",
    date: "13/06/2026 15:20",
    table: "Bàn 2",
    subtotal: 75000,
    discount: 10000,
    amount: 65000,
    paymentMethod: "Tiền mặt",
    status: "Cancelled",
    staff: "Lê Minh",
    cashSessionId: "CS-20260613-01",
    items: [
      { name: "Bạc Xỉu", qty: 2, price: 32000 },
      { name: "Cà phê Đen", qty: 1, price: 25000 },
    ],
  },
  {
    id: "INV-20260613-005",
    date: "13/06/2026 15:55",
    table: "Bàn 5",
    subtotal: 120000,
    discount: 0,
    amount: 120000,
    paymentMethod: "Chuyển khoản (QR)",
    status: "Completed",
    staff: "Trần Thị Bình",
    cashSessionId: "CS-20260613-02",
    items: [
      { name: "Trà Vải", qty: 2, price: 40000 },
      { name: "Bánh Sừng Trâu", qty: 1, price: 35000 },
      { name: "Bạc Xỉu", qty: 1, price: 32000 },
    ],
  },
];

export function Invoices() {
  const useMock = import.meta.env.VITE_USE_MOCK_DATA === "true";
  const [invoicesList, setInvoicesList] = useState<Invoice[]>(useMock ? MOCK_INVOICES : []);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  // Calculations (KPIs)
  const invoices = invoicesList.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.table.toLowerCase().includes(search.toLowerCase()) ||
      inv.staff.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || inv.paymentMethod.includes(paymentFilter);
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const activeInvoices = invoices.filter((inv) => inv.status === "Completed");
  const totalRevenue = activeInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalInvoicesCount = invoices.length;
  const avgBill = activeInvoices.length > 0 ? totalRevenue / activeInvoices.length : 0;
  const cancelledCount = invoices.filter((inv) => inv.status === "Cancelled").length;

  const handlePrint = (invoiceId: string) => {
    toast.success(`Đang gửi lệnh in hóa đơn ${invoiceId} đến máy in nhiệt...`);
  };

  const handleCancelInvoice = (invoiceId: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy hóa đơn ${invoiceId}?`)) {
      setInvoicesList(
        invoicesList.map((inv) =>
          inv.id === invoiceId ? { ...inv, status: "Cancelled" } : inv
        )
      );
      if (selectedInvoice?.id === invoiceId) {
        setSelectedInvoice({ ...selectedInvoice, status: "Cancelled" });
      }
      toast.success(`Hủy hóa đơn ${invoiceId} thành công.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Hóa Đơn</h1>
          <p className="text-gray-500 text-sm">Xem danh sách, in lại hóa đơn và quản lý lịch sử thanh toán</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Doanh thu thật</p>
            <h4 className="text-xl font-black text-emerald-600">{totalRevenue.toLocaleString()}đ</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#007AFF] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng hóa đơn</p>
            <h4 className="text-xl font-black text-gray-900">{totalInvoicesCount} hóa đơn</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá trị trung bình</p>
            <h4 className="text-xl font-black text-purple-600">{Math.round(avgBill).toLocaleString()}đ</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Số hóa đơn đã hủy</p>
            <h4 className="text-xl font-black text-red-600">{cancelledCount} đơn</h4>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã hóa đơn, bàn, nhân viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF9F6] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Completed">Đã thanh toán</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Mọi phương thức</option>
            <option value="Tiền mặt">Tiền mặt</option>
            <option value="Chuyển khoản">Chuyển khoản</option>
            <option value="Thẻ">Thẻ</option>
          </select>
        </div>
      </div>

      {/* Main Table Layout */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-4 px-6 font-bold">Mã hóa đơn</th>
                <th className="py-4 px-6 font-bold">Thời gian</th>
                <th className="py-4 px-6 font-bold">Khu vực / Bàn</th>
                <th className="py-4 px-6 font-bold">Hình thức</th>
                <th className="py-4 px-6 font-bold">Nhân viên</th>
                <th className="py-4 px-6 font-bold text-right">Tổng tiền</th>
                <th className="py-4 px-6 font-bold text-center">Trạng thái</th>
                <th className="py-4 px-6 font-bold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 px-6 text-center text-sm text-gray-500">
                    Chưa có hóa đơn nào phù hợp (Vui lòng bật Mock Data hoặc liên kết API)
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    <td className="py-4 px-6 font-bold text-gray-900">{inv.id}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{inv.date}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-800">{inv.table}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{inv.paymentMethod}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-800">{inv.staff}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-950 text-right">
                      {inv.amount.toLocaleString()}đ
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          inv.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {inv.status === "Completed" ? "Đã thanh toán" : "Đã hủy"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handlePrint(inv.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
                          title="In hóa đơn"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {inv.status === "Completed" && (
                          <HasPermission permission="CANCEL_ORDER">
                            <button
                              onClick={() => handleCancelInvoice(inv.id)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                              title="Hủy hóa đơn"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </HasPermission>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Receipt Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-end z-50 transition-all animate-fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col relative animate-slide-in">
            {/* Header of Drawer */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#5D4037]" />
                Chi Tiết Hóa Đơn
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Thermal Print Receipt Simulation Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-100 flex justify-center">
              <div className="bg-white w-full max-w-sm rounded-xl shadow-md p-6 border border-gray-200 flex flex-col font-mono text-xs text-gray-800 relative">
                {/* Store Header */}
                <div className="text-center space-y-1.5 pb-4 border-b border-dashed border-gray-300">
                  <div className="w-12 h-12 bg-[#5D4037] text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto">
                    FB
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 uppercase">Operra Coffee & Restaurant</h4>
                  <p className="text-[10px] text-gray-500">123 Đường Ba Tháng Hai, Quận 10, TP. HCM</p>
                  <p className="text-[10px] text-gray-500">ĐT: 1900 1234 • MST: 0102030405</p>
                </div>

                {/* Bill Metadata */}
                <div className="py-4 space-y-1 border-b border-dashed border-gray-300 text-[10px]">
                  <div className="flex justify-between">
                    <span>Số HĐ:</span>
                    <span className="font-bold">{selectedInvoice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời gian:</span>
                    <span>{selectedInvoice.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bàn:</span>
                    <span className="font-bold">{selectedInvoice.table}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nhân viên:</span>
                    <span>{selectedInvoice.staff}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mã ca bán:</span>
                    <span>{selectedInvoice.cashSessionId}</span>
                  </div>
                </div>

                {/* Items list */}
                <div className="py-4 space-y-2 border-b border-dashed border-gray-300">
                  <div className="grid grid-cols-12 font-bold text-[10px] pb-1">
                    <span className="col-span-6">Tên món</span>
                    <span className="col-span-2 text-center">SL</span>
                    <span className="col-span-4 text-right">T.Tiền</span>
                  </div>
                  {selectedInvoice.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 text-[10px] leading-relaxed">
                      <div className="col-span-6 flex flex-col">
                        <span className="font-semibold text-gray-900">{item.name}</span>
                        <span className="text-gray-400 text-[9px]">{item.price.toLocaleString()}đ</span>
                      </div>
                      <span className="col-span-2 text-center font-bold">{item.qty}</span>
                      <span className="col-span-4 text-right font-semibold">
                        {(item.price * item.qty).toLocaleString()}đ
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="py-4 space-y-1.5 text-[10px] border-b border-dashed border-gray-300">
                  <div className="flex justify-between">
                    <span>Cộng tiền hàng:</span>
                    <span>{selectedInvoice.subtotal.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Chiết khấu:</span>
                    <span>-{selectedInvoice.discount.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                    <span>TỔNG CỘNG:</span>
                    <span>{selectedInvoice.amount.toLocaleString()}đ</span>
                  </div>
                </div>

                {/* Payment Detail Footer */}
                <div className="py-4 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        selectedInvoice.status === "Completed" ? "text-emerald-500" : "text-red-500"
                      }`}
                    />
                    <span className="font-bold text-[10px] uppercase">
                      {selectedInvoice.status === "Completed" ? "Đã Thanh Toán" : "Đã Bị Hủy"}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 italic">
                    Phương thức: {selectedInvoice.paymentMethod}
                  </p>
                  <div className="border border-dashed border-gray-300 p-2 rounded text-[9px] text-gray-400">
                    Cảm ơn quý khách. Hẹn gặp lại!
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions of Drawer */}
            <div className="p-4 border-t border-gray-100 flex gap-3 z-10 bg-white">
              {selectedInvoice.status === "Completed" && (
                <HasPermission permission="CANCEL_ORDER">
                  <button
                    onClick={() => handleCancelInvoice(selectedInvoice.id)}
                    className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    HỦY HÓA ĐƠN
                  </button>
                </HasPermission>
              )}
              <button
                onClick={() => handlePrint(selectedInvoice.id)}
                className="flex-1 py-3 bg-[#5D4037] hover:bg-[#4E342E] text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-[#5D4037]/20 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                IN HÓA ĐƠN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
