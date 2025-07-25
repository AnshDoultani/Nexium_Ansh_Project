import { supabase } from '../lib/supabase'

export interface GenerateRecipeRequest {
  ingredients: string[]
  userId: string
}

export interface GenerateRecipeResponse {
  title: string
  recipe: string
  ingredients: string[]
}

export const generateRecipe = async (request: GenerateRecipeRequest): Promise<GenerateRecipeResponse> => {
  try {
    console.log('Sending to n8n webhook:', {
      ingredients: request.ingredients,
      user_id: request.userId
    })

    // Call n8n webhook
    const response = await fetch('https://n8n-51ds.onrender.com/webhook/7e30a2c7-7de1-4fec-8aac-97700f728fe0', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ingredients: request.ingredients,
        user_id: request.userId,
        timestamp: new Date().toISOString()
      })
    })

    console.log('n8n response status:', response.status)
    console.log('n8n response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('n8n webhook error:', errorText)
      throw new Error(`n8n webhook failed: ${response.status} - ${errorText}`)
    }

    const responseText = await response.text()
    console.log('n8n raw response:', responseText)
    
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse n8n response as JSON:', parseError)
      // If response is not JSON, treat it as plain text recipe
      data = {
        title: `Recipe with ${request.ingredients.join(', ')}`,
        recipe: responseText
      }
    }
    
    console.log('Parsed n8n data:', data)
    
    // Save recipe to Supabase
    const { data: savedRecipe, error } = await supabase
      .from('recipes')
      .insert([
        {
          user_id: request.userId,
          ingredients: request.ingredients,
          recipe_content: data.recipe || JSON.stringify(data),
          title: data.title || `Recipe with ${request.ingredients.join(', ')}`
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error saving recipe:', error)
      // Continue even if saving fails
    }

    return {
      title: data.title || `Recipe with ${request.ingredients.join(', ')}`,
      recipe: data.recipe || JSON.stringify(data),
      ingredients: request.ingredients
    }
  } catch (error) {
    console.error('Recipe generation error:', error)
    throw new Error('Failed to generate recipe. Please try again.')
  }
}
