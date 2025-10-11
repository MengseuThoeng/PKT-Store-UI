import { NextResponse } from 'next/server'
import { telegramService } from '@/lib/services/telegram'

export async function GET() {
  try {
    const success = await telegramService.sendTestMessage()
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test message sent successfully! Check your Telegram group.',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send test message. Check your Telegram configuration.',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
