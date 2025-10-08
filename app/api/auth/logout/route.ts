import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteSession } from '@/lib/utils/auth'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (token) {
      // Delete session from database
      await deleteSession(token)
      
      // Clear cookie
      cookieStore.delete('auth_token')
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}
