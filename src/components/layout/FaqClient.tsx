"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { MessageCircle, Phone } from "lucide-react";

interface FAQItem {
    id: string;
    category: string;
    title: string;
    content: string;
    visible: boolean;
}

interface FaqClientProps {
    initialFaqs?: FAQItem[];
}

export default function FaqClient({ initialFaqs }: FaqClientProps) {
    const [faqs, setFaqs] = useState<FAQItem[]>(
        initialFaqs && initialFaqs.length > 0 ? initialFaqs : [
        {
            id: "faq-1",
            category: "Về khóa học",
            title: "Tôi chưa biết gì về nấu ăn có học được không?",
            content: "Hoàn toàn được! Các khóa học tại DuaxCar Kitchen được thiết kế từ cơ bản đến nâng cao, phù hợp cho cả người mới bắt đầu. Giảng viên sẽ hướng dẫn chi tiết từng bước, từ cách cầm dao, sơ chế nguyên liệu đến kỹ thuật nấu nướng chuyên nghiệp.",
            visible: true
        },
        {
            id: "faq-2",
            category: "Về khóa học",
            title: "Học phí đã bao gồm nguyên liệu chưa?",
            content: "Đối với các khóa học trực tiếp (Onsite), học phí ĐÃ BAO GỒM toàn bộ chi phí nguyên liệu thực hành, tài liệu và chứng chỉ. Bạn không cần đóng thêm bất kỳ khoản phí nào khác.",
            visible: true
        },
        {
            id: "faq-3",
            category: "Về khóa học",
            title: "Lớp học có bao nhiêu học viên?",
            content: "Để đảm bảo chất lượng giảng dạy và sự tương tác tốt nhất, mỗi lớp học trực tiếp chỉ nhận tối đa 8-10 học viên. Giảng viên sẽ theo sát và chỉnh sửa kỹ thuật cho từng bạn.",
            visible: true
        },
        {
            id: "faq-4",
            category: "Về khóa học",
            title: "Tôi có được cấp chứng chỉ sau khóa học không?",
            content: "Có. Sau khi hoàn thành khóa học và đạt yêu cầu bài thi cuối khóa, bạn sẽ được cấp chứng chỉ hoàn thành khóa học do DuaxCar Kitchen và Hiệp hội Đầu bếp xác nhận.",
            visible: true
        },
        {
            id: "faq-5",
            category: "Đăng ký & Thanh toán",
            title: "Làm sao để đăng ký khóa học?",
            content: "Bạn có thể đăng ký trực tiếp trên website bằng cách nhấn nút \"Đăng ký ngay\" tại trang chi tiết khóa học, hoặc liên hệ qua Hotline để được tư vấn hỗ trợ.",
            visible: true
        },
        {
            id: "faq-6",
            category: "Đăng ký & Thanh toán",
            title: "Tôi có thể bảo lưu khóa học không?",
            content: "Học viên được hỗ trợ bảo lưu khóa học trong vòng 6 tháng kể từ ngày đăng ký nếu có lý do chính đáng. Vui lòng liên hệ bộ phận CSKH ít nhất 3 ngày trước ngày khai giảng để được hỗ trợ.",
            visible: true
        },
        {
            id: "faq-7",
            category: "Đăng ký & Thanh toán",
            title: "DuaxCar Kitchen chấp nhận hình thức thanh toán nào?",
            content: "Chúng tôi chấp nhận chuyển khoản ngân hàng, quét mã QR, thanh toán thẻ (Visa/Mastercard) hoặc tiền mặt trực tiếp tại văn phòng ghi danh.",
            visible: true
        },
        {
            id: "faq-8",
            category: "Khóa học Online",
            title: "Khóa học Online học trong bao lâu?",
            content: "Khóa học Online không giới hạn thời gian truy cập. Bạn có thể học bất cứ lúc nào, ở đâu và xem lại video bài giảng trọn đời.",
            visible: true
        },
        {
            id: "faq-9",
            category: "Khóa học Online",
            title: "Học Online có được hỗ trợ không?",
            content: "Có. Học viên Online sẽ được tham gia nhóm kín Zalo/Facebook để trao đổi với giảng viên và các bạn học viên khác. Giảng viên sẽ giải đáp thắc mắc và sửa bài tập cho bạn.",
            visible: true
        }
    ]);

    useEffect(() => {
        if (initialFaqs && initialFaqs.length > 0) {
            setFaqs(initialFaqs);
            return;
        }

        // Live fetch from API
        fetch('/api/cms/faq')
            .then(res => res.json())
            .then(data => {
                if (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
                    setFaqs(data.faqs);
                }
            })
            .catch(() => {});
    }, [initialFaqs]);

    // Group FAQs by category
    const categoriesMap = Array.from(new Set(faqs.map(f => f.category)));
    const groupedFaqs = categoriesMap
        .map(cat => ({
            category: cat,
            items: faqs.filter(f => f.category === cat && f.visible)
        }))
        .filter(g => g.items.length > 0);

    return (
        <main className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gray-900)] via-[var(--color-gray-800)] to-[var(--color-gray-900)]" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--color-orange-500)]/20 rounded-full blur-3xl" />

                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
                            <MessageCircle className="w-4 h-4" />
                            <span>Hỗ trợ học viên</span>
                        </div>
                        <h1 className="heading-1 text-[var(--color-text)] mt-4 mb-6">
                            Câu hỏi <span className="gradient-text">thường gặp</span>
                        </h1>
                        <p className="text-body-lg text-[var(--color-text-secondary)]">
                            Tổng hợp những thắc mắc phổ biến nhất về DuaxCar Kitchen.
                            Nếu bạn không tìm thấy câu trả lời, đừng ngần ngại liên hệ với chúng tôi.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="section">
                <div className="container max-w-4xl animate-fadeIn">
                    <div className="space-y-12">
                        {groupedFaqs.map((section, idx) => (
                            <div key={idx}>
                                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6 pl-2 border-l-4 border-[var(--color-primary)]">
                                    {section.category}
                                </h2>
                                <Accordion items={section.items} />
                            </div>
                        ))}
                        {groupedFaqs.length === 0 && (
                            <p className="text-center text-small text-[var(--color-text-muted)] py-12">Hiện chưa có câu hỏi FAQ nào được thiết lập hiển thị.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="section relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--color-orange-600)] pattern-light" />
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />

                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="heading-2 text-white mb-6">
                            Vẫn còn thắc mắc?
                        </h2>
                        <p className="text-body-lg text-white/90 mb-8">
                            Đội ngũ tư vấn của DuaxCar Kitchen luôn sẵn sàng giải đáp mọi câu hỏi của bạn.
                            Hãy liên hệ ngay để được hỗ trợ nhanh nhất.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/lien-he"
                                className="btn btn-lg bg-white text-[var(--color-orange-600)] hover:bg-white/90"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Chat tư vấn
                            </Link>
                            <a
                                href="tel:0909123456"
                                className="btn btn-lg bg-transparent border-2 border-white text-white hover:bg-white/10"
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                0909 123 456
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
