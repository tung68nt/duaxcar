"use client";

import { useState, Suspense } from "react";
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

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/admin";

    const [email, setEmail] = useState("admin@duaxcar.vn");
    const [password, setPassword] = useState("admin");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const cleanEmail = email.trim().toLowerCase();

        if (
            (cleanEmail === "admin@duaxcar.vn" || cleanEmail === "admin") &&
            password === "admin"
        ) {
            setSuccess(true);
            try {
                localStorage.setItem("admin_logged_in", "true");
                document.cookie = "admin_logged_in=true; path=/; max-age=2592000; SameSite=Lax";
            } catch {}
            setTimeout(() => {
                router.push(redirectTo);
            }, 600);
            return;
        }

        setError("Email hoặc mật khẩu quản trị không chính xác!");
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex items-center justify-center relative overflow-hidden px-4">
            {/* Background Decorative Blobs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Theme Toggle in top right */}
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md card p-8 relative z-10 border border-[var(--color-border)] shadow-xl flex flex-col items-center">
                {/* Logo Header */}
                <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)] flex items-center justify-center mb-5 shadow-sm">
                    <ChefHat className="w-8 h-8 text-white" />
                </div>

                <h1 className="font-heading font-bold text-2xl text-[var(--color-text)] text-center mb-2">
                    DuaxCar Admin
                </h1>
                <p className="text-small text-[var(--color-text-secondary)] text-center mb-8">
                    Đăng nhập hệ thống quản trị website & nội dung
                </p>

                {/* Error Banner */}
                {error && (
                    <div className="w-full mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2.5 animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success Banner */}
                {success && (
                    <div className="w-full mb-6 p-3.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
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
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                placeholder="admin@duaxcar.vn"
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
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus:outline-none cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Helper text info */}
                    <div className="bg-[var(--color-surface-light)]/40 border border-[var(--color-border)] rounded-lg p-3.5 text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                        <span className="font-bold text-[var(--color-primary)] block mb-1">Tài khoản quản trị CMS:</span>
                        <div>Email: <strong className="text-[var(--color-text)]">admin@duaxcar.vn</strong></div>
                        <div>Mật khẩu: <strong className="text-[var(--color-text)]">admin</strong></div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full btn btn-primary btn-md flex items-center justify-center gap-2 rounded-lg py-2.5 font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
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

                {/* Back to home */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1 font-medium"
                    >
                        ← Về trang chủ DuaxCar Kitchen
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
