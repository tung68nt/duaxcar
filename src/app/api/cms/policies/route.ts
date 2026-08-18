import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB, PolicyData } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { defaultPolicies } from '@/data/default-policies';

export async function GET() {
    try {
        // 1. Try fetching from Supabase site_settings
        const { data, error } = await supabase
            .from('site_settings')
            .select('id, data')
            .in('id', ['policy_bao-mat', 'policy_dieu-khoan', 'policy_thanh-toan']);

        if (!error && data && data.length > 0) {
            const fetchedPolicies: PolicyData[] = defaultPolicies.map((dp) => {
                const found = data.find((d) => d.id === `policy_${dp.id}`);
                return found?.data ? found.data : dp;
            });

            // Update local cache
            try {
                saveLocalDB({ policies: fetchedPolicies });
            } catch {}

            return NextResponse.json({ policies: fetchedPolicies });
        }
    } catch (err) {
        console.warn("[API Policies GET] Supabase fallback to local DB:", err);
    }

    // 2. Fallback to local DB store
    try {
        const db = getLocalDB();
        return NextResponse.json({ policies: db.policies || defaultPolicies });
    } catch (e: any) {
        return NextResponse.json({ policies: defaultPolicies, error: e.message });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const updatedPolicy: PolicyData = body.policy;

        if (!updatedPolicy || !updatedPolicy.id) {
            return NextResponse.json({ error: 'Missing policy payload' }, { status: 400 });
        }

        const db = getLocalDB();
        const currentPolicies = db.policies || defaultPolicies;
        const index = currentPolicies.findIndex((p) => p.id === updatedPolicy.id);

        let newPolicies: PolicyData[] = [];
        if (index >= 0) {
            newPolicies = [...currentPolicies];
            newPolicies[index] = { ...newPolicies[index], ...updatedPolicy };
        } else {
            newPolicies = [...currentPolicies, updatedPolicy];
        }

        // Save to local file store
        saveLocalDB({ policies: newPolicies });

        // Sync with Supabase in background
        try {
            await supabase.from('site_settings').upsert({
                id: `policy_${updatedPolicy.id}`,
                data: updatedPolicy,
                updated_at: new Date().toISOString(),
            });
        } catch (sbErr) {
            console.warn("[API Policies POST] Supabase upsert warning:", sbErr);
        }

        return NextResponse.json({ success: true, policies: newPolicies });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
