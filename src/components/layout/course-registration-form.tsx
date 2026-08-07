"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

type Props = {
    courseName: string;
};

export default function CourseRegistrationForm({ courseName }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
                    course: courseName,
                    note,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gửi đăng ký thất bại.");
            }

            setIsSubmitted(true);
        } catch (error: any) {
            setErrorMessage(error.message || "Đã xảy ra lỗi khi gửi đăng ký.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="dang-ky" className="section bg-[var(--color-surface)] scroll-mt-20">
            <div className="container max-w-4xl">
                <div className="card p-8 md:p-12 border border-[var(--color-border)] hover:border-[var(--color-primary)]/20 shadow-xl rounded-[2rem]">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="text-small font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                            Đăng Ký Khóa Học
                        </span>
                        <h2 className="heading-2 text-[var(--color-text)] mt-2">
                            Nhận tư vấn & Giữ chỗ ngay
                        </h2>
                        <p className="text-small text-[var(--color-text-secondary)] mt-2">
                            Bạn đang đăng ký khóa học: <strong className="text-[var(--color-primary)]">{courseName}</strong>. Vui lòng để lại thông tin liên hệ dưới đây.
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="heading-3 text-[var(--color-text)] mb-2">
                                Gửi đăng ký thành công!
                            </h3>
                            <p className="text-[var(--color-text-secondary)] mb-6">
                                Cảm ơn bạn. Bộ phận hỗ trợ của DuaxCar Kitchen sẽ liên hệ tư vấn cho bạn qua số điện thoại sớm nhất có thể.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="btn btn-secondary"
                            >
                                Gửi lại yêu cầu
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        className="input bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-3"
                                        placeholder="Ví dụ: Nguyễn Văn A"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="label text-sm font-semibold">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        className="input bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-3"
                                        placeholder="Ví dụ: 0909 123 456"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="label text-sm font-semibold">
                                        Địa chỉ Email (nếu có)
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="input bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-3"
                                        placeholder="name@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="course-placeholder" className="label text-sm font-semibold">
                                        Khóa học tuyển sinh
                                    </label>
                                    <input
                                        type="text"
                                        id="course-placeholder"
                                        disabled
                                        className="input bg-[var(--color-border)]/50 border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-xl px-4 py-3 cursor-not-allowed font-medium"
                                        value={courseName}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="note" className="label text-sm font-semibold">
                                    Ghi chú thêm (thời gian học mong muốn, câu hỏi cần giải đáp...)
                                </label>
                                <textarea
                                    id="note"
                                    name="note"
                                    rows={4}
                                    className="input bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-3 resize-none"
                                    placeholder="Tôi muốn học vào cuối tuần..."
                                />
                            </div>

                            <div className="text-center pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary btn-lg w-full sm:w-auto px-10 font-bold flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            Xác nhận đăng ký tư vấn
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
