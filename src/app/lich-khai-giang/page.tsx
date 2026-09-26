import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { instructors, courseCategories } from "@/data/mock";
import { Metadata } from "next";
import { getLocalDB } from "@/lib/db";
import { defaultSchedules } from "@/data/default-schedules";
import ScheduleClient from "@/components/layout/ScheduleClient";

export const metadata: Metadata = {
    title: "Lịch Khai Giảng - Đào Tạo Bếp Chuyên Nghiệp | DuaxCar Kitchen",
    description:
        "Xem lịch khai giảng các khóa học nghề bếp thực chiến tại DuaxCar Kitchen. Đăng ký sớm để giữ chỗ và nhận ưu đãi đặc biệt.",
    openGraph: {
        title: "Lịch Khai Giảng - Đào Tạo Bếp Chuyên Nghiệp | DuaxCar Kitchen",
        description:
            "Lịch khai giảng các lớp nấu Phở bò, Bún bò Huế, Lẩu nướng, Món đồng quê, Hải sản tại DuaxCar Kitchen.",
    },
};

export default function SchedulePage() {
    const db = getLocalDB();
    const courses = db.courses && db.courses.length > 0 ? db.courses : [];
    const initialSchedules = db.schedules && db.schedules.length > 0 ? db.schedules : defaultSchedules;
    const allInstructors = db.instructors && db.instructors.length > 0 ? db.instructors : instructors;

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
                            <span>Lịch Khai Giảng Tuyển Sinh</span>
                        </div>
                        <h1 className="heading-1 text-[var(--color-text)] mb-6">
                            Khóa học <span className="gradient-text">sắp khai giảng</span>
                        </h1>
                        <p className="text-body-lg text-[var(--color-text-secondary)]">
                            Đăng ký sớm để đảm bảo giữ chỗ và nhận trọn bộ cẩm nang công thức độc quyền. Lớp thực hành thực chiến giới hạn tối đa 6 - 8 học viên để nghệ nhân kèm 1-1.
                        </p>
                    </div>
                </div>
            </section>

            {/* Dynamic Interactive Schedule Section */}
            <ScheduleClient
                initialSchedules={initialSchedules}
                courses={courses}
                instructors={allInstructors}
                courseCategories={courseCategories}
            />

            {/* Online Courses Promo */}
            <section className="section bg-[var(--color-surface)] pattern-plus">
                <div className="container">
                    <div className="card p-8 md:p-12 bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30 rounded-2xl">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="badge bg-purple-500/20 text-purple-400 border-purple-400/30 mb-4">
                                    💻 E-Learning Tiện Lợi
                                </span>
                                <h2 className="heading-3 text-[var(--color-text)] mb-4">
                                    Học online mọi lúc mọi nơi
                                </h2>
                                <p className="text-[var(--color-text-secondary)] mb-6">
                                    Không cần đợi lịch khai giảng! Đăng ký khóa học online và bắt đầu học ngay hôm nay với video HD quay chậm từng thao tác, sở hữu trọn đời.
                                </p>
                                <a
                                    href="https://academy.duaxcar.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn bg-purple-500 hover:bg-purple-600 text-white"
                                >
                                    Xem khóa học Online
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
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
                            Không thấy lịch học phù hợp?
                        </h2>
                        <p className="text-body-lg text-white/90 mb-8">
                            Liên hệ trực tiếp với bộ phận đào tạo của DuaxCar Kitchen để được sắp xếp lịch kèm 1-1 hoặc tổ chức lớp riêng theo thời gian biểu của bạn.
                        </p>
                        <Link
                            href="/lien-he"
                            className="btn btn-lg bg-white text-[var(--color-orange-600)] hover:bg-white/90 shadow-lg"
                        >
                            Liên hệ tư vấn lịch riêng
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
