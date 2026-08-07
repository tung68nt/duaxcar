import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/data/mock";

export const metadata: Metadata = {
    title: {
        default: `${siteConfig.name} - ${siteConfig.tagline}`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
        "đào tạo nấu ăn",
        "học nấu phở",
        "bún bò huế",
        "dạy nghề bếp",
        "khóa học ẩm thực",
        "mở quán ăn",
        "DuaxCar Kitchen",
    ],
    authors: [{ name: "DuaxCar Kitchen" }],
    openGraph: {
        type: "website",
        locale: "vi_VN",
        url: "https://duaxcarkitchen.vn",
        title: `${siteConfig.name} - ${siteConfig.tagline}`,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
};

import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body>
                <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            </body>
        </html>
    );
}
