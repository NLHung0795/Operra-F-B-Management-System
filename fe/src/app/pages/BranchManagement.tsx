import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Edit2,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { BranchResponse, CompanyResponse, organizationApi } from "../lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { hasPermission } from "../lib/auth";

export function BranchManagement() {
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  // Modals States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchResponse | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<BranchResponse | null>(null);

  // Form fields state
  const [formCompanyId, setFormCompanyId] = useState("");
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formStatus, setFormStatus] = useState("ACTIVE");
  const [formAllowedIps, setFormAllowedIps] = useState("");

  // Load companies
  useEffect(() => {
    organizationApi
      .getCompanies()
      .then((res) => {
        setCompanies(res ?? []);
        if (res && res.length > 0) {
          setFormCompanyId(res[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load companies:", err);
      });
  }, []);

  // Load branches
  useEffect(() => {
    let ignored = false;
    setIsLoading(true);
    setError(null);

    organizationApi
      .getBranches({ 
        status: status || undefined,
        companyId: selectedCompanyId || undefined
      })
      .then((result) => {
        if (!ignored) {
          setBranches(result ?? []);
        }
      })
      .catch((err: Error) => {
        if (!ignored) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!ignored) {
          setIsLoading(false);
        }
      });

    return () => {
      ignored = true;
    };
  }, [status, selectedCompanyId, reloadNonce]);

  const handleOpenFormModal = (branch: BranchResponse | null = null) => {
    setEditingBranch(branch);
    if (branch) {
      setFormCompanyId(branch.companyId);
      setFormName(branch.name);
      setFormAddress(branch.address ?? "");
      setFormPhone(branch.phone ?? "");
      setFormStatus(branch.status ?? "ACTIVE");
      setFormAllowedIps((branch.allowedIpAddresses ?? []).join("\n"));
    } else {
      setFormName("");
      setFormAddress("");
      setFormPhone("");
      setFormStatus("ACTIVE");
      setFormAllowedIps("");
      if (companies.length > 0) {
        setFormCompanyId(companies[0].id);
      }
    }
    setIsFormModalOpen(true);
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Tên chi nhánh không được để trống");
      return;
    }
    if (!formCompanyId) {
      toast.error("Vui lòng chọn một công ty");
      return;
    }

    const payload = {
      name: formName.trim(),
      address: formAddress.trim() || undefined,
      phone: formPhone.trim() || undefined,
      status: formStatus,
      allowedIpAddresses: formAllowedIps
        .split(/[\n,]/)
        .map((ip) => ip.trim())
        .filter(Boolean),
    };

    try {
      if (editingBranch) {
        await organizationApi.updateBranch(editingBranch.companyId, editingBranch.id, payload);
        toast.success("Cập nhật chi nhánh thành công");
      } else {
        await organizationApi.createBranch(formCompanyId, payload);
        toast.success("Thêm chi nhánh thành công");
      }
      setIsFormModalOpen(false);
      setReloadNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Lưu chi nhánh thất bại");
    }
  };

  const handleDeleteBranch = async () => {
    if (!deletingBranch) return;
    try {
      await organizationApi.deleteBranch(deletingBranch.companyId, deletingBranch.id);
      toast.success("Xóa chi nhánh thành công");
      setReloadNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Xóa chi nhánh thất bại");
    } finally {
      setDeletingBranch(null);
    }
  };

  const handleToggleStatus = async (branch: BranchResponse) => {
    const nextStatus = branch.status?.toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await organizationApi.updateBranchStatus(branch.id, nextStatus);
      toast.success(`Đổi trạng thái chi nhánh thành ${nextStatus}`);
      setReloadNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Đổi trạng thái thất bại");
    }
  };

  const filteredBranches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return branches;
    }
    return branches.filter((branch) =>
      [branch.name, branch.address, branch.phone, branch.status]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [branches, searchTerm]);

  const getStatusStyle = (value?: string) => {
    switch (value?.toUpperCase()) {
      case "ACTIVE":
      case "OPEN":
        return "bg-emerald-50 text-emerald-700";
      case "INACTIVE":
      case "CLOSED":
        return "bg-red-50 text-red-700";
      case "MAINTENANCE":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name ?? companyId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chi nhánh</h1>
          <p className="text-gray-500 text-sm mt-1">Dữ liệu lấy từ Organization Service.</p>
        </div>
        {hasPermission("MANAGE_BRANCH") && (
          <button
            onClick={() => handleOpenFormModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5D4037] text-white rounded-xl font-bold hover:bg-[#3E2723] transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Thêm chi nhánh
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-[#FAF9F6] flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]" />
            <input
              type="text"
              placeholder="Tìm theo tên chi nhánh, địa chỉ, SĐT..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all"
            />
          </div>
          {hasPermission("MANAGE_BRANCH") && (
            <select
              value={selectedCompanyId}
              onChange={(event) => setSelectedCompanyId(event.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all outline-none"
            >
              <option value="">Tất cả công ty</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Chi nhánh</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Công ty</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                {hasPermission("MANAGE_BRANCH") && (
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-500 text-center" colSpan={5}>
                    Đang tải chi nhánh...
                  </td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td className="px-6 py-8 text-sm text-red-600 text-center" colSpan={5}>
                    {error}
                  </td>
                </tr>
              )}

              {!isLoading && !error && filteredBranches.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-500 text-center" colSpan={5}>
                    Không có chi nhánh phù hợp.
                  </td>
                </tr>
              )}

              {!isLoading &&
                filteredBranches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-[#FAF9F6] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#EFEBE9] rounded-xl flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-[#5D4037]" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{branch.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[260px]">
                            {branch.address ?? "Chưa có địa chỉ"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {branch.phone ?? "Chưa có SĐT"}
                        </div>
                        <div className="text-xs text-gray-500">
                          IP chấm công:{" "}
                          {branch.allowedIpAddresses && branch.allowedIpAddresses.length > 0
                            ? branch.allowedIpAddresses.join(", ")
                            : "Chưa cấu hình"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-3.5 h-3.5 text-[#8D6E63]" />
                        {getCompanyName(branch.companyId)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {hasPermission("MANAGE_BRANCH") ? (
                        <button
                          onClick={() => handleToggleStatus(branch)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer hover:brightness-95 ${getStatusStyle(
                            branch.status
                          )}`}
                          title="Click để đổi trạng thái nhanh"
                        >
                          {branch.status?.toUpperCase() === "ACTIVE" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {branch.status ?? "UNKNOWN"}
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                            branch.status
                          )}`}
                        >
                          {branch.status?.toUpperCase() === "ACTIVE" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {branch.status ?? "UNKNOWN"}
                        </span>
                      )}
                    </td>
                    {hasPermission("MANAGE_BRANCH") && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenFormModal(branch)}
                            className="p-2 text-gray-400 hover:text-[#5D4037] hover:bg-[#EFEBE9] rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingBranch(branch)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIALOG: CREATE / EDIT BRANCH */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="bg-white border border-gray-100 rounded-2xl shadow-xl max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {editingBranch ? "Cập nhật chi nhánh" : "Thêm chi nhánh mới"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Điền các thông tin của chi nhánh. Chi nhánh cần thuộc về một công ty trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveBranch} className="space-y-4 mt-2">
            {!editingBranch && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Thuộc công ty *
                </label>
                <select
                  value={formCompanyId}
                  onChange={(e) => setFormCompanyId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all"
                  required
                >
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Tên chi nhánh *
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ví dụ: Chi nhánh Quận 1, Chi nhánh Hà Nội..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="Số nhà, tên đường, quận, thành phố..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="09xxx..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Trạng thái
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                IP chấm công được phép
              </label>
              <textarea
                value={formAllowedIps}
                onChange={(e) => setFormAllowedIps(e.target.value)}
                placeholder={"Nhập mỗi IP một dòng hoặc phân tách bằng dấu phẩy\nVí dụ: 113.161.10.20\n127.0.0.1"}
                rows={4}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all resize-y"
              />
              <p className="mt-1 text-xs text-gray-400">
                Scheduling service sẽ dùng danh sách này để kiểm tra IP khi chấm công bằng NETWORK.
              </p>
            </div>
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#5D4037] text-white rounded-xl text-sm font-semibold hover:bg-[#3E2723] transition-all shadow-sm"
              >
                Lưu lại
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: DELETE CONFIRMATION */}
      <Dialog open={deletingBranch !== null} onOpenChange={(open) => !open && setDeletingBranch(null)}>
        <DialogContent className="bg-white border border-gray-100 rounded-2xl shadow-xl max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="text-md font-bold text-gray-900">Xác nhận xóa chi nhánh</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              Hành động này sẽ xóa chi nhánh "{deletingBranch?.name}" vĩnh viễn khỏi hệ thống. Bạn có chắc chắn muốn xóa?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setDeletingBranch(null)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleDeleteBranch}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all shadow-sm"
            >
              Đồng ý xóa
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
