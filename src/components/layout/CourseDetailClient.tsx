"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    ChefHat,
    Clock,
    Users,
    ArrowRight,
    CheckCircle,
    ArrowLeft,
    Play,
    BookOpen,
    Lock,
    Award,
    X,
    Camera,
    ZoomIn,
    Images,
    Sparkles,
    Film,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { CourseAccordion } from "@/components/ui/course-accordion";
import { instructors, courseCategories } from "@/data/mock";
import CategoryIcon from "@/components/category-icon";
import CourseRegistrationForm from "@/components/layout/course-registration-form";
import { Course } from "@/lib/types";
import { formatPrice, getVideoEmbedInfo } from "@/lib/utils";

interface CourseDetailClientProps {
    slug: string;
    initialCourse: Course;
    initialRelatedCourses: Course[];
    initialInstructor: any;
    initialCategory: any;
}

export default function CourseDetailClient({
    slug,
    initialCourse,
    initialRelatedCourses,
    initialInstructor,
    initialCategory
}: CourseDetailClientProps) {
    const [course, setCourse] = useState<Course>(initialCourse);
    const [relatedCourses, setRelatedCourses] = useState<Course[]>(initialRelatedCourses);
    const [instructor, setInstructor] = useState(initialInstructor);
    const [category, setCategory] = useState(initialCategory);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
    const [showAllGallery, setShowAllGallery] = useState(false);

    const galleryList = course.gallery || [];

    // Ensure page always starts at top on initial render & slug changes
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [slug]);

    // Keyboard navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeGalleryIndex === null || galleryList.length === 0) return;
            if (e.key === "ArrowRight") {
                setActiveGalleryIndex((prev) => (prev !== null ? (prev + 1) % galleryList.length : 0));
            } else if (e.key === "ArrowLeft") {
                setActiveGalleryIndex((prev) => (prev !== null ? (prev - 1 + galleryList.length) % galleryList.length : 0));
            } else if (e.key === "Escape") {
                setActiveGalleryIndex(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeGalleryIndex, galleryList.length]);

    // Sync state with props when server sends new data
    useEffect(() => {
        setCourse(initialCourse);
        setRelatedCourses(initialRelatedCourses);
        setInstructor(initialInstructor);
        setCategory(initialCategory);
    }, [initialCourse, initialRelatedCourses, initialInstructor, initialCategory]);

    useEffect(() => {
        const updateCourseData = (parsed: Course[]) => {
            const found = parsed.find((c) => c.slug === slug || c.id === initialCourse.id);
            if (found) {
                setCourse(found);
                
                // Update related courses dynamically based on updated category/id
                const filtered = parsed
                    .filter((c) => c.category === found.category && c.id !== found.id)
                    .slice(0, 3);
                setRelatedCourses(filtered);

                // Update instructor state
                const foundInst = instructors.find((i) => i.id === found.instructorId || i.name === found.instructor);
                if (foundInst) setInstructor(foundInst);

                // Update category state
                const foundCat = courseCategories.find((c) => c.id === found.category);
                if (foundCat) setCategory(foundCat);
            }
        };

        // Fetch fresh live CMS data without HTTP caching
        fetch('/api/cms/courses', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data.courses && Array.isArray(data.courses)) {
                    updateCourseData(data.courses);
                }
            })
            .catch(() => {});
    }, [slug, initialCourse.id]);

    const isElearning = course.courseType === "elearning";

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(value);
    };

    return (
        <>
            {/* Breadcrumb */}
            <section className="py-4 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <div className="container">
                    <div className="flex items-center gap-2 text-small">
                        {isElearning ? (
                            <Link
                                href="/khoa-hoc?type=elearning"
                                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Khóa học Online
                            </Link>
                        ) : (
                            <Link
                                href="/khoa-hoc?type=onsite"
                                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Khóa học Trực tiếp
                            </Link>
                        )}
                        <span className="text-[var(--color-text-muted)]">/</span>
                        <span className="text-[var(--color-text)]">{course.name}</span>
                    </div>
                </div>
            </section>

            {/* Hero */}
            <section className="section-sm bg-[var(--color-surface)]/40 border-b border-[var(--color-border)]">
                <div className="container">
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Image Card */}
                        <div className="lg:col-span-5">
                            <div className="relative rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] group">
                                <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden">
                                    {course.image || category?.image ? (
                                        <Image
                                            src={course.image || category?.image || ""}
                                            alt={course.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <ChefHat className="w-20 h-20 text-[var(--color-text-muted)]" />
                                    )}

                                    {/* Video Play Button Overlay if videoUrl is configured */}
                                    {course.videoUrl ? (
                                        <button
                                            type="button"
                                            onClick={() => setVideoModalOpen(true)}
                                            className="absolute inset-0 flex flex-col items-center justify-center group/play cursor-pointer transition-colors bg-black/25 hover:bg-black/40"
                                            title="Bấm để xem video giới thiệu khóa học"
                                        >
                                            <div className="relative flex items-center justify-center">
                                                <div className="absolute w-16 h-16 rounded-full bg-red-500/30 animate-ping" />
                                                <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 text-white flex items-center justify-center group-hover/play:scale-115 transition-transform duration-300 border-2 border-white/90 shadow-2xl">
                                                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                                                </div>
                                            </div>
                                            <span className="mt-2.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center gap-1.5 border border-white/20 shadow-lg group-hover/play:bg-black/90 transition">
                                                <Film className="w-3 h-3 text-orange-400" />
                                                <span>Xem Video thực tế</span>
                                            </span>
                                        </button>
                                    ) : null}
                                </div>
                                
                                {/* Badges on Top-Left */}
                                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                                    {isElearning ? (
                                        <span className="px-2.5 py-1 rounded-md bg-purple-600 text-white flex items-center gap-1 font-medium text-xs">
                                            <Play className="w-3 h-3 fill-current" />
                                            Khóa Online
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-md bg-green-600 text-white flex items-center gap-1 font-medium text-xs">
                                            <Users className="w-3 h-3 fill-current" />
                                            Trực tiếp
                                        </span>
                                    )}
                                    {course.featured && (
                                        <span className="px-2.5 py-1 rounded-md bg-[var(--color-primary)] text-white font-medium text-xs">
                                            Nổi bật
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Course Info */}
                        <div className="lg:col-span-7 space-y-5">
                            {/* Title & Category */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)]">
                                        <CategoryIcon id={course.category} className="w-3.5 h-3.5" />
                                        <span>{category?.name || "Món ăn sáng"}</span>
                                    </span>
                                    <span className="text-[var(--color-text-muted)]">•</span>
                                    <span className="text-xs text-[var(--color-text-secondary)]">
                                        {isElearning ? "Khóa học Online" : "Khóa học Trực tiếp"}
                                    </span>
                                </div>

                                <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[var(--color-text)] mb-2">
                                    {course.name}
                                </h1>

                                {course.description && (
                                    <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                                        {course.description}
                                    </p>
                                )}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {isElearning ? (
                                    <>
                                        <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500 flex-shrink-0">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--color-text-muted)]">Số bài học</div>
                                                <div className="font-semibold text-sm text-[var(--color-text)]">{course.totalLessons || 5} video</div>
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500 flex-shrink-0">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--color-text-muted)]">Thời lượng</div>
                                                <div className="font-semibold text-sm text-[var(--color-text)]">{course.totalDuration || course.duration || "14 giờ"}</div>
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3 col-span-2 sm:col-span-1">
                                            <div className="p-2.5 rounded-lg bg-green-500/10 text-green-500 flex-shrink-0">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--color-text-muted)]">Truy cập</div>
                                                <div className="font-semibold text-sm text-green-600 dark:text-green-400">{course.accessDuration || "Trọn đời"}</div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex-shrink-0">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--color-text-muted)]">Thời lượng</div>
                                                <div className="font-semibold text-sm text-[var(--color-text)]">{course.duration}</div>
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex-shrink-0">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--color-text-muted)]">Quy mô lớp</div>
                                                <div className="font-semibold text-sm text-[var(--color-text)]">Tối đa {course.maxStudents || 8} học viên</div>
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3 col-span-2 sm:col-span-1">
                                            <div className="p-2.5 rounded-lg bg-green-500/10 text-green-500 flex-shrink-0">
                                                <ChefHat className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--color-text-muted)]">Hình thức</div>
                                                <div className="font-semibold text-sm text-[var(--color-text)]">Thực hành 100%</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Instructor Info */}
                            {instructor && (
                                <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                            <ChefHat className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-[var(--color-text-muted)]">
                                                Giảng viên đứng lớp
                                            </div>
                                            <div className="font-semibold text-sm text-[var(--color-text)]">
                                                {instructor.name}
                                            </div>
                                            <div className="text-xs text-[var(--color-primary)] font-medium">
                                                {instructor.role}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md bg-[var(--color-background)] text-xs text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                                        <span>Bếp trưởng thực chiến</span>
                                    </div>
                                </div>
                            )}

                            {/* Price & Action Card */}
                            {isElearning ? (
                                <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                            Học phí trực tuyến (E-Learning)
                                        </div>
                                        <div className="font-heading font-bold text-2xl sm:text-3xl text-[var(--color-text)]">
                                            {course.contactForPrice ? "Liên hệ tư vấn" : (course.price ? formatPrice(course.price) : "Liên hệ")}
                                        </div>
                                        <div className="text-xs text-[var(--color-text-secondary)] font-medium pt-0.5">
                                            ✓ Học ngay lập tức • Xem lại bài giảng trọn đời
                                        </div>
                                    </div>
                                    <a
                                        href={course.onlineUrl || "https://academy.duaxcar.com/"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 flex-shrink-0"
                                    >
                                        <span>Vào học Online</span>
                                        <Play className="w-4 h-4 fill-current" />
                                    </a>
                                </div>
                            ) : (
                                <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="text-xs font-medium text-[var(--color-primary)]">
                                            Học phí đào tạo trực tiếp
                                        </div>
                                        <div className="font-heading font-bold text-2xl sm:text-3xl text-[var(--color-text)]">
                                            {course.contactForPrice ? "Liên hệ tư vấn" : formatPrice(course.price)}
                                        </div>
                                        <div className="text-xs text-[var(--color-text-secondary)] font-medium pt-0.5">
                                            ✓ Thực hành 1 kèm 1 • Hỗ trợ công thức mở quán
                                        </div>
                                    </div>
                                    <Link 
                                        href="#dang-ky" 
                                        className="btn btn-primary font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 flex-shrink-0"
                                    >
                                        <span>Đăng ký giữ chỗ</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Details */}
            <section className="section bg-[var(--color-background)]">
                <div className="container">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div className="mb-12">
                                <h2 className="heading-3 text-[var(--color-text)] mb-6">
                                    {isElearning ? "Bạn sẽ học được gì?" : "Điểm nổi bật của khóa học"}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {course.highlights && course.highlights.map((highlight, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-4 bg-[var(--color-surface)] rounded-xl"
                                        >
                                            <CheckCircle className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                                            <span className="text-[var(--color-text)]">
                                                {highlight}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-12">
                                <h2 className="heading-3 text-[var(--color-text)] mb-6">
                                    {isElearning ? "Nội dung bài học" : "Nội dung khóa học"}
                                </h2>
                                <CourseAccordion
                                    items={course.curriculum || []}
                                    type={isElearning ? "elearning" : "onsite"}
                                />
                            </div>

                            {/* Classroom & Workshop Photos Gallery */}
                            {galleryList.length > 0 && (
                                <div className="mb-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="heading-3 text-[var(--color-text)] flex items-center gap-2.5">
                                                <Camera className="w-6 h-6 text-[var(--color-primary)]" />
                                                <span>Hình ảnh lớp học & Thực hành</span>
                                            </h2>
                                            <p className="text-small text-[var(--color-text-secondary)] mt-1">
                                                Không gian bếp đào tạo chuẩn thực chiến, quá trình hướng dẫn 1 kèm 1 và thành phẩm của học viên.
                                            </p>
                                        </div>
                                        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                                            {galleryList.length} hình ảnh
                                        </span>
                                    </div>

                                    {/* Layout based on image count */}
                                    {galleryList.length === 1 ? (
                                        /* 1 Image: Large Widescreen Highlight */
                                        <div
                                            onClick={() => setActiveGalleryIndex(0)}
                                            className="group relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-neutral-900 border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-all duration-300 shadow-md hover:shadow-xl"
                                        >
                                            <Image
                                                src={galleryList[0]}
                                                alt={`${course.name} - Ảnh lớp học thực tế`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 800px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-4 sm:p-6">
                                                <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-2 bg-neutral-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/25 shadow-lg">
                                                    <ZoomIn className="w-4 h-4 text-orange-400" /> Bấm để xem toàn màn hình
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold shadow-md">
                                                    Không gian lớp học thực tế
                                                </span>
                                            </div>
                                        </div>
                                    ) : galleryList.length === 2 ? (
                                        /* 2 Images: 2 Balanced Columns */
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {galleryList.map((imgUrl, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => setActiveGalleryIndex(idx)}
                                                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-lg"
                                                >
                                                    <Image
                                                        src={imgUrl}
                                                        alt={`${course.name} - Ảnh lớp học ${idx + 1}`}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 400px"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5">
                                                        <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-neutral-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 shadow-md">
                                                            <ZoomIn className="w-3.5 h-3.5 text-orange-400" /> Phóng to
                                                        </span>
                                                        <span className="px-2.5 py-1 rounded-full bg-neutral-900/85 backdrop-blur-md border border-white/25 text-[11px] text-white font-bold font-mono shadow-md">
                                                            #{idx + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* 3+ Images: Adaptive Grid with Lazy-loading & Show More overlay */
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                                {(showAllGallery ? galleryList : galleryList.slice(0, 6)).map((imgUrl, idx) => {
                                                    const isSixthWithMore = !showAllGallery && idx === 5 && galleryList.length > 6;
                                                    const remainingCount = galleryList.length - 5;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            onClick={() => setActiveGalleryIndex(idx)}
                                                            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-lg"
                                                        >
                                                            <Image
                                                                src={imgUrl}
                                                                alt={`${course.name} - Ảnh lớp học ${idx + 1}`}
                                                                fill
                                                                loading="lazy"
                                                                sizes="(max-width: 768px) 50vw, 300px"
                                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />

                                                            {isSixthWithMore ? (
                                                                <div 
                                                                    style={{ backgroundColor: "rgba(10, 10, 15, 0.88)" }}
                                                                    className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center text-white p-3 text-center transition group-hover:!bg-black/95 border border-white/20"
                                                                >
                                                                    <Images className="w-7 h-7 text-[var(--color-primary)] mb-1.5 group-hover:scale-110 transition-transform drop-shadow" />
                                                                    <span className="font-heading font-extrabold text-base sm:text-xl text-white drop-shadow-md">+{remainingCount} ảnh</span>
                                                                    <span className="inline-flex items-center gap-1 mt-1.5 px-3 py-0.5 rounded-full bg-white/15 text-[11px] text-orange-200 font-semibold border border-white/20 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                                                                        Xem tất cả <ArrowRight className="w-3 h-3" />
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5">
                                                                    <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-neutral-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 shadow-md">
                                                                        <ZoomIn className="w-3.5 h-3.5 text-orange-400" /> Phóng to
                                                                    </span>
                                                                    <span className="px-2.5 py-1 rounded-full bg-neutral-900/85 backdrop-blur-md border border-white/25 text-[11px] text-white font-bold font-mono shadow-md">
                                                                        #{idx + 1}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Expand / Collapse Button for 7+ photos */}
                                            {galleryList.length > 6 && (
                                                <div className="text-center pt-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAllGallery(!showAllGallery)}
                                                        className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-light)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text)] hover:text-[var(--color-primary)] transition-all cursor-pointer shadow-sm hover:shadow-md"
                                                    >
                                                        {showAllGallery ? (
                                                             <>
                                                                <ChevronUp className="w-4 h-4 text-[var(--color-primary)]" />
                                                                <span>Thu gọn bớt ảnh</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-4 h-4 text-[var(--color-primary)]" />
                                                                <span>Xem toàn bộ {galleryList.length} ảnh lớp học</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {instructor && (
                                <div>
                                    <h2 className="heading-3 text-[var(--color-text)] mb-6">
                                        Về giảng viên
                                    </h2>
                                    <div className="card p-6">
                                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                                            <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-border)] overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                                {instructor.image ? (
                                                    <Image
                                                        src={instructor.image}
                                                        alt={instructor.name}
                                                        fill
                                                        className="object-cover object-top"
                                                    />
                                                ) : (
                                                    <ChefHat className="w-10 h-10 text-[var(--color-primary)]" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <h3 className="heading-4 text-[var(--color-text)]">
                                                        {instructor.name}
                                                    </h3>
                                                    <p className="text-xs font-semibold text-[var(--color-primary)]">
                                                        {instructor.role} {instructor.title ? `• ${instructor.title}` : ''}
                                                    </p>
                                                </div>
                                                <p className="text-small text-[var(--color-text-secondary)] leading-relaxed">
                                                    {instructor.bio}
                                                </p>
                                                {instructor.achievements && instructor.achievements.length > 0 && (
                                                    <div className="flex flex-col gap-2 pt-1">
                                                        {instructor.achievements.map((a: string, i: number) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center gap-2.5 p-2.5 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text)] font-medium"
                                                            >
                                                                <Award className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                                <span>{a}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="card p-6">
                                    <h3 className="font-heading font-semibold text-[var(--color-text)] mb-4">
                                        Thông tin khóa học
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-text-secondary)]">
                                                Học phí:
                                            </span>
                                            <span className="font-bold text-[var(--color-primary)]">
                                                {course.contactForPrice ? "Liên hệ tư vấn" : formatPrice(course.price)}
                                            </span>
                                        </div>
                                        {isElearning ? (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-text-secondary)]">
                                                        Số bài học:
                                                    </span>
                                                    <span className="text-[var(--color-text)]">
                                                        {course.totalLessons} video
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-text-secondary)]">
                                                        Thời lượng:
                                                    </span>
                                                    <span className="text-[var(--color-text)]">
                                                        {course.totalDuration}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-text-secondary)]">
                                                        Truy cập:
                                                    </span>
                                                    <span className="text-green-400 font-medium">
                                                        {course.accessDuration}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-text-secondary)]">
                                                        Thời lượng:
                                                    </span>
                                                    <span className="text-[var(--color-text)]">
                                                        {course.duration}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--color-text-secondary)]">
                                                        Số lượng:
                                                    </span>
                                                    <span className="text-[var(--color-text)]">
                                                        {course.maxStudents} học viên
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-text-secondary)]">
                                                Giảng viên:
                                            </span>
                                            <span className="text-[var(--color-text)]">
                                                {course.instructor}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-[var(--color-border)]" />
                                    {isElearning ? (
                                        <a
                                            href={course.onlineUrl || "https://academy.duaxcar.com/"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn bg-purple-600 hover:bg-purple-700 text-white w-full text-center flex items-center justify-center gap-2 font-bold shadow-md"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            <span>Học Online Ngay</span>
                                        </a>
                                    ) : (
                                        <Link href="#dang-ky" className="btn btn-primary w-full text-center flex items-center justify-center gap-2 font-bold shadow-md">
                                            <span>Đăng ký tư vấn</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>

                                <div className="card p-6">
                                    <h3 className="font-heading font-semibold text-[var(--color-text)] mb-3">
                                        Cần hỗ trợ?
                                    </h3>
                                    <p className="text-small text-[var(--color-text-secondary)] mb-4">
                                        Liên hệ với chúng tôi để được tư vấn chi tiết về khóa học.
                                    </p>
                                    <a
                                        href="tel:0901234567"
                                        className="btn btn-secondary w-full"
                                    >
                                        Gọi: 090 123 4567
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registration / Inquiry Form */}
            <CourseRegistrationForm 
                courseName={course.name} 
                courseType={course.courseType} 
                onlineUrl={course.onlineUrl} 
            />

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
                <section className="section bg-[var(--color-surface)]/50">
                    <div className="container">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="heading-2 text-[var(--color-text)]">
                                Khóa học tương tự
                            </h2>
                            <Link
                                href="/khoa-hoc"
                                className="btn btn-ghost"
                            >
                                Xem thêm
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedCourses.map((relatedCourse) => {
                                const isRelatedElearning = relatedCourse.courseType === "elearning";
                                return (
                                    <Link
                                        key={relatedCourse.id}
                                        href={`/khoa-hoc/${relatedCourse.slug}`}
                                        className="card card-glow group"
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 bg-[var(--color-surface-light)] overflow-hidden">
                                            <Image
                                                src={relatedCourse.image}
                                                alt={relatedCourse.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {/* Tags */}
                                            <div className="absolute top-3 left-3 flex gap-2 z-10">
                                                {isRelatedElearning ? (
                                                    <span className="badge bg-purple-600 text-white border-none flex items-center gap-1 font-bold shadow-md">
                                                        <Play className="w-3 h-3 fill-current" />
                                                        Online
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-green-600 text-white border-none flex items-center gap-1 font-bold shadow-md">
                                                        <Users className="w-3 h-3 fill-current" />
                                                        Trực tiếp
                                                    </span>
                                                )}
                                                {relatedCourse.featured && (
                                                    <span className="badge bg-[var(--color-primary)] text-white border-none font-bold shadow-md">
                                                        Nổi bật
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="font-heading font-semibold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 min-h-[3.5rem]">
                                                {relatedCourse.name}
                                            </h3>
                                            <p className="text-small text-[var(--color-text-muted)] mb-4 line-clamp-2">
                                                {relatedCourse.shortDescription}
                                            </p>

                                            {/* Meta */}
                                            <div className="flex items-center justify-between text-small pt-4 border-t border-[var(--color-border)]">
                                                <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{relatedCourse.duration}</span>
                                                </div>
                                                <div className="font-heading font-semibold text-[var(--color-primary)] text-xs">
                                                    Tư vấn & Đăng ký
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Video Modal Popup */}
            {videoModalOpen && course.videoUrl && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
                    onClick={() => setVideoModalOpen(false)}
                >
                    <div 
                        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setVideoModalOpen(false)}
                            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center transition border border-white/20"
                            title="Đóng video"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative aspect-video w-full flex items-center justify-center bg-black">
                            {(() => {
                                const videoInfo = getVideoEmbedInfo(course.videoUrl);
                                if (videoInfo.type === "youtube") {
                                    return (
                                        <iframe
                                            src={videoInfo.embedUrl}
                                            className="w-full h-full"
                                            title={course.name}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    );
                                }
                                if (videoInfo.type === "vimeo") {
                                    return (
                                        <iframe
                                            src={videoInfo.embedUrl}
                                            className="w-full h-full"
                                            title={course.name}
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            allowFullScreen
                                        />
                                    );
                                }
                                return (
                                    <video
                                        src={course.videoUrl}
                                        controls
                                        autoPlay
                                        playsInline
                                        preload="auto"
                                        poster={course.image}
                                        className="w-full h-full object-contain bg-black"
                                    >
                                        Trình duyệt của bạn không hỗ trợ phát video HTML5.
                                    </video>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Image Lightbox Modal with Next/Prev Slider & Thumbnails */}
            {activeGalleryIndex !== null && galleryList[activeGalleryIndex] && (
                <div 
                    style={{ backgroundColor: "rgba(9, 9, 11, 0.96)", color: "#ffffff" }}
                    className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-fadeIn select-none font-sans"
                    onClick={() => setActiveGalleryIndex(null)}
                >
                    <div 
                        className="relative max-w-5xl w-full flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top Action Bar */}
                        <div className="w-full flex items-center justify-between px-2 py-2 mb-2">
                            <div className="flex items-center gap-2.5">
                                <span className="px-3.5 py-1.5 rounded-full bg-neutral-900/90 text-white border border-white/20 text-xs font-bold shadow-lg flex items-center gap-1.5">
                                    <Images className="w-3.5 h-3.5 text-orange-400" />
                                    <span>Ảnh {activeGalleryIndex + 1} / {galleryList.length}</span>
                                </span>
                                <span className="hidden sm:inline text-xs text-neutral-400 font-medium">
                                    (Dùng phím ← / → chuyển ảnh, Esc để đóng)
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveGalleryIndex(null)}
                                className="w-10 h-10 rounded-full bg-neutral-900/90 hover:bg-red-600 text-white flex items-center justify-center transition border border-white/20 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
                                title="Đóng (Esc)"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Main Image Stage */}
                        <div className="relative w-full aspect-[16/10] max-h-[66vh] sm:max-h-[72vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-neutral-950 flex items-center justify-center">
                            <Image
                                src={galleryList[activeGalleryIndex]}
                                alt={`${course.name} - Ảnh ${activeGalleryIndex + 1}`}
                                fill
                                priority
                                sizes="(max-width: 1200px) 100vw, 1200px"
                                className="object-contain select-none pointer-events-none"
                            />

                            {/* Prev Arrow */}
                            {galleryList.length > 1 && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveGalleryIndex((prev) => (prev !== null ? (prev - 1 + galleryList.length) % galleryList.length : 0));
                                    }}
                                    style={{ backgroundColor: "rgba(20, 20, 24, 0.95)", borderColor: "rgba(255, 255, 255, 0.35)" }}
                                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white border-2 hover:!bg-orange-600 hover:!border-orange-500 shadow-[0_4px_30px_rgba(0,0,0,0.9)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md group"
                                    title="Ảnh trước (Phím ←)"
                                >
                                    <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[3] group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                            )}

                            {/* Next Arrow */}
                            {galleryList.length > 1 && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveGalleryIndex((prev) => (prev !== null ? (prev + 1) % galleryList.length : 0));
                                    }}
                                    style={{ backgroundColor: "rgba(20, 20, 24, 0.95)", borderColor: "rgba(255, 255, 255, 0.35)" }}
                                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white border-2 hover:!bg-orange-600 hover:!border-orange-500 shadow-[0_4px_30px_rgba(0,0,0,0.9)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md group"
                                    title="Ảnh kế tiếp (Phím →)"
                                >
                                    <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            )}
                        </div>

                        {/* Interactive Thumbnail Carousel Strip (when 2+ images) */}
                        {galleryList.length > 1 && (
                            <div className="w-full max-w-2xl flex items-center justify-center gap-2 overflow-x-auto py-2.5 px-2">
                                {galleryList.map((thumbUrl, tIdx) => {
                                    const isActive = tIdx === activeGalleryIndex;
                                    return (
                                        <button
                                            key={tIdx}
                                            type="button"
                                            onClick={() => setActiveGalleryIndex(tIdx)}
                                            className={`relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                                isActive 
                                                    ? "!border-orange-500 ring-2 ring-orange-500 scale-105 shadow-lg" 
                                                    : "border-white/20 opacity-50 hover:opacity-100 hover:border-white/60"
                                            }`}
                                            title={`Xem ảnh #${tIdx + 1}`}
                                        >
                                            <Image
                                                src={thumbUrl}
                                                alt={`Thumbnail #${tIdx + 1}`}
                                                fill
                                                sizes="56px"
                                                className="object-cover"
                                            />
                                            <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[9px] font-bold text-center text-white py-0.5">
                                                #{tIdx + 1}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Caption Bar */}
                        <div className="mt-1.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-white/20 text-xs text-neutral-200 flex items-center justify-center gap-2 shadow-lg max-w-xl mx-auto backdrop-blur-xs text-center">
                            <Camera className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            <span className="truncate">{course.name} • Hình ảnh đào tạo thực tế & thành phẩm học viên</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
