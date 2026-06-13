import React, { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, Edit2, Plus, Search, Trash2, X } from "lucide-react";
import { CompanyResponse, CompanyRequest, organizationApi } from "../lib/api";

export function CompanyManagement() {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CompanyRequest>({ name: "", taxCode: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignored = false;

    setIsLoading(true);
    setError(null);

    organizationApi
      .getCompanies()
      .then((result) => {
        if (!ignored) {
          setCompanies(result ?? []);
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await organizationApi.updateCompany(editingId, formData);
        setCompanies(
          companies.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
        );
      } else {
        const newCompany = await organizationApi.createCompany(formData);
        setCompanies([...companies, newCompany]);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", taxCode: "" });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (company: CompanyResponse) => {
    setEditingId(company.id);
    setFormData({ name: company.name, taxCode: company.taxCode });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa công ty này?")) return;

    try {
      await organizationApi.deleteCompany(id);
      setCompanies(companies.filter((c) => c.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", taxCode: "" });
  };

  const filteredCompanies = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return companies;
    }

    return companies.filter((company) =>
      [company.name, company.taxCode].some((value) => value.toLowerCase().includes(term)),
    );
  }, [companies, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quan ly cong ty</h1>
          <p className="text-gray-500 text-sm mt-1">Du lieu lay tu Organization Service.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5D4037] text-white rounded-xl font-bold hover:bg-[#3E2723] transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Them cong ty
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-[#FAF9F6] flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]" />
            <input
              type="text"
              placeholder="Tim theo ten cong ty hoac ma so thue..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cong ty</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ma so thue</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trang thai</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-500 text-center" colSpan={4}>
                    Dang tai cong ty...
                  </td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td className="px-6 py-8 text-sm text-red-600 text-center" colSpan={4}>
                    {error}
                  </td>
                </tr>
              )}

              {!isLoading && !error && filteredCompanies.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-500 text-center" colSpan={4}>
                    Khong co cong ty phu hop.
                  </td>
                </tr>
              )}

              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#EFEBE9] rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-[#5D4037]" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{company.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{company.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{company.taxCode}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(company)}
                        className="p-2 text-gray-400 hover:text-[#5D4037] hover:bg-[#EFEBE9] rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Cập nhật công ty" : "Tạo công ty mới"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên công ty *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
                  placeholder="Nhập tên công ty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  value={formData.taxCode || ""}
                  onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
                  placeholder="Nhập mã số thuế"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[#5D4037] text-white rounded-lg hover:bg-[#3E2723] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
