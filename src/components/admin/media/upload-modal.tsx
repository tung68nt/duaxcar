"use client";

/**
 * Upload Modal Component
 *
 * Sử dụng Portal-based Modal để tránh lỗi unmount khi mở file picker.
 * Hỗ trợ drag & drop, compression quality selection, upload progress.
 */
import { useState, useCallback, useRef } from "react";
import {
    UploadCloud,
    Sparkles,
    CheckCircle2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { compressImage, formatBytes } from "@/lib/image-compressor";
import type { MediaItem } from "@/lib/media-store";

interface UploadStats {
    count: number;
    originalSize: number;
    compressedSize: number;
    ratio: number;
}

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete: (newItems: MediaItem[]) => void;
}

type CompressionQuality = 0.72 | 0.82 | 0.92;

const QUALITY_OPTIONS: { value: CompressionQuality; label: string; sublabel: string }[] = [
    { value: 0.82, label: "Chuẩn tối ưu", sublabel: "WebP 82% (Khuyên dùng)" },
    { value: 0.92, label: "Chất lượng cao HD", sublabel: "WebP 92% (Sắc nét)" },
    { value: 0.72, label: "Siêu nhẹ", sublabel: "WebP 72% (Tải nhanh)" },
];

const MAX_FILE_SIZE_IMAGE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE_VIDEO = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [compressionQuality, setCompressionQuality] = useState<CompressionQuality>(0.82);
    const [lastUploadStats, setLastUploadStats] = useState<UploadStats | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback((file: File): string | null => {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isImage && !isVideo) {
            return `"${file.name}" không phải file ảnh hoặc video hợp lệ.`;
        }

        if (isImage && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return `"${file.name}" — Định dạng ảnh không được hỗ trợ. Chấp nhận: JPG, PNG, WebP, GIF, SVG.`;
        }

        if (isVideo && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
            return `"${file.name}" — Định dạng video không được hỗ trợ. Chấp nhận: MP4, WebM, MOV.`;
        }

        const maxSize = isVideo ? MAX_FILE_SIZE_VIDEO : MAX_FILE_SIZE_IMAGE;
        if (file.size > maxSize) {
            const limitStr = isVideo ? "50MB" : "5MB";
            return `"${file.name}" vượt quá giới hạn ${limitStr} (${formatBytes(file.size)}).`;
        }

        return null;
    }, []);

    const handleFilesUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);
        setUploadError(null);

        const newItems: MediaItem[] = [];
        const errors: string[] = [];
        let totalOrigBytes = 0;
        let totalCompBytes = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validate file
            const validationError = validateFile(file);
            if (validationError) {
                errors.push(validationError);
                continue;
            }

            const isVideo = file.type.startsWith("video/");

            try {
                let uploadBody: FormData | string;
                let uploadHeaders: Record<string, string> = {};
                let sizeInBytes = file.size;
                let dimensionsStr = "";
                let isCompressed = false;
                let originalSizeStr = formatBytes(file.size);

                if (!isVideo && file.type.startsWith("image/")) {
                    // Compress image to WebP
                    const result = await compressImage(file, {
                        maxWidth: 1920,
                        maxHeight: 1920,
                        quality: compressionQuality,
                        format: "image/webp",
                    });

                    sizeInBytes = result.compressedSize;
                    dimensionsStr = `${result.width}x${result.height}`;
                    isCompressed = true;
                    totalOrigBytes += result.originalSize;
                    totalCompBytes += result.compressedSize;

                    // Send as multipart form data for better reliability
                    const formData = new FormData();
                    const webpFile = new File(
                        [result.file],
                        file.name.replace(/\.[^/.]+$/, ".webp"),
                        { type: "image/webp" }
                    );
                    formData.append("file", webpFile);
                    uploadBody = formData as any;
                } else {
                    // Video — send as-is via FormData
                    const formData = new FormData();
                    formData.append("file", file);
                    uploadBody = formData as any;
                    totalOrigBytes += file.size;
                    totalCompBytes += file.size;
                }

                // Upload to server
                const uploadRes = await fetch("/api/cms/upload", {
                    method: "POST",
                    body: uploadBody as any,
                });

                if (!uploadRes.ok) {
                    const errData = await uploadRes.json().catch(() => ({}));
                    errors.push(`Upload "${file.name}" thất bại: ${errData.error || uploadRes.statusText}`);
                    continue;
                }

                const uploadData = await uploadRes.json();
                const finalUrl = uploadData.url || uploadData.item?.url || "";

                newItems.push({
                    id: uploadData.item?.id || `m-${Date.now()}-${i}`,
                    name: file.name.replace(/\.[^/.]+$/, "") + (isCompressed ? ".webp" : ""),
                    url: finalUrl,
                    type: isVideo ? "video" : "image",
                    size: formatBytes(sizeInBytes),
                    sizeBytes: sizeInBytes,
                    dimensions: dimensionsStr || (isVideo ? "Video HD" : "Ảnh HD"),
                    uploadedAt: new Date().toISOString().split("T")[0],
                    compressed: isCompressed,
                    originalSize: isCompressed ? originalSizeStr : undefined,
                });
            } catch (err) {
                console.error("Error processing file:", file.name, err);
                errors.push(`Lỗi xử lý "${file.name}": ${err instanceof Error ? err.message : "Unknown error"}`);
            }
        }

        if (errors.length > 0) {
            setUploadError(errors.join("\n"));
        }

        if (newItems.length > 0) {
            const savedBytes = totalOrigBytes - totalCompBytes;
            const ratio =
                totalOrigBytes > 0
                    ? Math.max(0, Math.round((savedBytes / totalOrigBytes) * 1000) / 10)
                    : 0;

            setLastUploadStats({
                count: newItems.length,
                originalSize: totalOrigBytes,
                compressedSize: totalCompBytes,
                ratio,
            });

            // Notify parent — parent handles cache invalidation
            onUploadComplete(newItems);
        }

        setIsUploading(false);

        // Reset file input so same file can be re-selected
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [compressionQuality, onUploadComplete, validateFile]);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            handleFilesUpload(e.dataTransfer.files);
        },
        [handleFilesUpload]
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tải Tập Tin Lên & Nén Ảnh Thông Minh"
            titleIcon={<UploadCloud className="w-5 h-5" />}
        >
            <div className="space-y-5">
                {/* Drag & Drop Area */}
                <label
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-[var(--color-background)]/50 transition-all"
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm"
                        multiple
                        onChange={(e) => handleFilesUpload(e.target.files)}
                        disabled={isUploading}
                        className="hidden"
                    />
                    <div className="p-3 rounded-lg bg-orange-500/10 text-[var(--color-primary)] mb-2.5">
                        <UploadCloud className="w-6 h-6" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-[var(--color-text)]">
                        {isUploading
                            ? "Đang xử lý nén WebP & lưu trữ..."
                            : "Chọn hoặc kéo thả tập tin vào đây"}
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-xs">
                        Ảnh: JPG, PNG, WebP, GIF (tối đa 5MB). Video: MP4, WebM (tối đa 50MB).
                        Tự động nén WebP siêu nhẹ.
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
                        {QUALITY_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setCompressionQuality(opt.value)}
                                className={`p-2.5 rounded-lg border text-left text-xs transition ${
                                    compressionQuality === opt.value
                                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                                        : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                                }`}
                            >
                                <div>{opt.label}</div>
                                <div className="text-[10px] text-[var(--color-text-muted)]">
                                    {opt.sublabel}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upload Error */}
                {uploadError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs whitespace-pre-line">
                        {uploadError}
                    </div>
                )}

                {/* Last Upload Report */}
                {lastUploadStats && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-between text-xs animate-scaleIn">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>
                                Đã tải lên <b>{lastUploadStats.count}</b> file:{" "}
                                <b>{formatBytes(lastUploadStats.originalSize)}</b> →{" "}
                                <b>{formatBytes(lastUploadStats.compressedSize)}</b>
                            </span>
                        </div>
                        <span className="font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md text-[10px]">
                            Tiết kiệm {lastUploadStats.ratio}%
                        </span>
                    </div>
                )}

                <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary btn-sm px-5"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </Modal>
    );
}
