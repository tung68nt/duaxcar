import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, User, Newspaper } from "lucide-react";
import { blogPosts as mockBlogPosts } from "@/data/mock";
import { getSupabaseBlogPosts } from "@/lib/cms";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tin tức",
    description:
        "Tin tức, công thức nấu ăn, và mẹo kinh doanh quán ăn từ DuaxCar Kitchen.",
};

export default async function BlogPage() {
    const liveBlogs = await getSupabaseBlogPosts();
    const blogPosts = liveBlogs.length > 0 ? liveBlogs : mockBlogPosts;

    const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
    const otherPosts = blogPosts.filter((p) => p.id !== featuredPost?.id);


    return (
        <>
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gray-900)] via-[var(--color-gray-800)] to-[var(--color-gray-900)]" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--color-orange-500)]/20 rounded-full blur-3xl" />

                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
                            <Newspaper className="w-4 h-4" />
                            <span>Tin Tức & Blog</span>
                        </div>
                        <h1 className="heading-1 text-[var(--color-text)] mt-4 mb-6">
                            Kiến thức <span className="gradient-text">ẩm thực</span> & kinh
                            doanh
                        </h1>
                        <p className="text-body-lg text-[var(--color-text-secondary)]">
                            Công thức nấu ăn, mẹo kinh doanh quán ăn, và câu chuyện từ học
                            viên thành công.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="section bg-[var(--color-surface)]">
                    <div className="container">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            {/* Image */}
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg group">
                                <Image
                                    src={featuredPost.image || "/images/courses/pho-bo.jpg"}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                <div className="absolute top-4 left-4 bg-[var(--color-primary)] text-white font-bold text-xs py-1 px-2.5 rounded-full shadow-lg shadow-[var(--color-primary)]/30 border-2 border-[var(--color-surface)] z-10">
                                    Nổi bật
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="bg-[var(--color-primary)] text-white font-bold text-xs py-1 px-2.5 rounded-full shadow-lg shadow-[var(--color-primary)]/30 border-2 border-[var(--color-surface)]">
                                        {featuredPost.category}
                                    </span>
                                    <span className="text-small text-[var(--color-text-muted)] flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {featuredPost.readTime}
                                    </span>
                                </div>
                                <h2 className="heading-2 text-[var(--color-text)] mb-4 hover:text-[var(--color-primary)] transition-colors">
                                    <Link href={`/tin-tuc/${featuredPost.slug}`}>
                                        {featuredPost.title}
                                    </Link>
                                </h2>
                                <p className="text-body text-[var(--color-text-secondary)] mb-6 line-clamp-3">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center overflow-hidden relative">
                                            {/* Author Image fallback or component */}
                                            <Image
                                                src={featuredPost.authorImage || "/images/logo.png"}
                                                alt={featuredPost.author}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-[var(--color-text)] text-sm">
                                                {featuredPost.author}
                                            </div>
                                            <div className="text-xs text-[var(--color-text-muted)]">
                                                {formatDate(featuredPost.date)}
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/tin-tuc/${featuredPost.slug}`}
                                        className="btn btn-primary"
                                    >
                                        Đọc thêm
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Other Posts */}
            <section className="section">
                <div className="container">
                    <h2 className="heading-3 text-[var(--color-text)] mb-8">
                        Bài viết mới nhất
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/tin-tuc/${post.slug}`}
                                className="card card-glow group h-full flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative h-48 bg-gray-200 overflow-hidden">
                                    <Image
                                        src={post.image || "/images/logo.png"}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-[var(--color-primary)] text-white font-bold text-xs py-1 px-2.5 rounded-full shadow-lg shadow-[var(--color-primary)]/30 border-2 border-[var(--color-surface)] z-10">
                                        {post.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(post.date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {post.readTime}
                                        </span>
                                    </div>
                                    <h3 className="font-heading font-semibold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-small text-[var(--color-text-muted)] line-clamp-2 mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                                            <span className="text-xs font-bold text-[var(--color-primary)]">
                                                {post.author[0]}
                                            </span>
                                        </div>
                                        <span className="text-xs text-[var(--color-text-secondary)]">
                                            {post.author}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination (Static UI) */}
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <button className="btn btn-outline w-10 h-10 p-0 flex items-center justify-center" disabled>
                            &laquo;
                        </button>
                        <button className="btn btn-primary w-10 h-10 p-0 flex items-center justify-center">
                            1
                        </button>
                        <button className="btn btn-outline w-10 h-10 p-0 flex items-center justify-center">
                            2
                        </button>
                        <button className="btn btn-outline w-10 h-10 p-0 flex items-center justify-center">
                            3
                        </button>
                        <span className="text-[var(--color-text-muted)]">...</span>
                        <button className="btn btn-outline w-10 h-10 p-0 flex items-center justify-center">
                            12
                        </button>
                        <button className="btn btn-outline w-10 h-10 p-0 flex items-center justify-center">
                            &raquo;
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section bg-[var(--color-orange-600)] pattern-light">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="heading-2 text-white mb-4">
                            Muốn học nấu ăn bài bản?
                        </h2>
                        <p className="text-body-lg text-white/90 mb-8">
                            Đọc bài viết chỉ là bước đầu. Hãy đến với chúng tôi để học trực
                            tiếp từ các nghệ nhân ẩm thực.
                        </p>
                        <Link
                            href="/khoa-hoc"
                            className="btn btn-lg bg-white text-[var(--color-orange-600)] hover:bg-white/90"
                        >
                            Khám phá khóa học
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
