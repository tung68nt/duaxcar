"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2, Play, HelpCircle } from "lucide-react";

type Props = {
    courseName: string;
    courseType?: "onsite" | "elearning";
    onlineUrl?: string;
};

export default function CourseRegistrationForm({ courseName, courseType = "onsite", onlineUrl }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isElearning = courseType === "elearning";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const note = formData.get("note") as string;

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    course: `${courseName} (${isElearning ? "Hỏi đáp khóa Online" : "Đăng ký khóa Offline"})`,
                    note,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gửi thông tin thất bại.");
            }

            setIsSubmitted(true);
        } catch (error: any) {
            setErrorMessage(error.message || "Đã xảy ra lỗi khi gửi thông tin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="dang-ky" className="section bg-[var(--color-surface)] scroll-mt-20">
            <div className="container max-w-4xl">
                <div className={`card p-8 md:p-12 border shadow-xl rounded-[2rem] ${
                    isElearning 
                        ? "border-purple-500/20 hover:border-purple-500/40 bg-gradient-to-b from-purple-950/10 to-[var(--color-surface)]" 
                        : "border-[var(--color-border)] hover:border-[var(--color-primary)]/20"
                }`}>
                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        {isElearning ? (
                            <>
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    Hỗ trợ & Giải đáp thắc mắc
                                </span>
                                <h2 className="heading-2 text-[var(--color-text)] mt-3">
                                    Bạn có câu hỏi về khóa học Online này?
                                </h2>
                                <p className="text-small text-[var(--color-text-secondary)] mt-2">
                                    Khóa học trực tuyến được kích hoạt học ngay trên hệ thống E-Learning. Nếu bạn có bất kỳ thắc mắc nào về nội dung khóa học <strong className="text-purple-400">{courseName}</strong>, hãy để lại câu hỏi để chúng tôi hỗ trợ bạn nhanh nhất.
                                </p>

                                {onlineUrl && (
                                    <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl inline-flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)]">
                                        <span>Đã sẵn sàng học ngay?</span>
                                        <a
                                            href={onlineUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-purple-400 hover:text-purple-300 underline flex items-center gap-1"
                                        >
                                            Truy cập đăng ký & học ngay trên E-Learning
                                            <Play className="w-3 h-3 fill-current" />
                                        </a>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <span className="text-small font-semibold text-[var(--color-primary)]">
                                    Đăng ký khóa học
                                </span>
                                <h2 className="heading-2 text-[var(--color-text)] mt-2">
                                    Nhận tư vấn & Giữ chỗ ngay
                                </h2>
                                <p className="text-small text-[var(--color-text-secondary)] mt-2">
                                    Bạn đang đăng ký khóa học: <strong className="text-[var(--color-primary)]">{courseName}</strong>. Vui lòng để lại thông tin liên hệ dưới đây.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Success State */}
                    {isSubmitted ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="heading-3 text-[var(--color-text)] mb-2">
                                {isElearning ? "Gửi thắc mắc thành công!" : "Gửi đăng ký thành công!"}
                            </h3>
                            <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto">
                                {isElearning 
                                    ? "Cảm ơn bạn đã đặt câu hỏi. Ban giảng huấn DuaxCar Kitchen sẽ liên hệ giải đáp chi tiết cho bạn qua số điện thoại hoặc email sớm nhất."
                                    : "Cảm ơn bạn. Bộ phận hỗ trợ của DuaxCar Kitchen sẽ liên hệ tư vấn cho bạn qua số điện thoại sớm nhất có thể."
                                }
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                {isElearning && onlineUrl && (
                                    <a
                                        href={onlineUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-2 px-6"
                                    >
                                        Vào học Online ngay
                                        <Play className="w-4 h-4 fill-current" />
                                    </a>
                                )}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="btn btn-secondary"
                                >
                                    Gửi lại yêu cầu khác
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Honeypot field for anti-spam bots */}
                            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                                <input type="text" name="_hp_company" tabIndex={-1} autoComplete="off" />
                            </div>

                            {errorMessage && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="label text-sm font-semibold">
                                        Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="input rounded-xl px-4 py-3"
                                        placeholder="Ví dụ: Nguyễn Văn A"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="label text-sm font-semibold">
                                        Số điện thoại / Zalo *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        className="input rounded-xl px-4 py-3"
                                        placeholder="Ví dụ: 0909 123 456"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="label text-sm font-semibold">
                                        Địa chỉ Email (nhận phản hồi)
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="input rounded-xl px-4 py-3"
                                        placeholder="name@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="course-placeholder" className="label text-sm font-semibold">
                                        {isElearning ? "Khóa học quan tâm" : "Khóa học tuyển sinh"}
                                    </label>
                                    <input
                                        type="text"
                                        id="course-placeholder"
                                        disabled
                                        className="input rounded-xl px-4 py-3 cursor-not-allowed font-medium"
                                        value={`${courseName} ${isElearning ? "(Khóa Online)" : "(Khóa Trực tiếp)"}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="note" className="label text-sm font-semibold">
                                    {isElearning 
                                        ? "Nội dung câu hỏi / thắc mắc cần giải đáp *" 
                                        : "Ghi chú thêm (thời gian học mong muốn, câu hỏi cần giải đáp...)"
                                    }
                                </label>
                                <textarea
                                    id="note"
                                    name="note"
                                    rows={4}
                                    required={isElearning}
                                    className="input rounded-xl px-4 py-3 resize-none"
                                    placeholder={isElearning 
                                        ? "Ví dụ: Tôi muốn hỏi thêm về tài liệu giáo trình, cách học và hỗ trợ sau khóa học..." 
                                        : "Tôi muốn học vào cuối tuần..."
                                    }
                                />
                            </div>

                            <div className="text-center pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`btn btn-lg w-full sm:w-auto px-10 font-bold flex items-center justify-center gap-2 ${
                                        isElearning 
                                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30" 
                                            : "btn-primary"
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            {isElearning ? "Gửi câu hỏi thắc mắc" : "Xác nhận đăng ký tư vấn"}
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
