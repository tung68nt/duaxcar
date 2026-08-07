import Link from "next/link";
import Image from "next/image";
import { ChefHat, Clock, Users, ArrowRight, Play, BookOpen } from "lucide-react";
import { courses as mockCourses, courseCategories, courseTypes } from "@/data/mock";
import { getSupabaseCourses } from "@/lib/cms";
import { Metadata } from "next";
import CategoryIcon from "@/components/category-icon";

export const metadata: Metadata = {
    title: "Khóa học",
    description:
        "Khám phá các khóa học đào tạo ẩm thực tại DuaxCar Kitchen - từ phở, bún bò Huế đến các món cao cấp.",
};

type Props = {
    searchParams: Promise<{ category?: string; type?: string }>;
};

export default async function CoursesPage({ searchParams }: Props) {
    const { category: selectedCategory, type: selectedType } = await searchParams;

    const liveCourses = await getSupabaseCourses();
    const courses = liveCourses.length > 0 ? liveCourses : mockCourses;

    // Filter courses by type and category
    let filteredCourses = courses;


    if (selectedType) {
        filteredCourses = filteredCourses.filter((c) => c.courseType === selectedType);
    }

    if (selectedCategory) {
        filteredCourses = filteredCourses.filter((c) => c.category === selectedCategory);
    }

    const onsiteCourses = courses.filter((c) => c.courseType === "onsite");
    const elearningCourses = courses.filter((c) => c.courseType === "elearning");

    // Get page title based on type
    const pageTitle = selectedType === "onsite"
        ? "Khóa học Trực tiếp"
        : selectedType === "elearning"
            ? "Khóa học Online | E-Learning"
            : "Tất cả khóa học";

    return (
        <>
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gray-900)] via-[var(--color-gray-800)] to-[var(--color-gray-900)]" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--color-orange-500)]/20 rounded-full blur-3xl" />
                <div className="absolute inset-0 pattern-plus opacity-50" />

                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
                            <BookOpen className="w-4 h-4" />
                            <span>Khóa Học</span>
                        </div>
                        <h1 className="heading-1 text-[var(--color-text)] mt-4 mb-6">
                            {selectedType === "elearning" ? (
                                <>Học <span className="gradient-text">online</span> mọi lúc mọi nơi</>
                            ) : selectedType === "onsite" ? (
                                <>Học <span className="gradient-text">trực tiếp</span> với nghệ nhân</>
                            ) : (
                                <>Khám phá <span className="gradient-text">khóa học</span> phù hợp</>
                            )}
                        </h1>
                        <p className="text-body-lg text-[var(--color-text-secondary)]">
                            {selectedType === "elearning"
                                ? "Video HD chất lượng cao, học mọi lúc mọi nơi, truy cập trọn đời."
                                : selectedType === "onsite"
                                    ? "Thực hành trực tiếp tại bếp, hướng dẫn 1-1 từ nghệ nhân ẩm thực."
                                    : "Từ món ăn sáng truyền thống đến fine dining - học trực tiếp hoặc online."
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* Course Type Cards */}
            <section className="py-8 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <div className="container">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* All Courses */}
                        <Link
                            href="/khoa-hoc"
                            className={`relative p-5 rounded-2xl border-2 transition-all group ${!selectedType
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                                : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${!selectedType ? "bg-[var(--color-primary)]" : "bg-[var(--color-gray-700)]"
                                    }`}>
                                    <ChefHat className={`w-6 h-6 ${!selectedType ? "text-white" : "text-[var(--color-text-muted)]"}`} />
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${!selectedType ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"}`}>
                                        Tất cả khóa học
                                    </h3>
                                    <p className="text-small text-[var(--color-text-muted)]">
                                        {courses.length} khóa học
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Onsite */}
                        <Link
                            href="/khoa-hoc?type=onsite"
                            className={`relative p-5 rounded-2xl border-2 transition-all group ${selectedType === "onsite"
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                                : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedType === "onsite" ? "bg-[var(--color-primary)]" : "bg-[var(--color-gray-700)]"
                                    }`}>
                                    <Users className={`w-6 h-6 ${selectedType === "onsite" ? "text-white" : "text-[var(--color-text-muted)]"}`} />
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${selectedType === "onsite" ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"}`}>
                                        Khóa học Trực tiếp
                                    </h3>
                                    <p className="text-small text-[var(--color-text-muted)]">
                                        {onsiteCourses.length} khóa học • Tại trung tâm
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* E-Learning */}
                        {/* E-Learning */}
                        <a
                            href="https://academy.duaxcar.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`relative p-5 rounded-2xl border-2 transition-all group border-[var(--color-border)] hover:border-purple-500/50`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--color-gray-700)]">
                                    <Play className="w-6 h-6 text-[var(--color-text-muted)]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--color-text)]">
                                        Khóa học Online | E-Learning
                                    </h3>
                                    <p className="text-small text-[var(--color-text-muted)]">
                                        {elearningCourses.length} khóa học • Học mọi lúc
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Category Section - Cleaner Chip Style */}
            {selectedType === "onsite" ? (
                <>
                    {/* Courses */}
                    <section className="section bg-[var(--color-surface)] pattern-dots">
                        <div className="container">
                            {/* Results Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="heading-4 text-[var(--color-text)]">{pageTitle}</h2>
                                    <p className="text-small text-[var(--color-text-secondary)] mt-1">
                                        Hiển thị {filteredCourses.length} khóa học
                                        {selectedCategory && (
                                            <> trong danh mục <span className="text-[var(--color-primary)]">
                                                {courseCategories.find((c) => c.id === selectedCategory)?.name}
                                            </span></>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Course Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => {
                                    const isElearning = course.courseType === "elearning";
                                    const href = isElearning ? "https://academy.duaxcar.com/" : `/khoa-hoc/${course.slug}`;
                                    return (
                                        <div key={course.id} className="relative group">
                                            <Link
                                                key={course.id}
                                                href={href}
                                                {...(isElearning ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                                className="card card-glow block h-full"
                                            >
                                                {/* Image */}
                                                <div className="relative h-48 bg-gradient-to-br from-[var(--color-gray-700)] to-[var(--color-gray-800)] flex items-center justify-center overflow-hidden">
                                                    {courseCategories.find((c) => c.id === course.category)?.image ? (
                                                        <Image
                                                            src={courseCategories.find((c) => c.id === course.category)?.image || ""}
                                                            alt={course.name}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <ChefHat className="w-16 h-16 text-[var(--color-gray-600)] group-hover:text-[var(--color-primary)] transition-colors" />
                                                    )}

                                                    {/* Badges */}
                                                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                                                        {isElearning ? (
                                                            <span className="badge bg-purple-600 text-white border-none flex items-center gap-1 font-bold shadow-md">
                                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                                Online
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-green-600 text-white border-none flex items-center gap-1 font-bold shadow-md">
                                                                <Users className="w-3.5 h-3.5 fill-current" />
                                                                Trực tiếp
                                                            </span>
                                                        )}
                                                        {course.featured && (
                                                            <span className="badge bg-[var(--color-primary)] text-white border-none font-bold shadow-md">
                                                                Nổi bật
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5">
                                                    <div className="text-xs text-[var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                                                        <CategoryIcon id={course.category} className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                                        <span>{courseCategories.find((c) => c.id === course.category)?.name}</span>
                                                    </div>
                                                    <h3 className="font-heading font-semibold text-lg text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                                        {course.name}
                                                    </h3>
                                                    <p className="text-small text-[var(--color-text-muted)] mb-4 line-clamp-2">
                                                        {course.shortDescription}
                                                    </p>

                                                    {/* Meta */}
                                                    <div className="flex items-center gap-4 text-small text-[var(--color-text-secondary)] mb-4">
                                                        <div className="flex items-center gap-1">
                                                            {isElearning ? (
                                                                <>
                                                                    <BookOpen className="w-4 h-4" />
                                                                    <span>{course.totalLessons} bài</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>{course.duration}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        {!isElearning && course.maxStudents && (
                                                            <div className="flex items-center gap-1">
                                                                <Users className="w-4 h-4" />
                                                                <span>{course.maxStudents} HV</span>
                                                            </div>
                                                        )}
                                                        {isElearning && (
                                                            <div className="flex items-center gap-1 text-green-400">
                                                                <span>🔓 {course.accessDuration}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Price & CTA */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                                                        <div className="font-heading font-semibold text-sm text-[var(--color-primary)]">
                                                            Tư vấn & Đăng ký
                                                        </div>
                                                        <span className="text-small font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-1">
                                                            Xem chi tiết
                                                            <ArrowRight className="w-4 h-4" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Sibling badge for online class */}
                                            {!isElearning && course.onlineUrl && (
                                                <a 
                                                    href={course.onlineUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute top-3 right-3 badge bg-purple-600 text-white z-30 flex items-center gap-1 font-bold shadow-md cursor-pointer hover:bg-purple-700 transition-colors border-none"
                                                >
                                                    <Play className="w-3 h-3 fill-current" />
                                                    Lớp Online
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Empty State */}
                            {filteredCourses.length === 0 && (
                                <div className="text-center py-16">
                                    <ChefHat className="w-16 h-16 text-[var(--color-gray-600)] mx-auto mb-4" />
                                    <h3 className="heading-4 text-[var(--color-text)] mb-2">
                                        Không tìm thấy khóa học
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)] mb-6">
                                        Hiện chưa có khóa học nào trong danh mục này.
                                    </p>
                                    <Link href="/khoa-hoc" className="btn btn-primary">
                                        Xem tất cả khóa học
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Category Selection */}
                    <section className="py-8 bg-[var(--color-background)] border-b border-[var(--color-border)]">
                        <div className="container">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-semibold text-[var(--color-text)]">
                                    Danh mục
                                </h2>
                                {selectedCategory && (
                                    <Link
                                        href={selectedType ? `/khoa-hoc?type=${selectedType}` : "/khoa-hoc"}
                                        className="text-small text-[var(--color-primary)] hover:underline flex items-center gap-1"
                                    >
                                        Xóa bộ lọc ×
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {courseCategories.map((category) => {
                                    const isActive = selectedCategory === category.id;
                                    const courseCount = (selectedType
                                        ? courses.filter(c => c.courseType === selectedType && c.category === category.id)
                                        : courses.filter(c => c.category === category.id)
                                    ).length;

                                    return (
                                        <Link
                                            key={category.id}
                                            href={`/khoa-hoc?${selectedType ? `type=${selectedType}&` : ""}category=${category.id}`}
                                            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 group ${isActive
                                                ? "bg-[var(--color-surface)] border-[var(--color-orange-500)] shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                                                : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-orange-300)] hover:shadow-lg hover:-translate-y-1"
                                                }`}
                                        >
                                            <div className={`mb-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"} text-[var(--color-primary)]`}>
                                                <CategoryIcon id={category.id} className="w-8 h-8" />
                                            </div>

                                            <span className={`text-sm font-semibold text-center mb-1 ${isActive ? "text-[var(--color-orange-500)]" : "text-[var(--color-text)] group-hover:text-[var(--color-orange-500)]"
                                                }`}>
                                                {category.name}
                                            </span>

                                            <span className="text-xs text-[var(--color-text-muted)]">
                                                {courseCount} khóa học
                                            </span>

                                            {isActive && (
                                                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[var(--color-orange-500)] animate-pulse" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    {/* Category Selection */}
                    <section className="py-8 bg-[var(--color-background)] border-b border-[var(--color-border)]">
                        <div className="container">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-semibold text-[var(--color-text)]">
                                    Danh mục
                                </h2>
                                {selectedCategory && (
                                    <Link
                                        href={selectedType ? `/khoa-hoc?type=${selectedType}` : "/khoa-hoc"}
                                        className="text-small text-[var(--color-primary)] hover:underline flex items-center gap-1"
                                    >
                                        Xóa bộ lọc ×
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {courseCategories.map((category) => {
                                    const isActive = selectedCategory === category.id;
                                    const courseCount = (selectedType
                                        ? courses.filter(c => c.courseType === selectedType && c.category === category.id)
                                        : courses.filter(c => c.category === category.id)
                                    ).length;

                                    return (
                                        <Link
                                            key={category.id}
                                            href={`/khoa-hoc?${selectedType ? `type=${selectedType}&` : ""}category=${category.id}`}
                                            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 group ${isActive
                                                ? "bg-[var(--color-surface)] border-[var(--color-orange-500)] shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                                                : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-orange-300)] hover:shadow-lg hover:-translate-y-1"
                                                }`}
                                        >
                                            <div className={`mb-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"} text-[var(--color-primary)]`}>
                                                <CategoryIcon id={category.id} className="w-8 h-8" />
                                            </div>

                                            <span className={`text-sm font-semibold text-center mb-1 ${isActive ? "text-[var(--color-orange-500)]" : "text-[var(--color-text)] group-hover:text-[var(--color-orange-500)]"
                                                }`}>
                                                {category.name}
                                            </span>

                                            <span className="text-xs text-[var(--color-text-muted)]">
                                                {courseCount} khóa học
                                            </span>

                                            {isActive && (
                                                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[var(--color-orange-500)] animate-pulse" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Courses */}
                    <section className="section bg-[var(--color-surface)] pattern-dots">
                        <div className="container">
                            {/* Results Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="heading-4 text-[var(--color-text)]">{pageTitle}</h2>
                                    <p className="text-small text-[var(--color-text-secondary)] mt-1">
                                        Hiển thị {filteredCourses.length} khóa học
                                        {selectedCategory && (
                                            <> trong danh mục <span className="text-[var(--color-primary)]">
                                                {courseCategories.find((c) => c.id === selectedCategory)?.name}
                                            </span></>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Course Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => {
                                    const isElearning = course.courseType === "elearning";
                                    const href = isElearning ? "https://academy.duaxcar.com/" : `/khoa-hoc/${course.slug}`;
                                    return (
                                        <div key={course.id} className="relative group">
                                            <Link
                                                key={course.id}
                                                href={href}
                                                {...(isElearning ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                                className="card card-glow block h-full"
                                            >
                                                {/* Image */}
                                                <div className="relative h-48 bg-gradient-to-br from-[var(--color-gray-700)] to-[var(--color-gray-800)] flex items-center justify-center overflow-hidden">
                                                    {courseCategories.find((c) => c.id === course.category)?.image ? (
                                                        <Image
                                                            src={courseCategories.find((c) => c.id === course.category)?.image || ""}
                                                            alt={course.name}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <ChefHat className="w-16 h-16 text-[var(--color-gray-600)] group-hover:text-[var(--color-primary)] transition-colors" />
                                                    )}

                                                    {/* Badges */}
                                                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                                                        {isElearning ? (
                                                            <span className="badge bg-purple-600 text-white border-none flex items-center gap-1 font-bold shadow-md">
                                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                                Online
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-green-600 text-white border-none flex items-center gap-1 font-bold shadow-md">
                                                                <Users className="w-3.5 h-3.5 fill-current" />
                                                                Trực tiếp
                                                            </span>
                                                        )}
                                                        {course.featured && (
                                                            <span className="badge bg-[var(--color-primary)] text-white border-none font-bold shadow-md">
                                                                Nổi bật
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <div className="text-xs text-[var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                                                    <CategoryIcon id={course.category} className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                                    <span>{courseCategories.find((c) => c.id === course.category)?.name}</span>
                                                </div>
                                                <h3 className="font-heading font-semibold text-lg text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                                    {course.name}
                                                </h3>
                                                <p className="text-small text-[var(--color-text-muted)] mb-4 line-clamp-2">
                                                    {course.shortDescription}
                                                </p>

                                                {/* Meta */}
                                                <div className="flex items-center gap-4 text-small text-[var(--color-text-secondary)] mb-4">
                                                    <div className="flex items-center gap-1">
                                                        {isElearning ? (
                                                            <>
                                                                <BookOpen className="w-4 h-4" />
                                                                <span>{course.totalLessons} bài</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="w-4 h-4" />
                                                                <span>{course.duration}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {!isElearning && course.maxStudents && (
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            <span>{course.maxStudents} HV</span>
                                                        </div>
                                                    )}
                                                    {isElearning && (
                                                        <div className="flex items-center gap-1 text-green-400">
                                                            <span>🔓 {course.accessDuration}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Price & CTA */}
                                                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                                                    <div className="font-heading font-semibold text-sm text-[var(--color-primary)]">
                                                        Tư vấn & Đăng ký
                                                    </div>
                                                    <span className="text-small font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-1">
                                                        Xem chi tiết
                                                        <ArrowRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Sibling badge for online class */}
                                        {!isElearning && course.onlineUrl && (
                                            <a 
                                                href={course.onlineUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute top-3 right-3 badge bg-purple-600 text-white z-30 flex items-center gap-1 font-bold shadow-md cursor-pointer hover:bg-purple-700 transition-colors border-none"
                                            >
                                                <Play className="w-3 h-3 fill-current" />
                                                Lớp Online
                                            </a>
                                        )}
                                    </div>
                                    );
                                })}
                            </div>

                            {/* Empty State */}
                            {filteredCourses.length === 0 && (
                                <div className="text-center py-16">
                                    <ChefHat className="w-16 h-16 text-[var(--color-gray-600)] mx-auto mb-4" />
                                    <h3 className="heading-4 text-[var(--color-text)] mb-2">
                                        Không tìm thấy khóa học
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)] mb-6">
                                        Hiện chưa có khóa học nào trong danh mục này.
                                    </p>
                                    <Link href="/khoa-hoc" className="btn btn-primary">
                                        Xem tất cả khóa học
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* CTA */}
            <section className="section bg-[var(--color-orange-600)] pattern-light">
                <div className="container relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="heading-2 text-white mb-4">
                            Không biết chọn khóa học nào?
                        </h2>
                        <p className="text-body-lg text-white/90 mb-8">
                            Liên hệ với chúng tôi để được tư vấn khóa học phù hợp với mục
                            tiêu và ngân sách của bạn.
                        </p>
                        <Link href="/lien-he" className="btn btn-lg bg-white text-[var(--color-orange-600)] hover:bg-white/90">
                            Đăng ký tư vấn miễn phí
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
