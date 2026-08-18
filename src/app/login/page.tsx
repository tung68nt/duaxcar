"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ChefHat, 
    ArrowRight,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("admin@duaxcar.vn");
    const [password, setPassword] = useState("admin");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If already logged in, redirect to admin immediately
        const loggedIn = localStorage.getItem("admin_logged_in");
        if (loggedIn === "true") {
            router.push("/admin");
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {
            if (email === "admin@duaxcar.vn" && password === "admin") {
                setSuccess(true);
                localStorage.setItem("admin_logged_in", "true");
                setTimeout(() => {
                    router.push("/admin");
                }, 1000);
            } else {
                setError("Email hoặc mật khẩu quản trị không chính xác!");
                setLoading(false);
            }
        }, 1200); // Premium login delay simulation
    };

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
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5 pl-1">Email quản trị</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                placeholder="name@duaxcar.vn"
                                required
                                disabled={loading || success}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5 pl-1">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-10 pr-10 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
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

                    {/* Helper text info */}
                    <div className="bg-[var(--color-surface-light)]/40 border border-[var(--color-border)] rounded-lg p-3.5 text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                        <span className="font-bold text-[var(--color-primary)] block mb-1">Tài khoản trải nghiệm CMS:</span>
                        <div>Email: <strong className="text-[var(--color-text)]">admin@duaxcar.vn</strong></div>
                        <div>Mật khẩu: <strong className="text-[var(--color-text)]">admin</strong></div>
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
