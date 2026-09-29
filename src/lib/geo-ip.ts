/**
 * Geo-IP Resolver & Vietnamese Province Normalizer
 * Hỗ trợ nhận diện Tỉnh / Thành phố khách truy cập từ IP headers (Vercel, Cloudflare)
 * hoặc qua lightweight IP lookup có in-memory cache.
 */

interface GeoInfo {
    ip: string;
    city: string;
    region: string;
    country: string;
    isLocal: boolean;
}

// Bộ từ điển chuẩn hóa tên Tỉnh/Thành phố Việt Nam từ tiếng Anh sang tiếng Việt có dấu chuẩn xác
const VIETNAM_PROVINCES: Record<string, string> = {
    "hanoi": "Hà Nội",
    "ha noi": "Hà Nội",
    "ha noi city": "Hà Nội",
    "ho chi minh": "TP. Hồ Chí Minh",
    "ho chi minh city": "TP. Hồ Chí Minh",
    "sai gon": "TP. Hồ Chí Minh",
    "saigon": "TP. Hồ Chí Minh",
    "da nang": "Đà Nẵng",
    "danang": "Đà Nẵng",
    "hai phong": "Hải Phòng",
    "haiphong": "Hải Phòng",
    "can tho": "Cần Thơ",
    "cantho": "Cần Thơ",
    "binh duong": "Bình Dương",
    "dong nai": "Đồng Nai",
    "quang ninh": "Quảng Ninh",
    "bac ninh": "Bắc Ninh",
    "hai duong": "Hải Dương",
    "hung yen": "Hưng Yên",
    "thai nguyen": "Thái Nguyên",
    "nam dinh": "Nam Định",
    "thai binh": "Thái Bình",
    "ninh binh": "Ninh Bình",
    "thanh hoa": "Thanh Hóa",
    "nghe an": "Nghệ An",
    "ha tinh": "Hà Tĩnh",
    "quang binh": "Quảng Bình",
    "quang tri": "Quảng Trị",
    "thua thien hue": "Thừa Thiên Huế",
    "hue": "Thừa Thiên Huế",
    "quang nam": "Quảng Nam",
    "quang ngai": "Quảng Ngãi",
    "binh dinh": "Bình Định",
    "phu yen": "Phú Yên",
    "khanh hoa": "Khánh Hòa",
    "nha trang": "Khánh Hòa",
    "ninh thuan": "Ninh Thuận",
    "binh thuan": "Bình Thuận",
    "phan thiet": "Bình Thuận",
    "lam dong": "Lâm Đồng",
    "da lat": "Lâm Đồng",
    "dak lak": "Đắk Lắk",
    "buon ma thuot": "Đắk Lắk",
    "gia lai": "Gia Lai",
    "pleiku": "Gia Lai",
    "kon tum": "Kon Tum",
    "ba ria - vung tau": "Bà Rịa - Vũng Tàu",
    "vung tau": "Bà Rịa - Vũng Tàu",
    "long an": "Long An",
    "tien giang": "Tiền Giang",
    "ben tre": "Bến Tre",
    "dong thap": "Đồng Tháp",
    "vinh long": "Vĩnh Long",
    "an giang": "An Giang",
    "kien giang": "Kiên Giang",
    "phu quoc": "Kiên Giang",
    "hau giang": "Hậu Giang",
    "soc trang": "Sóc Trăng",
    "bac lieu": "Bạc Liêu",
    "ca mau": "Cà Mau",
    "tay ninh": "Tây Ninh",
    "binh phuoc": "Bình Phước"
};

// In-memory cache lưu kết quả Geo IP (tối đa 5000 IPs)
const geoCache = new Map<string, GeoInfo>();

export function normalizeCityName(rawCity?: string | null, rawRegion?: string | null): string {
    if (!rawCity && !rawRegion) return "Không xác định";

    const clean = (str: string) => str.toLowerCase().trim().replace(/^(tinh|tp|thanh pho)\s+/i, "");

    const cityKey = rawCity ? clean(rawCity) : "";
    const regionKey = rawRegion ? clean(rawRegion) : "";

    if (cityKey && VIETNAM_PROVINCES[cityKey]) return VIETNAM_PROVINCES[cityKey];
    if (regionKey && VIETNAM_PROVINCES[regionKey]) return VIETNAM_PROVINCES[regionKey];

    // Tìm kiếm tương đối nếu có chứa từ khóa
    for (const [key, val] of Object.entries(VIETNAM_PROVINCES)) {
        if (cityKey.includes(key) || regionKey.includes(key)) {
            return val;
        }
    }

    return rawCity || rawRegion || "Không xác định";
}

/**
 * Trích xuất Client IP thực tế từ Request headers
 */
export function extractClientIp(reqHeaders: Headers): string {
    const forwarded = reqHeaders.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    const realIp = reqHeaders.get("x-real-ip");
    if (realIp) return realIp.trim();
    const cfIp = reqHeaders.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();
    return "127.0.0.1";
}

/**
 * Phân giải Geo IP thông minh từ Request headers và Cache / IP lookup
 */
export async function resolveGeoLocation(reqHeaders: Headers, ipOverride?: string): Promise<GeoInfo> {
    const ip = ipOverride || extractClientIp(reqHeaders);

    // Kiểm tra cache trước
    if (geoCache.has(ip)) {
        return geoCache.get(ip)!;
    }

    // 1. Kiểm tra IP Localhost / Mạng nội bộ
    const isLocal = ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.");
    if (isLocal) {
        const localGeo: GeoInfo = {
            ip,
            city: "Nội bộ (Localhost)",
            region: "Localhost",
            country: "Việt Nam",
            isLocal: true
        };
        geoCache.set(ip, localGeo);
        return localGeo;
    }

    // 2. Ưu tiên đọc từ Vercel Edge Headers hoặc Cloudflare Headers (cực nhanh, 0ms)
    const vercelCity = reqHeaders.get("x-vercel-ip-city");
    const vercelRegion = reqHeaders.get("x-vercel-ip-country-region");
    const vercelCountry = reqHeaders.get("x-vercel-ip-country");

    const cfCity = reqHeaders.get("cf-ipcity");
    const cfCountry = reqHeaders.get("cf-ipcountry");

    const rawCity = vercelCity || cfCity;
    const rawRegion = vercelRegion;
    const rawCountry = vercelCountry || cfCountry || "VN";

    if (rawCity || rawRegion) {
        const geo: GeoInfo = {
            ip,
            city: normalizeCityName(rawCity, rawRegion),
            region: rawRegion || rawCity || "",
            country: rawCountry === "VN" ? "Việt Nam" : rawCountry,
            isLocal: false
        };
        geoCache.set(ip, geo);
        return geo;
    }

    // 3. Fallback: Lookup nhẹ nhàng qua IP API với timeout an toàn 1.2 giây (không bao giờ block request)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            if (data.status === "success") {
                const geo: GeoInfo = {
                    ip,
                    city: normalizeCityName(data.city, data.regionName),
                    region: data.regionName || "",
                    country: data.country || "Việt Nam",
                    isLocal: false
                };
                geoCache.set(ip, geo);
                return geo;
            }
        }
    } catch {
        // Bỏ qua lỗi timeout hoặc mạng không có kết nối ra ngoài
    }

    const fallbackGeo: GeoInfo = {
        ip,
        city: "Không xác định",
        region: "",
        country: "Việt Nam",
        isLocal: false
    };
    geoCache.set(ip, fallbackGeo);
    return fallbackGeo;
}
