"use client";
import { useEffect, useState } from "react";
import { getBusinesses, createBusiness, updateBusiness, deleteBusiness, getAreas } from "../../../lib/dal";
import { Business, Area } from "../../../lib/types";
import Link from "next/link";

interface BusinessFormData {
  name: string;
  description: string;
  phone: string;
  address: string;
  area_id: string | null;
  logo_url?: string;
  cover_url?: string;
  whatsapp?: string;
  website?: string;
  status?: string;
  email?: string;
  latitude?: number | null;
  longitude?: number | null;
  price_range?: number | null;
  features?: Record<string, boolean>;
  social_media?: Record<string, string>;
  gallery_images?: string[];
  business_hours?: Record<string, { open: string; close: string; closed?: boolean }>;
}

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState<BusinessFormData>({ 
    name: "", 
    description: "", 
    phone: "", 
    address: "", 
    area_id: null,
    status: "active",
    gallery_images: [],
    business_hours: {
      monday: { open: "09:00", close: "17:00" },
      tuesday: { open: "09:00", close: "17:00" },
      wednesday: { open: "09:00", close: "17:00" },
      thursday: { open: "09:00", close: "17:00" },
      friday: { open: "09:00", close: "17:00" },
      saturday: { open: "09:00", close: "17:00" },
      sunday: { open: "09:00", close: "17:00", closed: true }
    }
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinesses();
    fetchAreas();
  }, []);

  async function fetchBusinesses() {
    setLoading(true);
    setBusinesses(await getBusinesses());
    setLoading(false);
  }

  async function fetchAreas() {
    setAreas(await getAreas());
  }

  // Filter businesses based on search term and status
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = searchTerm === "" || 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || business.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Helper function to ensure URL has proper protocol
  const ensureProtocol = (url: string) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Prepare business data with all required fields
    const businessData = {
      name: formData.name,
      description: formData.description || null,
      logo_url: formData.logo_url ? ensureProtocol(formData.logo_url) : null,
      cover_url: formData.cover_url ? ensureProtocol(formData.cover_url) : null,
      phone: formData.phone || null,
      whatsapp: formData.whatsapp || null,
      website: formData.website ? ensureProtocol(formData.website) : null,
      address: formData.address || null,
      area_id: formData.area_id || null,
      status: formData.status || 'active',
      email: formData.email || null,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      price_range: formData.price_range || null,
      features: formData.features || {},
      social_media: {
        facebook: formData.social_media?.facebook ? ensureProtocol(formData.social_media.facebook) : '',
        instagram: formData.social_media?.instagram ? ensureProtocol(formData.social_media.instagram) : ''
      },
      gallery_images: formData.gallery_images || [],
      business_hours: formData.business_hours || {},
      average_rating: 0,
      total_reviews: 0,
      verified: false
    };
    
    if (editId) {
      await updateBusiness(editId, businessData);
    } else {
      await createBusiness(businessData);
    }
    setShowForm(false);
    setEditId(null);
    fetchBusinesses();
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this business?")) {
      await deleteBusiness(id);
      fetchBusinesses();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
                <span className="text-xl font-bold text-gray-900">DALILI Admin</span>
              </Link>
            </div>
            <nav className="flex space-x-6">
              <Link href="/admin/businesses" className="text-blue-600 font-medium">Businesses</Link>
              <Link href="/admin/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
              <Link href="/admin/areas" className="text-gray-600 hover:text-gray-900">Areas</Link>
              <Link href="/admin/keywords" className="text-gray-600 hover:text-gray-900">Keywords</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
          <p className="mt-2 text-gray-600">Manage all businesses in the DALILI directory</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search businesses by name, phone, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {filteredBusinesses.length} of {businesses.length} businesses
              </span>
              <button 
                onClick={() => { 
                  setShowForm(true); 
                  setEditId(null); 
                  setFormData({ 
                    name: "", 
                    description: "", 
                    phone: "", 
                    address: "", 
                    area_id: null, 
                    status: "active",
                    gallery_images: [],
                    business_hours: {
                      monday: { open: "09:00", close: "17:00" },
                      tuesday: { open: "09:00", close: "17:00" },
                      wednesday: { open: "09:00", close: "17:00" },
                      thursday: { open: "09:00", close: "17:00" },
                      friday: { open: "09:00", close: "17:00" },
                      saturday: { open: "09:00", close: "17:00" },
                      sunday: { open: "09:00", close: "17:00", closed: true }
                    }
                  }); 
                }} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <span>+</span>
                <span>Add Business</span>
              </button>
            </div>
          </div>
        </div>

        {/* Businesses Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading businesses...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBusinesses.map((business: any) => (
                    <tr key={business.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{business.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{business.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{business.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{business.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => { setEditId(business.id); setFormData(business); setShowForm(true); }} 
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(business.id)} 
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        </div>
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editId ? 'Edit Business' : 'Add New Business'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      value={formData.description} 
                      onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input 
                      type="text" 
                      value={formData.address} 
                      onChange={e => setFormData(f => ({ ...f, address: e.target.value }))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                    <select
                      value={formData.area_id || ""}
                      onChange={e => setFormData(f => ({ ...f, area_id: e.target.value || null }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Select Area (optional)</option>
                      {areas.map((area: any) => (
                        <option key={area.id} value={area.id}>{area.name_en}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={formData.email || ''} 
                      onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} 
                      placeholder="business@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input 
                      type="text" 
                      value={formData.whatsapp || ''} 
                      onChange={e => setFormData(f => ({ ...f, whatsapp: e.target.value }))} 
                      placeholder="+20 1234567890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input 
                      type="text" 
                      value={formData.website || ''} 
                      onChange={e => setFormData(f => ({ ...f, website: e.target.value }))} 
                      placeholder="www.business.com (https:// will be added automatically)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input 
                        type="number" 
                        step="any"
                        value={formData.latitude || ''} 
                        onChange={e => setFormData(f => ({ ...f, latitude: e.target.value ? parseFloat(e.target.value) : null }))} 
                        placeholder="30.0444"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input 
                        type="number" 
                        step="any"
                        value={formData.longitude || ''} 
                        onChange={e => setFormData(f => ({ ...f, longitude: e.target.value ? parseFloat(e.target.value) : null }))} 
                        placeholder="31.2357"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <select
                      value={formData.price_range || ""}
                      onChange={e => setFormData(f => ({ ...f, price_range: e.target.value ? parseInt(e.target.value) : null }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Select Price Range</option>
                      <option value="1">$ - Budget (Under 100 EGP)</option>
                      <option value="2">$$ - Moderate (100-300 EGP)</option>
                      <option value="3">$$$ - Expensive (300-500 EGP)</option>
                      <option value="4">$$$$ - Very Expensive (500+ EGP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input 
                      type="text" 
                      value={formData.logo_url || ''} 
                      onChange={e => setFormData(f => ({ ...f, logo_url: e.target.value }))} 
                      placeholder="example.com/logo.jpg (https:// will be added automatically)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                    <input 
                      type="text" 
                      value={formData.cover_url || ''} 
                      onChange={e => setFormData(f => ({ ...f, cover_url: e.target.value }))} 
                      placeholder="example.com/cover.jpg (https:// will be added automatically)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Features</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        { key: 'wifi', label: 'WiFi' },
                        { key: 'parking', label: 'Parking' },
                        { key: 'delivery', label: 'Delivery' },
                        { key: 'takeout', label: 'Takeout' },
                        { key: 'accepts_cards', label: 'Cards Accepted' },
                        { key: 'wheelchair_accessible', label: 'Wheelchair Accessible' }
                      ].map(feature => (
                        <label key={feature.key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.features?.[feature.key] || false}
                            onChange={e => setFormData(f => ({
                              ...f,
                              features: {
                                ...f.features,
                                [feature.key]: e.target.checked
                              }
                            }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{feature.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Social Media</label>
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        value={formData.social_media?.facebook || ''} 
                        onChange={e => setFormData(f => ({
                          ...f,
                          social_media: {
                            ...f.social_media,
                            facebook: e.target.value
                          }
                        }))} 
                        placeholder="facebook.com/yourpage (https:// will be added automatically)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                      <input 
                        type="text" 
                        value={formData.social_media?.instagram || ''} 
                        onChange={e => setFormData(f => ({
                          ...f,
                          social_media: {
                            ...f.social_media,
                            instagram: e.target.value
                          }
                        }))} 
                        placeholder="instagram.com/yourpage (https:// will be added automatically)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowForm(false)} 
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      {editId ? 'Update' : 'Add'} Business
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 