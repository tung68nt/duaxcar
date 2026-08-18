"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { 
    X, 
    ZoomIn, 
    ZoomOut, 
    RotateCw, 
    Maximize, 
    Minimize, 
    ChevronLeft, 
    ChevronRight, 
    Copy, 
    Check, 
    Trash2, 
    Download, 
    FileImage, 
    Film, 
    Sparkles, 
    RefreshCw
} from "lucide-react";
import { MediaItem } from "@/lib/media-store";

interface MediaLightboxModalProps {
    items: MediaItem[];
    initialIndex?: number;
    onClose: () => void;
    onDelete?: (id: string) => void;
    onSelect?: (item: MediaItem) => void;
}

export function MediaLightboxModal({
    items,
    initialIndex = 0,
    onClose,
    onDelete,
    onSelect
}: MediaLightboxModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const thumbnailStripRef = useRef<HTMLDivElement>(null);

    const currentItem = items[currentIndex] || items[0];

    // Reset zoom and pan when changing item
    const resetTransform = useCallback(() => {
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
    }, []);

    const goToIndex = useCallback((index: number) => {
        if (index >= 0 && index < items.length) {
            setCurrentIndex(index);
            resetTransform();
        }
    }, [items.length, resetTransform]);

    const goNext = useCallback(() => {
        if (currentIndex < items.length - 1) {
            goToIndex(currentIndex + 1);
        } else {
            goToIndex(0); // loop
        }
    }, [currentIndex, items.length, goToIndex]);

    const goPrev = useCallback(() => {
        if (currentIndex > 0) {
            goToIndex(currentIndex - 1);
        } else {
            goToIndex(items.length - 1); // loop
        }
    }, [currentIndex, items.length, goToIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowRight") {
                goNext();
            } else if (e.key === "ArrowLeft") {
                goPrev();
            } else if (e.key === "+" || e.key === "=") {
                setZoom(z => Math.min(4, Math.round((z + 0.25) * 100) / 100));
            } else if (e.key === "-") {
                setZoom(z => Math.max(0.5, Math.round((z - 0.25) * 100) / 100));
            } else if (e.key === "0") {
                resetTransform();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, goNext, goPrev, resetTransform]);

    // Auto scroll active thumbnail into view
    useEffect(() => {
        if (thumbnailStripRef.current) {
            const activeThumb = thumbnailStripRef.current.children[currentIndex] as HTMLElement;
            if (activeThumb) {
                activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }
        }
    }, [currentIndex]);

    // Pan handling
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Zoom controls
    const zoomIn = () => setZoom(z => Math.min(4, Math.round((z + 0.25) * 100) / 100));
    const zoomOut = () => setZoom(z => Math.max(0.5, Math.round((z - 0.25) * 100) / 100));
    const rotate = () => setRotation(r => (r + 90) % 360);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    const copyUrl = () => {
        if (currentItem) {
            navigator.clipboard.writeText(currentItem.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        if (!currentItem) return;
        const link = document.createElement("a");
        link.href = currentItem.url;
        link.download = currentItem.name || "media-file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!currentItem) return null;

    return (
        <div 
            ref={containerRef}
            style={{ backgroundColor: "#09090b", color: "#ffffff" }}
            className="fixed inset-0 z-50 flex flex-col select-none animate-fadeIn font-sans"
            onMouseUp={handleMouseUp}
        >
            {/* Top Navigation Bar */}
            <div 
                style={{ backgroundColor: "#141418", borderColor: "rgba(255,255,255,0.12)" }}
                className="h-16 border-b px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 flex-shrink-0">
                        {currentItem.type === "image" ? <FileImage className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm font-bold truncate text-white max-w-[200px] sm:max-w-md" title={currentItem.name}>
                            {currentItem.name}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-neutral-300">
                            <span className="font-semibold text-white">{currentIndex + 1} / {items.length}</span>
                            <span>•</span>
                            <span className="font-mono text-neutral-300">{currentItem.size}</span>
                            {currentItem.compressed && (
                                <>
                                    <span>•</span>
                                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> WebP
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Toolbar buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {currentItem.type === "image" && (
                        <>
                            <button
                                onClick={zoomOut}
                                title="Thu nhỏ (-)"
                                disabled={zoom <= 0.5}
                                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-mono font-bold px-1.5 text-orange-400 min-w-[42px] text-center hidden sm:inline">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={zoomIn}
                                title="Phóng to (+)"
                                disabled={zoom >= 4}
                                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                            <button
                                onClick={resetTransform}
                                title="Đặt lại kích thước (0)"
                                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 transition cursor-pointer"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={rotate}
                                title="Xoay 90 độ"
                                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 transition cursor-pointer"
                            >
                                <RotateCw className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    <button
                        onClick={toggleFullscreen}
                        title="Toàn màn hình"
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 transition hidden sm:flex cursor-pointer"
                    >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={copyUrl}
                        title="Sao chép URL"
                        className={`p-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                            copied 
                                ? "bg-emerald-600 border-emerald-500 text-white" 
                                : "bg-neutral-800 hover:bg-neutral-700 border-white/10 text-white"
                        }`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden md:inline">{copied ? "Đã copy" : "Copy Link"}</span>
                    </button>

                    {onSelect && (
                        <button
                            onClick={() => {
                                onSelect(currentItem);
                                onClose();
                            }}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-lg cursor-pointer transition"
                        >
                            Chọn ảnh này
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        title="Đóng (Esc)"
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-red-600 text-white border border-white/10 transition ml-1 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Stage & Carousel */}
            <div className="flex-1 flex overflow-hidden relative" style={{ backgroundColor: "#09090b" }}>
                {/* Left Arrow Button - High Contrast */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                    }}
                    title="Ảnh trước (Mũi tên Trái)"
                    style={{ backgroundColor: "rgba(24, 24, 28, 0.95)", borderColor: "rgba(255, 255, 255, 0.35)" }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full text-white border-2 hover:!bg-orange-600 hover:!border-orange-500 shadow-[0_0_25px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer backdrop-blur-md"
                >
                    <ChevronLeft className="w-8 h-8 text-white stroke-[3]" />
                </button>

                {/* Right Arrow Button - High Contrast */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                    }}
                    title="Ảnh kế tiếp (Mũi tên Phải)"
                    style={{ backgroundColor: "rgba(24, 24, 28, 0.95)", borderColor: "rgba(255, 255, 255, 0.35)" }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full text-white border-2 hover:!bg-orange-600 hover:!border-orange-500 shadow-[0_0_25px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer backdrop-blur-md"
                >
                    <ChevronRight className="w-8 h-8 text-white stroke-[3]" />
                </button>

                {/* Media Content Display */}
                <div 
                    className={`flex-1 flex items-center justify-center p-6 overflow-hidden relative ${
                        zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                >
                    {currentItem.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={currentItem.url}
                            alt={currentItem.name}
                            draggable={false}
                            style={{
                                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                                transition: isDragging ? "none" : "transform 0.2s ease-out"
                            }}
                            className="max-w-full max-h-[calc(100vh-230px)] object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-transform will-change-transform pointer-events-auto select-none"
                        />
                    ) : (
                        <video
                            src={currentItem.url}
                            controls
                            autoPlay
                            playsInline
                            className="max-w-full max-h-[calc(100vh-230px)] rounded-2xl shadow-2xl"
                        />
                    )}
                </div>

                {/* Details Sidebar */}
                {sidebarOpen && (
                    <div 
                        style={{ backgroundColor: "#121216", borderColor: "rgba(255,255,255,0.12)" }}
                        className="w-80 border-l p-5 flex flex-col justify-between hidden lg:flex z-10 flex-shrink-0"
                    >
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm text-white pb-2 border-b border-white/10 flex items-center justify-between">
                                <span>Thông Tin Chi Tiết</span>
                                <span className="text-[10px] font-normal text-neutral-400 font-mono">ID: {currentItem.id}</span>
                            </h3>

                            <div className="space-y-3.5 text-xs">
                                <div>
                                    <span className="text-neutral-400 block mb-1 font-medium">Tên tập tin</span>
                                    <p className="font-bold text-white break-all">{currentItem.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-neutral-400 block mb-1 font-medium">Định dạng</span>
                                        <span className="px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-400 font-bold uppercase text-[10px]">
                                            {currentItem.type}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-neutral-400 block mb-1 font-medium">Dung lượng</span>
                                        <p className="font-bold text-white font-mono">{currentItem.size}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-neutral-400 block mb-1 font-medium">Ngày tải lên</span>
                                    <p className="font-bold text-white">{currentItem.uploadedAt}</p>
                                </div>
                                <div>
                                    <span className="text-neutral-400 block mb-1 font-medium">Đường dẫn tệp (URL)</span>
                                    <textarea
                                        readOnly
                                        value={currentItem.url}
                                        rows={4}
                                        className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 font-mono text-[10px] text-neutral-300 focus:outline-none resize-none"
                                        onClick={(e) => (e.target as any).select()}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <button
                                onClick={handleDownload}
                                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 transition cursor-pointer"
                            >
                                <Download className="w-4 h-4" />
                                <span>Tải xuống tệp</span>
                            </button>

                            {onDelete && (
                                <button
                                    onClick={() => {
                                        if (confirm(`Bạn có chắc chắn muốn xóa file "${currentItem.name}"?`)) {
                                            const idToDelete = currentItem.id;
                                            onDelete(idToDelete);
                                            if (items.length <= 1) {
                                                onClose();
                                            } else {
                                                goNext();
                                            }
                                        }
                                    }}
                                    className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-red-500/30 transition cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Xóa tập tin này</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Carousel Thumbnails Strip */}
            <div 
                style={{ backgroundColor: "#121216", borderColor: "rgba(255,255,255,0.12)" }}
                className="h-24 border-t px-4 py-2.5 flex items-center gap-3 z-30 flex-shrink-0"
            >
                <div 
                    ref={thumbnailStripRef}
                    className="flex-1 flex items-center gap-3 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                >
                    {items.map((item, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                            <button
                                key={item.id || idx}
                                onClick={() => goToIndex(idx)}
                                className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all group cursor-pointer ${
                                    isActive 
                                        ? "!border-orange-500 ring-2 ring-orange-500/80 scale-105 shadow-lg" 
                                        : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/60"
                                }`}
                            >
                                {item.type === "image" ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as any).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white/70">
                                        <Film className="w-6 h-6" />
                                    </div>
                                )}
                                <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[9px] font-bold text-center text-white truncate px-1 py-0.5">
                                    {idx + 1}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
