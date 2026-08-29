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
        const saveResult = saveLocalDB({ policies: newPolicies });

        // Sync with Supabase
        let supabaseWarning: string | undefined;
        try {
            const { error: sbError } = await supabase.from('site_settings').upsert({
                id: `policy_${updatedPolicy.id}`,
                data: updatedPolicy,
                updated_at: new Date().toISOString(),
            });
            if (sbError) {
                console.error("[API Policies POST] Supabase upsert error:", sbError);
                supabaseWarning = `Supabase sync failed: ${sbError.message}`;
            }
        } catch (sbErr) {
            console.error("[API Policies POST] Supabase upsert exception:", sbErr);
            supabaseWarning = "Supabase sync failed: connection error";
        }

        if (!saveResult && supabaseWarning) {
            return NextResponse.json({ error: 'Failed to save to both Supabase and local DB' }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            policies: newPolicies,
            ...(supabaseWarning ? { warning: supabaseWarning } : {})
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
