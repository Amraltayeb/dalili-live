"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCategorizationKeywords, 
  getCategories, 
  createKeyword, 
  updateKeyword, 
  deleteKeyword, 
  toggleKeywordStatus 
} from '../../../lib/dal';
import { CategorizationKeyword, Category, KeywordFormData } from '../../../lib/types';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  EyeSlashIcon,
  GlobeAltIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

const supportedRegions = [
  { code: 'global', name: 'Global', flag: '🌍', description: 'Universal keywords for all markets' },
  { code: 'egypt', name: 'Egypt', flag: '🇪🇬', description: 'Egyptian-specific business terms' },
  { code: 'usa', name: 'United States', flag: '🇺🇸', description: 'US-specific business terms' },
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', description: 'UK-specific business terms' },
  { code: 'india', name: 'India', flag: '🇮🇳', description: 'Indian-specific business terms' },
];

export default function KeywordsManagementPage() {
  const [keywords, setKeywords] = useState<CategorizationKeyword[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<CategorizationKeyword | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  
  const [formData, setFormData] = useState<KeywordFormData>({
    category_id: '',
    keyword: '',
    region: 'global',
    priority: 3,
    is_active: true,
    created_by: 'admin'
  });

  const [multiCategoryFormData, setMultiCategoryFormData] = useState({
    keyword: '',
    region: 'global',
    priority: 3,
    is_active: true,
    category_ids: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, [selectedRegion]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [keywordsData, categoriesData] = await Promise.all([
        getCategorizationKeywords(selectedRegion === 'all' ? undefined : selectedRegion),
        getCategories()
      ]);
      setKeywords(keywordsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredKeywords = keywords.filter(keyword => {
    const matchesCategory = selectedCategory === 'all' || keyword.category_id === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keyword.category?.name_en.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedKeywords = filteredKeywords.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion, selectedCategory, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (editingKeyword) {
        await updateKeyword(editingKeyword.id, formData);
        setSuccess('Keyword updated successfully!');
      } else {
        await createKeyword(formData);
        setSuccess('Keyword created successfully!');
      }
      
      await loadData();
      resetForm();
    } catch (err) {
      setError('Failed to save keyword');
      console.error(err);
    }
  };

  const handleMultiCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (multiCategoryFormData.category_ids.length === 0) {
        setError('Please select at least one category');
        return;
      }

      const promises = multiCategoryFormData.category_ids.map(category_id => 
        createKeyword({
          category_id,
          keyword: multiCategoryFormData.keyword,
          region: multiCategoryFormData.region,
          priority: multiCategoryFormData.priority,
          is_active: multiCategoryFormData.is_active,
          created_by: 'admin'
        })
      );

      await Promise.all(promises);
      const categoryCount = multiCategoryFormData.category_ids.length;
      setSuccess(`Keyword "${multiCategoryFormData.keyword}" added to ${categoryCount} ${categoryCount === 1 ? 'category' : 'categories'}!`);
      
      await loadData();
      resetMultiForm();
    } catch (err) {
      setError('Failed to create keyword');
      console.error(err);
    }
  };

  const handleEdit = (keyword: CategorizationKeyword) => {
    setEditingKeyword(keyword);
    setFormData({
      category_id: keyword.category_id,
      keyword: keyword.keyword,
      region: keyword.region,
      priority: keyword.priority,
      is_active: keyword.is_active,
      created_by: keyword.created_by || 'admin'
    });
    setShowForm(true);
  };

  const handleDelete = async (keyword: CategorizationKeyword) => {
    if (!confirm(`Are you sure you want to delete "${keyword.keyword}"?`)) return;
    
    try {
      await deleteKeyword(keyword.id);
      setSuccess('Keyword deleted successfully!');
      await loadData();
    } catch (err) {
      setError('Failed to delete keyword');
      console.error(err);
    }
  };

  const handleToggleStatus = async (keyword: CategorizationKeyword) => {
    try {
      await toggleKeywordStatus(keyword.id, !keyword.is_active);
      setSuccess(`Keyword ${keyword.is_active ? 'disabled' : 'enabled'} successfully!`);
      await loadData();
    } catch (err) {
      setError('Failed to update keyword status');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      keyword: '',
      region: 'global',
      priority: 3,
      is_active: true,
      created_by: 'admin'
    });
    setEditingKeyword(null);
    setShowForm(false);
  };

  const resetMultiForm = () => {
    setMultiCategoryFormData({
      keyword: '',
      region: 'global',
      priority: 3,
      is_active: true,
      category_ids: []
    });
    setShowAdvancedForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading keywords...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/admin"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Categorization Keywords</h1>
              <p className="text-gray-600 mt-2">
                Manage keywords that automatically categorize businesses by region and category
              </p>
            </div>
            <button
              onClick={() => setShowAdvancedForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Keywords
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Keywords
              </label>
              <input
                type="text"
                placeholder="Search by keyword or category name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 search-input-fix"
                style={{
                  color: '#1f2937 !important',
                  backgroundColor: '#ffffff !important',
                  WebkitTextFillColor: '#1f2937 !important',
                  opacity: '1 !important'
                } as React.CSSProperties}
              />
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                <option value="all" className="text-gray-900 bg-white">All Regions</option>
                {supportedRegions.map(region => (
                  <option key={region.code} value={region.code} className="text-gray-900 bg-white">
                    {region.flag} {region.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                <option value="all" className="text-gray-900 bg-white">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id} className="text-gray-900 bg-white">
                    {category.icon_svg} {category.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Keywords Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Keywords ({filteredKeywords.length} total, showing {paginatedKeywords.length})
            </h3>
            {filteredKeywords.length > itemsPerPage && (
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedKeywords.map(keyword => {
                  const region = supportedRegions.find(r => r.code === keyword.region);
                  return (
                    <tr key={keyword.id} className={keyword.is_active ? '' : 'bg-gray-50 opacity-60'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{keyword.keyword}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{keyword.category?.icon_svg}</span>
                          <span className="text-gray-900">{keyword.category?.name_en}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {region?.flag} {region?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">{keyword.priority}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          keyword.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {keyword.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(keyword)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit keyword"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(keyword)}
                          className={keyword.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          title={keyword.is_active ? 'Disable keyword' : 'Enable keyword'}
                        >
                          {keyword.is_active ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(keyword)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete keyword"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredKeywords.length === 0 && (
            <div className="text-center py-12">
              <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No keywords found for the selected filters.</p>
            </div>
          )}
          
          {/* Pagination */}
          {filteredKeywords.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredKeywords.length)} of {filteredKeywords.length} keywords
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingKeyword ? 'Edit Keyword' : 'Add New Keyword'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-900 bg-white">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id} className="text-gray-900 bg-white">
                        {category.icon_svg} {category.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keyword
                  </label>
                  <input
                    type="text"
                    value={formData.keyword}
                    onChange={(e) => setFormData({...formData, keyword: e.target.value})}
                    required
                    placeholder="e.g., restaurant, pizza, hospital"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    {supportedRegions.map(region => (
                      <option key={region.code} value={region.code} className="text-gray-900 bg-white">
                        {region.flag} {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority (1-5, higher = more important)
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    <option value={1} className="text-gray-900 bg-white">1 - Low</option>
                    <option value={2} className="text-gray-900 bg-white">2 - Below Average</option>
                    <option value={3} className="text-gray-900 bg-white">3 - Average</option>
                    <option value={4} className="text-gray-900 bg-white">4 - High</option>
                    <option value={5} className="text-gray-900 bg-white">5 - Very High</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active (keyword will be used for categorization)
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingKeyword ? 'Update' : 'Create'} Keyword
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Multi-Category Form Modal */}
        {showAdvancedForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Keyword
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add keyword to one or multiple categories
                </p>
              </div>
              
              <form onSubmit={handleMultiCategorySubmit} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keyword
                  </label>
                  <input
                    type="text"
                    value={multiCategoryFormData.keyword}
                    onChange={(e) => setMultiCategoryFormData({...multiCategoryFormData, keyword: e.target.value})}
                    required
                    placeholder="e.g., delivery, online, 24/7"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <select
                    value={multiCategoryFormData.region}
                    onChange={(e) => setMultiCategoryFormData({...multiCategoryFormData, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    {supportedRegions.map(region => (
                      <option key={region.code} value={region.code} className="text-gray-900 bg-white">
                        {region.flag} {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority (1-5, higher = more important)
                  </label>
                  <select
                    value={multiCategoryFormData.priority}
                    onChange={(e) => setMultiCategoryFormData({...multiCategoryFormData, priority: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    <option value={1} className="text-gray-900 bg-white">1 - Low</option>
                    <option value={2} className="text-gray-900 bg-white">2 - Below Average</option>
                    <option value={3} className="text-gray-900 bg-white">3 - Average</option>
                    <option value={4} className="text-gray-900 bg-white">4 - High</option>
                    <option value={5} className="text-gray-900 bg-white">5 - Very High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Categories
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={multiCategoryFormData.category_ids.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMultiCategoryFormData({
                                ...multiCategoryFormData,
                                category_ids: [...multiCategoryFormData.category_ids, category.id]
                              });
                            } else {
                              setMultiCategoryFormData({
                                ...multiCategoryFormData,
                                category_ids: multiCategoryFormData.category_ids.filter(id => id !== category.id)
                              });
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          {category.icon_svg} {category.name_en}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMultiCategoryFormData({
                        ...multiCategoryFormData, 
                        category_ids: categories.map(cat => cat.id)
                      })}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setMultiCategoryFormData({
                        ...multiCategoryFormData, 
                        category_ids: []
                      })}
                      className="text-sm text-gray-600 hover:text-gray-700"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="multi_is_active"
                    checked={multiCategoryFormData.is_active}
                    onChange={(e) => setMultiCategoryFormData({...multiCategoryFormData, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="multi_is_active" className="ml-2 block text-sm text-gray-900">
                    Active (keyword will be used for categorization)
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetMultiForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={multiCategoryFormData.category_ids.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to {multiCategoryFormData.category_ids.length} {multiCategoryFormData.category_ids.length === 1 ? 'Category' : 'Categories'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 