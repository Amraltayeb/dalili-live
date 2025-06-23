"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBusinessCountByCategory
} from '../../../lib/dal';
import { Category } from '../../../lib/types';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ArrowLeftIcon,
  SwatchIcon,
  GlobeAltIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

interface CategoryFormData {
  name_en: string;
  name_ar: string;
  icon_svg: string;
  color: string;
}

interface CategoryWithStats extends Category {
  business_count?: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name_en: '',
    name_ar: '',
    icon_svg: '🏢',
    color: '#3B82F6'
  });

  // Predefined icons for easy selection
  const iconOptions = [
    '🍽️', '🛍️', '🏥', '🎓', '💄', '🔧', '🏠', '🚗', 
    '⚽', '🎭', '📚', '☕', '🍔', '🏪', '🏦', '⛽',
    '💊', '👔', '🧘', '🎯', '🎪', '🏢', '🌐', '📱'
  ];

  // Predefined colors
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getCategories();
      
      // Get business count for each category
      const categoriesWithStats = await Promise.all(
        categoriesData.map(async (category) => {
          try {
            const businessCount = await getBusinessCountByCategory(category.id);
            return { ...category, business_count: businessCount };
          } catch (err) {
            return { ...category, business_count: 0 };
          }
        })
      );
      
      setCategories(categoriesWithStats);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = searchTerm === '' || 
      category.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name_ar.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        setSuccess('Category updated successfully!');
      } else {
        await createCategory(formData);
        setSuccess('Category created successfully!');
      }
      
      await loadCategories();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
      console.error(err);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_en: category.name_en,
      name_ar: category.name_ar,
      icon_svg: category.icon_svg || '🏢',
      color: category.color || '#3B82F6'
    });
    setShowForm(true);
  };

  const handleDelete = async (category: Category) => {
    const businessCount = categories.find(c => c.id === category.id)?.business_count || 0;
    
    if (businessCount > 0) {
      if (!confirm(`This category has ${businessCount} businesses assigned to it. Are you sure you want to delete "${category.name_en}"? This action cannot be undone.`)) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete "${category.name_en}"? This action cannot be undone.`)) {
        return;
      }
    }
    
    try {
      await deleteCategory(category.id);
      setSuccess('Category deleted successfully!');
      await loadCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_ar: '',
      icon_svg: '🏢',
      color: '#3B82F6'
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/admin" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Admin Dashboard
        </Link>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <SwatchIcon className="h-8 w-8 mr-3 text-blue-600" />
              Categories Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage business categories, icons, and multi-language support
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Category
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

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Categories
          </label>
          <input
            type="text"
            placeholder="Search by name (English or Arabic)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
            Categories ({filteredCategories.length} total)
          </h3>
        </div>
        
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <SwatchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No categories found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    English Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arabic Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Businesses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map(category => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                          style={{ backgroundColor: category.color || '#3B82F6' }}
                        >
                          {category.icon_svg}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{category.name_en}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-arabic">{category.name_ar}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category.business_count || 0} businesses
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Edit category"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete category"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* English Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name_en}
                  onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Restaurants"
                />
              </div>

              {/* Arabic Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arabic Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name_ar}
                  onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="مثال: مطاعم"
                  dir="rtl"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category Icon
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({...formData, icon_svg: icon})}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl hover:bg-gray-50 transition-colors ${
                        formData.icon_svg === icon 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={formData.icon_svg}
                    onChange={(e) => setFormData({...formData, icon_svg: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Or enter custom emoji/icon"
                  />
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category Color
                </label>
                <div className="flex space-x-2 mb-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, color})}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color 
                          ? 'border-gray-800' 
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon_svg}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{formData.name_en || 'English Name'}</div>
                    <div className="text-gray-600 font-arabic">{formData.name_ar || 'Arabic Name'}</div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 