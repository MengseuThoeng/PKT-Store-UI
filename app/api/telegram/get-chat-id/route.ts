import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    
    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 400 })
    }

    // Get updates from Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`)
    const data = await response.json()

    if (!data.ok) {
      return NextResponse.json({ error: 'Failed to get updates from Telegram' }, { status: 400 })
    }

    // Extract chat IDs from recent messages
    const chatIds = new Set()
    const groups: Array<{ id: number; title: string; type: string }> = []
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.result.forEach((update: any) => {
      if (update.message?.chat) {
        const chat = update.message.chat
        if (chat.type === 'group' || chat.type === 'supergroup') {
          chatIds.add(chat.id)
          groups.push({
            id: chat.id,
            title: chat.title || 'Unknown Group',
            type: chat.type
          })
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Found the following groups. Copy the ID of your store group:',
      groups: Array.from(new Map(groups.map(g => [g.id, g])).values()),
      instructions: [
        '1. Add your bot to your store group',
        '2. Send a message in the group',
        '3. Refresh this page to see the group ID',
        '4. Copy the negative ID number to your .env.local file'
      ]
    })

  } catch (error) {
    console.error('Error getting chat IDs:', error)
    return NextResponse.json({ error: 'Failed to fetch chat IDs' }, { status: 500 })
  }
}
