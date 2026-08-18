"use client";

import { useEffect, useState } from "react";
import { 
    X, 
    Search, 
    UploadCloud, 
    Image as ImageIcon, 
    Sparkles, 
    Check, 
    Folder, 
    Film, 
    Plus,
    CheckCircle2,
    Eye
} from "lucide-react";
import { MediaItem, DEFAULT_MEDIA_ITEMS, STOCK_IMAGES } from "@/lib/media-store";
import { compressImage, formatBytes } from "@/lib/image-compressor";
import { MediaLightboxModal } from "./media-lightbox-modal";

interface MediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string, item?: MediaItem) => void;
    selectedUrl?: string;
    title?: string;
    allowedType?: "all" | "image" | "video";
}

export function MediaPickerModal({
    isOpen,
    onClose,
    onSelect,
    selectedUrl,
    title = "Chọn ảnh từ Thư viện Media",
    allowedType = "image"
}: MediaPickerModalProps) {
    const [activeTab, setActiveTab] = useState<"library" | "upload" | "stock">("library");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItemUrl, setSelectedItemUrl] = useState<string>(selectedUrl || "");
    const [currentSelectedItem, setCurrentSelectedItem] = useState<MediaItem | null>(null);

    // Upload & compression states
    const [isUploading, setIsUploading] = useState(false);
    const [compressionQuality, setCompressionQuality] = useState<number>(0.82);
    const [lastCompressedInfo, setLastCompressedInfo] = useState<{
        orig: string;
        comp: string;
        ratio: number;
    } | null>(null);

    // Lightbox preview state
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    // Load media from API / LocalStorage
    useEffect(() => {
        if (!isOpen) return;

        const loadMedia = async () => {
            // First check local storage
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

            // Sync with backend API
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let files: FileList | null = null;
        if ("dataTransfer" in e) {
            e.preventDefault();
            files = e.dataTransfer.files;
        } else if (e.target.files) {
            files = e.target.files;
        }

        if (!files || files.length === 0) return;
        const file = files[0];
        setIsUploading(true);

        try {
            const isVideo = file.type.startsWith("video/");
            let finalUrl = "";
            let finalSize = `${(file.size / 1024).toFixed(0)} KB`;
            let isCompressed = false;
            let originalSizeStr = `${(file.size / 1024).toFixed(0)} KB`;
            let sizeInBytes = file.size;
            let dimensionsStr = "";

            if (!isVideo && file.type.startsWith("image/")) {
                // Perform smart compression
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

                setLastCompressedInfo({
                    orig: formatBytes(result.originalSize),
                    comp: formatBytes(result.compressedSize),
                    ratio: result.compressionRatio
                });
            } else {
                // Video read as base64
                const reader = new FileReader();
                finalUrl = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            }

            const newItem: MediaItem = {
                id: `m-${Date.now()}`,
                name: file.name.replace(/\.[^/.]+$/, "") + (isCompressed ? ".webp" : ""),
                url: finalUrl,
                type: isVideo ? "video" : "image",
                size: finalSize,
                sizeBytes: sizeInBytes,
                dimensions: dimensionsStr,
                uploadedAt: new Date().toISOString().split("T")[0],
                compressed: isCompressed,
                originalSize: isCompressed ? originalSizeStr : undefined
            };

            const updatedList = [newItem, ...mediaItems];
            setMediaItems(updatedList);
            localStorage.setItem("admin_media_extended", JSON.stringify(updatedList));

            // Legacy sync
            const legacyUrls = updatedList.map(item => item.url);
            localStorage.setItem("admin_media", JSON.stringify(legacyUrls));

            // Sync API
            fetch("/api/cms/media", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item: newItem })
            }).catch(() => {});

            // Auto select newly uploaded file
            setSelectedItemUrl(newItem.url);
            setCurrentSelectedItem(newItem);
            setActiveTab("library");
        } catch (err) {
            console.error("Upload error:", err);
            alert("Có lỗi xảy ra khi xử lý file ảnh.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleConfirmSelection = () => {
        if (selectedItemUrl) {
            onSelect(selectedItemUrl, currentSelectedItem || undefined);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-[var(--color-primary)]">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-base text-[var(--color-text)]">
                                {title}
                            </h3>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                Chọn ảnh có sẵn hoặc tải ảnh mới lên (tự động nén WebP siêu nhẹ)
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-text)] transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs & Search Bar */}
                <div className="px-6 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-background)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 bg-[var(--color-surface)] p-1 rounded-lg border border-[var(--color-border)]">
                        <button
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
                            onClick={() => setActiveTab("upload")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                                activeTab === "upload"
                                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Tải ảnh mới</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("stock")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                                activeTab === "stock"
                                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ảnh mẫu có sẵn</span>
                        </button>
                    </div>

                    {/* Search inside library */}
                    {activeTab === "library" && (
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tập tin..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                            />
                        </div>
                    )}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-[350px] max-h-[500px]">
                    {/* TAB 1: LIBRARY */}
                    {activeTab === "library" && (
                        <div>
                            {filteredItems.length === 0 ? (
                                <div className="text-center py-16 space-y-3">
                                    <ImageIcon className="w-12 h-12 text-[var(--color-text-muted)] mx-auto opacity-40" />
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        Chưa có tập tin nào phù hợp. Hãy chuyển sang tab Tải ảnh mới hoặc Ảnh mẫu.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                                    {filteredItems.map((item, idx) => {
                                        const isSelected = selectedItemUrl === item.url;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => {
                                                    setSelectedItemUrl(item.url);
                                                    setCurrentSelectedItem(item);
                                                }}
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

                                                    {/* Selected overlay */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 p-1 rounded-full bg-[var(--color-primary)] text-white shadow-lg z-10 animate-scaleIn">
                                                            <Check className="w-3.5 h-3.5" />
                                                        </div>
                                                    )}

                                                    {/* View full lightbox button */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewIndex(idx);
                                                        }}
                                                        title="Xem to toàn màn hình"
                                                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/85 text-white border border-white/30 opacity-0 group-hover:opacity-100 transition z-10 hover:bg-orange-600 hover:border-orange-500 shadow-xl cursor-pointer"
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
                        <div className="max-w-xl mx-auto space-y-5 py-3">
                            {/* Drag & Drop Area */}
                            <label 
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleFileUpload}
                                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                    isUploading 
                                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 opacity-70"
                                        : "border-[var(--color-border)] hover:border-[var(--color-primary)] bg-[var(--color-background)]/50"
                                }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                />

                                <div className="p-3 rounded-lg bg-orange-500/10 text-[var(--color-primary)] mb-2.5">
                                    <UploadCloud className="w-7 h-7" />
                                </div>
                                <h4 className="font-heading font-bold text-sm text-[var(--color-text)]">
                                    {isUploading ? "Đang xử lý & nén ảnh WebP..." : "Kéo thả ảnh vào đây hoặc bấm để chọn"}
                                </h4>
                                <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm">
                                    Hỗ trợ PNG, JPG, JPEG, WEBP. Ảnh sẽ được tự động nén và tối ưu chuẩn WebP trước khi lưu.
                                </p>
                            </label>

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

                                {/* Last Compression Report */}
                                {lastCompressedInfo && (
                                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span>
                                                Đã nén từ <b>{lastCompressedInfo.orig}</b> xuống <b>{lastCompressedInfo.comp}</b>
                                            </span>
                                        </div>
                                        <span className="font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md text-[10px]">
                                            Tiết kiệm {lastCompressedInfo.ratio}% dung lượng
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: STOCK IMAGES */}
                    {activeTab === "stock" && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                            {STOCK_IMAGES.map((img) => {
                                const isSelected = selectedItemUrl === img.url;
                                return (
                                    <div
                                        key={img.url}
                                        onClick={() => {
                                            setSelectedItemUrl(img.url);
                                            setCurrentSelectedItem({
                                                id: `stock-${img.name}`,
                                                name: img.name,
                                                url: img.url,
                                                type: "image",
                                                size: "150 KB",
                                                uploadedAt: "Kho ảnh mẫu"
                                            });
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
                <div className="px-6 py-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {selectedItemUrl ? (
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
                                    <span className="text-[10px] text-[var(--color-text-muted)] font-mono truncate block max-w-[200px] sm:max-w-xs">
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
                            disabled={!selectedItemUrl}
                            className="btn btn-primary btn-sm px-4 rounded-lg flex items-center gap-1.5 shadow-sm disabled:opacity-40 disabled:pointer-events-none"
                        >
                            <Check className="w-4 h-4" />
                            <span>Xác nhận chọn</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Fullscreen Lightbox Preview if opened from picker */}
            {previewIndex !== null && (
                <MediaLightboxModal
                    items={filteredItems}
                    initialIndex={previewIndex}
                    onClose={() => setPreviewIndex(null)}
                    onSelect={(item) => {
                        setSelectedItemUrl(item.url);
                        setCurrentSelectedItem(item);
                        setPreviewIndex(null);
                    }}
                />
            )}
        </div>
    );
}
