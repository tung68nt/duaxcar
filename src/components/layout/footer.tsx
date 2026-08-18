import Link from "next/link";
import Image from "next/image";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Facebook,
    Youtube,
} from "lucide-react";
import { navigation, contactInfo, siteConfig } from "@/data/mock";

interface FooterProps {
    logo?: string;
}

export default function Footer({ logo = "/images/logo.png" }: FooterProps) {
    return (
        <footer className="bg-[var(--color-black)] border-t border-[var(--color-border)]">
            {/* Main Footer */}
            <div className="container py-8">
                {/* Top Row: Logo */}
                <div className="mb-0">
                    <Link href="/" className="inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={logo}
                            alt="DuaxCar Kitchen"
                            className="h-28 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Grid Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Column 1: Company Info (Span 5) */}
                    <div className="lg:col-span-4 flex flex-col gap-3">
                        <h4 className="font-heading font-bold text-[var(--color-primary)] text-sm leading-tight">
                            {contactInfo.companyName}
                        </h4>

                        <div className="flex flex-col gap-2">
                            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-1">
                                {siteConfig.description}
                            </p>

                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                                <span className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                                    {contactInfo.address}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                                <a
                                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] text-sm transition-colors font-medium"
                                >
                                    {contactInfo.phone}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] text-sm transition-colors"
                                >
                                    {contactInfo.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                                <span className="text-[var(--color-text-secondary)] text-sm">
                                    {contactInfo.workingHours}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Links (Span 2) */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="font-heading font-bold text-[var(--color-text)] mb-4 text-sm">
                            Liên kết
                        </h4>
                        <nav className="flex flex-col gap-2">
                            {navigation.filter(item => item.label !== "Liên hệ").map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] text-sm transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Column 3: Policies (Span 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-heading font-bold text-[var(--color-text)] mb-4 text-sm">
                            Chính sách
                        </h4>
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/chinh-sach/dieu-khoan"
                                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] text-sm transition-colors"
                            >
                                Điều khoản sử dụng
                            </Link>
                            <Link
                                href="/chinh-sach/bao-mat"
                                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] text-sm transition-colors"
                            >
                                Chính sách bảo mật
                            </Link>
                            <Link
                                href="/chinh-sach/thanh-toan"
                                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] text-sm transition-colors"
                            >
                                Chính sách thanh toán
                            </Link>
                        </nav>
                    </div>

                    {/* Column 4: Socials (Span 3) */}
                    <div className="lg:col-span-3">
                        <h4 className="font-heading font-bold text-[var(--color-text)] mb-4 text-sm">
                            Theo dõi DuaxCar Kitchen
                        </h4>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-wrap gap-3">
                                {contactInfo.socials.facebook && (
                                    <a
                                        href={contactInfo.socials.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors group border border-[var(--color-border)]"
                                        aria-label="Facebook"
                                    >
                                        <Facebook className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-white" />
                                    </a>
                                )}
                                {contactInfo.socials.youtube && (
                                    <a
                                        href={contactInfo.socials.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors group border border-[var(--color-border)]"
                                        aria-label="YouTube"
                                    >
                                        <Youtube className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-white" />
                                    </a>
                                )}
                                {contactInfo.socials.tiktok && (
                                    <a
                                        href={contactInfo.socials.tiktok}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors group border border-[var(--color-border)]"
                                        aria-label="TikTok"
                                    >
                                        <svg
                                            className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-white"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                        </svg>
                                    </a>
                                )}
                            </div>

                            {/* Bo Cong Thuong Image (Moved here) */}
                            <div className="w-48">
                                <Image
                                    src="/images/bocongthuong.png"
                                    alt="Đã thông báo Bộ Công Thương"
                                    width={150}
                                    height={57}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/30">
                <div className="container py-6">
                    <p className="text-[var(--color-text-muted)] text-sm text-center">
                        © {new Date().getFullYear()} DuaxCar Kitchen. Nấu từ tâm, kinh
                        doanh từ bền vững.
                    </p>
                </div>
            </div>
        </footer>
    );
}
