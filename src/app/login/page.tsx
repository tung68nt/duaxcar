"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ChefHat,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/admin";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    // Check existing session — redirect if already logged in
    useEffect(() => {
        const checkSession = async () => {
            try {
                const supabase = getSupabaseBrowserClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    router.push(redirectTo);
                    return;
                }
            } catch {
                // Not authenticated — show login form
            }
            setCheckingSession(false);
        };
        checkSession();
    }, [router, redirectTo]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const supabase = getSupabaseBrowserClient();

            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (authError) {
                // Map Supabase auth errors to Vietnamese messages
                const errorMessages: Record<string, string> = {
                    "Invalid login credentials": "Email hoặc mật khẩu không chính xác!",
                    "Email not confirmed": "Tài khoản chưa được xác thực email.",
                    "Too many requests": "Quá nhiều lần thử. Vui lòng đợi 1 phút.",
                };

                setError(
                    errorMessages[authError.message] ||
                    `Lỗi đăng nhập: ${authError.message}`
                );
                setLoading(false);
                return;
            }

            if (data.user) {
                setSuccess(true);
                // Small delay for success animation
                setTimeout(() => {
                    router.push(redirectTo);
                    router.refresh(); // Refresh to update middleware session
                }, 800);
            }
        } catch (err) {
            console.error("[Login] Unexpected error:", err);
            setError("Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
            setLoading(false);
        }
    };

    // Show nothing while checking existing session
    if (checkingSession) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex items-center justify-center relative overflow-hidden px-4">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-orange-600)]/10 rounded-full blur-3xl" />

            {/* Theme Toggle Top Right */}
            <div className="absolute top-6 right-6 z-10">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 sm:p-10 shadow-xl relative z-10 flex flex-col items-center">
                {/* Logo & Header */}
                <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)] flex items-center justify-center mb-5 shadow-sm">
                    <ChefHat className="w-8 h-8 text-white" />
                </div>

                <h1 className="font-heading font-bold text-2xl text-[var(--color-text)] text-center mb-2">
                    DuaxCar Admin
                </h1>
                <p className="text-xs text-[var(--color-text-secondary)] text-center mb-8">
                    Đăng nhập cổng quản lý thông tin nội bộ
                </p>

                {/* Notifications */}
                {error && (
                    <div className="w-full p-3.5 mb-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2 text-xs font-semibold animate-fadeIn">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="w-full p-3.5 mb-5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg flex items-center gap-2 text-xs font-semibold animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>Đăng nhập thành công! Đang chuyển hướng...</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5 pl-1">
                            Email quản trị
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                placeholder="name@duaxcar.vn"
                                required
                                autoComplete="email"
                                disabled={loading || success}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5 pl-1">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-10 pr-10 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                disabled={loading || success}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full btn btn-primary btn-md flex items-center justify-center gap-2 rounded-lg py-2.5 font-semibold shadow-sm transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        ) : (
                            <>
                                <span>Đăng nhập hệ thống</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Back to Home Page link */}
                <Link
                    href="/"
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mt-6 transition-colors"
                >
                    Quay lại Trang chủ DuaxCar
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
                <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
