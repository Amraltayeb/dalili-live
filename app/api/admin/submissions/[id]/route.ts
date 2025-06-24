import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkUserRole } from '@/lib/auth';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Create Supabase client inside function to avoid build-time errors
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Authenticate and verify admin role
        const { isAdmin, error: roleError } = await checkUserRole();
        if (roleError || !isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = params;
        const { action, reason } = await request.json(); // action: 'approve' or 'reject'

        if (!id || !action) {
            return NextResponse.json({ error: 'Missing submission ID or action' }, { status: 400 });
        }

        if (action === 'approve') {
            // --- Approval Logic ---
            // 2. Fetch the submission
            const { data: submission, error: fetchError } = await supabase
                .from('business_submissions')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError || !submission) {
                return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
            }

            // 3. Create a new business record
            const { data: newBusiness, error: businessError } = await supabase
                .from('businesses')
                .insert({
                    // Map all relevant fields from submission to businesses table
                    name: submission.business_name,
                    name_ar: submission.business_name_ar,
                    description: submission.description,
                    description_ar: submission.description_ar,
                    phone: submission.phone,
                    email: submission.email,
                    website: submission.website,
                    address: submission.address,
                    area: submission.area,
                    governorate: submission.governorate,
                    latitude: submission.latitude,
                    longitude: submission.longitude,
                    // Note: You may need to handle photos/categories differently
                    // depending on your final schema.
                })
                .select()
                .single();
            
            if (businessError || !newBusiness) {
                return NextResponse.json({ error: `Failed to create business: ${businessError?.message}` }, { status: 500 });
            }

            // You might want to associate photos and categories here if needed
            // For example, linking photos from submission to the new business id.

            // 4. Update the submission status
            const { error: updateError } = await supabase
                .from('business_submissions')
                .update({ status: 'approved', reviewed_by: (await supabase.auth.getUser()).data.user?.id })
                .eq('id', id);

            if (updateError) {
                 // Log this but don't fail the whole operation if business was created
                console.error(`Failed to update submission status: ${updateError.message}`);
            }

            return NextResponse.json({ success: true, message: 'Business approved.' });

        } else if (action === 'reject') {
            // --- Rejection Logic ---
            const { error: rejectError } = await supabase
                .from('business_submissions')
                .update({ status: 'rejected', rejection_reason: reason, reviewed_by: (await supabase.auth.getUser()).data.user?.id })
                .eq('id', id);
            
            if (rejectError) {
                return NextResponse.json({ error: `Failed to reject submission: ${rejectError.message}` }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Submission rejected.' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
} 