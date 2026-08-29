import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export function getVideoEmbedInfo(url?: string): { isVideo: boolean; type: "youtube" | "vimeo" | "r2" | "direct" | "unknown"; embedUrl: string } {
    if (!url || !url.trim()) return { isVideo: false, type: "unknown", embedUrl: "" };
    const cleanUrl = url.trim();

    // YouTube URLs: youtube.com/watch?v=xxx, youtu.be/xxx, youtube.com/shorts/xxx, youtube.com/embed/xxx
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
        return {
            isVideo: true,
            type: "youtube",
            embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
        };
    }

    // Vimeo URLs: vimeo.com/123456789
    const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
    if (vimeoMatch && vimeoMatch[3]) {
        return {
            isVideo: true,
            type: "vimeo",
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`,
        };
    }

    // Cloudflare R2 object storage URLs (e.g. pub-xxx.r2.dev, *.r2.cloudflarestorage.com) or direct video files
    const isR2 = cleanUrl.includes('.r2.dev') || cleanUrl.includes('.r2.cloudflarestorage.com');
    const isVideoFile = Boolean(cleanUrl.match(/\.(mp4|webm|ogg|mov|m4v|m3u8)($|\?)/i)) || cleanUrl.startsWith("data:video/");

    if (isR2 || isVideoFile) {
        return {
            isVideo: true,
            type: isR2 ? "r2" : "direct",
            embedUrl: cleanUrl,
        };
    }

    return {
        isVideo: Boolean(cleanUrl),
        type: "unknown",
        embedUrl: cleanUrl,
    };
}
