"use client";

import { useEffect, useState } from "react";
import { 
    ChefHat, 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff,
    X,
    Save,
    Award,
    BookOpen,
    Quote,
    Image as ImageIcon,
    ArrowLeft
} from "lucide-react";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { supabase } from "@/lib/supabase";
import { MediaSelectorInput } from "@/components/admin/media-selector-input";

interface Instructor {

    id: string;
    name: string;
    role: string;
    title: string;
    image: string;
    bio: string;
    fullBio?: string;
    achievements: string[];
    courses: string[];
    quote?: string;
    experience?: string;
    visible?: boolean;
    imageAlign?: "top" | "center" | "bottom";
}

export default function AdminInstructors() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
    const [formState, setFormState] = useState<Omit<Instructor, "id">>({
        name: "",
        role: "",
        title: "",
        image: "/images/instructors/nguyen-huu-tho-v3.jpg",
        bio: "",
        fullBio: "",
        quote: "",
        experience: "",
        achievements: [""],
        courses: [""],
        visible: true,
        imageAlign: "top"
    });

    // Media selector states
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);

    const stockImages = [
        { name: "Thầy Nguyễn Hữu Thọ", url: "/images/instructors/nguyen-huu-tho-v3.jpg" },
        { name: "Thầy Phạm Văn Long", url: "/images/instructors/pham-van-long-v3.jpg" },
        { name: "Thầy Lưu Đức Toàn", url: "/images/instructors/luu-duc-toan-v3.jpg" },
        { name: "Cô Nguyễn Thị Hồng", url: "/images/instructors/nguyen-thi-hong.jpg" },
        { name: "Phở Bò", url: "/images/courses/pho-bo.jpg" },
        { name: "Bún Bò Huế", url: "/images/courses/bun-bo-hue.jpg" }
    ];

    const defaultInstructors: Instructor[] = [
        {
            id: "nguyen-huu-tho",
            name: "Nguyễn Hữu Thọ",
            role: "Giảng viên Món Việt",
            title: "Đồng sáng lập Duaxcar Kitchen | Giám đốc Cốt Phở Thọ",
            image: "/images/instructors/nguyen-huu-tho-v3.jpg",
            bio: "Nghệ nhân ẩm thực Bún bò Huế, Giám đốc Cốt Phở Thọ với hơn 10 năm kinh nghiệm.",
            fullBio: `Nguyễn Hữu Thọ sinh ra tại Mỹ Đức, Hà Nội – nơi tuổi thơ của anh gắn liền với mùi riêu cua, tiếng chảo mỡ xèo xèo và những buổi theo mẹ ra chợ từ sáng sớm để chuẩn bị cho gánh bún, hàng phở. Chính những ký ức giản dị và sống động ấy đã âm thầm gieo vào anh tình yêu với bếp Việt, đặc biệt là món nước truyền thống.\n\nKhởi đầu từ Trường Du lịch Hà Nội với chuyên ngành nấu ăn hệ trung cấp, Thọ bước chân vào bếp bằng cả sự đam mê và tinh thần học nghề nghiêm túc. Anh từng nấu ăn trong môi trường công trình như quân đội tại Lâm Đồng – nơi mọi thứ bắt đầu từ bếp củi, vạc lớn và kỷ luật thép. Chính những năm tháng ấy đã rèn cho anh tính tỉ mỉ, sức bền và sự chính xác trong từng thao tác làm bếp.\n\nSau đó, anh trải qua nhiều năm tích lũy kinh nghiệm tại các nhà hàng món Việt khắp miền Bắc – từ các quán đồng quê, đặc sản thú rừng đến nhà hàng thành thị. Vai trò bếp trưởng tại Mansion (Đào Tấn), Friendi (Nguyễn Chánh) giúp anh hoàn thiện tư duy tổ chức bếp, đào tạo đội nhóm và kiểm soát chất lượng món ăn ở quy mô lớn.\n\nNăm 2019, Nguyễn Hữu Thọ được vinh danh là Nghệ nhân ẩm thực Bún bò Huế tại Lễ hội Bonsai Việt – Nhật do Tập đoàn Vingroup tổ chức. Đây là cột mốc đánh dấu hành trình nghiêm túc của anh với việc giữ gìn và nâng tầm món Việt truyền thống.\n\nKhông chỉ dừng lại ở gian bếp, anh sáng lập Công ty Cốt Phở Thọ, cung cấp nước dùng cô đặc chất lượng cao cho các mô hình phở, bún, lẩu trên toàn quốc – với mong muốn giúp hàng nghìn chủ quán tiết kiệm thời gian, ổn định hương vị và tối ưu vận hành.\n\nHiện là giảng viên chính tại Duaxcar Kitchen, Nguyễn Hữu Thọ trực tiếp đào tạo các lớp học phở, bún, món Việt chuẩn vị. Với anh, việc dạy nghề không đơn thuần là truyền công thức – mà là truyền lửa, truyền văn hóa, truyền tư duy làm nghề bền vững.`,
            quote: "Mùi phở, mùi bún riêu đã ở trong máu từ ngày còn nhỏ. Tôi không chọn nghề – nghề chọn tôi.",
            experience: "10+ NĂM",
            achievements: [
                "Nghệ nhân ẩm thực Bún bò Huế 2019 (Vingroup)",
                "Bếp trưởng Mansion, Friendi",
                "Giám đốc Công ty Cốt Phở Thọ"
            ],
            courses: [
                "Phở bò truyền thống & hiện đại",
                "Bún bò Huế chuẩn vị",
                "Món nước Việt Nam",
                "Tư duy vận hành quán ăn"
            ],
            visible: true,
            imageAlign: "top"
        },
        {
            id: "pham-van-long",
            name: "Phạm Văn Long",
            role: "Founder Duax Car Kitchen",
            title: "Cố vấn đào tạo & chiến lược vận hành",
            image: "/images/instructors/pham-van-long-v3.jpg",
            bio: "Đầu bếp tư duy kinh doanh, chuyên gia cố vấn mô hình quán ăn.",
            fullBio: `Phạm Văn Long là người sáng lập Duax Car Kitchen – nơi hội tụ những đầu bếp thực chiến, tâm huyết với ẩm thực Việt và mô hình đào tạo sát với thực tế kinh doanh.\n\nXuất thân là một đầu bếp, Long nhanh chóng nhận ra rằng để một quán ăn thành công không chỉ cần món ăn ngon mà còn cần tư duy vận hành đúng, chiến lược sản phẩm rõ ràng và khả năng quản lý chi phí hiệu quả. Từ trải nghiệm mở – vận hành nhiều mô hình quán ăn tại Hà Nội, anh đã đúc kết được quy trình giúp học viên rút ngắn thời gian khởi sự và giảm thiểu sai lầm khi bắt đầu.\n\nTại Duax Car Kitchen, anh không chỉ đứng sau các khóa học mà còn trực tiếp xây dựng lộ trình đào tạo, lựa chọn giảng viên, biên soạn giáo trình và cố vấn mô hình kinh doanh cho từng học viên sau khóa học.\n\nVới tư duy đổi mới, thực tế và luôn đặt học viên làm trung tâm, Phạm Văn Long là người đứng sau sự phát triển bền vững và định hướng chiến lược dài hạn cho Duax Car Kitchen.`,
            quote: "Một người đầu bếp giỏi là người nấu được món ngon. Nhưng một người dạy nghề tốt – là người giúp người khác sống được với nghề.",
            experience: "15+ NĂM",
            achievements: [
                "Sáng lập & điều hành Duax Car Kitchen",
                "Cố vấn mô hình kinh doanh quán ăn",
                "Thiết kế chương trình đào tạo món Việt",
                "Đồng hành tư vấn vận hành"
            ],
            courses: [
                "Cố vấn mô hình kinh doanh quán ăn",
                "Thiết kế thực đơn theo thị trường",
                "Tư duy vận hành F&B"
            ],
            visible: true,
            imageAlign: "top"
        },
        {
            id: "luu-duc-toan",
            name: "Lưu Đức Toàn",
            role: "Chuyên gia ẩm thực món Việt",
            title: "Giảng viên giàu kinh nghiệm | Nghệ nhân Bàn tay vàng",
            image: "/images/instructors/luu-duc-toan-v3.jpg",
            bio: "Nghệ nhân ẩm thực 'Bàn tay vàng' 2024, hơn 25 năm kinh nghiệm thực chiến.",
            fullBio: `Với hơn 25 năm gắn bó trong ngành bếp chuyên nghiệp, Lưu Đức Toàn là một trong những giảng viên giàu kinh nghiệm, đặc biệt trong việc chế biến các món ăn truyền thống Việt Nam.\n\nTrong suốt sự nghiệp, anh từng đảm nhận các vị trí đầu bếp quan trọng tại nhiều nhà hàng và khách sạn lớn:\n- 5 năm tại Unilever Knorr, phụ trách phát triển công thức và kiểm định chất lượng món ăn.\n- 9 năm tại Long Vĩ Palace, nhà hàng tiệc cưới & hội nghị cao cấp tại Hà Nội.\n- 3 năm tại Khách sạn Thương mại, môi trường yêu cầu cao về kỹ thuật và chuẩn vị.\n\nBên cạnh công việc thực chiến trong nhà hàng – khách sạn, anh còn là giảng viên giảng dạy tại các trung tâm đào tạo nghề, truyền đạt kỹ năng và tư duy nấu món Việt cho nhiều thế hệ học viên.\n\nĐiểm mạnh chuyên môn: chế biến các món Việt truyền thống, ứng dụng nguyên liệu thực tế, tối ưu hương vị và quy trình vận hành bếp cho mô hình quán ăn vừa & nhỏ.\n\nNăm 2024 được ban văn phòng chính phủ trao tặng bằng Nghệ nhân ẩm thực bàn tay vàng.`,
            quote: "Nghề bếp không chỉ cần tay nghề – mà cần tâm và bản lĩnh.",
            experience: "25+ NĂM",
            achievements: [
                "Nghệ nhân ẩm thực \"Bàn tay vàng\" 2024",
                "5 năm tại Unilever Knorr",
                "Bếp trưởng Long Vĩ Palace (9 năm)"
            ],
            courses: ["Phở bò gia truyền", "Bún riêu cua đồng", "Các món đồng quê"],
            visible: true,
            imageAlign: "top"
        }
    ];

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const res = await fetch('/api/cms/instructors');
                if (res.ok) {
                    const json = await res.json();
                    if (json.instructors && json.instructors.length > 0) {
                        setInstructors(json.instructors);
                        localStorage.setItem("admin_instructors", JSON.stringify(json.instructors));
                        return;
                    }
                }
            } catch (e) {
                console.error("Error fetching instructors from API:", e);
            }

            const local = localStorage.getItem("admin_instructors");
            if (local) {
                try {
                    const parsed = JSON.parse(local);
                    if (parsed.length > 0) {
                        setInstructors(parsed);
                        return;
                    }
                } catch {}
            }

            setInstructors(defaultInstructors);
            localStorage.setItem("admin_instructors", JSON.stringify(defaultInstructors));
        };
        fetchInstructors();

        const savedMedia = localStorage.getItem("admin_media");
        if (savedMedia) {
            setUploadedMedia(JSON.parse(savedMedia));
        }
    }, []);


    useEffect(() => {
        let result = [...instructors];
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(ins => 
                ins.name.toLowerCase().includes(query) || 
                ins.role.toLowerCase().includes(query) ||
                ins.title.toLowerCase().includes(query)
            );
        }
        setFilteredInstructors(result);
    }, [instructors, searchTerm]);

    const openAddModal = () => {
        setEditingInstructor(null);
        setFormState({
            name: "",
            role: "",
            title: "",
            image: "/images/instructors/nguyen-huu-tho-v3.jpg",
            bio: "",
            fullBio: "",
            quote: "",
            experience: "",
            achievements: [""],
            courses: [""],
            visible: true
        });
        setModalOpen(true);
    };

    const openEditModal = (ins: Instructor) => {
        setEditingInstructor(ins);
        setFormState({
            name: ins.name,
            role: ins.role,
            title: ins.title,
            image: ins.image,
            bio: ins.bio,
            fullBio: ins.fullBio || "",
            quote: ins.quote || "",
            experience: ins.experience || "",
            achievements: ins.achievements.length > 0 ? ins.achievements : [""],
            courses: ins.courses.length > 0 ? ins.courses : [""],
            visible: ins.visible !== false,
            imageAlign: ins.imageAlign || "top"
        });
        setModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Filter empty elements out of arrays
        const filteredAchievements = formState.achievements.filter(a => a.trim() !== "");
        const filteredCourses = formState.courses.filter(c => c.trim() !== "");
        const instId = editingInstructor ? editingInstructor.id : `ins-${Date.now()}`;

        const newIns: Instructor = {
            id: instId,
            ...formState,
            achievements: filteredAchievements,
            courses: filteredCourses
        };

        // 1. Save to server API and WAIT for result
        try {
            const res = await fetch('/api/cms/instructors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instructor: newIns })
            });
            const result = await res.json();

            if (!res.ok || result.error) {
                alert(`Lỗi lưu giảng viên: ${result.error || 'Không xác định'}`);
                return;
            }

            if (result.warning) {
                alert(`⚠️ Dữ liệu đã lưu nhưng đồng bộ Supabase thất bại. Trang công khai có thể hiển thị dữ liệu cũ.`);
            }
        } catch (err) {
            console.error("Could not save to /api/cms/instructors:", err);
            alert("Lỗi kết nối server. Vui lòng kiểm tra kết nối mạng và thử lại.");
            return;
        }

        // 2. Only update local state AFTER API confirms success
        let updated: Instructor[] = [];
        if (editingInstructor) {
            updated = instructors.map(ins => 
                ins.id === editingInstructor.id 
                    ? newIns 
                    : ins
            );
        } else {
            updated = [...instructors, newIns];
        }

        setInstructors(updated);
        try {
            localStorage.setItem("admin_instructors", JSON.stringify(updated));
        } catch {}
        setModalOpen(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64String = reader.result as string;
                    let finalUrl = base64String;

                    try {
                        const res = await fetch("/api/cms/upload", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                base64: base64String,
                                name: file.name,
                                type: "image",
                                sizeBytes: file.size
                            })
                        });
                        if (res.ok) {
                            const json = await res.json();
                            if (json.url) finalUrl = json.url;
                        }
                    } catch (err) {
                        console.warn("Upload API error:", err);
                    }

                    setFormState(prev => ({ ...prev, image: finalUrl }));
                    
                    const updatedMedia = [finalUrl, ...uploadedMedia.filter(m => m !== finalUrl)].slice(0, 12);
                    setUploadedMedia(updatedMedia);
                    try {
                        localStorage.setItem("admin_media", JSON.stringify(updatedMedia));
                    } catch {}
                    setMediaModalOpen(false);
                };
                reader.readAsDataURL(file);
            } catch (err) {
                console.error("File upload error:", err);
            }
        }
    };

    const toggleVisibility = async (id: string) => {
        const found = instructors.find(i => i.id === id);
        if (!found) return;

        const updatedItem = { ...found, visible: !(found.visible !== false) };
        try {
            const res = await fetch('/api/cms/instructors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instructor: updatedItem })
            });
            if (!res.ok) return;
        } catch { return; }

        const updated = instructors.map(i => i.id === id ? updatedItem : i);
        setInstructors(updated);
        localStorage.setItem("admin_instructors", JSON.stringify(updated));
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa giảng viên này?")) {
            try {
                const res = await fetch(`/api/cms/instructors?id=${id}`, { method: 'DELETE' });
                if (!res.ok) {
                    const result = await res.json();
                    alert(`Lỗi xóa: ${result.error || 'Không xác định'}`);
                    return;
                }
            } catch (err) {
                console.error("Could not delete via API:", err);
                alert("Lỗi kết nối server khi xóa.");
                return;
            }

            const updated = instructors.filter(i => i.id !== id);
            setInstructors(updated);
            localStorage.setItem("admin_instructors", JSON.stringify(updated));
        }
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
                                {editingInstructor ? `Chỉnh sửa hồ sơ: ${editingInstructor.name}` : "Thêm giảng viên mới"}
                            </h2>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                Cập nhật tiểu sử, thành tựu, khóa dạy & ảnh đại diện giảng viên.
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
                                const form = document.getElementById("instructor-form") as HTMLFormElement;
                                if (form) form.requestSubmit();
                            }}
                            className="btn btn-primary btn-sm flex items-center gap-1.5"
                        >
                            <Save className="w-4 h-4" />
                            <span>Lưu giảng viên</span>
                        </button>
                    </div>
                </div>

                {/* Main Form Container */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                    <form id="instructor-form" onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Họ và tên giảng viên</label>
                                <input
                                    type="text"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="Ví dụ: Nguyễn Hữu Thọ"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Vai trò hiển thị (Role Tag)</label>
                                <input
                                    type="text"
                                    value={formState.role}
                                    onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="Ví dụ: Giảng viên Món Việt"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Danh hiệu / Học vị (Title Line)</label>
                                <input
                                    type="text"
                                    value={formState.title}
                                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="Ví dụ: Đồng sáng lập Duaxcar Kitchen"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Kinh nghiệm làm việc</label>
                                <input
                                    type="text"
                                    value={formState.experience}
                                    onChange={(e) => setFormState({ ...formState, experience: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="Ví dụ: 10+ NĂM hoặc Hơn 15 năm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                                <MediaSelectorInput
                                    label="Ảnh chân dung giảng viên"
                                    description="Ảnh đại diện sắc nét của giảng viên"
                                    value={formState.image}
                                    onChange={(url) => setFormState({ ...formState, image: url })}
                                    aspectRatio="portrait"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Căn vị trí ảnh (Lấy nét mặt)</label>
                                <select
                                    value={formState.imageAlign || "top"}
                                    onChange={(e) => setFormState({ ...formState, imageAlign: e.target.value as any })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                >
                                    <option value="top">Căn trên (Ưu tiên lấy mặt)</option>
                                    <option value="center">Căn giữa (Mặc định)</option>
                                    <option value="bottom">Căn dưới</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Châm ngôn (Quote)</label>
                            <input
                                type="text"
                                value={formState.quote}
                                onChange={(e) => setFormState({ ...formState, quote: e.target.value })}
                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                placeholder="Mùi phở đã ở trong máu..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tóm tắt ngắn (Bio)</label>
                            <AutoResizeTextarea
                                value={formState.bio}
                                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                placeholder="Nghệ nhân ẩm thực..."
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tiểu sử chi tiết (Full Bio)</label>
                            <AutoResizeTextarea
                                value={formState.fullBio || ""}
                                onChange={(e) => setFormState({ ...formState, fullBio: e.target.value })}
                                placeholder="Nhập tiểu sử đầy đủ, xuống dòng bằng phím Enter để tách đoạn..."
                            />
                        </div>

                        {/* Achievements array input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Thành tựu & Kinh nghiệm nổi bật</label>
                                <button
                                    type="button"
                                    onClick={() => setFormState({ ...formState, achievements: [...formState.achievements, ""] })}
                                    className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 font-semibold"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Thêm dòng
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formState.achievements.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                                const updated = [...formState.achievements];
                                                updated[index] = e.target.value;
                                                setFormState({ ...formState, achievements: updated });
                                            }}
                                            className="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            placeholder={`Dòng thành tựu ${index + 1}`}
                                        />
                                        {formState.achievements.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setFormState({ ...formState, achievements: formState.achievements.filter((_, i) => i !== index) })}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Courses array input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Khóa học / Lớp học phụ trách</label>
                                <button
                                    type="button"
                                    onClick={() => setFormState({ ...formState, courses: [...formState.courses, ""] })}
                                    className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 font-semibold"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Thêm dòng
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formState.courses.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                                const updated = [...formState.courses];
                                                updated[index] = e.target.value;
                                                setFormState({ ...formState, courses: updated });
                                            }}
                                            className="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            placeholder={`Khóa học ${index + 1}`}
                                        />
                                        {formState.courses.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setFormState({ ...formState, courses: formState.courses.filter((_, i) => i !== index) })}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text)] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formState.visible !== false}
                                    onChange={(e) => setFormState({ ...formState, visible: e.target.checked })}
                                    className="w-4 h-4 rounded text-[var(--color-primary)] border-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)]"
                                />
                                <span>Hiển thị công khai giảng viên này trên trang giới thiệu</span>
                            </label>
                        </div>

                        {/* Submit */}
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
        );
    }

    return (
        <div className="space-y-4 w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="heading-3 text-[var(--color-text)]">
                        Quản Lý Đội Ngũ Giảng Viên
                    </h1>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        Cập nhật hồ sơ, danh hiệu, thành tựu, trích dẫn, ảnh đại diện và các khóa học do giảng viên phụ trách.
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto text-xs"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm giảng viên mới</span>
                </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm giảng viên theo tên, vai trò..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-1.5 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                </div>
            </div>

            {/* Grid List */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredInstructors.map((ins) => (
                    <div 
                        key={ins.id}
                        className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl relative group shadow-sm flex flex-col justify-between"
                    >
                        <div>
                            {/* Visibility status */}
                            <button
                                type="button"
                                onClick={() => toggleVisibility(ins.id)}
                                className={`absolute top-3 right-3 p-1 rounded-lg border transition-all ${
                                    ins.visible !== false
                                        ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"
                                        : "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                                }`}
                                title={ins.visible !== false ? "Ẩn giảng viên" : "Hiện giảng viên"}
                            >
                                {ins.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            {/* Avatar & Profile */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-surface-light)] relative border border-[var(--color-border)] flex-shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={ins.image}
                                        alt={ins.name}
                                        className={`w-full h-full object-cover ${
                                            ins.imageAlign === "top" ? "object-top" :
                                            ins.imageAlign === "bottom" ? "object-bottom" :
                                            "object-center"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-sm text-[var(--color-text)] leading-tight">
                                        {ins.name}
                                    </h3>
                                    <p className="text-xs text-[var(--color-primary)] font-semibold mt-0.5">{ins.role}</p>
                                    <p className="text-[10px] text-[var(--color-text-muted)] font-medium mt-0.5">{ins.experience || "N/A"}</p>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6 line-clamp-3">
                                {ins.bio}
                            </p>

                            {/* Achievements & Courses Counts */}
                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[var(--color-border)] mb-6 text-xs text-[var(--color-text-secondary)]">
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                    <span>{ins.achievements.length} thành tựu</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    <span>{ins.courses.length} lớp học</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-3 pt-2">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                ins.visible !== false 
                                    ? "bg-green-500/10 text-green-500" 
                                    : "bg-red-500/10 text-red-500"
                            }`}>
                                {ins.visible !== false ? "Đang Hiện" : "Đang Ẩn"}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(ins)}
                                    className="p-1.5 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all"
                                    title="Sửa"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(ins.id)}
                                    className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
