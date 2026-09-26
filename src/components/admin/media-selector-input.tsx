"use client";

import { useState, useRef } from "react";
import { 
    Image as ImageIcon, 
    X, 
    Eye, 
    Upload, 
    Folder,
    Link as LinkIcon,
    Loader2,
    Sparkles
} from "lucide-react";
import { MediaPickerModal } from "./media-picker-modal";
import { MediaLightboxModal } from "./media-lightbox-modal";
import { MediaItem } from "@/lib/media-store";
import { compressImage } from "@/lib/image-compressor";

interface MediaSelectorInputProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    description?: string;
    placeholder?: string;
    aspectRatio?: "square" | "video" | "wide" | "portrait";
    required?: boolean;
    mediaType?: "image" | "video" | "all";
}

export function MediaSelectorInput({
    value,
    onChange,
    label,
    description,
    placeholder,
    aspectRatio = "video",
    required = false,
    mediaType = "image"
}: MediaSelectorInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerTab, setPickerTab] = useState<"library" | "upload" | "stock">("library");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const isVideoMode = mediaType === "video";
    const defaultPlaceholder = isVideoMode 
        ? "Dán link Cloudflare R2 (https://...r2.dev/video.mp4), YouTube hoặc video MP4/WebM..."
        : "Chọn ảnh từ thư viện hoặc dán link URL...";

    const aspectClasses = {
        square: "aspect-square w-16 h-16 sm:w-20 sm:h-20",
        video: "aspect-video w-28 h-16 sm:w-32 sm:h-20",
        wide: "aspect-[21/9] w-36 h-16 sm:w-40 sm:h-18",
        portrait: "aspect-[3/4] w-16 h-20 sm:w-18 sm:h-24"
    }[aspectRatio];

    const hasMedia = Boolean(value && value.trim());

    // YouTube thumbnail detection
    const ytMatch = value ? value.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i) : null;
    const youtubeThumbnail = ytMatch && ytMatch[1] ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : null;
    const isDirectVideo = value && (
        value.match(/\.(mp4|webm|ogg|mov|m4v|m3u8)($|\?)/i) || 
        value.includes('.r2.dev') || 
        value.includes('.r2.cloudflarestorage.com') ||
        value.startsWith("data:video/")
    );

    const mediaItemForLightbox: MediaItem = {
        id: "preview-single",
        name: label || "Xem trước media",
        url: value,
        type: isVideoMode || ytMatch || isDirectVideo ? "video" : "image",
        size: "Hiện tại",
        uploadedAt: new Date().toISOString().split("T")[0]
    };

    // Direct file upload handler
    const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            let uploadBody: FormData;

            if (!isVideoMode && file.type.startsWith("image/")) {
                const result = await compressImage(file, {
                    maxWidth: 1920,
                    maxHeight: 1920,
                    quality: 0.85,
                    format: "image/webp"
                });

                const webpFile = new File(
                    [result.file],
                    file.name.replace(/\.[^/.]+$/, ".webp"),
                    { type: "image/webp" }
                );

                const formData = new FormData();
                formData.append("file", webpFile);
                uploadBody = formData;
            } else {
                const formData = new FormData();
                formData.append("file", file);
                uploadBody = formData;
            }

            const res = await fetch("/api/cms/upload", {
                method: "POST",
                body: uploadBody
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Tải file lên thất bại");
            }

            const data = await res.json();
            const uploadedUrl = data.url || (data.item && data.item.url);

            if (uploadedUrl) {
                onChange(uploadedUrl);

                if (data.item) {
                    try {
                        const stored = localStorage.getItem("admin_media_extended");
                        const current = stored ? JSON.parse(stored) : [];
                        localStorage.setItem("admin_media_extended", JSON.stringify([data.item, ...current]));
                    } catch {}
                }
            }
        } catch (err: any) {
            setUploadError(err.message || "Lỗi tải ảnh");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="space-y-1.5 min-w-0 w-full">
            {label && (
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                </div>
            )}

            {description && (
                <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">{description}</p>
            )}

            <div className="p-3 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] space-y-2.5 min-w-0 w-full overflow-hidden">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail Preview Area */}
                    <div 
                        onClick={() => hasMedia ? setLightboxOpen(true) : setPickerOpen(true)}
                        className={`${aspectClasses} relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden flex items-center justify-center cursor-pointer group flex-shrink-0 hover:border-[var(--color-primary)] transition shadow-xs`}
                    >
                        {hasMedia ? (
                            <>
                                {youtubeThumbnail ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={youtubeThumbnail}
                                            alt={label || "YouTube Video"}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                                                <span className="text-[10px] font-bold">▶</span>
                                            </div>
                                        </div>
                                    </>
                                ) : isDirectVideo ? (
                                    <div className="w-full h-full relative flex items-center justify-center bg-black/90">
                                        <video src={value} className="w-full h-full object-cover" preload="metadata" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                                                <span className="text-[10px] font-bold">▶</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={value}
                                            alt={label || "Preview"}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                                            <div className="p-1 rounded-lg bg-black/80 border border-white/20 text-white shadow-md">
                                                <Eye className="w-3.5 h-3.5 text-orange-400" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-1 text-[var(--color-text-muted)] p-2 text-center">
                                {isUploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-[var(--color-primary)]" />
                                ) : isVideoMode ? (
                                    <>
                                        <span className="text-base opacity-40">🎬</span>
                                        <span className="text-[9px] font-medium">Chưa có video</span>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-5 h-5 opacity-40 group-hover:text-[var(--color-primary)] group-hover:opacity-100 transition" />
                                        <span className="text-[9px] font-medium">Chưa có ảnh</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Option 1: Tải ảnh lên */}
                            <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => fileInputRef.current?.click()}
                                className="btn btn-primary btn-xs px-2.5 py-1 text-xs flex items-center gap-1.5 shadow-xs rounded-lg flex-shrink-0 disabled:opacity-50 cursor-pointer"
                                title={isVideoMode ? "Tải video trực tiếp từ máy tính" : "Tải ảnh trực tiếp từ máy tính"}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Đang tải lên...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>{isVideoMode ? "Tải video lên" : "Tải ảnh lên"}</span>
                                    </>
                                )}
                            </button>

                            {/* Hidden file input for native file dialog */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={isVideoMode ? "video/*" : "image/*"}
                                onChange={handleDirectFileUpload}
                                className="hidden"
                            />

                            {/* Option 2: Chọn từ kho media */}
                            <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => {
                                    setPickerTab("library");
                                    setPickerOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] text-xs flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer font-medium"
                                title="Chọn ảnh có sẵn từ Thư viện Media"
                            >
                                <Folder className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                <span>Kho Media</span>
                            </button>

                            {/* Option 3: Dán link */}
                            <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => setShowManualInput(!showManualInput)}
                                className={`px-2 py-1 rounded-lg border text-xs flex items-center gap-1 transition flex-shrink-0 ${
                                    showManualInput 
                                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                                        : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                                }`}
                                title="Nhập URL trực tiếp hoặc link YouTube/R2"
                            >
                                <LinkIcon className="w-3 h-3" />
                                <span>{showManualInput ? "Đóng URL" : "Dán link"}</span>
                            </button>

                            {/* Preview & Delete buttons */}
                            {hasMedia && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setLightboxOpen(true)}
                                        className="p-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition flex-shrink-0"
                                        title="Xem to toàn màn hình"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onChange("")}
                                        className="p-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition flex-shrink-0"
                                        title="Xóa media này"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {uploadError && (
                            <p className="text-[11px] text-rose-500 font-medium">{uploadError}</p>
                        )}

                        {/* File path display badge with guaranteed truncation */}
                        {hasMedia && !showManualInput && (
                            <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-1 rounded-md border border-[var(--color-border)] min-w-0 w-full overflow-hidden">
                                <span className="font-mono truncate w-full block" title={value}>
                                    {value}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Manual Direct Input (if toggled) */}
                {showManualInput && (
                    <div className="relative animate-fadeIn pt-1 border-t border-[var(--color-border)]/60 min-w-0 w-full">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder || defaultPlaceholder}
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs font-mono text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                            autoFocus
                        />
                    </div>
                )}
            </div>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(url) => onChange(url)}
                selectedUrl={value}
                allowedType={isVideoMode ? "all" : "image"}
                initialTab={pickerTab}
                title={label ? `Chọn file: ${label}` : (isVideoMode ? "Chọn video từ Thư viện" : "Chọn ảnh từ Thư viện")}
            />

            {/* Lightbox Modal */}
            {lightboxOpen && hasMedia && (
                <MediaLightboxModal
                    items={[mediaItemForLightbox]}
                    initialIndex={0}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </div>
    );
}
