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
    Filter
} from "lucide-react";
import CategoryIcon from "@/components/category-icon";
import { ScheduleItem } from "@/data/default-schedules";
import { Course, Instructor, CourseCategory } from "@/lib/types";

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

    // Filtered list
    const visibleSchedules = useMemo(() => {
        return schedules
            .filter((item) => item.visible !== false) // Only public schedules
            .filter((item) => {
                const course = courses.find((c) => c.slug === item.courseSlug);
                if (!course) return false;

                // Only available filter
                if (onlyAvailable && (item.status === "full" || item.status === "closed" || item.spotsLeft <= 0)) {
                    return false;
                }

                // Category filter
                if (selectedCategory !== "all" && course.category !== selectedCategory) {
                    return false;
                }

                // Search term
                if (searchTerm.trim()) {
                    const term = searchTerm.toLowerCase();
                    const matchCourseName = course.name.toLowerCase().includes(term);
                    const matchLocation = item.location.toLowerCase().includes(term);
                    const matchNote = item.note ? item.note.toLowerCase().includes(term) : false;
                    return matchCourseName || matchLocation || matchNote;
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

    return (
        <>
            {/* Filter & Search Controls */}
            <section className="py-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-16 z-20 shadow-xs">
                <div className="container">
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên món ăn, khóa học hoặc địa điểm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-10 pr-9 w-full text-sm rounded-xl"
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
                                className="input text-sm rounded-xl py-2"
                            >
                                <option value="all">Tất cả nhóm món</option>
                                {courseCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <label className="inline-flex items-center gap-2 cursor-pointer bg-[var(--color-background)] px-3 py-2 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-colors">
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
            <section className="section bg-[var(--color-surface)]">
                <div className="container">
                    {visibleSchedules.length === 0 ? (
                        <div className="card p-12 text-center max-w-xl mx-auto border border-[var(--color-border)] rounded-2xl">
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
                                        className="btn btn-secondary text-sm"
                                    >
                                        Xóa bộ lọc tìm kiếm
                                    </button>
                                )}
                                <Link href="/lien-he" className="btn btn-primary text-sm">
                                    Yêu cầu mở lớp riêng
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {visibleSchedules.map((schedule) => {
                                const course = courses.find((c) => c.slug === schedule.courseSlug);
                                if (!course) return null;

                                const instructor = instructors.find((i) => i.id === course.instructorId);
                                const category = courseCategories.find((c) => c.id === course.category);
                                const spotsLeft = schedule.spotsLeft ?? 0;
                                const isFull = schedule.status === "full" || schedule.status === "closed" || spotsLeft <= 0;
                                const isAlmostFull = schedule.status === "almost-full" || (spotsLeft > 0 && spotsLeft <= 2);

                                return (
                                    <div
                                        key={schedule.id}
                                        className={`card p-6 md:p-8 hover:shadow-lg transition-all rounded-2xl border ${
                                            isFull
                                                ? "border-[var(--color-border)] opacity-75"
                                                : isAlmostFull
                                                ? "border-amber-500/40 hover:border-amber-500/80"
                                                : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                                        }`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                            {/* Date Badge */}
                                            <div className="flex-shrink-0">
                                                <div
                                                    className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg ${
                                                        isFull
                                                            ? "bg-gradient-to-br from-zinc-600 to-zinc-700"
                                                            : isAlmostFull
                                                            ? "bg-gradient-to-br from-amber-500 to-orange-600"
                                                            : "bg-gradient-to-br from-[var(--color-orange-500)] to-[var(--color-orange-600)]"
                                                    }`}
                                                >
                                                    <div className="text-3xl font-extrabold leading-none">
                                                        {new Date(schedule.startDate).getDate() || "--"}
                                                    </div>
                                                    <div className="text-xs uppercase tracking-wider font-semibold opacity-95 mt-1">
                                                        Tháng {new Date(schedule.startDate).getMonth() + 1 || "--"}
                                                    </div>
                                                    <div className="text-[10px] opacity-80">
                                                        {new Date(schedule.startDate).getFullYear()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Course Info */}
                                            <div className="flex-grow min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    {category && (
                                                        <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1.5 bg-[var(--color-primary)]/10 px-2.5 py-0.5 rounded-full">
                                                            <CategoryIcon id={course.category} className="w-3.5 h-3.5" />
                                                            <span>{category.name}</span>
                                                        </span>
                                                    )}

                                                    {isFull ? (
                                                        <span className="badge bg-zinc-500/20 text-zinc-400 border border-zinc-500/30 text-xs">
                                                            Đã đủ học viên
                                                        </span>
                                                    ) : isAlmostFull ? (
                                                        <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-semibold animate-pulse">
                                                            🔥 Sắp hết chỗ
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                                                            Đang nhận đăng ký
                                                        </span>
                                                    )}

                                                    {schedule.priceOverride && (
                                                        <span className="badge bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold">
                                                            Ưu đãi: {schedule.priceOverride.toLocaleString("vi-VN")}đ
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="heading-4 text-[var(--color-text)] mb-3">
                                                    <Link
                                                        href={`/khoa-hoc/${course.slug}`}
                                                        className="hover:text-[var(--color-primary)] transition-colors"
                                                    >
                                                        {course.name}
                                                    </Link>
                                                </h3>

                                                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-small">
                                                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                                        <Calendar className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                                        <span>
                                                            {formatScheduleDate(schedule.startDate)}
                                                            {schedule.endDate && schedule.endDate !== schedule.startDate && (
                                                                <> - {formatScheduleDate(schedule.endDate)}</>
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                                        <Clock className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                                        <span>{schedule.time}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                                        <MapPin className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                                        <span className="truncate" title={schedule.location}>
                                                            {schedule.location}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                                        <Users className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                                        <span>
                                                            {isFull ? (
                                                                <span className="text-zinc-400 font-medium">Hết chỗ</span>
                                                            ) : (
                                                                <>
                                                                    Còn{" "}
                                                                    <span className="text-[var(--color-primary)] font-bold">
                                                                        {spotsLeft}
                                                                    </span>
                                                                    /{schedule.totalSpots || 8} chỗ
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Note / Promo if available */}
                                                {schedule.note && (
                                                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                                                        <span>{schedule.note}</span>
                                                    </div>
                                                )}

                                                {instructor && (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                                                            <ChefHat className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                                        </div>
                                                        <span className="text-small text-[var(--color-text-muted)]">
                                                            Giảng viên: <span className="text-[var(--color-text)] font-medium">{instructor.name}</span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* CTA Button */}
                                            <div className="flex-shrink-0 flex items-center lg:border-l lg:border-[var(--color-border)] lg:pl-8">
                                                {isFull ? (
                                                    <Link
                                                        href={`/lien-he?course=${course.slug}&type=waitlist`}
                                                        className="btn btn-secondary whitespace-nowrap text-sm"
                                                    >
                                                        Đăng ký đợt sau
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/lien-he?course=${course.slug}&schedule=${schedule.id}&date=${schedule.startDate}`}
                                                        className="btn btn-primary whitespace-nowrap shadow-sm hover:shadow-md transition-all"
                                                    >
                                                        Tư vấn & Đăng ký
                                                        <ArrowRight className="w-4 h-4 ml-1.5" />
                                                    </Link>
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
        </>
    );
}
