/**
 * Image Compressor & Optimization Utility
 * Automatically resizes and compresses images to modern WebP format
 * Drastically reduces file size while preserving visual quality.
 */

export interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0.1 to 1.0 (default: 0.82)
    format?: "image/webp" | "image/jpeg" | "image/png";
}

export interface CompressionResult {
    file: File | Blob;
    base64: string;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number; // percentage saved, e.g. 85.5
    width: number;
    height: number;
    format: string;
}

/**
 * Formats bytes into human-readable string (e.g. 1.25 MB, 340 KB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Parses size string like "156 KB" or "2.4 MB" to bytes
 */
export function parseSizeToBytes(sizeStr: string): number {
    if (!sizeStr || sizeStr === "Tùy chọn") return 150 * 1024;
    const clean = sizeStr.trim().toUpperCase();
    if (clean.endsWith("MB")) {
        const num = parseFloat(clean.replace("MB", "").trim());
        return isNaN(num) ? 0 : num * 1024 * 1024;
    }
    if (clean.endsWith("KB")) {
        const num = parseFloat(clean.replace("KB", "").trim());
        return isNaN(num) ? 0 : num * 1024;
    }
    if (clean.endsWith("B")) {
        const num = parseFloat(clean.replace("B", "").trim());
        return isNaN(num) ? 0 : num;
    }
    const fallback = parseFloat(clean);
    return isNaN(fallback) ? 0 : fallback * 1024;
}

/**
 * Compresses an image file (File or Blob) using Canvas API
 */
export async function compressImage(
    file: File | Blob,
    options: CompressionOptions = {}
): Promise<CompressionResult> {
    const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 0.82,
        format = "image/webp"
    } = options;

    return new Promise((resolve, reject) => {
        // If it's a gif or svg, or not an image, resolve with original
        if (file.type === "image/svg+xml" || file.type === "image/gif") {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                resolve({
                    file,
                    base64,
                    originalSize: file.size,
                    compressedSize: file.size,
                    compressionRatio: 0,
                    width: 0,
                    height: 0,
                    format: file.type
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate aspect ratio preserving dimensions
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Unable to create canvas 2d context"));
                    return;
                }

                // Enable high quality rendering
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Convert canvas to blob & base64
                // WebP is widely supported in modern browsers
                const targetFormat = format;
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Image compression failed"));
                            return;
                        }

                        const base64 = canvas.toDataURL(targetFormat, quality);
                        const originalSize = file.size;
                        const compressedSize = blob.size;
                        const savedBytes = originalSize - compressedSize;
                        const compressionRatio = originalSize > 0 
                            ? Math.max(0, Math.round((savedBytes / originalSize) * 1000) / 10) 
                            : 0;

                        resolve({
                            file: blob,
                            base64,
                            originalSize,
                            compressedSize,
                            compressionRatio,
                            width,
                            height,
                            format: targetFormat
                        });
                    },
                    targetFormat,
                    quality
                );
            };

            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}
