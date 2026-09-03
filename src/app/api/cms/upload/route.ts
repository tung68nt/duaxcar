import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { MediaItem, DEFAULT_MEDIA_ITEMS } from '@/lib/media-store';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// === Security Constants ===
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;   // 15MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;   // 50MB
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_VIDEO_MIMES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'mp4', 'webm', 'mov'];

// Magic bytes for file type verification
const MAGIC_BYTES: Record<string, number[]> = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF
    'image/gif': [0x47, 0x49, 0x46],          // GIF
};

async function saveImageToSupabase(baseId: string, name: string, mimeType: string, buffer: Buffer): Promise<boolean> {
    try {
        const { error } = await supabase.from('site_settings').upsert({
            id: baseId,
            data: {
                name,
                mimeType,
                base64: buffer.toString('base64'),
                size: buffer.length
            },
            updated_at: new Date().toISOString()
        });
        if (error) {
            console.warn(`Supabase save error for ${baseId}:`, error);
            return false;
        }
        return true;
    } catch (e) {
        console.warn(`Supabase upload error for ${baseId}:`, e);
        return false;
    }
}

async function processSingleFile(file: File, uploadDir: string, indexOffset = 0): Promise<MediaItem> {
    const isVideo = file.type.startsWith('video/');
    const mimeAllowed = [...ALLOWED_IMAGE_MIMES, ...ALLOWED_VIDEO_MIMES].includes(file.type);
    if (!mimeAllowed) {
        throw new Error(`Loại file "${file.type}" không được hỗ trợ. Chỉ hỗ trợ ảnh và video.`);
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
        const limitStr = isVideo ? '50MB' : '15MB';
        throw new Error(`File "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB) vượt quá giới hạn ${limitStr}.`);
    }

    const bytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    // Validate magic bytes for common image formats
    const expectedMagic = MAGIC_BYTES[file.type];
    if (expectedMagic && fileBuffer.length >= expectedMagic.length) {
        const actualMagic = Array.from(fileBuffer.subarray(0, expectedMagic.length));
        const matches = expectedMagic.every((byte, i) => actualMagic[i] === byte);
        if (!matches) {
            throw new Error(`Nội dung file "${file.name}" không khớp định dạng khai báo.`);
        }
    }

    const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 100);
    const timeId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const baseId = `img_${cleanName}_${timeId}`;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext && !ALLOWED_EXTENSIONS.includes(ext)) {
        throw new Error(`Đuôi file ".${ext}" không được cho phép.`);
    }
    const fileExt = ext || (isVideo ? 'mp4' : 'webp');
    const safeFileName = `${cleanName}-${timeId}.${fileExt}`;

    // 1. Try local disk write (works on local machine, fails with EROFS on Vercel)
    let wroteToDisk = false;
    try {
        const filePath = path.join(uploadDir, safeFileName);
        fs.writeFileSync(filePath, fileBuffer);
        wroteToDisk = true;
    } catch {
        wroteToDisk = false;
    }

    // 2. Persist to Supabase site_settings
    await saveImageToSupabase(baseId, safeFileName, file.type || (isVideo ? 'video/mp4' : 'image/webp'), fileBuffer);

    // 3. Choose the best URL:
    // If local dev and disk write succeeded: /uploads/${safeFileName}
    // If on Vercel (or disk failed): /api/cms/image/${baseId}.${fileExt}
    const isVercel = Boolean(process.env.VERCEL);
    const publicUrl = (!isVercel && wroteToDisk) 
        ? `/uploads/${safeFileName}` 
        : `/api/cms/image/${baseId}.${fileExt}`;

    const finalSizeStr = fileBuffer.length < 1024 * 1024 
        ? `${(fileBuffer.length / 1024).toFixed(0)} KB` 
        : `${(fileBuffer.length / (1024 * 1024)).toFixed(1)} MB`;

    return {
        id: `m-${timeId}-${indexOffset}`,
        name: safeFileName,
        url: publicUrl,
        type: isVideo ? 'video' : 'image',
        size: finalSizeStr,
        sizeBytes: fileBuffer.length,
        dimensions: isVideo ? 'Video HD' : 'Ảnh HD',
        uploadedAt: new Date().toISOString().split('T')[0],
        compressed: true
    };
}

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        
        // Target uploads directory in public/uploads/
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        try {
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
        } catch {}

        const createdItems: MediaItem[] = [];

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            
            // Collect all files from "files" or "file" fields
            const allFiles: File[] = [];
            
            const filesField = formData.getAll('files');
            if (filesField && filesField.length > 0) {
                filesField.forEach(f => {
                    if (f instanceof File && f.size > 0) allFiles.push(f);
                });
            }

            const fileField = formData.getAll('file');
            if (fileField && fileField.length > 0) {
                fileField.forEach(f => {
                    if (f instanceof File && f.size > 0) allFiles.push(f);
                });
            }

            if (allFiles.length === 0) {
                return NextResponse.json({ error: 'Không tìm thấy file tải lên trong form' }, { status: 400 });
            }

            for (let i = 0; i < allFiles.length; i++) {
                const item = await processSingleFile(allFiles[i], uploadDir, i);
                createdItems.push(item);
            }
        } else {
            // Support legacy base64 upload JSON format
            const body = await request.json();
            const { base64, name, type = 'image', dimensions: dims } = body;

            if (!base64 || typeof base64 !== 'string') {
                return NextResponse.json({ error: 'Thiếu dữ liệu file' }, { status: 400 });
            }

            const matches = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return NextResponse.json({ error: 'Định dạng base64 không hợp lệ' }, { status: 400 });
            }

            const mimeType = matches[1];
            const base64Data = matches[2];

            const mimeAllowed = [...ALLOWED_IMAGE_MIMES, ...ALLOWED_VIDEO_MIMES].includes(mimeType);
            if (!mimeAllowed) {
                return NextResponse.json(
                    { error: `Loại file "${mimeType}" không được hỗ trợ.` },
                    { status: 400 }
                );
            }

            const fileBuffer = Buffer.from(base64Data, 'base64');
            const isVideo = mimeType.startsWith('video/');
            const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
            if (fileBuffer.length > maxSize) {
                const limitStr = isVideo ? '50MB' : '15MB';
                return NextResponse.json(
                    { error: `Dung lượng file vượt quá ${limitStr}.` },
                    { status: 400 }
                );
            }

            const cleanName = (name || 'image')
                .replace(/\.[^/.]+$/, "")
                .replace(/[^a-zA-Z0-9_-]/g, "_")
                .slice(0, 100);
            const timeId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
            const baseId = `img_${cleanName}_${timeId}`;
            let fileExt = mimeType.split('/')[1]?.toLowerCase() || (isVideo ? 'mp4' : 'webp');
            if (fileExt === 'jpeg') fileExt = 'jpg';
            const safeFileName = `${cleanName}-${timeId}.${fileExt}`;

            let wroteToDisk = false;
            try {
                const filePath = path.join(uploadDir, safeFileName);
                fs.writeFileSync(filePath, fileBuffer);
                wroteToDisk = true;
            } catch {
                wroteToDisk = false;
            }

            await saveImageToSupabase(baseId, safeFileName, mimeType, fileBuffer);

            const isVercel = Boolean(process.env.VERCEL);
            const publicUrl = (!isVercel && wroteToDisk) 
                ? `/uploads/${safeFileName}` 
                : `/api/cms/image/${baseId}.${fileExt}`;

            const finalSizeStr = fileBuffer.length < 1024 * 1024 
                ? `${(fileBuffer.length / 1024).toFixed(0)} KB` 
                : `${(fileBuffer.length / (1024 * 1024)).toFixed(1)} MB`;

            const newItem: MediaItem = {
                id: `m-${timeId}`,
                name: safeFileName,
                url: publicUrl,
                type: isVideo ? 'video' : 'image',
                size: finalSizeStr,
                sizeBytes: fileBuffer.length,
                dimensions: dims || (isVideo ? 'Video HD' : 'Ảnh HD'),
                uploadedAt: new Date().toISOString().split('T')[0],
                compressed: true
            };

            createdItems.push(newItem);
        }

        if (createdItems.length === 0) {
            return NextResponse.json({ error: 'Không có file nào được xử lý' }, { status: 400 });
        }

        // 1. Sync new items to Supabase site_settings (media_data)
        try {
            const { data: mediaSetting } = await supabase
                .from('site_settings')
                .select('data')
                .eq('id', 'media_data')
                .single();
            
            const existingMedia: MediaItem[] = Array.isArray(mediaSetting?.data) ? mediaSetting.data : [];
            const updatedMedia = [...createdItems, ...existingMedia].slice(0, 200);

            await supabase.from('site_settings').upsert({
                id: 'media_data',
                data: updatedMedia,
                updated_at: new Date().toISOString()
            });
        } catch (sbMediaErr) {
            console.warn('Could not sync media to Supabase site_settings:', sbMediaErr);
        }

        // 2. Save to local CMS DB as backup (ignore error on read-only environments)
        try {
            const db = getLocalDB();
            const currentMedia = db.media || [...DEFAULT_MEDIA_ITEMS];
            const updatedMedia = [...createdItems, ...currentMedia];
            saveLocalDB({ media: updatedMedia });
        } catch {}

        return NextResponse.json({
            success: true,
            count: createdItems.length,
            url: createdItems[0].url,
            item: createdItems[0],
            items: createdItems,
            urls: createdItems.map(i => i.url)
        });
    } catch (e: any) {
        console.error('Upload API error:', e);
        return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
    }
}
