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
} from "lucide-react";

interface AboutUsClientProps {
    initialStats: any[];
    initialInstructors: any[];
}

export default function AboutUsClient({ initialStats, initialInstructors }: AboutUsClientProps) {
    const [aboutContent, setAboutContent] = useState({
        aboutHeroTitle: "DuaxCar Kitchen - Nơi đam mê trở thành nghề nghiệp",
        aboutHeroSubtitle: "Chúng tôi không chỉ dạy nấu ăn - chúng tôi truyền lửa, truyền văn hóa và tư duy làm nghề bền vững.",
        aboutStoryTitle: "Từ đam mê đến sứ mệnh",
        aboutStoryContent: "DuaxCar Kitchen được sinh ra từ một mong muốn đơn giản: Giúp những ai yêu thích ẩm thực Việt có thể biến đam mê thành nghề nghiệp bền vững.\n\nChúng tôi hiểu rằng để một quán ăn thành công, không chỉ cần món ăn ngon mà còn cần tư duy kinh doanh đúng đắn. Vì vậy, ngoài việc dạy kỹ thuật nấu nướng, chúng tôi còn chia sẻ kinh nghiệm vận hành, quản lý chi phí và xây dựng thương hiệu.\n\nVới đội ngũ giảng viên là những nghệ nhân ẩm thực được vinh danh, DuaxCar Kitchen tự hào là địa chỉ tin cậy cho những ai muốn khởi nghiệp trong lĩnh vực F&B.",
        aboutStoryImage: "/images/about/mission-v6.jpg",
        aboutVision: "Trở thành trung tâm đào tạo ẩm thực Việt hàng đầu, nơi mỗi học viên không chỉ học được công thức mà còn được trang bị đầy đủ kiến thức và kỹ năng để thành công trong ngành F&B.",
        aboutMission: "Gìn giữ và phát triển ẩm thực Việt thông qua việc đào tạo thế hệ đầu bếp mới. Giúp học viên hiểu sâu về văn hóa ẩm thực, nắm vững kỹ thuật và có tư duy kinh doanh bền vững."
    });

    const [instructors, setInstructors] = useState<any[]>(initialInstructors);

    useEffect(() => {
        const localSettings = localStorage.getItem("admin_settings");
        if (localSettings) {
            try {
                const parsed = JSON.parse(localSettings);
                setAboutContent(prev => ({
                    ...prev,
                    aboutHeroTitle: parsed.aboutHeroTitle || prev.aboutHeroTitle,
                    aboutHeroSubtitle: parsed.aboutHeroSubtitle || prev.aboutHeroSubtitle,
                    aboutStoryTitle: parsed.aboutStoryTitle || prev.aboutStoryTitle,
                    aboutStoryContent: parsed.aboutStoryContent || prev.aboutStoryContent,
                    aboutStoryImage: parsed.aboutStoryImage || prev.aboutStoryImage,
                    aboutVision: parsed.aboutVision || prev.aboutVision,
                    aboutMission: parsed.aboutMission || prev.aboutMission
                }));
            } catch (e) {
                console.error("Error parsing settings:", e);
            }
        }

        const localInstructors = localStorage.getItem("admin_instructors");
        if (localInstructors) {
            try {
                setInstructors(JSON.parse(localInstructors));
            } catch (e) {
                console.error("Error parsing instructors:", e);
            }
        } else {
            localStorage.setItem("admin_instructors", JSON.stringify(initialInstructors));
        }
    }, [initialInstructors]);

    const timeline = [
        {
            year: "2015",
            title: "Khởi đầu hành trình",
            description: "Bắt đầu từ những lớp học nhỏ, chia sẻ kinh nghiệm nấu ăn cho bạn bè, gia đình.",
        },
        {
            year: "2018",
            title: "Mở rộng quy mô",
            description: "Chính thức thành lập trung tâm đào tạo, mở các lớp học bài bản.",
        },
        {
            year: "2019",
            title: "Vinh danh nghệ nhân",
            description: "Thầy Nguyễn Hữu Thọ được vinh danh Nghệ nhân ẩm thực Bún bò Huế tại Lễ hội Vingroup.",
        },
        {
            year: "2022",
            title: "DuaxCar Kitchen ra đời",
            description: "Thành lập DuaxCar Kitchen với đội ngũ giảng viên chuyên nghiệp, cơ sở vật chất hiện đại.",
        },
        {
            year: "2024",
            title: "Phát triển bền vững",
            description: "Đào tạo hơn 500 học viên, hỗ trợ mở hơn 50 quán ăn thành công trên toàn quốc.",
        },
    ];

    const whyChooseUs = [
        {
            icon: Award,
            title: "Nghệ nhân ẩm thực",
            description: "Học từ những đầu bếp được vinh danh, có hàng chục năm kinh nghiệm.",
            color: "bg-orange-500/10 text-orange-500 border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white"
        },
        {
            icon: ChefHat,
            title: "Thực chiến 100%",
            description: "Chương trình đào tạo sát thực tế, học xong có thể mở quán ngay.",
            color: "bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white"
        },
        {
            icon: Users,
            title: "Lớp học nhỏ",
            description: "Tối đa 6-10 học viên/lớp, đảm bảo được hướng dẫn tận tình.",
            color: "bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white"
        },
        {
            icon: HeartHandshake,
            title: "Hỗ trợ trọn đời",
            description: "Tư vấn miễn phí sau khóa học, hỗ trợ mô hình kinh doanh.",
            color: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white"
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gray-900)] via-[var(--color-gray-800)] to-[var(--color-gray-900)]" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--color-orange-500)]/20 rounded-full blur-3xl" />

                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
                            <Users className="w-4 h-4" />
                            <span>Về DuaxCar</span>
                        </div>
                        <h1 className="heading-1 text-[var(--color-text)] mt-4 mb-6">
                            {aboutContent.aboutHeroTitle}
                        </h1>
                        <p className="text-body-lg text-[var(--color-text-secondary)] animate-fadeIn">
                            {aboutContent.aboutHeroSubtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="section bg-[var(--color-surface)]">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                                Câu Chuyện
                            </span>
                            <h2 className="heading-2 text-[var(--color-text)] mt-2 mb-6">
                                {aboutContent.aboutStoryTitle}
                            </h2>
                            <div className="space-y-4 text-[var(--color-text-secondary)] whitespace-pre-line">
                                {aboutContent.aboutStoryContent}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={aboutContent.aboutStoryImage}
                                    alt={aboutContent.aboutStoryTitle}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--color-primary)]/20 rounded-full blur-2xl -z-10" />
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--color-orange-500)]/20 rounded-full blur-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="section">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Vision */}
                        <div className="card p-8 card-glow">
                            <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center mb-6">
                                <Eye className="w-7 h-7 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="heading-3 text-[var(--color-text)] mb-4">
                                Tầm nhìn
                            </h3>
                            <p className="text-[var(--color-text-secondary)]">
                                {aboutContent.aboutVision}
                            </p>
                        </div>

                        {/* Mission */}
                        <div className="card p-8 card-glow">
                            <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center mb-6">
                                <Target className="w-7 h-7 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="heading-3 text-[var(--color-text)] mb-4">
                                Sứ mệnh
                            </h3>
                            <p className="text-[var(--color-text-secondary)]">
                                {aboutContent.aboutMission}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section bg-[var(--color-surface)]">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                            Hành Trình
                        </span>
                        <h2 className="heading-2 text-[var(--color-text)] mt-2">
                            Những cột mốc quan trọng
                        </h2>
                    </div>

                    <div className="relative">
                        <div className="absolute top-[39px] left-16 right-16 h-[2px] bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-primary)]/50 to-[var(--color-primary)]/10 hidden lg:block" />

                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
                            {timeline.map((item) => (
                                <div key={item.year} className="relative flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-primary)] flex items-center justify-center mb-6 relative z-10 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-[var(--color-primary)]/5 group-hover:shadow-[var(--color-primary)]/20">
                                        <span className="font-heading font-bold text-lg text-[var(--color-primary)]">
                                            {item.year}
                                        </span>
                                    </div>

                                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-start">
                                        <h3 className="font-heading font-semibold text-[var(--color-text)] text-base mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                            Tại Sao Chọn Chúng Tôi
                        </span>
                        <h2 className="heading-2 text-[var(--color-text)] mt-2">
                            Điều làm nên sự khác biệt
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyChooseUs.map((item, index) => {
                            const IconComponent = item.icon;
                            const colorClass = item.color;
                            return (
                                <div key={index} className="card p-8 card-glow group h-full flex flex-col items-center text-center border border-[var(--color-border)] hover:border-[var(--color-primary)]/25 hover:shadow-2xl transition-all duration-300 rounded-[2rem]">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${colorClass}`}>
                                        <IconComponent className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Instructors Section */}
            <section className="section bg-[var(--color-surface)]" id="giang-vien">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                            Đội Ngũ Giảng Viên
                        </span>
                        <h2 className="heading-2 text-[var(--color-text)] mt-2">
                            Học từ những người giỏi nhất
                        </h2>
                        <p className="text-body text-[var(--color-text-secondary)] mt-4">
                            Đội ngũ giảng viên của chúng tôi là những nghệ nhân ẩm thực được vinh danh, với hàng chục năm kinh nghiệm thực chiến trong ngành F&B.
                        </p>
                    </div>

                    <div className="space-y-24">
                        {instructors.filter(ins => ins.visible !== false).map((instructor, index) => (
                            <div
                                key={instructor.id}
                                id={instructor.id}
                                className={`grid lg:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                            >
                                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                                    <div className="relative">
                                        <div className="aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden relative pt-8 px-8 pb-0 flex items-end justify-center bg-white">
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={instructor.image}
                                                    alt={instructor.name}
                                                    fill
                                                    className={`object-cover ${
                                                        instructor.imageAlign === "top" ? "object-top" :
                                                        instructor.imageAlign === "bottom" ? "object-bottom" :
                                                        "object-center"
                                                    }`}
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                            </div>
                                            <div
                                                className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-10"
                                                style={{
                                                    background: "linear-gradient(to top, var(--color-surface) 0%, rgba(255, 255, 255, 0) 100%)",
                                                }}
                                            />
                                        </div>
                                        <div className="absolute bottom-4 right-4 lg:right-auto lg:left-4 bg-[var(--color-primary)] text-white font-bold text-sm py-1.5 px-3 rounded-full shadow-xl shadow-[var(--color-primary)]/30 border-2 border-[var(--color-surface)] flex items-center gap-1.5">
                                            <Award className="w-4 h-4 fill-current" />
                                            <span>{instructor.experience} kinh nghiệm</span>
                                        </div>
                                        <div className="absolute -bottom-4 -right-4 lg:-right-8 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-2xl" />
                                    </div>
                                </div>

                                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                                    <div className="inline-block badge badge-primary mb-4">
                                        {instructor.role}
                                    </div>
                                    <h2 className="heading-2 text-[var(--color-text)] mb-2">
                                        {instructor.name}
                                    </h2>
                                    <p className="text-[var(--color-primary)] font-medium mb-6">
                                        {instructor.title}
                                    </p>

                                    {instructor.quote && (
                                        <blockquote className="relative pl-6 py-4 mb-6 border-l-4 border-[var(--color-primary)] bg-[var(--color-surface)] rounded-r-xl">
                                            <Quote className="absolute -top-2 left-2 w-6 h-6 text-[var(--color-primary)]/30" />
                                            <p className="italic text-[var(--color-text-secondary)]">
                                                &ldquo;{instructor.quote}&rdquo;
                                            </p>
                                        </blockquote>
                                    )}

                                    <div className="prose prose-invert max-w-none mb-8">
                                        {instructor.fullBio?.split("\n\n").map((paragraph: string, i: number) => (
                                            <p key={i} className="text-[var(--color-text-secondary)] mb-4">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="font-heading font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-[var(--color-primary)]" />
                                            Thành tựu & Kinh nghiệm
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {instructor.achievements.map((achievement: string, i: number) => (
                                                <div key={i} className="flex items-start gap-2 p-3 bg-[var(--color-surface)] rounded-lg">
                                                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
                                                    <span className="text-small text-[var(--color-text-secondary)]">
                                                        {achievement}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-heading font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                                            Khóa học phụ trách
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {instructor.courses.map((course: string, i: number) => (
                                                <span key={i} className="px-3 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg text-small">
                                                    {course}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="section bg-[var(--color-orange-600)] pattern-light">
                <div className="container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {initialStats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="heading-1 text-white mb-2">
                                    {stat.value}
                                    {stat.suffix}
                                </div>
                                <div className="text-white/80">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="container">
                    <div className="card p-12 text-center bg-gradient-to-br from-[var(--color-gray-800)] to-[var(--color-gray-900)]">
                        <h2 className="heading-2 text-[var(--color-text)] mb-4">
                            Sẵn sàng bắt đầu hành trình ẩm thực?
                        </h2>
                        <p className="text-body-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
                            Đăng ký tư vấn miễn phí để tìm hiểu khóa học phù hợp với mục tiêu của bạn.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/khoa-hoc" className="btn btn-primary btn-lg">
                                Xem các khóa học
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/lien-he" className="btn btn-secondary btn-lg">
                                Liên hệ tư vấn
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
