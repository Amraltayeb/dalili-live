import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { BUSINESS_CATEGORIES, BUSINESS_LOCATIONS } from '../../../lib/egyptian-data';

// Use the service role key if available, otherwise use anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const results: string[] = [];
    
    results.push('🇪🇬 Starting Egyptian Business Directory Setup...');
    
    // ===================== SETUP CATEGORIES =====================
    results.push('📂 Setting up Egyptian business categories...');
    
    // First, let's try a simple approach - insert categories one by one
    const categoryResults = [];
    
    for (const category of BUSINESS_CATEGORIES) {
      try {
        // Check if category already exists
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .eq('name_en', category.name_en)
          .single();
        
        if (!existing) {
          const { data: newCategory, error } = await supabase
            .from('categories')
            .insert({
              name_en: category.name_en,
              name_ar: category.name_ar,
              icon_svg: category.icon_svg,
              color: category.color,
              created_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (error) {
            console.error(`Error inserting category ${category.name_en}:`, error);
            // Continue with next category instead of failing
            results.push(`⚠️ Skipped ${category.name_en}: ${error.message}`);
          } else {
            categoryResults.push(newCategory);
            results.push(`✅ Added ${category.icon_svg} ${category.name_en}`);
          }
        } else {
          results.push(`ℹ️ Category ${category.name_en} already exists`);
        }
      } catch (err: any) {
        results.push(`⚠️ Error with ${category.name_en}: ${err.message}`);
      }
    }
    
    // ===================== SETUP LOCATIONS =====================
    results.push('🗺️ Setting up Egyptian locations...');
    
    const locationResults = [];
    
    for (const location of BUSINESS_LOCATIONS) {
      try {
        // Check if location already exists
        const { data: existing } = await supabase
          .from('areas')
          .select('id')
          .eq('name_en', location.name_en)
          .single();
        
        if (!existing) {
          const { data: newLocation, error } = await supabase
            .from('areas')
            .insert({
              name_en: location.name_en,
              name_ar: location.name_ar,
              city: location.city,
              latitude: location.latitude,
              longitude: location.longitude,
              created_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (error) {
            console.error(`Error inserting location ${location.name_en}:`, error);
            results.push(`⚠️ Skipped ${location.name_en}: ${error.message}`);
          } else {
            locationResults.push(newLocation);
            results.push(`✅ Added 📍 ${location.name_en}`);
          }
        } else {
          results.push(`ℹ️ Location ${location.name_en} already exists`);
        }
      } catch (err: any) {
        results.push(`⚠️ Error with ${location.name_en}: ${err.message}`);
      }
    }
    
    // ===================== GET CURRENT DATA FOR BUSINESSES =====================
    const { data: allCategories } = await supabase
      .from('categories')
      .select('*');
    
    const { data: allLocations } = await supabase
      .from('areas')
      .select('*');
    
    results.push('🏢 Setting up sample Egyptian businesses...');
    
    const sampleBusinesses = [
      { 
        name: "Koshary Abou Tarek", 
        category: "Restaurants", 
        area: "Zamalek", 
        description: "Famous traditional Egyptian koshary restaurant serving authentic flavors since 1950", 
        phone: "02-27355935",
        website: "https://kosharyaboutarek.com",
        whatsapp: "+201234567890",
        price_range: 1,
        gallery_images: [
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=400&fit=crop"
        ],
        business_hours: {
          monday: { open: "10:00", close: "23:00" },
          tuesday: { open: "10:00", close: "23:00" },
          wednesday: { open: "10:00", close: "23:00" },
          thursday: { open: "10:00", close: "23:00" },
          friday: { open: "10:00", close: "01:00" },
          saturday: { open: "10:00", close: "01:00" },
          sunday: { open: "10:00", close: "23:00" }
        },
        features: {
          takeout: true,
          delivery: true,
          accepts_cards: true,
          wifi: false,
          parking: false
        }
      },
      { 
        name: "Sequoia", 
        category: "Restaurants", 
        area: "Zamalek", 
        description: "Upscale Mediterranean restaurant with stunning Nile view and contemporary atmosphere", 
        phone: "02-27355601",
        website: "https://sequoia-egypt.com",
        whatsapp: "+201987654321",
        price_range: 4,
        gallery_images: [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop"
        ],
        business_hours: {
          monday: { open: "11:00", close: "23:00" },
          tuesday: { open: "11:00", close: "23:00" },
          wednesday: { open: "11:00", close: "23:00" },
          thursday: { open: "11:00", close: "23:00" },
          friday: { open: "11:00", close: "00:00" },
          saturday: { open: "11:00", close: "00:00" },
          sunday: { open: "11:00", close: "22:00" }
        },
        features: {
          reservations: true,
          outdoor_seating: true,
          parking: true,
          wifi: true,
          accepts_cards: true,
          wheelchair_accessible: true
        }
      },
      { 
        name: "City Stars Mall", 
        category: "Shopping", 
        area: "Nasr City", 
        description: "Egypt's largest shopping destination with over 600 stores, restaurants, and entertainment", 
        phone: "02-24800151",
        website: "https://citystars.com.eg",
        price_range: 3,
        gallery_images: [
          "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop"
        ],
        business_hours: {
          monday: { open: "10:00", close: "24:00" },
          tuesday: { open: "10:00", close: "24:00" },
          wednesday: { open: "10:00", close: "24:00" },
          thursday: { open: "10:00", close: "24:00" },
          friday: { open: "10:00", close: "01:00" },
          saturday: { open: "10:00", close: "01:00" },
          sunday: { open: "10:00", close: "24:00" }
        },
        features: {
          parking: true,
          wifi: true,
          wheelchair_accessible: true,
          accepts_cards: true
        }
      },
      { 
        name: "As-Salam International Hospital", 
        category: "Health & Medical", 
        area: "Maadi", 
        description: "Leading private healthcare facility with international standards and modern equipment", 
        phone: "02-25240250",
        website: "https://assalam-hospital.com",
        price_range: 4,
        gallery_images: [
          "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop"
        ],
        business_hours: {
          monday: { open: "24/7", close: "24/7" },
          tuesday: { open: "24/7", close: "24/7" },
          wednesday: { open: "24/7", close: "24/7" },
          thursday: { open: "24/7", close: "24/7" },
          friday: { open: "24/7", close: "24/7" },
          saturday: { open: "24/7", close: "24/7" },
          sunday: { open: "24/7", close: "24/7" }
        },
        features: {
          parking: true,
          wheelchair_accessible: true,
          accepts_cards: true,
          wifi: true
        }
      },
      { 
        name: "Four Seasons Hotel Cairo", 
        category: "Hotels & Travel", 
        area: "Garden City", 
        description: "Luxury 5-star hotel with panoramic Nile views in the heart of Cairo", 
        phone: "02-27918000",
        website: "https://fourseasons.com/cairo",
        price_range: 4,
        gallery_images: [
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800&h=400&fit=crop"
        ],
        business_hours: {
          monday: { open: "24/7", close: "24/7" },
          tuesday: { open: "24/7", close: "24/7" },
          wednesday: { open: "24/7", close: "24/7" },
          thursday: { open: "24/7", close: "24/7" },
          friday: { open: "24/7", close: "24/7" },
          saturday: { open: "24/7", close: "24/7" },
          sunday: { open: "24/7", close: "24/7" }
        },
        features: {
          wifi: true,
          parking: true,
          wheelchair_accessible: true,
          accepts_cards: true
        }
      }
    ];
    
    let businessesAdded = 0;
    
    for (const businessData of sampleBusinesses) {
      try {
        // Find the area (flexible matching)
        const area = allLocations?.find(loc => 
          loc.name_en.toLowerCase().includes(businessData.area.toLowerCase()) ||
          businessData.area.toLowerCase().includes(loc.name_en.toLowerCase())
        );
        
        // Find the category
        const category = allCategories?.find(cat => 
          cat.name_en === businessData.category
        );

        if (area && category) {
          // Check if business already exists
          const { data: existingBusiness } = await supabase
            .from('businesses')
            .select('id')
            .eq('name', businessData.name)
            .single();
          
          if (!existingBusiness) {
            // Insert business
            const { data: business, error: businessError } = await supabase
              .from('businesses')
              .insert({
                name: businessData.name,
                description: businessData.description,
                phone: businessData.phone,
                whatsapp: businessData.whatsapp || null,
                website: businessData.website || null,
                address: `${businessData.area}, Egypt`,
                area_id: area.id,
                latitude: area.latitude + (Math.random() - 0.5) * 0.01,
                longitude: area.longitude + (Math.random() - 0.5) * 0.01,
                email: `info@${businessData.name.toLowerCase().replace(/\s+/g, '')}.com`,
                price_range: businessData.price_range || Math.floor(Math.random() * 3) + 2,
                gallery_images: businessData.gallery_images || null,
                business_hours: businessData.business_hours || null,
                features: businessData.features || null,
                verified: Math.random() > 0.3,
                status: 'active',
                average_rating: Number((4.0 + Math.random() * 1.0).toFixed(1)),
                total_reviews: Math.floor(Math.random() * 50) + 10
              })
              .select()
              .single();

            if (!businessError && business) {
              // Link business to category
              const { error: linkError } = await supabase
                .from('business_category')
                .insert({
                  business_id: business.id,
                  category_id: category.id
                });

              if (!linkError) {
                businessesAdded++;
                results.push(`✅ ${businessData.name} → ${category.name_en}`);
              } else {
                results.push(`⚠️ ${businessData.name} added but not categorized: ${linkError.message}`);
              }
            } else {
              results.push(`⚠️ Failed to add ${businessData.name}: ${businessError?.message}`);
            }
          } else {
            results.push(`ℹ️ Business ${businessData.name} already exists`);
          }
        } else {
          results.push(`⚠️ Could not find area "${businessData.area}" or category "${businessData.category}" for ${businessData.name}`);
        }
      } catch (err: any) {
        results.push(`⚠️ Error with ${businessData.name}: ${err.message}`);
      }
    }
    
    results.push('');
    results.push(`🎉 Egyptian Business Directory Setup Complete!`);
    results.push('');
    results.push('📊 Summary:');
    results.push(`   📂 Categories: ${allCategories?.length || 0} total`);
    results.push(`   🗺️ Locations: ${allLocations?.length || 0} total`);
    results.push(`   🏢 Businesses: ${businessesAdded} added`);
    results.push('');
    results.push('🔍 Test your search now:');
    results.push('   • Visit homepage and click category buttons');
    results.push('   • Try search: "restaurant", "hospital", "mall"');
    results.push('   • Use location filter: "New Cairo", "Zamalek"');
    
    return NextResponse.json({ 
      success: true, 
      results,
      summary: {
        categories: allCategories?.length || 0,
        locations: allLocations?.length || 0,
        businesses: businessesAdded
      }
    });
    
  } catch (error: any) {
    console.error('Setup API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      results: [`❌ Setup failed: ${error.message}`]
    }, { status: 500 });
  }
} 