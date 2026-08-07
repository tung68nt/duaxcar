"use client";

import { useEffect, useState } from "react";
import { 
    HelpCircle, 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff,
    X,
    Save
} from "lucide-react";

interface FAQItem {
    id: string;
    category: string;
    title: string;
    content: string;
    visible: boolean;
}

export default function AdminFAQ() {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
    const [formState, setFormState] = useState<Omit<FAQItem, "id">>({
        category: "Về khóa học",
        title: "",
        content: "",
        visible: true
    });

    const defaultFaqs: FAQItem[] = [
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
    ];

    useEffect(() => {
        const localFaqs = localStorage.getItem("admin_faqs");
        if (localFaqs) {
            setFaqs(JSON.parse(localFaqs));
        } else {
            setFaqs(defaultFaqs);
            localStorage.setItem("admin_faqs", JSON.stringify(defaultFaqs));
        }
    }, []);

    useEffect(() => {
        let result = [...faqs];
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(f => 
                f.title.toLowerCase().includes(query) || 
                f.content.toLowerCase().includes(query)
            );
        }
        if (categoryFilter !== "all") {
            result = result.filter(f => f.category === categoryFilter);
        }
        setFilteredFaqs(result);
    }, [faqs, searchTerm, categoryFilter]);

    const openAddModal = () => {
        setEditingFaq(null);
        setFormState({
            category: "Về khóa học",
            title: "",
            content: "",
            visible: true
        });
        setModalOpen(true);
    };

    const openEditModal = (faq: FAQItem) => {
        setEditingFaq(faq);
        setFormState({
            category: faq.category,
            title: faq.title,
            content: faq.content,
            visible: faq.visible
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let updated: FAQItem[] = [];
        if (editingFaq) {
            updated = faqs.map(f => f.id === editingFaq.id ? { ...f, ...formState } : f);
        } else {
            const newItem: FAQItem = {
                id: `faq-${Date.now()}`,
                ...formState
            };
            updated = [newItem, ...faqs];
        }

        setFaqs(updated);
        localStorage.setItem("admin_faqs", JSON.stringify(updated));
        setModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa câu hỏi FAQ này?")) {
            const updated = faqs.filter(f => f.id !== id);
            setFaqs(updated);
            localStorage.setItem("admin_faqs", JSON.stringify(updated));
        }
    };

    const toggleVisibility = (id: string) => {
        const updated = faqs.map(f => f.id === id ? { ...f, visible: !f.visible } : f);
        setFaqs(updated);
        localStorage.setItem("admin_faqs", JSON.stringify(updated));
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="heading-2 text-[var(--color-text)]">
                        Quản Lý Hỏi Đáp (FAQ)
                    </h1>
                    <p className="text-small text-[var(--color-text-secondary)] mt-1">
                        Thêm, sửa, xóa các câu hỏi thường gặp và thiết lập trạng thái ẩn hiện hiển thị trên website.
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm FAQ mới</span>
                </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm câu hỏi hoặc câu trả lời..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                </div>
                <div className="w-full sm:w-60">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    >
                        <option value="all">Tất cả phân loại</option>
                        <option value="Về khóa học">Về khóa học</option>
                        <option value="Đăng ký & Thanh toán">Đăng ký & Thanh toán</option>
                        <option value="Khóa học Online">Khóa học Online</option>
                        <option value="Chính sách & Khác">Chính sách & Khác</option>
                    </select>
                </div>
            </div>

            {/* FAQ List Grid */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-light)]/40 text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
                                <th className="px-6 py-4">Phân loại</th>
                                <th className="px-6 py-4">Câu hỏi / Câu trả lời</th>
                                <th className="px-6 py-4 text-center">Hiển thị</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)] text-small text-[var(--color-text)]">
                            {filteredFaqs.map((faq) => (
                                <tr key={faq.id} className="hover:bg-[var(--color-surface-light)]/20 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-[var(--color-primary)] align-top whitespace-nowrap">
                                        {faq.category}
                                    </td>
                                    <td className="px-6 py-4 align-top max-w-xl">
                                        <div className="font-bold text-[var(--color-text)] mb-1">
                                            {faq.title}
                                        </div>
                                        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                                            {faq.content}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <button
                                            type="button"
                                            onClick={() => toggleVisibility(faq.id)}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                                                faq.visible
                                                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                    : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                            }`}
                                        >
                                            {faq.visible ? (
                                                <>
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Đang Hiện</span>
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="w-3.5 h-3.5" />
                                                    <span>Đang Ẩn</span>
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top whitespace-nowrap">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(faq)}
                                                className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-primary)] transition-all"
                                                title="Sửa FAQ"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq.id)}
                                                className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)] hover:text-red-500 transition-all"
                                                title="Xóa FAQ"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredFaqs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                                        Không tìm thấy câu hỏi FAQ phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit FAQ Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col animate-fadeIn">
                        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                            <h3 className="font-heading font-semibold text-[var(--color-text)] text-base">
                                {editingFaq ? "Chỉnh sửa câu hỏi FAQ" : "Thêm câu hỏi FAQ mới"}
                            </h3>
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Phân loại / Danh mục FAQ</label>
                                <select
                                    value={formState.category}
                                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                >
                                    <option value="Về khóa học">Về khóa học</option>
                                    <option value="Đăng ký & Thanh toán">Đăng ký & Thanh toán</option>
                                    <option value="Khóa học Online">Khóa học Online</option>
                                    <option value="Chính sách & Khác">Chính sách & Khác</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Câu hỏi (Question)</label>
                                <input
                                    type="text"
                                    value={formState.title}
                                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="Ví dụ: Lớp học kéo dài trong bao lâu?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Câu trả lời (Answer)</label>
                                <textarea
                                    value={formState.content}
                                    onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                                    rows={5}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="Nhập nội dung trả lời chi tiết..."
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text)] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formState.visible}
                                        onChange={(e) => setFormState({ ...formState, visible: e.target.checked })}
                                        className="w-4 h-4 rounded text-[var(--color-primary)] border-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)]"
                                    />
                                    <span>Kích hoạt hiển thị công khai trên website</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-4 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn btn-secondary btn-sm"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm flex items-center gap-1.5"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Lưu lại</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
