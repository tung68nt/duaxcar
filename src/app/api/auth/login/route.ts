import { NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth-session';

export const dynamic = 'force-dynamic';

// In-memory rate limiter for brute-force protection
interface LoginAttempt {
    count: number;
    firstAttemptTime: number;
}
const loginAttempts = new Map<string, LoginAttempt>();
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_FAILED_ATTEMPTS = 5;

export async function POST(request: Request) {
    try {
        // Extract client IP address
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

        // Check rate limiting
        const now = Date.now();
        const record = loginAttempts.get(clientIp);
        if (record) {
            if (now - record.firstAttemptTime > ATTEMPT_WINDOW_MS) {
                loginAttempts.delete(clientIp);
            } else if (record.count >= MAX_FAILED_ATTEMPTS) {
                const waitMinutes = Math.ceil((ATTEMPT_WINDOW_MS - (now - record.firstAttemptTime)) / 60000);
                return NextResponse.json(
                    { error: `Đăng nhập thất bại quá nhiều lần. Vui lòng thử lại sau ${waitMinutes} phút.` },
                    { status: 429 }
                );
            }
        }

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' },
                { status: 400 }
            );
        }

        const cleanEmail = String(email).trim().toLowerCase();
        const cleanPassword = String(password);

        // Allowed admin emails
        const allowedEmails = ['admin@duaxcar.vn', 'admin'];

        // Configured admin password via env, fallback to 'admin'
        const configuredPassword = process.env.ADMIN_PASSWORD || 'admin';

        const isEmailValid = allowedEmails.includes(cleanEmail);
        const isPasswordValid = cleanPassword === configuredPassword;

        if (!isEmailValid || !isPasswordValid) {
            // Increment failed attempt counter
            const currentRecord = loginAttempts.get(clientIp);
            if (!currentRecord) {
                loginAttempts.set(clientIp, { count: 1, firstAttemptTime: now });
            } else {
                currentRecord.count += 1;
            }

            return NextResponse.json(
                { error: 'Email hoặc mật khẩu quản trị không chính xác!' },
                { status: 401 }
            );
        }

        // Reset rate limiter on successful login
        loginAttempts.delete(clientIp);

        // Generate cryptographically signed session token
        const sessionToken = await createSessionToken(cleanEmail);

        const isProduction = process.env.NODE_ENV === 'production';
        const response = NextResponse.json({
            success: true,
            email: cleanEmail,
            message: 'Đăng nhập thành công',
        });

        // Set HttpOnly signed session cookie
        response.cookies.set({
            name: SESSION_COOKIE_NAME,
            value: sessionToken,
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_MAX_AGE_SECONDS,
        });

        // Set non-HttpOnly flag for client UI state
        response.cookies.set({
            name: 'admin_logged_in',
            value: 'true',
            httpOnly: false,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_MAX_AGE_SECONDS,
        });

        return response;
    } catch (error: any) {
        console.error('[API /api/auth/login] Error:', error);
        return NextResponse.json(
            { error: 'Lỗi máy chủ trong quá trình xác thực.' },
            { status: 500 }
        );
    }
}
