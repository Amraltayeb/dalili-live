import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { businessSubmissionSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client inside function to avoid build-time errors
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const parseResult = businessSubmissionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid data', details: parseResult.error.errors }, { status: 400 });
    }
    const data = parseResult.data;

    // Insert into business_submissions table
    const { error } = await supabase.from('business_submissions').insert({
      user_id: user.id,
      business_name: data.businessName,
      business_name_ar: data.businessNameAr,
      description: data.description,
      description_ar: data.descriptionAr,
      category_id: data.categoryId,
      phone: data.phone,
      email: data.email,
      website: data.website,
      facebook_url: data.facebookUrl,
      instagram_url: data.instagramUrl,
      whatsapp: data.whatsapp,
      address: data.address,
      area: data.area,
      governorate: data.governorate,
      latitude: data.latitude,
      longitude: data.longitude,
      photos: data.photos,
      opening_hours: data.openingHours,
      status: 'pending',
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 