import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import { MediaItem, DEFAULT_MEDIA_ITEMS } from '@/lib/media-store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let fileBuffer: Buffer | null = null;
        let fileName = `upload-${Date.now()}`;
        let fileExt = 'webp';
        let isVideo = false;
        let originalSize = 0;
        let dimensions = '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File | null;
            if (!file) {
                return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
            }

            const bytes = await file.arrayBuffer();
            fileBuffer = Buffer.from(bytes);
            originalSize = file.size;
            isVideo = file.type.startsWith('video/');

            const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
            fileName = `${cleanName}-${Date.now()}`;
            const ext = file.name.split('.').pop()?.toLowerCase();
            fileExt = ext || (isVideo ? 'mp4' : 'webp');
        } else {
            // JSON with base64
            const body = await request.json();
            const { base64, name, type, sizeBytes, dimensions: dims } = body;

            if (!base64 || typeof base64 !== 'string') {
                return NextResponse.json({ error: 'Missing base64 data' }, { status: 400 });
            }

            const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return NextResponse.json({ error: 'Invalid base64 format' }, { status: 400 });
            }

            const mimeType = matches[1];
            const base64Data = matches[2];
            fileBuffer = Buffer.from(base64Data, 'base64');
            originalSize = sizeBytes || fileBuffer.length;
            isVideo = mimeType.startsWith('video/');
            dimensions = dims || '';

            const cleanName = (name || 'image').replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
            fileName = `${cleanName}-${Date.now()}`;
            fileExt = mimeType.split('/')[1]?.toLowerCase() || (isVideo ? 'mp4' : 'webp');
            if (fileExt === 'jpeg') fileExt = 'jpg';
        }

        if (!fileBuffer) {
            return NextResponse.json({ error: 'Failed to process file buffer' }, { status: 400 });
        }

        // Target uploads directory in public/uploads/
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const safeFileName = `${fileName}.${fileExt}`;
        const filePath = path.join(uploadDir, safeFileName);
        fs.writeFileSync(filePath, fileBuffer);

        const publicUrl = `/uploads/${safeFileName}`;
        const finalSizeStr = fileBuffer.length < 1024 * 1024 
            ? `${(fileBuffer.length / 1024).toFixed(0)} KB` 
            : `${(fileBuffer.length / (1024 * 1024)).toFixed(1)} MB`;

        const newItem: MediaItem = {
            id: `m-${Date.now()}`,
            name: fileName,
            url: publicUrl,
            type: isVideo ? 'video' : 'image',
            size: finalSizeStr,
            sizeBytes: fileBuffer.length,
            dimensions: dimensions || (isVideo ? 'Video HD' : 'Ảnh HD'),
            uploadedAt: new Date().toISOString().split('T')[0],
            compressed: true
        };

        // Save to local CMS DB
        try {
            const db = getLocalDB();
            const currentMedia = db.media || [...DEFAULT_MEDIA_ITEMS];
            const updatedMedia = [newItem, ...currentMedia];
            saveLocalDB({ media: updatedMedia });
        } catch (e) {
            console.warn('Could not update cms-store media list:', e);
        }

        return NextResponse.json({
            success: true,
            url: publicUrl,
            item: newItem
        });
    } catch (e: any) {
        console.error('Upload API error:', e);
        return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
    }
}
