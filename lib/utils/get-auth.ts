import { createServerSupabaseClient } from '@/lib/db/supabase'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/utils/auth'

/**
 * Get authenticated user info from custom auth session
 * Returns customer_id and user_id if authenticated
 */
export async function getAuthenticatedUser() {
  const supabase = createServerSupabaseClient()
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')?.value

  if (!authToken) {
    console.log('⚠️ No auth token found')
    return { authenticated: false, customerId: null, userId: null, customer: null }
  }

  try {
    const sessionResult = await verifySession(authToken)
    
    if (!sessionResult.success || !sessionResult.session) {
      console.log('⚠️ Invalid session')
      return { authenticated: false, customerId: null, userId: null, customer: null }
    }

    const customer = sessionResult.session.customers as any
    const customerId = customer.id

    // Get or create user_id for this customer
    const { data: customerData } = await supabase
      .from('customers')
      .select('user_id, id, name, email, phone')
      .eq('id', customerId)
      .single()

    if (!customerData) {
      console.error('❌ Customer not found:', customerId)
      return { authenticated: false, customerId: null, userId: null, customer: null }
    }

    let userId = customerData.user_id

    // If customer doesn't have a user_id, create one
    if (!userId) {
      console.log('💡 Customer has no user_id, creating one...')
      
      // Use customer ID as user_id (or generate new UUID)
      userId = customerId

      // Update customer with user_id
      const { error: updateError } = await supabase
        .from('customers')
        .update({ user_id: userId })
        .eq('id', customerId)

      if (updateError) {
        console.error('❌ Failed to update customer user_id:', updateError)
      } else {
        console.log('✅ Customer user_id set to:', userId)
      }
    }

    console.log('✅ Auth detected - Customer ID:', customerId, 'User ID:', userId)

    return {
      authenticated: true,
      customerId,
      userId,
      customer: {
        id: customerData.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
      }
    }
  } catch (error) {
    console.error('❌ Auth error:', error)
    return { authenticated: false, customerId: null, userId: null, customer: null }
  }
}
