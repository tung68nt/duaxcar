"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    ShieldCheck, 
    FileText, 
    CreditCard, 
    ChevronRight, 
    Clock, 
    Calendar, 
    Phone, 
    Mail, 
    MapPin,
    HelpCircle,
    CheckCircle2,
    Lock
} from "lucide-react";

interface TocItem {
    id: string;
    title: string;
}

interface PolicyLayoutProps {
    title: string;
    subtitle: string;
    badge: string;
    icon: ReactNode;
    lastUpdated?: string;
    toc: TocItem[];
    children: ReactNode;
}

export function PolicyLayout({
    title,
    subtitle,
    badge,
    icon,
    lastUpdated = "15/08/2026",
    toc,
    children
}: PolicyLayoutProps) {
    const pathname = usePathname();

    const policyLinks = [
        {
            name: "Chính sách bảo mật",
            href: "/chinh-sach/bao-mat",
            icon: ShieldCheck,
            desc: "Bảo vệ thông tin & dữ liệu cá nhân học viên"
        },
        {
            name: "Điều khoản sử dụng",
            href: "/chinh-sach/dieu-khoan",
            icon: FileText,
            desc: "Quy chế đào tạo & sở hữu trí tuệ công thức"
        },
        {
            name: "Thanh toán & Hoàn phí",
            href: "/chinh-sach/thanh-toan",
            icon: CreditCard,
            desc: "Quy định học phí, bảo lưu & hoàn trả"
        }
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const elem = document.getElementById(id);
        if (elem) {
            const offset = 90;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = elem.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] pt-24 pb-20">
            {/* Top Hero Section */}
            <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-10 md:py-14 mb-8">
                <div className="container max-w-6xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-5">
                        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
                            Trang chủ
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-[var(--color-text-secondary)] font-medium">Chính sách & Quy định</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-[var(--color-primary)] font-semibold truncate max-w-[200px] sm:max-w-none">
                            {title}
                        </span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-xs font-semibold mb-3">
                                {icon}
                                <span>{badge}</span>
                            </div>
                            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text)] tracking-tight">
                                {title}
                            </h1>
                            <p className="text-small text-[var(--color-text-secondary)] mt-2 max-w-2xl leading-relaxed">
                                {subtitle}
                            </p>
                        </div>

                        {/* Meta Tags */}
                        <div className="flex flex-wrap md:flex-col gap-2.5 sm:gap-2 text-xs text-[var(--color-text-muted)] bg-[var(--color-background)] p-3.5 rounded-xl border border-[var(--color-border)] min-w-[200px]">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                <span>Cập nhật: <strong className="text-[var(--color-text)] font-semibold">{lastUpdated}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                <span>Thời gian đọc: <strong className="text-[var(--color-text)] font-semibold">4-6 phút</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-green-600 font-semibold">Hiệu lực hiện hành</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <div className="container max-w-6xl">
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Sticky Sidebar */}
                    <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
                        
                        {/* Policy Navigation Switcher */}
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 shadow-sm">
                            <h3 className="font-heading font-bold text-xs text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                <span>Văn bản pháp lý & Quy định</span>
                            </h3>
                            <div className="space-y-1.5">
                                {policyLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-start gap-3 p-2.5 rounded-lg text-xs font-medium transition-all ${
                                                isActive
                                                    ? "bg-[var(--color-primary)] text-white shadow-sm font-semibold"
                                                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? "text-white" : "text-[var(--color-primary)]"}`} />
                                            <div>
                                                <div className="leading-snug">{link.name}</div>
                                                <div className={`text-[10px] mt-0.5 line-clamp-1 ${isActive ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
                                                    {link.desc}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Table of Contents */}
                        {toc.length > 0 && (
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 shadow-sm hidden md:block">
                                <h3 className="font-heading font-bold text-xs text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                    <span>Mục lục nội dung</span>
                                </h3>
                                <nav className="space-y-1">
                                    {toc.map((item, idx) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            onClick={(e) => scrollToSection(e, item.id)}
                                            className="block px-2.5 py-1.5 rounded-md text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] transition-colors leading-snug"
                                        >
                                            <span className="text-[var(--color-text-muted)] font-mono mr-1.5">{idx + 1}.</span>
                                            {item.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Support & Contact Card */}
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 shadow-sm text-xs space-y-3">
                            <div className="flex items-center gap-2 font-bold text-[var(--color-text)]">
                                <HelpCircle className="w-4 h-4 text-[var(--color-primary)]" />
                                <span>Cần tư vấn hoặc giải đáp?</span>
                            </div>
                            <p className="text-[var(--color-text-secondary)] text-[11px] leading-relaxed">
                                Đội ngũ pháp lý và ban cố vấn học viện luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc của bạn về quyền lợi học tập.
                            </p>
                            <div className="pt-2 border-t border-[var(--color-border)] space-y-2 text-[11px]">
                                <a href="tel:0963896791" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                                    <Phone className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
                                    <span>Hotline: <strong>0963.896.791</strong></span>
                                </a>
                                <a href="mailto:support@duaxcar.vn" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                                    <Mail className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
                                    <span>Email: support@duaxcar.vn</span>
                                </a>
                                <div className="flex items-start gap-2 text-[var(--color-text-secondary)]">
                                    <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                                    <span>Hà Nội: Số 20 TT18, KĐT Văn Phú, Phú La, Hà Đông</span>
                                </div>
                            </div>
                        </div>

                    </aside>

                    {/* Right Main Article / Policy Content */}
                    <main className="lg:col-span-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
                        <div className="legal-prose text-[var(--color-text-secondary)] text-small leading-relaxed space-y-8">
                            {children}
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}
