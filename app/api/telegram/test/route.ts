import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const groupChatId = process.env.TELEGRAM_GROUP_CHAT_ID
    
    console.log('Bot Token:', botToken ? 'Present' : 'Missing')
    console.log('Group Chat ID:', groupChatId)

    if (!botToken) {
      return NextResponse.json({ 
        error: 'TELEGRAM_BOT_TOKEN not found in environment variables' 
      }, { status: 400 })
    }

    if (!groupChatId) {
      return NextResponse.json({ 
        error: 'TELEGRAM_GROUP_CHAT_ID not found in environment variables' 
      }, { status: 400 })
    }

    // Test message
    const testMessage = `
🧪 *TEST MESSAGE FROM PKT STORE*

✅ Bot is working correctly!
⏰ Time: ${new Date().toLocaleString()}
🔧 Testing Telegram integration...

If you see this message, your bot setup is perfect! 🎉
    `.trim()

    console.log('Sending test message to group:', groupChatId)

    // Send to group
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: groupChatId,
        text: testMessage,
        parse_mode: 'Markdown'
      })
    })

    const result = await response.json()
    console.log('Telegram API Response:', result)

    if (!result.ok) {
      return NextResponse.json({
        error: 'Failed to send message',
        details: result,
        troubleshooting: {
          'Error 400 (Bad Request)': 'Check if bot is added to the group and has permission to send messages',
          'Error 403 (Forbidden)': 'Bot was blocked or removed from group',
          'Error 404 (Not Found)': 'Invalid chat ID or bot token',
          'Bot not found': 'Check if bot token is correct'
        }
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Test message sent successfully!',
      messageId: result.result.message_id,
      chatId: result.result.chat.id,
      chatTitle: result.result.chat.title,
      config: {
        botToken: botToken ? `${botToken.substring(0, 10)}...` : 'Missing',
        groupChatId: groupChatId
      }
    })

  } catch (error) {
    console.error('Telegram test error:', error)
    return NextResponse.json({
      error: 'Failed to test Telegram bot',
      details: error instanceof Error ? error.message : 'Unknown error',
      possibleCauses: [
        'Network connectivity issues',
        'Invalid bot token',
        'Bot not added to group',
        'Group chat ID incorrect',
        'Bot permissions insufficient'
      ]
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Telegram Bot Test Endpoint',
    instructions: [
      '1. Make sure your bot is added to the PKT-Alert group',
      '2. Make sure bot has admin permissions or can send messages',
      '3. Send POST request to this endpoint to test',
      '4. Check console logs for detailed debugging info'
    ],
    config: {
      botToken: process.env.TELEGRAM_BOT_TOKEN ? 'Configured' : 'Missing',
      groupChatId: process.env.TELEGRAM_GROUP_CHAT_ID || 'Missing'
    }
  })
}
