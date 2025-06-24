import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { reviewSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/dal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { businessId, ...reviewData } = body;

    const parseResult = reviewSchema.safeParse(reviewData);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid data', details: parseResult.error.errors }, { status: 400 });
    }
    const data = parseResult.data;

    const { error } = await supabase.from('reviews').insert({
      business_id: businessId,
      user_name: user.email?.split('@')[0] || 'Anonymous User',
      user_email: user.email,
      rating: data.rating,
      title: data.title,
      comment: data.content,
      images: data.photos || [],
      helpful_count: 0
    });

    if (error) {
      console.error('Review insert error:', error);
      return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (e: any) {
    console.error('API Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 