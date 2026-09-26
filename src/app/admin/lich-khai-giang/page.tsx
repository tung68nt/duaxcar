"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
    Calendar,
    Search,
    Plus,
    Edit3,
    Trash2,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Clock,
    MapPin,
    Users,
    Sparkles,
    Copy,
    ArrowUpRight,
    RotateCcw,
    X,
    Filter,
    BookOpen,
    HelpCircle,
    Info,
    CalendarCheck,
    CalendarX,
    Timer
} from "lucide-react";
import { ScheduleItem } from "@/data/default-schedules";
import { courses as defaultMockCourses } from "@/data/mock";
import { Course } from "@/lib/types";

export default function AdminSchedulesPage() {
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [courses, setCourses] = useState<Course[]>(defaultMockCourses);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [courseFilter, setCourseFilter] = useState<string>("all");
    const [visibilityFilter, setVisibilityFilter] = useState<string>("all");

    // Modal Form State
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ScheduleItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

    // Toast feedback
    const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);

    const emptyForm: Omit<ScheduleItem, "id"> = {
        courseSlug: "",
        startDate: "",
        endDate: "",
        time: "08:00 - 17:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 5,
        totalSpots: 8,
        status: "opening",
        note: "",
        visible: true,
    };

    const [formState, setFormState] = useState<Omit<ScheduleItem, "id">>(emptyForm);

    const showToast = (text: string, type: "success" | "error" | "warning" = "success") => {
        setToastMessage({ text, type });
        setTimeout(() => setToastMessage(null), 4000);
    };

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                // Fetch schedules
                const schRes = await fetch("/api/cms/schedules");
                if (schRes.ok) {
                    const data = await schRes.json();
                    if (data.schedules) {
                        setSchedules(data.schedules);
                    }
                }

                // Fetch real courses if available
                const cRes = await fetch("/api/cms/courses");
                if (cRes.ok) {
                    const cData = await cRes.json();
                    if (cData.courses && cData.courses.length > 0) {
                        setCourses(cData.courses);
                    }
                }
            } catch (err) {
                console.error("Error loading schedules:", err);
                showToast("Lỗi khi tải dữ liệu, đang sử dụng dữ liệu cục bộ", "warning");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Filtered schedules
    const filteredSchedules = useMemo(() => {
        return schedules.filter((item) => {
            const course = courses.find((c) => c.slug === item.courseSlug);
            const courseName = course ? course.name.toLowerCase() : "";
            const searchLower = searchTerm.toLowerCase();

            const matchSearch =
                !searchTerm ||
                courseName.includes(searchLower) ||
                item.courseSlug.toLowerCase().includes(searchLower) ||
                item.location.toLowerCase().includes(searchLower) ||
                (item.note && item.note.toLowerCase().includes(searchLower));

            const matchStatus = statusFilter === "all" || item.status === statusFilter;
            const matchCourse = courseFilter === "all" || item.courseSlug === courseFilter;
            const matchVisibility =
                visibilityFilter === "all" ||
                (visibilityFilter === "visible" && item.visible !== false) ||
                (visibilityFilter === "hidden" && item.visible === false);

            return matchSearch && matchStatus && matchCourse && matchVisibility;
        });
    }, [schedules, courses, searchTerm, statusFilter, courseFilter, visibilityFilter]);

    // Statistics
    const stats = useMemo(() => {
        const total = schedules.length;
        const opening = schedules.filter((s) => s.status === "opening").length;
        const almostFull = schedules.filter((s) => s.status === "almost-full").length;
        const full = schedules.filter((s) => s.status === "full" || s.status === "closed").length;
        const hidden = schedules.filter((s) => s.visible === false).length;
        return { total, opening, almostFull, full, hidden };
    }, [schedules]);

    // Handle Open Create Modal
    const handleOpenCreate = () => {
        setEditingItem(null);
        const defaultCourse = courses.find((c) => c.courseType === "onsite") || courses[0];
        
        // Default start date = 7 days from now, end date = 8 days from now
        const today = new Date();
        const start = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const end = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000);

        setFormState({
            ...emptyForm,
            courseSlug: defaultCourse ? defaultCourse.slug : "",
            startDate: start.toISOString().split("T")[0],
            endDate: end.toISOString().split("T")[0],
        });
        setModalOpen(true);
    };

    // Handle Open Edit Modal
    const handleOpenEdit = (item: ScheduleItem) => {
        setEditingItem(item);
        setFormState({
            courseSlug: item.courseSlug,
            startDate: item.startDate,
            endDate: item.endDate || item.startDate,
            time: item.time,
            location: item.location,
            spotsLeft: item.spotsLeft,
            totalSpots: item.totalSpots || 8,
            status: item.status,
            priceOverride: item.priceOverride,
            note: item.note || "",
            visible: item.visible !== false,
        });
        setModalOpen(true);
    };

    // Handle Duplicate Item
    const handleDuplicate = (item: ScheduleItem) => {
        setEditingItem(null);
        // Set new start date 1 month after current item's start date
        const curStart = new Date(item.startDate);
        const nextMonth = new Date(curStart.getFullYear(), curStart.getMonth() + 1, curStart.getDate());
        const nextMonthEnd = new Date(curStart.getFullYear(), curStart.getMonth() + 1, curStart.getDate() + 1);

        setFormState({
            courseSlug: item.courseSlug,
            startDate: !isNaN(nextMonth.getTime()) ? nextMonth.toISOString().split("T")[0] : "",
            endDate: !isNaN(nextMonthEnd.getTime()) ? nextMonthEnd.toISOString().split("T")[0] : "",
            time: item.time,
            location: item.location,
            spotsLeft: item.totalSpots || 8,
            totalSpots: item.totalSpots || 8,
            status: "opening",
            priceOverride: item.priceOverride,
            note: item.note ? `${item.note} (Đợt mới)` : "",
            visible: true,
        });
        setModalOpen(true);
        showToast("Đã sao chép cấu hình lịch, bạn có thể chỉnh ngày và lưu lại!", "info" as any);
    };

    // Handle Save (Create or Update)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.courseSlug) {
            showToast("Vui lòng chọn khóa học!", "error");
            return;
        }
        if (!formState.startDate) {
            showToast("Vui lòng chọn ngày khai giảng!", "error");
            return;
        }

        setIsSaving(true);
        try {
            const payload: ScheduleItem = {
                id: editingItem ? editingItem.id : `sch-${Date.now()}`,
                courseSlug: formState.courseSlug,
                startDate: formState.startDate,
                endDate: formState.endDate || formState.startDate,
                time: formState.time || "08:00 - 17:00",
                location: formState.location || "Cơ sở Cầu Giấy",
                spotsLeft: Number(formState.spotsLeft) || 0,
                totalSpots: Number(formState.totalSpots) || 8,
                status: formState.status,
                priceOverride: formState.priceOverride ? Number(formState.priceOverride) : undefined,
                note: formState.note?.trim() || "",
                visible: formState.visible,
            };

            const res = await fetch("/api/cms/schedules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ schedule: payload }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Lỗi khi lưu lịch khai giảng");
            }

            const data = await res.json();
            if (data.schedules) {
                setSchedules(data.schedules);
            }

            setModalOpen(false);
            showToast(
                editingItem
                    ? "Cập nhật lịch khai giảng thành công!"
                    : "Thêm mới đợt mở lớp thành công!",
                "success"
            );
        } catch (err: any) {
            console.error("Save schedule error:", err);
            showToast(err.message || "Không thể lưu dữ liệu", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // Quick toggle visibility
    const handleToggleVisible = async (item: ScheduleItem) => {
        const newVisible = !item.visible;
        const updatedItem = { ...item, visible: newVisible };

        // Optimistic UI update
        setSchedules((prev) =>
            prev.map((s) => (s.id === item.id ? updatedItem : s))
        );

        try {
            const res = await fetch("/api/cms/schedules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ schedule: updatedItem }),
            });

            if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");
            showToast(
                newVisible ? "Đã bật hiển thị trên website" : "Đã ẩn lịch khỏi website",
                "success"
            );
        } catch (err: any) {
            // Rollback on error
            setSchedules((prev) =>
                prev.map((s) => (s.id === item.id ? item : s))
            );
            showToast(err.message || "Lỗi cập nhật", "error");
        }
    };

    // Handle Delete
    const handleDeleteClick = (item: ScheduleItem) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/cms/schedules?id=${itemToDelete.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Lỗi khi xóa lịch khai giảng");

            const data = await res.json();
            if (data.schedules) {
                setSchedules(data.schedules);
            } else {
                setSchedules((prev) => prev.filter((s) => s.id !== itemToDelete.id));
            }

            setDeleteModalOpen(false);
            setItemToDelete(null);
            showToast("Đã xóa lịch khai giảng thành công!", "success");
        } catch (err: any) {
            showToast(err.message || "Không thể xóa lịch khai giảng", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // Restore Defaults
    const handleRestoreDefaults = async () => {
        if (!confirm("Bạn có chắc chắn muốn khôi phục về danh sách lịch khai giảng mẫu ban đầu? Tất cả chỉnh sửa hiện tại sẽ được cập nhật lại.")) {
            return;
        }

        setIsSaving(true);
        try {
            const { defaultSchedules } = await import("@/data/default-schedules");
            const res = await fetch("/api/cms/schedules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ schedules: defaultSchedules }),
            });

            if (!res.ok) throw new Error("Khôi phục mặc định thất bại");
            const data = await res.json();
            if (data.schedules) {
                setSchedules(data.schedules);
            }
            showToast("Đã khôi phục danh sách lịch khai giảng mặc định!", "success");
        } catch (err: any) {
            showToast(err.message || "Lỗi khôi phục", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusBadge = (status: ScheduleItem["status"]) => {
        switch (status) {
            case "opening":
                return (
                    <span className="badge bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-xs font-medium px-2.5 py-1">
                        ● Đang nhận học viên
                    </span>
                );
            case "almost-full":
                return (
                    <span className="badge bg-amber-500/15 text-amber-500 border border-amber-500/30 text-xs font-medium px-2.5 py-1 animate-pulse">
                        🔥 Sắp hết chỗ
                    </span>
                );
            case "full":
                return (
                    <span className="badge bg-rose-500/15 text-rose-500 border border-rose-500/30 text-xs font-medium px-2.5 py-1">
                        ✕ Đã đủ học viên
                    </span>
                );
            case "closed":
                return (
                    <span className="badge bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 text-xs font-medium px-2.5 py-1">
                        Đã đóng lớp
                    </span>
                );
        }
    };

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-16">
            {/* Toast Feedback */}
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${
                            toastMessage.type === "success"
                                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50"
                                : toastMessage.type === "warning"
                                ? "bg-amber-950/90 text-amber-200 border-amber-500/40 shadow-amber-950/50"
                                : "bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50"
                        }`}
                    >
                        {toastMessage.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        )}
                        <span>{toastMessage.text}</span>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Hệ Thống Quản Trị Tuyển Sinh</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] flex items-center gap-3">
                        Lịch Khai Giảng
                        <span className="text-sm font-normal px-2.5 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                            {schedules.length} đợt mở lớp
                        </span>
                    </h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        Quản lý ngày khai giảng, số lượng học viên, ca học và trạng thái tuyển sinh hiển thị công khai trên website.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                        href="/lich-khai-giang"
                        target="_blank"
                        className="btn btn-secondary text-sm flex items-center gap-1.5"
                        title="Xem trang hiển thị công khai cho học viên"
                    >
                        <span>Xem trang web</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={handleRestoreDefaults}
                        disabled={isSaving}
                        className="btn btn-secondary text-sm flex items-center gap-1.5"
                        title="Khôi phục danh sách mẫu ban đầu"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Mặc định</span>
                    </button>
                    <button
                        onClick={handleOpenCreate}
                        className="btn btn-primary text-sm flex items-center gap-1.5 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm lịch mở lớp</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                    <div className="flex items-center justify-between text-[var(--color-text-secondary)] text-xs mb-2">
                        <span>Tổng lịch mở lớp</span>
                        <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">
                        {stats.hidden > 0 ? `Đang ẩn: ${stats.hidden} đợt` : "Tất cả đều công khai"}
                    </div>
                </div>

                <div className="card p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                    <div className="flex items-center justify-between text-emerald-500 text-xs mb-2">
                        <span>Đang nhận đăng ký</span>
                        <CalendarCheck className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-500">{stats.opening}</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">Sẵn sàng nhận học viên</div>
                </div>

                <div className="card p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                    <div className="flex items-center justify-between text-amber-500 text-xs mb-2">
                        <span>Sắp hết chỗ</span>
                        <Timer className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-bold text-amber-500">{stats.almostFull}</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">Còn dưới 3 suất</div>
                </div>

                <div className="card p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                    <div className="flex items-center justify-between text-rose-500 text-xs mb-2">
                        <span>Đã đủ / Đóng lớp</span>
                        <CalendarX className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-bold text-rose-500">{stats.full}</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">Ngừng nhận học viên</div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="card p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên khóa học, địa điểm, ghi chú..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 w-full text-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter by Course */}
                    <div className="w-full md:w-56">
                        <select
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className="input w-full text-sm"
                        >
                            <option value="all">Tất cả khóa học</option>
                            {courses.map((c) => (
                                <option key={c.id || c.slug} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter by Status */}
                    <div className="w-full md:w-44">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input w-full text-sm"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="opening">Đang nhận đăng ký</option>
                            <option value="almost-full">Sắp hết chỗ</option>
                            <option value="full">Đã đủ học viên</option>
                            <option value="closed">Đã đóng lớp</option>
                        </select>
                    </div>

                    {/* Filter by Visibility */}
                    <div className="w-full md:w-40">
                        <select
                            value={visibilityFilter}
                            onChange={(e) => setVisibilityFilter(e.target.value)}
                            className="input w-full text-sm"
                        >
                            <option value="all">Tất cả hiển thị</option>
                            <option value="visible">Đang hiển thị</option>
                            <option value="hidden">Đang ẩn</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Schedule List */}
            {isLoading ? (
                <div className="card p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                    <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-[var(--color-text-secondary)]">Đang tải danh sách lịch khai giảng...</p>
                </div>
            ) : filteredSchedules.length === 0 ? (
                <div className="card p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                    <Calendar className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3 opacity-40" />
                    <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">
                        Không tìm thấy lịch khai giảng phù hợp
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto mb-4">
                        {searchTerm || statusFilter !== "all" || courseFilter !== "all"
                            ? "Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại các bộ lọc."
                            : "Chưa có lịch khai giảng nào được tạo. Hãy tạo đợt mở lớp đầu tiên!"}
                    </p>
                    <button onClick={handleOpenCreate} className="btn btn-primary text-sm">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Thêm lịch mở lớp ngay
                    </button>
                </div>
            ) : (
                <div className="space-y-3.5">
                    {filteredSchedules.map((schedule) => {
                        const course = courses.find((c) => c.slug === schedule.courseSlug);
                        const isHidden = schedule.visible === false;
                        const spotsLeft = schedule.spotsLeft || 0;
                        const totalSpots = schedule.totalSpots || 8;
                        const filledSpots = Math.max(0, totalSpots - spotsLeft);
                        const fillPercent = Math.min(100, Math.round((filledSpots / totalSpots) * 100));

                        return (
                            <div
                                key={schedule.id}
                                className={`card p-5 bg-[var(--color-surface)] border rounded-2xl transition-all hover:shadow-md ${
                                    isHidden
                                        ? "opacity-60 border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/40"
                                        : "border-[var(--color-border)]"
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                    {/* Left: Date Badge & Course Details */}
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Date Box */}
                                        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-orange-500)] to-[var(--color-orange-600)] text-white flex flex-col items-center justify-center shadow-sm">
                                            <span className="text-2xl font-bold leading-none">
                                                {new Date(schedule.startDate).getDate() || "--"}
                                            </span>
                                            <span className="text-xs opacity-90 mt-1">
                                                Tháng {new Date(schedule.startDate).getMonth() + 1 || "--"}
                                            </span>
                                            <span className="text-[10px] opacity-75">
                                                {new Date(schedule.startDate).getFullYear() || ""}
                                            </span>
                                        </div>

                                        {/* Course Information */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                {getStatusBadge(schedule.status)}
                                                {isHidden && (
                                                    <span className="badge bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 text-xs px-2 py-0.5">
                                                        Đang ẩn trên web
                                                    </span>
                                                )}
                                                {schedule.priceOverride && (
                                                    <span className="badge bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs px-2 py-0.5">
                                                        Ưu đãi: {schedule.priceOverride.toLocaleString("vi-VN")}đ
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-bold text-[var(--color-text)] truncate">
                                                {course ? course.name : schedule.courseSlug}
                                            </h3>

                                            {/* Meta Info Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2.5 text-xs text-[var(--color-text-secondary)]">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
                                                    <span>
                                                        {formatDateDisplay(schedule.startDate)}
                                                        {schedule.endDate && schedule.endDate !== schedule.startDate && (
                                                            <> → {formatDateDisplay(schedule.endDate)}</>
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
                                                    <span>{schedule.time}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5 truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
                                                    <span className="truncate" title={schedule.location}>
                                                        {schedule.location}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Note / Promo info if exists */}
                                            {schedule.note && (
                                                <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                                                    <span>{schedule.note}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Middle: Capacity Progress Bar */}
                                    <div className="w-full lg:w-48 bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-border)]">
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="text-[var(--color-text-secondary)]">Chỗ học:</span>
                                            <span className="font-semibold text-[var(--color-text)]">
                                                Còn{" "}
                                                <span
                                                    className={
                                                        spotsLeft <= 2
                                                            ? "text-rose-500 font-bold"
                                                            : "text-[var(--color-primary)] font-bold"
                                                    }
                                                >
                                                    {spotsLeft}
                                                </span>
                                                /{totalSpots}
                                            </span>
                                        </div>
                                        <div className="w-full bg-[var(--color-surface)] h-2 rounded-full overflow-hidden border border-[var(--color-border)]">
                                            <div
                                                className={`h-full transition-all rounded-full ${
                                                    fillPercent >= 90
                                                        ? "bg-rose-500"
                                                        : fillPercent >= 60
                                                        ? "bg-amber-500"
                                                        : "bg-[var(--color-primary)]"
                                                }`}
                                                style={{ width: `${fillPercent}%` }}
                                            />
                                        </div>
                                        <div className="text-[10px] text-right text-[var(--color-text-muted)] mt-1">
                                            Đã đăng ký: {filledSpots} học viên ({fillPercent}%)
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2 self-end lg:self-center">
                                        <button
                                            onClick={() => handleToggleVisible(schedule)}
                                            className={`p-2 rounded-xl border text-xs transition-colors ${
                                                isHidden
                                                    ? "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                                                    : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-primary)]"
                                            }`}
                                            title={isHidden ? "Hiện lại trên web" : "Ẩn khỏi web"}
                                        >
                                            {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>

                                        <button
                                            onClick={() => handleDuplicate(schedule)}
                                            className="p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                            title="Nhân bản đợt này cho tháng sau"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleOpenEdit(schedule)}
                                            className="p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-blue-400 transition-colors"
                                            title="Chỉnh sửa lịch"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteClick(schedule)}
                                            className="p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-rose-400 transition-colors"
                                            title="Xóa lịch này"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal: Create / Edit Form */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-surface)] z-10">
                            <div>
                                <h2 className="text-lg font-bold text-[var(--color-text)]">
                                    {editingItem ? "Chỉnh sửa Lịch Khai Giảng" : "Thêm Lịch Khai Giảng Mới"}
                                </h2>
                                <p className="text-xs text-[var(--color-text-secondary)]">
                                    Điền thông tin khóa học và các thông số cho đợt tuyển sinh mới.
                                </p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body Form */}
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            {/* Course selection */}
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                                    Khóa học đào tạo <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={formState.courseSlug}
                                    onChange={(e) => setFormState({ ...formState, courseSlug: e.target.value })}
                                    required
                                    className="input w-full text-sm"
                                >
                                    <option value="" disabled>
                                        -- Chọn khóa học --
                                    </option>
                                    {courses.map((c) => (
                                        <option key={c.id || c.slug} value={c.slug}>
                                            {c.name} {c.courseType === "elearning" ? "(E-learning)" : "(Onsite trực tiếp)"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Dates Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                                        Ngày khai giảng (bắt đầu) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formState.startDate}
                                        onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
                                        required
                                        className="input w-full text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                                        Ngày kết thúc (dự kiến)
                                    </label>
                                    <input
                                        type="date"
                                        value={formState.endDate}
                                        onChange={(e) => setFormState({ ...formState, endDate: e.target.value })}
                                        className="input w-full text-sm"
                                    />
                                </div>
                            </div>

                            {/* Time & Shortcuts */}
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                                    Khung giờ học <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="VD: 08:00 - 17:00"
                                    value={formState.time}
                                    onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                                    required
                                    className="input w-full text-sm mb-2"
                                />
                                <div className="flex flex-wrap gap-1.5">
                                    {["08:00 - 17:00", "08:30 - 16:30", "08:00 - 12:00", "13:30 - 17:30", "18:00 - 21:00", "Thứ Bảy & Chủ Nhật"].map(
                                        (quickTime) => (
                                            <button
                                                type="button"
                                                key={quickTime}
                                                onClick={() => setFormState({ ...formState, time: quickTime })}
                                                className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-colors"
                                            >
                                                {quickTime}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Location & Shortcuts */}
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                                    Địa điểm / Cơ sở học <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="VD: Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)"
                                    value={formState.location}
                                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                                    required
                                    className="input w-full text-sm mb-2"
                                />
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
                                        "Cơ sở Cầu Giấy",
                                        "Bếp thực hành DuaxCar Academy",
                                        "Trực tuyến (Zoom & E-learning)"
                                    ].map((quickLoc) => (
                                        <button
                                            type="button"
                                            key={quickLoc}
                                            onClick={() => setFormState({ ...formState, location: quickLoc })}
                                            className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-colors"
                                        >
                                            {quickLoc}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Spots & Status Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                                        Số chỗ còn lại <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formState.spotsLeft}
                                        onChange={(e) => setFormState({ ...formState, spotsLeft: parseInt(e.target.value) || 0 })}
                                        required
                                        className="input w-full text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                                        Tổng quy mô lớp (học viên)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={formState.totalSpots}
                                        onChange={(e) => setFormState({ ...formState, totalSpots: parseInt(e.target.value) || 8 })}
                                        className="input w-full text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                                        Trạng thái tuyển sinh
                                    </label>
                                    <select
                                        value={formState.status}
                                        onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                                        className="input w-full text-sm"
                                    >
                                        <option value="opening">Đang nhận học viên</option>
                                        <option value="almost-full">Sắp hết chỗ</option>
                                        <option value="full">Đã đủ học viên</option>
                                        <option value="closed">Đã đóng lớp</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price Override (Optional) */}
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                                    Học phí ưu đãi riêng cho đợt này (VNĐ - tùy chọn)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Để trống nếu áp dụng học phí chuẩn của khóa học"
                                    value={formState.priceOverride || ""}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            priceOverride: e.target.value ? parseInt(e.target.value) : undefined,
                                        })
                                    }
                                    className="input w-full text-sm"
                                />
                            </div>

                            {/* Note / Promotion info */}
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                                    Ghi chú / Ưu đãi đặc biệt đính kèm
                                </label>
                                <input
                                    type="text"
                                    placeholder="VD: Tặng cẩm nang gia vị độc quyền, tài trợ 100% nguyên liệu tươi..."
                                    value={formState.note}
                                    onChange={(e) => setFormState({ ...formState, note: e.target.value })}
                                    className="input w-full text-sm"
                                />
                            </div>

                            {/* Visible Checkbox */}
                            <div className="pt-2">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formState.visible}
                                        onChange={(e) => setFormState({ ...formState, visible: e.target.checked })}
                                        className="w-4 h-4 rounded-sm border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                    />
                                    <span className="text-xs font-medium text-[var(--color-text)]">
                                        Hiển thị công khai lịch này trên trang Lịch Khai Giảng website
                                    </span>
                                </label>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-5 border-t border-[var(--color-border)] mt-6">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn btn-secondary text-sm"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="btn btn-primary text-sm flex items-center gap-1.5"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Đang lưu...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>{editingItem ? "Lưu thay đổi" : "Tạo đợt mở lớp"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Confirm Delete */}
            {deleteModalOpen && itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 mx-auto">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--color-text)] text-center mb-2">
                            Xác nhận xóa lịch khai giảng?
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
                            Bạn có chắc chắn muốn xóa lịch khai giảng ngày{" "}
                            <span className="font-semibold text-[var(--color-text)]">
                                {formatDateDisplay(itemToDelete.startDate)}
                            </span>{" "}
                            của khóa học này không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(false)}
                                className="btn btn-secondary text-sm flex-1"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={isSaving}
                                className="btn bg-rose-600 hover:bg-rose-700 text-white text-sm flex-1 flex items-center justify-center gap-1.5"
                            >
                                {isSaving ? "Đang xóa..." : "Xóa vĩnh viễn"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
