"use client";

import { useEffect, useState } from "react";
import { 
    Settings, 
    Save, 
    Globe, 
    Phone, 
    Mail, 
    Facebook, 
    Youtube, 
    Video,
    CheckCircle,
    Sliders,
    Info,
    Plus,
    Trash2,
    X,
    FileText,
    Image as ImageIcon
} from "lucide-react";

interface BannerItem {
    id: number;
    image: string;
    alt: string;
}

interface SettingsState {
    brandName: string;
    tagline: string;
    phone: string;
    hotline: string;
    email: string;
    address: string;
    facebook: string;
    youtube: string;
    tiktok: string;
    academy: string;
    
    // Homepage content
    heroTitle: string;
    heroSubtitle: string;
    heroBanners: BannerItem[];
    
    // About page content
    aboutHeroTitle: string;
    aboutHeroSubtitle: string;
    aboutStoryTitle: string;
    aboutStoryContent: string;
    aboutStoryImage: string;
    aboutVision: string;
    aboutMission: string;
}

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState<"general" | "homepage" | "about">("general");
    const [config, setConfig] = useState<SettingsState>({
        brandName: "DuaxCar Kitchen",
        tagline: "Trung tâm đào tạo ẩm thực chuyên nghiệp",
        phone: "090 123 4567",
        hotline: "091 888 9999",
        email: "contact@duaxcar.vn",
        address: "123 Đường Láng, Đống Đa, Hà Nội",
        facebook: "https://facebook.com/duaxcar",
        youtube: "https://youtube.com/duaxcar",
        tiktok: "https://tiktok.com/@duaxcar",
        academy: "https://academy.duaxcar.com/",
        
        // Homepage hero defaults
        heroTitle: "Nơi đam mê trở thành nghề nghiệp",
        heroSubtitle: "Đào tạo kỹ thuật nấu nướng chuẩn vị kinh doanh, học cùng chuyên gia ẩm thực hàng đầu.",
        heroBanners: [
            { id: 1, image: "/images/courses/pho-bo.jpg", alt: "Phở Bò Truyền Thống" },
            { id: 2, image: "/images/courses/bun-bo-hue.jpg", alt: "Bún Bò Huế" },
            { id: 3, image: "/images/courses/bun-cha.jpg", alt: "Bún Chả" },
            { id: 4, image: "/images/courses/lau-nuong.jpg", alt: "Lẩu Nướng Kinh Doanh" }
        ],
        
        // About page defaults
        aboutHeroTitle: "DuaxCar Kitchen - Nơi đam mê trở thành nghề nghiệp",
        aboutHeroSubtitle: "Chúng tôi không chỉ dạy nấu ăn - chúng tôi truyền lửa, truyền văn hóa và tư duy làm nghề bền vững.",
        aboutStoryTitle: "Từ đam mê đến sứ mệnh",
        aboutStoryContent: "DuaxCar Kitchen được sinh ra từ một mong muốn đơn giản: Giúp những ai yêu thích ẩm thực Việt có thể biến đam mê thành nghề nghiệp bền vững.\n\nChúng tôi hiểu rằng để một quán ăn thành công, không chỉ cần món ăn ngon mà còn cần tư duy kinh doanh đúng đắn. Vì vậy, ngoài việc dạy kỹ thuật nấu nướng, chúng tôi còn chia sẻ kinh nghiệm vận hành, quản lý chi phí và xây dựng thương hiệu.\n\nVới đội ngũ giảng viên là những nghệ nhân ẩm thực được vinh danh, DuaxCar Kitchen tự hào là địa chỉ tin cậy cho những ai muốn khởi nghiệp trong lĩnh vực F&B.",
        aboutStoryImage: "/images/about/mission-v6.jpg",
        aboutVision: "Trở thành trung tâm đào tạo ẩm thực Việt hàng đầu, nơi mỗi học viên không chỉ học được công thức mà còn được trang bị đầy đủ kiến thức và kỹ năng để thành công trong ngành F&B.",
        aboutMission: "Gìn giữ và phát triển ẩm thực Việt thông qua việc đào tạo thế hệ đầu bếp mới. Giúp học viên hiểu sâu về văn hóa ẩm thực, nắm vững kỹ thuật và có tư duy kinh doanh bền vững."
    });
    
    const [saved, setSaved] = useState(false);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [activeMediaTarget, setActiveMediaTarget] = useState<{ type: "banner" | "about"; index?: number } | null>(null);
    const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);

    const stockImages = [
        { name: "Phở Bò", url: "/images/courses/pho-bo.jpg" },
        { name: "Bún Bò Huế", url: "/images/courses/bun-bo-hue.jpg" },
        { name: "Phở Gà", url: "/images/courses/pho-ga.jpg" },
        { name: "Bún Chả", url: "/images/courses/bun-cha.jpg" },
        { name: "Lẩu Nướng", url: "/images/courses/lau-nuong.jpg" },
        { name: "Món hải sản", url: "/images/courses/hai-san.jpg" },
        { name: "Cơm thố", url: "/images/courses/com-tho.jpg" },
        { name: "Về Duaxcar Story", url: "/images/about/mission-v6.jpg" }
    ];

    useEffect(() => {
        const localSettings = localStorage.getItem("admin_settings");
        if (localSettings) {
            try {
                const parsed = JSON.parse(localSettings);
                setConfig(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Error parsing stored config:", e);
            }
        }
        
        const savedMedia = localStorage.getItem("admin_media");
        if (savedMedia) {
            setUploadedMedia(JSON.parse(savedMedia));
        }
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                applyMediaSelection(base64String);
                
                const updatedMedia = [base64String, ...uploadedMedia.filter(m => m !== base64String)].slice(0, 12);
                setUploadedMedia(updatedMedia);
                localStorage.setItem("admin_media", JSON.stringify(updatedMedia));
            };
            reader.readAsDataURL(file);
        }
    };

    const applyMediaSelection = (url: string) => {
        if (!activeMediaTarget) return;
        
        if (activeMediaTarget.type === "about") {
            setConfig(prev => ({ ...prev, aboutStoryImage: url }));
        } else if (activeMediaTarget.type === "banner" && activeMediaTarget.index !== undefined) {
            const updatedBanners = [...config.heroBanners];
            updatedBanners[activeMediaTarget.index] = {
                ...updatedBanners[activeMediaTarget.index],
                image: url
            };
            setConfig(prev => ({ ...prev, heroBanners: updatedBanners }));
        }
        setMediaModalOpen(false);
        setActiveMediaTarget(null);
    };

    const openMediaModal = (target: "banner" | "about", index?: number) => {
        setActiveMediaTarget({ type: target, index });
        setMediaModalOpen(true);
    };

    const handleAddBanner = () => {
        setConfig(prev => ({
            ...prev,
            heroBanners: [
                ...prev.heroBanners,
                { id: Date.now(), image: "/images/courses/pho-bo.jpg", alt: "Banner mới" }
            ]
        }));
    };

    const handleRemoveBanner = (index: number) => {
        const updatedBanners = config.heroBanners.filter((_, i) => i !== index);
        setConfig(prev => ({ ...prev, heroBanners: updatedBanners }));
    };

    const handleBannerAltChange = (index: number, val: string) => {
        const updatedBanners = [...config.heroBanners];
        updatedBanners[index] = { ...updatedBanners[index], alt: val };
        setConfig(prev => ({ ...prev, heroBanners: updatedBanners }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("admin_settings", JSON.stringify(config));
        setSaved(true);
        window.dispatchEvent(new Event("storage")); // Trigger local hydration
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-8 w-full">
            {/* Page Header */}
            <div>
                <h1 className="heading-2 text-[var(--color-text)]">
                    Cài Đặt Hệ Thống
                </h1>
                <p className="text-small text-[var(--color-text-secondary)] mt-1">
                    Cấu hình thông tin liên hệ, mạng xã hội, ảnh slide banner trang chủ và nội dung trang Giới thiệu.
                </p>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex gap-2 border-b border-[var(--color-border)] pb-px">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
                        activeTab === "general"
                            ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                            : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                    }`}
                >
                    Thông tin liên hệ & Social
                </button>
                <button
                    onClick={() => setActiveTab("homepage")}
                    className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
                        activeTab === "homepage"
                            ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                            : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                    }`}
                >
                    Banners & Trang chủ
                </button>
                <button
                    onClick={() => setActiveTab("about")}
                    className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
                        activeTab === "about"
                            ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                            : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                    }`}
                >
                    Trang Giới thiệu
                </button>
            </div>

            {/* Saved Notification */}
            {saved && (
                <div className="p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center gap-2 text-small font-medium animate-fadeIn">
                    <CheckCircle className="w-5 h-5 animate-bounce" />
                    <span>Lưu cấu hình hệ thống thành công! Các thay đổi đã được áp dụng.</span>
                </div>
            )}

            {/* Config Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === "general" && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Brand Info */}
                        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
                            <h3 className="font-heading font-semibold text-[var(--color-text)] text-base flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                                <Globe className="w-5 h-5 text-[var(--color-primary)]" />
                                <span>Cấu hình thương hiệu</span>
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tên thương hiệu</label>
                                    <input
                                        type="text"
                                        value={config.brandName}
                                        onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Khẩu hiệu / Slogan</label>
                                    <input
                                        type="text"
                                        value={config.tagline}
                                        onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
                            <h3 className="font-heading font-semibold text-[var(--color-text)] text-base flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                                <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                                <span>Thông tin liên hệ</span>
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Số điện thoại liên hệ</label>
                                    <input
                                        type="text"
                                        value={config.phone}
                                        onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Hotline tuyển sinh</label>
                                    <input
                                        type="text"
                                        value={config.hotline}
                                        onChange={(e) => setConfig({ ...config, hotline: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Email liên hệ</label>
                                    <input
                                        type="email"
                                        value={config.email}
                                        onChange={(e) => setConfig({ ...config, email: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Địa chỉ trụ sở chính</label>
                                    <input
                                        type="text"
                                        value={config.address}
                                        onChange={(e) => setConfig({ ...config, address: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Networks */}
                        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
                            <h3 className="font-heading font-semibold text-[var(--color-text)] text-base flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                                <Facebook className="w-5 h-5 text-[var(--color-primary)]" />
                                <span>Mạng xã hội & E-learning</span>
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5 flex items-center gap-1">
                                        <Facebook className="w-3.5 h-3.5 text-blue-500" /> Facebook Page URL
                                    </label>
                                    <input
                                        type="url"
                                        value={config.facebook}
                                        onChange={(e) => setConfig({ ...config, facebook: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5 flex items-center gap-1">
                                        <Youtube className="w-3.5 h-3.5 text-red-500" /> Youtube Channel URL
                                    </label>
                                    <input
                                        type="url"
                                        value={config.youtube}
                                        onChange={(e) => setConfig({ ...config, youtube: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5 flex items-center gap-1">
                                        <Video className="w-3.5 h-3.5 text-purple-500" /> Tiktok Profile URL
                                    </label>
                                    <input
                                        type="url"
                                        value={config.tiktok}
                                        onChange={(e) => setConfig({ ...config, tiktok: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5 flex items-center gap-1">
                                        <Globe className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Cổng học Online (E-learning)
                                    </label>
                                    <input
                                        type="url"
                                        value={config.academy}
                                        onChange={(e) => setConfig({ ...config, academy: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "homepage" && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Homepage Hero Texts */}
                        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
                            <h3 className="font-heading font-semibold text-[var(--color-text)] text-base flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                                <Info className="w-5 h-5 text-[var(--color-primary)]" />
                                <span>Tiêu đề & Khẩu hiệu Trang chủ</span>
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tiêu đề chính (Hero Title)</label>
                                    <input
                                        type="text"
                                        value={config.heroTitle}
                                        onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Mô tả phụ (Hero Subtitle)</label>
                                    <textarea
                                        value={config.heroSubtitle}
                                        onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                                        rows={3}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none resize-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Homepage Banner Slides list */}
                        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                                <h3 className="font-heading font-semibold text-[var(--color-text)] text-base flex items-center gap-2">
                                    <Sliders className="w-5 h-5 text-[var(--color-primary)]" />
                                    <span>Danh sách Slides Banner</span>
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleAddBanner}
                                    className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 font-semibold"
                                >
                                    <Plus className="w-4 h-4" /> Thêm slide
                                </button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {config.heroBanners.map((banner, index) => (
                                    <div key={banner.id} className="p-4 bg-[var(--color-surface-light)]/40 border border-[var(--color-border)] rounded-2xl space-y-3 relative group">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveBanner(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        
                                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[var(--color-background)] border border-[var(--color-border)]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={banner.image}
                                                alt={banner.alt}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => openMediaModal("banner", index)}
                                                className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Thay đổi ảnh
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-[10px] font-semibold text-[var(--color-text-secondary)] block mb-1">Mô tả ảnh / ALT tag</label>
                                                <input
                                                    type="text"
                                                    value={banner.alt}
                                                    onChange={(e) => handleBannerAltChange(index, e.target.value)}
                                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-1.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                                    placeholder="Ví dụ: Lớp học nấu Phở..."
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-semibold text-[var(--color-text-secondary)] block mb-1">Đường dẫn ảnh</label>
                                                <input
                                                    type="text"
                                                    value={banner.image}
                                                    onChange={(e) => {
                                                        const updated = [...config.heroBanners];
                                                        updated[index] = { ...updated[index], image: e.target.value };
                                                        setConfig({ ...config, heroBanners: updated });
                                                    }}
                                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-1.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "about" && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* About Us Page Content */}
                        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
                            <h3 className="font-heading font-semibold text-[var(--color-text)] text-base flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                                <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                                <span>Nội dung Trang Giới Thiệu (About Page)</span>
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tiêu đề Hero chính</label>
                                        <input
                                            type="text"
                                            value={config.aboutHeroTitle}
                                            onChange={(e) => setConfig({ ...config, aboutHeroTitle: e.target.value })}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Mô tả phụ Hero</label>
                                        <input
                                            type="text"
                                            value={config.aboutHeroSubtitle}
                                            onChange={(e) => setConfig({ ...config, aboutHeroSubtitle: e.target.value })}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <hr className="border-[var(--color-border)]" />

                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tiêu đề sứ mệnh (Story Title)</label>
                                        <input
                                            type="text"
                                            value={config.aboutStoryTitle}
                                            onChange={(e) => setConfig({ ...config, aboutStoryTitle: e.target.value })}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Ảnh đi kèm Story</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={config.aboutStoryImage}
                                                onChange={(e) => setConfig({ ...config, aboutStoryImage: e.target.value })}
                                                className="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => openMediaModal("about")}
                                                className="px-3 py-2 bg-[var(--color-surface-light)] border border-[var(--color-border)] text-xs font-semibold rounded-xl text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white"
                                            >
                                                Chọn ảnh
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Nội dung Câu chuyện Sứ mệnh (Story paragraphs)</label>
                                    <textarea
                                        value={config.aboutStoryContent}
                                        onChange={(e) => setConfig({ ...config, aboutStoryContent: e.target.value })}
                                        rows={8}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>

                                <hr className="border-[var(--color-border)]" />

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Mô tả Tầm nhìn (Vision Text)</label>
                                        <textarea
                                            value={config.aboutVision}
                                            onChange={(e) => setConfig({ ...config, aboutVision: e.target.value })}
                                            rows={4}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Mô tả Sứ mệnh (Mission Text)</label>
                                        <textarea
                                            value={config.aboutMission}
                                            onChange={(e) => setConfig({ ...config, aboutMission: e.target.value })}
                                            rows={4}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Submit Button */}
                <div className="flex justify-end border-t border-[var(--color-border)] pt-5">
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/20"
                    >
                        <Save className="w-5 h-5" />
                        <span>Lưu cài đặt</span>
                    </button>
                </div>
            </form>

            {/* Settings Media Library Modal */}
            {mediaModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col animate-fadeIn">
                        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between sticky top-0 bg-[var(--color-surface)] z-10">
                            <div>
                                <h3 className="font-heading font-semibold text-[var(--color-text)] text-base">
                                    Thư viện Media
                                </h3>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Chọn ảnh mẫu hoặc tải ảnh mới từ máy tính của bạn</p>
                            </div>
                            <button 
                                onClick={() => { setMediaModalOpen(false); setActiveMediaTarget(null); }}
                                className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-2xl p-6 text-center cursor-pointer transition-colors relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-[var(--color-text)]">Tải ảnh lên từ thiết bị</span>
                                    <span className="text-[10px] text-[var(--color-text-muted)]">Chấp nhận JPG, PNG, WEBP. Tự động chuyển Base64.</span>
                                </div>
                            </div>

                            {/* Stock Images */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">Ảnh món ăn DuaxCar</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {stockImages.map((img) => (
                                        <button
                                            key={img.url}
                                            type="button"
                                            onClick={() => applyMediaSelection(img.url)}
                                            className="group text-left border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl overflow-hidden bg-[var(--color-background)] transition-all focus:outline-none"
                                        >
                                            <div className="relative aspect-[4/3] bg-[var(--color-surface-light)]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={img.url}
                                                    alt={img.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                                                />
                                            </div>
                                            <div className="p-2 border-t border-[var(--color-border)]">
                                                <p className="text-[10px] font-semibold text-[var(--color-text)] truncate">{img.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Uploaded Images */}
                            {uploadedMedia.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">Ảnh bạn đã tải lên</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {uploadedMedia.map((base64, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => applyMediaSelection(base64)}
                                                className="group text-left border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl overflow-hidden bg-[var(--color-background)] transition-all focus:outline-none"
                                            >
                                                <div className="relative aspect-[4/3] bg-[var(--color-surface-light)]">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={base64}
                                                        alt={`Custom upload ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
