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
    XCircle,
    Compass,
    MapPin,
    BookOpen,
    FileText,
    Sparkles,
    Eye,
    ChevronRight,
    RefreshCw
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ViewedItem {
    slug: string;
    name: string;
    viewCount: number;
}

interface Registration {
    id: string;
    name: string;
    phone: string;
    email: string;
    courseName: string;
    status: "pending" | "contacted" | "enrolled" | "cancelled";
    date: string;
    note?: string;
    visitorId?: string;
    ip?: string;
    city?: string;
    firstSeenAt?: string;
    timeToConvertFormatted?: string;
    journeySummary?: string;
    viewedCourses?: ViewedItem[];
    viewedBlogs?: ViewedItem[];
}

export default function AdminRegistrations() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Modal xem hành trình khách hàng
    const [selectedLead, setSelectedLead] = useState<Registration | null>(null);
    const [journeyTimeline, setJourneyTimeline] = useState<any[]>([]);
    const [isLoadingJourney, setIsLoadingJourney] = useState(false);

    const fetchRegs = async () => {
        try {
            const res = await fetch('/api/cms/registrations');
            if (res.ok) {
                const json = await res.json();
                if (json.registrations && json.registrations.length > 0) {
                    setRegistrations(json.registrations);
                    localStorage.setItem("admin_registrations", JSON.stringify(json.registrations));
                    return;
                }
            }
        } catch (e) {
            console.error("Error fetching registrations:", e);
        }

        const localRegs = localStorage.getItem("admin_registrations");
        if (localRegs) {
            try {
                setRegistrations(JSON.parse(localRegs));
            } catch {}
        }
    };

    useEffect(() => {
        fetchRegs();
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
                (r.email && r.email.toLowerCase().includes(query)) ||
                (r.city && r.city.toLowerCase().includes(query))
            );
        }

        // Apply Status Filter
        if (statusFilter !== "all") {
            result = result.filter(r => r.status === statusFilter);
        }

        setFilteredRegistrations(result);
    }, [registrations, searchTerm, statusFilter]);

    // Update Status
    const updateStatus = async (id: string, newStatus: "pending" | "contacted" | "enrolled" | "cancelled") => {
        const found = registrations.find(r => r.id === id);
        if (!found) return;

        const updatedItem = { ...found, status: newStatus };
        try {
            const res = await fetch('/api/cms/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registration: updatedItem })
            });
            if (!res.ok) {
                alert('Lỗi cập nhật trạng thái. Vui lòng thử lại.');
                return;
            }
        } catch {
            alert('Lỗi kết nối server.');
            return;
        }

        const updated = registrations.map(r => r.id === id ? updatedItem : r);
        setRegistrations(updated);
        localStorage.setItem("admin_registrations", JSON.stringify(updated));
    };

    // Delete Registration
    const deleteRegistration = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa đơn đăng ký này?')) return;

        try {
            const res = await fetch(`/api/cms/registrations?id=${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                alert('Lỗi khi xóa đăng ký. Vui lòng thử lại.');
                return;
            }
        } catch {
            alert('Lỗi kết nối server.');
            return;
        }

        const updated = registrations.filter(r => r.id !== id);
        setRegistrations(updated);
        localStorage.setItem("admin_registrations", JSON.stringify(updated));
    };

    // Xem chi tiết hành trình của khách
    const handleOpenJourneyModal = async (lead: Registration) => {
        setSelectedLead(lead);
        setIsLoadingJourney(true);
        setJourneyTimeline([]);

        const visitorKey = lead.visitorId || lead.ip || "unknown";
        try {
            const res = await fetch(`/api/analytics/visitor/${visitorKey}${lead.ip ? `?ip=${lead.ip}` : ""}`);
            if (res.ok) {
                const json = await res.json();
                if (json.journey?.pageviews) {
                    setJourneyTimeline(json.journey.pageviews);
                }
            }
        } catch (e) {
            console.error("Failed to load journey detail:", e);
        } finally {
            setIsLoadingJourney(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case "pending":
                return <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-500 rounded-md font-medium text-xs flex items-center gap-1.5 w-fit"><Clock className="w-3.5 h-3.5" /> Chờ tư vấn</span>;
            case "contacted":
                return <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-500 rounded-md font-medium text-xs flex items-center gap-1.5 w-fit"><TrendingUp className="w-3.5 h-3.5" /> Đã liên hệ</span>;
            case "enrolled":
                return <span className="px-2.5 py-0.5 bg-green-500/10 text-green-500 rounded-md font-medium text-xs flex items-center gap-1.5 w-fit"><CheckCircle className="w-3.5 h-3.5" /> Đã nhập học</span>;
            default:
                return <span className="px-2.5 py-0.5 bg-red-500/10 text-red-500 rounded-md font-medium text-xs flex items-center gap-1.5 w-fit"><XCircle className="w-3.5 h-3.5" /> Đã hủy</span>;
        }
    };

    return (
        <div className="space-y-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="heading-3 text-[var(--color-text)] flex items-center gap-2">
                        <Users className="w-6 h-6 text-[var(--color-primary)]" />
                        <span>Quản Lý Đăng Ký Học & Hành Trình Học Viên</span>
                    </h1>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        Theo dõi danh sách học viên, xem hành trình tìm hiểu website và tỉnh thành để CSKH hiệu quả
                    </p>
                </div>

                <button
                    onClick={fetchRegs}
                    title="Tải lại danh sách"
                    className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-light)] transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Làm mới</span>
                </button>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Tìm tên, SĐT, tỉnh thành hoặc khóa học..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-1.5 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            statusFilter === "all"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Tất cả ({registrations.length})
                    </button>
                    <button
                        onClick={() => setStatusFilter("pending")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            statusFilter === "pending"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Chờ tư vấn ({registrations.filter(r => r.status === "pending").length})
                    </button>
                    <button
                        onClick={() => setStatusFilter("contacted")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            statusFilter === "contacted"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Đã liên hệ ({registrations.filter(r => r.status === "contacted").length})
                    </button>
                    <button
                        onClick={() => setStatusFilter("enrolled")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            statusFilter === "enrolled"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Đã nhập học ({registrations.filter(r => r.status === "enrolled").length})
                    </button>
                </div>
            </div>

            {/* Registrations List Table */}
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                <div className="overflow-x-auto -mx-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] font-semibold">
                                <th className="px-4 py-2">Học viên</th>
                                <th className="px-4 py-2">Vị trí & Tiếp cận</th>
                                <th className="px-4 py-2">Khóa học đăng ký</th>
                                <th className="px-4 py-2">Trạng thái</th>
                                <th className="px-4 py-2">Hành trình xem</th>
                                <th className="px-4 py-2 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)] text-xs">
                            {filteredRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                                        Không tìm thấy đơn đăng ký phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-[var(--color-surface-light)]/40 transition-colors">
                                        {/* Contact details */}
                                        <td className="px-4 py-2.5">
                                            <div className="font-semibold text-[var(--color-text)]">{reg.name}</div>
                                            <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5 flex flex-col gap-0.5">
                                                <span className="font-medium text-[var(--color-text)]">SĐT: {reg.phone}</span>
                                                {reg.email && reg.email !== "Chưa cung cấp" && (
                                                    <span>Email: {reg.email}</span>
                                                )}
                                                <span className="text-[10px] text-[var(--color-text-muted)]">Ngày gửi: {reg.date}</span>
                                            </div>
                                        </td>

                                        {/* Geo & Time to Convert */}
                                        <td className="px-4 py-2.5">
                                            <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text)]">
                                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                <span>{reg.city || "Hà Nội"}</span>
                                            </div>
                                            <div className="text-[10px] text-amber-600 font-medium mt-0.5">
                                                {reg.timeToConvertFormatted || "Đăng ký ngay"}
                                            </div>
                                            {reg.ip && (
                                                <div className="text-[10px] font-mono text-[var(--color-text-muted)]">
                                                    IP: {reg.ip}
                                                </div>
                                            )}
                                        </td>

                                        {/* Course Name */}
                                        <td className="px-4 py-2.5 text-[var(--color-text-secondary)] font-medium max-w-[200px]">
                                            <div className="truncate font-semibold text-[var(--color-text)]">{reg.courseName}</div>
                                            {reg.note && (
                                                <div className="text-[10px] text-[var(--color-text-muted)] truncate max-w-xs mt-0.5 italic">
                                                    &quot;{reg.note.split("\n")[0]}&quot;
                                                </div>
                                            )}
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-4 py-2.5">
                                            {getStatusBadge(reg.status)}
                                        </td>

                                        {/* Lead Journey Button */}
                                        <td className="px-4 py-2.5">
                                            <button
                                                onClick={() => handleOpenJourneyModal(reg)}
                                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 border border-orange-500/20 hover:from-orange-500 hover:to-amber-500 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                                            >
                                                <Compass className="w-3.5 h-3.5" />
                                                <span>Xem hành trình</span>
                                            </button>
                                        </td>

                                        {/* Actions workflow */}
                                        <td className="px-4 py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {reg.status === "pending" && (
                                                    <button
                                                        onClick={() => updateStatus(reg.id, "contacted")}
                                                        title="Đã liên hệ tư vấn"
                                                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                                    >
                                                        <PhoneCall className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                {(reg.status === "pending" || reg.status === "contacted") && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(reg.id, "enrolled")}
                                                            title="Đăng ký nhập học chính thức"
                                                            className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(reg.id, "cancelled")}
                                                            title="Hủy đơn đăng ký"
                                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteRegistration(reg.id)}
                                                    title="Xóa đơn đăng ký"
                                                    className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors ml-1"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
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

            {/* MODAL CHI TIẾT HÀNH TRÌNH HỌC VIÊN TIỀM NĂNG CHO CSKH */}
            {selectedLead && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-gradient-to-r from-[var(--color-surface)] to-[var(--color-surface-light)]">
                            <div>
                                <h3 className="font-heading font-bold text-base text-[var(--color-text)] flex items-center gap-2">
                                    <Compass className="w-5 h-5 text-[var(--color-primary)]" />
                                    <span>Hành Trình Khách Hàng: {selectedLead.name}</span>
                                </h3>
                                <p className="text-xs text-[var(--color-text-secondary)]">
                                    SĐT: <span className="font-bold text-[var(--color-text)]">{selectedLead.phone}</span> • Đăng ký: <span className="font-semibold text-[var(--color-primary)]">{selectedLead.courseName}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-light)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {/* Card Tóm Tắt Profile Khách Hàng */}
                            <div className="p-4 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div>
                                    <span className="text-[var(--color-text-muted)] block">Tỉnh Thành</span>
                                    <span className="font-bold text-[var(--color-text)] text-sm flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                        <span>{selectedLead.city || "Hà Nội"}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[var(--color-text-muted)] block">Thời Gian Tìm Hiểu</span>
                                    <span className="font-bold text-amber-600 text-sm">
                                        {selectedLead.timeToConvertFormatted || "Đăng ký ngay"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[var(--color-text-muted)] block">Địa Chỉ IP</span>
                                    <span className="font-mono text-xs text-[var(--color-text)]">{selectedLead.ip || "113.190.x.x"}</span>
                                </div>
                                <div>
                                    <span className="text-[var(--color-text-muted)] block">Ngày Gửi Form</span>
                                    <span className="font-semibold text-[var(--color-text)]">{selectedLead.date}</span>
                                </div>
                            </div>

                            {/* GỢI Ý KỊCH BẢN TƯ VẤN NHANH CHO NHÂN VIÊN CSKH */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 text-xs">
                                <div className="flex items-center gap-1.5 font-bold text-amber-600 mb-1.5">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Gợi Ý Cho Chuyên Viên Tư Vấn CSKH:</span>
                                </div>
                                <p className="text-[var(--color-text)] leading-relaxed">
                                    Học viên ở <strong>{selectedLead.city || "khu vực này"}</strong>, đã tiếp cận website <strong>{selectedLead.timeToConvertFormatted || "hôm nay"}</strong>.
                                    {selectedLead.viewedCourses && selectedLead.viewedCourses.length > 0 ? (
                                        <span> Học viên quan tâm sâu tới khóa <strong>{selectedLead.viewedCourses.map(c => c.name).join(", ")}</strong>. Khi tư vấn hãy xoáy sâu vào công thức nước dùng kinh doanh và tính cost lãi của các món này để tăng tỷ lệ chốt học viên!</span>
                                    ) : (
                                        <span> Hãy chào đón nồng nhiệt và hỏi thăm nhu cầu mở quán hoặc nâng cao tay nghề nấu ăn của học viên.</span>
                                    )}
                                </p>
                            </div>

                            {/* Các Khóa Học Khách Đã Tìm Hiểu Trước Khi Mua */}
                            <div>
                                <h4 className="text-xs font-bold text-[var(--color-text-secondary)] mb-2.5 flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                    <span>Các khóa học đã xem ({selectedLead.viewedCourses?.length || 0})</span>
                                </h4>
                                {selectedLead.viewedCourses && selectedLead.viewedCourses.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {selectedLead.viewedCourses.map((c, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between text-xs">
                                                <span className="font-semibold text-[var(--color-text)] truncate pr-2">{c.name}</span>
                                                <span className="px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold shrink-0">
                                                    {c.viewCount} lần xem
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-[var(--color-text-muted)]">Chưa ghi nhận khóa học xem trước trong phiên này</p>
                                )}
                            </div>

                            {/* Timeline Lịch Sử Duyệt Trang */}
                            <div>
                                <h4 className="text-xs font-bold text-[var(--color-text-secondary)] mb-3 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Chuỗi hành động chi tiết (Timeline)</span>
                                </h4>
                                {isLoadingJourney ? (
                                    <div className="py-6 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
                                        <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
                                        <span>Đang tải chuỗi hành động...</span>
                                    </div>
                                ) : journeyTimeline.length > 0 ? (
                                    <div className="relative pl-6 space-y-3 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-border)]">
                                        {journeyTimeline.map((pv, i) => (
                                            <div key={i} className="relative text-xs">
                                                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-surface)]" />
                                                <div className="font-semibold text-[var(--color-text)]">{pv.title}</div>
                                                <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5 flex items-center gap-2">
                                                    <span>{pv.path}</span>
                                                    <span>•</span>
                                                    <span>{new Date(pv.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                                                    <span>•</span>
                                                    <span>{new Date(pv.timestamp).toLocaleDateString("vi-VN")}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        Khách đăng ký trực tiếp hoặc chưa có lịch sử timeline chi tiết.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-light)]">
                            <a
                                href={`tel:${selectedLead.phone}`}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>Gọi điện cho học viên ({selectedLead.phone})</span>
                            </a>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
