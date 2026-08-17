import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    ChefHat,
    Users,
    Award,
    TrendingUp,
    Star,
    Clock,
    Quote,
    Play,
} from "lucide-react";
import {
    courses as mockCourses,
    instructors as mockInstructors,
    testimonials as mockTestimonials,
    stats,
    courseCategories,
} from "@/data/mock";
import {
    getSupabaseCourses,
    getSupabaseInstructors,
    getSupabaseTestimonials,
    getSupabaseSettings
} from "@/lib/cms";
import CategoryIcon from "@/components/category-icon";
import HeroCarousel from "@/components/layout/hero-carousel";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const liveCourses = await getSupabaseCourses();
    const courses = liveCourses.length > 0 ? liveCourses : mockCourses;

    const liveInstructors = await getSupabaseInstructors();
    const instructors = liveInstructors.length > 0 ? liveInstructors : mockInstructors;

    const liveTestimonials = await getSupabaseTestimonials();
    const testimonials = liveTestimonials.length > 0 ? liveTestimonials : mockTestimonials;

    const liveSettings = await getSupabaseSettings();
    const banners = liveSettings?.heroBanners && liveSettings.heroBanners.length > 0 ? liveSettings.heroBanners : undefined;

    const featuredCourses = courses.filter((c) => c.featured).slice(0, 4);

    return (
        <>
            {/* Hero Section */}
            <HeroCarousel initialBanners={banners} />
            {/* Temporarily Hidden Original Hero Section
            <section className="relative min-h-[90vh] flex items-center overflow-hidden pb-24 pt-24">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gray-900)] via-[var(--color-gray-800)] to-[var(--color-gray-900)]" />

                <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--color-orange-500)]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-[var(--color-orange-600)]/10 rounded-full blur-3xl" />

                <div className="container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 badge badge-primary mb-6 animate-fade-in">
                                <ChefHat className="w-4 h-4" />
                                <span>Trung tâm đào tạo ẩm thực hàng đầu</span>
                            </div>

                            <h1 className="heading-1 text-[var(--color-text)] mb-6 animate-fade-in stagger-1">
                                Nơi khởi đầu cho <span className="gradient-text">thành công</span><br />
                                trong <span className="gradient-text">kinh doanh ẩm thực</span>
                            </h1>

                            <p className="text-body-lg text-[var(--color-text-secondary)] mb-8 animate-fade-in stagger-2">
                                Đào tạo các món ăn Việt truyền thống và kỹ năng kinh doanh quán ăn
                                thực tế. Học cùng nghệ nhân ẩm thực với hơn 25 năm kinh nghiệm.
                            </p>

                            <div className="flex flex-wrap gap-4 animate-fade-in stagger-3">
                                <Link href="/khoa-hoc" className="btn btn-primary btn-lg">
                                    Xem các khóa học
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/lien-he" className="btn btn-secondary btn-lg">
                                    Tư vấn miễn phí
                                </Link>
                            </div>

                            <div className="mt-12 pt-12 border-t border-[var(--color-border)] animate-fade-in stagger-4">
                                <div className="space-y-6">
                                    <div className="flex gap-12 pl-12">
                                        {stats.slice(0, 2).map((stat, index) => (
                                            <div key={index} className="text-center">
                                                <div className="heading-2 gradient-text">
                                                    {stat.value}
                                                    {stat.suffix}
                                                </div>
                                                <div className="text-small text-[var(--color-text-muted)]">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-12 ml-24 pl-12">
                                        {stats.slice(2, 4).map((stat, index) => (
                                            <div key={index} className="text-center">
                                                <div className="heading-2 gradient-text">
                                                    {stat.value}
                                                    {stat.suffix}
                                                </div>
                                                <div className="text-small text-[var(--color-text-muted)]">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block animate-fade-in stagger-2">
                            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-[var(--color-surface)]/50">
                                <Image
                                    src="/images/courses/pho-bo.jpg"
                                    alt="Món ăn Việt Nam hấp dẫn"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            <div className="absolute -bottom-6 -left-6 bg-[var(--color-surface)] p-4 rounded-2xl shadow-xl border border-[var(--color-border)] animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        <Star className="w-6 h-6 text-[var(--color-primary)] fill-current" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-[var(--color-text)]">4.9/5.0</div>
                                        <div className="text-xs text-[var(--color-text-secondary)]">Đánh giá từ học viên</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-pulse">
                    <div className="w-6 h-10 border-2 border-[var(--color-border)] rounded-full flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-[var(--color-primary)] rounded-full" />
                    </div>
                </div>
            </section>
            */}

            {/* Featured Courses */}
            <section className="section bg-[var(--color-surface)]">
                <div className="container">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
                        <div>
                            <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                                Khóa Học Nổi Bật
                            </span>
                            <h2 className="heading-2 text-[var(--color-text)] mt-2">
                                Các khóa học được yêu thích nhất
                            </h2>
                        </div>
                        <Link
                            href="/khoa-hoc"
                            className="btn btn-secondary flex-shrink-0"
                        >
                            Xem tất cả
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredCourses.map((course) => (
                            <div key={course.id} className="relative group">
                                <Link
                                    href={`/khoa-hoc/${course.slug}`}
                                    className="card card-glow block h-full"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 bg-[var(--color-gray-800)] overflow-hidden">
                                        <Image
                                            src={course.image}
                                            alt={course.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3 badge bg-[var(--color-primary)] text-white z-10 font-bold shadow-md border-none">
                                            {
                                                courseCategories.find((c) => c.id === course.category)
                                                    ?.name
                                            }
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="font-heading font-semibold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                            {course.name}
                                        </h3>
                                        <p className="text-small text-[var(--color-text-muted)] mb-4 line-clamp-2">
                                            {course.shortDescription}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center justify-between text-small">
                                            <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="font-heading font-semibold text-[var(--color-primary)]">
                                                Tư vấn & Đăng ký
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Online Class Badge */}
                                {course.onlineUrl && (
                                    <a 
                                        href={course.onlineUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute top-3 right-3 badge bg-purple-600 text-white z-30 font-bold shadow-md border-none flex items-center gap-1.5 cursor-pointer hover:bg-purple-700 transition-colors"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        Lớp Online
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Preview Section */}
            <section className="section bg-[var(--color-surface)] pattern-plus">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Content */}
                        <div>
                            <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                                Về Chúng Tôi
                            </span>
                            <h2 className="heading-2 text-[var(--color-text)] mt-2 mb-6">
                                DuaxCar Kitchen - Nơi đam mê trở thành nghề nghiệp
                            </h2>
                            <p className="text-body text-[var(--color-text-secondary)] mb-6">
                                DuaxCar Kitchen là trung tâm đào tạo ẩm thực chuyên biệt, tập
                                trung vào việc dạy các món ăn Việt truyền thống và các kỹ năng
                                kinh doanh quán ăn thực tế.
                            </p>
                            <p className="text-body text-[var(--color-text-secondary)] mb-8">
                                Với đội ngũ giảng viên là những nghệ nhân ẩm thực được vinh
                                danh, chúng tôi không chỉ dạy công thức mà còn truyền đạt tâm
                                huyết và tư duy kinh doanh bền vững.
                            </p>

                            {/* Features */}
                            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                        <Award className="w-5 h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[var(--color-text)]">
                                            Nghệ nhân ẩm thực
                                        </h4>
                                        <p className="text-small text-[var(--color-text-muted)]">
                                            Giảng viên được vinh danh
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[var(--color-text)]">
                                            Thực chiến 100%
                                        </h4>
                                        <p className="text-small text-[var(--color-text-muted)]">
                                            Học để mở quán ngay
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                        <Users className="w-5 h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[var(--color-text)]">
                                            Lớp học nhỏ
                                        </h4>
                                        <p className="text-small text-[var(--color-text-muted)]">
                                            Tối đa 6-10 học viên
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                        <ChefHat className="w-5 h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[var(--color-text)]">
                                            Hỗ trợ sau khóa học
                                        </h4>
                                        <p className="text-small text-[var(--color-text-muted)]">
                                            Tư vấn mở quán miễn phí
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link href="/ve-duaxcar" className="btn btn-primary">
                                Tìm hiểu thêm
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Image Grid */}
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="h-48 bg-gradient-to-br from-[var(--color-orange-500)]/30 to-[var(--color-orange-600)]/20 rounded-2xl flex items-center justify-center">
                                        <ChefHat className="w-16 h-16 text-[var(--color-primary)]" />
                                    </div>
                                    <div className="h-32 bg-[var(--color-gray-700)] rounded-2xl" />
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="h-32 bg-[var(--color-gray-700)] rounded-2xl" />
                                    <div className="h-48 bg-gradient-to-br from-[var(--color-gray-700)] to-[var(--color-gray-800)] rounded-2xl flex items-center justify-center">
                                        <Award className="w-16 h-16 text-[var(--color-orange-400)]" />
                                    </div>
                                </div>
                            </div>
                            {/* Decorative */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--color-primary)]/20 rounded-full blur-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Categories */}
            <section className="section">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                            Danh Mục
                        </span>
                        <h2 className="heading-2 text-[var(--color-text)] mt-2 mb-4">
                            8 danh mục khóa học đa dạng
                        </h2>
                        <p className="text-body text-[var(--color-text-secondary)]">
                            Từ món ăn sáng đến fine dining, từ đồng quê đến cao cấp - chúng
                            tôi có đủ mọi thứ bạn cần
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {courseCategories.map((category) => {
                            const courseCount = courses.filter((c) => c.category === category.id).length;
                            return (
                                <Link
                                    key={category.id}
                                    href={`/khoa-hoc?category=${category.id}`}
                                    className="group relative flex flex-col items-center justify-center p-6 bg-[var(--color-surface)] rounded-[2rem] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-300"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-3xl shadow-sm">
                                        <CategoryIcon id={category.id} className="w-8 h-8 text-[var(--color-primary)]" />
                                    </div>
                                    <h3 className="font-heading font-bold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors text-center">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wide">
                                        {courseCount} khóa học
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Instructors Section */}
            <section className="section">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                            Đội Ngũ Giảng Viên
                        </span>
                        <h2 className="heading-2 text-[var(--color-text)] mt-2 mb-4">
                            Học từ những người giỏi nhất
                        </h2>
                        <p className="text-body text-[var(--color-text-secondary)]">
                            Đội ngũ giảng viên là những nghệ nhân ẩm thực với hàng chục năm
                            kinh nghiệm thực chiến
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {instructors.map((instructor) => (
                            <div
                                key={instructor.id}
                                className="card card-glow overflow-hidden group relative"
                            >
                                {/* Avatar */}
                                <div className="relative h-[380px] overflow-hidden pt-6 px-6 pb-0 flex items-end justify-center" style={{ backgroundColor: "#ffffff" }}>
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={instructor.image}
                                            alt={instructor.name}
                                            fill
                                            className="object-contain object-bottom group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                        />
                                    </div>

                                    {/* Experience Badge */}
                                    <div className="absolute bottom-3 right-3 bg-[var(--color-primary)] text-white font-bold text-xs py-1 px-2.5 rounded-full shadow-lg shadow-[var(--color-primary)]/30 border-2 border-[var(--color-surface)] z-20 flex items-center gap-1">
                                        <Award className="w-3.5 h-3.5 fill-current" />
                                        <span>{instructor.experience} kinh nghiệm</span>
                                    </div>
                                </div>

                                {/* Seamless gradient overlay placed OUTSIDE and overlapping the boundary */}
                                <div
                                    className="absolute inset-x-0 pointer-events-none z-10"
                                    style={{
                                        top: "260px",
                                        height: "130px",
                                        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, var(--color-surface) 90%, var(--color-surface) 100%)",
                                    }}
                                />

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="heading-4 text-[var(--color-text)] mb-1">
                                        {instructor.name}
                                    </h3>
                                    <p className="text-small text-[var(--color-primary)] font-medium mb-3">
                                        {instructor.role}
                                    </p>
                                    <p className="text-small text-[var(--color-text-secondary)] mb-4">
                                        {instructor.bio}
                                    </p>

                                    {/* Achievements */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {instructor.achievements.slice(0, 2).map((achievement, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-2.5 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full font-medium border border-[var(--color-primary)]/20"
                                            >
                                                {achievement}
                                            </span>
                                        ))}
                                    </div>

                                    <Link
                                        href={`/ve-duaxcar#${instructor.id}`}
                                        className="text-small font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 hover:underline"
                                    >
                                        Xem chi tiết →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/ve-duaxcar#giang-vien" className="btn btn-secondary">
                            Xem tất cả giảng viên
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section bg-[var(--color-surface)]">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                            Học Viên Nói Gì
                        </span>
                        <h2 className="heading-2 text-[var(--color-text)] mt-2 mb-4">
                            Câu chuyện thành công từ học viên
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="card p-6 flex flex-col h-full">
                                {/* Stars */}
                                <div className="flex items-center gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 fill-[var(--color-orange-400)] text-[var(--color-orange-400)]"
                                        />
                                    ))}
                                </div>

                                {/* Quote */}
                                <div className="relative mb-4 flex-grow">
                                    <Quote className="absolute -top-2 -right-2 w-8 h-8 text-[var(--color-primary)]/20" />
                                    <p className="text-small text-[var(--color-text-secondary)] italic">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>
                                </div>

                                {/* Author - Always at bottom */}
                                <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)] mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-[var(--color-primary)]">
                                            {testimonial.name[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-[var(--color-text)] text-sm">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-xs text-[var(--color-text-muted)] h-9 line-clamp-2 flex items-center">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="section bg-[var(--color-surface)] border-t border-[var(--color-border)]">
                <div className="container">
                    <div className="text-center mb-12">
                        <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-2 block">
                            Đồng Hành Cùng Phát Triển
                        </span>
                        <h2 className="heading-2 text-[var(--color-text)] mb-4">
                            Đối Tác Của Chúng Tôi
                        </h2>
                        <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                            Những thương hiệu và quán ăn đã áp dụng thành công quy trình đào tạo của DuaxCar Kitchen
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                            >
                                <Image
                                    src={`/images/partners/partner-${item}.jpg`}
                                    alt={`Đối tác ${item}`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-[var(--color-orange-600)] pattern-light" />
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />

                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="heading-2 text-white mb-6">
                            Sẵn sàng bắt đầu hành trình ẩm thực?
                        </h2>
                        <p className="text-body-lg text-white/90 mb-8">
                            Đăng ký tư vấn miễn phí ngay hôm nay. Chúng tôi sẽ giúp bạn chọn
                            khóa học phù hợp nhất với mục tiêu của bạn.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/lien-he"
                                className="btn btn-lg bg-white text-[var(--color-orange-600)] hover:bg-white/90"
                            >
                                Đăng ký tư vấn miễn phí
                            </Link>
                            <Link
                                href="/khoa-hoc"
                                className="btn btn-lg bg-transparent border-2 border-white text-white hover:bg-white/10"
                            >
                                Xem các khóa học
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
