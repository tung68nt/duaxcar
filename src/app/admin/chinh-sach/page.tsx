"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    ShieldCheck, 
    FileText, 
    CreditCard, 
    Save, 
    ExternalLink, 
    CheckCircle, 
    Clock, 
    Sparkles, 
    Info, 
    RotateCcw
} from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { PolicyData, defaultPolicies } from "@/data/default-policies";

export default function AdminPolicyCMS() {
    const [policies, setPolicies] = useState<PolicyData[]>(defaultPolicies);
    const [activeTab, setActiveTab] = useState<"bao-mat" | "dieu-khoan" | "thanh-toan">("bao-mat");
    const [isSaving, setIsSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    // Current policy being edited
    const currentPolicy = policies.find((p) => p.id === activeTab) || policies[0];

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await fetch('/api/cms/policies');
                if (res.ok) {
                    const data = await res.json();
                    if (data.policies && data.policies.length > 0) {
                        setPolicies(data.policies);
                        localStorage.setItem("admin_policies", JSON.stringify(data.policies));
                        return;
                    }
                }
            } catch (err) {
                console.error("Error fetching policies:", err);
            }

            // Local cache fallback
            const cached = localStorage.getItem("admin_policies");
            if (cached) {
                try {
                    setPolicies(JSON.parse(cached));
                } catch {}
            }
        };

        fetchPolicies();
    }, []);

    const handleFieldChange = (field: keyof PolicyData, value: string) => {
        setPolicies((prev) =>
            prev.map((p) => (p.id === activeTab ? { ...p, [field]: value } : p))
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSavedMessage(null);

        try {
            const res = await fetch('/api/cms/policies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ policy: currentPolicy }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.policies) {
                    setPolicies(data.policies);
                    localStorage.setItem("admin_policies", JSON.stringify(data.policies));
                }
                setSavedMessage("Đã lưu thành công nội dung chính sách!");
                setTimeout(() => setSavedMessage(null), 4000);
            } else {
                throw new Error("Lỗi khi lưu dữ liệu");
            }
        } catch (err) {
            console.error("Save policy error:", err);
            // Local fallback
            localStorage.setItem("admin_policies", JSON.stringify(policies));
            setSavedMessage("Đã lưu vào bộ nhớ cục bộ!");
            setTimeout(() => setSavedMessage(null), 4000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetDefault = () => {
        const defaultTarget = defaultPolicies.find((p) => p.id === activeTab);
        if (defaultTarget && window.confirm("Bạn có chắc chắn muốn khôi phục nội dung văn bản này về mẫu mặc định ban đầu?")) {
            setPolicies((prev) =>
                prev.map((p) => (p.id === activeTab ? defaultTarget : p))
            );
        }
    };

    const tabs = [
        {
            id: "bao-mat" as const,
            name: "Chính sách bảo mật",
            icon: ShieldCheck,
            url: "/chinh-sach/bao-mat",
            desc: "Quyền riêng tư & bảo vệ dữ liệu học viên (Nghị định 13)",
        },
        {
            id: "dieu-khoan" as const,
            name: "Điều khoản dịch vụ",
            icon: FileText,
            url: "/chinh-sach/dieu-khoan",
            desc: "Quy chế đào tạo & quyền sở hữu trí tuệ công thức ẩm thực",
        },
        {
            id: "thanh-toan" as const,
            name: "Chính sách thanh toán",
            icon: CreditCard,
            url: "/chinh-sach/thanh-toan",
            desc: "Học phí trọn gói, đặt cọc giữ chỗ, bảo lưu & hoàn phí",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
                <div>
                    <h1 className="font-heading font-bold text-xl text-[var(--color-text)] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                        <span>Quản lý Trang Chính Sách & Điều Khoản</span>
                    </h1>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                        Chỉnh sửa nội dung văn bản pháp lý, chính sách học phí và quy chế đào tạo với trình soạn thảo trực quan.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={tabs.find((t) => t.id === activeTab)?.url || "/chinh-sach/bao-mat"}
                        target="_blank"
                        className="btn btn-secondary btn-sm flex items-center gap-1.5 text-xs py-2 px-3 rounded-lg"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Xem trang ngoài</span>
                    </Link>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-primary btn-sm flex items-center gap-2 text-xs py-2 px-4 rounded-lg font-semibold shadow-sm transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                    </button>
                </div>
            </div>

            {/* Notification */}
            {savedMessage && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{savedMessage}</span>
                </div>
            )}

            {/* 3 Policy Tab Navigation */}
            <div className="grid sm:grid-cols-3 gap-3">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`p-3.5 rounded-xl border text-left transition-all ${
                                isActive
                                    ? "bg-[var(--color-surface)] border-[var(--color-primary)] shadow-sm ring-1 ring-[var(--color-primary)]"
                                    : "bg-[var(--color-surface)]/50 border-[var(--color-border)] hover:border-[var(--color-text-muted)] opacity-80"
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Icon className={`w-4 h-4 ${isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}`} />
                                <span className={`text-xs font-bold ${isActive ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}`}>
                                    {tab.name}
                                </span>
                            </div>
                            <p className="text-[10px] text-[var(--color-text-muted)] line-clamp-1 leading-normal">
                                {tab.desc}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Editor Workspace */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm space-y-5">
                {/* Meta Fields Grid */}
                <div className="grid sm:grid-cols-12 gap-4 pb-4 border-b border-[var(--color-border)]">
                    <div className="sm:col-span-6">
                        <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                            Tiêu đề trang (Title) *
                        </label>
                        <input
                            type="text"
                            value={currentPolicy.title || ""}
                            onChange={(e) => handleFieldChange("title", e.target.value)}
                            className="input text-xs w-full rounded-lg px-3 py-2 bg-[var(--color-bg)] border-[var(--color-border)]"
                            placeholder="Ví dụ: Chính Sách Bảo Mật Thông Tin"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                            Huy hiệu (Badge)
                        </label>
                        <input
                            type="text"
                            value={currentPolicy.badge || ""}
                            onChange={(e) => handleFieldChange("badge", e.target.value)}
                            className="input text-xs w-full rounded-lg px-3 py-2 bg-[var(--color-bg)] border-[var(--color-border)]"
                            placeholder="Ví dụ: Bảo Mật & Quyền Riêng Tư"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-[var(--color-text)] mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[var(--color-text-muted)]" />
                            <span>Ngày cập nhật</span>
                        </label>
                        <input
                            type="text"
                            value={currentPolicy.lastUpdated || ""}
                            onChange={(e) => handleFieldChange("lastUpdated", e.target.value)}
                            className="input text-xs w-full rounded-lg px-3 py-2 bg-[var(--color-bg)] border-[var(--color-border)]"
                            placeholder="Ví dụ: 18/08/2026"
                        />
                    </div>

                    <div className="sm:col-span-12">
                        <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                            Mô tả phụ giới thiệu (Subtitle)
                        </label>
                        <textarea
                            rows={2}
                            value={currentPolicy.subtitle || ""}
                            onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                            className="input text-xs w-full rounded-lg px-3 py-2 bg-[var(--color-bg)] border-[var(--color-border)] leading-relaxed"
                            placeholder="Tóm tắt ngắn gọn phạm vi và cam kết pháp lý của văn bản..."
                        />
                    </div>
                </div>

                {/* Rich Text Editor Body */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-[var(--color-text)]">
                            Nội dung chi tiết văn bản chính sách (Rich Text / HTML)
                        </label>
                        <button
                            type="button"
                            onClick={handleResetDefault}
                            className="text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" />
                            <span>Khôi phục mẫu gốc</span>
                        </button>
                    </div>

                    <RichTextEditor
                        value={currentPolicy.content || ""}
                        onChange={(val) => handleFieldChange("content", val)}
                        placeholder="Soạn thảo nội dung điều khoản, mục lục, bảng biểu và quy chế tại đây..."
                    />
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                        <Info className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        <span>Mẹo: Bạn có thể chèn tiêu đề H2, H3 để hệ thống tự động nhận diện và cập nhật mục lục TOC.</span>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-primary btn-sm flex items-center gap-2 text-xs py-2 px-5 rounded-lg font-semibold shadow-sm transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
