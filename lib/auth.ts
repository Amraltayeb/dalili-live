import { createClient } from '@supabase/supabase-js';

// This client can be used in both client and server components.
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Checks the role of the currently authenticated user.
 * @returns {Promise<{isAdmin: boolean, user: any, error: string | null}>}
 */
export async function checkUserRole() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { isAdmin: false, user: null, error: 'Not authenticated' };
    }

    const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (dbError) {
        console.error('Error fetching user role:', dbError);
        return { isAdmin: false, user, error: 'Failed to fetch user role' };
    }

    return {
        isAdmin: userData?.role === 'admin',
        user: { ...user, role: userData?.role },
        error: null
    };
} 