"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
    LayoutDashboard, 
    BookOpen, 
    FileText, 
    Users, 
    Settings, 
    Menu, 
    X, 
    Bell, 
    Home,
    LogOut,
    HelpCircle,
    ChefHat,
    ShieldCheck,
    Image as ImageIcon
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const [logoUrl, setLogoUrl] = useState("/images/logo.png");

    useEffect(() => {
        // Verify Supabase Auth session
        const checkAuth = async () => {
            try {
                const supabase = getSupabaseBrowserClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }
            } catch {
                router.push("/login");
                return;
            }
            setIsLoading(false);
        };
        checkAuth();

        // Fetch settings for logo and favicon
        try {
            const cached = localStorage.getItem("admin_settings");
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.logo) setLogoUrl(parsed.logo);
                if (parsed.favicon) {
                    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement("link");
                        link.rel = "icon";
                        document.head.appendChild(link);
                    }
                    link.href = parsed.favicon;
                }
            }
        } catch {}

        fetch("/api/cms/settings")
            .then(res => res.json())
            .then(json => {
                if (json.settings) {
                    if (json.settings.logo) setLogoUrl(json.settings.logo);
                    if (json.settings.favicon) {
                        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
                        if (!link) {
                            link = document.createElement("link");
                            link.rel = "icon";
                            document.head.appendChild(link);
                        }
                        link.href = json.settings.favicon;
                    }
                }
            })
            .catch(() => {});
    }, [router]);

    const handleLogout = async () => {
        try {
            const supabase = getSupabaseBrowserClient();
            await supabase.auth.signOut();
        } catch {
            // Ignore sign-out errors
        }
        router.push("/login");
        router.refresh();
    };

    const menuItems = [
        { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
        { label: "Khóa học (CMS)", href: "/admin/khoa-hoc", icon: BookOpen },
        { label: "Bài viết (CMS)", href: "/admin/tin-tuc", icon: FileText },
        { label: "Giảng viên (CMS)", href: "/admin/giang-vien", icon: ChefHat },
        { label: "Đăng ký học", href: "/admin/dang-ky", icon: Users },
        { label: "Hỏi đáp (FAQ)", href: "/admin/faq", icon: HelpCircle },
        { label: "Chính sách (CMS)", href: "/admin/chinh-sach", icon: ShieldCheck },
        { label: "Thư viện Media", href: "/admin/media", icon: ImageIcon },
        { label: "Cài đặt", href: "/admin/cai-dat", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] fixed top-0 bottom-0 left-0 z-30">
                {/* Brand Logo */}
                <div className="h-14 flex items-center px-4 border-b border-[var(--color-border)] gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={logoUrl}
                        alt="DuaxCar Logo"
                        className="h-8 w-auto max-w-[110px] object-contain"
                    />
                    <div className="min-w-0">
                        <span className="font-heading font-bold text-[var(--color-text)] text-xs block leading-tight truncate">
                            DuaxCar Admin
                        </span>
                        <span className="text-[10px] text-[var(--color-primary)] font-semibold block">
                            Hệ thống CMS
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-3.5 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 group ${
                                    isActive
                                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-text)] font-medium"
                                }`}
                            >
                                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${
                                    isActive ? "text-white" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
                                }`} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-[var(--color-border)] space-y-1">
                    <Link 
                        href="/" 
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-text)] transition-colors"
                    >
                        <Home className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                        <span>Xem trang chủ</span>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] z-50 md:hidden transition-transform duration-300 transform ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={logoUrl}
                            alt="DuaxCar Logo"
                            className="h-8 w-auto max-w-[110px] object-contain"
                        />
                        <span className="font-heading font-bold text-[var(--color-text)] text-xs">
                            DuaxCar Admin
                        </span>
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)]"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-xs transition-all group ${
                                    isActive
                                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-text)]"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-[var(--color-border)] space-y-1">
                    <Link 
                        href="/" 
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)]"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Xem trang chủ</span>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 md:pl-64 flex flex-col min-w-0">
                {/* Header / Top Bar */}
                <header className="h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-5 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-1.5 -ml-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)] md:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:block text-xs font-medium text-[var(--color-text-secondary)]">
                            Xin chào, <span className="font-bold text-[var(--color-text)]">Quản trị viên</span> 👋
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Notifications */}
                        <button className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)] relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />
                        </button>

                        {/* Admin Profile */}
                        <div className="flex items-center gap-2.5 pl-2.5 border-l border-[var(--color-border)]">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-xs">
                                AD
                            </div>
                            <div className="hidden lg:block text-left">
                                <div className="text-xs font-semibold text-[var(--color-text)] leading-none">
                                    Admin User
                                </div>
                                <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                                    admin@duaxcar.vn
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Subpage Content wrapper */}
                <main className="flex-1 p-4 sm:p-5 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
