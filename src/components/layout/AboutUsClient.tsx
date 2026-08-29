"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChefHat,
    Target,
    Eye,
    Award,
    Users,
    Quote,
    BookOpen,
    ArrowRight,
    HeartHandshake,
    Sparkles,
    CheckCircle2,
    Calendar,
    ChevronRight
} from "lucide-react";

interface AboutUsClientProps {
    initialStats: any[];
    initialInstructors: any[];
    initialSettings?: any;
}

export default function AboutUsClient({ initialStats, initialInstructors, initialSettings }: AboutUsClientProps) {
    const [aboutContent, setAboutContent] = useState({
        aboutHeroTitle: initialSettings?.aboutHeroTitle || "DuaxCar Kitchen - Nơi đam mê trở thành nghề nghiệp",
        aboutHeroSubtitle: initialSettings?.aboutHeroSubtitle || "Chúng tôi không chỉ dạy nấu ăn - chúng tôi truyền lửa, truyền văn hóa và tư duy làm nghề bền vững.",
        aboutStoryTitle: initialSettings?.aboutStoryTitle || "Từ đam mê đến sứ mệnh",
        aboutStoryContent: initialSettings?.aboutStoryContent || "DuaxCar Kitchen được sinh ra từ một mong muốn đơn giản: Giúp những ai yêu thích ẩm thực Việt có thể biến đam mê thành nghề nghiệp bền vững.\n\nChúng tôi hiểu rằng để một quán ăn thành công, không chỉ cần món ăn ngon mà còn cần tư duy kinh doanh đúng đắn. Vì vậy, ngoài việc dạy kỹ thuật nấu nướng, chúng tôi còn chia sẻ kinh nghiệm vận hành, quản lý chi phí và xây dựng thương hiệu.\n\nVới đội ngũ giảng viên là những nghệ nhân ẩm thực được vinh danh, DuaxCar Kitchen tự hào là địa chỉ tin cậy cho những ai muốn khởi nghiệp trong lĩnh vực F&B.",
        aboutStoryImage: initialSettings?.aboutStoryImage || "/images/about/mission-v6.jpg",
        aboutVision: initialSettings?.aboutVision || "Trở thành trung tâm đào tạo ẩm thực Việt hàng đầu, nơi mỗi học viên không chỉ học được công thức mà còn được trang bị đầy đủ kiến thức và kỹ năng để thành công trong ngành F&B.",
        aboutMission: initialSettings?.aboutMission || "Gìn giữ và phát triển ẩm thực Việt thông qua việc đào tạo thế hệ đầu bếp mới. Giúp học viên hiểu sâu về văn hóa ẩm thực, nắm vững kỹ thuật và có tư duy kinh doanh bền vững."
    });

    const [instructors, setInstructors] = useState<any[]>(initialInstructors);
    const [activeInstructorId, setActiveInstructorId] = useState<string>(initialInstructors[0]?.id || "nguyen-huu-tho");

    useEffect(() => {
        if (initialSettings) {
            setAboutContent(prev => ({
                ...prev,
                aboutHeroTitle: initialSettings.aboutHeroTitle || prev.aboutHeroTitle,
                aboutHeroSubtitle: initialSettings.aboutHeroSubtitle || prev.aboutHeroSubtitle,
                aboutStoryTitle: initialSettings.aboutStoryTitle || prev.aboutStoryTitle,
                aboutStoryContent: initialSettings.aboutStoryContent || prev.aboutStoryContent,
                aboutStoryImage: initialSettings.aboutStoryImage || prev.aboutStoryImage,
                aboutVision: initialSettings.aboutVision || prev.aboutVision,
                aboutMission: initialSettings.aboutMission || prev.aboutMission
            }));
        } else {
            // Live fetch from API
            fetch('/api/cms/settings')
                .then(res => res.json())
                .then(data => {
                    if (data.settings) {
                        setAboutContent(prev => ({
                            ...prev,
                            aboutHeroTitle: data.settings.aboutHeroTitle || prev.aboutHeroTitle,
                            aboutHeroSubtitle: data.settings.aboutHeroSubtitle || prev.aboutHeroSubtitle,
                            aboutStoryTitle: data.settings.aboutStoryTitle || prev.aboutStoryTitle,
                            aboutStoryContent: data.settings.aboutStoryContent || prev.aboutStoryContent,
                            aboutStoryImage: data.settings.aboutStoryImage || prev.aboutStoryImage,
                            aboutVision: data.settings.aboutVision || prev.aboutVision,
                            aboutMission: data.settings.aboutMission || prev.aboutMission
                        }));
                    }
                })
                .catch(() => {});
        }

        // Live fetch instructors
        fetch('/api/cms/instructors')
            .then(res => res.json())
            .then(data => {
                if (data.instructors && Array.isArray(data.instructors) && data.instructors.length > 0) {
                    setInstructors(data.instructors);
                    if (!data.instructors.some((i: any) => i.id === activeInstructorId)) {
                        setActiveInstructorId(data.instructors[0].id);
                    }
                }
            })
            .catch(() => {});
    }, [initialSettings, initialInstructors]);

    const activeInstructor = instructors.find(i => i.id === activeInstructorId) || instructors[0];

    const timeline = [
        {
            year: "2015",
            title: "Khởi đầu đam mê",
            description: "Khởi xướng từ các lớp học chia sẻ công thức bí truyền cho các chủ quán đầu tiên.",
        },
        {
            year: "2018",
            title: "Quy chuẩn hóa",
            description: "Thành lập trung tâm đào tạo bài bản, chuẩn hóa định lượng và công thức kinh doanh.",
        },
        {
            year: "2019",
            title: "Vinh danh nghệ nhân",
            description: "Được vinh danh Nghệ nhân ẩm thực Bún bò Huế tại Lễ hội Vingroup.",
        },
        {
            year: "2022",
            title: "DuaxCar Kitchen",
            description: "Nâng cấp cơ sở vật chất chuẩn bếp công nghiệp, đội ngũ giảng viên giàu kinh nghiệm.",
        },
        {
            year: "2024+",
            title: "Mạng lưới F&B",
            description: "Đồng hành cùng 500+ học viên và hỗ trợ mở 50+ chuỗi/quán ăn thành công trên cả nước.",
        },
    ];

    const whyChooseUs = [
        {
            icon: Award,
            title: "Nghệ nhân vinh danh",
            description: "Giảng dạy trực tiếp bởi các nghệ nhân được công nhận, hơn 25 năm kinh nghiệm thực chiến.",
            color: "bg-orange-500/10 text-orange-500 border border-orange-500/20"
        },
        {
            icon: ChefHat,
            title: "100% Thực chiến",
            description: "Tập trung thực hành tại bếp, công thức tỷ lệ chuẩn kinh doanh, học xong mở quán ngay.",
            color: "bg-amber-500/10 text-amber-500 border border-amber-500/20"
        },
        {
            icon: Users,
            title: "Lớp học kèm 1-1",
            description: "Giới hạn tối đa 5-8 học viên/lớp, giảng viên trực tiếp cầm tay chỉ việc từng thao tác.",
            color: "bg-blue-500/10 text-blue-500 border border-blue-500/20"
        },
        {
            icon: HeartHandshake,
            title: "Cố vấn trọn đời",
            description: "Hỗ trợ tư vấn menu, setup quán, tính toán chi phí cost và nguồn nguyên liệu sau tốt nghiệp.",
            color: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
        },
    ];

    return (
        <div className="space-y-12 md:space-y-16 pb-16">
            {/* Hero Section */}
            <section className="relative pt-12 pb-14 md:pt-16 md:pb-16 overflow-hidden border-b border-[var(--color-border)] mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-background)] via-[var(--color-surface)] to-[var(--color-background)]" />
                <div className="absolute top-10 right-10 w-72 h-72 bg-[var(--color-orange-500)]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 pattern-plus opacity-50 pointer-events-none" />

                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 badge badge-primary mb-3">
                            <Users className="w-3.5 h-3.5" />
                            <span>Về DuaxCar Kitchen</span>
                        </div>
                        <h1 className="heading-1 text-[var(--color-text)] mb-3 leading-tight">
                            {aboutContent.aboutHeroTitle}
                        </h1>
                        <p className="text-small sm:text-base text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
                            {aboutContent.aboutHeroSubtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Bento Grid: Story + Vision & Mission (Compact, No Over-scroll) */}
            <section className="container">
                <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                    {/* Story Card - 7 Cols */}
                    <div className="lg:col-span-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full">
                                    Hành trình khởi nghiệp
                                </span>
                            </div>
                            <h2 className="heading-3 text-[var(--color-text)] mb-4">
                                {aboutContent.aboutStoryTitle}
                            </h2>
                            <div className="text-small text-[var(--color-text-secondary)] space-y-3 leading-relaxed whitespace-pre-line">
                                {aboutContent.aboutStoryContent}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[var(--color-border)]/60 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                                    DC
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-[var(--color-text)]">DuaxCar Kitchen Academy</div>
                                    <div className="text-[11px] text-[var(--color-text-muted)]">Đồng hành khởi nghiệp ẩm thực bền vững</div>
                                </div>
                            </div>
                            <Link href="#giang-vien" className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                                Đội ngũ giảng viên <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Bento Box: Vision & Mission (5 Cols) */}
                    <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        {/* Vision Card */}
                        <div className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-light)]/40 border border-[var(--color-border)] rounded-3xl p-6 shadow-sm flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <h3 className="font-heading font-bold text-base text-[var(--color-text)]">
                                    Tầm Nhìn Chiến Lược
                                </h3>
                            </div>
                            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                {aboutContent.aboutVision}
                            </p>
                        </div>

                        {/* Mission Card */}
                        <div className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-light)]/40 border border-[var(--color-border)] rounded-3xl p-6 shadow-sm flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center flex-shrink-0">
                                    <Target className="w-5 h-5" />
                                </div>
                                <h3 className="font-heading font-bold text-base text-[var(--color-text)]">
                                    Sứ Mệnh Phụng Sự
                                </h3>
                            </div>
                            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                {aboutContent.aboutMission}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us - Compact 4-Card Grid */}
            <section className="container">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
                    <div>
                        <span className="text-[11px] font-bold text-[var(--color-primary)]">
                            Giá trị cốt lõi
                        </span>
                        <h2 className="heading-3 text-[var(--color-text)] mt-1">
                            Vì sao học viên chọn DuaxCar?
                        </h2>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] max-w-sm">
                        Kết hợp tinh hoa ẩm thực truyền thống với kỹ năng quản trị kinh doanh hiện đại.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {whyChooseUs.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={index}
                                className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105 ${item.color}`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-heading font-bold text-sm text-[var(--color-text)] mb-1.5 group-hover:text-[var(--color-primary)] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Timeline - Compact Horizontal Milestones */}
            <section className="container">
                <div className="p-6 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <span className="text-[11px] font-bold text-[var(--color-primary)]">
                                Cột mốc phát triển
                            </span>
                            <h2 className="heading-4 text-[var(--color-text)] mt-1">
                                Hành trình kiến tạo giá trị
                            </h2>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {timeline.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl relative hover:border-[var(--color-primary)]/40 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="text-xs font-extrabold text-[var(--color-primary)] mb-1 bg-[var(--color-primary)]/10 px-2 py-0.5 rounded w-fit">
                                        {item.year}
                                    </div>
                                    <h4 className="font-heading font-bold text-xs text-[var(--color-text)] mb-1">
                                        {item.title}
                                    </h4>
                                    <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* INSTRUCTOR SPOTLIGHT - TABBED & NO-CROP (Super Compact & Elegant) */}
            {/* ========================================================================= */}
            <section className="container" id="giang-vien">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-sm">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-6 border-b border-[var(--color-border)] gap-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 badge badge-primary mb-2">
                                <ChefHat className="w-3.5 h-3.5" />
                                <span>Đội Ngũ Chuyên Gia</span>
                            </div>
                            <h2 className="heading-3 text-[var(--color-text)]">
                                Giảng viên & Nghệ nhân ẩm thực
                            </h2>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                Học viên được trực tiếp hướng dẫn 1-1 bởi các bếp trưởng, nghệ nhân hàng đầu.
                            </p>
                        </div>

                        {/* Interactive Instructor Tabs - Scrollable with NO CROPPING */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
                            {instructors.filter(i => i.visible !== false).map((ins) => {
                                const isActive = ins.id === activeInstructor?.id;
                                return (
                                    <button
                                        key={ins.id}
                                        type="button"
                                        onClick={() => setActiveInstructorId(ins.id)}
                                        className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                                            isActive
                                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md shadow-[var(--color-primary)]/20"
                                                : "bg-[var(--color-background)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                                        }`}
                                    >
                                        <div className="w-6 h-6 rounded-full overflow-hidden relative border border-white/20 flex-shrink-0">
                                            <Image
                                                src={ins.image}
                                                alt={ins.name}
                                                fill
                                                className="object-cover object-top"
                                            />
                                        </div>
                                        <span>{ins.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Instructor Showcase Body */}
                    {activeInstructor && (
                        <div className="grid lg:grid-cols-12 gap-8 items-start animate-fadeIn">
                            {/* Left: Non-cropped Portrait Card */}
                            <div className="lg:col-span-5 flex flex-col items-center">
                                <div 
                                    className="w-full max-w-sm rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-xl relative pt-6 px-6 pb-0 flex flex-col items-center justify-end"
                                    style={{ backgroundColor: "#ffffff" }}
                                >
                                    <div 
                                        className="relative w-full aspect-[4/5] flex items-end justify-center"
                                        style={{ backgroundColor: "#ffffff" }}
                                    >
                                        <Image
                                            src={activeInstructor.image}
                                            alt={activeInstructor.name}
                                            fill
                                            priority
                                            className="object-contain object-bottom"
                                            sizes="(max-width: 768px) 100vw, 400px"
                                        />
                                    </div>
                                </div>

                                {/* Experience Badge - Pinned Cleanly Without Cutoff */}
                                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full shadow-lg shadow-[var(--color-primary)]/20 border-2 border-[var(--color-surface)]">
                                    <Award className="w-4 h-4 fill-current" />
                                    <span>{activeInstructor.experience || "10+ năm"} kinh nghiệm</span>
                                </div>
                            </div>

                            {/* Right: Bio & Standout Single-Column Achievements */}
                            <div className="lg:col-span-7 space-y-5">
                                <div>
                                    <div className="inline-block px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-xs rounded-lg mb-2">
                                        {activeInstructor.role}
                                    </div>
                                    <h3 className="heading-3 text-[var(--color-text)]">
                                        {activeInstructor.name}
                                    </h3>
                                    <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-1">
                                        {activeInstructor.title}
                                    </p>
                                </div>

                                {activeInstructor.quote && (
                                    <blockquote className="p-3.5 bg-[var(--color-background)] border-l-4 border-[var(--color-primary)] rounded-r-xl relative text-xs italic text-[var(--color-text-secondary)] leading-relaxed flex items-start gap-2">
                                        <Quote className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                                        <span>&ldquo;{activeInstructor.quote}&rdquo;</span>
                                    </blockquote>
                                )}

                                {/* Bio Paragraphs */}
                                <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {activeInstructor.fullBio
                                        ? activeInstructor.fullBio.split("\n\n").map((para: string, i: number) => (
                                              <p key={i}>{para}</p>
                                          ))
                                        : <p>{activeInstructor.bio}</p>
                                    }
                                </div>

                                {/* ========================================================= */}
                                {/* THÀNH TỰU & KINH NGHIỆM - 1 CỘT NỔI BẬT THEO YÊU CẦU */}
                                {/* ========================================================= */}
                                <div className="pt-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center">
                                            <Award className="w-3.5 h-3.5" />
                                        </div>
                                        <h4 className="font-heading font-bold text-xs text-[var(--color-text)]">
                                            Thành tựu & Kinh nghiệm nổi bật
                                        </h4>
                                    </div>

                                    {/* 1 CỘT DUY NHẤT (Single Column List) - Thiết kế Card nổi bật */}
                                    <div className="flex flex-col gap-2.5">
                                        {activeInstructor.achievements && activeInstructor.achievements.map((item: string, i: number) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 p-3 bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 rounded-xl transition-all shadow-sm group"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-semibold text-[var(--color-text)] leading-snug">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Khóa học phụ trách */}
                                {activeInstructor.courses && activeInstructor.courses.length > 0 && (
                                    <div className="pt-2 border-t border-[var(--color-border)]/60">
                                        <div className="flex items-center gap-2 mb-2.5">
                                            <BookOpen className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                            <span className="text-[11px] font-bold text-[var(--color-text-muted)]">
                                                Khóa học trực tiếp phụ trách
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {activeInstructor.courses.map((course: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-xs rounded-xl border border-[var(--color-primary)]/20"
                                                >
                                                    {course}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Stats Banner - Compact */}
            <section className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-[var(--color-orange-600)] to-[var(--color-orange-500)] rounded-3xl text-white shadow-xl shadow-[var(--color-orange-600)]/15">
                    {initialStats.map((stat, index) => (
                        <div key={index} className="text-center p-2">
                            <div className="heading-3 text-white font-extrabold">
                                {stat.value}{stat.suffix}
                            </div>
                            <div className="text-xs text-white/90 font-medium mt-0.5">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section - Sleek & Compact */}
            <section className="container">
                <div className="p-8 md:p-10 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl relative overflow-hidden">
                    <div className="max-w-xl mx-auto space-y-4">
                        <h2 className="heading-3 text-[var(--color-text)]">
                            Sẵn sàng khởi nghiệp kinh doanh ẩm thực?
                        </h2>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                            Nhận tư vấn 1-1 miễn phí từ đội ngũ chuyên gia để chọn khóa học và định hướng mô hình quán phù hợp nhất.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                            <Link href="/khoa-hoc" className="btn btn-primary btn-sm">
                                Khám phá khóa học <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/lien-he" className="btn btn-secondary btn-sm">
                                Đăng ký tư vấn miễn phí
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
