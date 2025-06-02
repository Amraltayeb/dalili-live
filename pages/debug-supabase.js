import { useState, useEffect } from 'react'

export default function DebugSupabase() {
  const [supabase, setSupabase] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [businesses, setBusinesses] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState({})

  useEffect(() => {
    initializeSupabase()
  }, [])

  const initializeSupabase = async () => {
    try {
      const supabaseModule = await import('../lib/supabase')
      setSupabase(supabaseModule.supabase)
      checkConnection()
    } catch (error) {
      console.error('Error initializing Supabase:', error)
      setConnectionStatus('error')
      setError('Failed to initialize Supabase')
    }
  }

  const checkConnection = async () => {
    if (!supabase) return
    
    const diagnostics = {}

    // Test 1: Check environment variables
    diagnostics.envCheck = {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL,
      keyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
    }

    // Test 2: Check Supabase client creation
    try {
      diagnostics.clientCheck = {
        created: !!supabase,
        hasAuth: !!supabase.auth,
        hasFrom: !!supabase.from
      }
    } catch (error) {
      diagnostics.clientCheck = { error: error.message }
    }

    // Test 3: Simple connection test
    try {
      const { data, error } = await supabase.from('categories').select('count(*)', { count: 'exact' })
      diagnostics.connectionTest = {
        success: !error,
        data: data,
        error: error?.message
      }
    } catch (error) {
      diagnostics.connectionTest = {
        success: false,
        error: error.message
      }
    }

    // Test 4: Detailed query test
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name')
        .limit(3)
      
      diagnostics.queryTest = {
        success: !error,
        count: data?.length || 0,
        data: data,
        error: error?.message
      }
    } catch (error) {
      diagnostics.queryTest = {
        success: false,
        error: error.message
      }
    }

    setResults(diagnostics)
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>🔍 Running Supabase Diagnostics...</h1>
        <p>Please wait while we test the connection...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h1>🔍 Supabase Diagnostics Report</h1>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', margin: '20px 0', borderRadius: '5px' }}>
        <h2>📋 Test Results</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>1. Environment Variables</h3>
          <p>URL Present: {results.envCheck?.url ? '✅' : '❌'}</p>
          <p>Key Present: {results.envCheck?.key ? '✅' : '❌'}</p>
          <p>URL: {results.envCheck?.urlValue}</p>
          <p>Key Preview: {results.envCheck?.keyPreview}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>2. Supabase Client</h3>
          <p>Client Created: {results.clientCheck?.created ? '✅' : '❌'}</p>
          <p>Has Auth: {results.clientCheck?.hasAuth ? '✅' : '❌'}</p>
          <p>Has From: {results.clientCheck?.hasFrom ? '✅' : '❌'}</p>
          {results.clientCheck?.error && (
            <p style={{ color: 'red' }}>Error: {results.clientCheck.error}</p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>3. Basic Connection</h3>
          <p>Connection: {results.connectionTest?.success ? '✅' : '❌'}</p>
          {results.connectionTest?.error && (
            <p style={{ color: 'red' }}>Error: {results.connectionTest.error}</p>
          )}
          {results.connectionTest?.data && (
            <p>Response: {JSON.stringify(results.connectionTest.data)}</p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>4. Data Query Test</h3>
          <p>Query Success: {results.queryTest?.success ? '✅' : '❌'}</p>
          <p>Records Found: {results.queryTest?.count || 0}</p>
          {results.queryTest?.error && (
            <p style={{ color: 'red' }}>Error: {results.queryTest.error}</p>
          )}
          {results.queryTest?.data && (
            <pre style={{ backgroundColor: '#eee', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(results.queryTest.data, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '5px' }}>
        <h3>💡 Recommendations</h3>
        {!results.envCheck?.url && <p>• Add NEXT_PUBLIC_SUPABASE_URL to .env.local</p>}
        {!results.envCheck?.key && <p>• Add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local</p>}
        {!results.clientCheck?.created && <p>• Check Supabase client configuration</p>}
        {!results.connectionTest?.success && <p>• Check network connection and Supabase URL</p>}
        {!results.queryTest?.success && <p>• Check database permissions and table structure</p>}
        {results.queryTest?.success && <p>• ✅ Everything looks good! Check your main pages.</p>}
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>← Back to Home</a> | 
        <a href="/test-db" style={{ color: 'blue', textDecoration: 'underline', marginLeft: '10px' }}>Test DB</a> | 
        <a href="/simple-test" style={{ color: 'blue', textDecoration: 'underline', marginLeft: '10px' }}>Simple Test</a>
      </div>
    </div>
  )
} 