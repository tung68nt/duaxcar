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
    Image as ImageIcon
} from "lucide-react";

import { supabase } from "@/lib/supabase";

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
            const { data, error } = await supabase.from('instructors').select('*');
            if (!error && data && data.length > 0) {
                const formatted: Instructor[] = data.map((i: any) => ({
                    id: i.id,
                    name: i.name,
                    role: i.role,
                    title: i.title,
                    image: i.image,
                    bio: i.bio,
                    fullBio: i.full_bio,
                    achievements: i.achievements || [],
                    courses: i.courses || [],
                    quote: i.quote,
                    experience: i.experience,
                    visible: true,
                    imageAlign: "top"
                }));
                setInstructors(formatted);
            } else {
                setInstructors(defaultInstructors);
            }
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
        let instId = editingInstructor ? editingInstructor.id : `ins-${Date.now()}`;

        const payload = {
            id: instId,
            name: formState.name,
            role: formState.role,
            title: formState.title,
            image: formState.image,
            bio: formState.bio,
            full_bio: formState.fullBio || null,
            achievements: filteredAchievements,
            courses: filteredCourses,
            quote: formState.quote || null,
            experience: formState.experience || null
        };

        const { error } = await supabase.from('instructors').upsert(payload);
        if (error) {
            alert("Lỗi khi lưu vào Supabase: " + error.message);
            return;
        }

        let updated: Instructor[] = [];
        if (editingInstructor) {
            updated = instructors.map(ins => 
                ins.id === editingInstructor.id 
                    ? { ...ins, ...formState, achievements: filteredAchievements, courses: filteredCourses } 
                    : ins
            );
        } else {
            const newIns: Instructor = {
                id: instId,
                ...formState,
                achievements: filteredAchievements,
                courses: filteredCourses
            };
            updated = [...instructors, newIns];
        }

        setInstructors(updated);
        localStorage.setItem("admin_instructors", JSON.stringify(updated));
        setModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa giảng viên này khỏi danh sách?")) {
            const { error } = await supabase.from('instructors').delete().eq('id', id);
            if (error) {
                alert("Lỗi khi xóa từ Supabase: " + error.message);
                return;
            }
            const updated = instructors.filter(ins => ins.id !== id);
            setInstructors(updated);
            localStorage.setItem("admin_instructors", JSON.stringify(updated));
        }
    };


    const toggleVisibility = (id: string) => {
        const updated = instructors.map(ins => 
            ins.id === id ? { ...ins, visible: ins.visible === false ? true : false } : ins
        );
        setInstructors(updated);
        localStorage.setItem("admin_instructors", JSON.stringify(updated));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormState(prev => ({ ...prev, image: base64String }));
                setMediaModalOpen(false);
                
                const updatedMedia = [base64String, ...uploadedMedia.filter(m => m !== base64String)].slice(0, 12);
                setUploadedMedia(updatedMedia);
                localStorage.setItem("admin_media", JSON.stringify(updatedMedia));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6 w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="heading-2 text-[var(--color-text)]">
                        Quản Lý Đội Ngũ Giảng Viên
                    </h1>
                    <p className="text-small text-[var(--color-text-secondary)] mt-1">
                        Cập nhật hồ sơ, danh hiệu, thành tựu, trích dẫn, ảnh đại diện và các khóa học do giảng viên phụ trách.
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm giảng viên mới</span>
                </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm giảng viên theo tên, vai trò..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                </div>
            </div>

            {/* Grid List */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInstructors.map((ins) => (
                    <div 
                        key={ins.id}
                        className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl relative group shadow-sm flex flex-col justify-between"
                    >
                        <div>
                            {/* Visibility status */}
                            <button
                                type="button"
                                onClick={() => toggleVisibility(ins.id)}
                                className={`absolute top-4 right-4 p-1.5 rounded-xl border transition-all ${
                                    ins.visible !== false
                                        ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"
                                        : "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                                }`}
                                title={ins.visible !== false ? "Ẩn giảng viên" : "Hiện giảng viên"}
                            >
                                {ins.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            {/* Avatar & Profile */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[var(--color-surface-light)] relative border border-[var(--color-border)] flex-shrink-0">
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
                                    <h3 className="font-heading font-bold text-base text-[var(--color-text)] leading-tight">
                                        {ins.name}
                                    </h3>
                                    <p className="text-xs text-[var(--color-primary)] font-semibold mt-0.5">{ins.role}</p>
                                    <p className="text-[10px] text-[var(--color-text-muted)] font-medium mt-1">{ins.experience || "N/A"}</p>
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

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-fadeIn">
                        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between sticky top-0 bg-[var(--color-surface)] z-10">
                            <h3 className="font-heading font-semibold text-[var(--color-text)] text-base">
                                {editingInstructor ? "Chỉnh sửa hồ sơ giảng viên" : "Thêm giảng viên mới"}
                            </h3>
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
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
                                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Ảnh đại diện (Avatar URL)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formState.image}
                                            onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                                            className="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setMediaModalOpen(true)}
                                            className="px-4 py-2 bg-[var(--color-surface-light)] border border-[var(--color-border)] text-xs font-semibold rounded-xl text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white flex-shrink-0"
                                        >
                                            Chọn ảnh
                                        </button>
                                    </div>
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
                                <textarea
                                    value={formState.bio}
                                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                    rows={2}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="Nghệ nhân ẩm thực..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tiểu sử chi tiết (Full Bio)</label>
                                <textarea
                                    value={formState.fullBio}
                                    onChange={(e) => setFormState({ ...formState, fullBio: e.target.value })}
                                    rows={5}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
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

            {/* Avatar Media Dialog */}
            {mediaModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col animate-fadeIn">
                        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between sticky top-0 bg-[var(--color-surface)] z-10">
                            <div>
                                <h3 className="font-heading font-semibold text-[var(--color-text)] text-base">
                                    Thư viện Media
                                </h3>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Chọn ảnh đại diện giảng viên hoặc tải ảnh mới</p>
                            </div>
                            <button 
                                onClick={() => setMediaModalOpen(false)}
                                className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-2xl p-6 text-center cursor-pointer transition-colors relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-[var(--color-text)]">Tải ảnh mới từ máy tính</span>
                                </div>
                            </div>

                            {/* Stock images */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">Ảnh giảng viên có sẵn</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {stockImages.map((img) => (
                                        <button
                                            key={img.url}
                                            type="button"
                                            onClick={() => { setFormState(prev => ({ ...prev, image: img.url })); setMediaModalOpen(false); }}
                                            className="group text-left border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl overflow-hidden bg-[var(--color-background)] transition-all focus:outline-none"
                                        >
                                            <div className="relative aspect-[3/4] bg-[var(--color-surface-light)]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={img.url}
                                                    alt={img.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-2 border-t border-[var(--color-border)]">
                                                <p className="text-[10px] font-semibold text-[var(--color-text)] truncate">{img.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* User Custom Uploaded Images */}
                            {uploadedMedia.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">Ảnh bạn đã tải lên</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {uploadedMedia.map((base64, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => { setFormState(prev => ({ ...prev, image: base64 })); setMediaModalOpen(false); }}
                                                className="group text-left border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl overflow-hidden bg-[var(--color-background)] transition-all focus:outline-none"
                                            >
                                                <div className="relative aspect-square bg-[var(--color-surface-light)]">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={base64}
                                                        alt={`Custom upload ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
