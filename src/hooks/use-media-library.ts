"use client";

/**
 * useMediaLibrary Hook
 * 
 * Single source of truth cho media data.
 * Giải quyết triệt để:
 * - Bug 1 (stale cache): Server data luôn là nguồn chính, localStorage chỉ là cache
 * - Bug 3 (sai dung lượng): Tính toán từ actual API data, không hardcode
 * 
 * Pattern: Fetch → set state → sync localStorage → recalculate stats
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import {
    MediaItem,
    DEFAULT_MEDIA_ITEMS,
    calculateStorageStats,
    type StorageStats,
} from "@/lib/media-store";
import { parseSizeToBytes } from "@/lib/image-compressor";

const STORAGE_KEY = "admin_media_extended";

interface UseMediaLibraryReturn {
    /** Current media items (server-synced) */
    mediaItems: MediaItem[];
    /** Is fetching from server */
    isLoading: boolean;
    /** Storage stats calculated from current items */
    storageStats: StorageStats;
    /** Add newly uploaded items to the list */
    addItems: (newItems: MediaItem[]) => void;
    /** Delete single item */
    deleteItem: (id: string) => void;
    /** Delete multiple items */
    deleteItems: (ids: string[]) => void;
    /** Force refresh from server */
    refresh: () => Promise<void>;
}

export function useMediaLibrary(): UseMediaLibraryReturn {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sync state → localStorage (write-through cache)
    const syncToLocalStorage = useCallback((items: MediaItem[]) => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(items.slice(0, 100)) // Cap at 100 items
            );
        } catch {
            // localStorage full or unavailable
        }
    }, []);

    // Fetch from server (authoritative source)
    const fetchFromServer = useCallback(async () => {
        try {
            const res = await fetch("/api/cms/media", {
                cache: "no-store",
                headers: { "Cache-Control": "no-cache" },
            });

            if (!res.ok) return null;

            const data = await res.json();
            if (data.media && Array.isArray(data.media) && data.media.length > 0) {
                return data.media as MediaItem[];
            }
        } catch (err) {
            console.warn("[useMediaLibrary] Server fetch error:", err);
        }
        return null;
    }, []);

    // Initial load: localStorage first (instant), then server (authoritative)
    const loadMedia = useCallback(async () => {
        setIsLoading(true);

        // 1. Instant: load from localStorage cache
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMediaItems(parsed);
                }
            }
        } catch {
            // Ignore parse errors
        }

        // 2. Authoritative: fetch from server & replace
        const serverItems = await fetchFromServer();
        if (serverItems) {
            setMediaItems(serverItems);
            syncToLocalStorage(serverItems);
        } else {
            // Server unavailable — use defaults if localStorage was also empty
            setMediaItems((prev) => (prev.length > 0 ? prev : DEFAULT_MEDIA_ITEMS));
        }

        setIsLoading(false);
    }, [fetchFromServer, syncToLocalStorage]);

    useEffect(() => {
        loadMedia();
    }, [loadMedia]);

    // === Mutations ===

    const addItems = useCallback(
        (newItems: MediaItem[]) => {
            setMediaItems((prev) => {
                const updated = [...newItems, ...prev];
                syncToLocalStorage(updated);
                return updated;
            });
        },
        [syncToLocalStorage]
    );

    const deleteItem = useCallback(
        (id: string) => {
            setMediaItems((prev) => {
                const updated = prev.filter((item) => item.id !== id);
                syncToLocalStorage(updated);
                return updated;
            });

            // Fire-and-forget server delete
            fetch(`/api/cms/media?id=${id}`, { method: "DELETE" }).catch(() => {});
        },
        [syncToLocalStorage]
    );

    const deleteItems = useCallback(
        (ids: string[]) => {
            if (ids.length === 0) return;

            setMediaItems((prev) => {
                const idSet = new Set(ids);
                const updated = prev.filter((item) => !idSet.has(item.id));
                syncToLocalStorage(updated);
                return updated;
            });

            // Fire-and-forget server delete
            fetch(`/api/cms/media?ids=${ids.join(",")}`, {
                method: "DELETE",
            }).catch(() => {});
        },
        [syncToLocalStorage]
    );

    const refresh = useCallback(async () => {
        setIsLoading(true);
        const serverItems = await fetchFromServer();
        if (serverItems) {
            setMediaItems(serverItems);
            syncToLocalStorage(serverItems);
        }
        setIsLoading(false);
    }, [fetchFromServer, syncToLocalStorage]);

    // === Computed ===

    const storageStats = useMemo(
        () => calculateStorageStats(mediaItems, 100),
        [mediaItems]
    );

    return {
        mediaItems,
        isLoading,
        storageStats,
        addItems,
        deleteItem,
        deleteItems,
        refresh,
    };
}

// === Filter & Sort utilities ===

export type MediaTypeFilter = "all" | "image" | "video" | "compressed";
export type MediaSortBy = "newest" | "oldest" | "largest" | "smallest" | "name";

export function filterAndSortMedia(
    items: MediaItem[],
    searchTerm: string,
    typeFilter: MediaTypeFilter,
    sortBy: MediaSortBy
): MediaItem[] {
    let result = [...items];

    // Search
    if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        result = result.filter((item) => item.name.toLowerCase().includes(query));
    }

    // Filter
    switch (typeFilter) {
        case "image":
            result = result.filter((item) => item.type === "image");
            break;
        case "video":
            result = result.filter((item) => item.type === "video");
            break;
        case "compressed":
            result = result.filter((item) => item.compressed);
            break;
    }

    // Sort
    result.sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return (b.uploadedAt || "").localeCompare(a.uploadedAt || "");
            case "oldest":
                return (a.uploadedAt || "").localeCompare(b.uploadedAt || "");
            case "largest": {
                const sA = a.sizeBytes || parseSizeToBytes(a.size);
                const sB = b.sizeBytes || parseSizeToBytes(b.size);
                return sB - sA;
            }
            case "smallest": {
                const sA = a.sizeBytes || parseSizeToBytes(a.size);
                const sB = b.sizeBytes || parseSizeToBytes(b.size);
                return sA - sB;
            }
            case "name":
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    return result;
}
