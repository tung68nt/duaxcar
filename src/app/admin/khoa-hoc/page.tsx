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
    X,
    Save,
    Award,
    DollarSign,
    Clock,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

import { Course } from "@/lib/types";
import { courses as defaultMockCourses, instructors, courseCategories } from "@/data/mock";
import { supabase } from "@/lib/supabase";
import { MediaSelectorInput } from "@/components/admin/media-selector-input";


function AdminCoursesContent() {
    const searchParams = useSearchParams();
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formState, setFormState] = useState<Omit<Course, "id">>({
        slug: "",
        name: "",
        category: "mon-an-sang",
        courseType: "onsite",
        description: "",
        shortDescription: "",
        price: 5000000,
        contactForPrice: false,
        duration: "1 buổi",
        maxStudents: 8,
        totalLessons: 10,
        totalDuration: "14 giờ",
        accessDuration: "Trọn đời",
        onlineUrl: "",
        instructor: "Nguyễn Hữu Thọ",
        instructorId: "1",
        image: "/images/courses/pho-bo.jpg",
        highlights: [],
        curriculum: [],
        featured: false
    });

    const stockImages = [
        { name: "Phở Bò", url: "/images/courses/pho-bo.jpg" },
        { name: "Bún Bò Huế", url: "/images/courses/bun-bo.jpg" },
        { name: "Phở Gà", url: "/images/courses/pho-ga.jpg" },
        { name: "Bún Chả", url: "/images/courses/bun-cha.jpg" },
        { name: "Lẩu Nướng", url: "/images/courses/lau-nuong.jpg" },
        { name: "Món hải sản", url: "/images/courses/hai-san.jpg" },
        { name: "Cơm thố", url: "/images/courses/com-tho.jpg" },
        { name: "Mở quán ăn", url: "/images/courses/mo-quan.jpg" }
    ];

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

        const savedMedia = localStorage.getItem("admin_media");
        if (savedMedia) {
            setUploadedMedia(JSON.parse(savedMedia));
        }

        // Open in Add mode if query parameter is set
        if (searchParams.get("add") === "true") {
            openAddModal();
        }
    }, [searchParams]);


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormState(prev => ({ ...prev, image: base64String }));
                
                const updatedMedia = [base64String, ...uploadedMedia.filter(m => m !== base64String)].slice(0, 12);
                setUploadedMedia(updatedMedia);
                localStorage.setItem("admin_media", JSON.stringify(updatedMedia));
                setMediaModalOpen(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const selectMedia = (url: string) => {
        setFormState(prev => ({ ...prev, image: url }));
        setMediaModalOpen(false);
    };

    const formatInputPrice = (value: number) => {
        if (!value && value !== 0) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handlePriceInputChange = (valueStr: string) => {
        const rawValue = valueStr.replace(/\./g, "");
        const numValue = Number(rawValue);
        if (!isNaN(numValue)) {
            setFormState(prev => ({ ...prev, price: numValue }));
        }
    };

    useEffect(() => {
        let result = [...courses];
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(c => 
                c.name.toLowerCase().includes(query) || 
                c.category.toLowerCase().includes(query) ||
                c.instructor.toLowerCase().includes(query)
            );
        }
        if (typeFilter !== "all") {
            result = result.filter(c => c.courseType === typeFilter);
        }
        setFilteredCourses(result);
    }, [courses, searchTerm, typeFilter]);

    // Generate slug from title
    const handleTitleChange = (name: string) => {
        const slug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/([^0-9a-z-\s])/g, "")
            .replace(/(\s+)/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
        
        setFormState(prev => ({ ...prev, name, slug }));
    };

    // Open Add Modal
    const openAddModal = () => {
        setEditingCourse(null);
        setFormState({
            slug: "",
            name: "",
            category: "mon-an-sang",
            courseType: "onsite",
            description: "",
            shortDescription: "",
            price: 5000000,
            contactForPrice: false,
            duration: "1 buổi",
            maxStudents: 8,
            totalLessons: 10,
            totalDuration: "14 giờ",
            accessDuration: "Trọn đời",
            onlineUrl: "",
            instructor: "Nguyễn Hữu Thọ",
            instructorId: "1",
            image: "/images/courses/pho-bo.jpg",
            highlights: ["Bí quyết gia truyền độc quyền", "Công thức tỷ lệ chuẩn kinh doanh"],
            curriculum: [{ title: "Giới thiệu & Nguyên liệu", description: "Lựa chọn và chuẩn bị nguyên liệu" }],
            featured: false
        });
        setModalOpen(true);
    };

    // Open Edit Modal
    const openEditModal = (course: Course) => {
        setEditingCourse(course);
        setFormState({
            slug: course.slug,
            name: course.name,
            category: course.category,
            courseType: course.courseType,
            description: course.description,
            shortDescription: course.shortDescription,
            price: course.price,
            contactForPrice: course.contactForPrice || false,
            duration: course.duration,
            maxStudents: course.maxStudents || 8,
            totalLessons: course.totalLessons || 10,
            totalDuration: course.totalDuration || "14 giờ",
            accessDuration: course.accessDuration || "Trọn đời",
            onlineUrl: course.onlineUrl || "",
            instructor: course.instructor,
            instructorId: course.instructorId,
            image: course.image,
            highlights: course.highlights || [],
            curriculum: course.curriculum || [],
            featured: course.featured || false
        });
        setModalOpen(true);
    };

    // Instructor changer
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

    // Handle Form Submit (Add / Edit)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const courseId = editingCourse ? editingCourse.id : `course-${Date.now()}`;
        
        const courseData: Course = {
            id: courseId,
            slug: formState.slug,
            name: formState.name,
            category: formState.category,
            courseType: formState.courseType,
            description: formState.description,
            shortDescription: formState.shortDescription,
            price: formState.price,
            contactForPrice: formState.contactForPrice || false,
            duration: formState.duration,
            maxStudents: formState.maxStudents || 8,
            instructor: formState.instructor,
            instructorId: formState.instructorId,
            image: formState.image,
            highlights: formState.highlights || [],
            curriculum: formState.curriculum || [],
            featured: formState.featured || false,
            totalLessons: formState.totalLessons || 10,
            totalDuration: formState.totalDuration || "14 giờ",
            accessDuration: formState.accessDuration || "Trọn đời",
            onlineUrl: formState.onlineUrl || ""
        };

        // 1. Save to server persistent API
        try {
            await fetch('/api/cms/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course: courseData })
            });
        } catch (err) {
            console.warn("Could not save to /api/cms/courses:", err);
        }

        // 2. Update local state and localStorage
        let updatedCourses: Course[] = [];
        if (editingCourse) {
            updatedCourses = courses.map(c => c.id === editingCourse.id ? courseData : c);
        } else {
            updatedCourses = [courseData, ...courses];
        }

        setCourses(updatedCourses);
        localStorage.setItem("admin_courses", JSON.stringify(updatedCourses));
        setModalOpen(false);
    };

    // Delete Course
    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
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


    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(value);
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
                                {editingCourse ? `Chỉnh sửa khóa học: ${editingCourse.name}` : "Thêm khóa học mới"}
                            </h2>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                Cập nhật thông tin chi tiết khóa học, học phí & chương trình đào tạo.
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
                                const form = document.getElementById("course-form") as HTMLFormElement;
                                if (form) form.requestSubmit();
                            }}
                            className="btn btn-primary btn-sm flex items-center gap-1.5"
                        >
                            <Save className="w-4 h-4" />
                            <span>Lưu khóa học</span>
                        </button>
                    </div>
                </div>

                {/* Main Form Container */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                    <form id="course-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* General */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 lg:col-span-1">
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tên khóa học</label>
                                <input
                                    type="text"
                                    value={formState.name}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="Ví dụ: Phở Bò Kinh Doanh..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Đường dẫn tĩnh (Slug)</label>
                                <input
                                    type="text"
                                    value={formState.slug}
                                    onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="tu-dong-sinh-tu-ten"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <MediaSelectorInput
                                    label="Ảnh đại diện khóa học"
                                    description="Ảnh hiển thị trên thẻ khóa học và trang chi tiết"
                                    value={formState.image}
                                    onChange={(url) => setFormState({ ...formState, image: url })}
                                    aspectRatio="video"
                                    required
                                />
                            </div>
                        </div>

                        {/* Category, Type & Price */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Danh mục</label>
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

                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Hình thức học</label>
                                <select
                                    value={formState.courseType}
                                    onChange={(e) => setFormState({ ...formState, courseType: e.target.value as "onsite" | "elearning" })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                >
                                    <option value="onsite">Trực tiếp tại trung tâm</option>
                                    <option value="elearning">Khoa học Online</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Học phí (VNĐ)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formState.price}
                                        onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })}
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none pr-8"
                                        placeholder="5.000.000"
                                        required
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-small font-bold text-[var(--color-text-muted)]">
                                        đ
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:pt-4">
                                <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text)] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formState.contactForPrice}
                                        onChange={(e) => setFormState({ ...formState, contactForPrice: e.target.checked })}
                                        className="w-4 h-4 rounded text-[var(--color-primary)] border-[var(--color-border)] focus:ring-[var(--color-primary)] bg-[var(--color-background)]"
                                    />
                                    <span className="text-amber-500">Hiển thị "Liên hệ tư vấn" (Ẩn giá tiền)</span>
                                </label>
                            </div>
                        </div>

                        {/* Conditional Time & Limits */}
                        <div className="p-4 border border-[var(--color-border)] rounded-2xl">
                            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider block mb-3">
                                Thông tin lớp {formState.courseType === "onsite" ? "Học trực tiếp" : "Học E-learning"}
                            </span>
                            
                            {formState.courseType === "onsite" ? (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Thời lượng học</label>
                                        <input
                                            type="text"
                                            value={formState.duration}
                                            onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            placeholder="Ví dụ: 2 ngày (14 giờ)"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Sĩ số tối đa (Học viên/Lớp)</label>
                                        <input
                                            type="number"
                                            value={formState.maxStudents || 8}
                                            onChange={(e) => setFormState({ ...formState, maxStudents: Number(e.target.value) })}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Số lượng bài giảng (video)</label>
                                        <input
                                            type="number"
                                            value={formState.totalLessons || 10}
                                            onChange={(e) => setFormState({ ...formState, totalLessons: Number(e.target.value) })}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Thời lượng (Giờ học)</label>
                                        <input
                                            type="text"
                                            value={formState.totalDuration || "14 giờ"}
                                            onChange={(e) => setFormState({ ...formState, totalDuration: e.target.value })}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Thời hạn truy cập</label>
                                        <input
                                            type="text"
                                            value={formState.accessDuration || "Trọn đời"}
                                            onChange={(e) => setFormState({ ...formState, accessDuration: e.target.value })}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Đường dẫn E-learning portal</label>
                                        <input
                                            type="text"
                                            value={formState.onlineUrl || ""}
                                            onChange={(e) => setFormState({ ...formState, onlineUrl: e.target.value })}
                                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            placeholder="https://academy.duaxcar.com/..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Descriptions */}
                        <div>
                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Mô tả ngắn</label>
                            <textarea
                                value={formState.shortDescription}
                                onChange={(e) => setFormState({ ...formState, shortDescription: e.target.value })}
                                rows={2}
                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none resize-none"
                                placeholder="Tóm tắt ngắn gọn nội dung hiển thị ngoài danh mục khóa học..."
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Mô tả chi tiết</label>
                            <textarea
                                value={formState.description}
                                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                                rows={4}
                                className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                placeholder="Giới thiệu đầy đủ chi tiết về khóa học..."
                                required
                            />
                        </div>

                        {/* Dynamic Highlights List */}
                        <div className="p-4 border border-[var(--color-border)] rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                                    Điểm nổi bật của khóa học
                                </span>
                                <button
                                    type="button"
                                    onClick={addHighlight}
                                    className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Thêm điểm nổi bật
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formState.highlights.map((hl, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={hl}
                                            onChange={(e) => updateHighlight(index, e.target.value)}
                                            className="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                            placeholder={`Điểm nổi bật #${index + 1}`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeHighlight(index)}
                                            className="p-2 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {formState.highlights.length === 0 && (
                                    <p className="text-xs text-[var(--color-text-muted)] text-center py-2">Chưa thêm điểm nổi bật nào.</p>
                                )}
                            </div>
                        </div>

                        {/* Dynamic Curriculum Chapters List */}
                        <div className="p-4 border border-[var(--color-border)] rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                                    Chương trình học chi tiết (Syllabus)
                                </span>
                                <button
                                    type="button"
                                    onClick={addChapter}
                                    className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Thêm chương mới
                                </button>
                            </div>
                            <div className="space-y-4">
                                {formState.curriculum && formState.curriculum.map((chap, index) => (
                                    <div key={index} className="p-4 bg-[var(--color-surface-light)]/30 border border-[var(--color-border)] rounded-xl space-y-3 relative">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-[var(--color-text)]">Chương #{index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeChapter(index)}
                                                className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label className="text-[10px] font-semibold text-[var(--color-text-muted)] block mb-1">Tiêu đề chương</label>
                                                <input
                                                    type="text"
                                                    value={chap.title}
                                                    onChange={(e) => updateChapter(index, "title", e.target.value)}
                                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                                    placeholder="Chương 1: Giới thiệu..."
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-semibold text-[var(--color-text-muted)] block mb-1">Mô tả bài học</label>
                                                <textarea
                                                    value={chap.description}
                                                    onChange={(e) => updateChapter(index, "description", e.target.value)}
                                                    rows={2}
                                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none resize-y"
                                                    placeholder="Tìm hiểu nguồn gốc nguyên liệu và cách chọn..."
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!formState.curriculum || formState.curriculum.length === 0) && (
                                    <p className="text-xs text-[var(--color-text-muted)] text-center py-2">Chưa thêm chương nào.</p>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
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
                                <span>Lưu khóa học</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="heading-2 text-[var(--color-text)]">
                        Quản Lý Khóa Học (CMS)
                    </h1>
                    <p className="text-small text-[var(--color-text-secondary)] mt-1">
                        Thêm khóa học mới, biên tập học phí, thời gian đào tạo và chương trình giảng dạy.
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-lg shadow-[var(--color-primary)]/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm khóa học</span>
                </button>
            </div>

            {/* Filters Toolbar */}
            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Tìm khóa học theo tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                </div>

                {/* Course Type filters */}
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setTypeFilter("all")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            typeFilter === "all"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Tất cả ({courses.length})
                    </button>
                    <button
                        onClick={() => setTypeFilter("onsite")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            typeFilter === "onsite"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Học trực tiếp ({courses.filter(c => c.courseType === "onsite").length})
                    </button>
                    <button
                        onClick={() => setTypeFilter("elearning")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            typeFilter === "elearning"
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                        }`}
                    >
                        Học E-learning ({courses.filter(c => c.courseType === "elearning").length})
                    </button>
                </div>
            </div>

            {/* Courses Table Card */}
            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
                                <th className="px-6 py-3">Tên khóa học</th>
                                <th className="px-6 py-3">Loại hình</th>
                                <th className="px-6 py-3">Học phí</th>
                                <th className="px-6 py-3">Thời gian học</th>
                                <th className="px-6 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)] text-small">
                            {filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                                        Không tìm thấy khóa học nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-[var(--color-surface-light)]/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[var(--color-text)]">{course.name}</div>
                                            <div className="text-xs text-[var(--color-text-muted)] mt-1">Giảng viên: {course.instructor}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {course.courseType === "onsite" ? (
                                                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md text-xs font-semibold">Trực tiếp</span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-md text-xs font-semibold">Online (E-learning)</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--color-primary)] font-bold">
                                            {formatPrice(course.price)}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                                            {course.duration}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link 
                                                    href={`/khoa-hoc/${course.slug}`} 
                                                    target="_blank"
                                                    title="Xem trang chi tiết khóa học"
                                                    className="p-2 rounded-lg bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => openEditModal(course)}
                                                    title="Chỉnh sửa thông tin"
                                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    title="Xóa khóa học"
                                                    className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
            <div className="p-6 text-center text-small text-[var(--color-text-muted)]">
                Đang tải danh sách khóa học...
            </div>
        }>
            <AdminCoursesContent />
        </Suspense>
    );
}
