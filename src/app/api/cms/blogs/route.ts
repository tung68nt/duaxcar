import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { BlogPost } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export async function GET() {
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

        const db = getLocalDB();
        const existingIndex = db.blogs.findIndex(b => b.id === post.id);
        
        let updatedBlogs: BlogPost[] = [];
        if (existingIndex >= 0) {
            updatedBlogs = [...db.blogs];
            updatedBlogs[existingIndex] = { ...updatedBlogs[existingIndex], ...post };
        } else {
            updatedBlogs = [{ ...post, id: post.id || `post-${Date.now()}` }, ...db.blogs];
        }

        saveLocalDB({ blogs: updatedBlogs });

        try {
            const payload = {
                id: post.id,
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                image: post.image,
                author: post.author,
                author_image: post.authorImage,
                date: post.date,
                category: post.category,
                read_time: post.readTime,
                featured: post.featured || false
            };
            await supabase.from('blog_posts').upsert(payload);
        } catch {}

        return NextResponse.json({ success: true, blogs: updatedBlogs });
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

        const db = getLocalDB();
        const updatedBlogs = db.blogs.filter(b => b.id !== id);
        saveLocalDB({ blogs: updatedBlogs });

        try {
            await supabase.from('blog_posts').delete().eq('id', id);
        } catch {}

        return NextResponse.json({ success: true, blogs: updatedBlogs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
