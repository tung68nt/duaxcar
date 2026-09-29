/**
 * Client-Side Visitor Tracker & Journey Persistence Utilities
 */

const VISITOR_COOKIE_NAME = "duaxcar_vid";
const VISITOR_STORAGE_KEY = "duaxcar_visitor_id";
const SESSION_STORAGE_KEY = "duaxcar_session_id";
const FIRST_SEEN_KEY = "duaxcar_first_seen";
const UTM_STORAGE_KEY = "duaxcar_utm_params";
const JOURNEY_HISTORY_KEY = "duaxcar_journey_history";

export interface JourneyHistoryItem {
    path: string;
    title: string;
    type: "home" | "course" | "blog" | "schedule" | "contact" | "other";
    targetSlug?: string;
    timestamp: string;
}

export interface ClientUtmParams {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
}

export interface LeadJourneyPayload {
    visitorId: string;
    sessionId: string;
    firstSeenAt: string;
    utmParams: ClientUtmParams;
    journeyHistory: JourneyHistoryItem[];
    viewedCourses: string[];
    viewedBlogs: string[];
}

/**
 * Sinh UUID v4 chuẩn trên trình duyệt
 */
export function generateClientUUID(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Lấy cookie theo tên
 */
function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
    return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Đặt cookie lâu dài (1 năm)
 */
function setCookie(name: string, value: string, days = 365) {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Lấy hoặc tạo Visitor ID duy nhất cho thiết bị khách
 */
export function getOrCreateVisitorId(): string {
    if (typeof window === "undefined") return "";

    let vid = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!vid) {
        vid = getCookie(VISITOR_COOKIE_NAME);
    }

    if (!vid) {
        vid = `vid-${Date.now()}-${generateClientUUID().substring(0, 8)}`;
        localStorage.setItem(VISITOR_STORAGE_KEY, vid);
        setCookie(VISITOR_COOKIE_NAME, vid, 365);
    } else {
        // Đồng bộ cả 2 nơi để tránh mất ID khi xóa cache 1 bên
        localStorage.setItem(VISITOR_STORAGE_KEY, vid);
        setCookie(VISITOR_COOKIE_NAME, vid, 365);
    }

    // Ghi nhận lần đầu thấy khách nếu chưa có
    if (!localStorage.getItem(FIRST_SEEN_KEY)) {
        localStorage.setItem(FIRST_SEEN_KEY, new Date().toISOString());
    }

    return vid;
}

/**
 * Lấy hoặc tạo Session ID cho phiên truy cập hiện tại (hết hạn sau 30p đóng tab)
 */
export function getOrCreateSessionId(): string {
    if (typeof window === "undefined") return "";

    let sid = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid) {
        sid = `sess-${Date.now()}-${generateClientUUID().substring(0, 8)}`;
        sessionStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    return sid;
}

/**
 * Thu thập và lưu giữ UTM parameters từ URL nếu có
 */
export function captureUtmParameters(searchParams: URLSearchParams): ClientUtmParams {
    if (typeof window === "undefined") return {};

    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const utmTerm = searchParams.get("utm_term");
    const utmContent = searchParams.get("utm_content");

    if (utmSource || utmCampaign) {
        const params: ClientUtmParams = {
            source: utmSource || undefined,
            medium: utmMedium || undefined,
            campaign: utmCampaign || undefined,
            term: utmTerm || undefined,
            content: utmContent || undefined,
        };
        try {
            sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
            // Cũng lưu vào localStorage để dùng cho conversion sau này
            localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
        } catch {}
        return params;
    }

    try {
        const stored = sessionStorage.getItem(UTM_STORAGE_KEY) || localStorage.getItem(UTM_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch {}

    return {};
}

/**
 * Lưu vết hành trình duyệt trang vào LocalStorage của khách
 */
export function appendJourneyHistory(item: JourneyHistoryItem) {
    if (typeof window === "undefined") return;

    try {
        const raw = localStorage.getItem(JOURNEY_HISTORY_KEY);
        const history: JourneyHistoryItem[] = raw ? JSON.parse(raw) : [];

        // Tránh trùng lặp nếu F5 liên tục cùng 1 trang trong 10 giây
        const last = history[history.length - 1];
        if (last && last.path === item.path && Date.now() - new Date(last.timestamp).getTime() < 10000) {
            return;
        }

        history.push(item);
        // Lưu tối đa 30 trang gần nhất trong local storage
        if (history.length > 30) {
            history.shift();
        }

        localStorage.setItem(JOURNEY_HISTORY_KEY, JSON.stringify(history));
    } catch {}
}

/**
 * Tạo payload đầy đủ về hành trình của khách để đính kèm khi khách điền Form Đăng Ký
 */
export function getLeadJourneyPayload(): LeadJourneyPayload {
    if (typeof window === "undefined") {
        return {
            visitorId: "",
            sessionId: "",
            firstSeenAt: new Date().toISOString(),
            utmParams: {},
            journeyHistory: [],
            viewedCourses: [],
            viewedBlogs: []
        };
    }

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const firstSeenAt = localStorage.getItem(FIRST_SEEN_KEY) || new Date().toISOString();

    let utmParams: ClientUtmParams = {};
    try {
        const storedUtm = localStorage.getItem(UTM_STORAGE_KEY);
        if (storedUtm) utmParams = JSON.parse(storedUtm);
    } catch {}

    let journeyHistory: JourneyHistoryItem[] = [];
    try {
        const storedJourney = localStorage.getItem(JOURNEY_HISTORY_KEY);
        if (storedJourney) journeyHistory = JSON.parse(storedJourney);
    } catch {}

    // Lọc danh sách khóa học và bài viết khách đã xem
    const viewedCourses = Array.from(
        new Set(
            journeyHistory
                .filter(item => item.type === "course" && item.targetSlug)
                .map(item => item.targetSlug!)
        )
    );

    const viewedBlogs = Array.from(
        new Set(
            journeyHistory
                .filter(item => item.type === "blog" && item.targetSlug)
                .map(item => item.targetSlug!)
        )
    );

    return {
        visitorId,
        sessionId,
        firstSeenAt,
        utmParams,
        journeyHistory,
        viewedCourses,
        viewedBlogs
    };
}
