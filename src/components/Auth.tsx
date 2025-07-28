import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Mail, User, AlertCircle, Zap } from 'lucide-react'

const Auth: React.FC = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signInWithMagicLink } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const { error } = await signInWithMagicLink(email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Magic link sent! Check your email and click the link to sign in.')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
  <h1 className="text-4xl font-bold text-green-700 mb-2">
    Recipe Generator
  </h1>
  <p className="text-gray-500 mb-6">
    Sign in to create delicious recipes with AI
  </p>

  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
    <User className="w-8 h-8 text-green-600" />
  </div>
  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign in with Magic Link</h2>
  <p className="text-gray-600">
    Enter your email to receive a magic link
  </p>
</div>


        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="text-green-700">{success}</span>
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Please wait...' : 'Send Magic Link'}
          </button>
        </form>

        {success && (
          <div className="mt-6 text-center">
            <button
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Try a different email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Auth
