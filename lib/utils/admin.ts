import { createServerSupabaseClient } from '@/lib/db/supabase'
import { User } from '@/lib/types/auth'

/**
 * Check if a user is an admin (server-side)
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('customers')
      .select('is_admin')
      .eq('id', userId)
      .single()
    
    if (error || !data) {
      return false
    }
    
    return data.is_admin === true
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Check if current user is admin (client-side)
 */
export function isAdminUser(user: User | null): boolean {
  return user?.isAdmin === true
}

/**
 * Get admin user info
 */
export async function getAdminUser(userId: string) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', userId)
    .eq('is_admin', true)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}
