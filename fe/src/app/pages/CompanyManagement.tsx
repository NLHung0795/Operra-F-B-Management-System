import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Edit2,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  taxCode: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  status: 'Active' | 'Inactive';
  branchesCount: number;
}

const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Công ty Cổ phần F&B Việt Nam',
    taxCode: '0102345678',
    email: 'contact@fbvn.com',
    phone: '024 3974 1234',
    address: 'Số 1 Đào Duy Anh, Phương Mai, Đống Đa, Hà Nội',
    website: 'https://fbvn.com',
    status: 'Active',
    branchesCount: 12
  },
  {
    id: '2',
    name: 'Hệ thống Coffee & Tea Global',
    taxCode: '0312987654',
    email: 'info@ctglobal.vn',
    phone: '028 3823 5678',
    address: '88 Hàm Nghi, Bến Nghé, Quận 1, TP. HCM',
    website: 'https://ctglobal.vn',
    status: 'Active',
    branchesCount: 8
  }
];

export function CompanyManagement() {
  const [companies] = useState<Company[]>(MOCK_COMPANIES);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.taxCode.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Công ty</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý thông tin pháp nhân và các đơn vị kinh doanh chính.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5D4037] text-white rounded-xl font-bold hover:bg-[#3E2723] transition-all shadow-sm">
          <Plus className="w-5 h-5" />
          Thêm Công ty
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-[#FAF9F6] flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]" />
            <input 
              type="text" 
              placeholder="Tìm theo tên công ty hoặc mã số thuế..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Công ty</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin liên hệ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Chi nhánh</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#EFEBE9] rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-[#5D4037]" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{company.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">MST: {company.taxCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {company.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {company.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className="px-2.5 py-1 bg-[#FAF9F6] text-gray-700 rounded-full text-xs font-bold">
                        {company.branchesCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {company.status === 'Active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#5D4037] hover:bg-[#EFEBE9] rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
