import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { reviewSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with service role key for API operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Extract the JWT token and verify it
    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    const body = await request.json();
    const { businessId, ...reviewData } = body;

    const parseResult = reviewSchema.safeParse(reviewData);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid data', details: parseResult.error.errors }, { status: 400 });
    }
    const data = parseResult.data;

    console.log('Inserting review with data:', {
      business_id: businessId,
      user_name: user.email?.split('@')[0] || 'Anonymous User',
      user_email: user.email,
      rating: data.rating,
      title: data.title,
      comment: data.content,
      images: data.photos || [],
      helpful_count: 0
    });

    const { data: insertResult, error } = await supabase.from('reviews').insert({
      business_id: businessId,
      user_name: user.email?.split('@')[0] || 'Anonymous User',
      user_email: user.email,
      rating: data.rating,
      title: data.title,
      comment: data.content,
      images: data.photos || [],
      helpful_count: 0
    }).select();

    if (error) {
      console.error('Review insert error:', error);
      return NextResponse.json({ 
        error: 'Failed to submit review.', 
        details: error.message,
        code: error.code 
      }, { status: 500 });
    }

    console.log('Review inserted successfully:', insertResult);

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (e: any) {
    console.error('API Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 