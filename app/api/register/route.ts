import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation';
import { calculateOrder, generateOrderCode, validateOrderProducts } from '@/lib/order';
import {
  appendOrder,
  appendOrderItems,
  formatTimestamp,
} from '@/lib/google-sheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.',
        },
        { status: 400 }
      );
    }

    const { customer, items } = parsed.data;

    const productCheck = validateOrderProducts(items);
    if (!productCheck.valid) {
      return NextResponse.json(
        { success: false, message: productCheck.error },
        { status: 400 }
      );
    }

    const order = calculateOrder(items);
    const orderCode = generateOrderCode();
    const createdAt = formatTimestamp();

    try {
      await appendOrder({
        orderCode,
        createdAt,
        customerName: customer.name,
        phone: customer.phone,
        email: customer.email ?? '',
        company: customer.company ?? '',
        address: customer.address ?? '',
        note: customer.note ?? '',
        totalAmount: order.totalAmount,
        status: 'NEW',
      });

      await appendOrderItems(
        order.items.map((line) => ({
          orderCode,
          productId: line.product.id,
          productName: line.product.name,
          productCode: line.product.code,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          totalPrice: line.totalPrice,
        }))
      );
    } catch (sheetError) {
      console.error('[register] Google Sheets write failed:', sheetError);
      return NextResponse.json(
        { success: false, message: 'Không thể lưu đăng ký. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, orderCode });
  } catch (error) {
    console.error('[register] Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể đăng ký. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
