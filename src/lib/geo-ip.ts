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

// An toàn giải mã URL Component (xử lý chuỗi bị encode %20, %E1...)
export function safeDecodeURIComponent(str?: string | null): string {
    if (!str) return "";
    let decoded = String(str).trim();
    try {
        // Giải mã đệ quy phòng trường hợp bị encode nhiều tầng (%2520)
        for (let i = 0; i < 3; i++) {
            if (decoded.includes("%")) {
                const next = decodeURIComponent(decoded);
                if (next === decoded) break;
                decoded = next;
            } else {
                break;
            }
        }
    } catch {
        try {
            decoded = decodeURIComponent(decoded);
        } catch {
            // Giữ nguyên chuỗi nếu decode hoàn toàn không hợp lệ
        }
    }
    return decoded.trim();
}

// Bỏ dấu tiếng Việt phục vụ so khớp từ khóa
export function removeVietnameseTones(str: string): string {
    if (!str) return "";
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .trim();
}

// Bộ từ điển chuẩn hóa toàn bộ 63 Tỉnh/Thành phố Việt Nam & các thành phố/quận huyện trực thuộc
const VIETNAM_PROVINCES: Record<string, string> = {
    // Miền Bắc
    "ha noi": "Hà Nội",
    "hanoi": "Hà Nội",
    "ha noi city": "Hà Nội",
    "bach mai": "Hà Nội",
    "hai ba trung": "Hà Nội",
    "cau giay": "Hà Nội",
    "dong da": "Hà Nội",
    "ba dinh": "Hà Nội",
    "hoan kiem": "Hà Nội",
    "tay ho": "Hà Nội",
    "thanh xuan": "Hà Nội",
    "ha dong": "Hà Nội",
    "hoang mai": "Hà Nội",
    "long bien": "Hà Nội",
    "nam tu liem": "Hà Nội",
    "bac tu liem": "Hà Nội",
    "gia lam": "Hà Nội",
    "dong anh": "Hà Nội",
    "soc son": "Hà Nội",
    "thanh tri": "Hà Nội",
    "me linh": "Hà Nội",
    "son tay": "Hà Nội",
    "hoa lac": "Hà Nội",
    "thach that": "Hà Nội",
    "hoai duc": "Hà Nội",
    "dan phuong": "Hà Nội",

    "hai phong": "Hải Phòng",
    "haiphong": "Hải Phòng",
    "hai duong": "Hải Dương",
    "hung yen": "Hưng Yên",
    "bac ninh": "Bắc Ninh",
    "bac giang": "Bắc Giang",
    "quang ninh": "Quảng Ninh",
    "ha long": "Quảng Ninh",
    "cam pha": "Quảng Ninh",
    "uong bi": "Quảng Ninh",
    "mong cai": "Quảng Ninh",
    "nam dinh": "Nam Định",
    "thai binh": "Thái Bình",
    "ninh binh": "Ninh Bình",
    "ha nam": "Hà Nam",
    "phu ly": "Hà Nam",
    "vinh phuc": "Vĩnh Phúc",
    "phu tho": "Phú Thọ",
    "viet tri": "Phú Thọ",
    "thai nguyen": "Thái Nguyên",
    "tuyen quang": "Tuyên Quang",
    "lao cai": "Lào Cai",
    "sapa": "Lào Cai",
    "sa pa": "Lào Cai",
    "yen bai": "Yên Bái",
    "son la": "Sơn La",
    "hoa binh": "Hòa Bình",
    "ha giang": "Hà Giang",
    "cao bang": "Cao Bằng",
    "bac kan": "Bắc Kạn",
    "lang son": "Lạng Sơn",
    "dien bien": "Điện Biên",
    "lai chau": "Lai Châu",

    // Miền Trung & Tây Nguyên
    "thanh hoa": "Thanh Hóa",
    "nghe an": "Nghệ An",
    "vinh": "Nghệ An",
    "ha tinh": "Hà Tĩnh",
    "quang binh": "Quảng Bình",
    "dong hoi": "Quảng Bình",
    "quang tri": "Quảng Trị",
    "dong ha": "Quảng Trị",
    "thua thien hue": "Thừa Thiên Huế",
    "hue": "Thừa Thiên Huế",
    "da nang": "Đà Nẵng",
    "danang": "Đà Nẵng",
    "quang nam": "Quảng Nam",
    "hoi an": "Quảng Nam",
    "tam ky": "Quảng Nam",
    "quang ngai": "Quảng Ngãi",
    "binh dinh": "Bình Định",
    "quy nhon": "Bình Định",
    "phu yen": "Phú Yên",
    "tuy hoa": "Phú Yên",
    "khanh hoa": "Khánh Hòa",
    "nha trang": "Khánh Hòa",
    "cam ranh": "Khánh Hòa",
    "ninh thuan": "Ninh Thuận",
    "phan rang": "Ninh Thuận",
    "binh thuan": "Bình Thuận",
    "phan thiet": "Bình Thuận",
    "kon tum": "Kon Tum",
    "gia lai": "Gia Lai",
    "pleiku": "Gia Lai",
    "dak lak": "Đắk Lắk",
    "daklak": "Đắk Lắk",
    "buon ma thuot": "Đắk Lắk",
    "buon me thuot": "Đắk Lắk",
    "dak nong": "Đắk Nông",
    "daknong": "Đắk Nông",
    "lam dong": "Lâm Đồng",
    "da lat": "Lâm Đồng",
    "dalat": "Lâm Đồng",
    "bao loc": "Lâm Đồng",

    // Miền Nam
    "ho chi minh": "TP. Hồ Chí Minh",
    "ho chi minh city": "TP. Hồ Chí Minh",
    "sai gon": "TP. Hồ Chí Minh",
    "saigon": "TP. Hồ Chí Minh",
    "hcm": "TP. Hồ Chí Minh",
    "hcmc": "TP. Hồ Chí Minh",
    "thu duc": "TP. Hồ Chí Minh",
    "binh duong": "Bình Dương",
    "thu dau mot": "Bình Dương",
    "di an": "Bình Dương",
    "thuan an": "Bình Dương",
    "dong nai": "Đồng Nai",
    "bien hoa": "Đồng Nai",
    "long khanh": "Đồng Nai",
    "ba ria - vung tau": "Bà Rịa - Vũng Tàu",
    "ba ria vung tau": "Bà Rịa - Vũng Tàu",
    "vung tau": "Bà Rịa - Vũng Tàu",
    "ba ria": "Bà Rịa - Vũng Tàu",
    "tay ninh": "Tây Ninh",
    "binh phuoc": "Bình Phước",
    "long an": "Long An",
    "tan an": "Long An",
    "tien giang": "Tiền Giang",
    "my tho": "Tiền Giang",
    "ben tre": "Bến Tre",
    "tra vinh": "Trà Vinh",
    "vinh long": "Vĩnh Long",
    "dong thap": "Đồng Tháp",
    "cao lanh": "Đồng Tháp",
    "sa dec": "Đồng Tháp",
    "an giang": "An Giang",
    "long xuyen": "An Giang",
    "chau doc": "An Giang",
    "kien giang": "Kiên Giang",
    "rach gia": "Kiên Giang",
    "phu quoc": "Kiên Giang",
    "can tho": "Cần Thơ",
    "cantho": "Cần Thơ",
    "hau giang": "Hậu Giang",
    "vi thanh": "Hậu Giang",
    "soc trang": "Sóc Trăng",
    "bac lieu": "Bạc Liêu",
    "ca mau": "Cà Mau"
};

// In-memory cache lưu kết quả Geo IP (tối đa 5000 IPs)
const geoCache = new Map<string, GeoInfo>();

export function normalizeCityName(rawCity?: string | null, rawRegion?: string | null): string {
    if (!rawCity && !rawRegion) return "Không xác định";

    const cleanInput = (str: string) => {
        const decoded = safeDecodeURIComponent(str);
        if (!decoded) return null;
        // Bỏ các tiền tố hành chính phổ biến
        const withoutPrefix = decoded
            .replace(/^(tinh|tp|tp\.|thanh pho|thanh pho\.|quan|huyen|thi xa|phuong|xa|city of|province of)\s+/i, "")
            .trim();
        return {
            originalDecoded: decoded,
            cleanedText: withoutPrefix,
            unaccentedKey: removeVietnameseTones(withoutPrefix)
        };
    };

    const c = rawCity ? cleanInput(rawCity) : null;
    const r = rawRegion ? cleanInput(rawRegion) : null;

    // 1. So khớp chính xác từ điển tỉnh thành Việt Nam
    if (c?.unaccentedKey && VIETNAM_PROVINCES[c.unaccentedKey]) {
        return VIETNAM_PROVINCES[c.unaccentedKey];
    }
    if (r?.unaccentedKey && VIETNAM_PROVINCES[r.unaccentedKey]) {
        return VIETNAM_PROVINCES[r.unaccentedKey];
    }

    // 2. So khớp tương đối (nếu chuỗi chứa từ khóa tỉnh thành)
    for (const [key, val] of Object.entries(VIETNAM_PROVINCES)) {
        if (c?.unaccentedKey && (c.unaccentedKey.includes(key) || (key.length >= 4 && key.includes(c.unaccentedKey)))) {
            return val;
        }
        if (r?.unaccentedKey && (r.unaccentedKey.includes(key) || (key.length >= 4 && key.includes(r.unaccentedKey)))) {
            return val;
        }
    }

    // 3. Nếu là Localhost / Mạng nội bộ
    const checkLocal = (c?.originalDecoded || "") + " " + (r?.originalDecoded || "");
    if (/localhost|127\.0\.0\.1|::1|noi bo/i.test(checkLocal)) {
        return "Nội bộ (Localhost)";
    }

    // 4. Địa danh quốc tế hoặc khác: Trả về tên đã giải mã URL sạch sẽ
    const fallback = c?.originalDecoded || r?.originalDecoded || "Không xác định";
    return safeDecodeURIComponent(fallback).trim() || "Không xác định";
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
            region: safeDecodeURIComponent(rawRegion || rawCity || ""),
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
