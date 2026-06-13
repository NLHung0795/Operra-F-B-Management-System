import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Filter, Plus, Users, Edit, Trash2, User, RefreshCw, X } from "lucide-react";
import {
  BranchResponse,
  ShiftAssignmentResponse,
  WorkAssignmentResponse,
  EmployeeResponse,
  organizationApi,
  schedulingApi,
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

const today = new Date().toISOString().slice(0, 10);

export const formatShiftTime = (start?: string, end?: string) => {
  if (!start || !end) return "";

  // Special case requested by user
  if (start.startsWith("08:00") && end.startsWith("00:00")) {
    return "từ 0h đến 23h59";
  }
  if (start.startsWith("00:00") && end.startsWith("00:00")) {
    return "từ 0h đến 23h59";
  }

  const formatPart = (timeStr: string, isEnd: boolean) => {
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return timeStr.slice(0, 5);
    
    if (isEnd && h === 0 && m === 0) return "23h59";
    
    return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
  };
  return `từ ${formatPart(start, false)} đến ${formatPart(end, true)}`;
};

export function Shifts() {
  // Navigation & Base States
  const [viewMode, setViewMode] = useState<"branch" | "employee">("branch");
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [branchId, setBranchId] = useState("");
  const [date, setDate] = useState(today);
  const [shiftType, setShiftType] = useState("");
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);

  // Data States
  const [workAssignments, setWorkAssignments] = useState<WorkAssignmentResponse[]>([]);
  const [shiftAssignments, setShiftAssignments] = useState<ShiftAssignmentResponse[]>([]);
  
  // Reload triggers
  const [reloadWorkNonce, setReloadWorkNonce] = useState(0);
  const [reloadShiftNonce, setReloadShiftNonce] = useState(0);

  // Loading & Error states
  const [isLoadingWork, setIsLoadingWork] = useState(true);
  const [isLoadingShifts, setIsLoadingShifts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Employee-specific Schedule Viewer States
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().slice(0, 10);
  });
  const [employeeShifts, setEmployeeShifts] = useState<ShiftAssignmentResponse[]>([]);
  const [isLoadingEmpShifts, setIsLoadingEmpShifts] = useState(false);

  // Modals States: Work Assignment (Shift Template)
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkAssignmentResponse | null>(null);
  const [workForm, setWorkForm] = useState({
    name: "",
    shiftType: "MORNING",
    startTime: "08:00",
    endTime: "16:00",
    breakTime: 30,
  });

  // Modals States: Shift Assignment Create (Single/Bulk)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTab, setAssignTab] = useState<"single" | "bulk">("single");
  const [assignForm, setAssignForm] = useState({
    employeeId: "",
    workAssignmentId: "",
    date: today,
    assignedBy: "",
  });
  const [bulkAssignForm, setBulkAssignForm] = useState({
    selectedEmployeeIds: [] as string[],
    workAssignmentId: "",
    date: today,
    assignedBy: "",
  });

  // Modals States: Shift Assignment Edit
  const [isEditAssignModalOpen, setIsEditAssignModalOpen] = useState(false);
  const [editingAssign, setEditingAssign] = useState<ShiftAssignmentResponse | null>(null);
  const [editAssignForm, setEditAssignForm] = useState({
    workAssignmentId: "",
    date: today,
    assignedBy: "",
  });

  // Modals States: Deletions Confirmations
  const [deletingWorkId, setDeletingWorkId] = useState<string | null>(null);
  const [deletingAssignId, setDeletingAssignId] = useState<string | null>(null);

  // Load branches on mount
  useEffect(() => {
    organizationApi
      .getBranches()
      .then((branchResult) => {
        setBranches(branchResult ?? []);
        if (branchResult?.[0]?.id) {
          setBranchId(branchResult[0].id);
        }
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  }, []);

  // Load employees when branchId changes
  useEffect(() => {
    if (!branchId) {
      setEmployees([]);
      return;
    }
    organizationApi
      .getEmployeesByBranch(branchId)
      .then((res) => {
        setEmployees(res ?? []);
        // Initialize default assignedBy fields
        if (res && res.length > 0) {
          setAssignForm((prev) => ({ ...prev, assignedBy: res[0].id }));
          setBulkAssignForm((prev) => ({ ...prev, assignedBy: res[0].id }));
          setEditAssignForm((prev) => ({ ...prev, assignedBy: res[0].id }));
        }
      })
      .catch((err) => {
        console.error("Failed to load employees for branch:", err);
      });
  }, [branchId]);

  // Load work assignments (Shift Templates)
  useEffect(() => {
    let ignored = false;
    setIsLoadingWork(true);
    schedulingApi
      .getWorkAssignments({ shiftType: shiftType || undefined })
      .then((workResult) => {
        if (!ignored) {
          setWorkAssignments(workResult ?? []);
        }
      })
      .catch((err: Error) => {
        if (!ignored) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!ignored) {
          setIsLoadingWork(false);
        }
      });

    return () => {
      ignored = true;
    };
  }, [shiftType, reloadWorkNonce]);

  // Load shift assignments by branch and date
  useEffect(() => {
    let ignored = false;
    if (!branchId || !date) {
      setShiftAssignments([]);
      return;
    }

    setIsLoadingShifts(true);
    schedulingApi
      .getShiftAssignmentsByBranchAndDate(branchId, date)
      .then((result) => {
        if (!ignored) {
          setShiftAssignments(result ?? []);
        }
      })
      .catch((err: Error) => {
        if (!ignored) {
          setError(err.message);
          setShiftAssignments([]);
        }
      })
      .finally(() => {
        if (!ignored) {
          setIsLoadingShifts(false);
        }
      });

    return () => {
      ignored = true;
    };
  }, [branchId, date, reloadShiftNonce]);

  // Load Employee Specific Schedule
  const loadEmployeeSchedule = () => {
    if (!selectedEmployeeId || !fromDate || !toDate) {
      toast.error("Vui lòng chọn nhân viên và khoảng ngày");
      return;
    }
    setIsLoadingEmpShifts(true);
    schedulingApi
      .getShiftAssignments({
        employeeId: selectedEmployeeId,
        fromDate,
        toDate,
      })
      .then((res) => {
        setEmployeeShifts(res ?? []);
      })
      .catch((err) => {
        toast.error("Lỗi khi tải lịch phân ca: " + err.message);
      })
      .finally(() => {
        setIsLoadingEmpShifts(false);
      });
  };

  useEffect(() => {
    if (viewMode === "employee" && selectedEmployeeId) {
      loadEmployeeSchedule();
    }
  }, [selectedEmployeeId, fromDate, toDate, viewMode, reloadShiftNonce]);

  const branchName = useMemo(
    () => branches.find((branch) => branch.id === branchId)?.name ?? "Chưa chọn chi nhánh",
    [branches, branchId],
  );

  // ----------------------------------------------------
  // WORK ASSIGNMENT CRUD HANDLERS (Shift Templates)
  // ----------------------------------------------------
  const handleOpenWorkModal = (work: WorkAssignmentResponse | null = null) => {
    setEditingWork(work);
    if (work) {
      setWorkForm({
        name: work.name,
        shiftType: work.shiftType,
        startTime: work.startTime.slice(0, 5),
        endTime: work.endTime.slice(0, 5),
        breakTime: work.breakTime ?? 0,
      });
    } else {
      setWorkForm({
        name: "",
        shiftType: "MORNING",
        startTime: "08:00",
        endTime: "16:00",
        breakTime: 30,
      });
    }
    setIsWorkModalOpen(true);
  };

  const handleSaveWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workForm.name.trim()) {
      toast.error("Tên mẫu ca không được để trống");
      return;
    }

    const startTimeFormatted = workForm.startTime.length === 5 ? `${workForm.startTime}:00` : workForm.startTime;
    const endTimeFormatted = workForm.endTime.length === 5 ? `${workForm.endTime}:00` : workForm.endTime;

    const payload = {
      name: workForm.name.trim(),
      shiftType: workForm.shiftType,
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
      breakTime: Number(workForm.breakTime),
    };

    try {
      if (editingWork) {
        await schedulingApi.updateWorkAssignment(editingWork.id, payload);
        toast.success("Cập nhật mẫu ca thành công");
      } else {
        await schedulingApi.createWorkAssignment(payload);
        toast.success("Thêm mẫu ca thành công");
      }
      setIsWorkModalOpen(false);
      setReloadWorkNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Thao tác thất bại");
    }
  };

  const handleDeleteWork = async () => {
    if (!deletingWorkId) return;
    try {
      await schedulingApi.deleteWorkAssignment(deletingWorkId);
      toast.success("Xóa mẫu ca thành công");
      setReloadWorkNonce((n) => n + 1);
      setReloadShiftNonce((n) => n + 1); // Delete template will also impact assignments
    } catch (err: any) {
      toast.error(err.message || "Xóa thất bại");
    } finally {
      setDeletingWorkId(null);
    }
  };

  // ----------------------------------------------------
  // SHIFT ASSIGNMENT CRUD HANDLERS (Scheduling)
  // ----------------------------------------------------
  const handleOpenAssignModal = () => {
    if (employees.length === 0) {
      toast.error("Chi nhánh chưa có nhân viên nào. Không thể phân ca.");
      return;
    }
    if (workAssignments.length === 0) {
      toast.error("Vui lòng tạo mẫu ca trước khi thực hiện phân ca.");
      return;
    }
    setAssignForm({
      employeeId: employees[0].id,
      workAssignmentId: workAssignments[0].id,
      date,
      assignedBy: employees[0].id,
    });
    setBulkAssignForm({
      selectedEmployeeIds: [],
      workAssignmentId: workAssignments[0].id,
      date,
      assignedBy: employees[0].id,
    });
    setIsAssignModalOpen(true);
  };

  const handleCreateAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.employeeId || !assignForm.workAssignmentId || !assignForm.date || !assignForm.assignedBy) {
      toast.error("Vui lòng điền đầy đủ thông tin phân ca");
      return;
    }

    try {
      await schedulingApi.createShiftAssignment({
        employeeId: assignForm.employeeId,
        workAssignmentId: assignForm.workAssignmentId,
        date: assignForm.date,
        assignedBy: assignForm.assignedBy,
      });
      toast.success("Phân ca thành công");
      setIsAssignModalOpen(false);
      setReloadShiftNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Phân ca thất bại");
    }
  };

  const handleCreateBulkAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkAssignForm.selectedEmployeeIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một nhân viên");
      return;
    }
    if (!bulkAssignForm.workAssignmentId || !bulkAssignForm.date || !bulkAssignForm.assignedBy) {
      toast.error("Vui lòng điền đầy đủ thông tin phân ca");
      return;
    }

    try {
      await schedulingApi.createBulkShiftAssignments({
        assignedBy: bulkAssignForm.assignedBy,
        assignments: bulkAssignForm.selectedEmployeeIds.map((empId) => ({
          employeeId: empId,
          workAssignmentId: bulkAssignForm.workAssignmentId,
          date: bulkAssignForm.date,
        })),
      });
      toast.success(`Phân ca hàng loạt thành công cho ${bulkAssignForm.selectedEmployeeIds.length} nhân viên`);
      setIsAssignModalOpen(false);
      setReloadShiftNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Phân ca hàng loạt thất bại");
    }
  };

  const handleOpenEditAssignModal = (assign: ShiftAssignmentResponse) => {
    setEditingAssign(assign);
    setEditAssignForm({
      workAssignmentId: assign.workAssignment.id,
      date: assign.date,
      assignedBy: assign.assignedBy?.id || employees[0]?.id || "",
    });
    setIsEditAssignModalOpen(true);
  };

  const handleUpdateAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssign) return;
    if (!editAssignForm.workAssignmentId || !editAssignForm.date || !editAssignForm.assignedBy) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await schedulingApi.updateShiftAssignment(editingAssign.id, {
        employeeId: editingAssign.employee.id,
        workAssignmentId: editAssignForm.workAssignmentId,
        date: editAssignForm.date,
        assignedBy: editAssignForm.assignedBy,
      });
      toast.success("Cập nhật phân ca thành công");
      setIsEditAssignModalOpen(false);
      setReloadShiftNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Cập nhật phân ca thất bại");
    }
  };

  const handleDeleteAssign = async () => {
    if (!deletingAssignId) return;
    try {
      await schedulingApi.deleteShiftAssignment(deletingAssignId);
      toast.success("Xóa lịch phân ca thành công");
      setReloadShiftNonce((n) => n + 1);
    } catch (err: any) {
      toast.error(err.message || "Xóa phân ca thất bại");
    } finally {
      setDeletingAssignId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title and View Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ca làm việc</h1>
          <p className="text-gray-500 text-sm">
            {viewMode === "branch" 
              ? "Mẫu ca và lịch phân ca theo chi nhánh từ Scheduling Service."
              : "Lịch sử và chi tiết ca làm việc của từng nhân viên."}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode("branch")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              viewMode === "branch"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Theo chi nhánh
          </button>
          <button
            onClick={() => setViewMode("employee")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              viewMode === "employee"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Theo nhân viên
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        {viewMode === "branch" ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={branchId}
                onChange={(event) => setBranchId(event.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm"
              >
                <option value="">Chọn chi nhánh</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm"
              />
              <div className="flex items-center gap-2 text-sm text-gray-600 border-l pl-3 border-gray-200">
                <Calendar className="w-4 h-4 text-[#007AFF]" />
                <span className="font-medium">{branchName}</span> - {date}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={shiftType}
                onChange={(event) => setShiftType(event.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                <option value="">Tất cả loại ca</option>
                <option value="MORNING">MORNING</option>
                <option value="AFTERNOON">AFTERNOON</option>
                <option value="NIGHT">NIGHT</option>
              </select>
              <button
                onClick={() => handleOpenWorkModal()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Thêm mẫu ca
              </button>
              <button
                onClick={handleOpenAssignModal}
                className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] rounded-xl text-white text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm shadow-blue-200"
              >
                <Plus className="w-4 h-4" />
                Thêm phân ca
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-4 w-full">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nhân viên</label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm"
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullname} ({emp.positionName || "Không rõ vị trí"})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Từ ngày</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Đến ngày</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm"
              />
            </div>
            <div className="self-end">
              <button
                onClick={loadEmployeeSchedule}
                className="flex items-center gap-2 px-4 py-2 bg-[#3E2723] rounded-xl text-white text-sm font-semibold hover:bg-[#2C1810] transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Tải lịch làm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW BRANCH MODE: GRID OF SHIFT TEMPLATES & DAILY TABLE */}
      {viewMode === "branch" && (
        <div className="space-y-6">
          {/* Work Assignments (Shift Templates) Grid */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Mẫu ca làm việc ({workAssignments.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isLoadingWork && (
                <div className="col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-500 text-center">
                  Đang tải mẫu ca...
                </div>
              )}

              {!isLoadingWork && workAssignments.length === 0 && (
                <div className="col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-500 text-center">
                  Chưa có mẫu ca làm việc. Click "Thêm mẫu ca" để bắt đầu.
                </div>
              )}

              {!isLoadingWork &&
                workAssignments.map((shift) => (
                  <div
                    key={shift.id}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-700">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{shift.name}</h4>
                        <p className="text-xs font-medium text-gray-500">
                          {formatShiftTime(shift.startTime, shift.endTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">{shift.shiftType}</p>
                        <p className="text-xs text-gray-400">{shift.breakTime ?? 0} phút nghỉ</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenWorkModal(shift)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingWorkId(shift.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Daily Shift Assignments Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-800">Danh sách phân ca của ngày</h3>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                {shiftAssignments.length} phân ca
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    <th className="py-4 px-6 text-sm font-bold text-gray-700">Nhân viên</th>
                    <th className="py-4 px-6 text-sm font-bold text-gray-700">Ca</th>
                    <th className="py-4 px-6 text-sm font-bold text-gray-700">Thời gian</th>
                    <th className="py-4 px-6 text-sm font-bold text-gray-700">Người phân ca</th>
                    <th className="py-4 px-6 text-sm font-bold text-gray-700 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingShifts && (
                    <tr>
                      <td className="py-8 px-6 text-sm text-gray-500 text-center" colSpan={5}>
                        Đang tải thông tin phân ca...
                      </td>
                    </tr>
                  )}

                  {!isLoadingShifts && error && (
                    <tr>
                      <td className="py-8 px-6 text-sm text-red-600 text-center" colSpan={5}>
                        Lỗi: {error}
                      </td>
                    </tr>
                  )}

                  {!isLoadingShifts && !error && shiftAssignments.length === 0 && (
                    <tr>
                      <td className="py-8 px-6 text-sm text-gray-500 text-center" colSpan={5}>
                        Chưa có phân ca cho ngày hôm nay.
                      </td>
                    </tr>
                  )}

                  {!isLoadingShifts &&
                    shiftAssignments.map((assignment) => (
                      <tr
                        key={assignment.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                              {assignment.employee?.fullname?.charAt(0) ?? "E"}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{assignment.employee?.fullname}</p>
                              <p className="text-xs text-gray-500 font-medium">
                                {assignment.employee?.positionName || "Chưa thiết lập vị trí"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {assignment.workAssignment?.name}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {formatShiftTime(assignment.workAssignment?.startTime, assignment.workAssignment?.endTime)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 text-gray-400" />
                            {assignment.assignedBy?.fullname ?? "Không rõ"}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditAssignModal(assignment)}
                              className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingAssignId(assignment.id)}
                              className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Hiển thị <span className="font-bold text-gray-900">{shiftAssignments.length}</span> phân ca
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW EMPLOYEE MODE: DATE RANGE VIEWER FOR SPECIFIC EMPLOYEE */}
      {viewMode === "employee" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-md font-bold text-gray-800">
              {selectedEmployeeId 
                ? `Lịch phân ca: ${employees.find(e => e.id === selectedEmployeeId)?.fullname}`
                : "Chọn một nhân viên để xem lịch sử ca làm"}
            </h3>
            {selectedEmployeeId && (
              <span className="text-xs bg-brown-100 text-[#3E2723] font-bold px-2.5 py-0.5 rounded-full">
                {employeeShifts.length} ca làm
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="py-4 px-6 text-sm font-bold text-gray-700">Ngày</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-700">Tên Ca</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-700">Khung Giờ</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-700">Người Phân Ca</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-700 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingEmpShifts && (
                  <tr>
                    <td className="py-8 px-6 text-sm text-gray-500 text-center" colSpan={5}>
                      Đang tải lịch làm việc...
                    </td>
                  </tr>
                )}

                {!isLoadingEmpShifts && !selectedEmployeeId && (
                  <tr>
                    <td className="py-8 px-6 text-sm text-gray-400 text-center" colSpan={5}>
                      Vui lòng chọn nhân viên ở bộ lọc phía trên để bắt đầu.
                    </td>
                  </tr>
                )}

                {!isLoadingEmpShifts && selectedEmployeeId && employeeShifts.length === 0 && (
                  <tr>
                    <td className="py-8 px-6 text-sm text-gray-500 text-center" colSpan={5}>
                      Không tìm thấy lịch phân ca nào trong khoảng thời gian đã chọn.
                    </td>
                  </tr>
                )}

                {!isLoadingEmpShifts &&
                  selectedEmployeeId &&
                  employeeShifts.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm font-bold text-gray-900">{assignment.date}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {assignment.workAssignment?.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatShiftTime(assignment.workAssignment?.startTime, assignment.workAssignment?.endTime)} ({assignment.workAssignment?.shiftType})
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {assignment.assignedBy?.fullname ?? "Không rõ"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditAssignModal(assignment)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingAssignId(assignment.id)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600 transition-all"
                          >
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
      )}

      {/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
      {/* DIALOGS / MODALS */}
      {/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

      {/* MODAL: ADD / EDIT WORK ASSIGNMENT (SHIFT TEMPLATE) */}
      <Dialog open={isWorkModalOpen} onOpenChange={setIsWorkModalOpen}>
        <DialogContent className="bg-white border border-gray-100 rounded-2xl shadow-xl max-w-md p-6">
          <DialogHeader className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-lg font-bold text-gray-900">
                {editingWork ? "Cập nhật mẫu ca làm việc" : "Thêm mẫu ca làm việc mới"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Thiết lập thông tin khung giờ làm và thời gian nghỉ của ca.
              </DialogDescription>
            </div>
          </DialogHeader>
          <form onSubmit={handleSaveWork} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Tên Ca Làm
              </label>
              <input
                type="text"
                value={workForm.name}
                onChange={(e) => setWorkForm({ ...workForm, name: e.target.value })}
                placeholder="Ví dụ: Ca sáng, Ca tối, Morning Shift..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Loại ca
                </label>
                <select
                  value={workForm.shiftType}
                  onChange={(e) => setWorkForm({ ...workForm, shiftType: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="MORNING">MORNING</option>
                  <option value="AFTERNOON">AFTERNOON</option>
                  <option value="NIGHT">NIGHT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Phút Nghỉ
                </label>
                <input
                  type="number"
                  value={workForm.breakTime}
                  onChange={(e) => setWorkForm({ ...workForm, breakTime: Number(e.target.value) })}
                  min={0}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Giờ Bắt Đầu
                </label>
                <input
                  type="time"
                  value={workForm.startTime}
                  onChange={(e) => setWorkForm({ ...workForm, startTime: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Giờ Kết Thúc
                </label>
                <input
                  type="time"
                  value={workForm.endTime}
                  onChange={(e) => setWorkForm({ ...workForm, endTime: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsWorkModalOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#007AFF] text-white rounded-xl text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm shadow-blue-200"
              >
                Lưu lại
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: ADD SHIFT ASSIGNMENT (SINGLE / BULK) */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="bg-white border border-gray-100 rounded-2xl shadow-xl max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">Phân ca làm việc mới</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Lựa chọn hình thức phân ca đơn hoặc hàng loạt cho nhiều nhân viên cùng lúc.
            </DialogDescription>
          </DialogHeader>

          {/* Dialog Tabs Switcher */}
          <div className="flex border-b border-gray-100 my-3">
            <button
              onClick={() => setAssignTab("single")}
              className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-all ${
                assignTab === "single"
                  ? "border-[#007AFF] text-[#007AFF]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Phân ca đơn
            </button>
            <button
              onClick={() => setAssignTab("bulk")}
              className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-all ${
                assignTab === "bulk"
                  ? "border-[#007AFF] text-[#007AFF]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Phân ca hàng loạt
            </button>
          </div>

          {/* TAB 1: SINGLE SHIFT ASSIGNMENT */}
          {assignTab === "single" && (
            <form onSubmit={handleCreateAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Nhân viên
                </label>
                <select
                  value={assignForm.employeeId}
                  onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullname} ({emp.positionName || "Staff"})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Mẫu ca làm việc
                  </label>
                  <select
                    value={assignForm.workAssignmentId}
                    onChange={(e) => setAssignForm({ ...assignForm, workAssignmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  >
                    {workAssignments.map((work) => (
                      <option key={work.id} value={work.id}>
                        {work.name} ({formatShiftTime(work.startTime, work.endTime)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Ngày làm việc
                  </label>
                  <input
                    type="date"
                    value={assignForm.date}
                    onChange={(e) => setAssignForm({ ...assignForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Người phân ca
                </label>
                <select
                  value={assignForm.assignedBy}
                  onChange={(e) => setAssignForm({ ...assignForm, assignedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullname} ({emp.positionName || "Staff"})
                    </option>
                  ))}
                </select>
              </div>
              <DialogFooter className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007AFF] text-white rounded-xl text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm shadow-blue-200"
                >
                  Xác nhận phân ca
                </button>
              </DialogFooter>
            </form>
          )}

          {/* TAB 2: BULK SHIFT ASSIGNMENT */}
          {assignTab === "bulk" && (
            <form onSubmit={handleCreateBulkAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Chọn nhân viên ({bulkAssignForm.selectedEmployeeIds.length})
                </label>
                <div className="border border-gray-150 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2 bg-gray-50/50">
                  {employees.map((emp) => {
                    const isChecked = bulkAssignForm.selectedEmployeeIds.includes(emp.id);
                    return (
                      <label key={emp.id} className="flex items-center gap-3 cursor-pointer p-1 hover:bg-white rounded transition-all">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const newSelection = isChecked
                              ? bulkAssignForm.selectedEmployeeIds.filter((id) => id !== emp.id)
                              : [...bulkAssignForm.selectedEmployeeIds, emp.id];
                            setBulkAssignForm({ ...bulkAssignForm, selectedEmployeeIds: newSelection });
                          }}
                          className="w-4 h-4 rounded text-[#007AFF] border-gray-300 focus:ring-[#007AFF]"
                        />
                        <span className="text-sm text-gray-700">
                          {emp.fullname} <span className="text-xs text-gray-400">({emp.positionName || "Staff"})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Mẫu ca làm việc
                  </label>
                  <select
                    value={bulkAssignForm.workAssignmentId}
                    onChange={(e) => setBulkAssignForm({ ...bulkAssignForm, workAssignmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  >
                    {workAssignments.map((work) => (
                      <option key={work.id} value={work.id}>
                        {work.name} ({formatShiftTime(work.startTime, work.endTime)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Ngày làm việc
                  </label>
                  <input
                    type="date"
                    value={bulkAssignForm.date}
                    onChange={(e) => setBulkAssignForm({ ...bulkAssignForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Người phân ca
                </label>
                <select
                  value={bulkAssignForm.assignedBy}
                  onChange={(e) => setBulkAssignForm({ ...bulkAssignForm, assignedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullname} ({emp.positionName || "Staff"})
                    </option>
                  ))}
                </select>
              </div>
              <DialogFooter className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007AFF] text-white rounded-xl text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm"
                >
                  Xác nhận phân ca bulk
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL: EDIT SHIFT ASSIGNMENT */}
      <Dialog open={isEditAssignModalOpen} onOpenChange={setIsEditAssignModalOpen}>
        <DialogContent className="bg-white border border-gray-100 rounded-2xl shadow-xl max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">Cập nhật thông tin phân ca</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Điều chỉnh ca làm việc hoặc ngày phân ca của nhân viên.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateAssign} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Nhân viên (Không thể thay đổi)
              </label>
              <input
                type="text"
                value={editingAssign?.employee?.fullname ?? ""}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none"
                disabled
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Mẫu ca làm việc
                </label>
                <select
                  value={editAssignForm.workAssignmentId}
                  onChange={(e) => setEditAssignForm({ ...editAssignForm, workAssignmentId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                >
                  {workAssignments.map((work) => (
                    <option key={work.id} value={work.id}>
                      {work.name} ({formatShiftTime(work.startTime, work.endTime)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Ngày làm việc
                </label>
                <input
                  type="date"
                  value={editAssignForm.date}
                  onChange={(e) => setEditAssignForm({ ...editAssignForm, date: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Người phân ca
              </label>
              <select
                value={editAssignForm.assignedBy}
                onChange={(e) => setEditAssignForm({ ...editAssignForm, assignedBy: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullname} ({emp.positionName || "Staff"})
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsEditAssignModalOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#007AFF] text-white rounded-xl text-sm font-semibold hover:bg-[#0062CC] transition-all shadow-sm"
              >
                Cập nhật
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION: DELETE WORK TEMPLATE */}
      <Dialog open={deletingWorkId !== null} onOpenChange={(open) => !open && setDeletingWorkId(null)}>
        <DialogContent className="bg-white border border-gray-100 rounded-2xl shadow-xl max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="text-md font-bold text-gray-900">Xác nhận xóa mẫu ca</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              Hành động này sẽ xóa mẫu ca làm việc vĩnh viễn và có thể ảnh hưởng đến lịch phân ca hiện tại. Bạn có chắc chắn muốn tiếp tục?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setDeletingWorkId(null)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleDeleteWork}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all shadow-sm"
            >
              Đồng ý xóa
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION: DELETE SHIFT ASSIGNMENT */}
      <Dialog open={deletingAssignId !== null} onOpenChange={(open) => !open && setDeletingAssignId(null)}>
        <DialogContent className="bg-white border border-gray-100 rounded-2xl shadow-xl max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="text-md font-bold text-gray-900">Xác nhận hủy phân ca</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              Hành động này sẽ hủy ca làm việc đã phân cho nhân viên này. Bạn có chắc chắn muốn tiếp tục?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setDeletingAssignId(null)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 text-gray-700"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleDeleteAssign}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all shadow-sm"
            >
              Hủy phân ca
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
