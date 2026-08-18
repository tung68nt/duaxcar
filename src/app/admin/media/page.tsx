"use client";

import { useEffect, useState, useMemo } from "react";
import { 
    Image as ImageIcon, 
    Video, 
    Plus, 
    Trash2, 
    Copy, 
    Check, 
    Search, 
    Film, 
    FileImage,
    Sparkles,
    HardDrive,
    ArrowUpDown,
    CheckSquare,
    Square,
    RefreshCw,
    Eye,
    UploadCloud,
    SlidersHorizontal,
    CheckCircle2
} from "lucide-react";
import { 
    MediaItem, 
    DEFAULT_MEDIA_ITEMS, 
    calculateStorageStats 
} from "@/lib/media-store";
import { compressImage, formatBytes, parseSizeToBytes } from "@/lib/image-compressor";
import { MediaLightboxModal } from "@/components/admin/media-lightbox-modal";

export default function AdminMediaLibrary() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video" | "compressed">("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "largest" | "smallest" | "name">("newest");
    
    // Lightbox modal index
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Multi-select / Bulk delete state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

    // Copy toast tracking
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Upload modal state
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [compressionQuality, setCompressionQuality] = useState<number>(0.82);
    const [lastUploadStats, setLastUploadStats] = useState<{
        count: number;
        originalSize: number;
        compressedSize: number;
        ratio: number;
    } | null>(null);

    // Fetch media on mount
    const loadMedia = async () => {
        const stored = localStorage.getItem("admin_media_extended");
        if (stored) {
            try {
                setMediaItems(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing local media:", e);
                setMediaItems(DEFAULT_MEDIA_ITEMS);
            }
        } else {
            setMediaItems(DEFAULT_MEDIA_ITEMS);
            localStorage.setItem("admin_media_extended", JSON.stringify(DEFAULT_MEDIA_ITEMS));
        }

        // Try syncing from backend API
        try {
            const res = await fetch("/api/cms/media");
            if (res.ok) {
                const data = await res.json();
                if (data.media && data.media.length > 0) {
                    setMediaItems(data.media);
                    localStorage.setItem("admin_media_extended", JSON.stringify(data.media));
                }
            }
        } catch (e) {
            console.warn("API sync media notice:", e);
        }
    };

    useEffect(() => {
        loadMedia();
    }, []);

    // Filter and Sort calculation
    const processedItems = useMemo(() => {
        let result = [...mediaItems];

        // Search
        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase();
            result = result.filter(item => item.name.toLowerCase().includes(query));
        }

        // Filter
        if (typeFilter === "image") {
            result = result.filter(item => item.type === "image");
        } else if (typeFilter === "video") {
            result = result.filter(item => item.type === "video");
        } else if (typeFilter === "compressed") {
            result = result.filter(item => item.compressed);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "newest") {
                return (b.uploadedAt || "").localeCompare(a.uploadedAt || "");
            }
            if (sortBy === "oldest") {
                return (a.uploadedAt || "").localeCompare(b.uploadedAt || "");
            }
            if (sortBy === "largest") {
                const sizeA = a.sizeBytes || parseSizeToBytes(a.size);
                const sizeB = b.sizeBytes || parseSizeToBytes(b.size);
                return sizeB - sizeA;
            }
            if (sortBy === "smallest") {
                const sizeA = a.sizeBytes || parseSizeToBytes(a.size);
                const sizeB = b.sizeBytes || parseSizeToBytes(b.size);
                return sizeA - sizeB;
            }
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

        return result;
    }, [mediaItems, searchTerm, typeFilter, sortBy]);

    // Storage Statistics
    const storageStats = useMemo(() => {
        return calculateStorageStats(mediaItems, 100);
    }, [mediaItems]);

    // File Upload with Compression
    const handleFilesUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);

        const newItems: MediaItem[] = [];
        let totalOrigBytes = 0;
        let totalCompBytes = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const isVideo = file.type.startsWith("video/");

            try {
                let finalUrl = "";
                let finalSize = `${(file.size / 1024).toFixed(0)} KB`;
                let isCompressed = false;
                let originalSizeStr = `${(file.size / 1024).toFixed(0)} KB`;
                let sizeInBytes = file.size;
                let dimensionsStr = "";

                if (!isVideo && file.type.startsWith("image/")) {
                    const result = await compressImage(file, {
                        maxWidth: 1920,
                        maxHeight: 1920,
                        quality: compressionQuality,
                        format: "image/webp"
                    });

                    finalUrl = result.base64;
                    finalSize = formatBytes(result.compressedSize);
                    sizeInBytes = result.compressedSize;
                    isCompressed = true;
                    originalSizeStr = formatBytes(result.originalSize);
                    dimensionsStr = `${result.width}x${result.height}`;

                    totalOrigBytes += result.originalSize;
                    totalCompBytes += result.compressedSize;
                } else {
                    const reader = new FileReader();
                    finalUrl = await new Promise((resolve) => {
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });
                    totalOrigBytes += file.size;
                    totalCompBytes += file.size;
                }

                newItems.push({
                    id: `m-${Date.now()}-${i}`,
                    name: file.name.replace(/\.[^/.]+$/, "") + (isCompressed ? ".webp" : ""),
                    url: finalUrl,
                    type: isVideo ? "video" : "image",
                    size: finalSize,
                    sizeBytes: sizeInBytes,
                    dimensions: dimensionsStr,
                    uploadedAt: new Date().toISOString().split("T")[0],
                    compressed: isCompressed,
                    originalSize: isCompressed ? originalSizeStr : undefined
                });
            } catch (err) {
                console.error("Error compressing file:", file.name, err);
            }
        }

        if (newItems.length > 0) {
            const updated = [...newItems, ...mediaItems];
            setMediaItems(updated);
            localStorage.setItem("admin_media_extended", JSON.stringify(updated));

            // Legacy sync
            const legacyUrls = updated.map(item => item.url);
            localStorage.setItem("admin_media", JSON.stringify(legacyUrls));

            // Sync API
            fetch("/api/cms/media", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: updated })
            }).catch(() => {});

            const savedBytes = totalOrigBytes - totalCompBytes;
            const ratio = totalOrigBytes > 0 
                ? Math.max(0, Math.round((savedBytes / totalOrigBytes) * 1000) / 10) 
                : 0;

            setLastUploadStats({
                count: newItems.length,
                originalSize: totalOrigBytes,
                compressedSize: totalCompBytes,
                ratio
            });
        }

        setIsUploading(false);
    };

    // Single Delete
    const handleDeleteSingle = (id: string) => {
        const updated = mediaItems.filter(item => item.id !== id);
        setMediaItems(updated);
        localStorage.setItem("admin_media_extended", JSON.stringify(updated));

        const legacyUrls = updated.map(item => item.url);
        localStorage.setItem("admin_media", JSON.stringify(legacyUrls));

        fetch(`/api/cms/media?id=${id}`, { method: "DELETE" }).catch(() => {});
        setSelectedIds(prev => prev.filter(item => item !== id));
    };

    // Bulk Delete
    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} tập tin media đã chọn?`)) return;

        const updated = mediaItems.filter(item => !selectedIds.includes(item.id));
        setMediaItems(updated);
        localStorage.setItem("admin_media_extended", JSON.stringify(updated));

        const legacyUrls = updated.map(item => item.url);
        localStorage.setItem("admin_media", JSON.stringify(legacyUrls));

        fetch(`/api/cms/media?ids=${selectedIds.join(',')}`, { method: "DELETE" }).catch(() => {});
        setSelectedIds([]);
        setIsMultiSelectMode(false);
    };

    // Toggle select all
    const toggleSelectAll = () => {
        if (selectedIds.length === processedItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(processedItems.map(item => item.id));
        }
    };

    // Copy URL
    const copyToClipboard = (item: MediaItem) => {
        navigator.clipboard.writeText(item.url);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 w-full animate-fadeIn pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="heading-2 text-[var(--color-text)]">
                        Quản Lý Thư Viện Media
                    </h1>
                    <p className="text-small text-[var(--color-text-secondary)] mt-1">
                        Quản lý toàn bộ hình ảnh và video, tự động nén WebP siêu nhẹ, quản lý dung lượng và tích hợp trực tiếp vào CMS.
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => setUploadModalOpen(true)}
                        className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-sm rounded-lg"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tải tập tin lên (Nén WebP)</span>
                    </button>
                </div>
            </div>

            {/* Storage Analytics & Meter Widget */}
            <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-orange-500/10 text-[var(--color-primary)]">
                            <HardDrive className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-heading font-bold text-sm text-[var(--color-text)]">
                                    Dung Lượng Thư Viện Media
                                </h3>
                                <span className="px-2 py-0.5 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-[11px]">
                                    {storageStats.percentUsed}% đã dùng
                                </span>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                Đang sử dụng <b>{storageStats.totalSizeFormatted}</b> trên hạn mức ước tính <b>100 MB</b>
                            </p>
                        </div>
                    </div>

                    {/* Stat Badges */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
                        <div className="px-3 py-1.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] flex items-center gap-2">
                            <FileImage className="w-4 h-4 text-blue-500" />
                            <span><b>{storageStats.totalImages}</b> hình ảnh</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] flex items-center gap-2">
                            <Film className="w-4 h-4 text-purple-500" />
                            <span><b>{storageStats.totalVideos}</b> video</span>
                        </div>
                        {storageStats.totalSavedBytes > 0 && (
                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Tiết kiệm <b>{storageStats.totalSavedFormatted}</b> nhờ WebP</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Storage Progress Bar */}
                <div className="space-y-1.5">
                    <div className="w-full h-2.5 bg-[var(--color-background)] rounded-full overflow-hidden p-0.5 border border-[var(--color-border)]">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                                storageStats.percentUsed > 85 
                                    ? "bg-red-500" 
                                    : storageStats.percentUsed > 60 
                                        ? "bg-amber-500" 
                                        : "bg-gradient-to-r from-orange-500 to-amber-400"
                            }`}
                            style={{ width: `${Math.max(2, storageStats.percentUsed)}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] font-mono">
                        <span>0 MB</span>
                        <span>{storageStats.totalSizeFormatted} / 100 MB</span>
                    </div>
                </div>
            </div>

            {/* Filter & Actions Toolbar */}
            <div className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search & Types */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Tìm tên tập tin media..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                        />
                    </div>

                    {/* Filter buttons */}
                    <div className="flex gap-1 bg-[var(--color-background)] p-1 rounded-lg border border-[var(--color-border)]">
                        <button
                            onClick={() => setTypeFilter("all")}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                                typeFilter === "all"
                                    ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            Tất cả ({mediaItems.length})
                        </button>
                        <button
                            onClick={() => setTypeFilter("image")}
                            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                                typeFilter === "image"
                                    ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Hình ảnh</span>
                        </button>
                        <button
                            onClick={() => setTypeFilter("video")}
                            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                                typeFilter === "video"
                                    ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            <Video className="w-3.5 h-3.5" />
                            <span>Video</span>
                        </button>
                        <button
                            onClick={() => setTypeFilter("compressed")}
                            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                                typeFilter === "compressed"
                                    ? "bg-[var(--color-surface)] text-emerald-500 shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Đã nén WebP</span>
                        </button>
                    </div>
                </div>

                {/* Sort & Multi-Select */}
                <div className="flex items-center gap-2">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg">
                        <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-transparent text-xs text-[var(--color-text)] font-semibold focus:outline-none cursor-pointer"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="largest">Dung lượng lớn nhất</option>
                            <option value="smallest">Dung lượng nhỏ nhất</option>
                            <option value="name">Tên A-Z</option>
                        </select>
                    </div>

                    {/* Bulk Selection Toggle */}
                    <button
                        onClick={() => {
                            setIsMultiSelectMode(!isMultiSelectMode);
                            if (isMultiSelectMode) setSelectedIds([]);
                        }}
                        className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                            isMultiSelectMode
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                        }`}
                        title="Chọn nhiều file để xóa hàng loạt"
                    >
                        {isMultiSelectMode ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        <span className="hidden sm:inline">Chọn nhiều</span>
                    </button>

                    {/* Bulk Delete Button */}
                    {isMultiSelectMode && selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="btn btn-sm px-3 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center gap-1.5 text-xs font-semibold shadow-md animate-scaleIn"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa ({selectedIds.length})</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Multi-Select Select All Bar */}
            {isMultiSelectMode && (
                <div className="p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg flex items-center justify-between text-xs animate-fadeIn">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleSelectAll}
                            className="font-bold text-[var(--color-primary)] hover:underline"
                        >
                            {selectedIds.length === processedItems.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                        </button>
                        <span className="text-[var(--color-text-muted)]">•</span>
                        <span className="text-[var(--color-text)]">
                            Đã chọn <b>{selectedIds.length}</b> / {processedItems.length} tập tin
                        </span>
                    </div>
                </div>
            )}

            {/* Media Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                {processedItems.map((item, index) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                        <div 
                            key={item.id}
                            className={`bg-[var(--color-surface)] border rounded-xl overflow-hidden flex flex-col justify-between group relative transition-all duration-200 ${
                                isSelected
                                    ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30 shadow-md bg-[var(--color-primary)]/5"
                                    : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-md"
                            }`}
                        >
                            {/* File Preview */}
                            <div 
                                onClick={() => {
                                    if (isMultiSelectMode) {
                                        setSelectedIds(prev => 
                                            prev.includes(item.id) 
                                                ? prev.filter(id => id !== item.id) 
                                                : [...prev, item.id]
                                        );
                                    } else {
                                        setLightboxIndex(index);
                                    }
                                }}
                                className="relative aspect-video w-full bg-[var(--color-background)] overflow-hidden flex items-center justify-center cursor-pointer"
                            >
                                {item.type === "image" ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <video
                                        src={item.url}
                                        className="w-full h-full object-cover"
                                        controls={false}
                                        muted
                                        playsInline
                                    />
                                )}
                                
                                {/* Hover Overlay for Full View */}
                                {!isMultiSelectMode && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 z-10">
                                        <div className="px-3 py-1.5 rounded-lg bg-neutral-900/95 border border-white/30 text-white flex items-center gap-1.5 text-xs font-semibold shadow-xl backdrop-blur-md hover:scale-105 transition-transform">
                                            <Eye className="w-3.5 h-3.5 text-orange-400" />
                                            <span className="text-white drop-shadow">Xem Full & Zoom</span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Multi-select Checkbox */}
                                {isMultiSelectMode && (
                                    <div className="absolute top-2 right-2 z-20">
                                        <div className={`p-1.5 rounded-lg border transition ${
                                            isSelected 
                                                ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white" 
                                                : "bg-black/60 border-white/30 text-white/50"
                                        }`}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                )}

                                {/* Type Tag & WebP Badge */}
                                <div className="absolute top-2 left-2 flex items-center gap-1 z-20">
                                    <span className="bg-black/60 backdrop-blur-sm text-white p-1 rounded-md">
                                        {item.type === "image" ? <FileImage className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                                    </span>
                                    {item.compressed && (
                                        <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm shadow-sm flex items-center gap-0.5">
                                            <Sparkles className="w-2.5 h-2.5" /> WebP
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* File details & Actions */}
                            <div className="p-3 space-y-2 border-t border-[var(--color-border)]">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-semibold text-[var(--color-text)] truncate" title={item.name}>
                                        {item.name}
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] font-medium">
                                        <span className="font-mono">{item.size}</span>
                                        <span>{item.uploadedAt}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[var(--color-border)]">
                                    <button
                                        onClick={() => copyToClipboard(item)}
                                        className={`flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                                            copiedId === item.id
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                                : "bg-[var(--color-surface-light)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]"
                                        }`}
                                    >
                                        {copiedId === item.id ? (
                                            <>
                                                <Check className="w-3 h-3" />
                                                <span>Đã copy</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" />
                                                <span>Copy link</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(`Bạn có chắc chắn muốn xóa file "${item.name}"?`)) {
                                                handleDeleteSingle(item.id);
                                            }
                                        }}
                                        className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-500/10 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-semibold"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Xóa file</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {processedItems.length === 0 && (
                    <div className="col-span-full py-16 text-center space-y-3">
                        <ImageIcon className="w-10 h-10 text-[var(--color-text-muted)] mx-auto opacity-30" />
                        <p className="text-small text-[var(--color-text-muted)]">
                            Không tìm thấy tập tin media nào phù hợp với bộ lọc.
                        </p>
                    </div>
                )}
            </div>

            {/* Upload Modal with Compression Engine */}
            {uploadModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl w-full max-w-xl shadow-2xl p-6 space-y-5 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-[var(--color-primary)]">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <h3 className="font-heading font-bold text-base text-[var(--color-text)]">
                                    Tải Tập Tin Lên & Nén Ảnh Thông Minh
                                </h3>
                            </div>
                            <button
                                onClick={() => setUploadModalOpen(false)}
                                className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)]"
                            >
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        {/* Drag & Drop Area */}
                        <label 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleFilesUpload(e.dataTransfer.files);
                            }}
                            className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-[var(--color-background)]/50 transition-all"
                        >
                            <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={(e) => handleFilesUpload(e.target.files)}
                                disabled={isUploading}
                                className="hidden"
                            />
                            <div className="p-3 rounded-lg bg-orange-500/10 text-[var(--color-primary)] mb-2.5">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            <h4 className="font-heading font-bold text-sm text-[var(--color-text)]">
                                {isUploading ? "Đang xử lý nén WebP & lưu trữ..." : "Chọn hoặc kéo thả tập tin vào đây"}
                            </h4>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-xs">
                                Hỗ trợ chọn nhiều file cùng lúc (PNG, JPG, WEBP, MP4). Tự động nén WebP siêu nhẹ.
                            </p>
                        </label>

                        {/* Compression Quality Selection */}
                        <div className="bg-[var(--color-background)] p-3.5 rounded-lg border border-[var(--color-border)] space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[var(--color-text)] flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-orange-500" />
                                    Chất lượng nén ảnh WebP
                                </span>
                                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                    Giảm 75-90% dung lượng
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCompressionQuality(0.82)}
                                    className={`p-2.5 rounded-lg border text-left text-xs transition ${
                                        compressionQuality === 0.82
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                                            : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                                    }`}
                                >
                                    <div>Chuẩn tối ưu</div>
                                    <div className="text-[10px] text-[var(--color-text-muted)]">WebP 82% (Khuyên dùng)</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCompressionQuality(0.92)}
                                    className={`p-2.5 rounded-lg border text-left text-xs transition ${
                                        compressionQuality === 0.92
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                                            : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                                    }`}
                                >
                                    <div>Chất lượng cao HD</div>
                                    <div className="text-[10px] text-[var(--color-text-muted)]">WebP 92% (Sắc nét)</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCompressionQuality(0.72)}
                                    className={`p-2.5 rounded-lg border text-left text-xs transition ${
                                        compressionQuality === 0.72
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                                            : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                                    }`}
                                >
                                    <div>Siêu nhẹ</div>
                                    <div className="text-[10px] text-[var(--color-text-muted)]">WebP 72% (Tải nhanh)</div>
                                </button>
                            </div>
                        </div>

                        {/* Last Upload Report */}
                        {lastUploadStats && (
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-between text-xs animate-scaleIn">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>
                                        Đã tải lên <b>{lastUploadStats.count}</b> file: <b>{formatBytes(lastUploadStats.originalSize)}</b> ➔ <b>{formatBytes(lastUploadStats.compressedSize)}</b>
                                    </span>
                                </div>
                                <span className="font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md text-[10px]">
                                    Tiết kiệm {lastUploadStats.ratio}%
                                </span>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setUploadModalOpen(false)}
                                className="btn btn-secondary btn-sm px-5"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Lightbox Modal (Zoom In/Out, Pan, Rotate, Carousel Navigation, Thumbnails) */}
            {lightboxIndex !== null && (
                <MediaLightboxModal
                    items={processedItems}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onDelete={handleDeleteSingle}
                />
            )}
        </div>
    );
}
