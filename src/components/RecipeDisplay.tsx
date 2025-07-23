import React from 'react'
import { Clock, Users, ChefHat, Utensils } from 'lucide-react'

interface RecipeDisplayProps {
  recipe: {
    title: string
    ingredients: string[]
    recipe_content: string
    created_at: string
  }
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  const formatRecipeContent = (content: string) => {
    // Split content into sections and format it nicely
    const sections = content.split('\n\n').filter(section => section.trim())
    
    return sections.map((section, index) => {
      const lines = section.split('\n')
      const title = lines[0]
      const content = lines.slice(1).join('\n')
      
      return (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            {title.toLowerCase().includes('instruction') && <Utensils className="w-5 h-5 text-orange-600" />}
            {title.toLowerCase().includes('ingredient') && <ChefHat className="w-5 h-5 text-green-600" />}
            {title}
          </h3>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {content}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-orange-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
        <div className="flex items-center gap-6 text-green-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {new Date(recipe.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{recipe.ingredients.length} ingredients</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-green-600" />
            Your Ingredients
          </h3>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          {formatRecipeContent(recipe.recipe_content)}
        </div>
      </div>
    </div>
  )
}

export default RecipeDisplay