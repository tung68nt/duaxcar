/**
 * Next.js Middleware — Auth & Security Gate
 *
 * Bảo vệ:
 * - /admin/* pages → Redirect to /login nếu chưa auth
 * - /api/cms/* routes → Return 401 nếu chưa auth
 * - Refresh auth token mỗi request
 * - Thêm security headers
 */
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

// Routes công khai, không cần auth
const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/khoa-hoc',
    '/tin-tuc',
    '/lien-he',
    '/faq',
    '/ve-duaxcar',
    '/chinh-sach',
    '/lich-khai-giang',
];

// API routes công khai
const PUBLIC_API_ROUTES = [
    '/api/contact',      // Lead submission from public form
    '/api/keep-alive',   // Health check
];

function isPublicRoute(pathname: string): boolean {
    // Exact match or starts with public route + /
    return PUBLIC_ROUTES.some(
        route => pathname === route || pathname.startsWith(route + '/')
    );
}

function isPublicApiRoute(pathname: string): boolean {
    return PUBLIC_API_ROUTES.some(
        route => pathname === route || pathname.startsWith(route + '/')
    );
}

function isProtectedApiRoute(pathname: string): boolean {
    return pathname.startsWith('/api/cms');
}

function isAdminRoute(pathname: string): boolean {
    return pathname.startsWith('/admin');
}

// Security headers applied to all responses
function addSecurityHeaders(response: NextResponse): void {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
    );
    // Content-Security-Policy — restrictive but allows Supabase, Vercel, Google Fonts
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
            "media-src 'self' blob: https://*.supabase.co https://www.w3schools.com",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://script.google.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; ')
    );
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Create response to pass through
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    // Add security headers to ALL responses
    addSecurityHeaders(response);

    // Skip auth check for static files, public routes, public APIs
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/uploads') ||
        pathname.startsWith('/favicon') ||
        pathname.endsWith('.ico') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.webp')
    ) {
        return response;
    }

    if (isPublicRoute(pathname) || isPublicApiRoute(pathname)) {
        // Still refresh token if user has session, but don't block
        try {
            const supabase = createSupabaseMiddlewareClient(request, response);
            await supabase.auth.getUser();
        } catch {
            // Ignore — public route, auth is optional
        }
        return response;
    }

    // === Protected Routes: Require Authentication ===
    if (isAdminRoute(pathname) || isProtectedApiRoute(pathname)) {
        try {
            const supabase = createSupabaseMiddlewareClient(request, response);
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                // Not authenticated
                if (isProtectedApiRoute(pathname)) {
                    // API route → return 401 JSON
                    return NextResponse.json(
                        { error: 'Unauthorized — Vui lòng đăng nhập quản trị.' },
                        { status: 401 }
                    );
                }

                // Admin page → redirect to login
                const loginUrl = new URL('/login', request.url);
                loginUrl.searchParams.set('redirect', pathname);
                return NextResponse.redirect(loginUrl);
            }

            // User is authenticated → allow through
            return response;
        } catch (err) {
            console.error('[Middleware] Auth check error:', err);

            if (isProtectedApiRoute(pathname)) {
                return NextResponse.json(
                    { error: 'Authentication service unavailable' },
                    { status: 503 }
                );
            }

            // Fallback: redirect to login on error
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
