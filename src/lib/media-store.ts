/**
 * Media Library Types and Storage Helper Functions
 */

import { formatBytes, parseSizeToBytes } from "./image-compressor";

export interface MediaItem {
    id: string;
    name: string;
    url: string;
    type: "image" | "video";
    size: string;
    sizeBytes?: number;
    dimensions?: string;
    uploadedAt: string;
    compressed?: boolean;
    originalSize?: string;
}

export interface StorageStats {
    totalItems: number;
    totalImages: number;
    totalVideos: number;
    totalSizeBytes: number;
    totalSizeFormatted: string;
    maxStorageBytes: number; // e.g. 50MB or 100MB
    percentUsed: number;
    totalSavedBytes: number;
    totalSavedFormatted: string;
}

export const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
    {
        id: "m-1",
        name: "Phở Bò Gia Truyền",
        url: "/images/courses/pho-bo.jpg",
        type: "image",
        size: "156 KB",
        sizeBytes: 156 * 1024,
        dimensions: "1920x1080",
        uploadedAt: "2026-07-10"
    },
    {
        id: "m-2",
        name: "Bún Bò Huế",
        url: "/images/courses/bun-bo-hue.jpg",
        type: "image",
        size: "182 KB",
        sizeBytes: 182 * 1024,
        dimensions: "1920x1080",
        uploadedAt: "2026-07-11"
    },
    {
        id: "m-3",
        name: "Phở Gà Hà Nội",
        url: "/images/courses/pho-ga.jpg",
        type: "image",
        size: "148 KB",
        sizeBytes: 148 * 1024,
        dimensions: "1920x1080",
        uploadedAt: "2026-07-11"
    },
    {
        id: "m-4",
        name: "Bún Chả Hà Nội",
        url: "/images/courses/bun-cha.jpg",
        type: "image",
        size: "165 KB",
        sizeBytes: 165 * 1024,
        dimensions: "1920x1080",
        uploadedAt: "2026-07-12"
    },
    {
        id: "m-5",
        name: "Lẩu Nướng Kinh Doanh",
        url: "/images/courses/lau-nuong.jpg",
        type: "image",
        size: "210 KB",
        sizeBytes: 210 * 1024,
        dimensions: "1920x1080",
        uploadedAt: "2026-07-12"
    },
    {
        id: "m-6",
        name: "Ảnh Sứ Mệnh About Us",
        url: "/images/about/mission-v6.jpg",
        type: "image",
        size: "340 KB",
        sizeBytes: 340 * 1024,
        dimensions: "1920x1200",
        uploadedAt: "2026-07-14"
    },
    {
        id: "m-7",
        name: "Thầy Nguyễn Hữu Thọ",
        url: "/images/instructors/nguyen-huu-tho-v3.jpg",
        type: "image",
        size: "115 KB",
        sizeBytes: 115 * 1024,
        dimensions: "800x1000",
        uploadedAt: "2026-07-15"
    },
    {
        id: "m-8",
        name: "Thầy Phạm Văn Long",
        url: "/images/instructors/pham-van-long-v3.jpg",
        type: "image",
        size: "128 KB",
        sizeBytes: 128 * 1024,
        dimensions: "800x1000",
        uploadedAt: "2026-07-15"
    },
    {
        id: "m-9",
        name: "Video giới thiệu DuaxCar Kitchen (Demo)",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        type: "video",
        size: "2.4 MB",
        sizeBytes: 2.4 * 1024 * 1024,
        dimensions: "1280x720",
        uploadedAt: "2026-07-16"
    }
];

export const STOCK_IMAGES = [
    { name: "Phở Bò Gia Truyền", url: "/images/courses/pho-bo.jpg", category: "Khóa học" },
    { name: "Bún Bò Huế", url: "/images/courses/bun-bo-hue.jpg", category: "Khóa học" },
    { name: "Phở Gà Hà Nội", url: "/images/courses/pho-ga.jpg", category: "Khóa học" },
    { name: "Bún Chả Hà Nội", url: "/images/courses/bun-cha.jpg", category: "Khóa học" },
    { name: "Lẩu Nướng", url: "/images/courses/lau-nuong.jpg", category: "Khóa học" },
    { name: "Món Hải Sản", url: "/images/courses/hai-san.jpg", category: "Khóa học" },
    { name: "Cơm Thố Xèo", url: "/images/courses/com-tho.jpg", category: "Khóa học" },
    { name: "Về DuaxCar Story", url: "/images/about/mission-v6.jpg", category: "Giới thiệu" },
    { name: "Thầy Nguyễn Hữu Thọ", url: "/images/instructors/nguyen-huu-tho-v3.jpg", category: "Giảng viên" },
    { name: "Thầy Phạm Văn Long", url: "/images/instructors/pham-van-long-v3.jpg", category: "Giảng viên" },
    { name: "Thầy Lưu Đức Toàn", url: "/images/instructors/luu-duc-toan-v3.jpg", category: "Giảng viên" },
    { name: "Cô Nguyễn Thị Hồng", url: "/images/instructors/nguyen-thi-hong.jpg", category: "Giảng viên" }
];

/**
 * Calculates storage metrics for media items
 */
export function calculateStorageStats(
    items: MediaItem[],
    maxStorageMB: number = 100
): StorageStats {
    let totalBytes = 0;
    let imagesCount = 0;
    let videosCount = 0;
    let savedBytes = 0;

    const maxStorageBytes = maxStorageMB * 1024 * 1024;

    items.forEach((item) => {
        const itemBytes = item.sizeBytes || parseSizeToBytes(item.size);
        totalBytes += itemBytes;

        if (item.type === "video") {
            videosCount++;
        } else {
            imagesCount++;
        }

        if (item.compressed && item.originalSize) {
            const origBytes = parseSizeToBytes(item.originalSize);
            if (origBytes > itemBytes) {
                savedBytes += (origBytes - itemBytes);
            }
        }
    });

    const percentUsed = Math.min(100, Math.round((totalBytes / maxStorageBytes) * 1000) / 10);

    return {
        totalItems: items.length,
        totalImages: imagesCount,
        totalVideos: videosCount,
        totalSizeBytes: totalBytes,
        totalSizeFormatted: formatBytes(totalBytes),
        maxStorageBytes,
        percentUsed,
        totalSavedBytes: savedBytes,
        totalSavedFormatted: formatBytes(savedBytes)
    };
}
