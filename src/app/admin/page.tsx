"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    Users, 
    BookOpen, 
    FileText, 
    TrendingUp, 
    Clock, 
    CheckCircle, 
    XCircle,
    ArrowRight,
    Plus
} from "lucide-react";
import { blogPosts, courses } from "@/data/mock";

interface Registration {
    id: string;
    name: string;
    phone: string;
    email: string;
    courseName: string;
    status: "pending" | "contacted" | "enrolled" | "cancelled";
    date: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalBlogs: 0,
        totalRegistrations: 0,
        pendingRegistrations: 0
    });
    const [recentRegistrations, setRecentRegistrations] = useState<Registration[]>([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            let loadedCourses = courses;
            let loadedBlogs = blogPosts;
            let loadedRegs: Registration[] = [];

            try {
                const [cRes, bRes, rRes] = await Promise.all([
                    fetch('/api/cms/courses'),
                    fetch('/api/cms/blogs'),
                    fetch('/api/cms/registrations')
                ]);
                if (cRes.ok) {
                    const data = await cRes.json();
                    if (data.courses) loadedCourses = data.courses;
                }
                if (bRes.ok) {
                    const data = await bRes.json();
                    if (data.blogs) loadedBlogs = data.blogs;
                }
                if (rRes.ok) {
                    const data = await rRes.json();
                    if (data.registrations) loadedRegs = data.registrations;
                }
            } catch (e) {
                console.error("Dashboard fetch error:", e);
            }

            if (loadedRegs.length === 0) {
                const localRegs = localStorage.getItem("admin_registrations");
                if (localRegs) {
                    try { loadedRegs = JSON.parse(localRegs); } catch {}
                }
            }

            setStats({
                totalCourses: loadedCourses.length,
                totalBlogs: loadedBlogs.length,
                totalRegistrations: loadedRegs.length,
                pendingRegistrations: loadedRegs.filter(r => r.status === "pending").length
            });

            setRecentRegistrations(loadedRegs.slice(0, 5));
        };

        loadDashboardData();
    }, []);

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
            {/* Page Title & Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h1 className="heading-3 text-[var(--color-text)]">
                        Bảng Tổng Quan
                    </h1>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        Theo dõi các hoạt động, đăng ký mới và quản trị nội dung website.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/khoa-hoc?add=true" className="btn btn-primary btn-sm flex items-center gap-1.5 rounded-lg">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm khóa học</span>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Registrations */}
                <div className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[11px] text-[var(--color-text-muted)] font-medium block truncate">
                            Đơn đăng ký học
                        </span>
                        <span className="text-lg font-bold text-[var(--color-text)] block leading-tight">
                            {stats.totalRegistrations}
                        </span>
                    </div>
                </div>

                {/* Pending */}
                <div className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[11px] text-[var(--color-text-muted)] font-medium block truncate">
                            Đang chờ duyệt
                        </span>
                        <span className="text-lg font-bold text-[var(--color-text)] block leading-tight">
                            {stats.pendingRegistrations}
                        </span>
                    </div>
                </div>

                {/* Courses */}
                <div className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[11px] text-[var(--color-text-muted)] font-medium block truncate">
                            Tổng khóa học
                        </span>
                        <span className="text-lg font-bold text-[var(--color-text)] block leading-tight">
                            {stats.totalCourses}
                        </span>
                    </div>
                </div>

                {/* Blogs */}
                <div className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[11px] text-[var(--color-text-muted)] font-medium block truncate">
                            Bài viết tin tức
                        </span>
                        <span className="text-lg font-bold text-[var(--color-text)] block leading-tight">
                            {stats.totalBlogs}
                        </span>
                    </div>
                </div>
            </div>

            {/* Layout Widgets */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Recent Registrations Table */}
                <div className="lg:col-span-2 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-heading font-bold text-[var(--color-text)] text-sm">
                            Đăng ký mới gần đây
                        </h3>
                        <Link href="/admin/dang-ky" className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                            <span>Quản lý tất cả</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto -mx-4">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] font-semibold">
                                    <th className="px-4 py-2">Học viên</th>
                                    <th className="px-4 py-2">Khóa học đăng ký</th>
                                    <th className="px-4 py-2">Trạng thái</th>
                                    <th className="px-4 py-2 text-right">Ngày gửi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)] text-xs">
                                {recentRegistrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                                            Chưa có đơn đăng ký nào.
                                        </td>
                                    </tr>
                                ) : (
                                    recentRegistrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-[var(--color-surface-light)]/40 transition-colors">
                                            <td className="px-4 py-2.5">
                                                <div className="font-semibold text-[var(--color-text)]">{reg.name}</div>
                                                <div className="text-[10px] text-[var(--color-text-muted)]">{reg.phone}</div>
                                            </td>
                                            <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">
                                                {reg.courseName}
                                            </td>
                                            <td className="px-4 py-2.5">
                                                {getStatusBadge(reg.status)}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-[11px] text-[var(--color-text-muted)]">
                                                {reg.date}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Widgets: Business Stat & System Info */}
                <div className="space-y-4">
                    {/* Enrollment Stat Breakdown */}
                    <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                        <h3 className="font-heading font-bold text-[var(--color-text)] text-sm mb-3">
                            Thống kê nhanh tháng này
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-[var(--color-text-secondary)]">Tỷ lệ chuyển đổi học viên</span>
                                    <span className="text-[var(--color-primary)]">68%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[var(--color-surface-light)] rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: "68%" }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-[var(--color-text-secondary)]">Chỉ tiêu tuyển sinh Onsite</span>
                                    <span className="text-green-500">80%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[var(--color-surface-light)] rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: "80%" }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-[var(--color-text-secondary)]">Khóa bún/phở</span>
                                    <span className="text-purple-500">75%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[var(--color-surface-light)] rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "75%" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Guide Card */}
                    <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center relative overflow-hidden">
                        <div className="absolute -top-12 -left-12 w-20 h-20 bg-[var(--color-primary)]/10 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute -bottom-12 -right-12 w-20 h-20 bg-[var(--color-primary)]/10 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="relative z-10 space-y-2.5">
                            <span className="text-xs text-[var(--color-primary)] font-bold block">
                                Hướng dẫn nhanh
                            </span>
                            <h4 className="font-heading font-bold text-[var(--color-text)] text-sm">
                                Bạn muốn biên tập nội dung khóa học?
                            </h4>
                            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                Truy cập trang Khóa học hoặc Bài viết ở menu để chỉnh sửa thông tin chi tiết.
                            </p>
                            <Link href="/admin/khoa-hoc" className="btn btn-primary btn-sm w-full block rounded-lg shadow-sm text-xs py-1.5">
                                Đi tới trang CMS
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
