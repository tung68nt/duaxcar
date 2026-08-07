"use client";

import { useEffect, useState } from "react";
import { 
    Users, 
    Search, 
    Trash2, 
    Check, 
    PhoneCall, 
    X,
    Filter,
    Clock,
    TrendingUp,
    CheckCircle,
    XCircle
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Registration {
    id: string;
    name: string;
    phone: string;
    email: string;
    courseName: string;
    status: "pending" | "contacted" | "enrolled" | "cancelled";
    date: string;
}

export default function AdminRegistrations() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        const localRegs = localStorage.getItem("admin_registrations");
        if (localRegs) {
            setRegistrations(JSON.parse(localRegs));
        }
    }, []);

    useEffect(() => {
        let result = [...registrations];

        // Apply Search
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(r => 
                r.name.toLowerCase().includes(query) || 
                r.phone.includes(query) || 
                r.courseName.toLowerCase().includes(query) ||
                (r.email && r.email.toLowerCase().includes(query))
            );
        }

        // Apply Status Filter
        if (statusFilter !== "all") {
            result = result.filter(r => r.status === statusFilter);
        }

        setFilteredRegistrations(result);
    }, [registrations, searchTerm, statusFilter]);

    // Update Status
    const updateStatus = (id: string, newStatus: "pending" | "contacted" | "enrolled" | "cancelled") => {
        const updated = registrations.map(r => r.id === id ? { ...r, status: newStatus } : r);
        setRegistrations(updated);
        localStorage.setItem("admin_registrations", JSON.stringify(updated));
    };

    // Delete Registration
    const deleteRegistration = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa đơn đăng ký này?")) {
            const updated = registrations.filter(r => r.id !== id);
            setRegistrations(updated);
            localStorage.setItem("admin_registrations", JSON.stringify(updated));
        }
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case "pending":
                return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full font-medium text-xs flex items-center gap-1.5 w-fit"><Clock className="w-3.5 h-3.5" /> Chờ tư vấn</span>;
            case "contacted":
                return <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-full font-medium text-xs flex items-center gap-1.5 w-fit"><PhoneCall className="w-3.5 h-3.5" /> Đã liên hệ</span>;
            case "enrolled":
                return <span className="px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full font-medium text-xs flex items-center gap-1.5 w-fit"><CheckCircle className="w-3.5 h-3.5" /> Đã nhập học</span>;
            default:
                return <span className="px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full font-medium text-xs flex items-center gap-1.5 w-fit"><XCircle className="w-3.5 h-3.5" /> Đã hủy</span>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="heading-2 text-[var(--color-text)]">
                    Quản Lý Đăng Ký Học
                </h1>
                <p className="text-small text-[var(--color-text-secondary)] mt-1">
                    Theo dõi danh sách học viên đăng ký học, cập nhật tiến độ tư vấn và quy trình nhập học.
                </p>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Tìm tên, SĐT hoặc khóa học..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            statusFilter === "all"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Tất cả ({registrations.length})
                    </button>
                    <button
                        onClick={() => setStatusFilter("pending")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            statusFilter === "pending"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Chờ tư vấn ({registrations.filter(r => r.status === "pending").length})
                    </button>
                    <button
                        onClick={() => setStatusFilter("contacted")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            statusFilter === "contacted"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Đã liên hệ ({registrations.filter(r => r.status === "contacted").length})
                    </button>
                    <button
                        onClick={() => setStatusFilter("enrolled")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            statusFilter === "enrolled"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Đã nhập học ({registrations.filter(r => r.status === "enrolled").length})
                    </button>
                </div>
            </div>

            {/* Registrations List Table */}
            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
                                <th className="px-6 py-3">Thông tin học viên</th>
                                <th className="px-6 py-3">Khóa học đăng ký</th>
                                <th className="px-6 py-3">Trạng thái</th>
                                <th className="px-6 py-3">Ngày đăng ký</th>
                                <th className="px-6 py-3 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)] text-small">
                            {filteredRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                                        Không tìm thấy đơn đăng ký phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-[var(--color-surface-light)]/40 transition-colors">
                                        {/* Contact details */}
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[var(--color-text)]">{reg.name}</div>
                                            <div className="text-xs text-[var(--color-text-muted)] mt-1 flex flex-col gap-0.5">
                                                <span>SĐT: {reg.phone}</span>
                                                {reg.email && <span>Email: {reg.email}</span>}
                                            </div>
                                        </td>
                                        {/* Course Name */}
                                        <td className="px-6 py-4 text-[var(--color-text-secondary)] font-medium">
                                            {reg.courseName}
                                        </td>
                                        {/* Status Badge */}
                                        <td className="px-6 py-4">
                                            {getStatusBadge(reg.status)}
                                        </td>
                                        {/* Date */}
                                        <td className="px-6 py-4 text-xs text-[var(--color-text-muted)]">
                                            {reg.date}
                                        </td>
                                        {/* Actions workflow */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {reg.status === "pending" && (
                                                    <button
                                                        onClick={() => updateStatus(reg.id, "contacted")}
                                                        title="Đã liên hệ tư vấn"
                                                        className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                                    >
                                                        <PhoneCall className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {(reg.status === "pending" || reg.status === "contacted") && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(reg.id, "enrolled")}
                                                            title="Đăng ký nhập học chính thức"
                                                            className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(reg.id, "cancelled")}
                                                            title="Hủy đơn đăng ký"
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteRegistration(reg.id)}
                                                    title="Xóa đơn đăng ký"
                                                    className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors ml-2"
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
            </div>
        </div>
    );
}
