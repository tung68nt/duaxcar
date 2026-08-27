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
} from "lucide-react";
import { CourseAccordion } from "@/components/ui/course-accordion";
import { instructors, courseCategories } from "@/data/mock";
import CategoryIcon from "@/components/category-icon";
import CourseRegistrationForm from "@/components/layout/course-registration-form";
import { Course } from "@/lib/types";

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

        const localCourses = localStorage.getItem("admin_courses");
        if (localCourses) {
            try {
                const parsed: Course[] = JSON.parse(localCourses);
                updateCourseData(parsed);
            } catch {}
        }

        // Also fetch from live CMS API
        fetch('/api/cms/courses')
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
            <section className="section-sm bg-[var(--color-surface)] pattern-plus border-b border-[var(--color-border)]">
                <div className="container">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        {/* Left Column: Image Card */}
                        <div className="lg:col-span-5 xl:col-span-5">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-border)] bg-white dark:bg-gray-900 group">
                                <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden">
                                    {course.image || category?.image ? (
                                        <Image
                                            src={course.image || category?.image || ""}
                                            alt={course.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <ChefHat className="w-24 h-24 text-[var(--color-gray-600)]" />
                                    )}

                                    {/* Play Button Overlay for E-learning */}
                                    {isElearning && (
                                        <a
                                            href={course.onlineUrl || "https://academy.duaxcar.com/"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 flex items-center justify-center group/play cursor-pointer transition-all duration-300 hover:bg-black/15"
                                            title="Nhấp để vào học Online"
                                        >
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/90 text-white shadow-2xl flex items-center justify-center group-hover/play:scale-110 transition-transform duration-300 border-4 border-white/60 backdrop-blur-md">
                                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                                            </div>
                                        </a>
                                    )}
                                </div>
                                
                                {/* Badges on Top-Left */}
                                <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                                    {isElearning ? (
                                        <span className="px-3.5 py-1.5 rounded-xl bg-purple-600/95 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 font-bold text-xs shadow-xl">
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                            Khóa Online
                                        </span>
                                    ) : (
                                        <span className="px-3.5 py-1.5 rounded-xl bg-green-600/95 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 font-bold text-xs shadow-xl">
                                            <Users className="w-3.5 h-3.5 fill-current" />
                                            Trực tiếp
                                        </span>
                                    )}
                                    {course.featured && (
                                        <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/95 backdrop-blur-md text-white border border-white/20 font-bold text-xs shadow-xl">
                                            Nổi bật
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: High-End Course Showcase */}
                        <div className="lg:col-span-7 xl:col-span-7 space-y-5">
                            {/* Title & Category Header */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20 shadow-xs">
                                        <CategoryIcon id={course.category} className="w-3.5 h-3.5" />
                                        <span>{category?.name || "Món ẩm thực"}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-xs font-semibold border border-[var(--color-border)]">
                                        {isElearning ? "🎓 E-Learning Trực tuyến" : "🍳 Thực chiến tại bếp"}
                                    </span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--color-text)] tracking-tight mb-3">
                                    {course.name}
                                </h1>

                                {course.description && (
                                    <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
                                        {course.description}
                                    </p>
                                )}
                            </div>

                            {/* Bento Key Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                                {isElearning ? (
                                    <>
                                        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/80 dark:border-gray-800 shadow-sm hover:border-purple-500/40 transition-all flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">Số bài học</div>
                                                <div className="font-extrabold text-sm sm:text-base text-[var(--color-text)]">{course.totalLessons || 5} video HD</div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/80 dark:border-gray-800 shadow-sm hover:border-purple-500/40 transition-all flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">Thời lượng</div>
                                                <div className="font-extrabold text-sm sm:text-base text-[var(--color-text)]">{course.totalDuration || course.duration || "14 giờ"}</div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/80 dark:border-gray-800 shadow-sm hover:border-emerald-500/40 transition-all col-span-2 sm:col-span-1 flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">Truy cập</div>
                                                <div className="font-extrabold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">{course.accessDuration || "Trọn đời"}</div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/80 dark:border-gray-800 shadow-sm hover:border-orange-500/40 transition-all flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">Thời lượng</div>
                                                <div className="font-extrabold text-sm sm:text-base text-[var(--color-text)]">{course.duration}</div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/80 dark:border-gray-800 shadow-sm hover:border-orange-500/40 transition-all flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">Quy mô lớp</div>
                                                <div className="font-extrabold text-sm sm:text-base text-[var(--color-text)]">Tối đa {course.maxStudents || 8} HV</div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/80 dark:border-gray-800 shadow-sm hover:border-emerald-500/40 transition-all col-span-2 sm:col-span-1 flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                                                <ChefHat className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">Hình thức</div>
                                                <div className="font-extrabold text-sm sm:text-base text-[var(--color-text)]">Thực hành 100%</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Instructor Card */}
                            {instructor && (
                                <div className="p-4 sm:p-4.5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/80 dark:border-gray-800 shadow-sm flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/15 to-orange-500/5 text-orange-600 dark:text-orange-400 border border-orange-500/30 flex items-center justify-center flex-shrink-0 shadow-xs">
                                            <ChefHat className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                                                Giảng viên đào tạo
                                            </div>
                                            <div className="font-extrabold text-base text-[var(--color-text)]">
                                                {instructor.name}
                                            </div>
                                            <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                                                {instructor.role}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-[var(--color-text-secondary)] border border-gray-200 dark:border-gray-700">
                                        <span>Bếp trưởng thực chiến</span>
                                    </div>
                                </div>
                            )}

                            {/* Ultra High-Contrast Price & Action Showcase Card */}
                            {isElearning ? (
                                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#161220] border-2 border-purple-500 dark:border-purple-500/60 shadow-2xl shadow-purple-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
                                    <div className="space-y-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 text-xs font-extrabold uppercase tracking-wide border border-purple-300 dark:border-purple-800">
                                            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                                            Học phí trực tuyến E-Learning
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-purple-950 dark:text-white tracking-tight">
                                                {course.contactForPrice ? "Liên hệ tư vấn" : (course.price ? course.price.toLocaleString("vi-VN") : "Học phí ưu đãi")}
                                            </span>
                                            {!course.contactForPrice && course.price && (
                                                <span className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-400">
                                                    đ
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-1.5">
                                            <span className="text-green-600 font-bold">✓</span> Học ngay lập tức • Xem lại bài giảng trọn đời
                                        </p>
                                    </div>
                                    <a
                                        href={course.onlineUrl || "https://academy.duaxcar.com/"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base py-4 px-8 rounded-2xl shadow-xl shadow-purple-600/40 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 flex-shrink-0"
                                    >
                                        <span>Vào Học Online</span>
                                        <Play className="w-4 h-4 fill-current" />
                                    </a>
                                </div>
                            ) : (
                                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1e1510] border-2 border-orange-500 dark:border-orange-500/60 shadow-2xl shadow-orange-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
                                    <div className="space-y-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/80 text-orange-950 dark:text-orange-200 text-xs font-extrabold uppercase tracking-wide border border-orange-300 dark:border-orange-800">
                                            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                                            Học phí đào tạo trực tiếp
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-orange-950 dark:text-white tracking-tight">
                                                {course.contactForPrice ? "Liên hệ tư vấn" : (course.price ? course.price.toLocaleString("vi-VN") : "Liên hệ")}
                                            </span>
                                            {!course.contactForPrice && course.price && (
                                                <span className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                    đ
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-1.5">
                                            <span className="text-green-600 font-bold">✓</span> Thực hành 1 kèm 1 • Hỗ trợ công thức mở quán
                                        </p>
                                    </div>
                                    <Link 
                                        href="#dang-ky" 
                                        className="btn btn-primary font-extrabold text-base py-4 px-8 rounded-2xl shadow-xl shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 flex-shrink-0"
                                    >
                                        <span>Đăng ký giữ chỗ</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Details */}
            <section className="section pattern-dots">
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
                                        <div className="relative h-48 bg-[var(--color-gray-800)] overflow-hidden">
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
        </>
    );
}
