import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getLocalDB, saveLocalDB, ScheduleItem } from '@/lib/db';
import { defaultSchedules } from '@/data/default-schedules';
import { supabase } from '@/lib/supabase';
import { resolveScheduleInfo } from '@/lib/course-schedule-helper';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('data')
            .eq('id', 'default_schedules')
            .single();

        if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
            const rawList: ScheduleItem[] = data.data;
            const normalizedList = rawList.map((item) => {
                const resolved = resolveScheduleInfo(item);
                return {
                    ...item,
                    courseSlug: resolved.courseSlug,
                    courseName: resolved.courseName,
                    courseImage: resolved.courseImage,
                    courseUrl: resolved.courseUrl,
                    instructorName: resolved.instructorName,
                    price: resolved.price || item.price,
                };
            });

            // If any item was missing fields, sync the cleansed data to Supabase
            const needsUpdate = rawList.some((item) => !item.courseName || !item.courseImage || item.courseSlug === "pho-bo-truyen-thong");
            if (needsUpdate) {
                try {
                    await supabase
                        .from('site_settings')
                        .upsert({ id: 'default_schedules', data: normalizedList });
                } catch {}
            }

            return NextResponse.json({ schedules: normalizedList });
        }
    } catch (e) {
        // Fallback to local DB if Supabase fails
    }

    try {
        const db = getLocalDB();
        const baseSchedules = db.schedules && db.schedules.length > 0 ? db.schedules : defaultSchedules;
        const normalized = baseSchedules.map((s) => {
            const resolved = resolveScheduleInfo(s);
            return {
                ...s,
                courseSlug: resolved.courseSlug,
                courseName: resolved.courseName,
                courseImage: resolved.courseImage,
                courseUrl: resolved.courseUrl,
                instructorName: resolved.instructorName,
                price: resolved.price || s.price,
            };
        });
        return NextResponse.json({ schedules: normalized });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Support bulk update/restore
        if (Array.isArray(body.schedules)) {
            const updatedList: ScheduleItem[] = body.schedules;
            saveLocalDB({ schedules: updatedList });

            let supabaseWarning: string | undefined;
            try {
                const { error: sbError } = await supabase
                    .from('site_settings')
                    .upsert({ id: 'default_schedules', data: updatedList });
                if (sbError) {
                    supabaseWarning = `Supabase sync failed: ${sbError.message}`;
                }
            } catch (sbErr) {
                supabaseWarning = "Supabase sync failed: connection error";
            }

            try {
                revalidatePath('/');
                revalidatePath('/lich-khai-giang');
            } catch {}

            return NextResponse.json({
                success: true,
                schedules: updatedList,
                ...(supabaseWarning ? { warning: supabaseWarning } : {})
            });
        }

        const schedule: ScheduleItem = body.schedule;

        if (!schedule || !schedule.courseSlug || !schedule.startDate) {
            return NextResponse.json(
                { error: 'Vui lòng chọn khóa học và ngày khai giảng' },
                { status: 400 }
            );
        }

        const db = getLocalDB();
        const currentList = db.schedules || defaultSchedules;
        const existingIndex = currentList.findIndex((s) => s.id === schedule.id);

        let updatedList: ScheduleItem[] = [];
        const now = new Date().toISOString();

        if (existingIndex >= 0) {
            updatedList = [...currentList];
            updatedList[existingIndex] = {
                ...updatedList[existingIndex],
                ...schedule,
                updatedAt: now,
            };
        } else {
            const newItem: ScheduleItem = {
                ...schedule,
                id: schedule.id || `sch-${Date.now()}`,
                visible: schedule.visible !== undefined ? schedule.visible : true,
                spotsLeft: Number(schedule.spotsLeft) || 0,
                totalSpots: Number(schedule.totalSpots) || 8,
                createdAt: now,
                updatedAt: now,
            };
            // Add to top of list
            updatedList = [newItem, ...currentList];
        }

        const saveResult = saveLocalDB({ schedules: updatedList });

        let supabaseWarning: string | undefined;
        try {
            const { error: sbError } = await supabase
                .from('site_settings')
                .upsert({ id: 'default_schedules', data: updatedList });
            if (sbError) {
                console.error("Supabase schedule upsert error:", sbError);
                supabaseWarning = `Supabase sync failed: ${sbError.message}`;
            }
        } catch (sbErr) {
            console.error("Supabase schedule upsert exception:", sbErr);
            supabaseWarning = "Supabase sync failed: connection error";
        }

        if (!saveResult && supabaseWarning) {
            return NextResponse.json(
                { error: 'Không thể lưu vào cả Supabase và cơ sở dữ liệu local' },
                { status: 500 }
            );
        }

        try {
            revalidatePath('/');
            revalidatePath('/lich-khai-giang');
        } catch {}

        return NextResponse.json({
            success: true,
            schedules: updatedList,
            ...(supabaseWarning ? { warning: supabaseWarning } : {})
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing Schedule ID' }, { status: 400 });
        }

        const db = getLocalDB();
        const currentList = db.schedules || defaultSchedules;
        const updatedList = currentList.filter((s) => s.id !== id);

        saveLocalDB({ schedules: updatedList });

        let supabaseWarning: string | undefined;
        try {
            const { error: sbError } = await supabase
                .from('site_settings')
                .upsert({ id: 'default_schedules', data: updatedList });
            if (sbError) {
                console.error("Supabase schedule delete-sync error:", sbError);
                supabaseWarning = `Supabase sync failed: ${sbError.message}`;
            }
        } catch (sbErr) {
            console.error("Supabase schedule delete-sync exception:", sbErr);
            supabaseWarning = "Supabase sync failed: connection error";
        }

        try {
            revalidatePath('/');
            revalidatePath('/lich-khai-giang');
        } catch {}

        return NextResponse.json({
            success: true,
            schedules: updatedList,
            ...(supabaseWarning ? { warning: supabaseWarning } : {})
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
