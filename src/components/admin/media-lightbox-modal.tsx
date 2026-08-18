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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col text-white select-none animate-fadeIn"
            onMouseUp={handleMouseUp}
        >
            {/* Top Navigation Bar */}
            <div className="h-16 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between bg-black/40 backdrop-blur-md z-30">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-white/10 text-orange-400">
                        {currentItem.type === "image" ? <FileImage className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold truncate text-white max-w-[200px] sm:max-w-md" title={currentItem.name}>
                            {currentItem.name}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                            <span>{currentIndex + 1} / {items.length}</span>
                            <span>•</span>
                            <span>{currentItem.size}</span>
                            {currentItem.compressed && (
                                <>
                                    <span>•</span>
                                    <span className="text-emerald-400 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Đã tối ưu WebP
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
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition disabled:opacity-30 disabled:pointer-events-none"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-mono px-1.5 text-white/70 min-w-[42px] text-center hidden sm:inline">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={zoomIn}
                                title="Phóng to (+)"
                                disabled={zoom >= 4}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition disabled:opacity-30 disabled:pointer-events-none"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                            <button
                                onClick={resetTransform}
                                title="Đặt lại kích thước (0)"
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={rotate}
                                title="Xoay 90 độ"
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
                            >
                                <RotateCw className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    <button
                        onClick={toggleFullscreen}
                        title="Toàn màn hình"
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition hidden sm:flex"
                    >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={copyUrl}
                        title="Sao chép URL"
                        className={`p-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                            copied 
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                                : "bg-white/10 hover:bg-white/20 border-transparent text-white/90"
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
                            className="btn btn-primary btn-sm px-3 text-xs bg-orange-600 hover:bg-orange-500 text-white"
                        >
                            Chọn ảnh này
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        title="Đóng (Esc)"
                        className="p-2 rounded-xl bg-white/10 hover:bg-red-500 text-white transition ml-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Stage & Carousel */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Arrow Button */}
                <button
                    onClick={goPrev}
                    title="Ảnh trước (Mũi tên Trái)"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-orange-600 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow Button */}
                <button
                    onClick={goNext}
                    title="Ảnh kế tiếp (Mũi tên Phải)"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-orange-600 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Media Content Display */}
                <div 
                    className={`flex-1 flex items-center justify-center p-4 overflow-hidden relative ${
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
                            className="max-w-full max-h-[calc(100vh-220px)] object-contain rounded-lg shadow-2xl transition-transform will-change-transform pointer-events-auto select-none"
                        />
                    ) : (
                        <video
                            src={currentItem.url}
                            controls
                            autoPlay
                            playsInline
                            className="max-w-full max-h-[calc(100vh-220px)] rounded-xl shadow-2xl"
                        />
                    )}
                </div>

                {/* Details Sidebar (Collapsible) */}
                {sidebarOpen && (
                    <div className="w-80 bg-neutral-900/90 border-l border-white/10 p-5 flex flex-col justify-between hidden lg:flex backdrop-blur-md z-10">
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm text-white/90 pb-2 border-b border-white/10">
                                Thông Tin Chi Tiết
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="text-white/50 block mb-1">Tên tập tin</span>
                                    <p className="font-semibold text-white break-all">{currentItem.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-white/50 block mb-1">Định dạng</span>
                                        <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold uppercase text-[10px]">
                                            {currentItem.type}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-white/50 block mb-1">Dung lượng</span>
                                        <p className="font-semibold text-white">{currentItem.size}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-white/50 block mb-1">Ngày tải lên</span>
                                    <p className="font-semibold text-white">{currentItem.uploadedAt}</p>
                                </div>
                                <div>
                                    <span className="text-white/50 block mb-1">Đường dẫn tệp (URL)</span>
                                    <textarea
                                        readOnly
                                        value={currentItem.url}
                                        rows={4}
                                        className="w-full bg-black/50 border border-white/15 rounded-xl p-2 font-mono text-[10px] text-white/70 focus:outline-none resize-none"
                                        onClick={(e) => (e.target as any).select()}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <button
                                onClick={handleDownload}
                                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
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
                                    className="w-full py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
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
            <div className="h-24 border-t border-white/10 bg-black/60 backdrop-blur-md px-4 py-2.5 flex items-center gap-3 z-30">
                <div 
                    ref={thumbnailStripRef}
                    className="flex-1 flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                >
                    {items.map((item, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                            <button
                                key={item.id || idx}
                                onClick={() => goToIndex(idx)}
                                className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all group ${
                                    isActive 
                                        ? "border-orange-500 ring-2 ring-orange-500/50 scale-105" 
                                        : "border-white/15 opacity-60 hover:opacity-100 hover:border-white/40"
                                }`}
                            >
                                {item.type === "image" ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white/70">
                                        <Film className="w-6 h-6" />
                                    </div>
                                )}
                                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center text-white/90 truncate px-1 py-0.5">
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
