"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { navigation } from "@/data/mock";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme-toggle";

type NavItem = {
    label: string;
    href: string;
    children?: { label: string; href: string }[];
};

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-xl border-b border-[var(--color-border)] shadow-sm">
            <div className="container">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/images/logo.png"
                            alt="DuaxCar Kitchen"
                            width={180}
                            height={60}
                            className="h-14 md:h-[72px] w-auto -ml-2 transition-all"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {(navigation as NavItem[]).map((item) => (
                            <div
                                key={item.href}
                                className="relative group h-full flex items-center"
                                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                                onMouseLeave={() => item.children && setOpenDropdown(null)}
                            >
                                {item.children ? (
                                    <>
                                        <Link
                                            href={item.href}
                                            className="px-3.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-lg transition-all flex items-center gap-1.5"
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            <span>{item.label}</span>
                                            <ChevronDown className={cn(
                                                "w-4 h-4 transition-transform duration-200 group-hover:rotate-180",
                                                openDropdown === item.label && "rotate-180"
                                            )} />
                                        </Link>
                                        {/* Dropdown with hover bridge */}
                                        <div
                                            className={cn(
                                                "absolute top-full left-0 mt-1.5 w-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden transition-all duration-200 z-50 py-1.5 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto",
                                                openDropdown === item.label
                                                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                                                    : "opacity-0 invisible -translate-y-2 pointer-events-none"
                                            )}
                                        >
                                            {item.children.map((child) => {
                                                const isExternal = child.href.startsWith("http");
                                                return isExternal ? (
                                                    <a
                                                        key={child.href}
                                                        href={child.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover,rgba(255,255,255,0.05))] transition-colors"
                                                        onClick={() => setOpenDropdown(null)}
                                                    >
                                                        {child.label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover,rgba(255,255,255,0.05))] transition-colors"
                                                        onClick={() => setOpenDropdown(null)}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    item.href.startsWith("http") ? (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-lg transition-all"
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="px-3.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-lg transition-all"
                                        >
                                            {item.label}
                                        </Link>
                                    )
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* CTA Button & Theme Toggle */}
                    <div className="hidden lg:flex items-center gap-3">
                        <ThemeToggle />
                        <Link href="/lien-he" className="btn btn-primary">
                            Đăng ký ngay
                        </Link>
                    </div>

                    {/* Mobile: Theme Toggle + Menu Button */}
                    <div className="flex lg:hidden items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={cn(
                        "lg:hidden overflow-hidden transition-all duration-300",
                        isMenuOpen ? "max-h-[600px] pb-4" : "max-h-0"
                    )}
                >
                    <nav className="flex flex-col gap-1 pt-2">
                        {(navigation as NavItem[]).map((item) => (
                            <div key={item.href} className="border-b border-[var(--color-border)]/40 last:border-none pb-1">
                                {item.children ? (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex-1 px-4 py-2.5 text-base font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-all"
                                            >
                                                {item.label}
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenDropdown(
                                                        openDropdown === item.label ? null : item.label
                                                    )
                                                }
                                                className="p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                                                aria-label={`Toggle ${item.label} dropdown`}
                                            >
                                                <ChevronDown
                                                    className={cn(
                                                        "w-5 h-5 transition-transform duration-200",
                                                        openDropdown === item.label && "rotate-180"
                                                    )}
                                                />
                                            </button>
                                        </div>
                                        <div
                                            className={cn(
                                                "overflow-hidden transition-all duration-300 pl-4 bg-[var(--color-surface)]/40 rounded-lg mx-2",
                                                openDropdown === item.label ? "max-h-96 py-1 opacity-100" : "max-h-0 opacity-0 py-0"
                                            )}
                                        >
                                            {item.children.map((child) => {
                                                const isExternal = child.href.startsWith("http");
                                                return isExternal ? (
                                                    <a
                                                        key={child.href}
                                                        href={child.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                                                    >
                                                        {child.label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    item.href.startsWith("http") ? (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="px-4 py-2.5 text-base font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-all block"
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="px-4 py-2.5 text-base font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-all block"
                                        >
                                            {item.label}
                                        </Link>
                                    )
                                )}
                            </div>
                        ))}
                        <Link
                            href="/lien-he"
                            onClick={() => setIsMenuOpen(false)}
                            className="btn btn-primary mt-3 text-center"
                        >
                            Đăng ký ngay
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
