"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
    Users, 
    Eye, 
    TrendingUp, 
    Clock, 
    MapPin, 
    Target, 
    Sparkles, 
    BookOpen, 
    FileText, 
    Smartphone, 
    Monitor, 
    Calendar, 
    RefreshCw, 
    ExternalLink, 
    CheckCircle2, 
    Compass,
    ArrowUpRight,
    Search,
    ChevronRight,
    X,
    Filter,
    Layers
} from "lucide-react";
import { AnalyticsDashboardStats, GeoStatItem, CourseStatItem, PageviewItem } from "@/lib/analytics";

export default function AdminAnalyticsPage() {
    const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d" | "all">("7d");
    const [data, setData] = useState<AnalyticsDashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchGeo, setSearchGeo] = useState("");
    
    // Modal xem hành trình khách hàng cụ thể
    const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
    const [visitorJourneyData, setVisitorJourneyData] = useState<any | null>(null);
    const [isLoadingJourney, setIsLoadingJourney] = useState(false);

    const fetchAnalytics = async (range = timeRange) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/analytics/stats?range=${range}`);
            if (res.ok) {
                const json = await res.json();
                if (json.stats) {
                    setData(json.stats);
                }
            }
        } catch (e) {
            console.error("Failed to load analytics:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics(timeRange);
    }, [timeRange]);

    const handleViewJourney = async (visitorId: string, ip?: string) => {
        setSelectedVisitorId(visitorId);
        setIsLoadingJourney(true);
        setVisitorJourneyData(null);
        try {
            const res = await fetch(`/api/analytics/visitor/${visitorId}${ip ? `?ip=${ip}` : ""}`);
            if (res.ok) {
                const json = await res.json();
                setVisitorJourneyData(json.journey);
            }
        } catch (e) {
            console.error("Failed to load journey detail:", e);
        } finally {
            setIsLoadingJourney(false);
        }
    };

    const filteredGeo = useMemo(() => {
        if (!data || !data.geoStats) return [];
        if (!searchGeo.trim()) return data.geoStats;
        const q = searchGeo.toLowerCase();
        return data.geoStats.filter(g => g.city.toLowerCase().includes(q));
    }, [data, searchGeo]);

    // Tìm max value cho biểu đồ SVG
    const maxChartValue = useMemo(() => {
        if (!data || !data.dailyChart || data.dailyChart.length === 0) return 10;
        return Math.max(...data.dailyChart.map(d => Math.max(d.pageviews, d.visitors * 1.5))) || 10;
    }, [data]);

    return (
        <div className="space-y-6 pb-12">
            {/* Header Title & Filter Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--color-border)] pb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold font-heading text-[var(--color-text)]">
                                Thống Kê Truy Cập & Vết Khách Hàng
                            </h1>
                            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                                Theo dõi chi tiết hành vi khách tiềm năng, định vị tỉnh thành và tối ưu chiến dịch quảng cáo
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter & Refresh */}
                <div className="flex items-center gap-2 bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)]">
                    <button
                        onClick={() => setTimeRange("today")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            timeRange === "today" 
                                ? "bg-[var(--color-primary)] text-white shadow-sm" 
                                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                        }`}
                    >
                        Hôm nay
                    </button>
                    <button
                        onClick={() => setTimeRange("7d")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            timeRange === "7d" 
                                ? "bg-[var(--color-primary)] text-white shadow-sm" 
                                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                        }`}
                    >
                        7 ngày qua
                    </button>
                    <button
                        onClick={() => setTimeRange("30d")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            timeRange === "30d" 
                                ? "bg-[var(--color-primary)] text-white shadow-sm" 
                                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                        }`}
                    >
                        30 ngày qua
                    </button>
                    <button
                        onClick={() => setTimeRange("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            timeRange === "all" 
                                ? "bg-[var(--color-primary)] text-white shadow-sm" 
                                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                        }`}
                    >
                        Toàn thời gian
                    </button>

                    <button
                        onClick={() => fetchAnalytics(timeRange)}
                        disabled={isLoading}
                        title="Tải lại số liệu mới nhất"
                        className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface-light)] transition-colors ml-1"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[var(--color-primary)]" : ""}`} />
                    </button>
                </div>
            </div>

            {/* 4 KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Pageviews */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-[var(--color-primary)] transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/10 transition-all" />
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-[var(--color-text-secondary)]">Tổng Lượt Xem (Pageviews)</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <Eye className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-text)] tracking-tight">
                        {isLoading ? "..." : (data?.totalPageviews || 0).toLocaleString("vi-VN")}
                    </div>
                    <div className="mt-2 flex items-center text-xs text-blue-600 font-medium">
                        <span>Đo lường thời gian thực</span>
                    </div>
                </div>

                {/* 2. Unique Visitors */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-[var(--color-primary)] transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition-all" />
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-[var(--color-text-secondary)]">Khách Duy Nhất (Unique IP/ID)</span>
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-text)] tracking-tight">
                        {isLoading ? "..." : (data?.uniqueVisitors || 0).toLocaleString("vi-VN")}
                    </div>
                    <div className="mt-2 flex items-center text-xs text-[var(--color-text-secondary)]">
                        <span>~{data?.totalSessions || 0} phiên truy cập</span>
                    </div>
                </div>

                {/* 3. Converted Leads & Rate */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-emerald-500 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-[var(--color-text-secondary)]">Học Viên Để Lại Thông Tin (Leads)</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold font-heading text-emerald-600 tracking-tight">
                            {isLoading ? "..." : (data?.totalLeads || 0)}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                            {data?.conversionRate || 0}% chuyển đổi
                        </span>
                    </div>
                    <div className="mt-2 text-xs text-[var(--color-text-secondary)]">
                        <Link href="/admin/dang-ky" className="hover:text-emerald-600 underline font-medium">
                            Xem danh sách đăng ký →
                        </Link>
                    </div>
                </div>

                {/* 4. Strategy & Time */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-amber-500 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-[var(--color-text-secondary)]">Thời Gian Tiếp Cận Trung Bình</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-heading text-amber-600 tracking-tight">
                        {isLoading ? "..." : (data?.avgTimeOnSiteFormatted || "2 phút 45 giây")}
                    </div>
                    <div className="mt-2 text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Khách đọc kỹ trước khi đăng ký</span>
                    </div>
                </div>
            </div>

            {/* BIỂU ĐỒ TRUY CẬP THEO THỜI GIAN (DAILY CHART) */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h2 className="text-base font-bold font-heading text-[var(--color-text)] flex items-center gap-2">
                            <span>Biến Động Lượt Xem & Khách Hàng Theo Thời Gian</span>
                        </h2>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                            Theo dõi nhịp điệu tương tác qua các ngày để canh giờ chạy quảng cáo hiệu quả nhất
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                            <span>Lượt xem (Pageviews)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>Khách duy nhất</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span>Đăng ký học (Leads)</span>
                        </div>
                    </div>
                </div>

                {/* SVG Visual Bar & Line Chart */}
                {data?.dailyChart && data.dailyChart.length > 0 ? (
                    <div className="relative pt-6 pb-2">
                        <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-4 items-end h-48 border-b border-[var(--color-border)] px-2">
                            {data.dailyChart.map((d, index) => {
                                const pvHeightPercent = Math.min(100, Math.max(8, (d.pageviews / maxChartValue) * 100));
                                const visitorHeightPercent = Math.min(100, Math.max(6, (d.visitors / maxChartValue) * 100));

                                return (
                                    <div key={index} className="flex flex-col items-center h-full justify-end group relative">
                                        {/* Tooltip Hover */}
                                        <div className="absolute -top-12 bg-gray-900 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20">
                                            <div className="font-bold">{d.date}</div>
                                            <div>{d.pageviews} xem • {d.visitors} khách {d.leads > 0 ? `• ${d.leads} đăng ký` : ""}</div>
                                        </div>

                                        {/* Lead indicator if any */}
                                        {d.leads > 0 && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 mb-1 animate-pulse" title={`${d.leads} khách đăng ký`} />
                                        )}

                                        <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                                            {/* Bar Pageview */}
                                            <div 
                                                style={{ height: `${pvHeightPercent}%` }}
                                                className="w-1/2 bg-[var(--color-primary)]/80 group-hover:bg-[var(--color-primary)] rounded-t-sm transition-all"
                                            />
                                            {/* Bar Unique Visitor */}
                                            <div 
                                                style={{ height: `${visitorHeightPercent}%` }}
                                                className="w-1/2 bg-blue-500/70 group-hover:bg-blue-500 rounded-t-sm transition-all"
                                            />
                                        </div>

                                        <span className="text-[10px] text-[var(--color-text-secondary)] mt-2 font-medium truncate">
                                            {d.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center text-xs text-[var(--color-text-muted)]">
                        Đang thu thập dữ liệu biểu đồ...
                    </div>
                )}
            </div>

            {/* PHÂN BỐ ĐỊA LÝ & GỢI Ý MỞ RỘNG QUẢNG CÁO (CORE REQUIREMENT) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột 1 & 2: Bảng Thống kê Tỉnh Thành */}
                <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                        <div>
                            <h2 className="text-base font-bold font-heading text-[var(--color-text)] flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-rose-500" />
                                <span>Thống Kê Khách Hàng Theo Tỉnh / Thành Phố</span>
                            </h2>
                            <p className="text-xs text-[var(--color-text-secondary)]">
                                Xác định các tỉnh thành quan tâm nhiều nhất để tối ưu ngân sách chạy Quảng cáo Facebook & Google
                            </p>
                        </div>
                        {/* Search Province */}
                        <div className="relative w-full sm:w-48">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                            <input
                                type="text"
                                value={searchGeo}
                                onChange={(e) => setSearchGeo(e.target.value)}
                                placeholder="Tìm tỉnh thành..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[var(--color-surface-light)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] font-semibold border-b border-[var(--color-border)]">
                                <tr>
                                    <th className="py-2.5 px-3">Tỉnh / thành phố</th>
                                    <th className="py-2.5 px-3">Lượt xem</th>
                                    <th className="py-2.5 px-3">Số khách</th>
                                    <th className="py-2.5 px-3">Đăng ký học</th>
                                    <th className="py-2.5 px-3">Tỷ lệ chốt (%)</th>
                                    <th className="py-2.5 px-3 text-right">Tiềm năng quảng cáo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {filteredGeo.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-6 text-center text-xs text-[var(--color-text-muted)]">
                                            Không tìm thấy dữ liệu tỉnh thành phù hợp
                                        </td>
                                    </tr>
                                ) : (
                                    filteredGeo.map((item, idx) => {
                                        return (
                                            <tr key={idx} className="hover:bg-[var(--color-surface-light)]/50 transition-colors">
                                                <td className="py-3 px-3 font-semibold text-[var(--color-text)] flex items-center gap-2">
                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                        idx === 0 ? "bg-amber-500 text-white" :
                                                        idx === 1 ? "bg-slate-300 text-slate-800" :
                                                        idx === 2 ? "bg-orange-300 text-orange-950" :
                                                        "bg-gray-100 text-gray-600"
                                                    }`}>
                                                        {idx + 1}
                                                    </span>
                                                    <span>{item.city}</span>
                                                </td>
                                                <td className="py-3 px-3 text-[var(--color-text)]">
                                                    <div className="flex items-center gap-2">
                                                        <span>{item.pageviews}</span>
                                                        <div className="w-16 h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                                                            <div 
                                                                style={{ width: `${Math.min(100, item.percentage * 2.5)}%` }}
                                                                className="h-full bg-[var(--color-primary)] rounded-full"
                                                            />
                                                        </div>
                                                        <span className="text-[10px] text-[var(--color-text-muted)]">{item.percentage}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 text-[var(--color-text-secondary)]">
                                                    {item.visitors}
                                                </td>
                                                <td className="py-3 px-3 font-bold text-emerald-600">
                                                    {item.leads > 0 ? (
                                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                                                            {item.leads} học viên
                                                        </span>
                                                    ) : (
                                                        <span className="text-[var(--color-text-muted)] font-normal">0</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-3 text-[var(--color-text)] font-semibold">
                                                    {item.conversionRate}%
                                                </td>
                                                <td className="py-3 px-3 text-right">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                                                        item.advertisingPotential === "Rất cao"
                                                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                                            : item.advertisingPotential === "Cao"
                                                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                                            : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                                    }`}>
                                                        {item.advertisingPotential}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Cột 3: Trợ Lý Gợi Ý Chiến Lược Mở Rộng Quảng Cáo (Actionable Insights) */}
                <div className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <h3 className="font-heading font-bold text-sm text-[var(--color-text)]">
                                Gợi Ý Tối Ưu Quảng Cáo & Marketing
                            </h3>
                        </div>

                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                            Dựa trên phân tích lượt xem thực tế và tỷ lệ để lại thông tin theo địa bàn tỉnh thành:
                        </p>

                        <div className="space-y-3">
                            {data?.geoStats && data.geoStats.length > 0 ? (
                                <>
                                    {/* Insight 1: Top City */}
                                    <div className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs">
                                        <div className="font-semibold text-rose-600 mb-1 flex items-center gap-1.5">
                                            <Target className="w-3.5 h-3.5" />
                                            <span>Khu Vực Dẫn Đầu: {data.geoStats[0]?.city} {data.geoStats[1] ? `& ${data.geoStats[1]?.city}` : ""}</span>
                                        </div>
                                        <p className="text-[var(--color-text-secondary)] text-[11px]">
                                            Chiếm {data.geoStats[0]?.percentage}% lượng quan tâm website. Khuyến nghị ưu tiên tối đa ngân sách chiến dịch Facebook / Google Ads cho khu vực này.
                                        </p>
                                    </div>

                                    {/* Insight 2: High Conversion Potential */}
                                    {data.geoStats[1] && (
                                        <div className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs">
                                            <div className="font-semibold text-amber-600 mb-1 flex items-center gap-1.5">
                                                <Compass className="w-3.5 h-3.5" />
                                                <span>Địa Bàn Mở Rộng: {data.geoStats[1]?.city} {data.geoStats[2] ? `& ${data.geoStats[2]?.city}` : ""}</span>
                                            </div>
                                            <p className="text-[var(--color-text-secondary)] text-[11px]">
                                                Đạt tỷ lệ chuyển đổi {data.geoStats[1]?.conversionRate}%. Thích hợp mở rộng quảng cáo các khóa học E-Learning và tài liệu kinh doanh ẩm thực.
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] text-center">
                                    Đang tích lũy dữ liệu truy cập thực tế từ khách hàng để đưa ra khuyến nghị phân bổ ngân sách quảng cáo.
                                </div>
                            )}

                            {/* Insight 3: Device breakdown */}
                            <div className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs">
                                <div className="font-semibold text-blue-600 mb-1 flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5" />
                                    <span>Tối Ưu Trải Nghiệm Thiết Bị</span>
                                </div>
                                <p className="text-[var(--color-text-secondary)] text-[11px]">
                                    {data?.deviceStats && (data.deviceStats.mobile + data.deviceStats.desktop) > 0
                                        ? `${Math.round((data.deviceStats.mobile / (data.deviceStats.mobile + data.deviceStats.desktop)) * 100)}% lượt truy cập đến từ điện thoại. Đảm bảo số Hotline và Zalo luôn hiển thị rõ ràng.`
                                        : "Tối ưu hóa các nút gọi điện và liên hệ Zalo 1-chạm cho người dùng di động."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                        <span className="text-[var(--color-text-muted)]">Cập nhật tự động</span>
                        <Link 
                            href="/admin/dang-ky" 
                            className="text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1"
                        >
                            <span>Xử lý leads mới</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* TOP KHÓA HỌC & TOP BÀI VIẾT QUAN TÂM NHẤT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Khóa Học */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                            <h2 className="text-base font-bold font-heading text-[var(--color-text)]">
                                Top Khóa Học Được Quan Tâm Nhất
                            </h2>
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">{data?.topCourses?.length || 0} khóa</span>
                    </div>

                    <div className="space-y-3">
                        {data?.topCourses && data.topCourses.length > 0 ? (
                            data.topCourses.slice(0, 6).map((course, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all">
                                    <div className="min-w-0 pr-3">
                                        <Link 
                                            href={`/khoa-hoc/${course.slug}`} 
                                            target="_blank"
                                            className="font-semibold text-xs sm:text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] truncate block"
                                        >
                                            {course.name}
                                        </Link>
                                        <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-secondary)] mt-1">
                                            <span>{course.views} lượt xem</span>
                                            <span>•</span>
                                            <span>{course.uniqueVisitors} người tìm hiểu</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-xs font-bold text-emerald-600 block">
                                            {course.leads} đăng ký
                                        </span>
                                        <span className="text-[10px] text-[var(--color-text-muted)]">
                                            Tỉ lệ: {course.conversionRate}%
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-[var(--color-text-muted)] py-6 text-center">Chưa có dữ liệu khóa học</p>
                        )}
                    </div>
                </div>

                {/* Top Bài Viết */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <h2 className="text-base font-bold font-heading text-[var(--color-text)]">
                                Top Bài Viết Thu Hút Học Viên
                            </h2>
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">{data?.topBlogs?.length || 0} bài</span>
                    </div>

                    <div className="space-y-3">
                        {data?.topBlogs && data.topBlogs.length > 0 ? (
                            data.topBlogs.slice(0, 6).map((blog, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] hover:border-blue-500 transition-all">
                                    <div className="min-w-0 pr-3">
                                        <Link 
                                            href={`/tin-tuc/${blog.slug}`} 
                                            target="_blank"
                                            className="font-semibold text-xs sm:text-sm text-[var(--color-text)] hover:text-blue-500 truncate block"
                                        >
                                            {blog.name}
                                        </Link>
                                        <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-secondary)] mt-1">
                                            <span>{blog.views} lượt đọc</span>
                                            <span>•</span>
                                            <span>{blog.uniqueVisitors} độc giả</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600">
                                            Bài hot
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-[var(--color-text-muted)] py-6 text-center">Chưa có dữ liệu bài viết</p>
                        )}
                    </div>
                </div>
            </div>

            {/* NGUỒN TRUY CẬP (UTM & CHANNELS) & THIẾT BỊ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Nguồn truy cập */}
                <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <h2 className="text-base font-bold font-heading text-[var(--color-text)] mb-1">
                        Kênh Quảng Cáo & Nguồn Khách Đến (Traffic Sources & UTM)
                    </h2>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                        Biết khách hàng đến từ Facebook Ads, Google Tìm kiếm hay Zalo để đo lường ROI
                    </p>

                    <div className="space-y-3">
                        {data?.trafficSources && data.trafficSources.length > 0 ? (
                            data.trafficSources.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--color-border)] last:border-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-[var(--color-text)]">{item.channel}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 rounded-full bg-[var(--color-surface-light)] overflow-hidden hidden sm:block">
                                            <div 
                                                style={{ width: `${item.percentage}%` }}
                                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                            />
                                        </div>
                                        <span className="font-bold text-[var(--color-text)] min-w-[3rem] text-right">{item.visits}</span>
                                        <span className="text-[var(--color-text-muted)] min-w-[2.5rem] text-right">({item.percentage}%)</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-[var(--color-text-muted)] py-4 text-center">Chưa có dữ liệu nguồn</p>
                        )}
                    </div>
                </div>

                {/* Tỉ lệ thiết bị */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-base font-bold font-heading text-[var(--color-text)] mb-1">
                            Thiết Bị Khách Dùng
                        </h2>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-5">
                            Tỉ lệ truy cập qua Smartphone so với Máy tính
                        </p>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="flex items-center gap-2 text-[var(--color-text)] font-semibold">
                                        <Smartphone className="w-4 h-4 text-amber-500" />
                                        <span>Điện thoại di động (Mobile)</span>
                                    </span>
                                    <span className="font-bold text-[var(--color-text)]">
                                        {data?.deviceStats ? Math.round((data.deviceStats.mobile / ((data.deviceStats.mobile + data.deviceStats.desktop || 1))) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-[var(--color-surface-light)] overflow-hidden">
                                    <div 
                                        style={{ width: `${data?.deviceStats ? Math.round((data.deviceStats.mobile / ((data.deviceStats.mobile + data.deviceStats.desktop || 1))) * 100) : 0}%` }}
                                        className="h-full bg-amber-500 rounded-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="flex items-center gap-2 text-[var(--color-text)] font-semibold">
                                        <Monitor className="w-4 h-4 text-blue-500" />
                                        <span>Máy tính / Laptop (Desktop)</span>
                                    </span>
                                    <span className="font-bold text-[var(--color-text)]">
                                        {data?.deviceStats ? Math.round((data.deviceStats.desktop / ((data.deviceStats.mobile + data.deviceStats.desktop || 1))) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-[var(--color-surface-light)] overflow-hidden">
                                    <div 
                                        style={{ width: `${data?.deviceStats ? Math.round((data.deviceStats.desktop / ((data.deviceStats.mobile + data.deviceStats.desktop || 1))) * 100) : 0}%` }}
                                        className="h-full bg-blue-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 mt-6">
                        <strong>Lưu ý CSKH:</strong> Học viên nấu ăn hầu hết lướt Facebook trên điện thoại, hãy chuẩn bị kịch bản tư vấn Zalo & gọi điện thân thiện, trực tiếp.
                    </div>
                </div>
            </div>

            {/* DÒNG THỜI GIAN KHÁCH HÀNG TIỀM NĂNG (LIVE LEAD & VISITOR JOURNEY FEED) */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div>
                        <h2 className="text-base font-bold font-heading text-[var(--color-text)] flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Khách Hàng Đang Tiếp Cận & Hành Trình Gần Đây (Live Visitor Journey)</span>
                        </h2>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                            Xem trực tiếp từng IP / Khách hàng đã ghé thăm những khóa học nào, tìm hiểu bao lâu trước khi đăng ký
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] font-semibold border-b border-[var(--color-border)]">
                            <tr>
                                <th className="py-2.5 px-3">IP / Khách truy cập</th>
                                <th className="py-2.5 px-3">Tỉnh thành</th>
                                <th className="py-2.5 px-3">Thời gian tiếp cận</th>
                                <th className="py-2.5 px-3">Khóa học quan tâm</th>
                                <th className="py-2.5 px-3">Trạng thái</th>
                                <th className="py-2.5 px-3 text-right">Hành trình</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {data?.recentVisitors && data.recentVisitors.length > 0 ? (
                                data.recentVisitors.map((v, idx) => (
                                    <tr key={idx} className="hover:bg-[var(--color-surface-light)]/50 transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="font-mono text-xs font-semibold text-[var(--color-text)]">
                                                {v.ip}
                                            </div>
                                            <span className="text-[10px] text-[var(--color-text-muted)]">
                                                {v.device === "mobile" ? "📱 Di động" : "💻 Máy tính"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span className="px-2 py-0.5 rounded-md bg-[var(--color-surface-light)] border border-[var(--color-border)] font-medium text-[var(--color-text)]">
                                                {v.city}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-[var(--color-text-secondary)]">
                                            {v.daysSinceFirstVisit > 0 ? (
                                                <span className="font-semibold text-amber-600">
                                                    Đã tìm hiểu {v.daysSinceFirstVisit} ngày
                                                </span>
                                            ) : (
                                                <span className="text-blue-600">Mới vào hôm nay</span>
                                            )}
                                            <div className="text-[10px] text-[var(--color-text-muted)]">
                                                Tổng {v.totalVisits} lượt xem trang
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 max-w-xs truncate text-[var(--color-text)]" title={v.viewedCoursesSummary}>
                                            {v.viewedCoursesSummary}
                                        </td>
                                        <td className="py-3 px-3">
                                            {v.isConverted ? (
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 inline-flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Đã đăng ký học
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                                    Khách tiềm năng
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <button
                                                onClick={() => handleViewJourney(v.visitorId, v.ip)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-surface-light)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)] transition-all inline-flex items-center gap-1"
                                            >
                                                <span>Xem chi tiết</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-6 text-center text-xs text-[var(--color-text-muted)]">
                                        Chưa ghi nhận khách truy cập gần đây
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL XEM CHI TIẾT HÀNH TRÌNH KHÁCH HÀNG (LEAD JOURNEY MODAL) */}
            {selectedVisitorId && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-gradient-to-r from-[var(--color-surface)] to-[var(--color-surface-light)]">
                            <div>
                                <h3 className="font-heading font-bold text-base text-[var(--color-text)] flex items-center gap-2">
                                    <Compass className="w-5 h-5 text-[var(--color-primary)]" />
                                    <span>Hành Trình Khách Hàng (Customer Journey)</span>
                                </h3>
                                <p className="text-xs text-[var(--color-text-secondary)]">
                                    Hồ sơ lưu vết đầy đủ từ lúc khách lần đầu ghé thăm đến các khóa học đã xem
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedVisitorId(null)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-light)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {isLoadingJourney ? (
                                <div className="py-12 flex flex-col items-center justify-center text-xs text-[var(--color-text-secondary)] gap-2">
                                    <RefreshCw className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                                    <span>Đang tra cứu lịch sử hành trình...</span>
                                </div>
                            ) : visitorJourneyData ? (
                                <>
                                    {/* Thẻ tóm tắt khách hàng */}
                                    <div className="p-4 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                        <div>
                                            <span className="text-[var(--color-text-muted)] block">Tỉnh Thành</span>
                                            <span className="font-bold text-[var(--color-text)] text-sm">{visitorJourneyData.city || "Không xác định"}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-text-muted)] block">IP Khách Hàng</span>
                                            <span className="font-mono font-semibold text-[var(--color-text)]">{visitorJourneyData.visitor?.ip || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-text-muted)] block">Lần Đầu Ghé Thăm</span>
                                            <span className="font-semibold text-[var(--color-text)]">
                                                {visitorJourneyData.firstSeenAt ? new Date(visitorJourneyData.firstSeenAt).toLocaleDateString("vi-VN") : "Hôm nay"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-text-muted)] block">Thời Gian Tiếp Cận</span>
                                            <span className="font-bold text-amber-600">
                                                {visitorJourneyData.timeToConvertFormatted || "Mới tiếp cận"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Khóa học đã xem */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[var(--color-text-secondary)] mb-2.5 flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                            <span>Các khóa học đã xem ({visitorJourneyData.viewedCourses?.length || 0})</span>
                                        </h4>
                                        {visitorJourneyData.viewedCourses && visitorJourneyData.viewedCourses.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {visitorJourneyData.viewedCourses.map((c: any, i: number) => (
                                                    <div key={i} className="p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between text-xs">
                                                        <span className="font-semibold text-[var(--color-text)] truncate pr-2">{c.name}</span>
                                                        <span className="px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold shrink-0">
                                                            {c.viewCount} lần
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-[var(--color-text-muted)]">Chưa ghi nhận khóa học cụ thể</p>
                                        )}
                                    </div>

                                    {/* Bài viết đã đọc */}
                                    {visitorJourneyData.viewedBlogs && visitorJourneyData.viewedBlogs.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-[var(--color-text-secondary)] mb-2.5 flex items-center gap-1.5">
                                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                                <span>Bài viết tin tức đã đọc</span>
                                            </h4>
                                            <div className="space-y-1.5">
                                                {visitorJourneyData.viewedBlogs.map((b: any, i: number) => (
                                                    <div key={i} className="p-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between text-xs">
                                                        <span className="text-[var(--color-text)] truncate pr-2">{b.name}</span>
                                                        <span className="text-[10px] text-[var(--color-text-muted)] shrink-0">{b.viewCount} lượt đọc</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Timeline Chi Tiết Từng Lượt Xem */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[var(--color-text-secondary)] mb-3 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>Chuỗi hành động chi tiết (Timeline)</span>
                                        </h4>
                                        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-border)]">
                                            {visitorJourneyData.pageviews && visitorJourneyData.pageviews.length > 0 ? (
                                                visitorJourneyData.pageviews.map((pv: PageviewItem, i: number) => (
                                                    <div key={i} className="relative text-xs">
                                                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-surface)]" />
                                                        <div className="font-semibold text-[var(--color-text)]">
                                                            {pv.title}
                                                        </div>
                                                        <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5 flex items-center gap-2">
                                                            <span>{pv.path}</span>
                                                            <span>•</span>
                                                            <span>{new Date(pv.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                                                            <span>•</span>
                                                            <span>{new Date(pv.timestamp).toLocaleDateString("vi-VN")}</span>
                                                            {pv.durationSeconds && pv.durationSeconds > 5 && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="text-amber-600 font-medium">Đọc {pv.durationSeconds}s</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-[var(--color-text-muted)]">Chưa có bản ghi timeline chi tiết</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-xs text-[var(--color-text-muted)] text-center py-8">
                                    Không tìm thấy thông tin hành trình cho khách hàng này.
                                </p>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 border-t border-[var(--color-border)] flex justify-end bg-[var(--color-surface-light)]">
                            <button
                                onClick={() => setSelectedVisitorId(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors"
                            >
                                Đóng cửa sổ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
