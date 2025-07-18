import React, { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import Auth from './components/Auth'
import { supabase } from './lib/supabase'
import { Loader } from 'lucide-react'
import Header from './components/Header'

function App() {
  const { user, loading: authLoading } = useAuth()

  // Handle magic link authentication callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      if (accessToken && refreshToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (!error) {
            // Clear the URL hash after successful authentication
            window.history.replaceState(null, '', window.location.pathname)
          }
        } catch (error) {
          console.error('Error setting session:', error)
        }
      }
    }

    handleAuthCallback()
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome!</h2>
          <p className="text-gray-600">You are successfully logged in.</p>
        </div>
      </main>
    </div>
  )
}

export default App