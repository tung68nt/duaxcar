/**
 * Advanced Device, OS & Hardware Model Detector
 * Thu thập thông tin chi tiết thiết bị người dùng (Client-Side):
 * - Mobile: iOS (iPhone 16 Pro Max, 15, 14, 13...), Android (Samsung S24, S23, Xiaomi, Oppo, Vivo...), Version OS
 * - Desktop: Windows (11/10, 64-bit, Card đồ họa GPU), Mac (Apple M1/M2/M3/M4, Intel), Linux
 * - Tablet: iPad Pro 12.9", iPad Air, Galaxy Tab...
 * - Màn hình: Độ phân giải thực tế & tỷ lệ pixel (DPR)
 * - Trình duyệt: Tên & phiên bản hoặc In-App Browser (Zalo, Facebook, TikTok)
 */

export interface DetailedDeviceInfo {
    deviceType: "mobile" | "desktop" | "tablet";
    os: string;
    deviceModel: string;
    browser: string;
    screenResolution: string;
    hardwareSummary: string;
}

/**
 * Lấy GPU Unmasked Renderer từ WebGL (nhận diện chip Apple Silicon M1-M4, A16/A17, NVIDIA, Intel, AMD...)
 */
function getWebGlRenderer(): string {
    if (typeof window === "undefined") return "";
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return "";
        const ext = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
        if (!ext) return "";
        const renderer = (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL);
        return typeof renderer === "string" ? renderer.trim() : "";
    } catch {
        return "";
    }
}

/**
 * Phân tích model iPhone / iPad dựa trên Screen Dimensions + Pixel Ratio + GPU
 */
function detectAppleDeviceModel(gpu: string): { model: string; type: "mobile" | "tablet" } {
    if (typeof window === "undefined") return { model: "Apple Device", type: "mobile" };

    const w = Math.min(window.screen.width, window.screen.height);
    const h = Math.max(window.screen.width, window.screen.height);
    const pr = window.devicePixelRatio || 1;
    const sw = Math.round(w * pr);
    const sh = Math.round(h * pr);

    const isIpad = /ipad/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIpad) {
        if (sw === 2048 && sh === 2732) return { model: "iPad Pro 12.9 inch", type: "tablet" };
        if (sw === 1668 && sh === 2388) return { model: "iPad Pro 11 inch", type: "tablet" };
        if (sw === 1640 && sh === 2360) return { model: "iPad Air 10.9 inch", type: "tablet" };
        if (sw === 1488 && sh === 2266) return { model: "iPad mini 8.3 inch", type: "tablet" };
        if (sw === 1620 && sh === 2160) return { model: "iPad 10.2 inch", type: "tablet" };
        return { model: "Apple iPad", type: "tablet" };
    }

    // iPhone Generations
    // iPhone 16 Series
    if (sw === 1320 && sh === 2868) return { model: "iPhone 16 Pro Max", type: "mobile" };
    if (sw === 1206 && sh === 2622) return { model: "iPhone 16 Pro", type: "mobile" };

    // iPhone 15 / 14 Series
    if (sw === 1290 && sh === 2796) {
        if (/A17|A18/i.test(gpu)) return { model: "iPhone 15 Pro Max", type: "mobile" };
        return { model: "iPhone 14 Pro Max / 15 Plus", type: "mobile" };
    }
    if (sw === 1179 && sh === 2556) {
        if (/A17|A18/i.test(gpu)) return { model: "iPhone 15 Pro", type: "mobile" };
        return { model: "iPhone 14 Pro / 15", type: "mobile" };
    }

    // iPhone 13 / 12 Series
    if (sw === 1284 && sh === 2778) return { model: "iPhone 14 Plus / 13 Pro Max", type: "mobile" };
    if (sw === 1170 && sh === 2532) {
        if (/A15/i.test(gpu)) return { model: "iPhone 14 / 13", type: "mobile" };
        return { model: "iPhone 12 / 12 Pro / 13", type: "mobile" };
    }
    if (sw === 1080 && sh === 2340) return { model: "iPhone 13 mini / 12 mini", type: "mobile" };

    // iPhone 11 / X Series
    if (sw === 828 && sh === 1792) return { model: "iPhone 11 / XR", type: "mobile" };
    if (sw === 1242 && sh === 2688) return { model: "iPhone 11 Pro Max / XS Max", type: "mobile" };
    if (sw === 1125 && sh === 2436) return { model: "iPhone 11 Pro / XS / X", type: "mobile" };

    // Older / SE
    if (sw === 750 && sh === 1334) return { model: "iPhone SE (2nd/3rd gen) / 8", type: "mobile" };
    if (sw === 1080 && sh === 1920) return { model: "iPhone 8 Plus / 7 Plus", type: "mobile" };

    return { model: `iPhone (${w}x${h})`, type: "mobile" };
}

/**
 * Nhận diện model máy Android từ User Agent string
 */
function detectAndroidDeviceModel(ua: string): string {
    // Regex trích xuất Model trước Build/...
    const buildMatch = ua.match(/;\s*([^;]+?)\s*Build/i);
    let rawModel = buildMatch ? buildMatch[1].trim() : "";

    if (!rawModel) {
        const androidMatch = ua.match(/Android\s*[0-9\.]+;\s*([^;\)]+)/i);
        if (androidMatch) rawModel = androidMatch[1].trim();
    }

    if (!rawModel) return "Thiết bị Android";

    // Danh mục mapping model Samsung
    if (/SM-S928/i.test(rawModel)) return "Samsung Galaxy S24 Ultra";
    if (/SM-S926/i.test(rawModel)) return "Samsung Galaxy S24+";
    if (/SM-S921/i.test(rawModel)) return "Samsung Galaxy S24";
    if (/SM-S918/i.test(rawModel)) return "Samsung Galaxy S23 Ultra";
    if (/SM-S916/i.test(rawModel)) return "Samsung Galaxy S23+";
    if (/SM-S911/i.test(rawModel)) return "Samsung Galaxy S23";
    if (/SM-S908/i.test(rawModel)) return "Samsung Galaxy S22 Ultra";
    if (/SM-S906/i.test(rawModel)) return "Samsung Galaxy S22+";
    if (/SM-S901/i.test(rawModel)) return "Samsung Galaxy S22";
    if (/SM-G998/i.test(rawModel)) return "Samsung Galaxy S21 Ultra";
    if (/SM-G996/i.test(rawModel)) return "Samsung Galaxy S21+";
    if (/SM-G991/i.test(rawModel)) return "Samsung Galaxy S21";
    if (/SM-A556/i.test(rawModel)) return "Samsung Galaxy A55 5G";
    if (/SM-A546/i.test(rawModel)) return "Samsung Galaxy A54 5G";
    if (/SM-A346/i.test(rawModel)) return "Samsung Galaxy A34 5G";
    if (/SM-A156/i.test(rawModel)) return "Samsung Galaxy A15";
    if (/SM-A146/i.test(rawModel)) return "Samsung Galaxy A14";
    if (/SM-F946/i.test(rawModel)) return "Samsung Galaxy Z Fold 5";
    if (/SM-F731/i.test(rawModel)) return "Samsung Galaxy Z Flip 5";
    if (/SM-F956/i.test(rawModel)) return "Samsung Galaxy Z Fold 6";
    if (/SM-F741/i.test(rawModel)) return "Samsung Galaxy Z Flip 6";
    if (/^SM-/i.test(rawModel)) return `Samsung (${rawModel.replace(/^SM-/i, "")})`;

    // Google Pixel
    if (/Pixel/i.test(rawModel)) {
        return rawModel.replace(/^[a-z0-9_-]+\s+/i, "");
    }

    // Xiaomi / Redmi / POCO
    if (/Redmi/i.test(rawModel)) return `Xiaomi ${rawModel}`;
    if (/POCO/i.test(rawModel)) return `Xiaomi ${rawModel}`;
    if (/Xiaomi|Mi\s+/i.test(rawModel)) return rawModel;
    if (/^(22|23|24)[0-9]{2}/i.test(rawModel)) return `Xiaomi (${rawModel})`;

    // Oppo / Vivo / Realme
    if (/CPH|PG/i.test(rawModel)) return `Oppo (${rawModel})`;
    if (/V2[0-9]{3}/i.test(rawModel)) return `Vivo (${rawModel})`;
    if (/RMX/i.test(rawModel)) return `Realme (${rawModel})`;

    return rawModel;
}

/**
 * Nhận diện máy tính Desktop (MacBook, PC Windows, GPU đồ họa)
 */
function detectDesktopDeviceModel(osName: string, gpu: string): string {
    const cleanGpu = gpu
        .replace(/ANGLE \(/i, "")
        .replace(/\)$/, "")
        .replace(/Direct3D[0-9]+ vs_[0-9]+ ps_[0-9]+/i, "")
        .replace(/vs_[0-9_]+ ps_[0-9_]+/i, "")
        .trim();

    if (osName.includes("macOS")) {
        if (/Apple M4/i.test(cleanGpu)) return "MacBook / Mac (Apple M4)";
        if (/Apple M3/i.test(cleanGpu)) return "MacBook / Mac (Apple M3)";
        if (/Apple M2/i.test(cleanGpu)) return "MacBook / Mac (Apple M2)";
        if (/Apple M1/i.test(cleanGpu)) return "MacBook / Mac (Apple M1)";
        if (/Apple/i.test(cleanGpu)) return "Mac (Apple Silicon)";
        if (/Intel/i.test(cleanGpu)) return "Mac (Intel Core)";
        return "Apple Mac";
    }

    if (osName.includes("Windows")) {
        // Trích xuất tên card rời nếu có
        let gpuSummary = "";
        if (/GeForce|RTX|GTX/i.test(cleanGpu)) {
            const m = cleanGpu.match(/(GeForce (?:RTX|GTX) [0-9]+(?: Ti| Super)?)/i);
            gpuSummary = m ? ` • ${m[1]}` : " • NVIDIA";
        } else if (/Radeon/i.test(cleanGpu)) {
            const m = cleanGpu.match(/(Radeon (?:RX )?[0-9]+(?: XT)?)/i);
            gpuSummary = m ? ` • ${m[1]}` : " • AMD Radeon";
        } else if (/Intel/i.test(cleanGpu)) {
            gpuSummary = /Iris/i.test(cleanGpu) ? " • Intel Iris Xe" : " • Intel HD Graphics";
        }

        return `PC ${osName}${gpuSummary}`;
    }

    if (osName.includes("Linux")) {
        return `Máy tính Linux (${cleanGpu || "Desktop"})`;
    }

    return "Máy tính để bàn (PC)";
}

/**
 * Nhận diện hệ điều hành OS chi tiết kèm phiên bản
 */
function detectOperatingSystem(ua: string): string {
    if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
        const m = ua.match(/OS (\d+)[_.](\d+)/i);
        return m ? `iOS ${m[1]}.${m[2]}` : "iOS";
    }

    if (/Android/i.test(ua)) {
        const m = ua.match(/Android\s*([0-9\.]+)/i);
        return m ? `Android ${m[1]}` : "Android";
    }

    if (/Windows/i.test(ua)) {
        // Windows 11 vs 10
        if (/Windows NT 10.0/i.test(ua)) {
            // Check Client Hints if available
            return "Windows 11 / 10 (64-bit)";
        }
        if (/Windows NT 6.3/i.test(ua)) return "Windows 8.1";
        if (/Windows NT 6.1/i.test(ua)) return "Windows 7";
        return "Windows";
    }

    if (/Macintosh|Mac OS X/i.test(ua)) {
        const m = ua.match(/Mac OS X (\d+)[_.](\d+)/i);
        if (m) {
            const major = parseInt(m[1]);
            const minor = parseInt(m[2]);
            if (major === 10 && minor === 15) return "macOS (Catalina trở lên)";
            return `macOS ${major}.${minor}`;
        }
        return "macOS";
    }

    if (/Linux/i.test(ua)) {
        if (/Ubuntu/i.test(ua)) return "Ubuntu Linux";
        return "Linux";
    }

    return "Không xác định";
}

/**
 * Nhận diện Trình duyệt chi tiết kèm App nội bộ
 */
function detectBrowserDetail(ua: string): string {
    if (ua.includes("Zalo")) return "Zalo App";
    if (ua.includes("FBAN") || ua.includes("FBAV")) return "Facebook App";
    if (ua.includes("TikTok")) return "TikTok App";
    if (ua.includes("Instagram")) return "Instagram App";

    // Cốc Cốc
    if (ua.includes("CocCoc") || ua.includes("coc_coc")) return "Cốc Cốc Browser";

    // Edge
    const edgeMatch = ua.match(/Edg(?:e|A|iOS)?\/([0-9\.]+)/i);
    if (edgeMatch) return `Edge ${edgeMatch[1].split(".")[0]}`;

    // Chrome
    const chromeMatch = ua.match(/Chrome\/([0-9\.]+)/i);
    if (chromeMatch && !ua.includes("Edg")) {
        return `Chrome ${chromeMatch[1].split(".")[0]}`;
    }

    // Safari
    const safariMatch = ua.match(/Version\/([0-9\.]+).*Safari/i);
    if (safariMatch) {
        return `Safari ${safariMatch[1].split(".")[0]}`;
    }

    // Firefox
    const ffMatch = ua.match(/Firefox\/([0-9\.]+)/i);
    if (ffMatch) return `Firefox ${ffMatch[1].split(".")[0]}`;

    if (ua.includes("Safari")) return "Safari";

    return "Trình duyệt khác";
}

/**
 * Hàm phân tích toàn diện thiết bị người dùng (Client-Side)
 */
export function getDetailedDeviceInfo(): DetailedDeviceInfo {
    if (typeof window === "undefined") {
        return {
            deviceType: "desktop",
            os: "Unknown",
            deviceModel: "Unknown",
            browser: "Unknown",
            screenResolution: "1920x1080",
            hardwareSummary: "Desktop PC"
        };
    }

    const ua = navigator.userAgent;
    const gpu = getWebGlRenderer();
    const os = detectOperatingSystem(ua);
    const browser = detectBrowserDetail(ua);

    // Màn hình
    const scrWidth = window.screen.width;
    const scrHeight = window.screen.height;
    const dpr = window.devicePixelRatio || 1;
    const screenResolution = `${scrWidth}x${scrHeight} (${dpr > 1 ? `${dpr.toFixed(1).replace(/\.0$/, "")}x` : "1x"})`;

    let deviceType: DetailedDeviceInfo["deviceType"] = "desktop";
    let deviceModel = "PC / Laptop";

    // 1. Kiểm tra iOS
    if (/iPhone|iPod/i.test(ua)) {
        const apple = detectAppleDeviceModel(gpu);
        deviceType = "mobile";
        deviceModel = apple.model;
    } else if (/iPad/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
        const apple = detectAppleDeviceModel(gpu);
        deviceType = "tablet";
        deviceModel = apple.model;
    }
    // 2. Kiểm tra Android
    else if (/Android/i.test(ua)) {
        deviceType = /tablet|playbook|silk/i.test(ua) ? "tablet" : "mobile";
        deviceModel = detectAndroidDeviceModel(ua);
    }
    // 3. Desktop / Laptop (Mac, Windows, Linux)
    else {
        deviceType = "desktop";
        deviceModel = detectDesktopDeviceModel(os, gpu);
    }

    const hardwareSummary = `${deviceModel} • ${os}`;

    return {
        deviceType,
        os,
        deviceModel,
        browser,
        screenResolution,
        hardwareSummary
    };
}
