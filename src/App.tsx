import React, { useState } from 'react'
import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import Auth from './components/Auth'
import Header from './components/Header'
import IngredientInput from './components/IngredientInput'
import RecipeDisplay from './components/RecipeDisplay'
import RecipeHistory from './components/RecipeHistory'
import { generateRecipe } from './services/recipeService'
import { Recipe } from './lib/supabase'
import { supabase } from './lib/supabase'
import { AlertCircle, Loader } from 'lucide-react'

function App() {
  const { user, loading: authLoading } = useAuth()
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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

  const handleGenerateRecipe = async (ingredients: string[]) => {
    if (!user) return

    setLoading(true)
    setError('')
    
    try {
      const result = await generateRecipe({
        ingredients,
        userId: user.id
      })

      const newRecipe: Recipe = {
        id: Date.now().toString(),
        user_id: user.id,
        ingredients: result.ingredients,
        recipe_content: result.recipe,
        title: result.title,
        created_at: new Date().toISOString()
      }

      setCurrentRecipe(newRecipe)
      setRefreshTrigger(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recipe')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    setCurrentRecipe(recipe)
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <IngredientInput onGenerateRecipe={handleGenerateRecipe} loading={loading} />
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {currentRecipe && (
              <RecipeDisplay recipe={currentRecipe} />
            )}

            {!currentRecipe && !loading && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to cook?</h3>
                <p className="text-gray-600">Enter your ingredients above to generate a delicious recipe!</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <RecipeHistory 
              onSelectRecipe={handleSelectRecipe} 
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
