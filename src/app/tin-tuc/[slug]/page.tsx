import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Tag, Share2 } from "lucide-react";
import { blogPosts as mockBlogPosts, courseCategories } from "@/data/mock";
import { getSupabaseBlogPosts } from "@/lib/cms";
import { formatDate } from "@/lib/utils";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Metadata } from 'next';

export const revalidate = 30;

// Generate static params for all blog posts
export async function generateStaticParams() {
    const liveBlogs = await getSupabaseBlogPosts();
    const blogPosts = liveBlogs.length > 0 ? liveBlogs : mockBlogPosts;
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const liveBlogs = await getSupabaseBlogPosts();
    const blogPosts = liveBlogs.length > 0 ? liveBlogs : mockBlogPosts;
    const post = blogPosts.find((p) => p.slug === slug);


    if (!post) {
        return {
            title: 'Bài viết không tồn tại | DuaxCar Kitchen',
        }
    }

    const title = `${post.title} | DuaxCar Kitchen`;
    const description = post.excerpt;
    const url = `https://www.duaxcar.vn/tin-tuc/${post.slug}`;
    const imageUrl = post.image.startsWith('http') ? post.image : `https://www.duaxcar.vn${post.image}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: 'DuaxCar Kitchen',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            locale: 'vi_VN',
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
}

// Helper to inject IDs into HTML content for TOC
function processContent(content: string) {
    let headingCount = 0;
    return content.replace(/<(h[23])>(.*?)<\/\1>/g, (match, tag, text) => {
        const id = `heading-${headingCount++}`;
        return `<${tag} id="${id}">${text}</${tag}>`;
    });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const liveBlogs = await getSupabaseBlogPosts();
    const blogPosts = liveBlogs.length > 0 ? liveBlogs : mockBlogPosts;

    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }


    const processedContent = processContent(post.content);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image.startsWith('http') ? post.image : `https://www.duaxcar.vn${post.image}`,
        "datePublished": post.date,
        "author": {
            "@type": "Person",
            "name": post.author,
        },
        "publisher": {
            "@type": "Organization",
            "name": "DuaxCar Kitchen",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.duaxcar.vn/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.duaxcar.vn/tin-tuc/${post.slug}`
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="pt-24 pb-20">
                {/* Header / Hero */}
                <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-12 mb-12">
                    <div className="container max-w-4xl">
                        <Link
                            href="/tin-tuc"
                            className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại tin tức
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 text-small text-[var(--color-text-muted)] mb-6">
                            <span className="badge badge-primary">{post.category}</span>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={post.date}>{formatDate(post.date)}</time>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime} đọc</span>
                            </div>
                        </div>

                    <h1 className="heading-1 text-[var(--color-text)] mb-6">
                        {post.title}
                    </h1>

                    <p className="text-body-lg text-[var(--color-text-secondary)]">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 mt-8 pt-8 border-t border-[var(--color-border)]">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-gray-200)]">
                            {post.authorImage ? (
                                <Image
                                    src={post.authorImage}
                                    alt={post.author}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                    <User className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="font-semibold text-[var(--color-text)]">
                                {post.author}
                            </div>
                            <div className="text-xs text-[var(--color-text-muted)]">
                                Tác giả
                            </div>
                        </div>
                        <div className="ml-auto flex gap-2">
                            <button className="btn btn-ghost btn-sm">
                                <Share2 className="w-4 h-4 mr-2" />
                                Chia sẻ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Main Content */}
                    <article className="lg:col-span-2 max-w-3xl">
                        <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 shadow-md">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Table of Contents - Mobile only */}
                        <div className="mb-8 p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] lg:hidden">
                            <h4 className="font-heading font-semibold mb-3 text-[var(--color-text)]">
                                Mục lục bài viết
                            </h4>
                            <TableOfContents content={processedContent} />
                        </div>

                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: processedContent }}
                        />
                    </article>

                    {/* Sidebar with sticky widgets */}
                    <aside className="space-y-8 hidden lg:block lg:col-span-1 lg:sticky lg:top-28 self-start">
                        {/* Table of Contents widget */}
                        <TableOfContents content={processedContent} />

                        {/* Recent Posts Widget */}
                        <div className="p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
                            <h4 className="font-heading font-semibold mb-4 text-[var(--color-text)]">
                                Bài viết mới
                            </h4>
                            <div className="space-y-4">
                                {blogPosts
                                    .filter(p => p.id !== post.id)
                                    .slice(0, 3)
                                    .map(p => (
                                        <Link key={p.id} href={`/tin-tuc/${p.slug}`} className="block group">
                                            <h5 className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                                {p.title}
                                            </h5>
                                            <span className="text-xs text-[var(--color-text-muted)] mt-1 block">
                                                {formatDate(p.date)}
                                            </span>
                                        </Link>
                                    ))}
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div className="p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
                            <h4 className="font-heading font-semibold mb-4 text-[var(--color-text)]">
                                Danh mục
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {courseCategories.slice(0, 5).map(c => (
                                    <Link
                                        key={c.id}
                                        href={`/khoa-hoc?category=${c.id}`}
                                        className="badge badge-outline hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all"
                                    >
                                        {c.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Conversion CTA Section */}
            <section className="section bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-20">
                <div className="container max-w-4xl">
                    <div className="p-8 md:p-12 bg-gradient-to-br from-[var(--color-gray-900)] to-[var(--color-gray-800)] text-center relative overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] shadow-2xl">
                        {/* Decorative background glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--color-primary)]/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <span className="text-small font-semibold text-[var(--color-primary)] mb-3 block">
                                Bắt đầu hành trình của bạn
                            </span>
                            <h2 className="heading-2 text-[var(--color-text)] mb-4">
                                Bạn muốn trở thành đầu bếp chuyên nghiệp?
                            </h2>
                            <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
                                Đăng ký các khóa học trực tiếp tại DuaxCar Kitchen hoặc tham gia khóa học online để được đào tạo thực chiến cùng các Nghệ nhân ẩm thực hàng đầu.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/khoa-hoc" className="btn btn-primary btn-lg">
                                    Khám phá khóa học
                                    <ArrowRight className="w-5 h-5 ml-1" />
                                </Link>
                                <Link href="/lien-he" className="btn btn-secondary btn-lg">
                                    Tư vấn miễn phí
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>
    );
}
