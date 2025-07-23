import React, { useState, useEffect } from 'react'
import { supabase, Recipe } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { History, ChefHat, Calendar, Trash2 } from 'lucide-react'

interface RecipeHistoryProps {
  onSelectRecipe: (recipe: Recipe) => void
  refreshTrigger: number
}

const RecipeHistory: React.FC<RecipeHistoryProps> = ({ onSelectRecipe, refreshTrigger }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchRecipes()
    }
  }, [user, refreshTrigger])

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error
      setRecipes(recipes.filter(recipe => recipe.id !== id))
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-orange-600" />
          Recipe History
        </h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-orange-600" />
        Recipe History
      </h2>

      {recipes.length === 0 ? (
        <div className="text-center py-8">
          <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recipes yet. Generate your first recipe!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={() => onSelectRecipe(recipe)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(recipe.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      {recipe.ingredients.length} ingredients
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{recipe.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteRecipe(recipe.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecipeHistory