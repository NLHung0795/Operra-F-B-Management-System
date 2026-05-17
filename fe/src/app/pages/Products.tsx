import React from 'react';
import { Coffee, Plus, Tag, Search, MoreHorizontal } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Cà phê Đen', price: 25000, category: 'Cà phê', stock: 'Không giới hạn' },
  { id: 2, name: 'Trà Đào Cam Sả', price: 45000, category: 'Trà', stock: 'Hết hàng' },
  { id: 3, name: 'Bánh Sừng Trâu', price: 35000, category: 'Bánh', stock: 12 },
];

export function Products() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Thực đơn (Menu)</h1>
          <p className="text-gray-500 text-sm">Thêm món, phân loại và cài đặt giá bán</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm món..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] rounded-xl text-white text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            Thêm món mới
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Tên món</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Danh mục</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700">Giá bán</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">Tồn kho</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PRODUCTS.map(product => (
              <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 font-bold text-gray-900">{product.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-[#007AFF]">{product.price.toLocaleString()}đ</td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-sm font-semibold ${product.stock === 'Hết hàng' ? 'text-red-500' : 'text-gray-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
