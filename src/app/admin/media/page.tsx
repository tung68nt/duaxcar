"use client";

import { useEffect, useState } from "react";
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
    X,
    ExternalLink,
    Eye
} from "lucide-react";

interface MediaItem {
    id: string;
    name: string;
    url: string;
    type: "image" | "video";
    size: string;
    uploadedAt: string;
}

export default function AdminMediaLibrary() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
    
    // Copy toast tracking
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [viewingMedia, setViewingMedia] = useState<MediaItem | null>(null);

    const defaultMedia: MediaItem[] = [
        {
            id: "m-1",
            name: "Phở Bò Gia Truyền",
            url: "/images/courses/pho-bo.jpg",
            type: "image",
            size: "156 KB",
            uploadedAt: "2026-07-10"
        },
        {
            id: "m-2",
            name: "Bún Bò Huế",
            url: "/images/courses/bun-bo-hue.jpg",
            type: "image",
            size: "182 KB",
            uploadedAt: "2026-07-11"
        },
        {
            id: "m-3",
            name: "Phở Gà Hà Nội",
            url: "/images/courses/pho-ga.jpg",
            type: "image",
            size: "148 KB",
            uploadedAt: "2026-07-11"
        },
        {
            id: "m-4",
            name: "Bún Chả Hà Nội",
            url: "/images/courses/bun-cha.jpg",
            type: "image",
            size: "165 KB",
            uploadedAt: "2026-07-12"
        },
        {
            id: "m-5",
            name: "Lẩu Nướng Kinh Doanh",
            url: "/images/courses/lau-nuong.jpg",
            type: "image",
            size: "210 KB",
            uploadedAt: "2026-07-12"
        },
        {
            id: "m-6",
            name: "Ảnh Sứ Mệnh About Us",
            url: "/images/about/mission-v6.jpg",
            type: "image",
            size: "340 KB",
            uploadedAt: "2026-07-14"
        },
        {
            id: "m-7",
            name: "Thầy Nguyễn Hữu Thọ",
            url: "/images/instructors/nguyen-huu-tho-v3.jpg",
            type: "image",
            size: "115 KB",
            uploadedAt: "2026-07-15"
        },
        {
            id: "m-8",
            name: "Thầy Phạm Văn Long",
            url: "/images/instructors/pham-van-long-v3.jpg",
            type: "image",
            size: "128 KB",
            uploadedAt: "2026-07-15"
        },
        {
            id: "m-9",
            name: "Video giới thiệu DuaxCar Kitchen (Demo)",
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            type: "video",
            size: "2.4 MB",
            uploadedAt: "2026-07-16"
        }
    ];

    useEffect(() => {
        const stored = localStorage.getItem("admin_media_extended");
        if (stored) {
            try {
                setMediaItems(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing media db:", e);
                setMediaItems(defaultMedia);
            }
        } else {
            // Check legacy string array and convert if present
            const legacy = localStorage.getItem("admin_media");
            if (legacy) {
                try {
                    const parsedLegacy = JSON.parse(legacy);
                    if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
                        const converted: MediaItem[] = parsedLegacy.map((url, i) => ({
                            id: `legacy-${i}-${Date.now()}`,
                            name: url.startsWith("data:") ? `Ảnh Upload #${i + 1}` : url.split("/").pop() || "Ảnh tự chọn",
                            url: url,
                            type: url.includes(".mp4") || url.includes(".webm") ? "video" : "image",
                            size: "Tùy chọn",
                            uploadedAt: new Date().toISOString().split("T")[0]
                        }));
                        const merged = [...converted, ...defaultMedia];
                        setMediaItems(merged);
                        localStorage.setItem("admin_media_extended", JSON.stringify(merged));
                        return;
                    }
                } catch (e) {
                    console.error("Legacy conversion error:", e);
                }
            }
            
            setMediaItems(defaultMedia);
            localStorage.setItem("admin_media_extended", JSON.stringify(defaultMedia));
        }
    }, []);

    useEffect(() => {
        let result = [...mediaItems];
        
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(item => item.name.toLowerCase().includes(query));
        }
        
        if (typeFilter !== "all") {
            result = result.filter(item => item.type === typeFilter);
        }
        
        setFilteredItems(result);
    }, [mediaItems, searchTerm, typeFilter]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const isVideo = file.type.startsWith("video/");
                
                const newItem: MediaItem = {
                    id: `m-${Date.now()}`,
                    name: file.name,
                    url: base64String,
                    type: isVideo ? "video" : "image",
                    size: `${(file.size / 1024).toFixed(0)} KB`,
                    uploadedAt: new Date().toISOString().split("T")[0]
                };

                const updated = [newItem, ...mediaItems];
                setMediaItems(updated);
                localStorage.setItem("admin_media_extended", JSON.stringify(updated));
                
                // Synchronize legacy key for backwards compatibility
                const legacyUrls = updated.map(item => item.url);
                localStorage.setItem("admin_media", JSON.stringify(legacyUrls));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa file media này khỏi thư viện?")) {
            const updated = mediaItems.filter(item => item.id !== id);
            setMediaItems(updated);
            localStorage.setItem("admin_media_extended", JSON.stringify(updated));

            // Sync legacy
            const legacyUrls = updated.map(item => item.url);
            localStorage.setItem("admin_media", JSON.stringify(legacyUrls));
        }
    };

    const copyToClipboard = (item: MediaItem) => {
        navigator.clipboard.writeText(item.url);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="heading-2 text-[var(--color-text)]">
                        Quản Lý Thư Viện Media
                    </h1>
                    <p className="text-small text-[var(--color-text-secondary)] mt-1">
                        Tải lên hình ảnh, video thực hành món ăn, sao chép đường dẫn link để dán trực tiếp vào các form soạn thảo bài viết và khóa học.
                    </p>
                </div>
                <label className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Tải tập tin lên</span>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Tìm tên tập tin..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTypeFilter("all")}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                            typeFilter === "all"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => setTypeFilter("image")}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all ${
                            typeFilter === "image"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Hình ảnh</span>
                    </button>
                    <button
                        onClick={() => setTypeFilter("video")}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all ${
                            typeFilter === "video"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        <Video className="w-3.5 h-3.5" />
                        <span>Video</span>
                    </button>
                </div>
            </div>

            {/* Media Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                    <div 
                        key={item.id}
                        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col justify-between group relative hover:border-[var(--color-primary)]/45 hover:shadow-md transition-all duration-300"
                    >
                        {/* File Preview */}
                        <div 
                            onClick={() => setViewingMedia(item)}
                            className="relative aspect-video w-full bg-[var(--color-background)] overflow-hidden flex items-center justify-center cursor-pointer"
                        >
                            {item.type === "image" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={item.url}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
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
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-250 z-10">
                                <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/25 text-white flex items-center gap-1.5 text-xs font-semibold">
                                    <Eye className="w-4 h-4" />
                                    <span>Xem Full</span>
                                </div>
                            </div>
                            
                            {/* Type icon tag */}
                            <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-lg z-20">
                                {item.type === "image" ? (
                                    <FileImage className="w-3.5 h-3.5" />
                                ) : (
                                    <Film className="w-3.5 h-3.5" />
                                )}
                            </span>
                        </div>

                        {/* File details & Actions */}
                        <div className="p-3 space-y-2 border-t border-[var(--color-border)]">
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-[var(--color-text)] truncate" title={item.name}>
                                    {item.name}
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] font-medium">
                                    <span>{item.size}</span>
                                    <span>{item.uploadedAt}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--color-border)]">
                                <button
                                    onClick={() => copyToClipboard(item)}
                                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl border text-[10px] font-semibold transition-all ${
                                        copiedId === item.id
                                            ? "bg-green-500/10 border-green-500/20 text-green-500"
                                            : "bg-[var(--color-surface-light)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]"
                                    }`}
                                >
                                    {copiedId === item.id ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Đã copy</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy link</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-semibold"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Xóa file</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {filteredItems.length === 0 && (
                    <div className="col-span-full py-16 text-center text-small text-[var(--color-text-muted)]">
                        Không tìm thấy tập tin media nào phù hợp.
                    </div>
                )}
            </div>

            {/* View Full Media Modal */}
            {viewingMedia && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-fadeIn">
                        
                        {/* Media Preview (Left side on desktop) */}
                        <div className="flex-1 bg-[var(--color-background)] p-6 flex items-center justify-center relative min-h-[300px] md:min-h-0">
                            {viewingMedia.type === "image" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={viewingMedia.url}
                                    alt={viewingMedia.name}
                                    className="max-w-full max-h-[60vh] object-contain rounded-xl"
                                />
                            ) : (
                                <video
                                    src={viewingMedia.url}
                                    className="max-w-full max-h-[60vh] rounded-xl"
                                    controls
                                    autoPlay
                                    playsInline
                                />
                            )}
                        </div>

                        {/* Details Sidebar (Right side on desktop) */}
                        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[var(--color-border)] p-6 flex flex-col justify-between bg-[var(--color-surface)]">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                                    <h3 className="font-heading font-bold text-base text-[var(--color-text)]">
                                        Chi tiết tập tin
                                    </h3>
                                    <button 
                                        onClick={() => setViewingMedia(null)}
                                        className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)]"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div>
                                        <span className="font-semibold text-[var(--color-text-secondary)] block mb-1">Tên file</span>
                                        <p className="font-bold text-[var(--color-text)] break-all">{viewingMedia.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <div>
                                            <span className="font-semibold text-[var(--color-text-secondary)] block mb-1">Định dạng</span>
                                            <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-[10px] uppercase">
                                                {viewingMedia.type}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-[var(--color-text-secondary)] block mb-1">Dung lượng</span>
                                            <p className="font-bold text-[var(--color-text)]">{viewingMedia.size}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-[var(--color-text-secondary)] block mb-1">Ngày tải lên</span>
                                        <p className="font-bold text-[var(--color-text)]">{viewingMedia.uploadedAt}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-[var(--color-text-secondary)] block mb-1">Đường dẫn tệp (URL / Base64)</span>
                                        <textarea
                                            readOnly
                                            value={viewingMedia.url}
                                            rows={5}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-2.5 font-mono text-[9px] text-[var(--color-text-muted)] focus:outline-none resize-none"
                                            onClick={(e) => (e.target as any).select()}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-[var(--color-border)] mt-4">
                                <button
                                    onClick={() => {
                                        copyToClipboard(viewingMedia);
                                    }}
                                    className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                        copiedId === viewingMedia.id
                                            ? "bg-green-500/10 border-green-500/20 text-green-500"
                                            : "bg-[var(--color-primary)] border-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
                                    }`}
                                >
                                    {copiedId === viewingMedia.id ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Đã sao chép đường dẫn</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            <span>Sao chép đường dẫn</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        const id = viewingMedia.id;
                                        setViewingMedia(null);
                                        handleDelete(id);
                                    }}
                                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-semibold"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Xóa tập tin</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
