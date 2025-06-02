import { useState, useEffect } from 'react'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('add')
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState(null)
  const [allBusinesses, setAllBusinesses] = useState([])
  const [editingBusiness, setEditingBusiness] = useState(null)
  const [supabaseFunctions, setSupabaseFunctions] = useState(null)
  
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    name_ar: '',
    category: '',
    subcategory: '',
    phone: '',
    whatsapp: '',
    email: '',
    area: '',
    address: '',
    description: '',
    description_ar: '',
    services_offered: '',
    price_range: '$',
    
    // Social links
    instagram: '',
    facebook: '',
    website: '',
    linkedin: '',
    
    // Working hours
    monday_open: '',
    monday_close: '',
    tuesday_open: '',
    tuesday_close: '',
    wednesday_open: '',
    wednesday_close: '',
    thursday_open: '',
    thursday_close: '',
    friday_open: '',
    friday_close: '',
    saturday_open: '',
    saturday_close: '',
    sunday_open: '',
    sunday_close: '',
    
    // Custom fields based on category
    customFields: {}
  })
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const areas = [
    'New Cairo', 'New Administrative Capital', 'El Shorouk City', 'Badr City',
    'New Heliopolis', 'Rehab City', 'Madinaty', 'First District', 'Fifth District',
    'Katameya Heights', 'Zamalek', 'Mohandeseen', 'Heliopolis', 'Nasr City',
    '6th of October', 'Sheikh Zayed', 'Giza', 'Downtown Cairo', 'Garden City',
    'Dokki', 'Agouza', 'Maadi', 'Degla', 'Hadayek al-Ahram'
  ]

  // Category-specific custom field templates
  const categoryCustomFields = {
    'Digital Services': {
      specialties: { type: 'array', label: 'Specialties', placeholder: 'e.g. Video editing, Motion graphics' },
      software: { type: 'array', label: 'Software Used', placeholder: 'e.g. Final Cut Pro, After Effects' },
      turnaround_time: { type: 'text', label: 'Turnaround Time', placeholder: 'e.g. 2-3 days' },
      languages: { type: 'array', label: 'Languages', placeholder: 'e.g. Arabic, English' },
      min_budget: { type: 'text', label: 'Minimum Budget', placeholder: 'e.g. 500 EGP' },
      experience_years: { type: 'number', label: 'Years of Experience' }
    },
    'Restaurants & Food': {
      cuisine_type: { type: 'text', label: 'Cuisine Type', placeholder: 'e.g. Italian, Egyptian' },
      delivery_available: { type: 'boolean', label: 'Delivery Available' },
      dine_in: { type: 'boolean', label: 'Dine In Available' },
      takeaway: { type: 'boolean', label: 'Takeaway Available' },
      halal_certified: { type: 'boolean', label: 'Halal Certified' },
      parking_available: { type: 'boolean', label: 'Parking Available' },
      accepts_reservations: { type: 'boolean', label: 'Accepts Reservations' },
      average_meal_cost: { type: 'text', label: 'Average Meal Cost', placeholder: 'e.g. 150 EGP' }
    },
    'Beauty & Personal Care': {
      services: { type: 'array', label: 'Services Offered', placeholder: 'e.g. Haircut, Beard trimming' },
      gender_served: { type: 'select', label: 'Gender Served', options: ['men', 'women', 'both'] },
      appointment_required: { type: 'boolean', label: 'Appointment Required' },
      payment_methods: { type: 'array', label: 'Payment Methods', placeholder: 'e.g. cash, card' },
      amenities: { type: 'array', label: 'Amenities', placeholder: 'e.g. AC, WiFi' }
    },
    'Professional Services': {
      practice_areas: { type: 'array', label: 'Practice Areas', placeholder: 'e.g. Family Law, Business Law' },
      consultation_fee: { type: 'text', label: 'Consultation Fee', placeholder: 'e.g. 500 EGP' },
      languages: { type: 'array', label: 'Languages', placeholder: 'e.g. Arabic, English' },
      years_experience: { type: 'number', label: 'Years of Experience' },
      online_consultation: { type: 'boolean', label: 'Online Consultation Available' }
    },
    'Healthcare': {
      specialties: { type: 'array', label: 'Medical Specialties', placeholder: 'e.g. General Medicine, Cardiology' },
      consultation_fee: { type: 'text', label: 'Consultation Fee', placeholder: 'e.g. 300 EGP' },
      accepted_insurance: { type: 'array', label: 'Accepted Insurance', placeholder: 'e.g. Allianz, AXA' },
      clinic_name: { type: 'text', label: 'Clinic Name' },
      appointment_required: { type: 'boolean', label: 'Appointment Required' },
      emergency_available: { type: 'boolean', label: 'Emergency Services Available' }
    },
    'Home Services': {
      services: { type: 'array', label: 'Services Offered', placeholder: 'e.g. Pipe repair, Installation' },
      emergency_available: { type: 'boolean', label: 'Emergency Services Available' },
      service_areas: { type: 'array', label: 'Service Areas', placeholder: 'e.g. New Cairo, Rehab' },
      hourly_rate: { type: 'text', label: 'Hourly Rate', placeholder: 'e.g. 100 EGP' },
      minimum_charge: { type: 'text', label: 'Minimum Charge', placeholder: 'e.g. 200 EGP' },
      warranty_provided: { type: 'text', label: 'Warranty Provided', placeholder: 'e.g. 6 months' }
    }
  }

  useEffect(() => {
    if (isAuthenticated && !supabaseFunctions) {
      initializeSupabase()
    } else if (isAuthenticated && supabaseFunctions) {
      loadData()
    }
  }, [isAuthenticated, supabaseFunctions])

  const initializeSupabase = async () => {
    try {
      const supabaseModule = await import('../lib/supabase')
      setSupabaseFunctions(supabaseModule)
      loadData()
    } catch (error) {
      console.error('Error initializing Supabase:', error)
      setMessage('❌ Error connecting to database. Please check configuration.')
    }
  }

  const loadData = async () => {
    if (!supabaseFunctions) return
    
    try {
      const [categoriesData, statsData, businessesData] = await Promise.all([
        supabaseFunctions.getCategories(),
        supabaseFunctions.getBusinessStats(),
        supabaseFunctions.getBusinesses()
      ])
      
      setCategories(categoriesData)
      setStats(statsData)
      setAllBusinesses(businessesData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      setMessage('❌ Error loading data. Please try again.')
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'dalili2024') {
      setIsAuthenticated(true)
      setMessage('')
    } else {
      setMessage('Wrong password!')
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('custom_')) {
      const fieldName = name.replace('custom_', '')
      setFormData(prev => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [fieldName]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const processCustomFields = () => {
    const customData = { ...formData.customFields }
    
    // Process array fields (comma-separated to array)
    const category = formData.category
    const categoryFields = categoryCustomFields[category] || {}
    
    Object.keys(categoryFields).forEach(fieldName => {
      if (categoryFields[fieldName].type === 'array' && customData[fieldName]) {
        customData[fieldName] = customData[fieldName]
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0)
      }
    })
    
    return customData
  }

  const processWorkingHours = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const workingHours = {}
    
    days.forEach(day => {
      const open = formData[`${day}_open`]
      const close = formData[`${day}_close`]
      if (open && close) {
        workingHours[day] = { open, close }
      }
    })
    
    return Object.keys(workingHours).length > 0 ? workingHours : null
  }

  const processSocialLinks = () => {
    const socialLinks = {}
    if (formData.instagram) socialLinks.instagram = formData.instagram
    if (formData.facebook) socialLinks.facebook = formData.facebook
    if (formData.website) socialLinks.website = formData.website
    if (formData.linkedin) socialLinks.linkedin = formData.linkedin
    return Object.keys(socialLinks).length > 0 ? socialLinks : {}
  }

  const resetForm = () => {
    setFormData({
      name: '', name_ar: '', category: '', subcategory: '', phone: '', whatsapp: '',
      email: '', area: '', address: '', description: '', description_ar: '',
      services_offered: '', price_range: '$', instagram: '', facebook: '',
      website: '', linkedin: '', monday_open: '', monday_close: '',
      tuesday_open: '', tuesday_close: '', wednesday_open: '', wednesday_close: '',
      thursday_open: '', thursday_close: '', friday_open: '', friday_close: '',
      saturday_open: '', saturday_close: '', sunday_open: '', sunday_close: '',
      customFields: {}
    })
    setEditingBusiness(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!supabaseFunctions) {
      setMessage('❌ Database connection not initialized')
      setLoading(false)
      return
    }

    try {
      const businessData = {
        ...formData,
        working_hours: processWorkingHours(),
        social_links: processSocialLinks(),
        custom_data: processCustomFields()
      }

      if (editingBusiness) {
        const result = await supabaseFunctions.updateBusiness(editingBusiness.id, businessData)
        setMessage(`✅ Business "${result.name}" updated successfully!`)
      } else {
        const result = await supabaseFunctions.addBusiness(businessData)
        setMessage(`✅ Business "${result.name}" added successfully!`)
      }
      
      resetForm()
      loadData()

    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (business) => {
    setEditingBusiness(business)
    
    // Populate form with business data
    setFormData({
      name: business.name || '',
      name_ar: business.name_ar || '',
      category: business.category || '',
      subcategory: business.subcategory || '',
      phone: business.phone || '',
      whatsapp: business.whatsapp || '',
      email: business.email || '',
      area: business.area || '',
      address: business.address || '',
      description: business.description || '',
      description_ar: business.description_ar || '',
      services_offered: business.services_offered || '',
      price_range: business.price_range || '$',
      
      // Social links
      instagram: business.social_links?.instagram || '',
      facebook: business.social_links?.facebook || '',
      website: business.social_links?.website || '',
      linkedin: business.social_links?.linkedin || '',
      
      // Working hours
      monday_open: business.working_hours?.monday?.open || '',
      monday_close: business.working_hours?.monday?.close || '',
      tuesday_open: business.working_hours?.tuesday?.open || '',
      tuesday_close: business.working_hours?.tuesday?.close || '',
      wednesday_open: business.working_hours?.wednesday?.open || '',
      wednesday_close: business.working_hours?.wednesday?.close || '',
      thursday_open: business.working_hours?.thursday?.open || '',
      thursday_close: business.working_hours?.thursday?.close || '',
      friday_open: business.working_hours?.friday?.open || '',
      friday_close: business.working_hours?.friday?.close || '',
      saturday_open: business.working_hours?.saturday?.open || '',
      saturday_close: business.working_hours?.saturday?.close || '',
      sunday_open: business.working_hours?.sunday?.open || '',
      sunday_close: business.working_hours?.sunday?.close || '',
      
      customFields: business.custom_data || {}
    })
    
    setActiveTab('add')
  }

  const handleDelete = async (businessId, businessName) => {
    if (!supabaseFunctions) {
      setMessage('❌ Database connection not initialized')
      return
    }

    if (confirm(`Are you sure you want to delete "${businessName}"?`)) {
      try {
        await supabaseFunctions.deleteBusiness(businessId)
        setMessage(`✅ Business "${businessName}" deleted successfully!`)
        loadData()
      } catch (error) {
        setMessage(`❌ Error: ${error.message}`)
      }
    }
  }

  const renderCustomFields = () => {
    const category = formData.category
    const categoryFields = categoryCustomFields[category]
    
    if (!categoryFields) return null

    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl"></div>
        <div className="relative backdrop-blur-sm bg-white/80 border border-indigo-200/50 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              ⚡
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-800">{category} Fields</h3>
              <p className="text-gray-600">Category-specific information</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(categoryFields).map(([fieldName, fieldConfig]) => (
              <div key={fieldName} className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {fieldConfig.label}
                </label>
                {fieldConfig.type === 'boolean' ? (
                  <label className="relative flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 cursor-pointer hover:border-indigo-300 transition-all duration-200 group-hover:shadow-md">
                    <input
                      type="checkbox"
                      name={`custom_${fieldName}`}
                      checked={formData.customFields[fieldName] || false}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Yes</span>
                  </label>
                ) : fieldConfig.type === 'select' ? (
                  <select
                    name={`custom_${fieldName}`}
                    value={formData.customFields[fieldName] || ''}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="">Select...</option>
                    {fieldConfig.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={fieldConfig.type === 'number' ? 'number' : 'text'}
                    name={`custom_${fieldName}`}
                    value={formData.customFields[fieldName] || ''}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder={fieldConfig.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-indigo-500/10 to-purple-500/10"></div>
        
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            {/* Glass morphism login card */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              {/* Logo and title */}
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl">
                  🏢
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Dalili Admin</h1>
                <p className="text-indigo-200">Business Directory Management</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
                >
                  🔓 Access Admin Panel
                </button>
              </form>
              
              {message && (
                <div className="mt-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 text-red-200 rounded-xl text-center">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                🏢
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Dalili Admin
                </h1>
                <p className="text-gray-600 font-medium">Business Directory Management</p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-gray-200/50">
            <nav className="flex space-x-2">
              {[
                { id: 'add', label: 'Add Business', icon: '➕', color: 'indigo' },
                { id: 'listings', label: 'Manage Listings', icon: '📋', count: allBusinesses.length, color: 'blue' },
                { id: 'dashboard', label: 'Dashboard', icon: '📊', count: stats?.total || 0, color: 'purple' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-8 p-6 rounded-2xl font-semibold shadow-lg ${
            message.includes('✅') 
              ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 text-green-800' 
              : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <div className="text-2xl mr-3">
                {message.includes('✅') ? '🎉' : '⚠️'}
              </div>
              <div>{message}</div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'add' && (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
            <div className="relative backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-8 border border-gray-200/50">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  {editingBusiness ? '✏️' : '➕'}
                </div>
                <div className="ml-6">
                  <h2 className="text-4xl font-bold text-gray-800">
                    {editingBusiness ? 'Edit Business' : 'Add New Business'}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {editingBusiness ? 'Update business information' : 'Create a new business listing'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Basic Information */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>
                  <div className="relative backdrop-blur-sm bg-white/80 border border-blue-200/50 rounded-2xl p-8">
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                        📋
                      </div>
                      <div className="ml-4">
                        <h3 className="text-2xl font-bold text-gray-800">Basic Information</h3>
                        <p className="text-gray-600">Essential business details</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Business Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md group-hover:border-blue-300"
                          placeholder="e.g. Mario's Pizza, Ahmed Video Editor"
                          required
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Arabic Name</label>
                        <input
                          type="text"
                          name="name_ar"
                          value={formData.name_ar}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md group-hover:border-blue-300"
                          placeholder="الاسم بالعربية"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md group-hover:border-blue-300"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md group-hover:border-blue-300"
                          placeholder="+20 10xxxxxxxx"
                          required
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Area *</label>
                        <select
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md group-hover:border-blue-300"
                          required
                        >
                          <option value="">Select Area</option>
                          {areas.map(area => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                      </div>
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Description *</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md group-hover:border-blue-300 resize-none"
                          placeholder="Brief description of the business..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Custom Fields */}
                {formData.category && renderCustomFields()}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-2xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-xl font-bold transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">{editingBusiness ? '✏️' : '➕'}</span>
                        <span>{editingBusiness ? 'Update Business' : 'Add Business'}</span>
                      </>
                    )}
                  </button>
                  {editingBusiness && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-8 py-5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:from-gray-600 hover:to-gray-700 font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl"></div>
            <div className="relative backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-8 border border-gray-200/50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    📋
                  </div>
                  <div className="ml-6">
                    <h2 className="text-4xl font-bold text-gray-800">Manage Listings</h2>
                    <p className="text-gray-600 text-lg">{allBusinesses.length} businesses in your directory</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {allBusinesses.map((business, index) => (
                  <div key={business.id} className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl"></div>
                    <div className="relative backdrop-blur-sm bg-white/80 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-200 group-hover:border-indigo-300">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-800">{business.name}</h3>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                                  {business.category}
                                </span>
                                <span className="px-3 py-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                                  {business.area}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4 leading-relaxed">{business.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center space-x-2">
                              <span>📞</span>
                              <span>{business.phone}</span>
                            </span>
                            {business.email && (
                              <span className="flex items-center space-x-2">
                                <span>📧</span>
                                <span>{business.email}</span>
                              </span>
                            )}
                            <span className="flex items-center space-x-2">
                              <span>📅</span>
                              <span>Added {new Date(business.created_at).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-3 ml-6">
                          <button
                            onClick={() => handleEdit(business)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(business.id, business.name)}
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                          >
                            <span>🗑️</span>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {allBusinesses.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
                      📪
                    </div>
                    <h3 className="text-2xl font-bold text-gray-500 mb-3">No businesses yet</h3>
                    <p className="text-gray-400 text-lg">Add your first business to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: 'Total Businesses', value: stats.total, icon: '🏢', gradient: 'from-blue-500 to-blue-600' },
                { label: 'Active Listings', value: stats.active, icon: '✅', gradient: 'from-green-500 to-green-600' },
                { label: 'Pending Review', value: stats.pending, icon: '⏳', gradient: 'from-yellow-500 to-yellow-600' },
                { label: 'Categories', value: Object.keys(stats.by_category).length, icon: '📊', gradient: 'from-purple-500 to-purple-600' }
              ].map((stat, index) => (
                <div key={index} className="relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl`}></div>
                  <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{stat.icon}</div>
                      <div className="text-right">
                        <div className="text-4xl font-bold">{stat.value}</div>
                        <div className="text-white/80 font-semibold">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories Breakdown */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
              <div className="relative backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl border border-gray-200/50">
                <div className="p-8 border-b border-gray-200/50">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      📊
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-800">Businesses by Category</h3>
                      <p className="text-gray-600">Distribution across all categories</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid gap-4">
                    {Object.entries(stats.by_category).map(([category, count], index) => (
                      <div key={category} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <span className="font-semibold text-gray-800 text-lg">{category}</span>
                        </div>
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 