"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    ArrowRight,
    ChefHat,
    Search,
    Sparkles,
    CheckCircle2,
    CalendarCheck,
    Tag,
    Layers,
    X,
    Filter,
    Phone,
    Send,
    Loader2,
    BookOpen,
    ExternalLink,
    AlertCircle,
    Check
} from "lucide-react";
import { getLeadJourneyPayload } from "@/lib/client-tracker";
import CategoryIcon from "@/components/category-icon";
import { ScheduleItem } from "@/data/default-schedules";
import { Course, Instructor } from "@/lib/types";
import { resolveScheduleInfo } from "@/lib/course-schedule-helper";

interface ScheduleClientProps {
    initialSchedules: ScheduleItem[];
    courses: Course[];
    instructors: Instructor[];
    courseCategories: { id: string; name: string }[];
}

function formatScheduleDate(dateStr: string) {
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
}

export default function ScheduleClient({
    initialSchedules,
    courses: defaultCourses,
    instructors,
    courseCategories,
}: ScheduleClientProps) {
    const [schedules, setSchedules] = useState<ScheduleItem[]>(initialSchedules);
    const [courses, setCourses] = useState<Course[]>(defaultCourses);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    // Registration Modal State
    const [selectedScheduleForModal, setSelectedScheduleForModal] = useState<ScheduleItem | null>(null);
    const [regName, setRegName] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regMessage, setRegMessage] = useState("");
    const [isSubmittingReg, setIsSubmittingReg] = useState(false);
    const [regSuccess, setRegSuccess] = useState(false);
    const [regError, setRegError] = useState<string | null>(null);
    const [hpCompany, setHpCompany] = useState("");

    // Fetch latest schedules from CMS API on mount
    useEffect(() => {
        let isMounted = true;
        const fetchLatest = async () => {
            try {
                const res = await fetch("/api/cms/schedules");
                if (res.ok) {
                    const data = await res.json();
                    if (data.schedules && isMounted) {
                        setSchedules(data.schedules);
                    }
                }
            } catch (err) {
                console.error("Failed to refresh schedules from CMS:", err);
            }

            try {
                const cRes = await fetch("/api/cms/courses");
                if (cRes.ok) {
                    const cData = await cRes.json();
                    if (cData.courses && cData.courses.length > 0 && isMounted) {
                        setCourses(cData.courses);
                    }
                }
            } catch {}
        };

        fetchLatest();
        return () => {
            isMounted = false;
        };
    }, []);

    // Filtered list - NEVER drops an item if course is missing from mock
    const visibleSchedules = useMemo(() => {
        return schedules
            .filter((item) => item.visible !== false) // Only public schedules
            .filter((item) => {
                const resolved = resolveScheduleInfo(item, courses);
                const course = resolved.matchedCourse;
                const courseName = resolved.courseName.toLowerCase();

                // Only available filter
                if (onlyAvailable && (item.status === "full" || item.status === "closed" || item.spotsLeft <= 0)) {
                    return false;
                }

                // Category filter
                if (selectedCategory !== "all") {
                    const categoryId = course?.category || (resolved.courseSlug.includes("pho") || resolved.courseSlug.includes("bun") ? "mon-an-sang" : undefined);
                    if (categoryId && categoryId !== selectedCategory) {
                        return false;
                    }
                }

                // Search term
                if (searchTerm.trim()) {
                    const term = searchTerm.toLowerCase();
                    const matchCourseName = courseName.includes(term);
                    const matchLocation = item.location.toLowerCase().includes(term);
                    const matchNote = item.note ? item.note.toLowerCase().includes(term) : false;
                    const matchInstructor = resolved.instructorName ? resolved.instructorName.toLowerCase().includes(term) : false;
                    return matchCourseName || matchLocation || matchNote || matchInstructor;
                }

                return true;
            })
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }, [schedules, courses, searchTerm, selectedCategory, onlyAvailable]);

    const availableCount = useMemo(() => {
        return schedules.filter(
            (s) => s.visible !== false && (s.status === "opening" || s.status === "almost-full") && s.spotsLeft > 0
        ).length;
    }, [schedules]);

    // Handle open register modal
    const handleOpenRegister = (schedule: ScheduleItem) => {
        setSelectedScheduleForModal(schedule);
        setRegSuccess(false);
        setRegError(null);
        setRegMessage("");
        setHpCompany("");
    };

    // Handle submit registration
    const handleSubmitRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!regName.trim() || !regPhone.trim() || !selectedScheduleForModal) {
            setRegError("Vui lòng nhập Họ tên và Số điện thoại liên hệ!");
            return;
        }

        setIsSubmittingReg(true);
        setRegError(null);

        const course = courses.find((c) => c.slug === selectedScheduleForModal.courseSlug);
        const courseName = selectedScheduleForModal.courseName || (course ? course.name : selectedScheduleForModal.courseSlug);

        try {
            const journeyPayload = getLeadJourneyPayload();

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: regName.trim(),
                    phone: regPhone.trim(),
                    email: regEmail.trim() || undefined,
                    course: `${courseName} - Lịch khai giảng ngày ${formatScheduleDate(selectedScheduleForModal.startDate)}`,
                    message: `[Đăng ký Lịch Khai Giảng] Ca học: ${selectedScheduleForModal.time} | Địa điểm: ${selectedScheduleForModal.location} | Lời nhắn: ${regMessage.trim() || "Muốn tư vấn giữ chỗ khóa học"}`,
                    honeypot: hpCompany,
                    visitorId: journeyPayload.visitorId,
                    firstSeenAt: journeyPayload.firstSeenAt,
                    clientJourney: journeyPayload.journeyHistory
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Gửi đăng ký thất bại, vui lòng thử lại!");
            }

            setRegSuccess(true);
        } catch (err: any) {
            setRegError(err.message || "Đã xảy ra lỗi, vui lòng liên hệ Hotline 0963.896.791");
        } finally {
            setIsSubmittingReg(false);
        }
    };

    return (
        <>
            {/* Filter & Search Controls */}
            <section className="py-5 bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-16 z-20 shadow-xs backdrop-blur-md bg-opacity-95">
                <div className="container">
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-lg">
                            <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên món ăn, khóa học, giảng viên hoặc địa điểm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl pl-10 pr-9 py-2.5 text-xs md:text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-all placeholder:text-[var(--color-text-muted)]"
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

                        {/* Category Dropdown & Quick Toggle */}
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-xs md:text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none cursor-pointer leading-normal min-w-[170px]"
                            >
                                <option value="all">Tất cả nhóm món</option>
                                {courseCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <label className="inline-flex items-center gap-2 cursor-pointer bg-[var(--color-background)] px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-colors select-none">
                                <input
                                    type="checkbox"
                                    checked={onlyAvailable}
                                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                                    className="w-4 h-4 rounded-sm text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                />
                                <span className="text-xs font-medium text-[var(--color-text)] whitespace-nowrap">
                                    Chỉ lớp còn nhận chỗ ({availableCount})
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Schedule List Content */}
            <section className="section bg-[var(--color-surface)] py-12 md:py-16">
                <div className="container">
                    {visibleSchedules.length === 0 ? (
                        <div className="card p-12 text-center max-w-xl mx-auto border border-[var(--color-border)] rounded-3xl bg-[var(--color-background)]">
                            <Calendar className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3 opacity-40" />
                            <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">
                                Không tìm thấy lịch khai giảng phù hợp
                            </h3>
                            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                                Hiện chưa có lịch mở lớp phù hợp với tìm kiếm của bạn. Hãy liên hệ với chúng tôi để được xếp lịch theo yêu cầu hoặc tham gia khóa học trực tuyến.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                {(searchTerm || selectedCategory !== "all" || onlyAvailable) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedCategory("all");
                                            setOnlyAvailable(false);
                                        }}
                                        className="btn btn-secondary text-sm rounded-xl"
                                    >
                                        Xóa bộ lọc tìm kiếm
                                    </button>
                                )}
                                <Link href="/lien-he" className="btn btn-primary text-sm rounded-xl">
                                    Yêu cầu mở lớp riêng
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {visibleSchedules.map((schedule) => {
                                const resolved = resolveScheduleInfo(schedule, courses);
                                const course = resolved.matchedCourse;
                                const instructor = instructors.find((i) => i.id === (course ? course.instructorId : ""));
                                const category = courseCategories.find((c) => c.id === (course ? course.category : ""));

                                const displayName = resolved.courseName;
                                const displayImage = resolved.courseImage;
                                const displayUrl = resolved.courseUrl;
                                const displayInstructor = resolved.instructorName;
                                const displayInstructorRole = instructor ? instructor.title || instructor.role : "Giảng viên ẩm thực";

                                const spotsLeft = schedule.spotsLeft ?? 0;
                                const totalSpots = schedule.totalSpots ?? 8;
                                const filledSpots = Math.max(0, totalSpots - spotsLeft);
                                const fillPercent = Math.min(100, Math.round((filledSpots / totalSpots) * 100));

                                const isFull = schedule.status === "full" || schedule.status === "closed" || spotsLeft <= 0;
                                const isAlmostFull = schedule.status === "almost-full" || (spotsLeft > 0 && spotsLeft <= 2);

                                const originalPrice = schedule.price || resolved.price || (course ? course.price : undefined);
                                const promoPrice = schedule.priceOverride;

                                return (
                                    <div
                                        key={schedule.id}
                                        className={`card p-5 md:p-7 rounded-3xl border transition-all duration-300 hover:shadow-xl group bg-[var(--color-surface)] ${
                                            isFull
                                                ? "border-[var(--color-border)] opacity-75"
                                                : isAlmostFull
                                                ? "border-amber-500/40 hover:border-amber-500 shadow-amber-500/5"
                                                : "border-[var(--color-border)] hover:border-[var(--color-primary)]/60 shadow-orange-500/5"
                                        }`}
                                    >
                                        <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                                            {/* Left: Image with Date Overlay */}
                                            <div className="relative w-full lg:w-72 h-52 lg:h-56 rounded-2xl overflow-hidden flex-shrink-0 border border-[var(--color-border)] shadow-xs">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={displayImage}
                                                    alt={displayName}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                {/* Date Badge Overlay */}
                                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-xl px-3 py-2 flex flex-col items-center shadow-lg">
                                                    <span className="text-2xl font-black leading-none">
                                                        {new Date(schedule.startDate).getDate() || "--"}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 text-white/90">
                                                        Tháng {new Date(schedule.startDate).getMonth() + 1 || "--"}
                                                    </span>
                                                    <span className="text-[9px] text-white/70">
                                                        {new Date(schedule.startDate).getFullYear()}
                                                    </span>
                                                </div>

                                                {/* Status Badge Overlay */}
                                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap">
                                                    {isFull ? (
                                                        <span className="badge bg-zinc-900/80 text-zinc-300 border border-zinc-700 text-xs px-2.5 py-1 backdrop-blur-md">
                                                            Đã đủ học viên
                                                        </span>
                                                    ) : isAlmostFull ? (
                                                        <span className="badge bg-amber-500/90 text-white border border-amber-400 text-xs font-bold px-2.5 py-1 backdrop-blur-md animate-pulse">
                                                            🔥 Sắp hết chỗ
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-emerald-600/90 text-white border border-emerald-400 text-xs font-semibold px-2.5 py-1 backdrop-blur-md">
                                                            ● Đang nhận học viên
                                                        </span>
                                                    )}

                                                    {category && (
                                                        <span className="text-[11px] font-medium text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 shrink-0">
                                                            <CategoryIcon id={category.id} className="w-3 h-3" />
                                                            <span>{category.name}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Middle: Course & Schedule Details */}
                                            <div className="flex-1 min-w-0">
                                                {/* Course Title */}
                                                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                                                    <h3 className="text-xl md:text-2xl font-extrabold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                                                        <Link href={displayUrl} title="Xem chi tiết khóa học này">
                                                            {displayName}
                                                        </Link>
                                                    </h3>
                                                </div>

                                                {/* Instructor & Price Row */}
                                                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[var(--color-border)]">
                                                    {/* Instructor */}
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/15 flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary)]/20 shrink-0">
                                                            <ChefHat className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-semibold text-[var(--color-text)]">
                                                                {displayInstructor}
                                                            </div>
                                                            <div className="text-[11px] text-[var(--color-text-muted)]">
                                                                {displayInstructorRole}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Tuition Fee / Price */}
                                                    <div className="text-right">
                                                        {promoPrice ? (
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-xl md:text-2xl font-black text-[var(--color-primary)]">
                                                                    {promoPrice.toLocaleString("vi-VN")}đ
                                                                </span>
                                                                {originalPrice && (
                                                                    <span className="text-xs line-through text-[var(--color-text-muted)]">
                                                                        {originalPrice.toLocaleString("vi-VN")}đ
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : originalPrice ? (
                                                            <span className="text-lg md:text-xl font-bold text-[var(--color-text)]">
                                                                {originalPrice.toLocaleString("vi-VN")}đ
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded-md">
                                                                Học phí ưu đãi theo đợt
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Meta Info Grid: Date, Time, Location, Capacity */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[var(--color-text-secondary)] mb-3">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <Calendar className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                                        <span className="truncate">
                                                            <strong className="text-[var(--color-text)]">Khai giảng: </strong>
                                                            {formatScheduleDate(schedule.startDate)}
                                                            {schedule.endDate && schedule.endDate !== schedule.startDate && (
                                                                <> → {formatScheduleDate(schedule.endDate)}</>
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <Clock className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                                        <span className="truncate">
                                                            <strong className="text-[var(--color-text)]">Ca học: </strong>
                                                            {schedule.time}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <MapPin className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                                        <span className="truncate" title={schedule.location}>
                                                            <strong className="text-[var(--color-text)]">Địa điểm: </strong>
                                                            {schedule.location}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <Users className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                                        <span className="truncate">
                                                            <strong className="text-[var(--color-text)]">Quy mô: </strong>
                                                            {isFull ? (
                                                                <span className="text-rose-500 font-semibold">Đã đủ 8/8 học viên</span>
                                                            ) : (
                                                                <>
                                                                    Còn{" "}
                                                                    <span className="text-[var(--color-primary)] font-extrabold">
                                                                        {spotsLeft}
                                                                    </span>
                                                                    /{totalSpots} suất học
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Promo Note if exists */}
                                                {schedule.note && (
                                                    <div className="inline-flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 w-full mb-3">
                                                        <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-500" />
                                                        <span className="font-medium">{schedule.note}</span>
                                                    </div>
                                                )}

                                                {/* Capacity Progress Bar */}
                                                <div className="w-full bg-[var(--color-background)] p-2.5 rounded-xl border border-[var(--color-border)]">
                                                    <div className="flex items-center justify-between text-[11px] mb-1">
                                                        <span className="text-[var(--color-text-secondary)]">Tình trạng giữ chỗ lớp học:</span>
                                                        <span className="font-bold text-[var(--color-text)]">
                                                            {fillPercent}% ({filledSpots}/{totalSpots} học viên)
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
                                                </div>
                                            </div>

                                            {/* Right: CTA Buttons */}
                                            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center flex-shrink-0 lg:border-l lg:border-[var(--color-border)] lg:pl-6 w-full lg:w-48">
                                                {/* View Course Details Button */}
                                                <Link
                                                    href={displayUrl}
                                                    className="btn btn-secondary text-xs h-11 px-4 rounded-xl flex items-center justify-center gap-1.5 hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition-all font-semibold flex-1 sm:flex-initial"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>Xem chi tiết khóa học</span>
                                                </Link>

                                                {/* Register / Consult Button (Opens Modal in Page) */}
                                                {isFull ? (
                                                    <button
                                                        onClick={() => handleOpenRegister(schedule)}
                                                        className="btn btn-secondary text-xs h-11 px-4 rounded-xl flex items-center justify-center gap-1.5 opacity-80 flex-1 sm:flex-initial"
                                                    >
                                                        <span>Đăng ký danh sách chờ</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleOpenRegister(schedule)}
                                                        className="btn btn-primary text-xs h-11 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 font-bold hover:shadow-lg transition-all flex-1 sm:flex-initial"
                                                    >
                                                        <span>Tư vấn & Đăng ký</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal Popup Đăng ký tư vấn trực tiếp trong trang */}
            {selectedScheduleForModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                            <div>
                                <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                                    Đăng Ký Tuyển Sinh
                                </span>
                                <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
                                    Tư vấn lịch khai giảng
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedScheduleForModal(null)}
                                className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                            {regSuccess ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-[var(--color-text)] mb-2">
                                        Đăng ký giữ chỗ thành công!
                                    </h4>
                                    <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">
                                        Cảm ơn bạn <strong className="text-[var(--color-text)]">{regName}</strong>. Chuyên viên đào tạo của DuaxCar Kitchen sẽ liên hệ qua số điện thoại <strong className="text-[var(--color-primary)]">{regPhone}</strong> trong vòng 15 phút để tư vấn chi tiết và gửi giấy báo nhập học.
                                    </p>
                                    <div className="p-4 bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] mb-6 text-left text-xs space-y-2">
                                        <div>
                                            <span className="text-[var(--color-text-muted)]">Khóa học: </span>
                                            <strong className="text-[var(--color-text)]">
                                                {selectedScheduleForModal.courseName || selectedScheduleForModal.courseSlug}
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-text-muted)]">Ngày khai giảng: </span>
                                            <strong className="text-[var(--color-text)]">
                                                {formatScheduleDate(selectedScheduleForModal.startDate)} ({selectedScheduleForModal.time})
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-text-muted)]">Địa điểm: </span>
                                            <span className="text-[var(--color-text)]">
                                                {selectedScheduleForModal.location}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedScheduleForModal(null)}
                                        className="btn btn-primary w-full text-sm rounded-xl py-3"
                                    >
                                        Đã hiểu & Đóng lại
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                                    {/* Invisible Honeypot anti-bot trap */}
                                    <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                                        <input
                                            type="text"
                                            name="_hp_company"
                                            value={hpCompany}
                                            onChange={(e) => setHpCompany(e.target.value)}
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>

                                    {/* Selected Schedule Summary Card */}
                                    <div className="p-3.5 bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] text-xs space-y-1.5">
                                        <div className="font-bold text-sm text-[var(--color-text)]">
                                            {selectedScheduleForModal.courseName || selectedScheduleForModal.courseSlug}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Khai giảng: {formatScheduleDate(selectedScheduleForModal.startDate)}</span>
                                        </div>
                                        <div className="text-[var(--color-text-muted)] flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Ca học: {selectedScheduleForModal.time}</span>
                                        </div>
                                        <div className="text-[var(--color-text-muted)] flex items-center gap-1.5 truncate">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">{selectedScheduleForModal.location}</span>
                                        </div>
                                    </div>

                                    {regError && (
                                        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>{regError}</span>
                                        </div>
                                    )}

                                    {/* Name input */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                                            Họ và tên của bạn <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="VD: Nguyễn Văn An"
                                            value={regName}
                                            onChange={(e) => setRegName(e.target.value)}
                                            required
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-all placeholder:text-[var(--color-text-muted)]"
                                        />
                                    </div>

                                    {/* Phone input */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                                            Số điện thoại (Zalo nhận thông báo) <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="VD: 0988 123 456"
                                            value={regPhone}
                                            onChange={(e) => setRegPhone(e.target.value)}
                                            required
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-all placeholder:text-[var(--color-text-muted)]"
                                        />
                                    </div>

                                    {/* Email input */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                                            Địa chỉ Email (Nhận giáo trình & giấy báo)
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="VD: vanan@gmail.com (không bắt buộc)"
                                            value={regEmail}
                                            onChange={(e) => setRegEmail(e.target.value)}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-all placeholder:text-[var(--color-text-muted)]"
                                        />
                                    </div>

                                    {/* Message / Goal input */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                                            Nhu cầu học / Lời nhắn cho giảng viên
                                        </label>
                                        <textarea
                                            rows={2}
                                            placeholder="VD: Em muốn học để mở quán ăn sáng, cần tư vấn thêm về nguyên liệu..."
                                            value={regMessage}
                                            onChange={(e) => setRegMessage(e.target.value)}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-3 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-all placeholder:text-[var(--color-text-muted)] resize-none"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReg}
                                        className="btn btn-primary w-full text-sm h-12 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all"
                                    >
                                        {isSubmittingReg ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Đang gửi thông tin...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>Xác nhận đăng ký tư vấn</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center text-[11px] text-[var(--color-text-muted)] flex items-center justify-center gap-1">
                                        <Phone className="w-3 h-3 text-[var(--color-primary)]" />
                                        <span>Cần hỗ trợ gấp? Gọi Hotline: <strong>0963.896.791</strong></span>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
