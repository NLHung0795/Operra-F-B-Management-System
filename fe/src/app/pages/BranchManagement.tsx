import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  MoreVertical,
  Edit2,
  Trash2,
  Map,
  Users,
  Coffee,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  staffCount: number;
  status: 'Open' | 'Closed' | 'Maintenance';
  type: 'Cafe' | 'Restaurant' | 'Bistro';
  company: string;
}

const MOCK_BRANCHES: Branch[] = [
  {
    id: '1',
    name: 'Chi nhánh Quận 1 - Lê Lợi',
    address: '123 Lê Lợi, P. Bến Thành, Quận 1, TP. HCM',
    phone: '028 3823 4567',
    manager: 'Nguyễn Văn An',
    staffCount: 15,
    status: 'Open',
    type: 'Cafe',
    company: 'Công ty Cổ phần F&B Việt Nam'
  },
  {
    id: '2',
    name: 'Chi nhánh Quận 3 - Tú Xương',
    address: '45 Tú Xương, P. 7, Quận 3, TP. HCM',
    phone: '028 3932 7890',
    manager: 'Trần Thị Bình',
    staffCount: 12,
    status: 'Open',
    type: 'Restaurant',
    company: 'Công ty Cổ phần F&B Việt Nam'
  },
  {
    id: '3',
    name: 'Chi nhánh Đống Đa - Xã Đàn',
    address: '18 Xã Đàn, Phương Liên, Đống Đa, Hà Nội',
    phone: '024 3573 1122',
    manager: 'Lê Văn Cường',
    staffCount: 20,
    status: 'Open',
    type: 'Cafe',
    company: 'Hệ thống Coffee & Tea Global'
  },
  {
    id: '4',
    name: 'Chi nhánh Cầu Giấy - Xuân Thủy',
    address: '99 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    phone: '024 3768 5566',
    manager: 'Phạm Minh Đức',
    staffCount: 8,
    status: 'Maintenance',
    type: 'Bistro',
    company: 'Hệ thống Coffee & Tea Global'
  }
];

export function BranchManagement() {
  const [branches] = useState<Branch[]>(MOCK_BRANCHES);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-emerald-50 text-emerald-700';
      case 'Closed': return 'bg-red-50 text-red-700';
      case 'Maintenance': return 'bg-amber-50 text-amber-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Open': return 'Đang mở';
      case 'Closed': return 'Đã đóng';
      case 'Maintenance': return 'Bảo trì';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Chi nhánh</h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách các điểm bán hàng và trung tâm vận hành.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5D4037] text-white rounded-xl font-bold hover:bg-[#3E2723] transition-all shadow-sm">
          <Plus className="w-5 h-5" />
          Thêm Chi nhánh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-[#FAF9F6] flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]" />
            <input 
              type="text" 
              placeholder="Tìm theo tên chi nhánh hoặc địa chỉ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all outline-none">
              <option value="">Tất cả công ty</option>
              <option value="fbvn">F&B Việt Nam</option>
              <option value="global">Global Coffee</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Chi nhánh</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nhân sự</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="hover:bg-[#FAF9F6] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#EFEBE9] rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-[#5D4037]" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{branch.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{branch.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-3.5 h-3.5 text-[#8D6E63]" />
                        {branch.company}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {branch.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#8D6E63]" />
                        {branch.staffCount} nhân viên
                      </div>
                      <div className="text-xs text-gray-500">Quản lý: {branch.manager}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(branch.status)}`}>
                      {branch.status === 'Open' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {getStatusText(branch.status)}
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
