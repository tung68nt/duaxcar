"use client";

import { useState } from "react";
import { 
    Image as ImageIcon, 
    X, 
    Eye, 
    Upload, 
    Link as LinkIcon,
    Sparkles
} from "lucide-react";
import { MediaPickerModal } from "./media-picker-modal";
import { MediaLightboxModal } from "./media-lightbox-modal";
import { MediaItem } from "@/lib/media-store";

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
    const [pickerOpen, setPickerOpen] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);

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

    return (
        <div className="space-y-1.5">
            {label && (
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowManualInput(!showManualInput)}
                        className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center gap-1 transition"
                    >
                        <LinkIcon className="w-3 h-3" />
                        <span>{showManualInput ? "Ẩn nhập link URL" : "Nhập link URL / YouTube"}</span>
                    </button>
                </div>
            )}

            {description && (
                <p className="text-[10px] text-[var(--color-text-muted)]">{description}</p>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 p-2 sm:p-2.5 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
                {/* Thumbnail Preview Area */}
                <div 
                    onClick={() => hasMedia ? setLightboxOpen(true) : setPickerOpen(true)}
                    className={`${aspectClasses} relative rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden flex items-center justify-center cursor-pointer group flex-shrink-0 hover:border-[var(--color-primary)] transition shadow-sm`}
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
                                        <div className="p-1.5 rounded-lg bg-black/80 border border-white/20 text-white">
                                            <Eye className="w-4 h-4 text-orange-400" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-1 text-[var(--color-text-muted)] p-2 text-center">
                            {isVideoMode ? (
                                <>
                                    <span className="text-lg opacity-40">🎬</span>
                                    <span className="text-[9px] font-medium">Chưa có video</span>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="w-6 h-6 opacity-40 group-hover:text-[var(--color-primary)] group-hover:opacity-100 transition" />
                                    <span className="text-[9px] font-medium">Chưa có ảnh</span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons & Info */}
                <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPickerOpen(true)}
                            className="btn btn-primary btn-sm px-3 py-1.5 text-xs flex items-center gap-1.5 shadow-sm rounded-lg"
                        >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>
                                {hasMedia 
                                    ? (isVideoMode ? "Đổi video từ Thư viện" : "Đổi ảnh từ Thư viện") 
                                    : (isVideoMode ? "Chọn video từ Media" : "Chọn từ Thư viện Media")}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowManualInput(!showManualInput)}
                            className="p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] text-xs flex items-center gap-1 px-2.5 transition"
                            title="Nhập URL trực tiếp hoặc link YouTube"
                        >
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>{showManualInput ? "Đóng ô URL" : (isVideoMode ? "Dán link YouTube / MP4" : "Dán link URL")}</span>
                        </button>

                        {hasMedia && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setLightboxOpen(true)}
                                    className="p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] text-xs flex items-center gap-1 px-2.5 transition"
                                    title="Xem xem trước"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Xem thử</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChange("")}
                                    className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs flex items-center gap-1 px-2.5 transition"
                                    title="Xóa"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Xóa</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Manual Direct Input (if toggled or no media in video mode) */}
                    {showManualInput && (
                        <div className="relative animate-fadeIn">
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={placeholder || defaultPlaceholder}
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg pl-3 pr-3 py-1.5 text-xs font-mono text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                            />
                        </div>
                    )}

                    {hasMedia && !showManualInput && (
                        <p className="text-[10px] font-mono text-[var(--color-text-muted)] truncate max-w-sm">
                            {value}
                        </p>
                    )}
                </div>
            </div>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(url) => onChange(url)}
                selectedUrl={value}
                allowedType={isVideoMode ? "all" : "image"}
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
