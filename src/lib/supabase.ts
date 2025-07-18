import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Recipe {
  id: string
  user_id: string
  ingredients: string[]
  recipe_content: string
  title: string
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}