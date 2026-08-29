"use client";

import { useState } from "react";
import Link from "next/link";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    Facebook,
    Youtube,
    CheckCircle,
    Loader2,
    MessageSquare,
} from "lucide-react";
import { contactInfo } from "@/data/mock";

export default function ContactPage() {
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
        const course = formData.get("course") as string;
        const message = formData.get("message") as string;

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, phone, email, course, message }),
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
        <>
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 overflow-hidden border-b border-[var(--color-border)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-background)] via-[var(--color-surface)] to-[var(--color-background)]" />
                <div className="absolute top-10 right-10 w-72 h-72 bg-[var(--color-orange-500)]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 pattern-plus pointer-events-none opacity-50" />

                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
                            <MessageSquare className="w-4 h-4" />
                            <span>Liên Hệ</span>
                        </div>
                        <h1 className="heading-1 text-[var(--color-text)] mt-4 mb-6">
                            Sẵn sàng <span className="gradient-text">bắt đầu</span>?
                        </h1>
                        <p className="text-body-lg text-[var(--color-text-secondary)]">
                            Liên hệ với chúng tôi để được tư vấn khóa học phù hợp. Đội ngũ của
                            chúng tôi sẽ phản hồi trong vòng 24 giờ.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section">
                <div className="container">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="card p-8">
                                <h2 className="heading-3 text-[var(--color-text)] mb-6">
                                    Gửi thông tin liên hệ
                                </h2>

                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h3 className="heading-4 text-[var(--color-text)] mb-2">
                                            Cảm ơn bạn!
                                        </h3>
                                        <p className="text-[var(--color-text-secondary)] mb-6">
                                            Chúng tôi đã nhận được thông tin của bạn và sẽ liên hệ lại
                                            trong thời gian sớm nhất.
                                        </p>
                                        <button
                                            onClick={() => setIsSubmitted(false)}
                                            className="btn btn-secondary"
                                        >
                                            Gửi thêm tin nhắn
                                        </button>
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
                                                <label htmlFor="name" className="label">
                                                    Họ và tên *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    required
                                                    className="input"
                                                    placeholder="Nguyễn Văn A"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="label">
                                                    Số điện thoại *
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    required
                                                    className="input"
                                                    placeholder="0123 456 789"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="label">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="input"
                                                placeholder="email@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="course" className="label">
                                                Khóa học quan tâm
                                            </label>
                                            <select id="course" name="course" className="input">
                                                <option value="">Chọn khóa học</option>
                                                <option value="mon-an-sang">Món ăn sáng</option>
                                                <option value="mon-dong-que">Món Đồng Quê</option>
                                                <option value="mon-hai-san">Món Hải sản</option>
                                                <option value="mon-nhau">Món Nhậu</option>
                                                <option value="mon-com-tho">Món Cơm thố</option>
                                                <option value="lau-nuong">Lẩu + nướng</option>
                                                <option value="mon-cao-cap">Món cao cấp</option>
                                                <option value="mon-gia-dinh">Món gia đình</option>
                                                <option value="khac">Khác</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="label">
                                                Nội dung tin nhắn *
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={5}
                                                required
                                                className="input resize-none"
                                                placeholder="Bạn muốn tư vấn về khóa học nào? Có câu hỏi gì cần giải đáp?"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn btn-primary btn-lg w-full sm:w-auto"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Đang gửi...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Gửi tin nhắn
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Info Cards */}
                            <div className="card p-6">
                                <h3 className="font-heading font-semibold text-[var(--color-text)] mb-6">
                                    Thông tin liên hệ
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-[var(--color-text)] text-sm">
                                                Địa chỉ
                                            </div>
                                            <div className="text-[var(--color-text-secondary)] text-sm">
                                                {contactInfo.address}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-[var(--color-text)] text-sm">
                                                Điện thoại
                                            </div>
                                            <a
                                                href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                                                className="text-[var(--color-primary)] text-sm hover:underline"
                                            >
                                                {contactInfo.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-[var(--color-text)] text-sm">
                                                Email
                                            </div>
                                            <a
                                                href={`mailto:${contactInfo.email}`}
                                                className="text-[var(--color-primary)] text-sm hover:underline"
                                            >
                                                {contactInfo.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-[var(--color-text)] text-sm">
                                                Giờ làm việc
                                            </div>
                                            <div className="text-[var(--color-text-secondary)] text-sm">
                                                {contactInfo.workingHours}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="card p-6">
                                <h3 className="font-heading font-semibold text-[var(--color-text)] mb-4">
                                    Theo dõi chúng tôi
                                </h3>
                                <div className="flex gap-3">
                                    {contactInfo.socials.facebook && (
                                        <a
                                            href={contactInfo.socials.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-lg bg-[var(--color-surface-light)] hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors group"
                                        >
                                            <Facebook className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-white" />
                                        </a>
                                    )}
                                    {contactInfo.socials.youtube && (
                                        <a
                                            href={contactInfo.socials.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-lg bg-[var(--color-surface-light)] hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors group"
                                        >
                                            <Youtube className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-white" />
                                        </a>
                                    )}
                                    {contactInfo.socials.zalo && (
                                        <a
                                            href={contactInfo.socials.zalo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-lg bg-[var(--color-surface-light)] hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors group"
                                        >
                                            <span className="text-[var(--color-text-secondary)] group-hover:text-white font-bold text-sm">
                                                Z
                                            </span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Quick Call */}
                            <div className="card p-6 bg-gradient-to-br from-[var(--color-orange-600)]/20 to-[var(--color-orange-500)]/10 border-[var(--color-primary)]/30">
                                <h3 className="font-heading font-semibold text-[var(--color-text)] mb-2">
                                    Gọi ngay để được tư vấn
                                </h3>
                                <p className="text-small text-[var(--color-text-secondary)] mb-4">
                                    Đội ngũ tư vấn sẵn sàng hỗ trợ bạn trong giờ làm việc.
                                </p>
                                <a
                                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                                    className="btn btn-primary w-full"
                                >
                                    <Phone className="w-4 h-4" />
                                    {contactInfo.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="section-sm bg-[var(--color-surface)]">
                <div className="container">
                    <h2 className="heading-3 text-[var(--color-text)] mb-6 text-center">
                        Vị trí trung tâm
                    </h2>
                    <div className="aspect-video bg-[var(--color-surface-light)] rounded-2xl overflow-hidden">
                        <iframe
                            src={contactInfo.mapEmbed}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Vị trí DuaxCar Kitchen"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
