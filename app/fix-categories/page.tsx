"use client";
import { useState } from 'react';
import { 
  getBusinesses, 
  getCategories, 
  getCategorizationKeywords,
  autoCategorizeBusiness,
  clearAllBusinessCategories 
} from '../../lib/dal';
import { Business, Category, CategorizationKeyword } from '../../lib/types';
import Link from 'next/link';

export default function FixCategoriesPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keywords, setKeywords] = useState<CategorizationKeyword[]>([]);

  const loadData = async () => {
    try {
      const [businessesData, categoriesData, keywordsData] = await Promise.all([
        getBusinesses(),
        getCategories(),
        getCategorizationKeywords()
      ]);
      setBusinesses(businessesData);
      setCategories(categoriesData);
      setKeywords(keywordsData);
      setResults(prev => [...prev, `✅ Loaded: ${businessesData.length} businesses, ${categoriesData.length} categories, ${keywordsData.length} keywords`]);
    } catch (error) {
      setResults(prev => [...prev, `❌ Error loading data: ${error}`]);
    }
  };

  const analyzeBusinessRegion = (business: Business): string => {
    const text = `${business.name} ${business.description || ''} ${business.address || ''}`.toLowerCase();
    
    // Egyptian indicators
    if (text.includes('cairo') || text.includes('egypt') || text.includes('alexandria') || 
        text.includes('giza') || text.includes('koshary') || text.includes('sequoia')) {
      return 'egypt';
    }
    
    // USA indicators  
    if (text.includes('usa') || text.includes('america') || text.includes('new york') || 
        text.includes('california')) {
      return 'usa';
    }
    
    // Default to global
    return 'global';
  };

  const findBestCategoryMatch = (business: Business, availableKeywords: CategorizationKeyword[]): { category: Category; keyword: string; priority: number; region: string } | null => {
    const businessText = `${business.name} ${business.description || ''}`.toLowerCase();
    
    let bestMatch: { category: Category; keyword: string; priority: number; region: string } | null = null;
    
    for (const keywordEntry of availableKeywords) {
      if (businessText.includes(keywordEntry.keyword.toLowerCase())) {
        if (!bestMatch || keywordEntry.priority > bestMatch.priority) {
          const category = categories.find(c => c.id === keywordEntry.category_id);
          if (category) {
            bestMatch = {
              category,
              keyword: keywordEntry.keyword,
              priority: keywordEntry.priority,
              region: keywordEntry.region
            };
          }
        }
      }
    }
    
    return bestMatch;
  };

  const categorizeBusiness = async (business: Business): Promise<void> => {
    try {
      // Detect business region
      const region = analyzeBusinessRegion(business);
      
      // Get relevant keywords (global + region-specific)
      const relevantKeywords = keywords.filter(k => 
        k.is_active && (k.region === 'global' || k.region === region)
      );
      
      // Find best match
      const match = findBestCategoryMatch(business, relevantKeywords);
      
      if (match) {
        // Use the built-in auto categorization function
        await autoCategorizeBusiness(business.id, region);
        
        const regionFlag = region === 'egypt' ? '🇪🇬' : region === 'usa' ? '🇺🇸' : '🌍';
        setResults(prev => [...prev, 
          `✅ "${business.name}" → ${match.category.name_en} (${regionFlag} ${match.keyword}, priority: ${match.priority})`
        ]);
      } else {
        setResults(prev => [...prev, `⚠️ No category match found for "${business.name}"`]);
      }
    } catch (error) {
      setResults(prev => [...prev, `❌ Error categorizing "${business.name}": ${error}`]);
    }
  };

  const handleFixCategories = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      // Load fresh data
      await loadData();
      
      setResults(prev => [...prev, '🚀 Starting intelligent categorization process...']);
      
      // Process each business
      for (const business of businesses) {
        await categorizeBusiness(business);
      }
      
      setResults(prev => [...prev, 
        `🎉 Categorization complete! Processed ${businesses.length} businesses.`
      ]);
      
    } catch (error) {
      setResults(prev => [...prev, `❌ Critical error: ${error}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear ALL business categories? This cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setResults([]);
    
    try {
      setResults(['🗑️ Clearing all business categories...']);
      await clearAllBusinessCategories();
      setResults(prev => [...prev, '✅ All business categories cleared successfully']);
    } catch (error) {
      setResults([`❌ Error clearing categories: ${error}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Smart Business Categorization Tool
          </h1>
          <p className="text-gray-600 mb-8">
            Intelligently categorize businesses using admin-managed keywords and region detection
          </p>

          {/* Keywords Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 Current System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{businesses.length}</div>
                <div className="text-blue-800">Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                <div className="text-green-800">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{keywords.length}</div>
                <div className="text-purple-800">Keywords</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleFixCategories}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '🔄 Processing...' : '🎯 Auto-Categorize All Businesses'}
            </button>
            
            <button
              onClick={handleClearAll}
              disabled={loading}
              className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🗑️ Clear All Categories
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-3">📝 Process Log:</h3>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono bg-white p-2 rounded border-l-4 border-blue-400">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Link */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">⚙️ Admin Controls</h4>
            <p className="text-yellow-700 text-sm mb-3">
              Want to modify keywords or add new regions? Use the admin panel to manage categorization rules.
            </p>
            <a 
              href="/admin/keywords" 
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              🔧 Manage Keywords & Regions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 