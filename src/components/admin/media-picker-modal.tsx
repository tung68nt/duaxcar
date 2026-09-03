"use client";

import { useState, useEffect, useId } from "react";
import { 
    Image as ImageIcon, 
    X, 
    Check, 
    UploadCloud, 
    Search, 
    Folder, 
    Sparkles, 
    CheckCircle2, 
    Film,
    Eye,
    CheckSquare,
    Square,
    AlertCircle,
    Loader2
} from "lucide-react";
import { MediaItem, DEFAULT_MEDIA_ITEMS, STOCK_IMAGES } from "@/lib/media-store";
import { compressImage, formatBytes } from "@/lib/image-compressor";
import { MediaLightboxModal } from "./media-lightbox-modal";

export interface MediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string, item?: MediaItem) => void;
    selectedUrl?: string;
    title?: string;
    allowedType?: "all" | "image" | "video";
    allowMultiple?: boolean;
    onSelectMultiple?: (urls: string[], items?: MediaItem[]) => void;
}

export function MediaPickerModal({
    isOpen,
    onClose,
    onSelect,
    selectedUrl,
    title = "Chọn ảnh từ Thư viện Media",
    allowedType = "image",
    allowMultiple = false,
    onSelectMultiple
}: MediaPickerModalProps) {
    const fileInputId = useId();
    const [activeTab, setActiveTab] = useState<"library" | "upload" | "stock">("library");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Single select state
    const [selectedItemUrl, setSelectedItemUrl] = useState<string>(selectedUrl || "");
    const [currentSelectedItem, setCurrentSelectedItem] = useState<MediaItem | null>(null);

    // Multi-select state
    const [selectedUrls, setSelectedUrls] = useState<string[]>(selectedUrl ? [selectedUrl] : []);

    // Upload & compression states
    const [isUploading, setIsUploading] = useState(false);
    const [compressionQuality, setCompressionQuality] = useState<number>(0.82);
    const [uploadProgress, setUploadProgress] = useState<{
        current: number;
        total: number;
        fileName: string;
        percent: number;
    } | null>(null);
    const [uploadErrors, setUploadErrors] = useState<string[]>([]);
    const [lastUploadStats, setLastUploadStats] = useState<{
        count: number;
        originalSize: number;
        compressedSize: number;
        ratio: number;
    } | null>(null);

    // Lightbox preview state
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    // Load media from API / LocalStorage
    useEffect(() => {
        if (!isOpen) return;

        const loadMedia = async () => {
            const stored = localStorage.getItem("admin_media_extended");
            if (stored) {
                try {
                    setMediaItems(JSON.parse(stored));
                } catch {
                    setMediaItems(DEFAULT_MEDIA_ITEMS);
                }
            } else {
                setMediaItems(DEFAULT_MEDIA_ITEMS);
            }

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
                console.warn("Could not fetch media API:", e);
            }
        };

        loadMedia();
    }, [isOpen]);

    useEffect(() => {
        if (selectedUrl) {
            setSelectedItemUrl(selectedUrl);
            setSelectedUrls([selectedUrl]);
        }
    }, [selectedUrl]);

    if (!isOpen) return null;

    // Filter media items
    const filteredItems = mediaItems.filter(item => {
        if (allowedType === "image" && item.type !== "image") return false;
        if (allowedType === "video" && item.type !== "video") return false;
        if (searchTerm) {
            return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });

    // Toggle multi-select
    const toggleItemSelection = (url: string, item: MediaItem) => {
        if (allowMultiple) {
            setSelectedUrls(prev => {
                if (prev.includes(url)) {
                    return prev.filter(u => u !== url);
                } else {
                    return [...prev, url];
                }
            });
            setCurrentSelectedItem(item);
        } else {
            setSelectedItemUrl(url);
            setCurrentSelectedItem(item);
        }
    };

    const handleSelectAllFiltered = () => {
        const urls = filteredItems.map(i => i.url);
        setSelectedUrls(urls);
    };

    const handleDeselectAll = () => {
        setSelectedUrls([]);
        setSelectedItemUrl("");
    };

    // Multi-file upload handler
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let files: FileList | null = null;
        if ("dataTransfer" in e) {
            e.preventDefault();
            files = e.dataTransfer.files;
        } else if (e.target.files) {
            files = e.target.files;
        }

        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadErrors([]);
        setLastUploadStats(null);
        setUploadProgress({
            current: 0,
            total: files.length,
            fileName: files[0].name,
            percent: 0
        });

        const newItems: MediaItem[] = [];
        const errors: string[] = [];
        let totalOrigBytes = 0;
        let totalCompBytes = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const isVideo = file.type.startsWith("video/");

            setUploadProgress({
                current: i + 1,
                total: files.length,
                fileName: file.name,
                percent: Math.round(((i) / files.length) * 100)
            });

            try {
                let uploadBody: FormData;
                let sizeInBytes = file.size;
                let dimensionsStr = "";
                let isCompressed = false;
                let originalSizeStr = formatBytes(file.size);

                if (!isVideo && file.type.startsWith("image/")) {
                    // Smart client-side compression to WebP
                    const result = await compressImage(file, {
                        maxWidth: 1920,
                        maxHeight: 1920,
                        quality: compressionQuality,
                        format: "image/webp"
                    });

                    sizeInBytes = result.compressedSize;
                    dimensionsStr = `${result.width}x${result.height}`;
                    isCompressed = true;
                    totalOrigBytes += result.originalSize;
                    totalCompBytes += result.compressedSize;

                    const formData = new FormData();
                    const webpFile = new File(
                        [result.file],
                        file.name.replace(/\.[^/.]+$/, ".webp"),
                        { type: "image/webp" }
                    );
                    formData.append("file", webpFile);
                    uploadBody = formData;
                } else {
                    const formData = new FormData();
                    formData.append("file", file);
                    uploadBody = formData;
                    totalOrigBytes += file.size;
                    totalCompBytes += file.size;
                }

                // Upload to server via FormData
                const uploadRes = await fetch("/api/cms/upload", {
                    method: "POST",
                    body: uploadBody
                });

                if (!uploadRes.ok) {
                    const errData = await uploadRes.json().catch(() => ({}));
                    errors.push(`Upload "${file.name}" thất bại: ${errData.error || uploadRes.statusText}`);
                    continue;
                }

                const uploadData = await uploadRes.json();
                const finalUrl = uploadData.url || uploadData.item?.url || "";

                const newItem: MediaItem = {
                    id: uploadData.item?.id || `m-${Date.now()}-${i}`,
                    name: file.name.replace(/\.[^/.]+$/, "") + (isCompressed ? ".webp" : ""),
                    url: finalUrl,
                    type: isVideo ? "video" : "image",
                    size: formatBytes(sizeInBytes),
                    sizeBytes: sizeInBytes,
                    dimensions: dimensionsStr || (isVideo ? "Video HD" : "Ảnh HD"),
                    uploadedAt: new Date().toISOString().split("T")[0],
                    compressed: isCompressed,
                    originalSize: isCompressed ? originalSizeStr : undefined
                };

                newItems.push(newItem);
            } catch (fileErr: any) {
                console.error("File upload error:", file.name, fileErr);
                errors.push(`Lỗi "${file.name}": ${fileErr?.message || "Không thể xử lý"}`);
            }
        }

        setUploadProgress({
            current: files.length,
            total: files.length,
            fileName: "Hoàn tất xử lý!",
            percent: 100
        });

        if (errors.length > 0) {
            setUploadErrors(errors);
        }

        if (newItems.length > 0) {
            const updated = [...newItems, ...mediaItems];
            setMediaItems(updated);

            try {
                localStorage.setItem("admin_media_extended", JSON.stringify(updated.slice(0, 100)));
                const legacyUrls = updated.slice(0, 100).map(item => item.url);
                localStorage.setItem("admin_media", JSON.stringify(legacyUrls));
            } catch {}

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

            // If multi-select is enabled, auto-select all newly uploaded items
            if (allowMultiple) {
                const newUrls = newItems.map(i => i.url);
                setSelectedUrls(prev => [...newUrls, ...prev]);
                setCurrentSelectedItem(newItems[0]);
            } else {
                // Single select: select first newly uploaded item
                setSelectedItemUrl(newItems[0].url);
                setCurrentSelectedItem(newItems[0]);
            }

            // Automatically switch back to library tab to show newly uploaded media
            setTimeout(() => {
                setActiveTab("library");
            }, 600);
        }

        setIsUploading(false);
    };

    const handleConfirmSelection = () => {
        if (allowMultiple) {
            if (selectedUrls.length > 0) {
                const selectedItems = mediaItems.filter(i => selectedUrls.includes(i.url));
                if (onSelectMultiple) {
                    onSelectMultiple(selectedUrls, selectedItems);
                } else {
                    onSelect(selectedUrls[0], selectedItems[0]);
                }
                onClose();
            }
        } else {
            if (selectedItemUrl) {
                onSelect(selectedItemUrl, currentSelectedItem || undefined);
                onClose();
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
                
                {/* Modal Header */}
                <div className="px-5 py-3.5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-[var(--color-primary)]">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-heading font-bold text-base text-[var(--color-text)]">
                                    {title}
                                </h3>
                                {allowMultiple && (
                                    <span className="text-[10px] bg-orange-500/15 text-[var(--color-primary)] font-bold px-2 py-0.5 rounded-full border border-orange-500/20">
                                        Chọn nhiều ảnh
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                {allowMultiple 
                                    ? "Chọn nhiều ảnh từ thư viện hoặc tải lên nhiều ảnh cùng lúc" 
                                    : "Chọn ảnh có sẵn hoặc tải ảnh mới lên (tự động nén WebP siêu nhẹ)"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-text)] transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs & Toolbar */}
                <div className="px-5 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-background)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 bg-[var(--color-surface)] p-1 rounded-lg border border-[var(--color-border)]">
                        <button
                            type="button"
                            onClick={() => setActiveTab("library")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                                activeTab === "library"
                                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            <Folder className="w-3.5 h-3.5" />
                            <span>Thư viện ({filteredItems.length})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("upload")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                                activeTab === "upload"
                                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Tải ảnh mới</span>
                            {allowMultiple && <span className="text-[10px] opacity-80">(nhiều ảnh)</span>}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("stock")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                                activeTab === "stock"
                                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ảnh mẫu</span>
                        </button>
                    </div>

                    {/* Search & Multi-Select Quick Actions */}
                    {activeTab === "library" && (
                        <div className="flex items-center gap-2">
                            {allowMultiple && (
                                <div className="flex items-center gap-1.5 mr-1">
                                    <button
                                        type="button"
                                        onClick={handleSelectAllFiltered}
                                        className="text-[11px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-2 py-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)]"
                                    >
                                        Chọn tất cả
                                    </button>
                                    {selectedUrls.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleDeselectAll}
                                            className="text-[11px] font-medium text-red-500 hover:text-red-600 px-2 py-1 rounded bg-[var(--color-surface)] border border-red-500/20"
                                        >
                                            Bỏ chọn
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="relative w-full sm:w-56">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm theo tên file..."
                                    className="w-full pl-8 pr-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] focus:outline-hidden focus:border-[var(--color-primary)] placeholder-[var(--color-text-muted)]"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Body */}
                <div className="p-5 flex-1 overflow-y-auto">
                    {/* TAB 1: MEDIA LIBRARY */}
                    {activeTab === "library" && (
                        <div>
                            {filteredItems.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-14 h-14 rounded-full bg-orange-500/10 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-3">
                                        <Folder className="w-7 h-7" />
                                    </div>
                                    <h4 className="font-heading font-semibold text-sm text-[var(--color-text)] mb-1">
                                        Không tìm thấy media phù hợp
                                    </h4>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        Hãy chuyển sang tab &quot;Tải ảnh mới&quot; để thêm ảnh lên hệ thống
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {filteredItems.map((item, idx) => {
                                        const isSelected = allowMultiple 
                                            ? selectedUrls.includes(item.url)
                                            : selectedItemUrl === item.url;
                                        const selectedIndex = allowMultiple 
                                            ? selectedUrls.indexOf(item.url) 
                                            : -1;

                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => toggleItemSelection(item.url, item)}
                                                className={`group relative rounded-xl border overflow-hidden cursor-pointer flex flex-col justify-between transition-all ${
                                                    isSelected
                                                        ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-md bg-[var(--color-primary)]/5"
                                                        : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary)]/50"
                                                }`}
                                            >
                                                {/* Thumbnail preview */}
                                                <div className="aspect-square relative overflow-hidden bg-neutral-900/10 flex items-center justify-center">
                                                    {item.type === "image" ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={item.url}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                        />
                                                    ) : (
                                                        <Film className="w-8 h-8 text-[var(--color-text-muted)]" />
                                                    )}

                                                    {/* Selection Indicator */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 p-1 rounded-full bg-[var(--color-primary)] text-white shadow-lg z-10 animate-scaleIn flex items-center justify-center min-w-[22px] min-h-[22px]">
                                                            {allowMultiple && selectedIndex >= 0 ? (
                                                                <span className="text-[11px] font-bold px-0.5 leading-none">
                                                                    {selectedIndex + 1}
                                                                </span>
                                                            ) : (
                                                                <Check className="w-3.5 h-3.5" />
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* View full lightbox button */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewIndex(idx);
                                                        }}
                                                        title="Xem ảnh toàn màn hình"
                                                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/80 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition z-10 hover:bg-orange-600 shadow-xl cursor-pointer"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 text-white" />
                                                    </button>
                                                </div>

                                                {/* File info */}
                                                <div className="p-2 space-y-0.5">
                                                    <p className="text-[11px] font-semibold text-[var(--color-text)] truncate" title={item.name}>
                                                        {item.name}
                                                    </p>
                                                    <div className="flex items-center justify-between text-[9px] text-[var(--color-text-muted)]">
                                                        <span>{item.size}</span>
                                                        {item.compressed && (
                                                            <span className="text-emerald-500 font-bold">WebP</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: UPLOAD & AUTO COMPRESSION */}
                    {activeTab === "upload" && (
                        <div className="max-w-xl mx-auto space-y-4 py-2">
                            {/* Drag & Drop Area */}
                            <label 
                                htmlFor={fileInputId}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleFileUpload}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                    isUploading 
                                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 opacity-80"
                                        : "border-[var(--color-border)] hover:border-[var(--color-primary)] bg-[var(--color-background)]/50 hover:bg-[var(--color-surface)]"
                                }`}
                            >
                                <input
                                    id={fileInputId}
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                />

                                <div className="p-3.5 rounded-xl bg-orange-500/10 text-[var(--color-primary)] mb-3">
                                    {isUploading ? (
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    ) : (
                                        <UploadCloud className="w-8 h-8" />
                                    )}
                                </div>

                                <h4 className="font-heading font-bold text-sm sm:text-base text-[var(--color-text)]">
                                    {isUploading ? "Đang xử lý nén WebP & tải lên..." : "Kéo thả nhiều ảnh vào đây hoặc bấm để chọn"}
                                </h4>
                                
                                <p className="text-xs text-[var(--color-text-muted)] mt-1.5 max-w-md">
                                    Hỗ trợ chọn <b>nhiều ảnh cùng lúc</b> (PNG, JPG, JPEG, WEBP, MP4). Toàn bộ ảnh sẽ được tự động nén tối ưu chuẩn WebP siêu nhẹ.
                                </p>

                                <div className="mt-4 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold">
                                    Chọn từ thiết bị (Hỗ trợ chọn nhiều file)
                                </div>
                            </label>

                            {/* Progress bar during multi-upload */}
                            {isUploading && uploadProgress && (
                                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2.5 animate-fadeIn">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-[var(--color-text)] flex items-center gap-2">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                                            Đang tải lên {uploadProgress.current}/{uploadProgress.total} file ({uploadProgress.percent}%)
                                        </span>
                                        <span className="text-[var(--color-text-muted)] truncate max-w-[200px]">
                                            {uploadProgress.fileName}
                                        </span>
                                    </div>
                                    <div className="w-full bg-[var(--color-background)] rounded-full h-2.5 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${Math.max(5, uploadProgress.percent)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Compression Options */}
                            <div className="bg-[var(--color-background)] p-3.5 rounded-lg border border-[var(--color-border)] space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-orange-500" />
                                        <span className="text-xs font-bold text-[var(--color-text)]">
                                            Chế độ nén & tối ưu ảnh WebP
                                        </span>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold">
                                        Tự động kích hoạt
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setCompressionQuality(0.82)}
                                        className={`p-2.5 rounded-lg border text-left transition ${
                                            compressionQuality === 0.82
                                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                                                : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                                        }`}
                                    >
                                        <div className="text-xs font-semibold">Chuẩn tối ưu (Khuyên dùng)</div>
                                        <div className="text-[10px] text-[var(--color-text-muted)]">WebP 82% - Siêu nhẹ</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCompressionQuality(0.92)}
                                        className={`p-2.5 rounded-lg border text-left transition ${
                                            compressionQuality === 0.92
                                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                                                : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                                        }`}
                                    >
                                        <div className="text-xs font-semibold">Chất lượng cao HD</div>
                                        <div className="text-[10px] text-[var(--color-text-muted)]">WebP 92% - Cực nét</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCompressionQuality(0.72)}
                                        className={`p-2.5 rounded-lg border text-left transition ${
                                            compressionQuality === 0.72
                                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                                                : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                                        }`}
                                    >
                                        <div className="text-xs font-semibold">Tối đa tốc độ</div>
                                        <div className="text-[10px] text-[var(--color-text-muted)]">WebP 72% - Siêu nhanh</div>
                                    </button>
                                </div>
                            </div>

                            {/* Errors */}
                            {uploadErrors.length > 0 && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs space-y-1">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Có lỗi xảy ra khi tải file:</span>
                                    </div>
                                    <ul className="list-disc list-inside space-y-0.5">
                                        {uploadErrors.map((err, idx) => (
                                            <li key={idx}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Batch Upload Report */}
                            {lastUploadStats && (
                                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-between text-xs animate-scaleIn">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>
                                            Đã tải lên thành công <b>{lastUploadStats.count}</b> file: <b>{formatBytes(lastUploadStats.originalSize)}</b> ➔ <b>{formatBytes(lastUploadStats.compressedSize)}</b>
                                        </span>
                                    </div>
                                    <span className="font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md text-[10px]">
                                        Tiết kiệm {lastUploadStats.ratio}%
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 3: STOCK IMAGES */}
                    {activeTab === "stock" && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                            {STOCK_IMAGES.map((img) => {
                                const isSelected = allowMultiple
                                    ? selectedUrls.includes(img.url)
                                    : selectedItemUrl === img.url;

                                return (
                                    <div
                                        key={img.url}
                                        onClick={() => {
                                            const stockItem: MediaItem = {
                                                id: `stock-${img.name}`,
                                                name: img.name,
                                                url: img.url,
                                                type: "image",
                                                size: "150 KB",
                                                uploadedAt: "Kho ảnh mẫu"
                                            };
                                            toggleItemSelection(img.url, stockItem);
                                        }}
                                        className={`group relative rounded-xl border overflow-hidden cursor-pointer flex flex-col justify-between transition-all ${
                                            isSelected
                                                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-md bg-[var(--color-primary)]/5"
                                                : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary)]/50"
                                        }`}
                                    >
                                        <div className="aspect-square relative overflow-hidden bg-neutral-900/10">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={img.url}
                                                alt={img.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 p-1 rounded-full bg-[var(--color-primary)] text-white shadow-lg z-10 animate-scaleIn">
                                                    <Check className="w-3.5 h-3.5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2 space-y-0.5">
                                            <p className="text-[11px] font-semibold text-[var(--color-text)] truncate">
                                                {img.name}
                                            </p>
                                            <span className="text-[9px] text-[var(--color-primary)] font-bold">
                                                {img.category}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {allowMultiple ? (
                            selectedUrls.length > 0 ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[var(--color-primary)] bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                                        Đã chọn {selectedUrls.length} ảnh
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xs text-[var(--color-text-muted)]">
                                    Chưa chọn ảnh nào (chọn một hoặc nhiều ảnh)
                                </span>
                            )
                        ) : selectedItemUrl ? (
                            <div className="flex items-center gap-2 min-w-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedItemUrl}
                                    alt="Selected preview"
                                    className="w-9 h-9 rounded-lg object-cover border border-[var(--color-border)] flex-shrink-0"
                                />
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold text-[var(--color-text)] block truncate">
                                        Đã chọn ảnh
                                    </span>
                                    <span className="text-[10px] text-[var(--color-text-muted)] font-mono truncate block max-w-[180px] sm:max-w-xs">
                                        {selectedItemUrl}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <span className="text-xs text-[var(--color-text-muted)]">
                                Chưa chọn ảnh nào
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary btn-sm px-4 rounded-lg"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmSelection}
                            disabled={allowMultiple ? selectedUrls.length === 0 : !selectedItemUrl}
                            className="btn btn-primary btn-sm px-4 rounded-lg flex items-center gap-1.5 shadow-sm disabled:opacity-40 disabled:pointer-events-none"
                        >
                            <Check className="w-4 h-4" />
                            <span>
                                {allowMultiple 
                                    ? `Xác nhận (${selectedUrls.length} ảnh)`
                                    : "Xác nhận chọn"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Fullscreen Lightbox Preview */}
            {previewIndex !== null && (
                <MediaLightboxModal
                    items={filteredItems}
                    initialIndex={previewIndex}
                    onClose={() => setPreviewIndex(null)}
                    onSelect={(item) => {
                        toggleItemSelection(item.url, item);
                        setPreviewIndex(null);
                    }}
                />
            )}
        </div>
    );
}
