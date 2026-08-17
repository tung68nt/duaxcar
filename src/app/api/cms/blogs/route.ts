import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { BlogPost } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
        if (!error && data && data.length > 0) {
            const mappedBlogs: BlogPost[] = data.map((b) => ({
                id: b.id,
                slug: b.slug,
                title: b.title,
                excerpt: b.excerpt,
                content: b.content,
                image: b.image,
                author: b.author,
                authorImage: b.author_image,
                date: b.date,
                category: b.category,
                readTime: b.read_time,
                featured: b.featured
            }));
            return NextResponse.json({ blogs: mappedBlogs });
        }
    } catch (e) {
        console.warn("Supabase GET blogs error:", e);
    }

    try {
        const db = getLocalDB();
        return NextResponse.json({ blogs: db.blogs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const post: BlogPost = body.post;

        if (!post || !post.title || !post.slug) {
            return NextResponse.json({ error: 'Missing blog title or slug' }, { status: 400 });
        }

        const postId = post.id || `post-${Date.now()}`;
        const finalPost: BlogPost = { ...post, id: postId };

        const payload = {
            id: postId,
            slug: finalPost.slug,
            title: finalPost.title,
            excerpt: finalPost.excerpt,
            content: finalPost.content,
            image: finalPost.image,
            author: finalPost.author,
            author_image: finalPost.authorImage,
            date: finalPost.date,
            category: finalPost.category,
            read_time: finalPost.readTime,
            featured: finalPost.featured || false
        };

        const { error: sbError } = await supabase.from('blog_posts').upsert(payload);
        if (sbError) {
            console.error("Supabase blog upsert error:", sbError);
        }

        const db = getLocalDB();
        const existingIndex = db.blogs.findIndex(b => b.id === postId);
        let updatedBlogs: BlogPost[] = [];
        if (existingIndex >= 0) {
            updatedBlogs = [...db.blogs];
            updatedBlogs[existingIndex] = finalPost;
        } else {
            updatedBlogs = [finalPost, ...db.blogs];
        }
        saveLocalDB({ blogs: updatedBlogs });

        // Purge Next.js cache
        try {
            revalidatePath('/');
            revalidatePath('/tin-tuc');
            revalidatePath(`/tin-tuc/${finalPost.slug}`);
        } catch {}

        return NextResponse.json({ success: true, post: finalPost });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing blog ID' }, { status: 400 });
        }

        const { error: sbError } = await supabase.from('blog_posts').delete().eq('id', id);
        if (sbError) {
            console.error("Supabase blog delete error:", sbError);
        }

        const db = getLocalDB();
        const updatedBlogs = db.blogs.filter(b => b.id !== id);
        saveLocalDB({ blogs: updatedBlogs });

        try {
            revalidatePath('/');
            revalidatePath('/tin-tuc');
        } catch {}

        return NextResponse.json({ success: true, blogs: updatedBlogs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
