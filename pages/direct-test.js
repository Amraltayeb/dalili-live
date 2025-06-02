import { useState, useEffect } from 'react'

export default function DirectTest() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testDirectConnection()
  }, [])

  const testDirectConnection = async () => {
    const tests = {}

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Test 1: Direct fetch to categories
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/categories?select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      })

      tests.directFetch = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: response.ok ? await response.json() : null,
        error: !response.ok ? `${response.status} ${response.statusText}` : null
      }
    } catch (error) {
      tests.directFetch = {
        success: false,
        error: error.message
      }
    }

    // Test 2: Ping test
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })

      tests.pingTest = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText
      }
    } catch (error) {
      tests.pingTest = {
        success: false,
        error: error.message
      }
    }

    setResults(tests)
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>🌐 Testing Direct Connection...</h1>
        <p>Bypassing Supabase client library...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h1>🌐 Direct Connection Test Results</h1>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', margin: '20px 0', borderRadius: '5px' }}>
        <h2>📋 Test Results</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>1. Ping Test (Basic Connectivity)</h3>
          <p>Success: {results.pingTest?.success ? '✅' : '❌'}</p>
          <p>Status: {results.pingTest?.status}</p>
          <p>Status Text: {results.pingTest?.statusText}</p>
          {results.pingTest?.error && (
            <p style={{ color: 'red' }}>Error: {results.pingTest.error}</p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>2. Direct Fetch to Categories</h3>
          <p>Success: {results.directFetch?.success ? '✅' : '❌'}</p>
          <p>Status: {results.directFetch?.status}</p>
          {results.directFetch?.error && (
            <p style={{ color: 'red' }}>Error: {results.directFetch.error}</p>
          )}
          {results.directFetch?.data && (
            <div>
              <p>Records Found: {results.directFetch.data.length}</p>
              <pre style={{ backgroundColor: '#eee', padding: '10px', overflow: 'auto', maxHeight: '200px' }}>
                {JSON.stringify(results.directFetch.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '5px' }}>
        <h3>💡 Diagnosis</h3>
        {results.pingTest?.success && results.directFetch?.success ? (
          <div>
            <p>✅ <strong>Direct connection works!</strong></p>
            <p>• The issue is with the Supabase JS client library</p>
            <p>• Network connectivity is fine</p>
            <p>• Try updating Supabase JS client</p>
          </div>
        ) : (
          <div>
            <p>❌ <strong>Network/Connectivity issue</strong></p>
            <p>• Check firewall/antivirus settings</p>
            <p>• Check internet connectivity</p>
            <p>• Try different network</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>← Back to Home</a> | 
        <a href="/debug-supabase" style={{ color: 'blue', textDecoration: 'underline', marginLeft: '10px' }}>Supabase Debug</a> | 
        <a href="/simple-test" style={{ color: 'blue', textDecoration: 'underline', marginLeft: '10px' }}>Simple Test</a>
      </div>
    </div>
  )
} 