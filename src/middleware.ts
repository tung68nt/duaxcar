/**
 * Next.js Middleware — DuaxCar Security Gate
 *
 * Nhiệm vụ bảo vệ:
 * 1. Chặn toàn bộ truy cập trái phép vào /admin/*
 * 2. Bảo vệ các API nhạy cảm /api/cms/registrations (Chặn rò rỉ PII học viên)
 * 3. Bảo vệ các thao tác ghi / xóa (POST, PUT, DELETE) trên toàn bộ /api/cms/*
 * 4. Cho phép đọc công khai (GET) các nội dung tĩnh cần thiết cho giao diện học viên
 * 5. Ngăn chặn triệt để vòng lặp chuyển hướng (redirect loop)
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-session';

// Các API cho phép đọc công khai (GET) để hiển thị trên website người dùng
const PUBLIC_GET_CMS_APIS = [
    '/api/cms/settings',
    '/api/cms/courses',
    '/api/cms/schedules',
    '/api/cms/blogs',
    '/api/cms/faq',
    '/api/cms/instructors',
    '/api/cms/policies',
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const method = request.method.toUpperCase();

    // 1. Bỏ qua tài nguyên tĩnh (Images, Next bundle, Favicon...)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/uploads') ||
        pathname.startsWith('/favicon') ||
        pathname.endsWith('.ico') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.webp') ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        return NextResponse.next();
    }

    // 2. Lấy session token từ cookie và kiểm tra tính hợp lệ
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const { valid: isAuthenticated } = await verifySessionToken(sessionToken);

    // 3. Xử lý trang Đăng nhập (/login)
    if (pathname === '/login') {
        // Nếu đã đăng nhập hợp lệ, chuyển hướng ngay vào Admin (tránh kẹt ở login)
        if (isAuthenticated) {
            const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/admin';
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
        return NextResponse.next();
    }

    // 4. Xử lý toàn bộ route Quản trị (/admin/*)
    if (pathname.startsWith('/admin')) {
        if (!isAuthenticated) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // 5. Xử lý toàn bộ Route Handlers CMS (/api/cms/*)
    if (pathname.startsWith('/api/cms')) {
        // Cho phép xem ảnh đã tải lên công khai: /api/cms/image/*
        if (pathname.startsWith('/api/cms/image')) {
            return NextResponse.next();
        }

        // BẢO VỆ ĐẶC BIỆT: Dữ liệu khách hàng đăng ký (PII) KHÔNG BAO GIỜ mở công khai
        if (pathname.startsWith('/api/cms/registrations')) {
            if (!isAuthenticated) {
                return NextResponse.json(
                    { error: 'Unauthorized — Yêu cầu quyền quản trị viên để xem hoặc chỉnh sửa danh sách học viên.' },
                    { status: 401 }
                );
            }
            return NextResponse.next();
        }

        // BẢO VỆ ĐẶC BIỆT: Thư viện media nội bộ
        if (pathname.startsWith('/api/cms/media')) {
            if (!isAuthenticated) {
                return NextResponse.json(
                    { error: 'Unauthorized — Yêu cầu quyền quản trị viên.' },
                    { status: 401 }
                );
            }
            return NextResponse.next();
        }

        // Cho phép đọc công khai (GET) một số danh mục cần thiết cho frontend học viên
        if (method === 'GET') {
            const isPublicCmsApi = PUBLIC_GET_CMS_APIS.some(
                prefix => pathname === prefix || pathname.startsWith(prefix + '/')
            );
            if (isPublicCmsApi) {
                return NextResponse.next();
            }
        }

        // Mọi hành động GHI, SỬA, XÓA (POST, PUT, DELETE, PATCH) hoặc endpoint còn lại BẮT BUỘC đăng nhập
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: 'Unauthorized — Thao tác này yêu cầu quyền quản trị viên DuaxCar.' },
                { status: 401 }
            );
        }

        return NextResponse.next();
    }

    // 6. Các trang và API công khai khác (Trang chủ, Khóa học, /api/contact, /api/auth/*)
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Khớp tất cả các đường dẫn trừ static files
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
