import Link from "next/link";
import { Calendar, Clock, Users, MapPin, ArrowRight, ChefHat } from "lucide-react";
import { courses, instructors, courseCategories } from "@/data/mock";
import { Metadata } from "next";
import CategoryIcon from "@/components/category-icon";

export const metadata: Metadata = {
    title: "Lịch Khai Giảng",
    description:
        "Xem lịch khai giảng các khóa học tại DuaxCar Kitchen. Đăng ký sớm để nhận ưu đãi.",
};

// Mock schedule data
const scheduleData = [
    {
        id: "1",
        courseSlug: "pho-bo-truyen-thong",
        startDate: "2025-01-20",
        endDate: "2025-01-21",
        time: "8:00 - 17:00",
        location: "Cơ sở Cầu Giấy",
        spotsLeft: 3,
        status: "opening" as const,
    },
    {
        id: "2",
        courseSlug: "bun-bo-hue",
        startDate: "2025-01-25",
        endDate: "2025-01-26",
        time: "8:00 - 17:00",
        location: "Cơ sở Cầu Giấy",
        spotsLeft: 5,
        status: "opening" as const,
    },
    {
        id: "3",
        courseSlug: "lau-nuong-tron-goi",
        startDate: "2025-02-01",
        endDate: "2025-02-02",
        time: "8:00 - 17:00",
        location: "Cơ sở Cầu Giấy",
        spotsLeft: 8,
        status: "opening" as const,
    },
    {
        id: "4",
        courseSlug: "mon-dong-que-thuc-chien",
        startDate: "2025-02-10",
        endDate: "2025-02-11",
        time: "8:00 - 16:00",
        location: "Cơ sở Cầu Giấy",
        spotsLeft: 6,
        status: "opening" as const,
    },
    {
        id: "5",
        courseSlug: "hai-san-nha-hang",
        startDate: "2025-02-15",
        endDate: "2025-02-16",
        time: "8:00 - 17:00",
        location: "Cơ sở Cầu Giấy",
        spotsLeft: 4,
        status: "opening" as const,
    },
    {
        id: "6",
        courseSlug: "mon-cao-cap-fine-dining",
        startDate: "2025-02-20",
        endDate: "2025-02-22",
        time: "9:00 - 18:00",
        location: "Cơ sở Cầu Giấy",
        spotsLeft: 2,
        status: "almost-full" as const,
    },
];

function formatScheduleDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export default function SchedulePage() {
    const onsiteCourses = courses.filter((c) => c.courseType === "onsite");

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
                            <Calendar className="w-4 h-4" />
                            <span>Lịch Khai Giảng</span>
                        </div>
                        <h1 className="heading-1 text-[var(--color-text)] mb-6">
                            Khóa học <span className="gradient-text">sắp khai giảng</span>
                        </h1>
                        <p className="text-body-lg text-[var(--color-text-secondary)]">
                            Đăng ký sớm để đảm bảo chỗ ngồi và nhận ưu đãi đặc biệt. Lớp học nhỏ, tối đa 6-10 học viên.
                        </p>
                    </div>
                </div>
            </section>

            {/* Schedule List */}
            <section className="section bg-[var(--color-surface)]">
                <div className="container">
                    <div className="space-y-6">
                        {scheduleData.map((schedule) => {
                            const course = onsiteCourses.find((c) => c.slug === schedule.courseSlug);
                            const instructor = course ? instructors.find((i) => i.id === course.instructorId) : null;
                            const category = course ? courseCategories.find((c) => c.id === course.category) : null;

                            if (!course) return null;

                            return (
                                <div
                                    key={schedule.id}
                                    className="card p-6 md:p-8 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                        {/* Date Badge */}
                                        <div className="flex-shrink-0">
                                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-orange-500)] to-[var(--color-orange-600)] flex flex-col items-center justify-center text-white shadow-lg">
                                                <div className="text-3xl font-bold">
                                                    {new Date(schedule.startDate).getDate()}
                                                </div>
                                                <div className="text-sm opacity-90">
                                                    Tháng {new Date(schedule.startDate).getMonth() + 1}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Course Info */}
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-medium text-[var(--color-primary)] flex items-center gap-1.5">
                                                    <CategoryIcon id={course.category} className="w-3.5 h-3.5" />
                                                    <span>{category?.name}</span>
                                                </span>
                                                {schedule.status === "almost-full" && (
                                                    <span className="badge bg-red-500/20 text-red-400 border-red-400/30 text-xs">
                                                        Sắp hết chỗ
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="heading-4 text-[var(--color-text)] mb-3">
                                                <Link href={`/khoa-hoc/${course.slug}`} className="hover:text-[var(--color-primary)] transition-colors">
                                                    {course.name}
                                                </Link>
                                            </h3>

                                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-small">
                                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                                    <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                                                    <span>
                                                        {formatScheduleDate(schedule.startDate)}
                                                        {schedule.endDate !== schedule.startDate && (
                                                            <> - {formatScheduleDate(schedule.endDate)}</>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                                    <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                                                    <span>{schedule.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                                    <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                                                    <span>{schedule.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                                    <Users className="w-4 h-4 text-[var(--color-primary)]" />
                                                    <span>
                                                        Còn <span className="text-[var(--color-primary)] font-medium">{schedule.spotsLeft}</span> chỗ
                                                    </span>
                                                </div>
                                            </div>

                                            {instructor && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                                                        <ChefHat className="w-3 h-3 text-[var(--color-primary)]" />
                                                    </div>
                                                    <span className="text-small text-[var(--color-text-muted)]">
                                                        Giảng viên: <span className="text-[var(--color-text)]">{instructor.name}</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Price & CTA */}
                                        <div className="flex-shrink-0 flex items-center lg:border-l lg:border-[var(--color-border)] lg:pl-8">
                                            <Link href="/lien-he" className="btn btn-primary whitespace-nowrap">
                                                Tư vấn & Đăng ký
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Online Courses Promo */}
            <section className="section bg-[var(--color-surface)] pattern-plus">
                <div className="container">
                    <div className="card p-8 md:p-12 bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="badge bg-purple-500/20 text-purple-400 border-purple-400/30 mb-4">
                                    💻 E-Learning
                                </span>
                                <h2 className="heading-3 text-[var(--color-text)] mb-4">
                                    Học online mọi lúc mọi nơi
                                </h2>
                                <p className="text-[var(--color-text-secondary)] mb-6">
                                    Không cần đợi lịch khai giảng! Đăng ký khóa học online và bắt đầu học ngay hôm nay với video HD chất lượng cao.
                                </p>
                                <a href="https://academy.duaxcar.com/" target="_blank" rel="noopener noreferrer" className="btn bg-purple-500 hover:bg-purple-600 text-white">
                                    Xem khóa học Online
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-xs">
                                    <div className="heading-3 text-purple-500">5+</div>
                                    <div className="text-small text-[var(--color-text-muted)]">Khóa học</div>
                                </div>
                                <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-xs">
                                    <div className="heading-3 text-purple-500">20+</div>
                                    <div className="text-small text-[var(--color-text-muted)]">Video HD</div>
                                </div>
                                <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-xs">
                                    <div className="heading-3 text-purple-500">∞</div>
                                    <div className="text-small text-[var(--color-text-muted)]">Trọn đời</div>
                                </div>
                                <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center shadow-xs">
                                    <div className="heading-3 text-purple-500">24/7</div>
                                    <div className="text-small text-[var(--color-text-muted)]">Hỗ trợ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section bg-[var(--color-orange-600)] pattern-light">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="heading-2 text-white mb-4">
                            Không thấy lịch phù hợp?
                        </h2>
                        <p className="text-body-lg text-white/90 mb-8">
                            Liên hệ với chúng tôi để được tư vấn và đăng ký lớp học theo yêu cầu riêng.
                        </p>
                        <Link href="/lien-he" className="btn btn-lg bg-white text-[var(--color-orange-600)] hover:bg-white/90">
                            Liên hệ tư vấn
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
