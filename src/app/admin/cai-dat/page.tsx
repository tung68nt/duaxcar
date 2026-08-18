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
import { MediaSelectorInput } from "@/components/admin/media-selector-input";

interface BannerItem {
    id: number;
    image: string;
    alt: string;
}

interface SettingsState {
    brandName: string;
    tagline: string;
    logo?: string;
    favicon?: string;
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
        logo: "/images/logo.png",
        favicon: "/images/logo.png",
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
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/cms/settings');
                if (res.ok) {
                    const json = await res.json();
                    if (json.settings) {
                        setConfig(prev => ({ ...prev, ...json.settings }));
                        localStorage.setItem("admin_settings", JSON.stringify(json.settings));
                        return;
                    }
                }
            } catch (e) {
                console.error("Error fetching settings:", e);
            }

            const localSettings = localStorage.getItem("admin_settings");
            if (localSettings) {
                try {
                    const parsed = JSON.parse(localSettings);
                    setConfig(prev => ({ ...prev, ...parsed }));
                } catch (e) {
                    console.error("Error parsing stored config:", e);
                }
            }
        };
        fetchSettings();
        
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await fetch('/api/cms/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: config })
            });
        } catch (err) {
            console.warn("Could not save settings via API:", err);
        }

        localStorage.setItem("admin_settings", JSON.stringify(config));
        setSaved(true);
        window.dispatchEvent(new Event("storage"));
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
                <div className="p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg flex items-center gap-2 text-small font-medium animate-fadeIn">
                    <CheckCircle className="w-5 h-5 animate-bounce" />
                    <span>Lưu cấu hình hệ thống thành công! Các thay đổi đã được áp dụng.</span>
                </div>
            )}

            {/* Config Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === "general" && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Brand Info */}
                        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-4">
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
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Khẩu hiệu / Slogan</label>
                                    <input
                                        type="text"
                                        value={config.tagline}
                                        onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Logo & Favicon */}
                        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-4">
                            <h3 className="font-heading font-semibold text-[var(--color-text)] text-base flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                                <ImageIcon className="w-5 h-5 text-[var(--color-primary)]" />
                                <span>Logo thương hiệu & Biểu tượng Favicon</span>
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <MediaSelectorInput
                                    label="Logo website (Header, Footer, Admin)"
                                    description="Logo hiển thị chính thức trên website (khuyên dùng định dạng PNG trong suốt)"
                                    value={config.logo || "/images/logo.png"}
                                    onChange={(url) => setConfig({ ...config, logo: url })}
                                    aspectRatio="wide"
                                />
                                <MediaSelectorInput
                                    label="Favicon (Biểu tượng Tab trình duyệt)"
                                    description="Icon đại diện trên tab & bookmark trình duyệt (khuyên dùng tỉ lệ vuông chuẩn logo)"
                                    value={config.favicon || "/images/logo.png"}
                                    onChange={(url) => setConfig({ ...config, favicon: url })}
                                    aspectRatio="square"
                                />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-4">
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
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Hotline tuyển sinh</label>
                                    <input
                                        type="text"
                                        value={config.hotline}
                                        onChange={(e) => setConfig({ ...config, hotline: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Email liên hệ</label>
                                    <input
                                        type="email"
                                        value={config.email}
                                        onChange={(e) => setConfig({ ...config, email: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Địa chỉ trụ sở chính</label>
                                    <input
                                        type="text"
                                        value={config.address}
                                        onChange={(e) => setConfig({ ...config, address: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
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
                                            className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all z-10"
                                            title="Xóa banner này"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        
                                        <MediaSelectorInput
                                            label={`Banner #${index + 1}`}
                                            value={banner.image}
                                            onChange={(url) => {
                                                const updated = [...config.heroBanners];
                                                updated[index] = { ...updated[index], image: url };
                                                setConfig({ ...config, heroBanners: updated });
                                            }}
                                            aspectRatio="video"
                                            required
                                        />

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

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tiêu đề sứ mệnh (Story Title)</label>
                                            <input
                                                type="text"
                                                value={config.aboutStoryTitle}
                                                onChange={(e) => setConfig({ ...config, aboutStoryTitle: e.target.value })}
                                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <MediaSelectorInput
                                            label="Ảnh câu chuyện thương hiệu (Story Image)"
                                            description="Ảnh minh họa trong phần Câu chuyện sáng lập"
                                            value={config.aboutStoryImage}
                                            onChange={(url) => setConfig({ ...config, aboutStoryImage: url })}
                                            aspectRatio="wide"
                                            required
                                        />
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
                        className="btn btn-primary btn-md px-6 py-2.5 flex items-center gap-2 shadow-sm rounded-lg"
                    >
                        <Save className="w-5 h-5" />
                        <span>Lưu cài đặt</span>
                    </button>
                </div>
            </form>

        </div>
    );
}
