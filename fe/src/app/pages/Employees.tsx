import React, { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  EmployeeResponse,
  PageResponse,
  BranchResponse,
  DepartmentResponse,
  PositionResponse,
  RoleResponse,
  organizationApi,
  identityApi,
} from "../lib/api";
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

export function Employees() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<PageResponse<EmployeeResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  // Metadata for forms
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [positions, setPositions] = useState<PositionResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeResponse | null>(null);

  // Form states: Create
  const [formFullname, setFormFullname] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formPhoneNumber, setFormPhoneNumber] = useState("");
  const [formHireDay, setFormHireDay] = useState("");
  const [formStatus, setFormStatus] = useState("ACTIVE");
  const [formBranchId, setFormBranchId] = useState("");
  const [formDepartmentName, setFormDepartmentName] = useState("");
  const [formPositionName, setFormPositionName] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRoles, setFormRoles] = useState<string[]>(["EMPLOYEE"]);

  // Fetch metadata on mount
  useEffect(() => {
    organizationApi.getBranches().then((res) => {
      setBranches(res ?? []);
      if (res?.[0]) setFormBranchId(res[0].id);
    }).catch(console.error);

    organizationApi.getDepartments().then((res) => {
      setDepartments(res ?? []);
      if (res?.[0]) setFormDepartmentName(res[0].name);
    }).catch(console.error);

    organizationApi.getPositions().then((res) => {
      setPositions(res ?? []);
      if (res?.[0]) setFormPositionName(res[0].name);
    }).catch(console.error);

    identityApi.getRoles().then((res) => {
      setRoles(res ?? []);
    }).catch(console.error);
  }, []);

  // Fetch employees list
  useEffect(() => {
    let ignored = false;
    setIsLoading(true);
    setError(null);

    organizationApi
      .getEmployees({ page, size: 10 })
      .then((result) => {
        if (!ignored) {
          setEmployees(result);
        }
      })
      .catch((err: Error) => {
        if (!ignored) {
          setError(err.message);
          setEmployees(null);
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
  }, [page, reloadNonce]);

  const handleOpenFormModal = (employee: EmployeeResponse | null = null) => {
    setEditingEmployee(employee);
    if (employee) {
      setFormFullname(employee.fullname);
      setFormDob(employee.dob ?? "");
      setFormPhoneNumber(employee.phoneNumber ?? "");
      setFormHireDay(employee.hireDay ?? "");
      setFormStatus(employee.status ?? "ACTIVE");
      
      const matchedBranch = branches.find(b => b.name === employee.branchName);
      setFormBranchId(matchedBranch ? matchedBranch.id : (branches[0]?.id || ""));
      setFormDepartmentName(employee.departmentName ?? (departments[0]?.name || ""));
      setFormPositionName(employee.positionName ?? (positions[0]?.name || ""));
    } else {
      setFormFullname("");
      setFormDob("");
      setFormPhoneNumber("");
      setFormHireDay(todayDate());
      setFormStatus("ACTIVE");
      setFormUsername("");
      setFormEmail("");
      setFormRoles(["EMPLOYEE"]);
      if (branches[0]) setFormBranchId(branches[0].id);
      if (departments[0]) setFormDepartmentName(departments[0].name);
      if (positions[0]) setFormPositionName(positions[0].name);
    }
    setIsFormModalOpen(true);
  };

  const todayDate = () => {
    return new Date().toISOString().slice(0, 10);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullname.trim()) {
      toast.error("Họ tên không được để trống");
      return;
    }
    if (!formBranchId || !formDepartmentName || !formPositionName) {
      toast.error("Vui lòng điền đầy đủ cơ cấu tổ chức (chi nhánh, phòng ban, chức vụ)");
      return;
    }

    try {
      if (editingEmployee) {
        const updatePayload = {
          fullname: formFullname.trim(),
          dob: formDob || undefined,
          phoneNumber: formPhoneNumber.trim() || undefined,
          hireDay: formHireDay || undefined,
          status: formStatus,
          branchId: formBranchId,
          departmentName: formDepartmentName,
          positionName: formPositionName,
        };
        await organizationApi.updateEmployee(editingEmployee.id, updatePayload);
        toast.success("Cập nhật thông tin nhân viên thành công");
      } else {
        if (!formUsername.trim() || !formEmail.trim()) {
          toast.error("Vui lòng điền username và email để tạo tài khoản");
          return;
        }
        const createPayload = {
          fullname: formFullname.trim(),
          dob: formDob || undefined,
          phoneNumber: formPhoneNumber.trim() || undefined,
          hireDay: formHireDay || undefined,
          status: formStatus,
          branchId: formBranchId,
          departmentName: formDepartmentName,
          positionName: formPositionName,
          username: formUsername.trim().toLowerCase(),
          email: formEmail.trim().toLowerCase(),
          roles: formRoles,
        };
        await organizationApi.createEmployee(createPayload);
        toast.success("Thêm nhân viên mới thành công");
      }
      setIsFormModalOpen(false);
      setReloadNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Thao tác thất bại");
    }
  };

  const handleToggleStatus = async (employee: EmployeeResponse) => {
    const nextStatus = employee.status?.toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await organizationApi.updateEmployeeStatus(employee.id, nextStatus);
      toast.success(`Đổi trạng thái nhân viên thành ${nextStatus}`);
      setReloadNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Thao tác thất bại");
    }
  };

  const filteredEmployees = useMemo(() => {
    const data = employees?.data ?? [];
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return data;
    }

    return data.filter((employee) =>
      [employee.fullname, employee.id, employee.phoneNumber, employee.positionName, employee.departmentName]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [employees, searchTerm]);

  const totalPages = employees?.totalPages ?? 1;
  const totalElements = employees?.totalElements ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách nhân sự</h1>
          <p className="text-gray-500 text-sm">Dữ liệu lấy từ Organization Service.</p>
        </div>
        {hasPermission("MANAGE_EMPLOYEE") && (
          <button
            onClick={() => handleOpenFormModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5D4037] text-white rounded-xl font-semibold hover:bg-[#3E2723] transition-all shadow-sm shadow-stone-200"
          >
            <Plus className="w-4 h-4" />
            Thêm nhân viên mới
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]" />
          <input
            type="text"
            placeholder="Tìm theo tên, mã NV, phòng ban..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F6] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nhân viên</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vị trí & phòng ban</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-500 text-center" colSpan={5}>
                    Đang tải nhân sự...
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

              {!isLoading && !error && filteredEmployees.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-500 text-center" colSpan={5}>
                    Không có nhân sự phù hợp.
                  </td>
                </tr>
              )}

              {!isLoading &&
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EFEBE9] flex items-center justify-center text-[#5D4037] font-bold">
                          {employee.fullname?.charAt(0) ?? "E"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{employee.fullname}</p>
                          <p className="text-xs text-gray-500">{employee.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                          <Briefcase className="w-3.5 h-3.5 text-[#5D4037]" />
                          {employee.positionName ?? "Chưa có vị trí"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                          <MapPin className="w-3 h-3" />
                          {employee.departmentName ?? employee.branchName ?? "Chưa có đơn vị"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {employee.dob ? `Sinh nhật: ${employee.dob}` : "Không rõ ngày sinh"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                          <Phone className="w-3 h-3" />
                          {employee.phoneNumber ?? "Chưa có SĐT"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {hasPermission("MANAGE_EMPLOYEE") ? (
                        <button
                          onClick={() => handleToggleStatus(employee)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer hover:brightness-95 transition-all ${
                            employee.status?.toUpperCase() === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                          title="Click để đổi trạng thái"
                        >
                          {employee.status ?? "ACTIVE"}
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            employee.status?.toUpperCase() === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {employee.status ?? "ACTIVE"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {hasPermission("MANAGE_EMPLOYEE") && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenFormModal(employee)}
                            className="p-2 text-gray-400 hover:text-[#5D4037] hover:bg-[#EFEBE9] rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-xs text-gray-500">
            Trang {employees?.currentPage ?? page} / {totalPages} - tổng {totalElements} nhân viên
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 border border-gray-200 rounded-lg bg-white disabled:opacity-50"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#5D4037] text-white text-xs font-bold">{page}</button>
            <button
              className="p-1.5 border border-gray-200 rounded-lg bg-white disabled:opacity-50"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((value) => value + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DIALOG: CREATE / EDIT EMPLOYEE */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="bg-white border border-gray-100 rounded-2xl shadow-xl max-w-lg p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {editingEmployee ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editingEmployee
                ? "Thay đổi thông tin hồ sơ và phòng ban hoạt động của nhân viên."
                : "Tạo nhân viên mới kèm thông tin tài khoản đăng nhập hệ thống."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEmployee} className="space-y-4 mt-2">
            {/* Account Credentials - Only show on Create */}
            {!editingEmployee && (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-150 space-y-3">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Thông tin tài khoản đăng nhập</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username *</label>
                    <input
                      type="text"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      placeholder="vd: an.nv"
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="vd: an@operra.com"
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vai trò hệ thống</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {roles.length === 0 ? (
                      <span className="text-xs text-gray-400">Đang tải vai trò...</span>
                    ) : (
                      roles.map((r) => {
                        const isChecked = formRoles.includes(r.name);
                        return (
                          <label key={r.name} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const newRoles = isChecked
                                  ? formRoles.filter((name) => name !== r.name)
                                  : [...formRoles, r.name];
                                setFormRoles(newRoles);
                              }}
                              className="rounded border-gray-300"
                            />
                            {r.name}
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Info */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Hồ sơ cá nhân</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    value={formFullname}
                    onChange={(e) => setFormFullname(e.target.value)}
                    placeholder="vd: Nguyễn Văn An"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={formDob}
                    onChange={(e) => setFormDob(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formPhoneNumber}
                    onChange={(e) => setFormPhoneNumber(e.target.value)}
                    placeholder="vd: 0987654321"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Thông tin hợp đồng & tổ chức</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chi nhánh *</label>
                  <select
                    value={formBranchId}
                    onChange={(e) => setFormBranchId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                    required
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phòng ban *</label>
                  <select
                    value={formDepartmentName}
                    onChange={(e) => setFormDepartmentName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                    required
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chức vụ *</label>
                  <select
                    value={formPositionName}
                    onChange={(e) => setFormPositionName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                    required
                  >
                    {positions.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày vào làm</label>
                  <input
                    type="date"
                    value={formHireDay}
                    onChange={(e) => setFormHireDay(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                {editingEmployee && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Trạng thái hoạt động</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                )}
              </div>
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
                Lưu hồ sơ
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
