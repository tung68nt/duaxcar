import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";

export interface PageviewItem {
    id: string;
    visitorId: string;
    sessionId: string;
    ip: string;
    city: string;
    country: string;
    path: string;
    title: string;
    pageType: "home" | "course" | "blog" | "schedule" | "contact" | "about" | "policy" | "other";
    targetSlug?: string;
    targetName?: string;
    referrer: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    device: "mobile" | "desktop" | "tablet";
    browser: string;
    timestamp: string; // ISO String
    durationSeconds?: number;
}

export interface ViewedEntity {
    slug: string;
    name: string;
    type: "course" | "blog";
    viewCount: number;
    firstViewedAt: string;
    lastViewedAt: string;
}

export interface VisitorProfile {
    visitorId: string;
    ip: string;
    city: string;
    country: string;
    firstSeenAt: string;
    lastSeenAt: string;
    totalVisits: number; // Tổng số pageviews
    sessionCount: number;
    firstReferrer: string;
    firstUtmSource?: string;
    firstUtmMedium?: string;
    firstUtmCampaign?: string;
    device: "mobile" | "desktop" | "tablet";
    browser: string;
    viewedCourses: ViewedEntity[];
    viewedBlogs: ViewedEntity[];
    isConverted: boolean; // Đã từng để lại thông tin / mua hàng
    convertedLeadId?: string;
    convertedAt?: string;
}

export interface AnalyticsStore {
    pageviews: PageviewItem[];
    visitors: Record<string, VisitorProfile>;
    lastUpdated: string;
}

const ANALYTICS_STORE_FILE = path.join(process.cwd(), "src", "data", "analytics-store.json");
const MAX_STORED_PAGEVIEWS = 6000;

/**
 * Khởi tạo dữ liệu sạch ban đầu (không mock data)
 * Dữ liệu được ghi nhận 100% từ lượt truy cập thực tế của người dùng
 */
function createEmptyStore(): AnalyticsStore {
    return {
        pageviews: [],
        visitors: {},
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Đọc toàn bộ Analytics Store từ file JSON
 */
export function getAnalyticsStore(): AnalyticsStore {
    try {
        if (!fs.existsSync(ANALYTICS_STORE_FILE)) {
            const emptyStore = createEmptyStore();
            fs.mkdirSync(path.dirname(ANALYTICS_STORE_FILE), { recursive: true });
            fs.writeFileSync(ANALYTICS_STORE_FILE, JSON.stringify(emptyStore, null, 2), "utf-8");
            return emptyStore;
        }

        const raw = fs.readFileSync(ANALYTICS_STORE_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return {
            pageviews: Array.isArray(parsed.pageviews) ? parsed.pageviews : [],
            visitors: parsed.visitors || {},
            lastUpdated: parsed.lastUpdated || new Date().toISOString()
        };
    } catch (err) {
        console.error("[AnalyticsStore] Read error:", err);
        return createEmptyStore();
    }
}

/**
 * Lưu Analytics Store vào file JSON an toàn
 */
export function saveAnalyticsStore(data: Partial<AnalyticsStore>) {
    try {
        const current = getAnalyticsStore();
        const merged: AnalyticsStore = {
            pageviews: data.pageviews ? data.pageviews.slice(-MAX_STORED_PAGEVIEWS) : current.pageviews,
            visitors: data.visitors ? { ...current.visitors, ...data.visitors } : current.visitors,
            lastUpdated: new Date().toISOString()
        };
        fs.mkdirSync(path.dirname(ANALYTICS_STORE_FILE), { recursive: true });
        fs.writeFileSync(ANALYTICS_STORE_FILE, JSON.stringify(merged, null, 2), "utf-8");
        return merged;
    } catch (err) {
        console.error("[AnalyticsStore] Write error:", err);
        return null;
    }
}

/**
 * Ghi nhận một lượt Pageview từ người dùng (Multi-Tier Ingestion)
 */
export async function recordPageview(payload: {
    visitorId: string;
    sessionId: string;
    ip: string;
    city: string;
    country: string;
    path: string;
    title: string;
    pageType: PageviewItem["pageType"];
    targetSlug?: string;
    targetName?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    device: "mobile" | "desktop" | "tablet";
    browser: string;
    durationSeconds?: number;
}): Promise<boolean> {
    const nowIso = new Date().toISOString();
    const pvId = `pv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const pageviewItem: PageviewItem = {
        id: pvId,
        visitorId: payload.visitorId,
        sessionId: payload.sessionId,
        ip: payload.ip,
        city: payload.city,
        country: payload.country,
        path: payload.path,
        title: payload.title,
        pageType: payload.pageType,
        targetSlug: payload.targetSlug,
        targetName: payload.targetName,
        referrer: payload.referrer || "direct",
        utmSource: payload.utmSource,
        utmMedium: payload.utmMedium,
        utmCampaign: payload.utmCampaign,
        device: payload.device,
        browser: payload.browser,
        timestamp: nowIso,
        durationSeconds: payload.durationSeconds || 15
    };

    // 1. Cập nhật Local Store (Đảm bảo luôn nhanh và luôn lưu vết thành công)
    try {
        const store = getAnalyticsStore();
        const visitors = { ...store.visitors };
        const existingVisitor = visitors[payload.visitorId];

        if (!existingVisitor) {
            // Khách mới toanh
            visitors[payload.visitorId] = {
                visitorId: payload.visitorId,
                ip: payload.ip,
                city: payload.city,
                country: payload.country,
                firstSeenAt: nowIso,
                lastSeenAt: nowIso,
                totalVisits: 1,
                sessionCount: 1,
                firstReferrer: payload.referrer || "direct",
                firstUtmSource: payload.utmSource,
                firstUtmMedium: payload.utmMedium,
                firstUtmCampaign: payload.utmCampaign,
                device: payload.device,
                browser: payload.browser,
                viewedCourses: payload.pageType === "course" && payload.targetSlug ? [{
                    slug: payload.targetSlug,
                    name: payload.targetName || payload.title,
                    type: "course",
                    viewCount: 1,
                    firstViewedAt: nowIso,
                    lastViewedAt: nowIso
                }] : [],
                viewedBlogs: payload.pageType === "blog" && payload.targetSlug ? [{
                    slug: payload.targetSlug,
                    name: payload.targetName || payload.title,
                    type: "blog",
                    viewCount: 1,
                    firstViewedAt: nowIso,
                    lastViewedAt: nowIso
                }] : [],
                isConverted: false
            };
        } else {
            // Khách quay lại -> Cập nhật thông tin và danh sách quan tâm
            existingVisitor.lastSeenAt = nowIso;
            existingVisitor.totalVisits += 1;
            // Nếu có IP/City mới cập nhật thêm
            if (payload.city && payload.city !== "Không xác định") {
                existingVisitor.city = payload.city;
            }
            if (payload.ip && payload.ip !== "127.0.0.1") {
                existingVisitor.ip = payload.ip;
            }

            // Ghi nhận khóa học đang xem
            if (payload.pageType === "course" && payload.targetSlug) {
                const foundCourse = existingVisitor.viewedCourses.find(c => c.slug === payload.targetSlug);
                if (foundCourse) {
                    foundCourse.viewCount += 1;
                    foundCourse.lastViewedAt = nowIso;
                } else {
                    existingVisitor.viewedCourses.push({
                        slug: payload.targetSlug,
                        name: payload.targetName || payload.title,
                        type: "course",
                        viewCount: 1,
                        firstViewedAt: nowIso,
                        lastViewedAt: nowIso
                    });
                }
            }

            // Ghi nhận bài viết đang đọc
            if (payload.pageType === "blog" && payload.targetSlug) {
                const foundBlog = existingVisitor.viewedBlogs.find(b => b.slug === payload.targetSlug);
                if (foundBlog) {
                    foundBlog.viewCount += 1;
                    foundBlog.lastViewedAt = nowIso;
                } else {
                    existingVisitor.viewedBlogs.push({
                        slug: payload.targetSlug,
                        name: payload.targetName || payload.title,
                        type: "blog",
                        viewCount: 1,
                        firstViewedAt: nowIso,
                        lastViewedAt: nowIso
                    });
                }
            }
        }

        const newPageviews = [...store.pageviews, pageviewItem];
        saveAnalyticsStore({
            pageviews: newPageviews,
            visitors
        });
    } catch (e) {
        console.warn("[recordPageview] Local store update warning:", e);
    }

    // 2. Đồng bộ ngầm lên Supabase (nếu bảng tồn tại)
    try {
        await supabase.from("analytics_pageviews").insert({
            id: pvId,
            visitor_id: payload.visitorId,
            session_id: payload.sessionId,
            ip: payload.ip,
            city: payload.city,
            country: payload.country,
            path: payload.path,
            title: payload.title,
            page_type: payload.pageType,
            target_slug: payload.targetSlug || null,
            target_name: payload.targetName || null,
            referrer: payload.referrer || null,
            utm_source: payload.utmSource || null,
            utm_medium: payload.utmMedium || null,
            utm_campaign: payload.utmCampaign || null,
            device: payload.device,
            browser: payload.browser,
            duration_seconds: payload.durationSeconds || 15,
            created_at: nowIso
        });
    } catch {
        // Supabase table may not exist yet, fallback to local store silently
    }

    return true;
}

/**
 * Đánh dấu Visitor đã gửi thông tin chuyển đổi thành công (Lead Conversion)
 */
export function markVisitorAsConverted(visitorIdOrIp: string, leadId: string) {
    try {
        const store = getAnalyticsStore();
        const visitors = { ...store.visitors };
        const nowIso = new Date().toISOString();

        // Tìm theo visitorId trước
        let targetVisitor = visitors[visitorIdOrIp];

        // Nếu không thấy, tìm theo IP
        if (!targetVisitor) {
            for (const v of Object.values(visitors)) {
                if (v.ip === visitorIdOrIp) {
                    targetVisitor = v;
                    break;
                }
            }
        }

        if (targetVisitor) {
            targetVisitor.isConverted = true;
            targetVisitor.convertedLeadId = leadId;
            targetVisitor.convertedAt = nowIso;
            saveAnalyticsStore({ visitors });
        }
    } catch (e) {
        console.warn("[markVisitorAsConverted] Error:", e);
    }
}

/**
 * Tra cứu toàn bộ vết hành trình (Lead Journey) của một khách hàng
 */
export function getVisitorJourney(visitorId?: string, ip?: string): {
    found: boolean;
    visitor?: VisitorProfile;
    pageviews: PageviewItem[];
    firstSeenAt?: string;
    timeToConvertFormatted?: string;
    viewedCourses: ViewedEntity[];
    viewedBlogs: ViewedEntity[];
    utmSummary?: string;
    city?: string;
} {
    const store = getAnalyticsStore();
    let visitor: VisitorProfile | undefined = undefined;

    if (visitorId && store.visitors[visitorId]) {
        visitor = store.visitors[visitorId];
    } else if (ip) {
        for (const v of Object.values(store.visitors)) {
            if (v.ip === ip) {
                visitor = v;
                break;
            }
        }
    }

    if (!visitor) {
        return {
            found: false,
            pageviews: [],
            viewedCourses: [],
            viewedBlogs: []
        };
    }

    // Lọc tất cả pageviews của visitor này xếp theo thứ tự thời gian
    const visitorPvs = store.pageviews
        .filter(p => p.visitorId === visitor!.visitorId || (ip && p.ip === ip))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Tính thời gian từ lần đầu ghé thăm đến khi chuyển đổi hoặc hiện tại
    const firstTime = new Date(visitor.firstSeenAt).getTime();
    const endTime = visitor.convertedAt ? new Date(visitor.convertedAt).getTime() : new Date(visitor.lastSeenAt).getTime();
    const diffMs = Math.max(0, endTime - firstTime);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;

    let timeToConvertFormatted = "Truy cập & đăng ký ngay trong phiên đầu";
    if (diffDays > 0) {
        timeToConvertFormatted = `${diffDays} ngày ${remainingHours} giờ tìm hiểu trước khi đăng ký`;
    } else if (diffHours > 0) {
        timeToConvertFormatted = `${diffHours} giờ tìm hiểu trước khi đăng ký`;
    }

    let utmSummary = "";
    if (visitor.firstUtmSource) {
        utmSummary = `Chiến dịch: ${visitor.firstUtmSource}`;
        if (visitor.firstUtmCampaign) utmSummary += ` / ${visitor.firstUtmCampaign}`;
    }

    return {
        found: true,
        visitor,
        pageviews: visitorPvs,
        firstSeenAt: visitor.firstSeenAt,
        timeToConvertFormatted,
        viewedCourses: visitor.viewedCourses || [],
        viewedBlogs: visitor.viewedBlogs || [],
        utmSummary,
        city: visitor.city
    };
}

export interface GeoStatItem {
    city: string;
    pageviews: number;
    visitors: number;
    leads: number;
    conversionRate: number;
    percentage: number;
    advertisingPotential: "Rất cao" | "Cao" | "Tiềm năng" | "Đang phát triển";
}

export interface CourseStatItem {
    slug: string;
    name: string;
    views: number;
    uniqueVisitors: number;
    leads: number;
    conversionRate: number;
}

export interface BlogStatItem {
    slug: string;
    name: string;
    views: number;
    uniqueVisitors: number;
}

export interface DailyChartItem {
    date: string; // YYYY-MM-DD
    label: string; // "T2, 22/07"
    pageviews: number;
    visitors: number;
    leads: number;
}

export interface TrafficSourceItem {
    source: string;
    channel: string;
    visits: number;
    percentage: number;
}

export interface AnalyticsDashboardStats {
    timeRange: "today" | "7d" | "30d" | "all";
    totalPageviews: number;
    uniqueVisitors: number;
    totalSessions: number;
    totalLeads: number;
    conversionRate: number;
    avgTimeOnSiteFormatted: string;
    dailyChart: DailyChartItem[];
    geoStats: GeoStatItem[];
    topCourses: CourseStatItem[];
    topBlogs: BlogStatItem[];
    trafficSources: TrafficSourceItem[];
    deviceStats: { mobile: number; desktop: number; tablet: number };
    recentVisitors: {
        visitorId: string;
        ip: string;
        city: string;
        device: string;
        lastSeenAt: string;
        firstSeenAt: string;
        daysSinceFirstVisit: number;
        totalVisits: number;
        viewedCoursesCount: number;
        viewedCoursesSummary: string;
        isConverted: boolean;
        convertedLeadId?: string;
    }[];
}

/**
 * Tổng hợp toàn bộ số liệu thống kê cho Admin Dashboard
 */
export function getAnalyticsDashboard(range: "today" | "7d" | "30d" | "all" = "7d"): AnalyticsDashboardStats {
    const store = getAnalyticsStore();
    const now = new Date();

    // Xác định mốc thời gian lọc
    let filterDate = new Date(0); // 'all'
    if (range === "today") {
        filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === "7d") {
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "30d") {
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Lọc pageviews trong khoảng thời gian
    const filteredPvs = store.pageviews.filter(p => new Date(p.timestamp) >= filterDate);

    // Tập hợp visitorIds trong khoảng thời gian
    const activeVisitorIds = new Set(filteredPvs.map(p => p.visitorId));
    const activeVisitors = Object.values(store.visitors).filter(v => activeVisitorIds.has(v.visitorId) || new Date(v.lastSeenAt) >= filterDate);

    const totalPageviews = filteredPvs.length;
    const uniqueVisitors = activeVisitorIds.size || activeVisitors.length;
    const sessions = new Set(filteredPvs.map(p => p.sessionId)).size || uniqueVisitors;

    // Số leads chuyển đổi trong khoảng thời gian
    const convertedVisitors = activeVisitors.filter(v => v.isConverted);
    const totalLeads = convertedVisitors.length;
    const conversionRate = uniqueVisitors > 0 ? Number(((totalLeads / uniqueVisitors) * 100).toFixed(1)) : 0;

    // --- 1. THỐNG KÊ THEO TỈNH THÀNH (GEO STATS CHO QUẢNG CÁO) ---
    const geoMap: Record<string, { pageviews: number; visitors: Set<string>; leads: number }> = {};
    for (const pv of filteredPvs) {
        const city = pv.city || "Không xác định";
        if (!geoMap[city]) {
            geoMap[city] = { pageviews: 0, visitors: new Set(), leads: 0 };
        }
        geoMap[city].pageviews += 1;
        geoMap[city].visitors.add(pv.visitorId);
    }

    for (const v of convertedVisitors) {
        const city = v.city || "Không xác định";
        if (geoMap[city]) {
            geoMap[city].leads += 1;
        }
    }

    const geoStats: GeoStatItem[] = Object.entries(geoMap)
        .map(([city, data]) => {
            const vCount = data.visitors.size;
            const cRate = vCount > 0 ? Number(((data.leads / vCount) * 100).toFixed(1)) : 0;
            const percentage = totalPageviews > 0 ? Number(((data.pageviews / totalPageviews) * 100).toFixed(1)) : 0;

            let potential: GeoStatItem["advertisingPotential"] = "Tiềm năng";
            if (percentage >= 25 || data.leads >= 3) {
                potential = "Rất cao";
            } else if (percentage >= 10 || data.leads >= 1) {
                potential = "Cao";
            } else if (percentage < 3) {
                potential = "Đang phát triển";
            }

            return {
                city,
                pageviews: data.pageviews,
                visitors: vCount,
                leads: data.leads,
                conversionRate: cRate,
                percentage,
                advertisingPotential: potential
            };
        })
        .sort((a, b) => b.pageviews - a.pageviews);

    // --- 2. BIỂU ĐỒ THEO NGÀY (DAILY CHART) ---
    const daysCount = range === "today" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : 14;
    const dailyMap: Record<string, { pageviews: number; visitors: Set<string>; leads: number }> = {};

    for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const key = `${yyyy}-${mm}-${dd}`;
        dailyMap[key] = { pageviews: 0, visitors: new Set(), leads: 0 };
    }

    for (const pv of filteredPvs) {
        const key = pv.timestamp.split("T")[0];
        if (dailyMap[key]) {
            dailyMap[key].pageviews += 1;
            dailyMap[key].visitors.add(pv.visitorId);
        }
    }

    for (const v of convertedVisitors) {
        if (v.convertedAt) {
            const key = v.convertedAt.split("T")[0];
            if (dailyMap[key]) {
                dailyMap[key].leads += 1;
            }
        }
    }

    const dailyChart: DailyChartItem[] = Object.entries(dailyMap).map(([date, data]) => {
        const parts = date.split("-");
        const dayMonth = `${parts[2]}/${parts[1]}`;
        return {
            date,
            label: dayMonth,
            pageviews: data.pageviews,
            visitors: data.visitors.size,
            leads: data.leads
        };
    });

    // --- 3. TOP KHÓA HỌC ĐƯỢC TÌM HIỂU NHIỀU NHẤT ---
    const courseMap: Record<string, { name: string; views: number; visitors: Set<string>; leads: number }> = {};
    for (const pv of filteredPvs) {
        if (pv.pageType === "course" && pv.targetSlug) {
            if (!courseMap[pv.targetSlug]) {
                courseMap[pv.targetSlug] = {
                    name: pv.targetName || pv.title.replace(" | DuaxCar Kitchen", "").replace("Khóa học ", ""),
                    views: 0,
                    visitors: new Set(),
                    leads: 0
                };
            }
            courseMap[pv.targetSlug].views += 1;
            courseMap[pv.targetSlug].visitors.add(pv.visitorId);
        }
    }

    // Đếm leads quan tâm khóa học
    for (const v of convertedVisitors) {
        for (const vc of v.viewedCourses) {
            if (courseMap[vc.slug]) {
                courseMap[vc.slug].leads += 1;
            }
        }
    }

    const topCourses: CourseStatItem[] = Object.entries(courseMap)
        .map(([slug, data]) => {
            const vCount = data.visitors.size;
            return {
                slug,
                name: data.name,
                views: data.views,
                uniqueVisitors: vCount,
                leads: data.leads,
                conversionRate: vCount > 0 ? Number(((data.leads / vCount) * 100).toFixed(1)) : 0
            };
        })
        .sort((a, b) => b.views - a.views);

    // --- 4. TOP BÀI VIẾT ĐƯỢC ĐỌC NHIỀU NHẤT ---
    const blogMap: Record<string, { name: string; views: number; visitors: Set<string> }> = {};
    for (const pv of filteredPvs) {
        if (pv.pageType === "blog" && pv.targetSlug) {
            if (!blogMap[pv.targetSlug]) {
                blogMap[pv.targetSlug] = {
                    name: pv.targetName || pv.title.replace(" | DuaxCar Kitchen", ""),
                    views: 0,
                    visitors: new Set()
                };
            }
            blogMap[pv.targetSlug].views += 1;
            blogMap[pv.targetSlug].visitors.add(pv.visitorId);
        }
    }

    const topBlogs: BlogStatItem[] = Object.entries(blogMap)
        .map(([slug, data]) => ({
            slug,
            name: data.name,
            views: data.views,
            uniqueVisitors: data.visitors.size
        }))
        .sort((a, b) => b.views - a.views);

    // --- 5. NGUỒN TRUY CẬP (TRAFFIC SOURCES & UTMS) ---
    const sourceMap: Record<string, { visits: number; channel: string }> = {};
    for (const pv of filteredPvs) {
        let channel = "Trực tiếp (Direct)";
        let sourceName = "direct";

        if (pv.utmSource) {
            sourceName = pv.utmSource;
            channel = `Chiến dịch (${pv.utmSource}${pv.utmCampaign ? ` / ${pv.utmCampaign}` : ""})`;
        } else if (pv.referrer && pv.referrer !== "direct") {
            try {
                const url = new URL(pv.referrer);
                if (url.hostname.includes("facebook.com")) {
                    channel = "Mạng xã hội (Facebook)";
                    sourceName = "facebook.com";
                } else if (url.hostname.includes("google.")) {
                    channel = "Tìm kiếm tự nhiên (Google)";
                    sourceName = "google.com";
                } else if (url.hostname.includes("tiktok.com")) {
                    channel = "Mạng xã hội (TikTok)";
                    sourceName = "tiktok.com";
                } else if (url.hostname.includes("zalo.me")) {
                    channel = "Mạng xã hội (Zalo)";
                    sourceName = "zalo";
                } else {
                    channel = `Giới thiệu (${url.hostname})`;
                    sourceName = url.hostname;
                }
            } catch {
                channel = "Khác";
                sourceName = "other";
            }
        }

        if (!sourceMap[channel]) {
            sourceMap[channel] = { visits: 0, channel };
        }
        sourceMap[channel].visits += 1;
    }

    const trafficSources: TrafficSourceItem[] = Object.values(sourceMap)
        .map(item => ({
            source: item.channel,
            channel: item.channel,
            visits: item.visits,
            percentage: totalPageviews > 0 ? Number(((item.visits / totalPageviews) * 100).toFixed(1)) : 0
        }))
        .sort((a, b) => b.visits - a.visits);

    // --- 6. THỐNG KÊ THIẾT BỊ ---
    let mobileCount = 0;
    let desktopCount = 0;
    let tabletCount = 0;
    for (const pv of filteredPvs) {
        if (pv.device === "mobile") mobileCount++;
        else if (pv.device === "tablet") tabletCount++;
        else desktopCount++;
    }

    // --- 7. DANH SÁCH KHÁCH HÀNG TIỀM NĂNG GẦN ĐÂY (LIVE VISITOR FEED) ---
    const recentVisitors = Object.values(store.visitors)
        .sort((a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime())
        .slice(0, 20)
        .map(v => {
            const firstTime = new Date(v.firstSeenAt).getTime();
            const lastTime = new Date(v.lastSeenAt).getTime();
            const daysSinceFirstVisit = Math.floor((lastTime - firstTime) / (1000 * 60 * 60 * 24));
            
            const coursesSummary = v.viewedCourses && v.viewedCourses.length > 0
                ? v.viewedCourses.map(c => `${c.name} (${c.viewCount} lần)`).join(", ")
                : "Chưa xem khóa học cụ thể";

            return {
                visitorId: v.visitorId,
                ip: v.ip,
                city: v.city,
                device: v.device,
                lastSeenAt: v.lastSeenAt,
                firstSeenAt: v.firstSeenAt,
                daysSinceFirstVisit,
                totalVisits: v.totalVisits,
                viewedCoursesCount: v.viewedCourses ? v.viewedCourses.length : 0,
                viewedCoursesSummary: coursesSummary,
                isConverted: v.isConverted,
                convertedLeadId: v.convertedLeadId
            };
        });

    // Tính toán thời gian trung bình thực tế trên trang từ các pageviews
    let totalDurationSeconds = 0;
    for (const pv of filteredPvs) {
        totalDurationSeconds += pv.durationSeconds || 15;
    }
    const avgSeconds = totalPageviews > 0 ? Math.round(totalDurationSeconds / totalPageviews) : 0;
    let avgTimeOnSiteFormatted = "0 giây";
    if (avgSeconds >= 60) {
        const mins = Math.floor(avgSeconds / 60);
        const secs = avgSeconds % 60;
        avgTimeOnSiteFormatted = secs > 0 ? `${mins} phút ${secs} giây` : `${mins} phút`;
    } else if (avgSeconds > 0) {
        avgTimeOnSiteFormatted = `${avgSeconds} giây`;
    }

    return {
        timeRange: range,
        totalPageviews,
        uniqueVisitors,
        totalSessions: sessions,
        totalLeads,
        conversionRate,
        avgTimeOnSiteFormatted,
        dailyChart,
        geoStats,
        topCourses,
        topBlogs,
        trafficSources,
        deviceStats: {
            mobile: mobileCount,
            desktop: desktopCount,
            tablet: tabletCount
        },
        recentVisitors
    };
}
