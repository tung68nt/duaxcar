import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth-session';

export const dynamic = 'force-dynamic';

export async function POST() {
    const response = NextResponse.json({
        success: true,
        message: 'Đã đăng xuất thành công',
    });

    // Clear session cookies
    response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: '',
        path: '/',
        maxAge: 0,
        httpOnly: true,
    });

    response.cookies.set({
        name: 'admin_logged_in',
        value: '',
        path: '/',
        maxAge: 0,
        httpOnly: false,
    });

    return response;
}
