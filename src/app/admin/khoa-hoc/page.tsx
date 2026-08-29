"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
    BookOpen, 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    Save, 
    Award, 
    DollarSign, 
    Clock, 
    ArrowLeft,
    Copy,
    ExternalLink,
    Users,
    Play,
    Sparkles,
    Video,
    Globe,
    CheckCircle2,
    Layers,
    RotateCcw,
    Check,
    AlertCircle,
    FileText,
    Flame,
    Images,
    Image as ImageIcon,
    Camera
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

import { Course } from "@/lib/types";
import { courses as defaultMockCourses, instructors, courseCategories } from "@/data/mock";
import { MediaSelectorInput } from "@/components/admin/media-selector-input";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

function AdminCoursesContent() {
    const searchParams = useSearchParams();
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [isSaving, setIsSaving] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveWarning, setSaveWarning] = useState<string | null>(null);

    // Modal & Form states
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isDuplicateMode, setIsDuplicateMode] = useState(false);
    
    const initialFormState: Omit<Course, "id"> = {
        slug: "",
        name: "",
        category: "mon-an-sang",
        courseType: "onsite",
        description: "",
        shortDescription: "",
        price: 5000000,
        contactForPrice: false,
        duration: "1 buổi (8 giờ)",
        maxStudents: 8,
        totalLessons: 10,
        totalDuration: "14 giờ",
        accessDuration: "Trọn đời",
        onlineUrl: "",
        instructor: "Nguyễn Hữu Thọ",
        instructorId: "1",
        image: "/images/courses/pho-bo.jpg",
        gallery: [],
        videoUrl: "",
        highlights: [
            "Bí quyết gia truyền chuẩn hương vị kinh doanh",
            "Hướng dẫn tính toán chi phí cost và tối ưu lợi nhuận",
            "Thực hành thực tế 100% nguyên liệu tươi sạch"
        ],
        curriculum: [
            { title: "Chương 1: Chọn lọc & Xử lý nguyên liệu", description: "Bí quyết chọn thịt bò, xương ống và sơ chế khử mùi chuẩn nghệ nhân" },
            { title: "Chương 2: Kỹ thuật hầm nước dùng & Nêm nếm", description: "Công thức gia vị thảo mộc chuẩn vị thơm thanh đậm đà" }
        ],
        featured: false
    };

    const [formState, setFormState] = useState<Omit<Course, "id">>(initialFormState);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/cms/courses');
                if (res.ok) {
                    const json = await res.json();
                    if (json.courses && json.courses.length > 0) {
                        setCourses(json.courses);
                        localStorage.setItem("admin_courses", JSON.stringify(json.courses));
                        return;
                    }
                }
            } catch (e) {
                console.error("Error fetching courses from API:", e);
            }

            const localCourses = localStorage.getItem("admin_courses");
            if (localCourses) {
                try {
                    const parsed = JSON.parse(localCourses);
                    if (parsed.length > 0) {
                        setCourses(parsed);
                        return;
                    }
                } catch {}
            }

            setCourses(defaultMockCourses);
            localStorage.setItem("admin_courses", JSON.stringify(defaultMockCourses));
        };
        fetchCourses();

        // Open in Add mode if query parameter is set
        if (searchParams.get("add") === "true") {
            openAddModal();
        }
    }, [searchParams]);

    // Filter courses logic
    useEffect(() => {
        let result = [...courses];
        if (searchTerm) {
            const query = searchTerm.toLowerCase().trim();
            result = result.filter(c => 
                c.name.toLowerCase().includes(query) || 
                c.slug.toLowerCase().includes(query) ||
                c.instructor.toLowerCase().includes(query)
            );
        }
        if (typeFilter !== "all") {
            result = result.filter(c => c.courseType === typeFilter);
        }
        if (categoryFilter !== "all") {
            result = result.filter(c => c.category === categoryFilter);
        }
        setFilteredCourses(result);
    }, [courses, searchTerm, typeFilter, categoryFilter]);

    // Generate slug helper
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/([^0-9a-z-\s])/g, "")
            .replace(/(\s+)/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleTitleChange = (name: string) => {
        if (!editingCourse || isDuplicateMode) {
            setFormState(prev => ({ ...prev, name, slug: generateSlug(name) }));
        } else {
            setFormState(prev => ({ ...prev, name }));
        }
    };

    // Open Add Modal
    const openAddModal = (presetType: "onsite" | "elearning" = "onsite") => {
        setEditingCourse(null);
        setIsDuplicateMode(false);
        setFormState({
            ...initialFormState,
            courseType: presetType,
            onlineUrl: presetType === "elearning" ? "https://academy.duaxcar.com/khoa-hoc/" : ""
        });
        setModalOpen(true);
    };

    // Open Edit Modal
    const openEditModal = (course: Course) => {
        setEditingCourse(course);
        setIsDuplicateMode(false);
        setFormState({
            slug: course.slug,
            name: course.name,
            category: course.category,
            courseType: course.courseType,
            description: course.description || "",
            shortDescription: course.shortDescription || "",
            price: course.price,
            contactForPrice: course.contactForPrice || false,
            duration: course.duration || "1 buổi (8 giờ)",
            maxStudents: course.maxStudents || 8,
            totalLessons: course.totalLessons || 10,
            totalDuration: course.totalDuration || "14 giờ",
            accessDuration: course.accessDuration || "Trọn đời",
            onlineUrl: course.onlineUrl || "",
            instructor: course.instructor,
            instructorId: course.instructorId,
            image: course.image || "/images/courses/pho-bo.jpg",
            gallery: course.gallery ? [...course.gallery] : [],
            videoUrl: course.videoUrl || "",
            highlights: course.highlights || [],
            curriculum: course.curriculum || [],
            featured: course.featured || false
        });
        setModalOpen(true);
    };

    // Duplicate Course
    const handleDuplicate = (course: Course) => {
        setEditingCourse(null);
        setIsDuplicateMode(true);
        const duplicatedName = `${course.name} (Bản sao)`;
        setFormState({
            slug: `${generateSlug(course.slug)}-sao-${Date.now().toString().slice(-4)}`,
            name: duplicatedName,
            category: course.category,
            courseType: course.courseType,
            description: course.description || "",
            shortDescription: course.shortDescription || "",
            price: course.price,
            contactForPrice: course.contactForPrice || false,
            duration: course.duration || "1 buổi (8 giờ)",
            maxStudents: course.maxStudents || 8,
            totalLessons: course.totalLessons || 10,
            totalDuration: course.totalDuration || "14 giờ",
            accessDuration: course.accessDuration || "Trọn đời",
            onlineUrl: course.onlineUrl || "",
            instructor: course.instructor,
            instructorId: course.instructorId,
            image: course.image || "/images/courses/pho-bo.jpg",
            gallery: course.gallery ? [...course.gallery] : [],
            videoUrl: course.videoUrl || "",
            highlights: course.highlights ? [...course.highlights] : [],
            curriculum: course.curriculum ? [...course.curriculum] : [],
            featured: false
        });
        setModalOpen(true);
    };

    // Instructor selector helper
    const handleInstructorChange = (id: string) => {
        const found = instructors.find(i => i.id === id);
        if (found) {
            setFormState(prev => ({
                ...prev,
                instructorId: id,
                instructor: found.name
            }));
        }
    };

    // Highlights handlers
    const addHighlight = () => {
        setFormState(prev => ({
            ...prev,
            highlights: [...prev.highlights, ""]
        }));
    };

    const updateHighlight = (index: number, value: string) => {
        const updated = [...formState.highlights];
        updated[index] = value;
        setFormState(prev => ({ ...prev, highlights: updated }));
    };

    const removeHighlight = (index: number) => {
        const updated = formState.highlights.filter((_, i) => i !== index);
        setFormState(prev => ({ ...prev, highlights: updated }));
    };

    // Curriculum handlers
    const addChapter = () => {
        setFormState(prev => ({
            ...prev,
            curriculum: [...prev.curriculum, { title: "", description: "" }]
        }));
    };

    const updateChapter = (index: number, key: "title" | "description", value: string) => {
        const updated = [...formState.curriculum];
        updated[index] = { ...updated[index], [key]: value };
        setFormState(prev => ({ ...prev, curriculum: updated }));
    };

    const removeChapter = (index: number) => {
        const updated = formState.curriculum.filter((_, i) => i !== index);
        setFormState(prev => ({ ...prev, curriculum: updated }));
    };

    // Gallery helpers
    const addGalleryImage = (url: string) => {
        if (!url || !url.trim()) return;
        setFormState(prev => ({
            ...prev,
            gallery: [...(prev.gallery || []), url.trim()]
        }));
    };

    const removeGalleryImage = (index: number) => {
        setFormState(prev => ({
            ...prev,
            gallery: (prev.gallery || []).filter((_, i) => i !== index)
        }));
    };

    const updateGalleryImage = (index: number, url: string) => {
        const updated = [...(formState.gallery || [])];
        updated[index] = url;
        setFormState(prev => ({ ...prev, gallery: updated }));
    };

    // Handle Form Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);
        setSaveWarning(null);
        
        const courseId = editingCourse && !isDuplicateMode ? editingCourse.id : `course-${Date.now()}`;
        
        const courseData: Course = {
            id: courseId,
            slug: formState.slug.trim(),
            name: formState.name.trim(),
            category: formState.category,
            courseType: formState.courseType,
            description: formState.description,
            shortDescription: formState.shortDescription.trim(),
            price: Number(formState.price) || 0,
            contactForPrice: formState.contactForPrice || false,
            duration: formState.duration.trim(),
            maxStudents: formState.courseType === "onsite" ? Number(formState.maxStudents) || 8 : undefined,
            instructor: formState.instructor,
            instructorId: formState.instructorId,
            image: formState.image,
            gallery: formState.gallery?.filter(g => g && g.trim().length > 0) || [],
            highlights: formState.highlights.filter(h => h.trim().length > 0),
            curriculum: formState.curriculum.filter(c => c.title.trim().length > 0),
            featured: formState.featured || false,
            totalLessons: formState.courseType === "elearning" ? Number(formState.totalLessons) || 10 : undefined,
            totalDuration: formState.courseType === "elearning" ? formState.totalDuration : undefined,
            accessDuration: formState.courseType === "elearning" ? formState.accessDuration : undefined,
            onlineUrl: formState.courseType === "elearning" ? formState.onlineUrl?.trim() : ""
        };

        // 1. Save to server API and WAIT for result
        let apiSuccess = false;
        try {
            const res = await fetch('/api/cms/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course: courseData })
            });
            const result = await res.json();
            
            if (!res.ok || result.error) {
                setSaveError(`Lỗi lưu dữ liệu: ${result.error || 'Không xác định'}`);
                setIsSaving(false);
                return;
            }
            
            apiSuccess = true;
            
            if (result.warning) {
                setSaveWarning(`⚠️ Dữ liệu đã lưu vào server nhưng đồng bộ Supabase thất bại. Trang công khai có thể hiển thị dữ liệu cũ.`);
            }
        } catch (err) {
            console.error("Could not save to /api/cms/courses:", err);
            setSaveError("Lỗi kết nối server. Vui lòng kiểm tra kết nối mạng và thử lại.");
            setIsSaving(false);
            return;
        }

        // 2. Only update local state AFTER API confirms success
        if (apiSuccess) {
            let updatedCourses: Course[] = [];
            if (editingCourse && !isDuplicateMode) {
                updatedCourses = courses.map(c => c.id === editingCourse.id ? courseData : c);
            } else {
                updatedCourses = [courseData, ...courses];
            }

            setCourses(updatedCourses);
            localStorage.setItem("admin_courses", JSON.stringify(updatedCourses));
            setModalOpen(false);
        }
        
        setIsSaving(false);
    };

    // Delete Course
    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Bạn có chắc chắn muốn xóa khóa học "${name}"?`)) {
            try {
                await fetch(`/api/cms/courses?id=${id}`, { method: 'DELETE' });
            } catch (err) {
                console.warn("Could not delete via API:", err);
            }

            const updated = courses.filter(c => c.id !== id);
            setCourses(updated);
            localStorage.setItem("admin_courses", JSON.stringify(updated));
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(value);
    };

    const onsiteCount = courses.filter(c => c.courseType === "onsite").length;
    const elearningCount = courses.filter(c => c.courseType === "elearning").length;
    const featuredCount = courses.filter(c => c.featured).length;

    // ==========================================
    // RENDER: MODAL / FULL SCREEN FORM
    // ==========================================
    if (modalOpen) {
        const isOnline = formState.courseType === "elearning";

        return (
            <div className="space-y-6 animate-fadeIn pb-16 max-w-7xl mx-auto">
                {/* Sticky Action Header */}
                <div className="sticky top-4 z-40 flex items-center justify-between bg-[var(--color-surface)]/95 backdrop-blur-md p-4 sm:p-5 border border-[var(--color-border)] rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="p-2.5 rounded-xl bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                            title="Quay lại danh sách"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="heading-3 text-[var(--color-text)]">
                                    {isDuplicateMode 
                                        ? "Nhân bản khóa học mới" 
                                        : editingCourse 
                                            ? `Chỉnh sửa: ${editingCourse.name}` 
                                            : "Thêm khóa học mới"}
                                </h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                    isOnline 
                                        ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" 
                                        : "bg-green-500/10 text-green-500 border border-green-500/20"
                                }`}>
                                    {isOnline ? <Play className="w-3 h-3 fill-current" /> : <Users className="w-3 h-3" />}
                                    {isOnline ? "Khóa Online (E-Learning)" : "Khóa Trực tiếp (Offline)"}
                                </span>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                Các trường thông tin chung được đồng bộ, phân loại rõ luồng đăng ký qua E-learning hoặc Form thu lead.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="btn btn-secondary btn-sm"
                            disabled={isSaving}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const form = document.getElementById("unified-course-form") as HTMLFormElement;
                                if (form) form.requestSubmit();
                            }}
                            disabled={isSaving}
                            className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? "Đang lưu..." : "Lưu khóa học"}</span>
                        </button>
                    </div>
                </div>

                {/* Save Error Notification */}
                {saveError && (
                    <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs font-medium animate-fadeIn">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">{saveError}</span>
                        <button onClick={() => setSaveError(null)} className="p-1 hover:bg-red-500/20 rounded transition-colors">✕</button>
                    </div>
                )}

                {/* Save Warning Notification */}
                {saveWarning && (
                    <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg flex items-center gap-2 text-xs font-medium animate-fadeIn">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">{saveWarning}</span>
                        <button onClick={() => setSaveWarning(null)} className="p-1 hover:bg-amber-500/20 rounded transition-colors">✕</button>
                    </div>
                )}

                {/* Form Body */}
                <form id="unified-course-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* STEP 1: CHOOSE COURSE TYPE (PROMINENT SEGMENTED CARDS) */}
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                1. Phân loại hình thức khóa học *
                            </label>
                            <span className="text-[11px] text-[var(--color-text-muted)]">
                                Chọn loại hình để tự động kích hoạt luồng đăng ký tương ứng
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Card: Offline / Onsite */}
                            <div 
                                onClick={() => setFormState(prev => ({ ...prev, courseType: "onsite" }))}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden flex items-start gap-4 ${
                                    formState.courseType === "onsite"
                                        ? "border-green-500 bg-green-500/5 shadow-md shadow-green-500/5"
                                        : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-green-500/40"
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                    formState.courseType === "onsite" ? "bg-green-500 text-white shadow-sm" : "bg-[var(--color-surface-light)] text-[var(--color-text-muted)]"
                                }`}>
                                    <Users className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-sm text-[var(--color-text)]">Khóa học Trực tiếp (Offline)</h4>
                                        {formState.courseType === "onsite" && (
                                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5" />
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                        Đào tạo "Cầm tay chỉ việc" 1-1 tại cơ sở DuaxCar Kitchen.
                                    </p>
                                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-green-600 bg-green-500/10 px-2.5 py-1 rounded-lg">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Luồng CTA: Mở <strong>Form điền thông tin thu Lead tư vấn</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Card: Online / E-Learning */}
                            <div 
                                onClick={() => {
                                    setFormState(prev => ({ 
                                        ...prev, 
                                        courseType: "elearning",
                                        onlineUrl: prev.onlineUrl || "https://academy.duaxcar.com/khoa-hoc/"
                                    }));
                                }}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden flex items-start gap-4 ${
                                    formState.courseType === "elearning"
                                        ? "border-purple-500 bg-purple-500/5 shadow-md shadow-purple-500/5"
                                        : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-purple-500/40"
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                    formState.courseType === "elearning" ? "bg-purple-600 text-white shadow-sm" : "bg-[var(--color-surface-light)] text-[var(--color-text-muted)]"
                                }`}>
                                    <Play className="w-6 h-6 fill-current" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-sm text-[var(--color-text)]">Khóa học Online (E-Learning)</h4>
                                        {formState.courseType === "elearning" && (
                                            <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5" />
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                        Học qua video bài giảng chất lượng cao trên website E-Learning.
                                    </p>
                                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-purple-600 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                                        <Globe className="w-3 h-3" />
                                        Luồng CTA: Mở trực tiếp <strong>Đường dẫn khóa học E-Learning (URL)</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN TWO-COLUMN GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* LEFT COLUMN: 2 SPANS (COMMON INFO, DESCRIPTIONS, HIGHLIGHTS, SYLLABUS) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Card 1: Thông tin cơ bản */}
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                    2. Thông tin chung khóa học
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text)] block mb-1.5">
                                            Tên khóa học <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formState.name}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            placeholder="Ví dụ: Khóa học nấu Phở Bò Kinh Doanh..."
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-xs font-semibold text-[var(--color-text)] block">
                                                    Đường dẫn tĩnh (Slug) <span className="text-red-500">*</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormState(prev => ({ ...prev, slug: generateSlug(prev.name) }))}
                                                    className="text-[10px] text-[var(--color-primary)] hover:underline flex items-center gap-1"
                                                >
                                                    <RotateCcw className="w-2.5 h-2.5" /> Tạo lại slug
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">/khoa-hoc/</span>
                                                <input
                                                    type="text"
                                                    value={formState.slug}
                                                    onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl pl-24 pr-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none font-mono"
                                                    placeholder="pho-bo-kinh-doanh"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-[var(--color-text)] block mb-1.5">
                                                Danh mục ẩm thực <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formState.category}
                                                onChange={(e) => setFormState({ ...formState, category: e.target.value as any })}
                                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            >
                                                {courseCategories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Mô tả ngắn */}
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text)] block mb-1.5">
                                            Mô tả tóm tắt (Hiển thị ngoài card danh sách) <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={formState.shortDescription}
                                            onChange={(e) => setFormState({ ...formState, shortDescription: e.target.value })}
                                            rows={2}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none resize-none"
                                            placeholder="Tóm tắt ngắn gọn 1-2 câu về nội dung và đối tượng học viên của khóa học..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Mô tả chi tiết HTML */}
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
                                <RichTextEditor
                                    label="Mô tả chi tiết bài viết khóa học"
                                    value={formState.description}
                                    onChange={(html) => setFormState({ ...formState, description: html })}
                                    placeholder="Giới thiệu đầy đủ về khóa học: Mục tiêu đào tạo, đối tượng tham gia, giá trị nhận được, quyền lợi học viên..."
                                    minHeight="240px"
                                />
                            </div>

                            {/* Card 3: Điểm nổi bật (Highlights) */}
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                            Điểm nổi bật của khóa học
                                        </h3>
                                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                                            Các tiêu chí nổi bật được hiển thị dạng danh sách checkmark trên trang chi tiết
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addHighlight}
                                        className="btn btn-secondary btn-sm text-xs flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Thêm điểm nổi bật
                                    </button>
                                </div>

                                <div className="space-y-2.5 pt-1">
                                    {formState.highlights.map((hl, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <span className="w-6 h-6 rounded-lg bg-[var(--color-surface-light)] text-[11px] font-bold text-[var(--color-text-muted)] flex items-center justify-center flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={hl}
                                                onChange={(e) => updateHighlight(index, e.target.value)}
                                                className="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                                placeholder={`Ví dụ: Bí quyết nêm nếm gia truyền chuẩn tỷ lệ vàng...`}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeHighlight(index)}
                                                className="p-2 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                                title="Xóa dòng này"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {formState.highlights.length === 0 && (
                                        <div className="text-center py-4 bg-[var(--color-surface-light)]/40 rounded-xl border border-dashed border-[var(--color-border)]">
                                            <p className="text-xs text-[var(--color-text-muted)]">Chưa thêm điểm nổi bật nào.</p>
                                            <button
                                                type="button"
                                                onClick={addHighlight}
                                                className="text-xs text-[var(--color-primary)] font-semibold mt-1 hover:underline"
                                            >
                                                + Thêm điểm nổi bật đầu tiên
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card 4: Giáo trình / Chương trình học (Syllabus) */}
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                            Chương trình học chi tiết (Syllabus)
                                        </h3>
                                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                                            Các chương bài học được hiển thị dạng Accordion thu gọn / mở rộng
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addChapter}
                                        className="btn btn-secondary btn-sm text-xs flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Thêm chương mới
                                    </button>
                                </div>

                                <div className="space-y-3.5 pt-1">
                                    {formState.curriculum && formState.curriculum.map((chap, index) => (
                                        <div key={index} className="p-4 bg-[var(--color-surface-light)]/40 border border-[var(--color-border)] rounded-xl space-y-3 relative group">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-[11px] rounded-md">
                                                        Chương #{index + 1}
                                                    </span>
                                                    <span className="text-xs font-semibold text-[var(--color-text)]">
                                                        {chap.title || `Chương ${index + 1}`}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeChapter(index)}
                                                    className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Xóa chương này"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2.5">
                                                <div>
                                                    <label className="text-[11px] font-semibold text-[var(--color-text-secondary)] block mb-1">
                                                        Tiêu đề chương
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={chap.title}
                                                        onChange={(e) => updateChapter(index, "title", e.target.value)}
                                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3.5 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                                        placeholder="Ví dụ: Chương 1: Kỹ thuật chọn nguyên liệu & Sơ chế"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-semibold text-[var(--color-text-secondary)] block mb-1">
                                                        Mô tả tóm tắt nội dung chương
                                                    </label>
                                                    <textarea
                                                        value={chap.description}
                                                        onChange={(e) => updateChapter(index, "description", e.target.value)}
                                                        rows={2}
                                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3.5 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none resize-none"
                                                        placeholder="Mô tả các bài học hoặc kỹ năng đạt được trong chương này..."
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!formState.curriculum || formState.curriculum.length === 0) && (
                                        <div className="text-center py-4 bg-[var(--color-surface-light)]/40 rounded-xl border border-dashed border-[var(--color-border)]">
                                            <p className="text-xs text-[var(--color-text-muted)]">Chưa thêm chương học nào.</p>
                                            <button
                                                type="button"
                                                onClick={addChapter}
                                                className="text-xs text-[var(--color-primary)] font-semibold mt-1 hover:underline"
                                            >
                                                + Thêm chương đầu tiên
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: 1 SPAN (TYPE-SPECIFIC CTA LINK / LEAD FORM, PRICING, MEDIA, INSTRUCTOR) */}
                        <div className="space-y-6">

                            {/* Card: Luồng đăng ký & Liên kết đích */}
                            <div className={`p-5 rounded-2xl border transition-all ${
                                isOnline 
                                    ? "bg-purple-500/5 border-purple-500/30" 
                                    : "bg-green-500/5 border-green-500/30"
                            }`}>
                                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3 ${
                                    isOnline ? "text-purple-600" : "text-green-600"
                                }`}>
                                    {isOnline ? <Globe className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                    3. Luồng đăng ký & Hành động (CTA)
                                </h3>

                                {isOnline ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-semibold text-[var(--color-text)] block mb-1">
                                                Đường dẫn E-Learning (URL Khóa học) <span className="text-red-500">*</span>
                                            </label>
                                            <p className="text-[11px] text-[var(--color-text-muted)] mb-2">
                                                Khi học viên bấm "Đăng ký ngay" / "Học ngay", hệ thống sẽ chuyển hướng sang link này.
                                            </p>
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    value={formState.onlineUrl || ""}
                                                    onChange={(e) => setFormState({ ...formState, onlineUrl: e.target.value })}
                                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-text)] focus:border-purple-500 focus:outline-none pr-9 font-mono"
                                                    placeholder="https://academy.duaxcar.com/khoa-hoc-..."
                                                    required={isOnline}
                                                />
                                                {formState.onlineUrl && (
                                                    <a
                                                        href={formState.onlineUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Kiểm tra mở liên kết"
                                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-purple-500 transition-colors"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-1">
                                            <div>
                                                <label className="text-[11px] font-semibold text-[var(--color-text-secondary)] block mb-1">
                                                    Số bài học (Video)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formState.totalLessons || 10}
                                                    onChange={(e) => setFormState({ ...formState, totalLessons: Number(e.target.value) })}
                                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-[var(--color-text)] focus:border-purple-500 focus:outline-none"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-semibold text-[var(--color-text-secondary)] block mb-1">
                                                    Thời hạn truy cập
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formState.accessDuration || "Trọn đời"}
                                                    onChange={(e) => setFormState({ ...formState, accessDuration: e.target.value })}
                                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-[var(--color-text)] focus:border-purple-500 focus:outline-none"
                                                    placeholder="Trọn đời"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-white/60 dark:bg-black/20 rounded-xl border border-green-500/20 text-xs space-y-1 text-[var(--color-text-secondary)]">
                                            <div className="font-semibold text-green-600 flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Form thu thập Lead tự động
                                            </div>
                                            <p className="text-[11px]">
                                                Học viên bấm "Đăng ký ngay" sẽ cuộn xuống form điền thông tin (Họ tên, SĐT, Email, Yêu cầu tư vấn). Dữ liệu sẽ được lưu tự động vào mục <strong>Đăng ký tư vấn (Leads)</strong> để đội ngũ CSKH liên hệ.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-semibold text-[var(--color-text-secondary)] block mb-1">
                                                Sĩ số tối đa (Học viên / Lớp)
                                            </label>
                                            <input
                                                type="number"
                                                value={formState.maxStudents || 8}
                                                onChange={(e) => setFormState({ ...formState, maxStudents: Number(e.target.value) })}
                                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text)] focus:border-green-500 focus:outline-none"
                                                min="1"
                                                placeholder="8"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card: Học phí & Giá cả */}
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                    4. Học phí & Thiết lập giá
                                </h3>

                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text)] block mb-1.5">
                                        Mức học phí (VNĐ) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formState.price}
                                            onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small font-bold text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none pr-8"
                                            placeholder="5000000"
                                            min="0"
                                            step="50000"
                                            required
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-text-muted)]">
                                            đ
                                        </span>
                                    </div>
                                    <div className="text-right text-[11px] text-[var(--color-primary)] font-bold mt-1">
                                        = {formatPrice(formState.price || 0)}
                                    </div>
                                </div>

                                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--color-surface-light)]/50 border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-light)] transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formState.contactForPrice}
                                        onChange={(e) => setFormState({ ...formState, contactForPrice: e.target.checked })}
                                        className="w-4 h-4 rounded text-[var(--color-primary)] border-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)]"
                                    />
                                    <div className="text-xs">
                                        <span className="font-semibold text-amber-500 block">Chế độ "Liên hệ tư vấn"</span>
                                        <span className="text-[11px] text-[var(--color-text-muted)]">Ẩn số tiền và hiển thị nút "Liên hệ tư vấn" thay vì giá cụ thể</span>
                                    </div>
                                </label>

                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text)] block mb-1.5">
                                        Thời lượng đào tạo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formState.duration}
                                        onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                        placeholder="Ví dụ: 1 buổi (8 giờ) hoặc 2 ngày"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Card: Giảng viên & Media */}
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                    5. Giảng viên & Hình ảnh
                                </h3>

                                <div>
                                    <label className="text-xs font-semibold text-[var(--color-text)] block mb-1.5">
                                        Giảng viên đứng lớp / Hướng dẫn <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formState.instructorId}
                                        onChange={(e) => handleInstructorChange(e.target.value)}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    >
                                        {instructors.map((inst) => (
                                            <option key={inst.id} value={inst.id}>
                                                {inst.name} - {inst.role}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <MediaSelectorInput
                                    label="Ảnh đại diện khóa học"
                                    description="Ảnh hiển thị trên thẻ khóa học và banner trang chi tiết"
                                    value={formState.image}
                                    onChange={(url) => setFormState({ ...formState, image: url })}
                                    aspectRatio="video"
                                    required
                                />

                                <MediaSelectorInput
                                    label="Video giới thiệu / Xem thử (Cloudflare R2, YouTube, MP4)"
                                    description="Dán link Cloudflare R2 (https://pub-xxxx.r2.dev/video.mp4), YouTube (https://youtu.be/...) hoặc video MP4 từ Thư viện Media. Khi học viên bấm vào ảnh đại diện sẽ phát video này"
                                    value={formState.videoUrl || ""}
                                    onChange={(url) => setFormState({ ...formState, videoUrl: url })}
                                    mediaType="video"
                                    placeholder="Dán link Cloudflare R2 (.mp4/.webm) hoặc link YouTube..."
                                />

                                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--color-surface-light)]/50 border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-light)] transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formState.featured}
                                        onChange={(e) => setFormState({ ...formState, featured: e.target.checked })}
                                        className="w-4 h-4 rounded text-[var(--color-primary)] border-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)]"
                                    />
                                    <div className="text-xs">
                                        <span className="font-semibold text-[var(--color-text)] flex items-center gap-1.5">
                                            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                                            Khóa học Nổi bật (Featured)
                                        </span>
                                        <span className="text-[11px] text-[var(--color-text-muted)]">Ghim hiển thị ưu tiên tại Trang chủ & đầu Danh mục</span>
                                    </div>
                                </label>
                            </div>

                            {/* 6. HÌNH ẢNH LỚP HỌC & THỰC HÀNH (CLASSROOM PHOTO GALLERY) */}
                            <div className="card p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
                                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                                    <div>
                                        <h3 className="font-heading font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
                                            <Images className="w-4 h-4 text-[var(--color-primary)]" />
                                            <span>Hình ảnh lớp học & Thành phẩm thực tế ({formState.gallery?.length || 0} ảnh)</span>
                                        </h3>
                                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                            Tải lên nhiều hình ảnh về không gian lớp học, dụng cụ, quá trình giảng viên hướng dẫn và thành phẩm của học viên.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => addGalleryImage("/images/courses/pho-bo.jpg")}
                                        className="btn btn-secondary btn-xs flex items-center gap-1 text-[var(--color-primary)] border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/10"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Thêm ảnh</span>
                                    </button>
                                </div>

                                {formState.gallery && formState.gallery.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {formState.gallery.map((imgUrl, gIdx) => (
                                            <div key={gIdx} className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-2 relative group">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-semibold text-[var(--color-text-muted)] flex items-center gap-1">
                                                        <Camera className="w-3 h-3 text-[var(--color-primary)]" /> Ảnh lớp học #{gIdx + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(gIdx)}
                                                        className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                                                        title="Xóa ảnh này"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <MediaSelectorInput
                                                    value={imgUrl}
                                                    onChange={(url) => updateGalleryImage(gIdx, url)}
                                                    aspectRatio="video"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 border-2 border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-background)]/50">
                                        <Images className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-2 opacity-50" />
                                        <p className="text-xs text-[var(--color-text-muted)] mb-3">
                                            Chưa có ảnh lớp học nào. Thêm nhiều ảnh để học viên dễ dàng hình dung không gian & chất lượng đào tạo thực tế.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => addGalleryImage("/images/courses/pho-bo.jpg")}
                                            className="btn btn-primary btn-xs flex items-center gap-1 mx-auto"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Thêm ảnh lớp học đầu tiên</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

                    {/* Bottom Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="btn btn-secondary btn-md"
                            disabled={isSaving}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn btn-primary btn-md flex items-center gap-2 shadow-md"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? "Đang lưu khóa học..." : "Lưu khóa học"}</span>
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // ==========================================
    // RENDER: MAIN COURSES LIST VIEW
    // ==========================================
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="heading-2 text-[var(--color-text)] flex items-center gap-2.5">
                        <BookOpen className="w-7 h-7 text-[var(--color-primary)]" />
                        Quản Lý Khóa Học
                    </h1>
                    <p className="text-xs sm:text-small text-[var(--color-text-secondary)] mt-1">
                        Quản lý toàn bộ danh sách khóa học Trực tiếp (Offline) và Online (E-Learning) trên cùng một hệ thống thống nhất.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => openAddModal("onsite")}
                        className="btn btn-secondary btn-sm flex items-center gap-1.5 rounded-xl text-xs border-green-500/30 text-green-600 hover:bg-green-500/10"
                    >
                        <Users className="w-3.5 h-3.5" />
                        <span>+ Khóa Trực tiếp</span>
                    </button>
                    <button
                        onClick={() => openAddModal("elearning")}
                        className="btn btn-secondary btn-sm flex items-center gap-1.5 rounded-xl text-xs border-purple-500/30 text-purple-600 hover:bg-purple-500/10"
                    >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>+ Khóa Online</span>
                    </button>
                    <button
                        onClick={() => openAddModal("onsite")}
                        className="btn btn-primary btn-sm flex items-center gap-1.5 rounded-xl text-xs shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm khóa học</span>
                    </button>
                </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                    onClick={() => setTypeFilter("all")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        typeFilter === "all" 
                            ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] shadow-sm" 
                            : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/40"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--color-text-muted)]">Tổng khóa học</span>
                        <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center">
                            <BookOpen className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-text)] mt-2">{courses.length}</div>
                    <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5 block">Tất cả chương trình đào tạo</span>
                </div>

                <div 
                    onClick={() => setTypeFilter("onsite")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        typeFilter === "onsite" 
                            ? "bg-green-500/10 border-green-500 shadow-sm" 
                            : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-green-500/40"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-green-600">Khóa Trực tiếp</span>
                        <div className="w-8 h-8 rounded-xl bg-green-500/20 text-green-600 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-text)] mt-2">{onsiteCount}</div>
                    <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5 block">Thu lead tư vấn trực tiếp</span>
                </div>

                <div 
                    onClick={() => setTypeFilter("elearning")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        typeFilter === "elearning" 
                            ? "bg-purple-500/10 border-purple-500 shadow-sm" 
                            : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-purple-500/40"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-purple-600">Khóa Online</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-current" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-text)] mt-2">{elearningCount}</div>
                    <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5 block">Dẫn sang web E-Learning</span>
                </div>

                <div className="p-4 rounded-2xl border bg-[var(--color-surface)] border-[var(--color-border)]">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-orange-500">Khóa Nổi bật</span>
                        <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center">
                            <Flame className="w-4 h-4 fill-current" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-text)] mt-2">{featuredCount}</div>
                    <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5 block">Ghim hiển thị nổi bật</span>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Tìm khóa học theo tên, slug, giảng viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    >
                        <option value="all">Tất cả danh mục ({courses.length})</option>
                        {courseCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    {/* Course Type Tab Filter */}
                    <div className="flex gap-1 bg-[var(--color-surface-light)]/60 p-1 rounded-xl border border-[var(--color-border)]">
                        <button
                            onClick={() => setTypeFilter("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                typeFilter === "all"
                                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            Tất cả ({courses.length})
                        </button>
                        <button
                            onClick={() => setTypeFilter("onsite")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                                typeFilter === "onsite"
                                    ? "bg-green-600 text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-green-600"
                            }`}
                        >
                            <Users className="w-3 h-3" />
                            Trực tiếp ({onsiteCount})
                        </button>
                        <button
                            onClick={() => setTypeFilter("elearning")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                                typeFilter === "elearning"
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-purple-600"
                            }`}
                        >
                            <Play className="w-3 h-3 fill-current" />
                            Online ({elearningCount})
                        </button>
                    </div>
                </div>
            </div>

            {/* Courses Table */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-light)]/30 text-xs text-[var(--color-text-muted)] font-semibold">
                                <th className="px-5 py-3.5">Khóa học & Danh mục</th>
                                <th className="px-4 py-3.5">Hình thức</th>
                                <th className="px-4 py-3.5">Học phí</th>
                                <th className="px-4 py-3.5">Thời lượng</th>
                                <th className="px-4 py-3.5">Luồng đăng ký (CTA)</th>
                                <th className="px-5 py-3.5 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)] text-xs">
                            {filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-[var(--color-text-muted)]">
                                        <div className="max-w-xs mx-auto space-y-2">
                                            <BookOpen className="w-8 h-8 text-[var(--color-text-muted)] mx-auto stroke-1" />
                                            <p className="font-semibold text-sm text-[var(--color-text)]">Không tìm thấy khóa học nào</p>
                                            <p className="text-xs">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => {
                                    const isOnline = course.courseType === "elearning";
                                    const categoryObj = courseCategories.find(c => c.id === course.category);

                                    return (
                                        <tr key={course.id} className="hover:bg-[var(--color-surface-light)]/50 transition-colors">
                                            {/* Name & Category */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] overflow-hidden relative flex-shrink-0">
                                                        {course.image ? (
                                                            <img 
                                                                src={course.image} 
                                                                alt={course.name} 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                        ) : (
                                                            <BookOpen className="w-5 h-5 text-[var(--color-text-muted)] m-auto" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-bold text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
                                                                {course.name}
                                                            </span>
                                                            {course.featured && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20" title="Khóa học Nổi bật">
                                                                    Nổi bật
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] mt-0.5">
                                                            <span className="text-[var(--color-primary)] font-medium">
                                                                {categoryObj?.name || course.category}
                                                            </span>
                                                            <span>•</span>
                                                            <span>GV: {course.instructor}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Type Badge */}
                                            <td className="px-4 py-3.5">
                                                {isOnline ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 text-purple-600 border border-purple-500/20 rounded-lg text-[11px] font-semibold">
                                                        <Play className="w-3 h-3 fill-current" />
                                                        Online (E-Learning)
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg text-[11px] font-semibold">
                                                        <Users className="w-3 h-3" />
                                                        Trực tiếp (Offline)
                                                    </span>
                                                )}
                                            </td>

                                            {/* Price */}
                                            <td className="px-4 py-3.5">
                                                {course.contactForPrice ? (
                                                    <span className="text-amber-500 font-semibold text-[11px]">
                                                        Liên hệ tư vấn
                                                    </span>
                                                ) : (
                                                    <span className="text-[var(--color-primary)] font-bold text-xs">
                                                        {formatPrice(course.price)}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Duration */}
                                            <td className="px-4 py-3.5 text-[var(--color-text-secondary)]">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                                                    <span>{course.duration}</span>
                                                </div>
                                                {isOnline && course.totalLessons && (
                                                    <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                                                        {course.totalLessons} bài giảng
                                                    </div>
                                                )}
                                            </td>

                                            {/* Registration Target Flow */}
                                            <td className="px-4 py-3.5">
                                                {isOnline ? (
                                                    <div className="flex items-center gap-1.5">
                                                        {course.onlineUrl ? (
                                                            <>
                                                                <a 
                                                                    href={course.onlineUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    title={course.onlineUrl}
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:underline max-w-[180px] truncate text-[11px] font-mono"
                                                                >
                                                                    <Globe className="w-3 h-3 flex-shrink-0 text-purple-500" />
                                                                    <span className="truncate">{course.onlineUrl.replace(/^https?:\/\//, '')}</span>
                                                                    <ExternalLink className="w-2.5 h-2.5 flex-shrink-0 opacity-70" />
                                                                </a>
                                                                <button
                                                                    onClick={() => copyToClipboard(course.onlineUrl || "", course.id)}
                                                                    title="Sao chép liên kết E-learning"
                                                                    className="p-1 rounded text-[var(--color-text-muted)] hover:text-purple-600 hover:bg-purple-500/10 transition-colors"
                                                                >
                                                                    {copiedId === course.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="text-[11px] text-amber-500 italic">
                                                                Chưa nhập link E-learning
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-lg text-[11px]">
                                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                        Form thu lead tư vấn
                                                    </span>
                                                )}
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link 
                                                        href={`/khoa-hoc/${course.slug}`} 
                                                        target="_blank"
                                                        title="Xem trang chi tiết ngoài web"
                                                        className="p-2 rounded-xl bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDuplicate(course)}
                                                        title="Nhân bản tạo khóa học tương tự"
                                                        className="p-2 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(course)}
                                                        title="Chỉnh sửa thông tin"
                                                        className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course.id, course.name)}
                                                        title="Xóa khóa học này"
                                                        className="p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function AdminCoursesCMS() {
    return (
        <Suspense fallback={
            <div className="p-12 text-center text-small text-[var(--color-text-muted)]">
                Đang tải danh sách khóa học...
            </div>
        }>
            <AdminCoursesContent />
        </Suspense>
    );
}
