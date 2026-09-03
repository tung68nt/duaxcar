"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    FileText, 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    X,
    Save,
    Calendar,
    User,
    Tag,
    ArrowLeft,
    Image as ImageIcon
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { blogPosts as defaultMockBlogs } from "@/data/mock";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { MediaSelectorInput } from "@/components/admin/media-selector-input";
import { MediaPickerModal } from "@/components/admin/media-picker-modal";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    authorImage: string;
    date: string;
    category: string;
    readTime: string;
    featured?: boolean;
}

export default function AdminBlogsCMS() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [insertImageModalOpen, setInsertImageModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [formState, setFormState] = useState<Omit<BlogPost, "id">>({
        slug: "",
        title: "",
        excerpt: "",
        content: "",
        image: "/images/courses/pho-bo.jpg",
        author: "Nguyễn Hữu Thọ",
        authorImage: "/images/instructors/nguyen-huu-tho-v3.jpg",
        date: new Date().toISOString().split("T")[0],
        category: "Công thức",
        readTime: "10 phút",
        featured: false
    });

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/cms/blogs');
                if (res.ok) {
                    const json = await res.json();
                    if (json.blogs && json.blogs.length > 0) {
                        setPosts(json.blogs);
                        localStorage.setItem("admin_blogs", JSON.stringify(json.blogs));
                        return;
                    }
                }
            } catch (e) {
                console.error("Error fetching blogs from API:", e);
            }

            const localPosts = localStorage.getItem("admin_blogs");
            if (localPosts) {
                try {
                    const parsed = JSON.parse(localPosts);
                    if (parsed.length > 0) {
                        setPosts(parsed);
                        return;
                    }
                } catch {}
            }

            setPosts(defaultMockBlogs);
            localStorage.setItem("admin_blogs", JSON.stringify(defaultMockBlogs));
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        let result = [...posts];
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.category.toLowerCase().includes(query) ||
                p.author.toLowerCase().includes(query)
            );
        }
        setFilteredPosts(result);
    }, [posts, searchTerm]);

    // Generate slug from title
    const handleTitleChange = (title: string) => {
        const slug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/([^0-9a-z-\s])/g, "")
            .replace(/(\s+)/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
        
        setFormState(prev => ({ ...prev, title, slug }));
    };

    // Open Add Modal
    const openAddModal = () => {
        setEditingPost(null);
        setFormState({
            slug: "",
            title: "",
            excerpt: "",
            content: "",
            image: "/images/courses/pho-bo.jpg",
            author: "Nguyễn Hữu Thọ",
            authorImage: "/images/instructors/nguyen-huu-tho-v3.jpg",
            date: new Date().toISOString().split("T")[0],
            category: "Công thức",
            readTime: "10 phút",
            featured: false
        });
        setModalOpen(true);
    };

    // Open Edit Modal
    const openEditModal = (post: BlogPost) => {
        setEditingPost(post);
        setFormState({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            image: post.image,
            author: post.author,
            authorImage: post.authorImage,
            date: post.date,
            category: post.category,
            readTime: post.readTime,
            featured: post.featured || false
        });
        setModalOpen(true);
    };

    // Handle Form Submit (Add / Edit)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const postId = editingPost ? editingPost.id : `post-${Date.now()}`;
        const newPost: BlogPost = {
            id: postId,
            ...formState
        };

        try {
            const res = await fetch('/api/cms/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post: newPost })
            });
            const result = await res.json();

            if (!res.ok || result.error) {
                alert(`Lỗi lưu bài viết: ${result.error || 'Không xác định'}`);
                return;
            }

            if (result.warning) {
                alert(`⚠️ Bài viết đã lưu nhưng đồng bộ Supabase thất bại. Trang công khai có thể hiển thị dữ liệu cũ.`);
            }
        } catch (err) {
            console.error("Could not save to /api/cms/blogs:", err);
            alert("Lỗi kết nối server. Vui lòng kiểm tra kết nối mạng và thử lại.");
            return;
        }

        let updatedPosts: BlogPost[] = [];
        if (editingPost) {
            updatedPosts = posts.map(p => p.id === editingPost.id 
                ? newPost 
                : p
            );
        } else {
            updatedPosts = [newPost, ...posts];
        }

        setPosts(updatedPosts);
        try {
            localStorage.setItem("admin_blogs", JSON.stringify(updatedPosts));
        } catch {}
        setModalOpen(false);
    };

    // Delete Blog Post
    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                const res = await fetch(`/api/cms/blogs?id=${id}`, { method: 'DELETE' });
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

            const updated = posts.filter(p => p.id !== id);
            setPosts(updated);
            localStorage.setItem("admin_blogs", JSON.stringify(updated));
        }
    };

    if (modalOpen) {
        return (
            <div className="space-y-6 animate-fadeIn pb-12">
                {/* Editor Header */}
                <div className="flex items-center justify-between bg-[var(--color-surface)] p-5 border border-[var(--color-border)] rounded-xl">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="p-2 rounded-lg bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="heading-3 text-[var(--color-text)]">
                                {editingPost ? `Chỉnh sửa bài viết: ${editingPost.title}` : "Đăng bài viết mới"}
                            </h2>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                Biên soạn bài viết, định dạng HTML & tối ưu thông tin SEO.
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
                                const form = document.getElementById("blog-form") as HTMLFormElement;
                                if (form) form.requestSubmit();
                            }}
                            className="btn btn-primary btn-sm flex items-center gap-1.5"
                        >
                            <Save className="w-4 h-4" />
                            <span>Lưu bài viết</span>
                        </button>
                    </div>
                </div>

                {/* Main Form Container */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                    <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* General */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tiêu đề bài viết</label>
                                <input
                                    type="text"
                                    value={formState.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="Ví dụ: Cách nấu phở bò ngon..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Đường dẫn tĩnh (Slug)</label>
                                <input
                                    type="text"
                                    value={formState.slug}
                                    onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    placeholder="tu-dong-sinh-tu-tieu-de"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Danh mục</label>
                                <select
                                    value={formState.category}
                                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                >
                                    <option value="Công thức">Công thức</option>
                                    <option value="Kinh nghiệm">Kinh nghiệm</option>
                                    <option value="Tin tức">Tin tức</option>
                                    <option value="Sự kiện">Sự kiện</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Tác giả</label>
                                <input
                                    type="text"
                                    value={formState.author}
                                    onChange={(e) => setFormState({ ...formState, author: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Thời gian đọc</label>
                                <input
                                    type="text"
                                    value={formState.readTime}
                                    onChange={(e) => setFormState({ ...formState, readTime: e.target.value })}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-small text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Image Selectors */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <MediaSelectorInput
                                label="Ảnh đại diện bài viết (Thumbnail)"
                                description="Ảnh hiển thị nổi bật ở trang chủ và danh sách bài viết"
                                value={formState.image}
                                onChange={(url) => setFormState({ ...formState, image: url })}
                                aspectRatio="video"
                                required
                            />
                            <MediaSelectorInput
                                label="Ảnh chân dung tác giả"
                                description="Ảnh đại diện tác giả bài viết"
                                value={formState.authorImage}
                                onChange={(url) => setFormState({ ...formState, authorImage: url })}
                                aspectRatio="square"
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Mô tả ngắn bài viết (SEO Description)</label>
                            <AutoResizeTextarea
                                value={formState.excerpt}
                                onChange={(e) => setFormState({ ...formState, excerpt: e.target.value })}
                                placeholder="Tóm tắt ngắn gọn nội dung hiển thị ở danh sách bài viết và meta description..."
                                required
                            />
                        </div>

                        {/* Rich Text Editor */}
                        <div>
                            <RichTextEditor
                                label="Nội dung bài viết"
                                value={formState.content}
                                onChange={(html) => setFormState({ ...formState, content: html })}
                                placeholder="Soạn thảo nội dung bài viết theo phong cách trực quan, chèn ảnh, định dạng tiêu đề, danh sách, trích dẫn..."
                                minHeight="420px"
                            />
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
                                <span>Lưu bài viết</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h1 className="heading-3 text-[var(--color-text)]">
                        Quản Lý Bài Viết (CMS)
                    </h1>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        Đăng bài viết mới, quản trị nội dung bài hướng dẫn nấu ăn, kinh nghiệm kinh doanh.
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-sm rounded-lg text-xs"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Đăng bài mới</span>
                </button>
            </div>

            {/* Toolbar search */}
            <div className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết theo tiêu đề..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-1.5 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                </div>
            </div>

            {/* Blogs Table Card */}
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                <div className="overflow-x-auto -mx-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] font-semibold">
                                <th className="px-4 py-2">Tiêu đề bài viết</th>
                                <th className="px-4 py-2">Danh mục</th>
                                <th className="px-4 py-2">Tác giả</th>
                                <th className="px-4 py-2">Ngày xuất bản</th>
                                <th className="px-4 py-2 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)] text-xs">
                            {filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                                        Chưa có bài viết nào được đăng.
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-[var(--color-surface-light)]/40 transition-colors">
                                        <td className="px-4 py-2.5 max-w-md">
                                            <div className="flex items-center gap-2.5">
                                                {post.image && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-11 h-8 rounded-lg object-cover border border-[var(--color-border)] flex-shrink-0"
                                                    />
                                                )}
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-[var(--color-text)] truncate">{post.title}</div>
                                                    <div className="text-[10px] text-[var(--color-text-muted)] truncate">{post.excerpt}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-md text-[10px] font-semibold">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">
                                            {post.author}
                                        </td>
                                        <td className="px-4 py-2.5 text-[var(--color-text-muted)] text-[11px]">
                                            {post.date}
                                        </td>
                                        <td className="px-4 py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link 
                                                    href={`/tin-tuc/${post.slug}`} 
                                                    target="_blank"
                                                    title="Xem bài viết trên web"
                                                    className="p-1.5 rounded-lg bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => openEditModal(post)}
                                                    title="Chỉnh sửa bài viết"
                                                    className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    title="Xóa bài viết"
                                                    className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
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

            {/* Insert Image Modal for Editor Content */}
            <MediaPickerModal
                isOpen={insertImageModalOpen}
                onClose={() => setInsertImageModalOpen(false)}
                title="Chèn ảnh vào nội dung bài viết"
                allowMultiple={true}
                onSelect={(url, item) => {
                    const altText = item?.name || formState.title || "Hình ảnh bài viết";
                    const imageHtml = `\n<figure class="my-6">\n  <img src="${url}" alt="${altText}" class="rounded-2xl w-full object-cover max-h-[500px] shadow-lg" />\n  <figcaption class="text-xs text-center text-gray-500 mt-2 italic">${altText}</figcaption>\n</figure>\n`;
                    setFormState(prev => ({
                        ...prev,
                        content: prev.content ? `${prev.content}\n${imageHtml}` : imageHtml
                    }));
                }}
                onSelectMultiple={(urls, items) => {
                    const block = urls.map((url, i) => {
                        const altText = items?.[i]?.name || formState.title || `Hình ảnh bài viết ${i + 1}`;
                        return `<figure class="my-6">\n  <img src="${url}" alt="${altText}" class="rounded-2xl w-full object-cover max-h-[500px] shadow-lg" />\n  <figcaption class="text-xs text-center text-gray-500 mt-2 italic">${altText}</figcaption>\n</figure>`;
                    }).join("\n");
                    setFormState(prev => ({
                        ...prev,
                        content: prev.content ? `${prev.content}\n${block}` : block
                    }));
                }}
            />
        </div>
    );
}
