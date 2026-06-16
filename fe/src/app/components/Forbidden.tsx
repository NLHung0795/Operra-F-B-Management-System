import React from "react";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router";

export function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 shadow-md border border-amber-100 animate-pulse">
        <ShieldAlert className="w-10 h-10 text-amber-600" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
        Không có quyền truy cập
      </h1>
      <p className="text-gray-500 max-w-md mb-8 text-sm sm:text-base leading-relaxed">
        Tài khoản của bạn không được cấp quyền để truy cập trang này. Vui lòng liên hệ với quản trị viên hoặc sử dụng tài khoản có quyền phù hợp.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2.5 bg-[#5D4037] hover:bg-[#3E2723] text-white rounded-xl font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
      >
        Quay lại Trang chủ
      </button>
    </div>
  );
}
