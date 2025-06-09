"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FixCategoriesPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const checkCurrentState = async () => {
    setLoading(true);
    setResults([]);
    setError(null);

    try {
      const newResults: string[] = [];
      newResults.push('🔍 Checking Current Database State...');

      // Get all businesses and categories
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('*');

      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      const { data: links, error: linksError } = await supabase
        .from('business_category')
        .select('*, businesses(name), categories(name_en)');

      if (businessError || categoriesError || linksError) {
        throw new Error(`Error fetching data: ${businessError?.message || categoriesError?.message || linksError?.message}`);
      }

      newResults.push(`📊 Found ${businesses?.length || 0} businesses`);
      newResults.push(`📊 Found ${categories?.length || 0} categories`);
      newResults.push(`📊 Found ${links?.length || 0} business-category links`);
      newResults.push('');

      // Show current businesses
      newResults.push('🏢 Current Businesses:');
      businesses?.forEach(business => {
        const businessLinks = links?.filter(link => link.business_id === business.id);
        const categoryNames = businessLinks?.map(link => link.categories?.name_en).join(', ') || 'None';
        newResults.push(`  • ${business.name} → ${categoryNames}`);
      });

      newResults.push('');
      newResults.push('🔧 Ready to fix categorization!');

      setResults(newResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fixCategories = async () => {
    setLoading(true);
    setResults([]);
    setError(null);

    try {
      const newResults: string[] = [];
      newResults.push('🔧 Starting Smart Category Fix...');

      // Get all businesses and categories
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('*');

      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (businessError || categoriesError) {
        throw new Error(`Error fetching data: ${businessError?.message || categoriesError?.message}`);
      }

      newResults.push(`📊 Found ${businesses?.length || 0} businesses and ${categories?.length || 0} categories`);

      // Skip clearing - just use upsert logic instead
      newResults.push('🔄 Using smart upsert to avoid duplicates...');

      // Enhanced categorization rules with prioritized keywords
      const categorizationRules: { [key: string]: string[] } = {
        'Restaurants': [
          'koshary', 'sequoia', 'zooba', 'andrea', 'burger', 'pizza', 'shawarma', 'grill', 'kitchen', 'eatery', 'meal', 'cuisine', 'hub',
          'restaurant', 'food', 'cafe', 'bistro', 'dining'
        ],
        'Health & Medical': [
          'hospital', 'medical', 'clinic', 'pharmacy', 'doctor', 'health', 'salam', 'cleopatra', 'dental',
          'care center', 'medical care', 'health care', 'treatment', 'medicine', 'lab', 'diagnostic'
        ],
        'Home Services': [
          'plumber', 'plumbing', 'electrical', 'electrician', 'cleaning', 'maintenance', 'repair service', 'home service',
          'technician', 'installation', 'handyman', 'contracting'
        ],
        'Automotive': [
          'auto', 'car wash', 'car care', 'auto care', 'motor', 'vehicle', 'automotive', 'garage', 'workshop',
          'ghabbour', 'bavarian', 'bmw', 'hyundai', 'car dealer', 'car repair'
        ],
        'Beauty & Spas': [
          'spa', 'salon', 'beauty', 'espace', 'four seasons spa', 'hair studio', 'hair salon', 'glamour',
          'nails', 'massage', 'barber', 'cosmetic', 'wellness center'
        ],
        'Shopping': [
          'mall', 'city stars', 'festival city', 'outlet', 'market', 'shopping center',
          'shop', 'store', 'retail', 'boutique', 'center', 'plaza'
        ],
        'Entertainment': [
          'cinema', 'movie', 'galaxy', 'vox', 'theater', 'entertainment', 'fun', 'game',
          'club', 'recreation', 'leisure'
        ],
        'Hotels & Travel': [
          'hotel', 'resort', 'four seasons hotel', 'marriott', 'travel', 'tourism',
          'accommodation', 'lodge', 'inn', 'hospitality'
        ],
        'Sports & Fitness': [
          'gym', 'fitness', 'gold', 'curves', 'sport', 'exercise', 'training',
          'health club', 'workout', 'athletic'
        ],
        'Financial Services': [
          'bank', 'insurance', 'finance', 'exchange', 'money', 'credit',
          'loan', 'investment', 'financial'
        ],
        'Transportation': [
          'taxi', 'bus', 'metro', 'delivery', 'transport', 'logistics',
          'shipping', 'courier', 'moving'
        ],
        'Education': [
          'school', 'university', 'education', 'training center', 'learning',
          'institute', 'academy', 'college', 'course'
        ]
      };

      let categorizedCount = 0;

      // Categorize each business
      for (const business of businesses || []) {
        const businessText = `${business.name} ${business.description || ''}`.toLowerCase();
        
        // Find matching category - prioritize longer/more specific keywords
        let matchedCategory = null;
        let matchedKeyword = '';
        let bestMatchLength = 0;
        
        for (const [categoryName, keywords] of Object.entries(categorizationRules)) {
          // Sort keywords by length (longer = more specific)
          const sortedKeywords = keywords.sort((a, b) => b.length - a.length);
          
          for (const keyword of sortedKeywords) {
            if (businessText.includes(keyword) && keyword.length > bestMatchLength) {
              matchedCategory = categories?.find(cat => cat.name_en === categoryName);
              matchedKeyword = keyword;
              bestMatchLength = keyword.length;
            }
          }
        }

        if (matchedCategory) {
          // Check if link already exists to prevent duplicates
          const { data: existingLink } = await supabase
            .from('business_category')
            .select('*')
            .eq('business_id', business.id)
            .eq('category_id', matchedCategory.id)
            .maybeSingle();

          if (existingLink) {
            newResults.push(`ℹ️ ${business.name} already linked to ${matchedCategory.name_en}`);
          } else {
            // Link business to category
            const { error: linkError } = await supabase
              .from('business_category')
              .insert({
                business_id: business.id,
                category_id: matchedCategory.id
              });

            if (linkError) {
              newResults.push(`⚠️ Failed to link ${business.name} to ${matchedCategory.name_en}: ${linkError.message}`);
            } else {
              categorizedCount++;
              newResults.push(`✅ ${business.name} → ${matchedCategory.name_en} (keyword: "${matchedKeyword}")`);
            }
          }
        } else {
          // Fallback to 'Shopping' for unmatched businesses
          const fallbackCategory = categories?.find(cat => cat.name_en === 'Shopping');
          if (fallbackCategory) {
            // Check if link already exists
            const { data: existingLink } = await supabase
              .from('business_category')
              .select('*')
              .eq('business_id', business.id)
              .eq('category_id', fallbackCategory.id)
              .maybeSingle();

            if (!existingLink) {
              const { error: linkError } = await supabase
                .from('business_category')
                .insert({
                  business_id: business.id,
                  category_id: fallbackCategory.id
                });

              if (!linkError) {
                categorizedCount++;
                newResults.push(`✅ ${business.name} → Shopping (fallback)`);
              } else {
                newResults.push(`⚠️ Failed to link ${business.name} to Shopping: ${linkError.message}`);
              }
            } else {
              newResults.push(`ℹ️ ${business.name} already linked to Shopping`);
            }
          } else {
            newResults.push(`⚠️ No category found for: ${business.name}`);
          }
        }
      }

      newResults.push('');
      newResults.push(`🎉 Smart Category Fix Complete!`);
      newResults.push(`📊 Successfully categorized: ${categorizedCount} businesses`);
      newResults.push(`📊 Total processed: ${(businesses?.length || 0)} businesses`);
      newResults.push('');
      newResults.push('🔍 Test your categories now:');
      newResults.push('• Go to /search?category=Restaurants');
      newResults.push('• Go to /search?category=Shopping');
      newResults.push('• Go to /search?category=Health%20%26%20Medical');

      setResults(newResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🔧 Fix Business Categories</h1>
          <p className="text-gray-600 mb-6">
            This tool will analyze business names and descriptions to automatically assign them to the correct categories.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={checkCurrentState}
              disabled={loading}
              className="px-6 py-3 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
            >
              {loading ? '🔍 Checking...' : '🔍 Check Current State'}
            </button>
            
            <button
              onClick={fixCategories}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '🔧 Fixing...' : '🔧 Fix Categories Now'}
            </button>
            
            <Link 
              href="/search"
              className="px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              🔍 Test Search
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Results</h3>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-blue-800 font-semibold mb-2">💡 How This Works</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Analyzes business names and descriptions</li>
            <li>• Matches keywords to appropriate categories</li>
            <li>• Prioritizes longer, more specific keywords</li>
            <li>• Creates proper business-category relationships</li>
            <li>• Uses 'Shopping' as fallback for unmatched businesses</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 