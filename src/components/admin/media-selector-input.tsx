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
}

export function MediaSelectorInput({
    value,
    onChange,
    label,
    description,
    placeholder = "Chọn ảnh từ thư viện hoặc dán link URL...",
    aspectRatio = "video",
    required = false
}: MediaSelectorInputProps) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);

    const aspectClasses = {
        square: "aspect-square w-24 h-24",
        video: "aspect-video w-40 h-24",
        wide: "aspect-[21/9] w-48 h-20",
        portrait: "aspect-[3/4] w-20 h-28"
    }[aspectRatio];

    const hasImage = Boolean(value && value.trim());

    const mediaItemForLightbox: MediaItem = {
        id: "preview-single",
        name: label || "Xem trước ảnh",
        url: value,
        type: "image",
        size: "Hiện tại",
        uploadedAt: new Date().toISOString().split("T")[0]
    };

    return (
        <div className="space-y-2">
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
                        <span>{showManualInput ? "Ẩn URL trực tiếp" : "Nhập URL trực tiếp"}</span>
                    </button>
                </div>
            )}

            {description && (
                <p className="text-[11px] text-[var(--color-text-muted)]">{description}</p>
            )}

            <div className="flex flex-col sm:flex-row items-start gap-3.5 p-3 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]">
                {/* Thumbnail Preview Area */}
                <div 
                    onClick={() => hasImage ? setLightboxOpen(true) : setPickerOpen(true)}
                    className={`${aspectClasses} relative rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden flex items-center justify-center cursor-pointer group flex-shrink-0 hover:border-[var(--color-primary)] transition shadow-sm`}
                >
                    {hasImage ? (
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
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-1 text-[var(--color-text-muted)] p-2 text-center">
                            <ImageIcon className="w-6 h-6 opacity-40 group-hover:text-[var(--color-primary)] group-hover:opacity-100 transition" />
                            <span className="text-[9px] font-medium">Chưa có ảnh</span>
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
                            <span>{hasImage ? "Đổi ảnh từ Thư viện" : "Chọn từ Thư viện Media"}</span>
                        </button>

                        {hasImage && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setLightboxOpen(true)}
                                    className="p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] text-xs flex items-center gap-1 px-2.5 transition"
                                    title="Xem kích thước lớn & phóng to"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Xem to</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChange("")}
                                    className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs flex items-center gap-1 px-2.5 transition"
                                    title="Xóa ảnh"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Xóa ảnh</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Manual Direct Input (if toggled) */}
                    {showManualInput && (
                        <div className="relative animate-fadeIn">
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg pl-3 pr-3 py-1.5 text-xs font-mono text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                            />
                        </div>
                    )}

                    {hasImage && !showManualInput && (
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
                title={label ? `Chọn ảnh: ${label}` : "Chọn ảnh từ Thư viện"}
            />

            {/* Lightbox Modal */}
            {lightboxOpen && hasImage && (
                <MediaLightboxModal
                    items={[mediaItemForLightbox]}
                    initialIndex={0}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </div>
    );
}
