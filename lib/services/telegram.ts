interface OrderItem {
  product_name?: string;
  name?: string;
  quantity?: number;
  price?: number | string;
  subtotal?: number | string;
}

interface TelegramOrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  paymentMethod: string;
  items: OrderItem[];
  transactionId?: string;
}

export class TelegramService {
  private botToken: string;
  private chatId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_GROUP_CHAT_ID || '';

    if (!this.botToken || !this.chatId) {
      console.warn('Telegram bot token or chat ID not configured');
    }
  }

  private formatOrderMessage(data: TelegramOrderData): string {
    const {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      totalAmount,
      paymentMethod,
      items,
      transactionId
    } = data;

    let message = `🎉 *NEW ORDER RECEIVED!*\n\n`;
    message += `📦 *Order:* #${orderNumber}\n`;
    message += `💳 *Payment:* ${paymentMethod}\n`;
    if (transactionId) {
      message += `🔑 *Transaction:* \`${transactionId}\`\n`;
    }
    message += `\n`;
    
    message += `👤 *Customer Information:*\n`;
    message += `• Name: ${customerName}\n`;
    message += `• Email: ${customerEmail}\n`;
    message += `• Phone: ${customerPhone}\n`;
    message += `• Address: ${customerAddress}\n`;
    message += `\n`;

    message += `🛍️ *Order Items:*\n`;
    items.forEach((item, index) => {
      const itemName = item.product_name || item.name || 'Product';
      const qty = item.quantity || 1;
      const price = parseFloat(String(item.price || 0));
      const subtotal = parseFloat(String(item.subtotal || (price * qty)));
      
      message += `${index + 1}. ${itemName}\n`;
      message += `   • Qty: ${qty} × $${price.toFixed(2)} = $${subtotal.toFixed(2)}\n`;
    });
    message += `\n`;

    message += `💰 *Total Amount: $${totalAmount.toFixed(2)}*\n`;
    message += `\n`;
    message += `📅 ${new Date().toLocaleString('en-US', { 
      timeZone: 'Asia/Phnom_Penh',
      dateStyle: 'full',
      timeStyle: 'short'
    })}`;

    return message;
  }

  async sendOrderNotification(orderData: TelegramOrderData): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.error('Telegram not configured');
      return false;
    }

    try {
      const message = this.formatOrderMessage(orderData);
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        console.error('Telegram API error:', result);
        return false;
      }

      console.log('✅ Telegram notification sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      return false;
    }
  }

  async sendTestMessage(): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.error('Telegram not configured');
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const message = '✅ Telegram integration is working! Your PKT Store is ready to receive order notifications.';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
        }),
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Error sending test message:', error);
      return false;
    }
  }

  async sendMessage(message: string): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.error('Telegram not configured');
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      return false;
    }
  }
}

export const telegramService = new TelegramService();
export const sendTelegramMessage = (message: string) => telegramService.sendMessage(message);
