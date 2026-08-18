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
    Save,
    ArrowLeft
} from "lucide-react";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";

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
        const fetchFaqs = async () => {
            try {
                const res = await fetch('/api/cms/faq');
                if (res.ok) {
                    const json = await res.json();
                    if (json.faqs && json.faqs.length > 0) {
                        setFaqs(json.faqs);
                        localStorage.setItem("admin_faqs", JSON.stringify(json.faqs));
                        return;
                    }
                }
            } catch (e) {
                console.error("Error fetching faqs:", e);
            }

            const localFaqs = localStorage.getItem("admin_faqs");
            if (localFaqs) {
                try {
                    const parsed = JSON.parse(localFaqs);
                    if (parsed.length > 0) {
                        setFaqs(parsed);
                        return;
                    }
                } catch {}
            }

            setFaqs(defaultFaqs);
            localStorage.setItem("admin_faqs", JSON.stringify(defaultFaqs));
        };
        fetchFaqs();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const faqId = editingFaq ? editingFaq.id : `faq-${Date.now()}`;
        const item: FAQItem = {
            id: faqId,
            ...formState
        };

        try {
            await fetch('/api/cms/faq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ faq: item })
            });
        } catch (err) {
            console.warn("Could not save FAQ to API:", err);
        }

        let updated: FAQItem[] = [];
        if (editingFaq) {
            updated = faqs.map(f => f.id === editingFaq.id ? item : f);
        } else {
            updated = [item, ...faqs];
        }

        setFaqs(updated);
        localStorage.setItem("admin_faqs", JSON.stringify(updated));
        setModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa câu hỏi FAQ này?")) {
            try {
                await fetch(`/api/cms/faq?id=${id}`, { method: 'DELETE' });
            } catch (err) {
                console.warn("Could not delete FAQ via API:", err);
            }

            const updated = faqs.filter(f => f.id !== id);
            setFaqs(updated);
            localStorage.setItem("admin_faqs", JSON.stringify(updated));
        }
    };

    const toggleVisibility = async (id: string) => {
        const found = faqs.find(f => f.id === id);
        if (!found) return;

        const updatedItem = { ...found, visible: !found.visible };
        try {
            await fetch('/api/cms/faq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ faq: updatedItem })
            });
        } catch {}

        const updated = faqs.map(f => f.id === id ? updatedItem : f);
        setFaqs(updated);
        localStorage.setItem("admin_faqs", JSON.stringify(updated));
    };

    if (modalOpen) {
        return (
            <div className="space-y-6 animate-fadeIn pb-12">
                {/* Editor Header */}
                <div className="flex items-center justify-between bg-[var(--color-surface)] p-6 border border-[var(--color-border)] rounded-2xl">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="p-2 rounded-xl bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="heading-3 text-[var(--color-text)]">
                                {editingFaq ? `Chỉnh sửa FAQ: ${editingFaq.title}` : "Thêm câu hỏi FAQ mới"}
                            </h2>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                Cập nhật nội dung câu hỏi thường gặp & phân loại hiển thị.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="btn btn-secondary btn-sm"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const form = document.getElementById("faq-form") as HTMLFormElement;
                                if (form) form.requestSubmit();
                            }}
                            className="btn btn-primary btn-sm flex items-center gap-1.5"
                        >
                            <Save className="w-4 h-4" />
                            <span>Lưu câu hỏi</span>
                        </button>
                    </div>
                </div>

                {/* Main Form Container */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                    <form id="faq-form" onSubmit={handleSubmit} className="space-y-4">
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
                            <AutoResizeTextarea
                                value={formState.content}
                                onChange={(e) => setFormState({ ...formState, content: e.target.value })}
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
                    </form>
                </div>
            </div>
        );
    }

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
                                    <td className="px-6 py-4 space-y-1">
                                        <div className="font-bold text-[var(--color-text)]">{faq.title}</div>
                                        <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{faq.content}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center align-top">
                                        <button
                                            onClick={() => toggleVisibility(faq.id)}
                                            className={`p-1.5 rounded-lg border transition-all ${
                                                faq.visible
                                                    ? "bg-green-500/10 border-green-500/20 text-green-500"
                                                    : "bg-red-500/10 border-red-500/20 text-red-500"
                                            }`}
                                            title={faq.visible ? "Đang hiện" : "Đang ẩn"}
                                        >
                                            {faq.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => openEditModal(faq)}
                                                className="p-1.5 rounded-lg bg-[var(--color-surface-light)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all"
                                                title="Sửa"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq.id)}
                                                className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                title="Xóa"
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
        </div>
    );
}
