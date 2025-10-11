import { createServerSupabaseClient } from '@/lib/db/supabase';

interface OrderItem {
  product_id: number;
  product_type: 'figure' | 'manga' | 'plushie';
  quantity: number;
}

/**
 * Check if all products in order have enough stock
 */
export async function checkStockAvailability(orderItems: OrderItem[]): Promise<{
  available: boolean;
  insufficientItems: Array<{ product_type: string; product_id: number; requested: number; available: number }>;
}> {
  const supabase = createServerSupabaseClient();
  const insufficientItems: Array<{ product_type: string; product_id: number; requested: number; available: number }> = [];

  for (const item of orderItems) {
    const tableName = getTableName(item.product_type);
    
    const { data: product, error } = await supabase
      .from(tableName)
      .select('stock_count')
      .eq('id', item.product_id)
      .single();

    if (error || !product) {
      insufficientItems.push({
        product_type: item.product_type,
        product_id: item.product_id,
        requested: item.quantity,
        available: 0
      });
      continue;
    }

    if (product.stock_count < item.quantity) {
      insufficientItems.push({
        product_type: item.product_type,
        product_id: item.product_id,
        requested: item.quantity,
        available: product.stock_count
      });
    }
  }

  return {
    available: insufficientItems.length === 0,
    insufficientItems
  };
}

/**
 * Reduce stock when order is confirmed
 */
export async function reduceStock(orderItems: OrderItem[]): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = createServerSupabaseClient();

  try {
    // First check if stock is available
    const stockCheck = await checkStockAvailability(orderItems);
    if (!stockCheck.available) {
      return {
        success: false,
        error: `Insufficient stock for some items: ${stockCheck.insufficientItems.map(i => `${i.product_type} #${i.product_id} (need ${i.requested}, have ${i.available})`).join(', ')}`
      };
    }

    // Reduce stock for each item
    for (const item of orderItems) {
      const tableName = getTableName(item.product_type);
      
      const { error } = await supabase.rpc('reduce_stock', {
        table_name: tableName,
        product_id: item.product_id,
        quantity: item.quantity
      });

      // If RPC doesn't exist, use direct update with raw SQL
      if (error?.code === '42883') {
        // First get current stock
        const { data: product } = await supabase
          .from(tableName)
          .select('stock_count')
          .eq('id', item.product_id)
          .single();

        if (product) {
          const newStock = product.stock_count - item.quantity;
          const { error: updateError } = await supabase
            .from(tableName)
            .update({ stock_count: newStock })
            .eq('id', item.product_id);

          if (updateError) {
            console.error(`Error reducing stock for ${tableName} #${item.product_id}:`, updateError);
            return { success: false, error: updateError.message };
          }
        }
      } else if (error) {
        console.error(`Error reducing stock for ${tableName} #${item.product_id}:`, error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in reduceStock:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Return stock when order is cancelled
 */
export async function returnStock(orderItems: OrderItem[]): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = createServerSupabaseClient();

  try {
    // Return stock for each item
    for (const item of orderItems) {
      const tableName = getTableName(item.product_type);
      
      const { error } = await supabase.rpc('return_stock', {
        table_name: tableName,
        product_id: item.product_id,
        quantity: item.quantity
      });

      // If RPC doesn't exist, use direct update with raw SQL
      if (error?.code === '42883') {
        // First get current stock
        const { data: product } = await supabase
          .from(tableName)
          .select('stock_count')
          .eq('id', item.product_id)
          .single();

        if (product) {
          const newStock = product.stock_count + item.quantity;
          const { error: updateError } = await supabase
            .from(tableName)
            .update({ stock_count: newStock })
            .eq('id', item.product_id);

          if (updateError) {
            console.error(`Error returning stock for ${tableName} #${item.product_id}:`, updateError);
            return { success: false, error: updateError.message };
          }
        }
      } else if (error) {
        console.error(`Error returning stock for ${tableName} #${item.product_id}:`, error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in returnStock:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get table name from product type
 */
function getTableName(productType: string): string {
  switch (productType) {
    case 'figure':
      return 'figures';
    case 'manga':
      return 'manga';
    case 'plushie':
      return 'plushies';
    default:
      throw new Error(`Invalid product type: ${productType}`);
  }
}
