/**
 * DuaxCar Secure Admin Session Management
 *
 * Sử dụng Web Crypto API (HMAC-SHA256) chuẩn tương thích 100%
 * với cả Next.js Edge Runtime (middleware.ts) và Node.js Runtime (API Routes).
 */

export const SESSION_COOKIE_NAME = 'duaxcar_admin_session';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Helper for Base64URL encoding
function bytesToBase64Url(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// Helper for Base64URL decoding
function base64UrlToBytes(base64url: string): Uint8Array {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

// Get or derive HMAC signing key
async function getCryptoKey(): Promise<CryptoKey> {
    const rawSecret =
        process.env.ADMIN_SESSION_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        'duaxcar-kitchen-secret-key-2026-secure-session';

    const enc = new TextEncoder();
    return await crypto.subtle.importKey(
        'raw',
        enc.encode(rawSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
    );
}

export interface SessionPayload {
    email: string;
    role: string;
    exp: number; // Unix timestamp in ms
}

/**
 * Creates a cryptographically signed session token.
 */
export async function createSessionToken(email: string): Promise<string> {
    const payload: SessionPayload = {
        email: email.trim().toLowerCase(),
        role: 'admin',
        exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    };

    const enc = new TextEncoder();
    const payloadJson = JSON.stringify(payload);
    const payloadBase64 = bytesToBase64Url(enc.encode(payloadJson));

    const key = await getCryptoKey();
    const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        enc.encode(payloadBase64)
    );
    const signatureBase64 = bytesToBase64Url(new Uint8Array(signatureBuffer));

    return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifies a session token string. Returns valid true/false and payload.
 */
export async function verifySessionToken(token?: string | null): Promise<{
    valid: boolean;
    email?: string;
}> {
    if (!token || typeof token !== 'string') {
        return { valid: false };
    }

    const parts = token.split('.');
    if (parts.length !== 2) {
        return { valid: false };
    }

    const [payloadBase64, signatureBase64] = parts;

    try {
        const key = await getCryptoKey();
        const enc = new TextEncoder();
        const signatureBytes = base64UrlToBytes(signatureBase64);

        const isValidSig = await crypto.subtle.verify(
            'HMAC',
            key,
            signatureBytes as any,
            enc.encode(payloadBase64)
        );

        if (!isValidSig) {
            return { valid: false };
        }

        const payloadBytes = base64UrlToBytes(payloadBase64);
        const dec = new TextDecoder();
        const payload: SessionPayload = JSON.parse(dec.decode(payloadBytes));

        // Check expiration
        if (!payload.exp || payload.exp < Date.now()) {
            return { valid: false };
        }

        return { valid: true, email: payload.email };
    } catch {
        return { valid: false };
    }
}
