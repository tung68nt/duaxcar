"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthOrAdmin = pathname?.startsWith("/admin") || pathname === "/login";

    if (isAuthOrAdmin) {
        return <main className="min-h-screen">{children}</main>;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen pt-16 md:pt-20">{children}</main>
            <Footer />
        </>
    );
}
