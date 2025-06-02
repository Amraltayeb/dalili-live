import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function BusinessDetail() {
  const router = useRouter()
  const { id } = router.query
  const [business, setBusiness] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [supabase, setSupabase] = useState(null)

  useEffect(() => {
    if (id && !supabase) {
      initializeSupabase()
    } else if (id && supabase) {
      fetchBusinessData()
    }
  }, [id, supabase])

  const initializeSupabase = async () => {
    try {
      const supabaseModule = await import('../../lib/supabase')
      setSupabase(supabaseModule.supabase)
      fetchBusinessData()
    } catch (error) {
      console.error('Error initializing Supabase:', error)
      setError('Database connection error')
    }
  }

  const fetchBusinessData = async () => {
    if (!supabase) return
    
    try {
      // Fetch business details
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select(`
          *,
          categories (
            name,
            icon,
            color
          )
        `)
        .eq('id', id)
        .single()

      if (businessError) throw businessError

      // Fetch reviews for this business
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            full_name,
            email
          )
        `)
        .eq('business_id', id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      setBusiness(businessData)
      setReviews(reviewsData || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching business:', error)
      setError('Business not found')
      setLoading(false)
    }
  }

  const formatWorkingHours = (hours) => {
    if (!hours) return null
    
    try {
      const parsed = typeof hours === 'string' ? JSON.parse(hours) : hours
      return Object.entries(parsed).map(([day, time]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        time: time
      }))
    } catch {
      return null
    }
  }

  const parseSocialLinks = (links) => {
    if (!links) return []
    
    try {
      const parsed = typeof links === 'string' ? JSON.parse(links) : links
      return Object.entries(parsed).filter(([platform, url]) => url && url.trim())
    } catch {
      return []
    }
  }

  const handleContactClick = (type, value) => {
    switch (type) {
      case 'phone':
        window.open(`tel:${value}`)
        break
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/[^0-9]/g, '')}`)
        break
      case 'email':
        window.open(`mailto:${value}`)
        break
      case 'website':
        window.open(value.startsWith('http') ? value : `https://${value}`, '_blank')
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <div className="text-xl text-gray-600">Loading business details...</div>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h1>
          <p className="text-gray-600 mb-4">The business you're looking for doesn't exist.</p>
          <Link href="/">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const workingHours = formatWorkingHours(business.working_hours)
  const socialLinks = parseSocialLinks(business.social_links)
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : business.rating || 4.5

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                ← Back to directory
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏢</div>
              <span className="text-lg font-semibold">Dalili</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {business.name}
                  </h1>
                  {business.name_ar && (
                    <h2 className="text-xl text-gray-600 mb-3">{business.name_ar}</h2>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {business.category}
                    </span>
                    <span className="text-gray-600 flex items-center gap-1">
                      📍 {business.area}
                    </span>
                  </div>
                </div>
                <div className="text-4xl ml-4">
                  {business.categories?.icon || '🏢'}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400 text-lg">
                    {'⭐'.repeat(Math.floor(averageRating))}
                  </div>
                  <span className="text-lg font-semibold">{averageRating}</span>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>
                {business.price_range && (
                  <span className="text-green-600 font-semibold text-lg">
                    💰 {business.price_range}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">
                {business.description}
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.phone && (
                  <button
                    onClick={() => handleContactClick('phone', business.phone)}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-2xl">📞</span>
                    <div>
                      <div className="font-semibold">Phone</div>
                      <div className="text-gray-600">{business.phone}</div>
                    </div>
                  </button>
                )}

                {business.whatsapp && (
                  <button
                    onClick={() => handleContactClick('whatsapp', business.whatsapp)}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-2xl">💬</span>
                    <div>
                      <div className="font-semibold">WhatsApp</div>
                      <div className="text-gray-600">{business.whatsapp}</div>
                    </div>
                  </button>
                )}

                {business.email && (
                  <button
                    onClick={() => handleContactClick('email', business.email)}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-2xl">📧</span>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-gray-600">{business.email}</div>
                    </div>
                  </button>
                )}

                {business.website && (
                  <button
                    onClick={() => handleContactClick('website', business.website)}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-2xl">🌐</span>
                    <div>
                      <div className="font-semibold">Website</div>
                      <div className="text-gray-600">{business.website}</div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Address */}
            {business.address && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Address</h3>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <div className="text-gray-700">{business.address}</div>
                    <div className="text-gray-600 mt-1">{business.area}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media */}
            {socialLinks.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="capitalize font-medium">{platform}</span>
                      <span>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Customer Reviews ({reviews.length})
              </h3>
              
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">💬</div>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="text-yellow-400">
                            {'⭐'.repeat(review.rating)}
                          </div>
                          <span className="font-semibold">
                            {review.users?.full_name || 'Anonymous'}
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Working Hours */}
            {workingHours && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Working Hours</h3>
                <div className="space-y-2">
                  {workingHours.map(({ day, time }) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="text-gray-600">{day}</span>
                      <span className="font-medium">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {business.phone && (
                  <button
                    onClick={() => handleContactClick('phone', business.phone)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    📞 Call Now
                  </button>
                )}
                
                {business.whatsapp && (
                  <button
                    onClick={() => handleContactClick('whatsapp', business.whatsapp)}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    💬 WhatsApp
                  </button>
                )}

                <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                  ❤️ Save Business
                </button>

                <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                  📝 Write Review
                </button>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Business Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{business.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-medium">{business.area}</span>
                </div>
                {business.price_range && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Range:</span>
                    <span className="font-medium text-green-600">{business.price_range}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-medium">
                    {new Date(business.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 