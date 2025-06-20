import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use the environment variables directly for server-side API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseKey
  });
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log('Fetching categories from Supabase...');
    console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
    console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing');
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_en');
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories', details: error.message },
        { status: 500 }
      );
    }
    
    console.log(`Found ${data?.length || 0} categories`);
    return NextResponse.json(data || []);
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 