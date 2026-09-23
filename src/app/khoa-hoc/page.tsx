import Link from "next/link";
import Image from "next/image";
import { ChefHat, Clock, Users, ArrowRight, Play, BookOpen } from "lucide-react";
import { courses as mockCourses, courseCategories, courseTypes } from "@/data/mock";
import { getSupabaseCourses } from "@/lib/cms";
import { Metadata } from "next";
import CategoryIcon from "@/components/category-icon";

export const revalidate = 30;

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
            <section className="relative py-16 md:py-24 overflow-hidden border-b border-[var(--color-border)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-background)] via-[var(--color-surface)] to-[var(--color-background)]" />
                <div className="absolute top-10 right-10 w-72 h-72 bg-[var(--color-orange-500)]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 pattern-plus pointer-events-none opacity-50" />

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
                                : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${!selectedType ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-light)] text-[var(--color-text-secondary)]"
                                    }`}>
                                    <ChefHat className="w-6 h-6" />
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
                                : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedType === "onsite" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-light)] text-[var(--color-text-secondary)]"
                                    }`}>
                                    <Users className="w-6 h-6" />
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
                        <Link
                            href="/khoa-hoc?type=elearning"
                            className={`relative p-5 rounded-2xl border-2 transition-all group ${selectedType === "elearning"
                                ? "border-purple-500 bg-purple-500/10 shadow-sm"
                                : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-purple-500/50"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                    selectedType === "elearning" ? "bg-purple-600 text-white" : "bg-[var(--color-surface-light)] text-[var(--color-text-secondary)]"
                                }`}>
                                    <Play className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${selectedType === "elearning" ? "text-purple-500" : "text-[var(--color-text)]"}`}>
                                        Khóa học Online
                                    </h3>
                                    <p className="text-small text-[var(--color-text-muted)]">
                                        {elearningCourses.length} khóa học • Học mọi lúc
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

                        {/* Courses Section - Always placed first (categories placed below as in onsite courses) */}
            <section className="section bg-[var(--color-surface)]">
                <div className="container">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6 md:mb-8">
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

                    {/* Course Grid: 2 columns on mobile for elearning (online) courses */}
                    <div className={`grid ${
                        selectedType === "elearning"
                            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    }`}>
                        {filteredCourses.map((course) => {
                            const isElearning = course.courseType === "elearning";
                            const isTwoColsOnMobile = selectedType === "elearning";

                            return (
                                <div key={course.id} className="relative group flex flex-col">
                                    <Link
                                        href={`/khoa-hoc/${course.slug}`}
                                        className="card card-glow block h-full flex flex-col justify-between overflow-hidden"
                                    >
                                        <div>
                                            {/* Image */}
                                            <div className={`relative ${isTwoColsOnMobile ? "h-32 xs:h-40 sm:h-48" : "h-48"} bg-[var(--color-surface-light)] flex items-center justify-center overflow-hidden`}>
                                                {course.image || courseCategories.find((c) => c.id === course.category)?.image ? (
                                                    <Image
                                                        src={course.image || courseCategories.find((c) => c.id === course.category)?.image || ""}
                                                        alt={course.name}
                                                        fill
                                                        unoptimized={Boolean(course.image && (course.image.startsWith("data:") || course.image.startsWith("blob:")))}
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <ChefHat className={`${isTwoColsOnMobile ? "w-10 h-10 sm:w-16 sm:h-16" : "w-16 h-16"} text-[var(--color-gray-600)] group-hover:text-[var(--color-primary)] transition-colors`} />
                                                )}

                                                {/* Badges */}
                                                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap gap-1 sm:gap-2 z-10">
                                                    {isElearning ? (
                                                        <span className="badge bg-purple-600 text-white border-none flex items-center gap-1 font-bold shadow-md text-[10px] px-1.5 py-0.5 sm:text-xs sm:px-2.5 sm:py-1">
                                                            <Play className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" />
                                                            Online
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-green-600 text-white border-none flex items-center gap-1 font-bold shadow-md text-[10px] px-1.5 py-0.5 sm:text-xs sm:px-2.5 sm:py-1">
                                                            <Users className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" />
                                                            Trực tiếp
                                                        </span>
                                                    )}
                                                    {course.featured && (
                                                        <span className="badge bg-[var(--color-primary)] text-white border-none font-bold shadow-md text-[10px] px-1.5 py-0.5 sm:text-xs sm:px-2.5 sm:py-1">
                                                            Nổi bật
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Video Indicator */}
                                                {course.videoUrl && (
                                                    <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 z-10 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-semibold flex items-center gap-1 border border-white/20 shadow-md">
                                                        <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-red-500 fill-red-500" />
                                                        <span className="hidden xs:inline sm:inline">Có Video</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className={`${isTwoColsOnMobile ? "p-2.5 sm:p-5" : "p-5"}`}>
                                                <div className={`${isTwoColsOnMobile ? "text-[10px] sm:text-xs" : "text-xs"} text-[var(--color-text-muted)] mb-1 sm:mb-2 flex items-center gap-1 sm:gap-1.5`}>
                                                    <CategoryIcon id={course.category} className={`${isTwoColsOnMobile ? "w-3 h-3 sm:w-3.5 sm:h-3.5" : "w-3.5 h-3.5"} text-[var(--color-primary)] shrink-0`} />
                                                    <span className="truncate">{courseCategories.find((c) => c.id === course.category)?.name}</span>
                                                </div>
                                                <h3 className={`font-heading font-semibold ${isTwoColsOnMobile ? "text-xs sm:text-lg leading-snug min-h-[2rem] sm:min-h-0" : "text-lg"} text-[var(--color-text)] mb-1 sm:mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2`}>
                                                    {course.name}
                                                </h3>
                                                <p className={`${isTwoColsOnMobile ? "hidden sm:block" : ""} text-small text-[var(--color-text-muted)] mb-3 sm:mb-4 line-clamp-2`}>
                                                    {course.shortDescription}
                                                </p>

                                                {/* Meta */}
                                                <div className={`flex items-center ${isTwoColsOnMobile ? "gap-2 sm:gap-4 text-[10px] sm:text-small" : "gap-4 text-small"} text-[var(--color-text-secondary)] mb-2 sm:mb-4`}>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {isElearning ? (
                                                            <>
                                                                <BookOpen className={`${isTwoColsOnMobile ? "w-3 h-3 sm:w-4 sm:h-4" : "w-4 h-4"} text-purple-400`} />
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
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <Users className="w-4 h-4" />
                                                            <span>{course.maxStudents} HV</span>
                                                        </div>
                                                    )}
                                                    {isElearning && (
                                                        <div className="flex items-center gap-1 text-green-500 shrink-0 font-medium">
                                                            <span className="truncate">{course.accessDuration || "Trọn đời"}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & CTA Footer */}
                                        <div className={`${isTwoColsOnMobile ? "px-2.5 pb-2.5 sm:px-5 sm:pb-5" : "px-5 pb-5"}`}>
                                            <div className="flex items-center justify-between pt-2.5 sm:pt-4 border-t border-[var(--color-border)]">
                                                <div className={`font-heading font-semibold ${isTwoColsOnMobile ? "text-[11px] sm:text-sm" : "text-sm"} text-[var(--color-primary)]`}>
                                                    Tư vấn & Đăng ký
                                                </div>
                                                <span className={`${isTwoColsOnMobile ? "text-[10px] sm:text-small" : "text-small"} font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-0.5 sm:gap-1`}>
                                                    <span className="hidden xs:inline sm:inline">Chi tiết</span>
                                                    <ArrowRight className={`${isTwoColsOnMobile ? "w-3 h-3 sm:w-4 sm:h-4" : "w-4 h-4"}`} />
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
                                            className="absolute top-3 right-3 badge bg-purple-600 text-white z-30 flex items-center gap-1 font-bold shadow-md cursor-pointer hover:bg-purple-700 transition-colors border-none text-[10px] sm:text-xs"
                                        >
                                            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
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

            {/* Category Selection Section - Placed BELOW courses (as in onsite) */}
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
