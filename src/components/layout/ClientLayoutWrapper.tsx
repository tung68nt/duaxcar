"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthOrAdmin = pathname?.startsWith("/admin") || pathname === "/login";

    const [siteSettings, setSiteSettings] = useState<{ logo?: string; favicon?: string }>({
        logo: "/images/logo.png",
        favicon: "/images/logo.png"
    });

    useEffect(() => {
        // Load initial from localStorage if present
        try {
            const cached = localStorage.getItem("admin_settings");
            if (cached) {
                const parsed = JSON.parse(cached);
                setSiteSettings(prev => ({
                    logo: parsed.logo || prev.logo,
                    favicon: parsed.favicon || prev.favicon
                }));
            }
        } catch {}

        // Fetch latest settings from API
        const loadSettings = async () => {
            try {
                const res = await fetch("/api/cms/settings");
                if (res.ok) {
                    const json = await res.json();
                    if (json.settings) {
                        setSiteSettings({
                            logo: json.settings.logo || "/images/logo.png",
                            favicon: json.settings.favicon || "/images/logo.png"
                        });

                        // Dynamically update favicon in document head
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
                }
            } catch {}
        };

        loadSettings();
    }, []);

    if (isAuthOrAdmin) {
        return <main className="min-h-screen">{children}</main>;
    }

    return (
        <>
            <Header logo={siteSettings.logo} />
            <main className="min-h-screen pt-16 md:pt-20">{children}</main>
            <Footer logo={siteSettings.logo} />
        </>
    );
}
