import React, { useEffect, useState } from "react";
import {
  Building2,
  Briefcase,
  KeyRound,
  ShieldAlert,
  Users,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DepartmentResponse,
  PositionResponse,
  RoleResponse,
  PermissionResponse,
  UserAccountCreationResponse,
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

export function Settings() {
  const [activeTab, setActiveTab] = useState<"dept" | "pos" | "role" | "perm" | "account">("dept");

  // Metadata arrays
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [positions, setPositions] = useState<PositionResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [accounts, setAccounts] = useState<UserAccountCreationResponse[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Reload triggers
  const [reloadNonce, setReloadNonce] = useState(0);

  // Common Dialog States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null); // holds the item to edit

  // Form fields states
  // 1. Department
  const [deptForm, setDeptForm] = useState({ name: "", description: "" });
  // 2. Position
  const [posForm, setPosForm] = useState({ name: "", description: "", level: "STAFF", baseSalary: 5000000 });
  // 3. Role
  const [roleForm, setRoleForm] = useState({ name: "", description: "", selectedPerms: [] as string[] });
  // 4. Permission
  const [permForm, setPermForm] = useState({ name: "", description: "" });
  // 5. Account Creation
  const [accForm, setAccForm] = useState({
    username: "",
    email: "",
    password: "",
    roles: ["EMPLOYEE"] as string[],
    permissions: [] as string[],
    status: "active"
  });

  // Delete confirms
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string | null>(null); // for roles & permissions deletion

  // Show password for new user account
  const [showPassword, setShowPassword] = useState(false);

  // Load active tab data
  useEffect(() => {
    setIsLoading(true);
    const loadData = async () => {
      try {
        if (activeTab === "dept") {
          const res = await organizationApi.getDepartments();
          setDepartments(res ?? []);
        } else if (activeTab === "pos") {
          const res = await organizationApi.getPositions();
          setPositions(res ?? []);
        } else if (activeTab === "role") {
          const res = await identityApi.getRoles();
          setRoles(res ?? []);
        } else if (activeTab === "perm") {
          const res = await identityApi.getPermissions();
          setPermissions(res ?? []);
        } else if (activeTab === "account") {
          const res = await identityApi.getUserAccounts();
          setAccounts(res ?? []);
          // Also fetch roles to let user choose when creating accounts
          const rolesRes = await identityApi.getRoles();
          setRoles(rolesRes ?? []);
          // Also fetch permissions for direct permission assignment
          const permissionsRes = await identityApi.getPermissions();
          setPermissions(permissionsRes ?? []);
        }
      } catch (err: any) {
        toast.error("Lỗi khi tải dữ liệu: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [activeTab, reloadNonce]);

  // Open creation modal
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    if (activeTab === "dept") {
      setDeptForm({ name: "", description: "" });
    } else if (activeTab === "pos") {
      setPosForm({ name: "", description: "", level: "STAFF", baseSalary: 5000000 });
    } else if (activeTab === "role") {
      setRoleForm({ name: "", description: "", selectedPerms: [] });
    } else if (activeTab === "perm") {
      setPermForm({ name: "", description: "" });
    } else if (activeTab === "account") {
      setAccForm({
        username: "",
        email: "",
        password: "",
        roles: ["EMPLOYEE"],
        permissions: [],
        status: "active"
      });
      setShowPassword(false);
    }
    setIsModalOpen(true);
  };

  // Open editing modal
  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    if (activeTab === "dept") {
      setDeptForm({ name: item.name, description: item.description ?? "" });
    } else if (activeTab === "pos") {
      setPosForm({
        name: item.name,
        description: item.description ?? "",
        level: item.level ?? "STAFF",
        baseSalary: item.baseSalary ?? 5000000,
      });
    } else if (activeTab === "role") {
      setRoleForm({
        name: item.name,
        description: item.description ?? "",
        selectedPerms: item.permissions ? item.permissions.map((p: any) => p.name) : [],
      });
    } else if (activeTab === "perm") {
      setPermForm({
        name: item.name,
        description: item.description ?? "",
      });
    } else if (activeTab === "account") {
      setAccForm({
        username: item.username,
        email: item.email,
        password: "",
        roles: item.roles ?? [],
        permissions: item.permissions ?? [],
        status: item.status ?? "active"
      });
    }
    setIsModalOpen(true);
  };

  // Form Submit Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "dept") {
        if (!deptForm.name.trim()) return toast.error("Vui lòng nhập tên");
        if (editingItem) {
          await organizationApi.updateDepartment(editingItem.id, deptForm);
          toast.success("Cập nhật phòng ban thành công");
        } else {
          await organizationApi.createDepartment(deptForm);
          toast.success("Thêm phòng ban thành công");
        }
      } else if (activeTab === "pos") {
        if (!posForm.name.trim()) return toast.error("Vui lòng nhập tên");
        if (editingItem) {
          await organizationApi.updatePosition(editingItem.id, posForm);
          toast.success("Cập nhật chức vụ thành công");
        } else {
          await organizationApi.createPosition(posForm);
          toast.success("Thêm chức vụ thành công");
        }
      } else if (activeTab === "role") {
        if (!roleForm.name.trim()) return toast.error("Vui lòng nhập tên vai trò");
        if (editingItem) {
          await identityApi.updateRole(editingItem.name, {
            description: roleForm.description.trim() || undefined,
            permissions: roleForm.selectedPerms,
          });
          toast.success("Cập nhật vai trò thành công");
        } else {
          await identityApi.createRole({
            name: roleForm.name.trim().toUpperCase(),
            description: roleForm.description.trim() || undefined,
            permissions: roleForm.selectedPerms,
          });
          toast.success("Thêm vai trò thành công");
        }
      } else if (activeTab === "perm") {
        if (!permForm.name.trim()) return toast.error("Vui lòng nhập tên quyền hạn");
        if (editingItem) {
          await identityApi.updatePermission(editingItem.name, {
            description: permForm.description.trim() || undefined,
          });
          toast.success("Cập nhật quyền hạn thành công");
        } else {
          await identityApi.createPermission({
            name: permForm.name.trim().toLowerCase(),
            description: permForm.description.trim() || undefined,
          });
          toast.success("Thêm quyền hạn thành công");
        }
      } else if (activeTab === "account") {
        if (editingItem) {
          await identityApi.updateUserAccount(editingItem.id, {
            roles: accForm.roles,
            permissions: accForm.permissions,
            status: accForm.status,
          });
          toast.success("Cập nhật tài khoản người dùng thành công");
        } else {
          if (!accForm.username.trim() || !accForm.email.trim() || !accForm.password.trim()) {
            return toast.error("Vui lòng nhập đầy đủ thông tin");
          }
          await identityApi.registerUserAccount({
            username: accForm.username.trim().toLowerCase(),
            email: accForm.email.trim().toLowerCase(),
            password: accForm.password,
            status: "active",
            roles: accForm.roles,
            permissions: accForm.permissions,
          });
          toast.success("Đăng ký tài khoản người dùng thành công");
        }
      }

      setIsModalOpen(false);
      setReloadNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Thao tác thất bại");
    }
  };

  // Delete Action
  const handleDelete = async () => {
    try {
      if (activeTab === "dept" && deletingId) {
        await organizationApi.deleteDepartment(deletingId);
        toast.success("Xóa phòng ban thành công");
      } else if (activeTab === "pos" && deletingId) {
        await organizationApi.deletePosition(deletingId);
        toast.success("Xóa chức vụ thành công");
      } else if (activeTab === "role" && deletingName) {
        await identityApi.deleteRole(deletingName);
        toast.success("Xóa vai trò thành công");
      } else if (activeTab === "perm" && deletingName) {
        await identityApi.deletePermission(deletingName);
        toast.success("Xóa quyền hạn thành công");
      } else if (activeTab === "account" && deletingId) {
        await identityApi.deleteUserAccount(deletingId);
        toast.success("Xóa tài khoản thành công");
      }
      setReloadNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Xóa thất bại");
    } finally {
      setDeletingId(null);
      setDeletingName(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-500 text-sm">Quản lý các danh mục Phòng ban, Chức vụ, Vai trò và Tài khoản người dùng.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5D4037] text-white rounded-xl font-bold hover:bg-[#3E2723] transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tạo cấu hình mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-1 h-fit">
          <button
            onClick={() => setActiveTab("dept")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "dept"
                ? "bg-[#FAF9F6] text-[#3E2723] shadow-inner font-bold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Phòng ban (Departments)
          </button>
          <button
            onClick={() => setActiveTab("pos")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "pos"
                ? "bg-[#FAF9F6] text-[#3E2723] shadow-inner font-bold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Chức vụ (Positions)
          </button>
          <button
            onClick={() => setActiveTab("role")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "role"
                ? "bg-[#FAF9F6] text-[#3E2723] shadow-inner font-bold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Vai trò (Roles)
          </button>
          <button
            onClick={() => setActiveTab("perm")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "perm"
                ? "bg-[#FAF9F6] text-[#3E2723] shadow-inner font-bold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Quyền hạn (Permissions)
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "account"
                ? "bg-[#FAF9F6] text-[#3E2723] shadow-inner font-bold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4" />
            Tài khoản (User Accounts)
          </button>
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3 bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="w-8 h-8 border-4 border-[#5D4037]/30 border-t-[#5D4037] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* TAB 1: DEPARTMENTS */}
              {activeTab === "dept" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Phòng ban</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mô tả</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {departments.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-400">Không có phòng ban nào.</td>
                        </tr>
                      ) : (
                        departments.map((d) => (
                          <tr key={d.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900 text-sm">{d.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{d.id}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{d.description || "-"}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(d)}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-blue-600 rounded transition-all"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeletingId(d.id);
                                    setDeletingName(d.name);
                                  }}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-red-600 rounded transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 2: POSITIONS */}
              {activeTab === "pos" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Chức vụ</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cấp bậc</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Lương cơ bản</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {positions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">Không có chức vụ nào.</td>
                        </tr>
                      ) : (
                        positions.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{p.id}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-xs font-semibold">
                                {p.level}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 font-mono font-bold text-center">
                              {p.baseSalary?.toLocaleString("vi-VN")} đ
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-blue-600 rounded transition-all"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeletingId(p.id);
                                    setDeletingName(p.name);
                                  }}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-red-600 rounded transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: ROLES */}
              {activeTab === "role" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vai trò</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mô tả</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Quyền hạn sở hữu</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {roles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">Không có vai trò nào.</td>
                        </tr>
                      ) : (
                        roles.map((r) => (
                          <tr key={r.name} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-bold text-gray-900 text-sm">{r.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{r.description || "-"}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div className="flex flex-wrap gap-1">
                                {r.permissions && r.permissions.length > 0 ? (
                                  r.permissions.map((p) => (
                                    <span key={p.name} className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                      {p.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-400 italic">Không có quyền hạn nào</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(r)}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-blue-600 rounded transition-all"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeletingName(r.name);
                                    setDeletingId("dummy_role");
                                  }}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-red-600 rounded transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 4: PERMISSIONS */}
              {activeTab === "perm" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mã quyền hạn (Permission Name)</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mô tả</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {permissions.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-400">Không có quyền hạn nào.</td>
                        </tr>
                      ) : (
                        permissions.map((p) => (
                          <tr key={p.name} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 text-sm text-gray-900 font-mono font-semibold">{p.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{p.description || "-"}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-blue-600 rounded transition-all"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeletingName(p.name);
                                    setDeletingId("dummy_perm");
                                  }}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-red-600 rounded transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 5: USER ACCOUNTS */}
              {activeTab === "account" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tài khoản</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vai trò & Quyền gán</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {accounts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">Không có tài khoản nào.</td>
                        </tr>
                      ) : (
                        accounts.map((a) => (
                          <tr key={a.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900 text-sm">{a.username}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{a.id}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{a.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                a.status === "active" || a.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}>
                                {a.status || "active"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div className="space-y-1">
                                <div className="flex flex-wrap gap-1">
                                  {a.roles && a.roles.length > 0 ? (
                                    a.roles.map((roleName) => (
                                      <span key={roleName} className="bg-amber-50 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border border-amber-200">
                                        {roleName}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-gray-400">Không có vai trò</span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {a.permissions && a.permissions.length > 0 ? (
                                    a.permissions.map((permName) => (
                                      <span key={permName} className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium border border-blue-200">
                                        {permName}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-gray-400 italic">Không có quyền trực tiếp</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(a)}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-blue-600 rounded transition-all"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeletingId(a.id);
                                    setDeletingName(a.username);
                                  }}
                                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-red-600 rounded transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* CREATION / EDIT DIALOGS */}
      {/* ---------------------------------------------------- */}

      {/* DIALOG: CREATE / EDIT DEPT, POS, ROLE, PERM, ACCOUNT */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white border border-gray-100 rounded-2xl shadow-xl max-w-md p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {editingItem ? "Cập nhật" : "Tạo cấu hình mới"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Thiết lập thông tin danh mục tương ứng.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* DEPARTMENT FORM */}
            {activeTab === "dept" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tên phòng ban *</label>
                  <input
                    type="text"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                    placeholder="vd: Phòng Kỹ thuật, Phòng Nhân sự..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mô tả phòng ban</label>
                  <textarea
                    value={deptForm.description}
                    onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                    placeholder="Nhập mô tả ngắn..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 h-20"
                  />
                </div>
              </>
            )}

            {/* POSITION FORM */}
            {activeTab === "pos" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tên chức vụ *</label>
                  <input
                    type="text"
                    value={posForm.name}
                    onChange={(e) => setPosForm({ ...posForm, name: e.target.value })}
                    placeholder="vd: Quản lý cửa hàng, Thu ngân..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cấp bậc</label>
                    <select
                      value={posForm.level}
                      onChange={(e) => setPosForm({ ...posForm, level: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="STAFF">STAFF</option>
                      <option value="LEADER">LEADER</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="DIRECTOR">DIRECTOR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lương cơ bản (đ)</label>
                    <input
                      type="number"
                      value={posForm.baseSalary}
                      onChange={(e) => setPosForm({ ...posForm, baseSalary: Number(e.target.value) })}
                      min={0}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mô tả công việc</label>
                  <textarea
                    value={posForm.description}
                    onChange={(e) => setPosForm({ ...posForm, description: e.target.value })}
                    placeholder="Mô tả công việc..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm h-20 focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* ROLE FORM */}
            {activeTab === "role" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mã vai trò *</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value.toUpperCase() })}
                    placeholder="vd: STAFF, CASHIER, STORE_MANAGER"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    required
                    disabled={!!editingItem}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mô tả vai trò</label>
                  <input
                    type="text"
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    placeholder="Mô tả quyền hạn của vai trò..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Quyền hạn đi kèm</label>
                  <div className="border rounded-xl p-3 max-h-36 overflow-y-auto space-y-2 mt-1 bg-gray-50/50">
                    {permissions.length === 0 ? (
                      <p className="text-xs text-gray-400">Không có quyền hạn nào được tạo trước đó.</p>
                    ) : (
                      permissions.map((p) => {
                        const isChecked = roleForm.selectedPerms.includes(p.name);
                        return (
                          <label key={p.name} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const newPerms = isChecked
                                  ? roleForm.selectedPerms.filter((name) => name !== p.name)
                                  : [...roleForm.selectedPerms, p.name];
                                setRoleForm({ ...roleForm, selectedPerms: newPerms });
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-xs font-mono text-gray-700">{p.name}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}

            {/* PERMISSION FORM */}
            {activeTab === "perm" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mã quyền hạn *</label>
                  <input
                    type="text"
                    value={permForm.name}
                    onChange={(e) => setPermForm({ ...permForm, name: e.target.value.toLowerCase() })}
                    placeholder="vd: employee:read, order:create..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    required
                    disabled={!!editingItem}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mô tả quyền hạn</label>
                  <input
                    type="text"
                    value={permForm.description}
                    onChange={(e) => setPermForm({ ...permForm, description: e.target.value })}
                    placeholder="vd: Xem danh sách nhân viên..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* USER ACCOUNT FORM */}
            {activeTab === "account" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tên đăng nhập *</label>
                    <input
                      type="text"
                      value={accForm.username}
                      onChange={(e) => setAccForm({ ...accForm, username: e.target.value })}
                      placeholder="vd: admin.fabi"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                      required
                      disabled={!!editingItem}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email *</label>
                    <input
                      type="email"
                      value={accForm.email}
                      onChange={(e) => setAccForm({ ...accForm, email: e.target.value })}
                      placeholder="vd: admin@operra.com"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                      required
                      disabled={!!editingItem}
                    />
                  </div>
                </div>
                {!editingItem && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mật khẩu tài khoản *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={accForm.password}
                        onChange={(e) => setAccForm({ ...accForm, password: e.target.value })}
                        placeholder="Tối thiểu 6 ký tự..."
                        className="w-full pl-3 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
                {editingItem && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Trạng thái tài khoản</label>
                    <select
                      value={accForm.status}
                      onChange={(e) => setAccForm({ ...accForm, status: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="active">Hoạt động (Active)</option>
                      <option value="inactive">Khóa (Inactive)</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Gán vai trò (Roles)</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {roles.length === 0 ? (
                      <span className="text-xs text-gray-400">Chưa có vai trò nào được tạo.</span>
                    ) : (
                      roles.map((r) => {
                        const isChecked = accForm.roles.includes(r.name);
                        return (
                          <label key={r.name} className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-200 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const newRoles = isChecked
                                  ? accForm.roles.filter((name) => name !== r.name)
                                  : [...accForm.roles, r.name];
                                setAccForm({ ...accForm, roles: newRoles });
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
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Gán quyền trực tiếp (Direct Permissions)</label>
                  <div className="border rounded-xl p-3 max-h-36 overflow-y-auto space-y-2 mt-1 bg-gray-50/50">
                    {permissions.length === 0 ? (
                      <p className="text-xs text-gray-400">Không có quyền hạn nào được tạo trước đó.</p>
                    ) : (
                      permissions.map((p) => {
                        const isChecked = accForm.permissions.includes(p.name);
                        return (
                          <label key={p.name} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const newPerms = isChecked
                                  ? accForm.permissions.filter((name) => name !== p.name)
                                  : [...accForm.permissions, p.name];
                                setAccForm({ ...accForm, permissions: newPerms });
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-xs font-mono text-gray-700">{p.name}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#5D4037] text-white rounded-xl text-sm font-semibold hover:bg-[#3E2723] transition-all shadow-sm"
              >
                {editingItem ? "Cập nhật" : "Tạo cấu hình"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: DELETE CONFIRMATION */}
      <Dialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="bg-white border border-gray-100 rounded-2xl shadow-xl max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="text-md font-bold text-gray-900">Xác nhận xóa danh mục</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              Hành động này sẽ xóa vĩnh viễn "{deletingName}" khỏi hệ thống và có thể ảnh hưởng đến các cấu hình nhân sự liên quan. Bạn có chắc chắn muốn xóa?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setDeletingId(null)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleDelete}
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
