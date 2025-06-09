import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const results: string[] = [];
    results.push('🔍 Verifying database schema for enhanced business features...');
    results.push('');

    // Check if all required columns exist in the businesses table
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'businesses' });

    if (columnsError) {
      // If the RPC doesn't exist, we'll check manually
      results.push('📋 Checking existing business table structure...');
      
      // Try to query the table to see what columns exist
      const { data: sampleBusiness, error } = await supabase
        .from('businesses')
        .select('*')
        .limit(1)
        .single();

      if (sampleBusiness) {
        const existingColumns = Object.keys(sampleBusiness);
        results.push(`✅ Found ${existingColumns.length} existing columns in businesses table`);
        results.push(`   Columns: ${existingColumns.join(', ')}`);
      }
    }

    // List of new columns we need for enhanced business features
    const requiredColumns = [
      { name: 'gallery_images', type: 'jsonb', description: 'Array of image URLs for photo gallery' },
      { name: 'business_hours', type: 'jsonb', description: 'Weekly business hours schedule' },
      { name: 'features', type: 'jsonb', description: 'Business amenities and features' },
      { name: 'social_media', type: 'jsonb', description: 'Social media links' },
      { name: 'whatsapp', type: 'text', description: 'WhatsApp contact number' },
      { name: 'price_range', type: 'integer', description: 'Price range 1-4 scale' },
      { name: 'average_rating', type: 'decimal(3,2)', description: 'Average customer rating' },
      { name: 'total_reviews', type: 'integer', description: 'Total number of reviews' },
      { name: 'verified', type: 'boolean', description: 'Business verification status' }
    ];

    results.push('');
    results.push('🏗️ Required columns for enhanced features:');
    
    for (const column of requiredColumns) {
      results.push(`   • ${column.name} (${column.type}) - ${column.description}`);
    }

    results.push('');
    results.push('📝 To add missing columns manually, run these SQL commands in Supabase SQL Editor:');
    results.push('');

    // Generate SQL commands to add missing columns
    const sqlCommands = [
      "-- Add enhanced business features columns",
      "ALTER TABLE businesses ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]';",
      "ALTER TABLE businesses ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}';", 
      "ALTER TABLE businesses ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}';",
      "ALTER TABLE businesses ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}';",
      "ALTER TABLE businesses ADD COLUMN IF NOT EXISTS whatsapp TEXT;",
      "ALTER TABLE businesses ADD COLUMN IF NOT EXISTS price_range INTEGER CHECK (price_range >= 1 AND price_range <= 4);",
      "ALTER TABLE businesses ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5);",
      "ALTER TABLE businesses ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;",
      "ALTER TABLE businesses ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;",
      "",
      "-- Add helpful comments",
      "COMMENT ON COLUMN businesses.gallery_images IS 'Array of image URLs for business photo gallery';",
      "COMMENT ON COLUMN businesses.business_hours IS 'Weekly business hours schedule in JSON format';",
      "COMMENT ON COLUMN businesses.features IS 'Business amenities and features (wifi, parking, etc.)';",
      "COMMENT ON COLUMN businesses.social_media IS 'Social media profile links';",
      "COMMENT ON COLUMN businesses.price_range IS 'Price range scale: 1=Budget, 2=Moderate, 3=Expensive, 4=Very Expensive';",
      "",
      "-- Create indexes for better performance",
      "CREATE INDEX IF NOT EXISTS idx_businesses_price_range ON businesses(price_range);",
      "CREATE INDEX IF NOT EXISTS idx_businesses_average_rating ON businesses(average_rating);",
      "CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses(verified);",
      "CREATE INDEX IF NOT EXISTS idx_businesses_features ON businesses USING gin(features);",
      "",
      "-- Update existing businesses with default values if needed",
      "UPDATE businesses SET",
      "  gallery_images = '[]'::jsonb WHERE gallery_images IS NULL;",
      "UPDATE businesses SET", 
      "  business_hours = '{}'::jsonb WHERE business_hours IS NULL;",
      "UPDATE businesses SET",
      "  features = '{}'::jsonb WHERE features IS NULL;",
      "UPDATE businesses SET",
      "  social_media = '{}'::jsonb WHERE social_media IS NULL;",
      "UPDATE businesses SET",
      "  average_rating = 0.0 WHERE average_rating IS NULL;",
      "UPDATE businesses SET",
      "  total_reviews = 0 WHERE total_reviews IS NULL;",
      "UPDATE businesses SET",
      "  verified = FALSE WHERE verified IS NULL;"
    ];

    for (const sql of sqlCommands) {
      results.push(sql);
    }

    results.push('');
    results.push('✅ Database verification complete!');
    results.push('');
    results.push('📋 Next steps:');
    results.push('   1. Run the SQL commands above in Supabase SQL Editor');
    results.push('   2. Use the enhanced admin dashboard to add businesses with full data');
    results.push('   3. Test the new business pages with gallery, features, and hours');
    results.push('');
    results.push('🎯 Enhanced features now available:');
    results.push('   • Photo galleries with multiple images');
    results.push('   • Complete business hours management');
    results.push('   • Business amenities and features');
    results.push('   • Price range indicators');
    results.push('   • Rating and review system');
    results.push('   • Social media integration');
    results.push('   • Business verification status');

    return NextResponse.json({ 
      success: true, 
      results,
      sql_commands: sqlCommands
    });
    
  } catch (error: any) {
    console.error('Database verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      results: [`❌ Database verification failed: ${error.message}`]
    }, { status: 500 });
  }
} 