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

export function getVideoEmbedInfo(url?: string): { isVideo: boolean; type: "youtube" | "direct" | "unknown"; embedUrl: string } {
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

    // Direct MP4 / WebM / OGG or local video storage URL
    if (cleanUrl.match(/\.(mp4|webm|ogg)($|\?)/i) || cleanUrl.startsWith("data:video/")) {
        return {
            isVideo: true,
            type: "direct",
            embedUrl: cleanUrl,
        };
    }

    return {
        isVideo: Boolean(cleanUrl),
        type: "unknown",
        embedUrl: cleanUrl,
    };
}
