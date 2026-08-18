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
        <div className="space-y-8">
            {/* Page Title & Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="heading-2 text-[var(--color-text)]">
                        Bảng Tổng Quan
                    </h1>
                    <p className="text-small text-[var(--color-text-secondary)] mt-1">
                        Theo dõi các hoạt động, đăng ký mới và quản trị nội dung website.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/khoa-hoc?add=true" className="btn btn-primary btn-sm flex items-center gap-1.5 rounded-lg">
                        <Plus className="w-4 h-4" />
                        <span>Thêm khóa học</span>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Registrations */}
                <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center gap-4">
                    <div className="w-11 h-11 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-xs text-[var(--color-text-muted)] font-medium block">
                            Đơn đăng ký học
                        </span>
                        <span className="text-xl font-bold text-[var(--color-text)] block mt-0.5">
                            {stats.totalRegistrations}
                        </span>
                    </div>
                </div>

                {/* Pending */}
                <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center gap-4">
                    <div className="w-11 h-11 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-xs text-[var(--color-text-muted)] font-medium block">
                            Đang chờ duyệt
                        </span>
                        <span className="text-xl font-bold text-[var(--color-text)] block mt-0.5">
                            {stats.pendingRegistrations}
                        </span>
                    </div>
                </div>

                {/* Courses */}
                <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center gap-4">
                    <div className="w-11 h-11 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-xs text-[var(--color-text-muted)] font-medium block">
                            Tổng số khóa học
                        </span>
                        <span className="text-xl font-bold text-[var(--color-text)] block mt-0.5">
                            {stats.totalCourses}
                        </span>
                    </div>
                </div>

                {/* Blogs */}
                <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center gap-4">
                    <div className="w-11 h-11 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-xs text-[var(--color-text-muted)] font-medium block">
                            Bài viết tin tức
                        </span>
                        <span className="text-xl font-bold text-[var(--color-text)] block mt-0.5">
                            {stats.totalBlogs}
                        </span>
                    </div>
                </div>
            </div>

            {/* Layout Widgets */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Registrations Table */}
                <div className="lg:col-span-2 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-heading font-semibold text-[var(--color-text)] text-base">
                            Đăng ký mới gần đây
                        </h3>
                        <Link href="/admin/dang-ky" className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                            <span>Quản lý tất cả</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto -mx-5">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
                                    <th className="px-5 py-2.5">Học viên</th>
                                    <th className="px-5 py-2.5">Khóa học đăng ký</th>
                                    <th className="px-5 py-2.5">Trạng thái</th>
                                    <th className="px-5 py-2.5 text-right">Ngày gửi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)] text-small">
                                {recentRegistrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-[var(--color-text-muted)]">
                                            Chưa có đơn đăng ký nào.
                                        </td>
                                    </tr>
                                ) : (
                                    recentRegistrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-[var(--color-surface-light)]/40 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="font-semibold text-[var(--color-text)]">{reg.name}</div>
                                                <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{reg.phone}</div>
                                            </td>
                                            <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">
                                                {reg.courseName}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {getStatusBadge(reg.status)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-xs text-[var(--color-text-muted)]">
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
                <div className="space-y-6">
                    {/* Enrollment Stat Breakdown */}
                    <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                        <h3 className="font-heading font-semibold text-[var(--color-text)] text-base mb-5">
                            Thống kê nhanh tháng này
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-[var(--color-text-secondary)]">Tỷ lệ chuyển đổi học viên</span>
                                    <span className="text-[var(--color-primary)]">68%</span>
                                </div>
                                <div className="h-2 w-full bg-[var(--color-surface-light)] rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: "68%" }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-[var(--color-text-secondary)]">Chỉ tiêu tuyển sinh khóa Onsite</span>
                                    <span className="text-green-500">80% đạt chỉ tiêu</span>
                                </div>
                                <div className="h-2 w-full bg-[var(--color-surface-light)] rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: "80%" }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-[var(--color-text-secondary)]">Khóa học bún/phở chiếm lĩnh</span>
                                    <span className="text-purple-500">75% tổng đăng ký</span>
                                </div>
                                <div className="h-2 w-full bg-[var(--color-surface-light)] rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "75%" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Guide Card */}
                    <div className="p-5 bg-gradient-to-br from-[var(--color-gray-900)] to-[var(--color-gray-800)] border border-[var(--color-border)] rounded-xl text-center relative overflow-hidden">
                        <div className="absolute -top-12 -left-12 w-24 h-24 bg-[var(--color-primary)]/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[var(--color-primary)]/15 rounded-full blur-2xl" />
                        
                        <div className="relative z-10 space-y-3.5">
                            <span className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-wider block">
                                Hướng dẫn nhanh
                            </span>
                            <h4 className="font-heading font-semibold text-white text-base">
                                Bạn muốn biên tập nội dung khóa học?
                            </h4>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                Hãy truy cập trang quản lý Khóa học (CMS) hoặc Bài viết (CMS) ở menu bên trái để chỉnh sửa thông tin chi tiết.
                            </p>
                            <Link href="/admin/khoa-hoc" className="btn btn-primary btn-sm w-full block rounded-lg">
                                Đi tới trang CMS
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
