'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function SupabaseTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Simple test query to verify connection
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1)

        if (error) throw error
        setIsConnected(true)
        console.log('Test query result:', data)
      } catch (e) {
        setIsConnected(false)
        setError(e instanceof Error ? e.message : 'Unknown error occurred')
        console.error('Supabase connection error:', e)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">Supabase Connection Test</h2>
      {isConnected === null ? (
        <p>Testing connection...</p>
      ) : isConnected ? (
        <p className="text-green-600">✓ Connected to Supabase</p>
      ) : (
        <div className="text-red-600">
          <p>✗ Connection failed</p>
          {error && <p className="text-sm mt-1">{error}</p>}
        </div>
      )}
    </div>
  )
}
